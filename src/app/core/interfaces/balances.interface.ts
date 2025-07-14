export interface IGetBalancesByUserIDResponse {
  userId:    string;
  exchanges: Exchanges;
}

export interface Exchanges {
  binance: Binance;
  bitget:  Bitget;
}

export interface Binance {
  success: boolean;
  data:    BinanceDatum[];
}

export interface BinanceDatum {
  credential_id: string;
  api_key:       string;
  balances:      PurpleBalances;
}

export interface PurpleBalances {
  spot:    SpotElement[];
  futures: any[];
  funding: any[];
}

export interface SpotElement {
  asset:  string;
  free:   string;
  locked: string;
}

export interface Bitget {
  success: boolean;
  data:    BitgetDatum[];
}

export interface BitgetDatum {
  credential_id: string;
  api_key:       string;
  balances:      FluffyBalances;
}

export interface FluffyBalances {
  success:   boolean;
  data:      Data;
  timestamp: Date;
}

export interface Data {
  spot:         DataSpot;
  futures_usdt: FuturesUsdt;
}

export interface FuturesUsdt {
  success:   boolean;
  data:      FuturesUsdtDatum[];
  timestamp: Date;
}

export interface FuturesUsdtDatum {
  marginCoin:           string;
  locked:               string;
  available:            string;
  crossedMaxAvailable:  string;
  isolatedMaxAvailable: string;
  maxTransferOut:       string;
  accountEquity:        string;
  usdtEquity:           string;
  btcEquity:            string;
  crossedRiskRate:      string;
  unrealizedPL:         string;
  coupon:               string;
  crossedUnrealizedPL:  string;
  isolatedUnrealizedPL: string;
  grant:                string;
  unionTotalMargin:     string;
  unionAvailable:       string;
  unionMm:              string;
  assetList:            any[];
  assetMode:            string;
  isolatedMargin:       string;
  crossedMargin:        string;
}

export interface DataSpot {
  success:   boolean;
  data:      SpotDatum[];
  timestamp: Date;
}

export interface SpotDatum {
  coin:           string;
  available:      string;
  limitAvailable: string;
  frozen:         string;
  locked:         string;
  uTime:          string;
}
