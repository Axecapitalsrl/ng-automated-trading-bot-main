import { IPayloadCredentials, IPayloadGetCredentials } from '../../core/interfaces/credentials.interface';

export class PostCredentials {
  static readonly type = '[Credentials] Post Credentials';
  constructor(public payload: IPayloadCredentials) {}
}

export class GetCredentialsByUserId {
  static readonly type = '[Credentials] Get Credentials By User Id';
  constructor(public payload: IPayloadGetCredentials) {}
}

export class ClearCredentials {
  static readonly type = '[Credentials] Clear Credentials';
}

export class PatchCredentials {
  static readonly type = '[Credentials] Patch Credentials';
  constructor(public payload: IPayloadCredentials) {}
}

export class DeleteCredentials {
  static readonly type = '[Credentials] Delete Credentials';
  constructor(public payload: string) {}
}
