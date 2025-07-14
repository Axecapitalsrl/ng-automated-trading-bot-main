import { NgClass, NgIf, AsyncPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Store } from '@ngxs/store';
import { ClearError, ClearSuccessRegister, Login } from '../../../../store/auth/auth.actions';
import { Subject, takeUntil } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgIf, ButtonComponent, NgClass, AsyncPipe],
})
export class SignInComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;

  loading$ = this.store.select(AuthState.loading);
  error$ = this.store.select(AuthState.error);
  token$ = this.store.select(AuthState.token);

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly store: Store,
  ) {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.token$.pipe(takeUntil(this.destroy$)).subscribe((token) => {
      if (token) {
        this._router.navigate(['/']);
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.value;
    this.store.dispatch(new Login({ email, password }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new ClearSuccessRegister());
    this.store.dispatch(new ClearError());
  }
}
