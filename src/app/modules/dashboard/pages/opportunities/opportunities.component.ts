import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetOpportunities } from 'src/app/store/opportunities/opportunities.actions';
import { OpportunitiesState } from 'src/app/store/opportunities/opportunities.state';
import { Subject, takeUntil } from 'rxjs';
import { IGetOportonities, IGetOportonitiesRequest } from '../../../../core/interfaces/opportunities.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotTypesState } from '../../../../store/bot-types/bot-types.state';
import { IGetBotTypesResponse } from '../../../../core/interfaces/bot-types.interface';
import { GetBotTypes } from '../../../../store/bot-types/bot-types.actions';
import { OpportunityDetailModalComponent } from './opportunity-detail-modal.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule, FormsModule, OpportunityDetailModalComponent, AngularSvgIconModule],
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.css',
})
export class OpportunitiesComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  opportunities$ = this.store.select(OpportunitiesState.getOpportunities);
  loading$ = this.store.select(OpportunitiesState.isLoading);
  opportunities: IGetOportonities[] = [];
  filteredOpportunities: IGetOportonities[] = [];
  loading = false;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  Math = Math; // Para usar en el template

  botTypes$ = this.store.select(BotTypesState.getBotTypes);
  botTypes: IGetBotTypesResponse[] = [];

  // Filtros
  selectedBotType = '';
  selectedExchange = '';
  selectedDateRange = '';

  // Modal
  selectedOpportunity: IGetOportonities | null = null;
  showModal = false;

  // Opciones de filtros
  exchanges: string[] = ['Binance'];

  constructor(private store: Store) {
    this.loadOpportunities();
    this.store.dispatch(new GetBotTypes());
  }

  loadOpportunities() {
    const request: IGetOportonitiesRequest = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    // Add bot_type_id to request if selected
    if (this.selectedBotType) {
      request.bot_type_id = this.selectedBotType;
    }

    // Add cex_id to request if selected
    if (this.selectedExchange) {
      request.cex_id = this.selectedExchange;
    }

    // Add start_date to request if selected
    if (this.selectedDateRange) {
      request.start_date = this.selectedDateRange;
    }

    this.store.dispatch(new GetOpportunities(request));
  }

  ngOnInit() {
    this.opportunities$.pipe(takeUntil(this.destroy$)).subscribe((opportunities) => {
      if (opportunities) {
        this.opportunities = opportunities.data || [];
        this.filteredOpportunities = this.opportunities;
        this.totalItems = opportunities.total || 0;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagesArray();
      }
    });

    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    this.botTypes$.pipe(takeUntil(this.destroy$)).subscribe((botTypes) => {
      this.botTypes = botTypes;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onFilterChange() {
    this.currentPage = 1; // Reset to first page when filters change
    this.loadOpportunities();
  }

  openOpportunityDetail(opportunity: IGetOportonities) {
    this.selectedOpportunity = opportunity;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedOpportunity = null;
  }

  updatePagesArray() {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadOpportunities();
    }
  }

  onItemsPerPageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(select.value);
    this.currentPage = 1;
    this.loadOpportunities();
  }
}
