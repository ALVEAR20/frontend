import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class Tab1Page implements OnInit {
  authMode: 'login' | 'register' = 'login';
  authForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tabs/tab2']);
    }
  }

  switchMode() {
    this.authForm.reset();
    this.errorMessage = '';
    if (this.authMode === 'register') {
      this.authForm.get('username')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('username')?.clearValidators();
    }
    this.authForm.get('username')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { email, password, username } = this.authForm.value;

    if (this.authMode === 'login') {
      this.authService.login({ email, contraseña: password }).subscribe({
        next: () => {
          this.router.navigate(['/tabs/tab2']);
        },
        error: (err) => {
          this.errorMessage = err.error?.detail || err.error?.mensaje || 'Error al iniciar sesión';
        }
      });
    } else {
      this.authService.register({ email, usuario: username, contraseña: password }).subscribe({
        next: () => {
          this.router.navigate(['/tabs/tab2']);
        },
        error: (err) => {
          this.errorMessage = err.error?.detail || err.error?.mensaje || 'Error al registrarse';
        }
      });
    }
  }
}