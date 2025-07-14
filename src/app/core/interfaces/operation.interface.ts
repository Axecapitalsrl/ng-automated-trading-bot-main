export interface IOperationResponse {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  data: IOperation[];
}

export interface IOperation {
  operation_id: string;
  user_bot_id: string;
  details: Details;
  created_at: Date;
  bot_type_id: string;
  userBot: UserBot;
  botType: BotType;
}

export interface BotType {
  bot_type_id: string;
  name: string;
  exchange_id: string;
}

export interface Details {
  botId: string;
  error: Error;
  userId: string;
  success: boolean;
  operation: Operation;
  result: Result;
}

export interface Result {
  results: ResultDetails[];
  finalAmount: number;
  profitAmount: number;
  executionTime: number;
  profitPercent: number;
  botExecutionTime: number;
  initialInvestment: number;
}

export interface ResultDetails {
  // pendiente
}

export interface Error {
  msg: string;
  code: number;
}

export interface Operation {
  id: string;
  age: number;
  fees: number;
  trade: Trade;
  profit: Profit;
  status: string;
  botType: string;
  template: string[];
  timestamp: number;
  executedAt: number;
  investment: number;
  executionTime: number;
}

export interface Profit {
  amount: number;
  percent: number;
}

export interface Trade {
  legs: Leg[];
  route: string;
  symbol: Symbol;
}

export interface Leg {
  method: string;
  result: Result;
  ticker: string;
  quantity: number;
}

export interface Result {
  spent: number;
  earned: number;
}

export interface Symbol {
  a: string;
  b: string;
  c: string;
}

export interface UserBot {
  user_bot_id: string;
  bot_type_id: string;
  credential_id: string;
  user_id: string;
  currencies: string;
  amount: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface IGetOperationsRequest {
  limit: number;
  page: number;
  userId: string;
  botTypeId?: string;
  exchangeId?: string;
  startDate?: string;
}

export interface IOperationsStats {
  totalOperations: number;
  winningOperations: number;
  effectiveness: number;
  totalInvestment: number;
  totalProfitAmount: number;
  realProfitPercent: number;
}
