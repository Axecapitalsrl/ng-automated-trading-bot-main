import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { ResetPassword, ResetPasswordSuccess } from 'src/app/store/auth/auth.actions';
import { AuthState } from 'src/app/store/auth/auth.state';
import { NgIf, NgClass, AsyncPipe, CommonModule } from '@angular/common';
import { PasswordSuccessComponent } from './password-success/password-success.component';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AngularSvgIconModule,
    ButtonComponent,
    ReactiveFormsModule,
    PasswordSuccessComponent,
  ],
  standalone: true,
})
export class NewPasswordComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  form: FormGroup = null!;
  submitted = false;
  token: string | null = null;
  passwordTextType = false;
  confirmPasswordTextType = false;

  loading$ = this.store.select(AuthState.loading);
  error$ = this.store.select(AuthState.error);
  passwordResetSuccess$ = this.store.select(AuthState.passwordResetSuccess);

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.router.navigate(['/auth/sign-in']);
      return;
    }
  }

  createForm() {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  get f() {
    return this.form.controls;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  toggleConfirmPasswordTextType() {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid || !this.token) {
      return;
    }

    const { password } = this.form.value;
    this.store.dispatch(new ResetPassword({ token: this.token, newPassword: password }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetPasswordSuccess());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
