export interface IGetOportonitiesResponse {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  data: IGetOportonities[];
}

export interface IGetOportonities {
  oportunity_id: string;
  bot_type_id: string;
  details: Details;
  created_at: Date;
  botType: BotTypeClass;
}


export interface BotTypeClass {
  bot_type_id: string;
  name: string;
  exchange_id: string;
}


export interface Details {
  id: string;
  age: number;
  depth: Depth;
  trade: Trade;
  profit: Profit;
  botType: string;
  timestamp: number;
  investment: number;
}

export interface Depth {
  ab: number;
  bc: number;
  ca: number;
}

export interface Profit {
  percent: number;
  expected: number;
}

export interface Trade {
  legs: Leg[];
  route: string;
  symbol: Symbol;
}

export interface Leg {
  method: string;
  ticker: string;
  quantity: number;
}

export interface Symbol {
  a: string;
  b: string;
  c: string;
}

export interface IGetOportonitiesRequest {
  limit: number;
  page: number;
  bot_type_id?: string;
  cex_id?: string;
  start_date?: string;
}