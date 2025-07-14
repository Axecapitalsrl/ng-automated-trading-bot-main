export interface ICreateBotRequest {
  bot_type_id: string;
  credential_id: string;
  user_id: string;
  currencies: string;
  amount: number;
}

export interface IGetUserBots {
  user_bot_id: string;
  bot_type_id: string;
  credential_id: string;
  user_id: string;
  currencies: string;
  amount: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  user: User;
  credential: Credential;
  botType: BotType;
  operations: any[];
  amount_min: number;
  amount_max: number;
  stop_loss?: number;
}

export interface BotType {
  bot_type_id: string;
  name: string;
  exchange_id: string;
}

export interface Credential {
  credential_id: string;
  user_id: string;
  cex_id: string;
  api_key: string;
  secret_key: string;
  passphrase: string;
}

export interface User {
  user_id: string;
  password: string;
  full_name: string;
  email: string;
  status: string;
}

export interface IUpdateBotRequest {
  user_bot_id: string;
  currencies: string;
  amount: number;
}
