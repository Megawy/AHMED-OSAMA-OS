import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminAuthService } from '@core/services/admin-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly adminAuth = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = signal<string>('');
  password = signal<string>('');
  showPassword = signal<boolean>(false);
  rememberMe = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string>('');
  showForgotForm = signal<boolean>(false);
  forgotEmail = signal<string>('');
  forgotSent = signal<boolean>(false);

  readonly canSubmit = computed<boolean>(
    () => this.email().trim().length > 0 && this.password().length >= 6 && !this.loading(),
  );

  async onSubmit(): Promise<void> {
    if (!this.canSubmit()) return;

    this.loading.set(true);
    this.error.set('');

    const success = await this.adminAuth.loginAsAdmin(this.email().trim(), this.password());

    if (success) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.error.set(this.adminAuth.error() || 'Login failed.');
      this.loading.set(false);
    }
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleForgotForm(): void {
    this.showForgotForm.update((v) => !v);
    this.forgotSent.set(false);
    this.error.set('');
  }

  async sendReset(): Promise<void> {
    if (this.forgotEmail().trim().length === 0) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.adminAuth.sendPasswordReset(this.forgotEmail().trim());
      this.forgotSent.set(true);
    } catch {
      this.error.set('Failed to send reset email. Try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
