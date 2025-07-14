import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { ResetRecovery } from 'src/app/store/auth/auth.actions';
import { AuthState } from 'src/app/store/auth/auth.state';
import { NgIf, NgClass, AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, ReactiveFormsModule, NgIf, NgClass, AsyncPipe],
  standalone: true,
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  form: FormGroup = null!;
  submitted = false;
  emailSent = false;

  loading$ = this.store.select(AuthState.loading);
  error$ = this.store.select(AuthState.error);

  constructor(private store: Store, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const { email } = this.form.value;
    this.store.dispatch(new ResetRecovery({ email })).subscribe({
      next: () => {
        this.emailSent = true;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
