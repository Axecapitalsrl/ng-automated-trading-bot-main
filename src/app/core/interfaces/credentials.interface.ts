export interface IPayloadCredentials {
  id?: string;
  user_id: string;
  cex_id: string;
  api_key: string;
  secret_key: string;
  passphrase: string;
}

export interface IGetCredentialsByUserIDResponse {
  credential_id: string;
  user_id: string;
  cex_id: string;
  api_key: string;
  secret_key: string;
  passphrase: string;
  exchange: Exchange;
}

export interface Exchange {
  exchange_id: string;
  name: string;
  type: string;
}



export interface IPayloadGetCredentials {
  user_id: string;
  bot_type_id?: string;
}