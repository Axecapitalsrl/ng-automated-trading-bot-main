import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { NftAuctionsTableComponent } from '../../components/nft/nft-auctions-table/nft-auctions-table.component';
import { NftHeaderComponent } from '../../components/nft/nft-header/nft-header.component';
import { Nft } from '../../models/nft';
import { NftRobotsTableComponent } from '../../components/nft/nft-robots-table/nft-robots-table.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Store } from '@ngxs/store';
import { DeleteBot, GetBotsByUserId } from '../../../../store/bots/bots.actions';
import { AuthState } from '../../../../store/auth/auth.state';
import { Subject, takeUntil } from 'rxjs';
import { BotsState } from '../../../../store/bots/bots.state';
import { BalancesState } from '../../../../store/balances/balances.state';
import { GetBalancesByUserId } from '../../../../store/balances/balances.actions';
import { IGetBalancesByUserIDResponse } from '../../../../core/interfaces/balances.interface';
import { GetOperationsByUserId } from '../../../../store/operations/operations.actions';
import { OperationsState } from '../../../../store/operations/operations.state';
import { FilterPipe } from '../../../../core/pipes/filter.pipe';
import { Router } from '@angular/router';
import { IGetUserBots } from '../../../../core/interfaces/bot.interface';
import { CreateBotModalComponent } from '../../components/nft/create-bot-modal/create-bot-modal.component';
import { IGetOperationsRequest, IOperation } from '../../../../core/interfaces/operation.interface';
import { FormsModule } from '@angular/forms';
import { GetCredentialsByUserId } from '../../../../store/credentials/credentials.actions';
import { CredentialsState } from '../../../../store/credentials/credentials.state';
import { IGetCredentialsByUserIDResponse } from '../../../../core/interfaces/credentials.interface';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NftHeaderComponent,
    NftAuctionsTableComponent,
    AngularSvgIconModule,
    FilterPipe,
    NftRobotsTableComponent,
    CreateBotModalComponent,
    FormsModule,
  ],
})

export class BotComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public activeAuction: Nft[] = [];
  public isSummaryExpanded = true;

  user$ = this.store.select(AuthState.user);

  public bots: IGetUserBots[] = [];
  public loading: boolean = false;
  public error: string | null = null;
  public bots$ = this.store.select(BotsState.getBots);

  public balances$ = this.store.select(BalancesState.getBalances);
  public balances: IGetBalancesByUserIDResponse | null = null;
  public loadingBalances$ = this.store.select(BalancesState.isLoading);

  public operations: IOperation[] = [];
  public filteredOperations: IOperation[] = [];
  public operations$ = this.store.select(OperationsState.getOperations);

  credentials$ = this.store.select(CredentialsState.getCredentialsByUserId);
  public credentials: IGetCredentialsByUserIDResponse[] = [];

  // Paginación para operaciones
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  Math = Math;

  public showModal = false;
  public botToEdit?: IGetUserBots;

  userId: string = '';

  createBot$ = this.store.select(BotsState.getSuccessCreateBot);
  updateBot$ = this.store.select(BotsState.getSuccessUpdateBot);
  deleteBot$ = this.store.select(BotsState.getSuccessDeleteBot);

  constructor(private store: Store, private router: Router) {}

  calculateTotal(spot: any, credential: any): string {
    const spotBalance = parseFloat(spot?.free || '0');
    const futuresBalance = parseFloat(
      credential?.balances?.futures?.filter((f: any) => f?.asset === 'USDT')[0]?.balance || '0',
    );
    const fundingBalance = parseFloat(
      credential?.balances?.funding?.filter((f: any) => f?.asset === 'USDT')[0]?.free || '0',
    );
    return (spotBalance + futuresBalance + fundingBalance).toFixed(8);
  }

  toggleSummary() {
    this.isSummaryExpanded = !this.isSummaryExpanded;
  }

  getExchangeBalance(exchange: string, asset: string): string {
    if (!this.balances?.exchanges) return '0';
    
    const exchangeData = (this.balances.exchanges as Record<string, any>)[exchange.toLowerCase()]?.data?.[0];
    if (!exchangeData) return '0';

    if (exchange.toLowerCase() === 'binance') {
      const spot = exchangeData.balances.spot?.find((s: any) => s.asset === asset)?.free || '0';
      const futures = exchangeData.balances.futures?.[0]?.balance || '0';
      const funding = exchangeData.balances.funding?.find((f: any) => f.asset === asset)?.free || '0';
      return (parseFloat(spot) + parseFloat(futures) + parseFloat(funding)).toFixed(8);
    } else if (exchange.toLowerCase() === 'bitget') {
      const spot = exchangeData.balances.data.spot.data?.find((s: any) => s.coin === asset)?.available || '0';
      const futures = exchangeData.balances.data.futures_usdt.data?.[0]?.available || '0';
      return (parseFloat(spot) + parseFloat(futures)).toFixed(8);
    }
    return '0';
  }

  getConfiguredExchanges(): string[] {
    if (!this.balances?.exchanges) return [];
    const exchanges = this.balances.exchanges as Record<string, any>;
    return Object.keys(exchanges)
      .filter(key => exchanges[key]?.data?.length > 0)
      .map(key => key.charAt(0).toUpperCase() + key.slice(1));
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.userId = user.user_id;
        this.store.dispatch(new GetBotsByUserId(user.user_id));
        this.store.dispatch(new GetBalancesByUserId(user.user_id));
        const request: IGetOperationsRequest = {
          userId: user.user_id,
          page: this.currentPage,
          limit: this.itemsPerPage,
        };
        this.store.dispatch(new GetOperationsByUserId(request));
        this.store.dispatch(new GetCredentialsByUserId({ user_id: user.user_id }));
      }
    });

    this.bots$.pipe(takeUntil(this.destroy$)).subscribe((bots) => {
      this.bots = bots;
    });

    this.balances$.pipe(takeUntil(this.destroy$)).subscribe((balances) => {
      this.balances = balances;
    });

    this.operations$.pipe(takeUntil(this.destroy$)).subscribe((operations) => {
      if (operations) {
        this.operations = operations.data;
        this.filteredOperations = operations.data;
        this.totalItems = operations.data.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePages();
      }
    });

    this.createBot$.pipe(takeUntil(this.destroy$)).subscribe((createBot) => {
      if (createBot) {
        this.store.dispatch(new GetBotsByUserId(this.userId));
      }
    });

    this.updateBot$.pipe(takeUntil(this.destroy$)).subscribe((updateBot) => {
      if (updateBot) {
        this.store.dispatch(new GetBotsByUserId(this.userId));
      }
    });

    this.deleteBot$.pipe(takeUntil(this.destroy$)).subscribe((deleteBot) => {
      if (deleteBot) {
        this.store.dispatch(new GetBotsByUserId(this.userId));
      }
    });

    this.credentials$.pipe(takeUntil(this.destroy$)).subscribe((credentials) => {
      this.credentials = credentials;
    });
  }

  // Métodos de paginación para operaciones
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredOperations();
    }
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(select.value);
    this.currentPage = 1;
    this.updateFilteredOperations();
  }

  private updatePages(): void {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, this.currentPage - halfVisiblePages);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  private updateFilteredOperations(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredOperations = this.operations.slice(startIndex, endIndex);
  }

  redirectToBalance() {
    this.router.navigate(['/dashboard/balance']);
  }

  openModal(bot?: IGetUserBots) {
    this.showModal = true;
    this.botToEdit = bot;
  }

  deleteBot(bot: IGetUserBots) {
    this.store.dispatch(new DeleteBot(bot.user_bot_id));
  }

  parseFloat(value: string): number {
    return parseFloat(value || '0');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
