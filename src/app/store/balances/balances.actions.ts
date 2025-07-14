export class GetBalancesByUserId {
  static readonly type = '[Balances] Get Balances By User ID';
  constructor(public userId: string) {}
}

export class ClearBalances {
  static readonly type = '[Balances] Clear Balances';
}
