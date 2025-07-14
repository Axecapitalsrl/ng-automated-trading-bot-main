import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../../utils/app.settings';
import {
  IPayloadLogin,
  IPayloadRegister,
  IPayloadResetRecovery,
  IResponseLogin,
  IResponseRegister,
  IResponseRequestPasswordRecovery,
} from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpClient, private appSettings: AppSettings) {}

  postLlogin(payload: IPayloadLogin): Observable<IResponseLogin> {
    return this.http.post<IResponseLogin>(this.appSettings.auth.urls.postLogin, payload);
  }

  postRegister(payload: IPayloadRegister): Observable<IResponseRegister> {
    return this.http.post<IResponseRegister>(this.appSettings.auth.urls.postRegister, payload);
  }

  postResetRecovery(payload: IPayloadResetRecovery): Observable<any> {
    return this.http.post<any>(this.appSettings.auth.urls.requestRecovery, payload);
  }

  postResetPassword(payload: IResponseRequestPasswordRecovery): Observable<any> {
    return this.http.post<any>(this.appSettings.auth.urls.resetPassword, payload);
  }
}
