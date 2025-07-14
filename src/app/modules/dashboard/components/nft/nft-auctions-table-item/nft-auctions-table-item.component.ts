import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nft } from '../../../models/nft';
import { AngularSvgIconModule } from 'angular-svg-icon';

interface Operation {
  id: number;
  title: string;
  creator: string;
  image: string;
  avatar: string;
  ending_in: string;
  last_bid: number;
  price: number;
  instant_price: number;
  profit?: number;
}

@Component({
  selector: '[nft-auctions-table-item]',
  standalone: true,
  imports: [NgFor, CommonModule, AngularSvgIconModule],
  templateUrl: './nft-auctions-table-item.component.html',
})
export class NftAuctionsTableItemComponent {
  @Input() auction!: Nft;
  @Input() operation!: Operation;
}
