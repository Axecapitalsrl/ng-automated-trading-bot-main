import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { Subject, takeUntil } from 'rxjs';
import { BalancesState } from '../../../../store/balances/balances.state';
import { GetBalancesByUserId } from '../../../../store/balances/balances.actions';
import { IGetBalancesByUserIDResponse } from '../../../../core/interfaces/balances.interface';
import { FilterPipe } from '../../../../core/pipes/filter.pipe';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  standalone: true,
  imports: [CommonModule, FilterPipe],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('200ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})

export class BalanceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user$ = this.store.select(AuthState.user);
  public balances$ = this.store.select(BalancesState.getBalances);
  public balances: IGetBalancesByUserIDResponse | null = null;
  public loading$ = this.store.select(BalancesState.isLoading);
  public isBinanceExpanded = false;
  public isBitgetExpanded = false;
  public isSummaryExpanded = true;

  constructor(private store: Store) {}

  calculateTotal(spot: any, credential: any): string {
    const spotBalance = parseFloat(spot?.free || '0');
    const futuresBalance = parseFloat(credential?.balances?.futures?.[0]?.balance || '0');
    const fundingBalance = parseFloat(
      credential?.balances?.funding?.find((f: any) => f?.asset === spot?.asset)?.free || '0'
    );
    return (spotBalance + futuresBalance + fundingBalance).toFixed(8);
  }

  toggleBinance() {
    this.isBinanceExpanded = !this.isBinanceExpanded;
  }

  toggleBitget() {
    this.isBitgetExpanded = !this.isBitgetExpanded;
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.store.dispatch(new GetBalancesByUserId(user.user_id));
      }
    });

    this.balances$.pipe(takeUntil(this.destroy$)).subscribe((balances) => {
      this.balances = balances;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
