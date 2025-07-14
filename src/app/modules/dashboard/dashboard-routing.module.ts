import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { BalanceComponent } from './pages/balance/balance.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { BotComponent } from './pages/bot/bot.component';
import { CredentialsConfigComponent } from './pages/credentials-config/credentials-config.component';
import { OpportunitiesComponent } from './pages/opportunities/opportunities.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TutorialsComponent } from './pages/tutorials/tutorials.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'bots', pathMatch: 'full' },
      { path: 'bots', component: BotComponent },
      { path: 'balance', component: BalanceComponent },
      { path: 'operations', component: OperationsComponent },
      { path: 'credentials-config', component: CredentialsConfigComponent },
      { path: 'opportunities', component: OpportunitiesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'tutorials', component: TutorialsComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
