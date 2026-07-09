import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private questions: Question[] = [
    { text: '2 + 2 = ?', options: [3, 4, 5, 6], correctAnswer: 4, difficulty: 'easy' },
    { text: '3 + 5 = ?', options: [6, 7, 8, 9], correctAnswer: 8, difficulty: 'easy' },
    { text: '10 - 4 = ?', options: [5, 6, 7, 8], correctAnswer: 6, difficulty: 'easy' },
    { text: '5 x 3 = ?', options: [10, 12, 15, 18], correctAnswer: 15, difficulty: 'medium' },
    { text: '8 / 2 = ?', options: [2, 3, 4, 5], correctAnswer: 4, difficulty: 'medium' },
    { text: '12 + 8 = ?', options: [18, 20, 22, 24], correctAnswer: 20, difficulty: 'easy' },
    { text: '7 x 6 = ?', options: [36, 42, 48, 54], correctAnswer: 42, difficulty: 'hard' },
    { text: '100 - 35 = ?', options: [55, 65, 75, 85], correctAnswer: 65, difficulty: 'medium' },
  ];

  constructor(private api: ApiService) {}

  getRandomQuestions(count: number = 5): Question[] {
    const shuffled = this.questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Actualiza la puntuación del usuario
  saveScore(userId: string, score: number): Observable<any> {
    return this.api.put(`api/usuarios/${userId}`, { puntuacion: score });
  }

  // Obtiene los datos del perfil
  getUserProfile(userId: string): Observable<any> {
    return this.api.get(`api/usuarios/${userId}`);
  }
}