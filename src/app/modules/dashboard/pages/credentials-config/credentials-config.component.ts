import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsModalComponent } from '../../components/credentials-modal/credentials-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { GetCredentialsByUserId, DeleteCredentials } from '../../../../store/credentials/credentials.actions';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { CredentialsState } from '../../../../store/credentials/credentials.state';
import { IGetCredentialsByUserIDResponse } from '../../../../core/interfaces/credentials.interface';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaskPipe } from '../../../../shared/pipes/mask.pipe';

@Component({
  selector: 'app-credentials-config',
  standalone: true,
  imports: [CommonModule, CredentialsModalComponent, ButtonComponent, MaskPipe],
  templateUrl: './credentials-config.component.html',
})
export class CredentialsConfigComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showModal = false;
  credentialToEdit: IGetCredentialsByUserIDResponse | null = null;
  constructor(private store: Store) {}

  user$ = this.store.select(AuthState.user);
  credentials$ = this.store.select(CredentialsState.getCredentialsByUserId);
  loading$ = this.store.select(CredentialsState.isLoading);
  error$ = this.store.select(CredentialsState.getError);

  credentials: IGetCredentialsByUserIDResponse[] = [];

  openModal(credential: IGetCredentialsByUserIDResponse | null) {
    this.showModal = true;
    this.credentialToEdit = credential;
  }

  closeModal() {
    this.showModal = false;
  }

  handleSave(credentials: any) {
    this.closeModal();
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.store.dispatch(new GetCredentialsByUserId({ user_id: user.user_id }));
      }
    });

    this.credentials$.pipe(takeUntil(this.destroy$)).subscribe((credentials) => {
      this.credentials = credentials;
    });
  }

  deleteCredential(id: string) {
    this.store.dispatch(new DeleteCredentials(id));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
