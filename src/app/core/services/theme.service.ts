import { Injectable, signal } from '@angular/core';
import { Theme } from '../models/theme.model';
import { effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public theme = signal<Theme>({ mode: 'dark', color: 'blue', direction: 'ltr' });

  constructor() {
    this.loadTheme();
    effect(() => {
      this.setConfig();
    });
  }

  private loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.theme.set(JSON.parse(theme));
    }
  }

  private setConfig() {
    this.setLocalStorage();
    this.setThemeClass();
    this.setRTL();
  }

  public get isDark(): boolean {
    return this.theme().mode == 'dark';
  }

  private setThemeClass() {
    const html = document.querySelector('html')!;
    html.className = this.theme().mode;
    html.setAttribute('data-theme', this.theme().color);

    // Cambia la variable CSS del filtro del icono del calendario
    if (this.theme().mode === 'dark') {
      html.style.setProperty('--calendar-icon-filter', 'invert(1)');
    } else {
      html.style.setProperty('--calendar-icon-filter', 'none');
    }
  }

  private setLocalStorage() {
    localStorage.setItem('theme', JSON.stringify(this.theme()));
  }

  private setRTL() {
    document.querySelector('html')!.setAttribute('dir', this.theme().direction);
    this.setLocalStorage();
  }
}
