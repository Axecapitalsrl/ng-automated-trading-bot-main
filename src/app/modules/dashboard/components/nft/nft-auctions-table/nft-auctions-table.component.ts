import { NgFor, NgIf, NgClass, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOperation } from '../../../../../core/interfaces/operation.interface';
import { OperationDetailModalComponent } from '../../../pages/operations/operation-detail-modal/operation-detail-modal.component';
import { Store } from '@ngxs/store';
import { OperationsState } from '../../../../../store/operations/operations.state';

@Component({
  selector: '[nft-auctions-table]',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe, DecimalPipe, CommonModule, OperationDetailModalComponent],
  templateUrl: './nft-auctions-table.component.html',
})

export class NftAuctionsTableComponent {
  @Input() operations: IOperation[] = [];
  selectedOperation: IOperation | null = null;
  isModalOpen = false;
  loading$ = this.store.select(OperationsState.isLoading);

  constructor(private store: Store) {}

  openOperationDetails(operation: IOperation) {
    this.selectedOperation = operation;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    setTimeout(() => {
      this.selectedOperation = null;
    }, 300);
  }
}
