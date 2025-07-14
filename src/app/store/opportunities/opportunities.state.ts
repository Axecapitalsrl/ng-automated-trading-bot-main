import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OpportunitiesService } from '../../core/services/opportunities/opportunities.service';
import { IGetOportonitiesResponse } from '../../core/interfaces/opportunities.interface';
import { ClearOpportunities, GetOpportunities } from './opportunities.actions';

export interface OpportunitiesStateModel {
  opportunities: IGetOportonitiesResponse | null;
  loading: boolean;
  error: string | null;
}

const defaults: OpportunitiesStateModel = {
  opportunities: null,
  loading: false,
  error: null,
};

@State<OpportunitiesStateModel>({
  name: 'opportunities',
  defaults,
})
@Injectable()
export class OpportunitiesState {
  constructor(private opportunitiesService: OpportunitiesService) {}

  @Selector()
  static getOpportunities(state: OpportunitiesStateModel) {
    return state.opportunities;
  }

  @Selector()
  static isLoading(state: OpportunitiesStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: OpportunitiesStateModel) {
    return state.error;
  }

  @Action(GetOpportunities)
  getOpportunities(ctx: StateContext<OpportunitiesStateModel>, action: GetOpportunities) {
    ctx.patchState({ loading: true, error: null });

    return this.opportunitiesService.getOpportunities(action.payload).pipe(
      tap((response) => {
        ctx.patchState({
          opportunities: response,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          error: error.message,
          loading: false,
        });
        return throwError(() => error);
      }),
    );
  }

  @Action(ClearOpportunities)
  clearOpportunities(ctx: StateContext<OpportunitiesStateModel>) {
    ctx.patchState({
      opportunities: null,
      loading: false,
      error: null,
    });
  }
}
