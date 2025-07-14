import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IGetBalancesByUserIDResponse } from '../../core/interfaces/balances.interface';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BalancesService } from '../../core/services/balances/balances.service';
import { ClearBalances, GetBalancesByUserId } from './balances.actions';
import { ToastrService } from 'ngx-toastr';
export interface BalancesStateModel {
  balances: IGetBalancesByUserIDResponse | null;
  loading: boolean;
  error: string | null;
}

const defaults: BalancesStateModel = {
  balances: null,
  loading: false,
  error: null,
};

@State<BalancesStateModel>({
  name: 'balances',
  defaults,
})
@Injectable()
export class BalancesState {
  constructor(private balancesService: BalancesService, private toastr: ToastrService) {}

  @Selector()
  static getBalances(state: BalancesStateModel) {
    return state.balances;
  }

  @Selector()
  static isLoading(state: BalancesStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: BalancesStateModel) {
    return state.error;
  }

  @Action(GetBalancesByUserId)
  getBalancesByUserId(ctx: StateContext<BalancesStateModel>, action: GetBalancesByUserId) {
    ctx.patchState({ loading: true, error: null });

    return this.balancesService.getBalancesByUserId(action.userId).pipe(
      tap((response) => {
        ctx.patchState({
          balances: response,
          loading: false,
        });
      }),
      catchError((error) => {
        this.toastr.error(error.error.message);
        ctx.patchState({
          loading: false,
        });
        return throwError(() => error);
      }),
    );
  }

  @Action(ClearBalances)
  clearBalances(ctx: StateContext<BalancesStateModel>) {
    ctx.patchState({
      balances: null,
      loading: false,
      error: null,
    });
  }
}
