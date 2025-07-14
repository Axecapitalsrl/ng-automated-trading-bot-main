import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-password-success',
  templateUrl: './password-success.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, AngularSvgIconModule],
})

export class PasswordSuccessComponent {
  constructor() {}
} 