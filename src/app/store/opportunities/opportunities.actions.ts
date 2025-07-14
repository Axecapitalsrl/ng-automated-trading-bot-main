import { IGetOportonitiesRequest } from '../../core/interfaces/opportunities.interface';

export class GetOpportunities {
  constructor(public payload: IGetOportonitiesRequest) {}
  static readonly type = '[Opportunities] Get Opportunities';
}

export class ClearOpportunities {
  static readonly type = '[Opportunities] Clear Opportunities';
}
