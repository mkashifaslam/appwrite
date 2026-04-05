import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  activeTab: 'login' | 'signup' = 'login';
  loading = false;
  errorMessage = '';

  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  setTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  async onLogin() {
    if (this.loginForm.invalid || this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage = err?.message ?? 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async onSignup() {
    if (this.signupForm.invalid || this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      const { name, email, password } = this.signupForm.value;
      await this.authService.register(name, email, password);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage = err?.message ?? 'Sign up failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
