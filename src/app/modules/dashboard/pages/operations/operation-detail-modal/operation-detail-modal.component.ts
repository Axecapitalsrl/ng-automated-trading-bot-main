import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IOperation } from '../../../../../core/interfaces/operation.interface';

@Component({
  selector: 'app-operation-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operation-detail-modal.component.html',
  styleUrl: './operation-detail-modal.component.css'
})
export class OperationDetailModalComponent {
  @Input() operation: IOperation | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  closeModalFn() {
    this.isOpen = false;
    this.closeModal.emit();
  }

  getStatusColor(success: boolean) {
    return success ? 'text-green-500' : 'text-red-500';
  }

  getProfitColor(profit: number) {
    return profit > 0 ? 'text-green-500' : 'text-red-500';
  }

  getErrorMessage(error: any): { code: number; msg: string } {
    if (typeof error === 'string') {
      try {
        return JSON.parse(error);
      } catch {
        return { code: 0, msg: error };
      }
    }
    return error;
  }
}
