import { environment } from '../../../environments/environment';

export class EndPoint {
  static url(resource: string) {
    return environment.apiUrl + resource;
  }

  static urlBase(resource: string) {
    return environment.baseUrl + resource;
  }

  static isProduction(): boolean {
    return environment.production;
  }
}
