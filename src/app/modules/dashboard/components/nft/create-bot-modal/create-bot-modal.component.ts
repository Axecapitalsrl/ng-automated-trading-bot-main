import { Component, EventEmitter, Output, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IGetBotTypesResponse } from '../../../../../core/interfaces/bot-types.interface';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../../../store/auth/auth.state';
import { CredentialsState } from '../../../../../store/credentials/credentials.state';
import { GetCredentialsByUserId } from '../../../../../store/credentials/credentials.actions';
import { IGetCredentialsByUserIDResponse } from '../../../../../core/interfaces/credentials.interface';
import { BotTypesState } from '../../../../../store/bot-types/bot-types.state';
import { GetBotTypes } from '../../../../../store/bot-types/bot-types.actions';
import { BotsState } from '../../../../../store/bots/bots.state';
import { ToastrService } from 'ngx-toastr';
import { ClearSuccessCreateBot, CreateBot, UpdateBot } from '../../../../../store/bots/bots.actions';
import { IGetUserBots } from '../../../../../core/interfaces/bot.interface';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AngularSvgIconModule],
})

export class CreateBotModalComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() bot?: IGetUserBots;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<any>();

  isEditMode = false;
  submitted = false;
  createBotForm: FormGroup;
  botTypes: IGetBotTypesResponse[] = [];
  credentials: IGetCredentialsByUserIDResponse[] = [];
  isOLBot = false;

  botTypes$ = this.store.select(BotTypesState.getBotTypes);
  loading$ = this.store.select(BotTypesState.isLoading);
  error$ = this.store.select(BotTypesState.getError);

  user$ = this.store.select(AuthState.user);
  credentials$ = this.store.select(CredentialsState.getCredentialsByUserId);

  successCreateBot$ = this.store.select(BotsState.getSuccessCreateBot);
  successUpdateBot$ = this.store.select(BotsState.getSuccessUpdateBot);
  errorBot$ = this.store.select(BotsState.getError);

  constructor(private fb: FormBuilder, private store: Store, private toastr: ToastrService) {
    this.createBotForm = this.fb.group({
      user_bot_id: [null],
      bot_type_id: ['', Validators.required],
      credential_id: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(20)]],
      amount_min: [null, [Validators.required, Validators.min(20)]],
      amount_max: [null, [Validators.required, Validators.min(20)]],
      stop_loss: [null, [Validators.min(1), Validators.max(100)]],
      currencies: ['USDT'],
      user_id: ['', Validators.required],
      status: ['ACTIVE'],
    });
    this.subscribeForBotTypes();
    this.store.dispatch(new GetBotTypes());
  }

  subscribeForBotTypes() {
    this.createBotForm
      .get('bot_type_id')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((botTypeId) => {
        if (botTypeId) {
          const user = this.createBotForm.get('user_id')?.value;
          this.store.dispatch(new GetCredentialsByUserId({ user_id: user, bot_type_id: botTypeId }));
        }
      });
  }

  ngOnInit() {
    this.botTypes$.pipe(takeUntil(this.destroy$)).subscribe((botTypes) => {
      this.botTypes = botTypes;
      if (this.isEditMode && this.bot) {
        this.createBotForm.patchValue({
          bot_type_id: this.bot.bot_type_id,
        });
        this.checkBotType(this.bot.bot_type_id);
      }
    });

    this.credentials$.pipe(takeUntil(this.destroy$)).subscribe((credentials) => {
      this.credentials = credentials;
      if (this.isEditMode && this.bot) {
        this.createBotForm.patchValue({
          credential_id: this.bot.credential_id,
        });
      }
    });

    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.createBotForm.patchValue({ user_id: user.user_id });
      }
    });

    this.successCreateBot$.pipe(takeUntil(this.destroy$)).subscribe((successCreateBot) => {
      if (successCreateBot) {
        this.toastr.success('Bot creado exitosamente');
        this.closeModal();
      }
    });

    this.successUpdateBot$.pipe(takeUntil(this.destroy$)).subscribe((successUpdateBot) => {
      if (successUpdateBot) {
        this.toastr.success('Bot actualizado exitosamente');
        this.closeModal();
      }
    });

    this.errorBot$.pipe(takeUntil(this.destroy$)).subscribe((errorBot) => {
      if (errorBot) {
        this.toastr.error(errorBot);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bot'] && changes['bot'].currentValue) {
      setTimeout(() => {
        this.isEditMode = !!this.bot?.user_bot_id;

        if (this.botTypes.length > 0) {
          const selectedBot = this.botTypes.find((type) => type.bot_type_id === this.bot?.bot_type_id);

          this.isOLBot = selectedBot?.name === 'Arbitrage Triangular OL' || selectedBot?.name === 'Arbitrage Triangular OL Bitget';
        }

        this.createBotForm.patchValue({
          user_bot_id: this.bot?.user_bot_id,
          bot_type_id: this.bot?.bot_type_id,
          credential_id: this.bot?.credential_id,
          amount: this.bot?.amount,
          amount_min: this.bot?.amount_min,
          amount_max: this.bot?.amount_max,
          stop_loss: this.bot?.stop_loss,
          currencies: this.bot?.currencies,
          user_id: this.bot?.user_id,
          status: this.bot?.status || 'ACTIVE',
        });

        if (this.isOLBot) {
          this.createBotForm.get('amount')?.clearValidators();
          this.createBotForm.get('amount_min')?.setValidators([Validators.required, Validators.min(20)]);
          this.createBotForm.get('amount_max')?.setValidators([Validators.required, Validators.min(20)]);
          this.createBotForm
            .get('stop_loss')
            ?.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
        } else {
          this.createBotForm.get('amount')?.setValidators([Validators.required, Validators.min(20)]);
          this.createBotForm.get('amount_min')?.clearValidators();
          this.createBotForm.get('amount_max')?.clearValidators();
          this.createBotForm.get('stop_loss')?.clearValidators();
        }

        this.createBotForm.get('amount')?.updateValueAndValidity();
        this.createBotForm.get('amount_min')?.updateValueAndValidity();
        this.createBotForm.get('amount_max')?.updateValueAndValidity();
        this.createBotForm.get('stop_loss')?.updateValueAndValidity();
      }, 100);
    }
  }

  toggleStatus() {
    const currentStatus = this.createBotForm.get('status')?.value;
    this.createBotForm.patchValue({
      status: currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.createBotForm.valid) {
      const formValue = { ...this.createBotForm.value };

      if (!this.isOLBot) {
        delete formValue.amount_min;
        delete formValue.amount_max;
        delete formValue.stop_loss;
      } else {
        delete formValue.amount;
      }

      if (this.isEditMode) {
        this.store.dispatch(new UpdateBot(formValue));
      } else {
        delete formValue.user_bot_id;
        this.store.dispatch(new CreateBot(formValue));
      }
    }
  }

  closeModal() {
    this.createBotForm.reset();
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new ClearSuccessCreateBot());
  }

  onBotTypeChange(event: any) {
    const botTypeId = event.target.value;
    this.checkBotType(botTypeId);
  }

  checkBotType(botTypeId: string) {
    const selectedBot = this.botTypes.find((bot) => bot.bot_type_id === botTypeId);
    this.isOLBot = selectedBot?.name === 'Arbitrage Triangular OL' || selectedBot?.name === 'Arbitrage Triangular OL Bitget';

    if (this.isOLBot) {
      this.createBotForm.get('amount')?.clearValidators();
      this.createBotForm.get('amount_min')?.setValidators([Validators.required, Validators.min(20)]);
      this.createBotForm.get('amount_max')?.setValidators([Validators.required, Validators.min(20)]);
      this.createBotForm.get('stop_loss')?.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
    } else {
      this.createBotForm.get('amount')?.setValidators([Validators.required, Validators.min(20)]);
      this.createBotForm.get('amount_min')?.clearValidators();
      this.createBotForm.get('amount_max')?.clearValidators();
      this.createBotForm.get('stop_loss')?.clearValidators();
    }

    this.createBotForm.get('amount')?.updateValueAndValidity();
    this.createBotForm.get('amount_min')?.updateValueAndValidity();
    this.createBotForm.get('amount_max')?.updateValueAndValidity();
    this.createBotForm.get('stop_loss')?.updateValueAndValidity();
  }
}
