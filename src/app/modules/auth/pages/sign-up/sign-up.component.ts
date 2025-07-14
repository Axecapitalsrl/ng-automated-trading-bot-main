import { NgClass, NgIf, AsyncPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Store } from '@ngxs/store';
import { ClearError, ClearSuccessRegister, Register } from '../../../../store/auth/auth.actions';
import { Subject, takeUntil } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AngularSvgIconModule,
    NgIf,
    ButtonComponent,
    NgClass,
    AsyncPipe,
  ],
})

export class SignUpComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  submitted = false;
  passwordTextType = false;
  confirmPasswordTextType = false;

  loading$ = this.store.select(AuthState.loading);
  error$ = this.store.select(AuthState.error);
  successRegister$ = this.store.select(AuthState.successRegister);

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly store: Store,
    private readonly toastr: ToastrService,
    private readonly http: HttpClient
  ) {
    this.form = this._formBuilder.group(
      {
        full_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]]
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  ngOnInit() {
    this.successRegister$.pipe(takeUntil(this.destroy$)).subscribe((successRegister) => {
      if (successRegister) {
        this.toastr.success('Tu cuenta ha sido creada correctamente', '¡Registro exitoso!', {
          timeOut: 5000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
        });
        this._router.navigate(['/']);
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  toggleConfirmPasswordTextType() {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const { full_name, email, password } = this.form.value;
    this.store.dispatch(new Register({ full_name, email, password }));
  }

  downloadTerms() {
    this.http.get('assets/pdf/terms.pdf', { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'terms.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new ClearSuccessRegister());
    this.store.dispatch(new ClearError());
  }
}
