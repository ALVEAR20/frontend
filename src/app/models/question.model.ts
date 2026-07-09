export interface Question {
  id?: string;
  text: string;
  options: number[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}