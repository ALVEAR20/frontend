import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // Registro: envía email, usuario, contraseña
  register(userData: { email: string; usuario: string; contraseña: string }): Observable<any> {
    return this.api.post('api/usuarios/', userData).pipe(
      tap((res: any) => {
        if (res.data && res.data.id) {
          const user: User = {
            id: res.data.id,
            username: res.data.usuario,
            email: res.data.email,
            score: res.data.puntuacion || 0,
            rewards: []
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return res;
      })
    );
  }

  // Login: envía email y contraseña
  login(credentials: { email: string; contraseña: string }): Observable<any> {
    return this.api.post('api/usuarios/login', credentials).pipe(
      tap((res: any) => {
        if (res.data && res.data.id) {
          const user: User = {
            id: res.data.id,
            username: res.data.usuario,
            email: res.data.email,
            score: res.data.puntuacion || 0,
            rewards: []
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return res;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}