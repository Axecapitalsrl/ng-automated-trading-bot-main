export interface IPayloadLogin {
  email: string;
  password: string;
}

export interface IPayloadRegister {
  full_name: string;
  email: string;
  password: string;
}

export interface IResponseLogin {
  access_token: string;
  user: IUser;
}

export interface IUser {
  user_id: string;
  full_name: string;
  email: string;
  status: string;
}

export interface IResponseRegister {
  user_id: string;
  full_name: string;
  email: string;
  status: string;
}

export interface IPayloadResetRecovery {
  email: string;
}

export interface IResponseRequestPasswordRecovery {
  token: string;
  newPassword: string;
}