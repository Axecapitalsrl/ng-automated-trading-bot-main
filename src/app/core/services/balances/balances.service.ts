import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../utils/app.settings';
import { IGetBalancesByUserIDResponse } from '../../interfaces/balances.interface';

@Injectable({
  providedIn: 'root'
})
export class BalancesService {
  private settings = new AppSettings();

  constructor(private http: HttpClient) {}

  getBalancesByUserId(userId: string): Observable<IGetBalancesByUserIDResponse> {
    const url = this.settings.balances.urls.getBalancesByUserId + userId;
    return this.http.get<IGetBalancesByUserIDResponse>(url);
  }
}
