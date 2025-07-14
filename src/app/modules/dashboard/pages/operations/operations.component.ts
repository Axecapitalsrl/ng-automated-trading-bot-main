import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetOperationsByUserId, GetOperationsStats } from '../../../../store/operations/operations.actions';
import { OperationsState } from '../../../../store/operations/operations.state';
import { Subject, takeUntil } from 'rxjs';
import { IOperationResponse, IGetOperationsRequest, IOperation, IOperationsStats } from '../../../../core/interfaces/operation.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationDetailModalComponent } from './operation-detail-modal/operation-detail-modal.component';
import { AuthState } from '../../../../store/auth/auth.state';
import { BotTypesState } from 'src/app/store/bot-types/bot-types.state';
import { IGetBotTypesResponse } from 'src/app/core/interfaces/bot-types.interface';
import { GetBotTypes } from 'src/app/store/bot-types/bot-types.actions';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, OperationDetailModalComponent],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css',
})
export class OperationsComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  operations$ = this.store.select(OperationsState.getOperations);
  loading$ = this.store.select(OperationsState.isLoading);
  error$ = this.store.select(OperationsState.getError);
  user$ = this.store.select(AuthState.user);
  stats$ = this.store.select(OperationsState.getOperationsStats);
  botTypes$ = this.store.select(BotTypesState.getBotTypes);

  operations: IOperation[] = [];
  filteredOperations: IOperation[] = [];
  loading = false;
  selectedOperation: IOperation | null = null;
  isModalOpen = false;

  stats: IOperationsStats | null = null;
  botTypes: IGetBotTypesResponse[] = [];

  // Filtros
  selectedBotType = '';
  selectedExchange = '';
  selectedDateRange = '';

  // Opciones de filtros
  exchanges: string[] = ['Binance', 'Bitget'];

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  Math = Math; // Para usar en el template

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetBotTypes());
    this.store.dispatch(new GetOperationsStats());
    
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.loadOperations();
      }
    });

    this.subscribeToOperations();
    this.subscribeToStats();
    this.subscribeToBotTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToOperations(): void {
    this.operations$.pipe(takeUntil(this.destroy$)).subscribe((operations) => {
      if (operations) {
        this.operations = operations.data;
        this.filteredOperations = operations.data;
        this.totalItems = operations.total || 0;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePages();
      }
    });

    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });
  }

  private subscribeToStats(): void {
    this.stats$.pipe(takeUntil(this.destroy$)).subscribe((stats) => {
      this.stats = stats;
    });
  }

  private subscribeToBotTypes(): void {
    this.botTypes$.pipe(takeUntil(this.destroy$)).subscribe((botTypes) => {
      this.botTypes = botTypes;
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadOperations();
  }

  openOperationDetails(operation: IOperation): void {
    this.selectedOperation = operation;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedOperation = null;
  }

  updatePages(): void {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadOperations();
    }
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(select.value);
    this.currentPage = 1;
    this.loadOperations();
  }

  private loadOperations(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        const request: IGetOperationsRequest = {
          userId: user.user_id || '',
          page: this.currentPage,
          limit: this.itemsPerPage,
        };

        if (this.selectedBotType) {
          request.botTypeId = this.selectedBotType;
        }

        if (this.selectedExchange) {
          request.exchangeId = this.selectedExchange.toLowerCase();
        }

        if (this.selectedDateRange) {
          request.startDate = this.selectedDateRange;
        }

        this.store.dispatch(new GetOperationsByUserId(request));
      }
    });
  }

}
