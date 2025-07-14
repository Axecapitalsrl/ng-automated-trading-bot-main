import { IGetOperationsRequest } from '../../core/interfaces/operation.interface';

export class GetOperationsByUserId {
  static readonly type = '[Operations] Get Operations By User ID';
  constructor(public request: IGetOperationsRequest) {}
}

export class ClearOperations {
  static readonly type = '[Operations] Clear Operations';
}

export class GetOperationsStats {
  static readonly type = '[Operations] Get Operations Stats';
}