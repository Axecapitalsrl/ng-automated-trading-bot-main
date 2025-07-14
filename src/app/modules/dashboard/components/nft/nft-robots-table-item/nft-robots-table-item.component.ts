import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

interface Robot {
  id: number;
  nombre: string;
  exchange: string;
  par: string;
  rendimiento: number;
  estado: string;
  imagen: string;
  tiempo: string;
}

@Component({
  selector: '[nft-robots-table-item]',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule],
  templateUrl: './nft-robots-table-item.component.html',
})
export class NftRobotsTableItemComponent {
  @Input() robot!: Robot;
}
