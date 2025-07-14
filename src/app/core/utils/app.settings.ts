import { Injectable } from '@angular/core';
import { EndPoint } from '../models/app.endpoint';

@Injectable({
  providedIn: 'root',
})

export class AppSettings {
  public auth = {
    urls: {
      postLogin: EndPoint.urlBase('auth/login'),
      postRegister: EndPoint.urlBase('users'),
      resetPassword: EndPoint.urlBase('auth/recover-password'),
      requestRecovery: EndPoint.urlBase('auth/request-password-recovery'),
      
    },
  };

  public balances = {
    urls: {
      getBalancesByUserId: EndPoint.urlBase('balances/user/'),
    },
  };

  public bots = {
    urls: {
      getBotsByUserId: EndPoint.urlBase('users-bots/user/'),
      postCreateBot: EndPoint.urlBase('users-bots'),
    },
  };

  public operations = {
    urls: {
      getOperationsByUserId: EndPoint.urlBase('operations/user/'),
    },
  };

  public credentials = {
    urls: {
      postCredentials: EndPoint.urlBase('credentials'),
      getCredentialsByUserId: EndPoint.urlBase('credentials'),
    },
  };

  public botTypes = {
    urls: {
      getBotTypes: EndPoint.urlBase('bots-types'),
    },
  };

  public opportunities = {
    urls: {
      getOpportunities: EndPoint.urlBase('opportunities'),
    },
  };

  public exchanges = {
    urls: {
      getExchanges: EndPoint.urlBase('exchanges'),
    },
  };

  public operationsStats = {
    urls: {
      getOperationsStats: EndPoint.urlBase('operations/stats'),
    },
  };


  public app = {
    name: 'Angular Bot',
    version: '0.0.0',
    prodVersion: '0.0.0',
  };
}
