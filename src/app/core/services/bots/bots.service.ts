import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../utils/app.settings';
import { ICreateBotRequest, IGetUserBots, IUpdateBotRequest } from '../../interfaces/bot.interface';

@Injectable({
  providedIn: 'root'
})

export class BotsService {
  private settings = new AppSettings();

  constructor(private http: HttpClient) {}

  getBotsByUserId(userId: string): Observable<IGetUserBots[]> {
    const url = this.settings.bots.urls.getBotsByUserId + userId;
    return this.http.get<IGetUserBots[]>(url);
  }

  postCreateBot(bot: ICreateBotRequest): Observable<ICreateBotRequest> {
    const url = this.settings.bots.urls.postCreateBot;
    return this.http.post<ICreateBotRequest>(url, bot);
  }

  patchUpdateBot(bot: IUpdateBotRequest): Observable<IUpdateBotRequest> {
    const url = this.settings.bots.urls.postCreateBot + '/' + bot.user_bot_id;
    bot.amount = Number(bot.amount);
    return this.http.patch<IUpdateBotRequest>(url, bot);
  }

  deleteBot(botId: string): Observable<IUpdateBotRequest> {
    const url = this.settings.bots.urls.postCreateBot + '/' + botId;
    return this.http.delete<IUpdateBotRequest>(url);
  }
}
