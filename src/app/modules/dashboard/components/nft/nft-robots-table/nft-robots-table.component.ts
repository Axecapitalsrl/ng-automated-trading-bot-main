import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGetUserBots } from '../../../../../core/interfaces/bot.interface';
import { Store } from '@ngxs/store';
import { BotsState } from '../../../../../store/bots/bots.state';

@Component({
  selector: '[nft-robots-table]',
  templateUrl: './nft-robots-table.component.html',
  standalone: true,
  imports: [CommonModule]
})

export class NftRobotsTableComponent {
  @Input() bots: IGetUserBots[] = [];
  @Output() editBot = new EventEmitter<IGetUserBots>();
  @Output() deleteBot = new EventEmitter<IGetUserBots>();
  loading$ = this.store.select(BotsState.isLoading);

  constructor(private store: Store) {}

  onEdit(bot: IGetUserBots) {
    this.editBot.emit(bot);
  }

  onDelete(bot: IGetUserBots) {
    this.deleteBot.emit(bot);
  }
}
