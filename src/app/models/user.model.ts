export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  score?: number;
  rewards?: string[];
}