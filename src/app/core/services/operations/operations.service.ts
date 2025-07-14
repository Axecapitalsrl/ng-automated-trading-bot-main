import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../utils/app.settings';
import { IOperationResponse, IGetOperationsRequest, IOperationsStats } from '../../interfaces/operation.interface';

@Injectable({
  providedIn: 'root',
})

export class OperationsService {
  constructor(private http: HttpClient, private appSettings: AppSettings) {}

  getOperationsByUserId(request: IGetOperationsRequest): Observable<IOperationResponse> {
    const url = `${this.appSettings.operations.urls.getOperationsByUserId}${request.userId}`;
    const params = {
      page: request.page.toString(),
      limit: request.limit.toString()
    };
    return this.http.get<IOperationResponse>(url, { params });
  }

  getOperationsStats(): Observable<IOperationsStats> {
    const url = this.appSettings.operationsStats.urls.getOperationsStats;
    return this.http.get<IOperationsStats>(url);
  } 
}
