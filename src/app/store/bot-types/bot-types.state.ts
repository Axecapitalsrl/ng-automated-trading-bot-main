import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { BotTypesService } from '../../core/services/bot-types/bot-types.service';
import { IGetBotTypesResponse } from '../../core/interfaces/bot-types.interface';
import { GetBotTypes } from './bot-types.actions';
import { ToastrService } from 'ngx-toastr';
export interface BotTypesStateModel {
  botTypes: IGetBotTypesResponse[];
  loading: boolean;
  error: string | null;
}

@State<BotTypesStateModel>({
  name: 'botTypes',
  defaults: {
    botTypes: [],
    loading: false,
    error: null
  }
})

@Injectable()
export class BotTypesState {
  constructor(private botTypesService: BotTypesService, private toastr: ToastrService) {}

  @Selector()
  static getBotTypes(state: BotTypesStateModel): IGetBotTypesResponse[] {
    return state.botTypes;
  }

  @Selector()
  static isLoading(state: BotTypesStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: BotTypesStateModel): string | null {
    return state.error;
  }

  @Action(GetBotTypes)
  getBotTypes(ctx: StateContext<BotTypesStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.botTypesService.getBotTypes().subscribe({
      next: (botTypes) => {
        ctx.patchState({ botTypes, loading: false });
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        ctx.patchState({ error: error.error.message, loading: false });
      }
    });
  }
}
