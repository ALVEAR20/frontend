import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GameService } from '../services/game.service';
import { AuthService } from '../services/auth.service';
import { Question } from '../models/question.model';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page implements OnInit {
  questions: Question[] = [];
  currentQuestionIndex = 0;
  totalQuestions = 5;
  score = 0;
  correctAnswers = 0;
  selectedOption: number | null = null;
  answered = false;
  feedback = '';
  feedbackCorrect = false;
  gameOver = false;

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.questions = this.gameService.getRandomQuestions(this.totalQuestions);
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.gameOver = false;
    this.answered = false;
    this.selectedOption = null;
    this.feedback = '';
    this.totalQuestions = this.questions.length;
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  onOptionSelected() {
    if (this.answered) return;
    const question = this.currentQuestion;
    if (question && this.selectedOption !== null) {
      const isCorrect = this.selectedOption === question.correctAnswer;
      this.answered = true;
      this.feedbackCorrect = isCorrect;
      if (isCorrect) {
        this.score += 10;
        this.correctAnswers++;
        this.feedback = '¡Correcto! +10 puntos';
      } else {
        this.feedback = `Incorrecto. La respuesta correcta era ${question.correctAnswer}`;
      }
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.answered = false;
      this.selectedOption = null;
      this.feedback = '';
    } else {
      this.gameOver = true;
      const user = this.authService.getCurrentUser();
      if (user && user.id) {
        this.gameService.saveScore(user.id, this.score).subscribe({
          next: () => console.log('Puntuación guardada'),
          error: (err) => console.error('Error al guardar puntuación', err)
        });
      }
    }
  }

  resetGame() {
    this.startGame();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/tabs/tab1']);
  }
}