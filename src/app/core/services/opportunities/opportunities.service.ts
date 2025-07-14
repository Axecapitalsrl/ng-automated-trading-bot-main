import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../utils/app.settings';
import { IGetOportonitiesResponse, IGetOportonitiesRequest } from '../../interfaces/opportunities.interface';

@Injectable({
  providedIn: 'root',
})

export class OpportunitiesService {
  constructor(private http: HttpClient, private appSettings: AppSettings) {}

  getOpportunities(request: IGetOportonitiesRequest): Observable<IGetOportonitiesResponse> {
    const url = this.appSettings.opportunities.urls.getOpportunities;
    const params: Record<string, string> = {
      page: request.page.toString(),
      limit: request.limit.toString(),
    };

    if (request.bot_type_id) {
      params['bot_type_id'] = request.bot_type_id;
    }

    if (request.cex_id) {
      params['cex_id'] = request.cex_id.toLowerCase();
    }

    if (request.start_date) {
      params['start_date'] = request.start_date;
    }

    return this.http.get<IGetOportonitiesResponse>(url, { params });
  }
}
