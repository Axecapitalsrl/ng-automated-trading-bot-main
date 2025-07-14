import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { PostCredentials, ClearCredentials, PatchCredentials } from '../../../../store/credentials/credentials.actions';
import { CredentialsState } from '../../../../store/credentials/credentials.state';
import { ToastrService } from 'ngx-toastr';
import { IGetCredentialsByUserIDResponse } from '../../../../core/interfaces/credentials.interface';
import { ExchangesState } from '../../../../store/exchanges/exchanges.state';
import { IExchangeResponse } from '../../../../core/interfaces/exchange.interface';
import { GetExchangesAction } from '../../../../store/exchanges/exchanges.actions';

@Component({
  selector: 'app-credentials-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './credentials-modal.component.html',
  styleUrls: ['./credentials-modal.component.scss'],
})

export class CredentialsModalComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() close = new EventEmitter<void>();
  @Input() credentialToEdit: IGetCredentialsByUserIDResponse | null = null;

  user$ = this.store.select(AuthState.user);
  loading$ = this.store.select(CredentialsState.isLoading);

  succesCredentials$ = this.store.select(CredentialsState.getSuccessCredentials);
  error$ = this.store.select(CredentialsState.getError);

  patchSuccess$ = this.store.select(CredentialsState.getPatchSuccess);

  exchanges$ = this.store.select(ExchangesState.getExchanges);
  exchanges: IExchangeResponse[] = [];

  credentialsForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store, private readonly toastr: ToastrService) {
    this.credentialsForm = this.fb.group({
      id: [''],
      user_id: ['', Validators.required],
      cex_id: ['binance', Validators.required],
      api_key: ['', Validators.required],
      secret_key: ['', Validators.required],
      passphrase: [''],
    });
    this.store.dispatch(new GetExchangesAction());
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.credentialsForm.valid) {
      if (this.credentialToEdit?.user_id) {
        this.store.dispatch(new PatchCredentials(this.credentialsForm.value));
      } else {
        this.store.dispatch(new PostCredentials(this.credentialsForm.value));
      }
    }
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.credentialsForm.patchValue({
          user_id: user.user_id,
        });
      }
    });

    this.succesCredentials$.pipe(takeUntil(this.destroy$)).subscribe((succesCredentials) => {
      if (succesCredentials) {
        this.toastr.success('Credenciales configuradas exitosamente');
        this.closeModal();
      }
    });

    this.patchSuccess$.pipe(takeUntil(this.destroy$)).subscribe((patchSuccess) => {
      if (patchSuccess) {
        this.toastr.success('Credenciales actualizadas exitosamente');
        this.closeModal();
      }
    });

    this.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      if (error) {
        this.toastr.error(error || 'Ha ocurrido un error al guardar las credenciales');
      }
    });

    this.exchanges$.pipe(takeUntil(this.destroy$)).subscribe((exchanges) => {
      if (exchanges) {
        this.exchanges = exchanges;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['credentialToEdit'] && this.credentialToEdit) {
      this.credentialsForm.patchValue({
        id: this.credentialToEdit.credential_id,
        user_id: this.credentialToEdit.user_id,
        cex_id: this.credentialToEdit.cex_id,
        api_key: '****' + this.credentialToEdit.api_key.slice(-4),
        secret_key: '****' + this.credentialToEdit.secret_key.slice(-4),
        passphrase: this.credentialToEdit.passphrase,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new ClearCredentials());
  }
}
