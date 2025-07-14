import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CredentialsService } from '../../core/services/credentials/credentials.service';
import {
  ClearCredentials,
  DeleteCredentials,
  GetCredentialsByUserId,
  PatchCredentials,
  PostCredentials,
} from './credentials.actions';
import { IGetCredentialsByUserIDResponse } from '../../core/interfaces/credentials.interface';
import { AuthState } from '../auth/auth.state';

export interface CredentialsStateModel {
  succesCredentials: any | null;
  loading: boolean;
  error: string | null;
  credentials: IGetCredentialsByUserIDResponse[];
  patchSuccess: boolean | null;
}

const defaults: CredentialsStateModel = {
  succesCredentials: null,
  loading: false,
  error: null,
  credentials: [],
  patchSuccess: null,
};

@State<CredentialsStateModel>({
  name: 'credentials',
  defaults,
})

@Injectable()
export class CredentialsState {
  constructor(private credentialsService: CredentialsService, private store: Store) {}

  @Selector()
  static getSuccessCredentials(state: CredentialsStateModel) {
    return state.succesCredentials;
  }

  @Selector()
  static isLoading(state: CredentialsStateModel): boolean {
    return state.loading || false;
  }

  @Selector()
  static getError(state: CredentialsStateModel) {
    return state.error;
  }

  @Selector()
  static getCredentialsByUserId(state: CredentialsStateModel): IGetCredentialsByUserIDResponse[] {
    return state.credentials;
  }

  @Selector()
  static getPatchSuccess(state: CredentialsStateModel) {
    return state.patchSuccess;
  }

  @Action(PostCredentials)
  postCredentials(ctx: StateContext<CredentialsStateModel>, action: PostCredentials) {
    ctx.patchState({ loading: true, error: null });

    return this.credentialsService.postCredentials(action.payload).pipe(
      tap(() => {
        ctx.patchState({
          succesCredentials: true,
          loading: false,
        });
        const user = this.store.selectSnapshot(AuthState.user);
        if (user) {
          ctx.dispatch(new GetCredentialsByUserId({ user_id: user.user_id }));
        }
      }),
      catchError((error) => {
        ctx.patchState({
          error: error.error.message,
          loading: false,
        });
        return throwError(() => error);
      }),
    );
  }

  @Action(ClearCredentials)
  clearCredentials(ctx: StateContext<CredentialsStateModel>) {
    ctx.patchState({
      succesCredentials: false,
      loading: false,
      error: null,
      patchSuccess: null,
    });
  }

  @Action(GetCredentialsByUserId)
  getCredentialsByUserId(ctx: StateContext<CredentialsStateModel>, action: GetCredentialsByUserId) {
    ctx.patchState({ loading: true, error: null });
    return this.credentialsService.getCredentialsByUserId(action.payload).pipe(
      tap((credentials) => {
        ctx.patchState({ credentials, loading: false });
      }),
      catchError((error) => {
        ctx.patchState({ error: error.error.message, loading: false });
        return throwError(() => error);
      }),
    );
  }

  @Action(PatchCredentials)
  patchCredentials(ctx: StateContext<CredentialsStateModel>, action: PatchCredentials) {
    ctx.patchState({ loading: true, error: null });
    return this.credentialsService.patchCredentials(action.payload).pipe(
      tap(() => {
        ctx.patchState({ patchSuccess: true, loading: false });
        const user = this.store.selectSnapshot(AuthState.user);
        if (user) {
          ctx.dispatch(new GetCredentialsByUserId({ user_id: user.user_id }));
        }
      }),
      catchError((error) => {
        ctx.patchState({ error: error.error.message, loading: false });
        return throwError(() => error);
      }),
    );
  }

  @Action(DeleteCredentials)
  deleteCredentials(ctx: StateContext<CredentialsStateModel>, action: DeleteCredentials) {
    ctx.patchState({ loading: true, error: null });
    return this.credentialsService.deleteCredentials(action.payload).pipe(
      tap(() => {
        ctx.patchState({ loading: false });
        const user = this.store.selectSnapshot(AuthState.user);
        if (user) {
          ctx.dispatch(new GetCredentialsByUserId({ user_id: user.user_id }));
        }
      }),
      catchError((error) => {
        ctx.patchState({ error: error.error.message, loading: false });
        return throwError(() => error);
      }),
    );
  }
}
