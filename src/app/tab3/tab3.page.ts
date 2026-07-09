import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { User } from '../models/user.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule]
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
    const current = this.authService.getCurrentUser();
    if (current && current.id) {
      this.gameService.getUserProfile(current.id).subscribe({
        next: (res: any) => {
          if (res.data) {
            const userData = res.data;
            this.user = {
              id: userData.id,
              username: userData.usuario,
              email: userData.email,
              score: userData.puntuacion || 0,
              rewards: []
            };
            localStorage.setItem('user', JSON.stringify(this.user));
            this.authService['currentUserSubject'].next(this.user);
          }
        },
        error: () => {
          const stored = localStorage.getItem('user');
          if (stored) {
            this.user = JSON.parse(stored);
          }
        }
      });
    } else {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
  }

  ionViewWillEnter() {
    this.loadProfile();
  }
}