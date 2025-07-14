import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OperationsService } from '../../core/services/operations/operations.service';
import { ClearOperations, GetOperationsByUserId, GetOperationsStats } from './operations.actions';
import { IOperationResponse, IOperationsStats } from '../../core/interfaces/operation.interface';

export interface OperationsStateModel {
  operations: IOperationResponse | null;
  loading: boolean;
  error: string | null;
  operationsStats: IOperationsStats | null;
}

const defaults: OperationsStateModel = {
  operations: null,
  loading: false,
  error: null,
  operationsStats: null,
};

@State<OperationsStateModel>({
  name: 'operations',
  defaults,
})

@Injectable()
export class OperationsState {
  constructor(private operationsService: OperationsService) {}

  @Selector()
  static getOperations(state: OperationsStateModel): IOperationResponse | null {
    return state.operations;
  }

  @Selector()
  static isLoading(state: OperationsStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: OperationsStateModel) {
    return state.error;
  }

  @Selector()
  static getOperationsStats(state: OperationsStateModel): IOperationsStats | null {
    return state.operationsStats;
  }
  @Action(GetOperationsByUserId)
  getOperationsByUserId(ctx: StateContext<OperationsStateModel>, action: GetOperationsByUserId) {
    ctx.patchState({ loading: true, error: null });

    return this.operationsService.getOperationsByUserId(action.request).pipe(
      tap((response) => {
        ctx.patchState({
          operations: response,
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

  @Action(GetOperationsStats)
  getOperationsStats(ctx: StateContext<OperationsStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.operationsService.getOperationsStats().pipe(
      tap((response) => {
        ctx.patchState({
          operationsStats: response,
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

  @Action(ClearOperations)
  clearOperations(ctx: StateContext<OperationsStateModel>) {
    ctx.patchState({
      operations: null,
      loading: false,
      error: null,
    });
  }
}
