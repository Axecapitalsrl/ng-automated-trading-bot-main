import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../utils/app.settings';
import { IExchangeResponse } from '../../interfaces/exchange.interface';

@Injectable({
  providedIn: 'root',
})

export class ExchangesService {
  constructor(private http: HttpClient, private appSettings: AppSettings) {}

  getExchanges(): Observable<IExchangeResponse[]> {
    const url = `${this.appSettings.exchanges.urls.getExchanges}`;
    return this.http.get<IExchangeResponse[]>(url);
  }
}
