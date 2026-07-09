import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.gameService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.authService['currentUserSubject'].next(user);
      },
      error: () => {
        const stored = localStorage.getItem('user');
        if (stored) {
          this.user = JSON.parse(stored);
        }
      }
    });
  }

  ionViewWillEnter() {
    this.loadProfile();
  }
}