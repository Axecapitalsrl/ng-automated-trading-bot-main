import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AuthService } from '../../core/services/auth/auth.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { 
  Login, LoginSuccess, LoginFailure,
  Register, RegisterSuccess, RegisterFailure,
  Logout, SetToken, ClearToken, ClearSuccessRegister,
  ClearError, ResetRecovery, ResetPassword, ResetPasswordSuccess
} from './auth.actions';
import { IUser } from '../../core/interfaces/auth.interface';
import { ToastrService } from 'ngx-toastr';

export interface AuthStateModel {
  token: string | null;
  loading: boolean;
  error: any;
  user: IUser | null;
  successRegister: boolean;
  passwordResetSuccess: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
    loading: false,
    error: null,
    user: null,
    successRegister: false,
    passwordResetSuccess: false
  }
})

@Injectable()
export class AuthState {
  constructor(private authService: AuthService, private toastr: ToastrService) {}

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: AuthStateModel): any {
    return state.error;
  }

  @Selector()
  static successRegister(state: AuthStateModel): boolean {
    return state.successRegister;
  }

  @Selector()
  static user(state: AuthStateModel): IUser | null {
    return state.user;
  }

  @Selector()
  static passwordResetSuccess(state: AuthStateModel): boolean {
    return state.passwordResetSuccess;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({ loading: true, error: null });
    return this.authService.postLlogin(action.payload).pipe(
      tap((response) => {
        ctx.dispatch(new LoginSuccess(response));
      }),
      catchError((error) => {
        ctx.dispatch(new LoginFailure(error));
        return of(error);
      })
    );
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccess) {
    ctx.patchState({
      token: action.payload.access_token,
      loading: false,
      error: null,
      user: action.payload.user
    });
  }

  @Action(LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: LoginFailure) {
    this.toastr.error(action.error.error.message);
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    ctx.patchState({ loading: true, error: null });
    return this.authService.postRegister(action.payload).pipe(
      tap((response) => {
        ctx.dispatch(new RegisterSuccess(response));
      }),
      catchError((error) => {
        ctx.dispatch(new RegisterFailure(error));
        return of(error);
      })
    );
  }

  @Action(RegisterSuccess)
  registerSuccess(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      loading: false,
      error: null,
      successRegister: true
    });
  }

  @Action(RegisterFailure)
  registerFailure(ctx: StateContext<AuthStateModel>, action: RegisterFailure) {
    this.toastr.error(action.error.error.message);
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      token: null,
      loading: false,
      error: null,
      user: null
    });
    this.toastr.success('Sesión cerrada exitosamente');
  }

  @Action(SetToken)
  setToken(ctx: StateContext<AuthStateModel>, action: SetToken) {
    ctx.patchState({
      token: action.token
    });
  }

  @Action(ClearToken)
  clearToken(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      token: null
    });
  }

  @Action(ClearSuccessRegister)
  clearSuccessRegister(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      successRegister: false
    });
  }

  @Action(ClearError)
  clearError(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      error: null
    });
  }

  @Action(ResetRecovery)
  resetRecovery(ctx: StateContext<AuthStateModel>, action: ResetRecovery) {
    ctx.patchState({ loading: true, error: null });
    return this.authService.postResetRecovery(action.payload).pipe(
      tap(() => {
        this.toastr.success('Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña');
        ctx.patchState({ loading: false, error: null });
      }),
      catchError((error) => {
        this.toastr.error(error.error.message || 'Ha ocurrido un error al enviar el correo electrónico');
        ctx.patchState({ loading: false, error: error });
        return of(error);
      })
    );
  }

  @Action(ResetPassword)
  resetPassword(ctx: StateContext<AuthStateModel>, action: ResetPassword) {
    ctx.patchState({ loading: true, error: null, passwordResetSuccess: false });
    return this.authService.postResetPassword(action.payload).pipe(
      tap({
        next: (response) => {
          ctx.patchState({
            loading: false,
            passwordResetSuccess: true,
          });
          this.toastr.success('Contraseña restablecida exitosamente');
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'Ha ocurrido un error al restablecer la contraseña');
          ctx.patchState({ loading: false, error: error });
        },
      })
    );
  }

  @Action(ResetPasswordSuccess)
  resetPasswordSuccess(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      passwordResetSuccess: false,
    });
  }
}
