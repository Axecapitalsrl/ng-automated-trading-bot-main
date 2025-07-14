import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateBotModalComponent } from '../create-bot-modal/create-bot-modal.component';
import { IGetCredentialsByUserIDResponse } from '../../../../../core/interfaces/credentials.interface';

@Component({
    selector: 'app-nft-header',
    templateUrl: './nft-header.component.html',
    standalone: true,
    imports: [CommonModule, CreateBotModalComponent]
})
export class NftHeaderComponent implements OnInit {

  @Input() crendentials: IGetCredentialsByUserIDResponse[] = [];

  showCreateBotModal = false;

  constructor(private router: Router) {}

  openCreateBotModal() {
    this.showCreateBotModal = true;
  }

  closeCreateBotModal() {
    this.showCreateBotModal = false;
  }

  handleCreateBot(formData: any) {
    this.closeCreateBotModal();
  }

  redirectToCredentials() {
    this.router.navigate(['/dashboard/credentials-config']);
  }

  ngOnInit(): void {}
}
