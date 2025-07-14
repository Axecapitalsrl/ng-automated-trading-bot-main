import {
  IPayloadLogin,
  IPayloadRegister,
  IPayloadResetRecovery,
  IResponseLogin,
  IResponseRegister,
  IResponseRequestPasswordRecovery,
} from '../../core/interfaces/auth.interface';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string; password: string }) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public payload: any) {}
}

export class LoginFailure {
  static readonly type = '[Auth] Login Failure';
  constructor(public error: any) {}
}

export class Register {
  static readonly type = '[Auth] Register';
  constructor(public payload: { email: string; password: string; full_name: string }) {}
}

export class RegisterSuccess {
  static readonly type = '[Auth] Register Success';
  constructor(public payload: any) {}
}

export class RegisterFailure {
  static readonly type = '[Auth] Register Failure';
  constructor(public error: any) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class SetToken {
  static readonly type = '[Auth] Set Token';
  constructor(public token: string) {}
}

export class ClearToken {
  static readonly type = '[Auth] Clear Token';
}

export class ClearSuccessRegister {
  static readonly type = '[Auth] Clear Success Register';
}

export class ClearError {
  static readonly type = '[Auth] Clear Error';
}

export class ResetRecovery {
  static readonly type = '[Auth] Reset Recovery';
  constructor(public payload: { email: string }) {}
}

export class ResetPassword {
  static readonly type = '[Auth] Reset Password';
  constructor(public payload: { token: string; newPassword: string }) {}
}

export class ResetPasswordSuccess {
  static readonly type = '[Auth] Reset Password Success';
}
