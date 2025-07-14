import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetBotTypesResponse } from '../../interfaces/bot-types.interface';
import { AppSettings } from '../../utils/app.settings';

@Injectable({
  providedIn: 'root',
})

export class BotTypesService {
  constructor(private http: HttpClient, private appSettings: AppSettings) {}

  getBotTypes(): Observable<IGetBotTypesResponse[]> {
    return this.http.get<IGetBotTypesResponse[]>(this.appSettings.botTypes.urls.getBotTypes);
  }
}
