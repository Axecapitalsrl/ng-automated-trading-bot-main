import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { AuthState } from './app/store/auth/auth.state';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/interceptor/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BalancesState } from './app/store/balances/balances.state';
import { BotsState } from './app/store/bots/bots.state';
import { OperationsState } from './app/store/operations/operations.state';
import { CredentialsState } from './app/store/credentials/credentials.state';
import { BotTypesState } from './app/store/bot-types/bot-types.state';
import { OpportunitiesState } from './app/store/opportunities/opportunities.state';
import { ExchangesState } from './app/store/exchanges/exchanges.state';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      NgxsModule.forRoot(
        [
          AuthState,
          BalancesState,
          BotsState,
          OperationsState,
          CredentialsState,
          BotTypesState,
          OpportunitiesState,
          ExchangesState,
        ],
        {
          developmentMode: !environment.production,
        },
      ),
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: environment.production,
      }),
      NgxsLoggerPluginModule.forRoot({
        disabled: environment.production,
      }),
      NgxsStoragePluginModule.forRoot({
        keys: ['auth'],
      }),
      ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        progressBar: true,
        closeButton: true,
        enableHtml: true,
        progressAnimation: 'decreasing',
        newestOnTop: true,
        tapToDismiss: true,
      }),
    ),
  ],
}).catch((err) => console.error(err));

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c** STOP **',
      'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;',
    );
    console.log(
      `\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
      'font-weight:bold; font: 2em Arial; color: #e11d48;',
    );
  });
}
