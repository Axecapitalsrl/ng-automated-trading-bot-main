import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGetOportonities } from '../../../../core/interfaces/opportunities.interface';

@Component({
  selector: 'app-opportunity-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-foreground">Detalles de la Oportunidad</h3>
          <button (click)="onClose()" class="text-muted-foreground hover:text-foreground">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Información General -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground">ID</p>
              <p class="text-sm font-medium text-foreground">{{ opportunity?.details?.id }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Tipo de Bot</p>
              <p class="text-sm font-medium text-foreground">{{ opportunity?.botType?.name || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Edad</p>
              <p class="text-sm font-medium text-foreground">{{ (opportunity?.details?.age || 0) | number:'1.0-0' }} Milisegundos</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Inversión</p>
              <p class="text-sm font-medium text-foreground">{{ (opportunity?.details?.investment || 0) | number:'1.2-2' }} USDT</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Profit Esperado</p>
              <p class="text-sm font-medium text-foreground">{{ (opportunity?.details?.profit?.expected || 0) | number:'1.2-2' }} USDT</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Porcentaje de Profit</p>
              <p class="text-sm font-medium text-foreground">{{ (opportunity?.details?.profit?.percent || 0) | number:'1.4-4' }}%</p>
            </div>
          </div>

          <!-- Profundidad -->
          <div>
            <h4 class="text-sm font-semibold text-foreground mb-2">Profundidad</h4>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">{{ opportunity?.details?.trade?.symbol?.a || 'N/A' }}-{{ opportunity?.details?.trade?.symbol?.b || 'N/A' }}</p>
                <p class="text-sm font-medium text-foreground">{{ opportunity?.details?.depth?.ab || 0 }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">{{ opportunity?.details?.trade?.symbol?.b || 'N/A' }}-{{ opportunity?.details?.trade?.symbol?.c || 'N/A' }}</p>
                <p class="text-sm font-medium text-foreground">{{ opportunity?.details?.depth?.bc || 0 }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">{{ opportunity?.details?.trade?.symbol?.c || 'N/A' }}-{{ opportunity?.details?.trade?.symbol?.a || 'N/A' }}</p>
                <p class="text-sm font-medium text-foreground">{{ opportunity?.details?.depth?.ca || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Ruta de Trading -->
          <div>
            <h4 class="text-sm font-semibold text-foreground mb-2">Ruta de Trading</h4>
            <p class="text-sm text-foreground">{{ opportunity?.details?.trade?.route || 'N/A' }}</p>
          </div>

          <!-- Operaciones -->
          <div>
            <h4 class="text-sm font-semibold text-foreground mb-2">Operaciones</h4>
            <div class="space-y-2">
              @if (opportunity?.details?.trade?.legs?.length) {
                @for (leg of opportunity?.details?.trade?.legs || []; track leg.ticker) {
                  <div class="flex justify-between items-center p-2 bg-card rounded">
                    <div>
                      <p class="text-sm font-medium text-foreground">{{ leg.method || 'N/A' }}</p>
                      <p class="text-xs text-muted-foreground">{{ leg.ticker || 'N/A' }}</p>
                    </div>
                  </div>
                }
              } @else {
                <p class="text-sm text-muted-foreground">No hay operaciones disponibles</p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OpportunityDetailModalComponent {
  @Input() opportunity: IGetOportonities | null = null;
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }
}
