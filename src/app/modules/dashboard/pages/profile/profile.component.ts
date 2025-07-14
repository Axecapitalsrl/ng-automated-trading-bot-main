import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';
import { IUser } from '../../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true
})
export class ProfileComponent implements OnInit {
  @Select(AuthState.user) user$!: Observable<IUser>;
  user: IUser | null = null;

  ngOnInit() {
    this.user$.subscribe(user => {
      this.user = user;
    });
  }
}
