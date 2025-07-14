import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../utils/app.settings';
import {
  IGetCredentialsByUserIDResponse,
  IPayloadCredentials,
  IPayloadGetCredentials,
} from '../../interfaces/credentials.interface';

@Injectable({
  providedIn: 'root',
})

export class CredentialsService {
  constructor(private http: HttpClient, private settings: AppSettings) {}

  postCredentials(payload: IPayloadCredentials): Observable<IGetCredentialsByUserIDResponse> {
    delete payload.id;
    return this.http.post<IGetCredentialsByUserIDResponse>(this.settings.credentials.urls.postCredentials, payload);
  }

  getCredentialsByUserId(payload: IPayloadGetCredentials): Observable<IGetCredentialsByUserIDResponse[]> {
    let params: any = { userId: payload.user_id };
    if (payload.bot_type_id) {
      params.bot_type_id = payload.bot_type_id;
    }
    return this.http.get<IGetCredentialsByUserIDResponse[]>(this.settings.credentials.urls.getCredentialsByUserId, {
      params: params,
    });
  }

  patchCredentials(payload: IPayloadCredentials): Observable<IGetCredentialsByUserIDResponse> {
    const url = `${this.settings.credentials.urls.postCredentials}/${payload.id}`;
    delete payload.id;
    return this.http.patch<IGetCredentialsByUserIDResponse>(url, payload);
  }

  deleteCredentials(id: string): Observable<IGetCredentialsByUserIDResponse> {
    const url = `${this.settings.credentials.urls.postCredentials}/${id}`;
    return this.http.delete<IGetCredentialsByUserIDResponse>(url);
  }
}
