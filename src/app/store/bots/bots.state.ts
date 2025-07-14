import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BotsService } from '../../core/services/bots/bots.service';
import { ClearBots, CreateBot, ClearSuccessCreateBot, GetBotsByUserId, UpdateBot, DeleteBot } from './bots.actions';
import { ToastrService } from 'ngx-toastr';
import { IGetUserBots } from '../../core/interfaces/bot.interface';

export interface BotsStateModel {
  bots: IGetUserBots[];
  loading: boolean;
  error: string | null;
  successCreateBot: boolean;
  successUpdateBot: boolean;
  successDeleteBot: boolean;
}

const defaults: BotsStateModel = {
  bots: [],
  loading: false,
  error: null,
  successCreateBot: false,
  successUpdateBot: false,
  successDeleteBot: false,
};

@State<BotsStateModel>({
  name: 'bots',
  defaults,
})
@Injectable()
export class BotsState {
  constructor(private botsService: BotsService, private toastr: ToastrService) {}

  @Selector()
  static getBots(state: BotsStateModel): IGetUserBots[] {
    return state.bots;
  }

  @Selector()
  static isLoading(state: BotsStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: BotsStateModel) {
    return state.error;
  }

  @Selector()
  static getSuccessCreateBot(state: BotsStateModel) {
    return state.successCreateBot;
  }

  @Selector()
  static getSuccessUpdateBot(state: BotsStateModel) {
    return state.successUpdateBot;
  }

  @Selector()
  static getSuccessDeleteBot(state: BotsStateModel) {
    return state.successDeleteBot;
  }

  @Action(GetBotsByUserId)
  getBotsByUserId(ctx: StateContext<BotsStateModel>, action: GetBotsByUserId) {
    ctx.patchState({ loading: true, error: null });

    return this.botsService.getBotsByUserId(action.userId).pipe(
      tap((response) => {
        ctx.patchState({
          bots: response,
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

  @Action(ClearBots)
  clearBots(ctx: StateContext<BotsStateModel>) {
    ctx.patchState({
      bots: [],
      loading: false,
      error: null,
    });
  }

  @Action(CreateBot)
  createBot(ctx: StateContext<BotsStateModel>, action: CreateBot) {
    return this.botsService.postCreateBot(action.bot).subscribe({
      next: () => {
        ctx.patchState({ successCreateBot: true, loading: false });
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        ctx.patchState({ successCreateBot: false, loading: false });
      },
    });
  }

  @Action(ClearSuccessCreateBot)
  clearSuccessCreateBot(ctx: StateContext<BotsStateModel>) {
    ctx.patchState({ successCreateBot: false, error: null, successUpdateBot: false, successDeleteBot: false });
  }

  @Action(UpdateBot)
  updateBot(ctx: StateContext<BotsStateModel>, action: UpdateBot) {
    return this.botsService.patchUpdateBot(action.bot).subscribe({
      next: () => {
        ctx.patchState({ successUpdateBot: true, loading: false });
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        ctx.patchState({ successUpdateBot: false, loading: false });
      },
    });
  }

  @Action(DeleteBot)
  deleteBot(ctx: StateContext<BotsStateModel>, action: DeleteBot) {
    return this.botsService.deleteBot(action.botId).subscribe({
      next: () => {
        this.toastr.success('Bot eliminado exitosamente');
        ctx.patchState({ loading: false, successDeleteBot: true });
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        ctx.patchState({ successDeleteBot: false, loading: false });
      },
    });
  }
}
