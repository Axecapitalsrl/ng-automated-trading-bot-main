import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ExchangesService } from '../../core/services/exchanges/exchanges.service';
import { GetExchangesAction } from './exchanges.actions';
import { IExchangeResponse } from '../../core/interfaces/exchange.interface';

export interface ExchangesStateModel {
  exchanges: IExchangeResponse[];
  loading: boolean;
  error: string | null;
}

const defaults: ExchangesStateModel = {
  exchanges: [],
  loading: false,
  error: null,
};

@State<ExchangesStateModel>({
  name: 'exchanges',
  defaults,
})

@Injectable()
export class ExchangesState {
  constructor(private exchangesService: ExchangesService) {}

  @Selector()
  static getExchanges(state: ExchangesStateModel): IExchangeResponse[] {
    return state.exchanges;
  }

  @Selector()
  static isLoading(state: ExchangesStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ExchangesStateModel) {
    return state.error;
  }

  @Action(GetExchangesAction)
  getExchanges(ctx: StateContext<ExchangesStateModel>, action: GetExchangesAction) {
    ctx.patchState({ loading: true, error: null });

    return this.exchangesService.getExchanges().pipe(
      tap((response) => {
        ctx.patchState({
          exchanges: response,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          error: error.message,
          loading: false,
        });
        return throwError(() => error);
      })
    );
  }
}
