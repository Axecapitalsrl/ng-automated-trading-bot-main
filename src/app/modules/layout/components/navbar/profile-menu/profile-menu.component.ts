import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { AuthState } from '../../../../../store/auth/auth.state';
import { Store } from '@ngxs/store';
import { IUser } from '../../../../../core/interfaces/auth.interface';
import { Subject, takeUntil } from 'rxjs';
import { Logout } from '../../../../../store/auth/auth.actions';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink, AngularSvgIconModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public isOpen = false;
  public profileMenu = [
    {
      title: 'Perfil',
      icon: './assets/icons/heroicons/outline/user-circle.svg',
      link: '/profile',
    },
    {
      title: 'Configuración',
      icon: './assets/icons/heroicons/outline/cog-6-tooth.svg',
      link: '/settings',
    },
    /*       {
        title: 'Cerrar sesión',
        icon: './assets/icons/heroicons/outline/logout.svg',
        link: '/auth',
      }, */
  ];

  public themeColors = [
    {
      name: 'base',
      code: '#e11d48',
    },
    {
      name: 'amarillo',
      code: '#f59e0b',
    },
    {
      name: 'verde',
      code: '#22c55e',
    },
    {
      name: 'azul',
      code: '#3b82f6',
    },
    {
      name: 'naranja',
      code: '#ea580c',
    },
    {
      name: 'rojo',
      code: '#cc0022',
    },
    {
      name: 'morado',
      code: '#6d28d9',
    },
  ];

  public themeMode = ['light', 'dark'];
  public themeDirection = ['ltr', 'rtl'];

  user$ = this.store.select(AuthState.user);
  user: IUser | null = null;

  constructor(public themeService: ThemeService, private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
    });
  }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    const isDark = this.themeService.isDark;
    const currentTheme = this.themeService.theme();
    this.themeService.theme.set({
      ...currentTheme,
      mode: isDark ? 'light' : 'dark',
    });
  }

  toggleThemeColor(color: string) {
    const currentTheme = this.themeService.theme();
    this.themeService.theme.set({
      ...currentTheme,
      color: color,
    });
    document.querySelector('html')?.setAttribute('data-theme', '#0155ff');
  }

  setDirection(value: string) {
    const currentTheme = this.themeService.theme();
    this.themeService.theme.set({
      ...currentTheme,
      direction: value,
    });
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
