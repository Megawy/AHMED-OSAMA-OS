import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminAuthService } from '@core/services/admin-auth.service';
import { AuthService } from '@core/firebase/auth.service';

/** Seconds to wait for the SMS before the next automatic action. */
const OTP_WAIT_SECONDS = 40;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly adminAuth = inject(AdminAuthService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  email = signal<string>('');
  password = signal<string>('');
  showPassword = signal<boolean>(false);
  rememberMe = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string>('');
  showForgotForm = signal<boolean>(false);
  forgotEmail = signal<string>('');
  forgotSent = signal<boolean>(false);

  // ── Phone OTP state ──────────────────────────────────────────────
  loginMode = signal<'email' | 'phone'>('email');
  phone = signal<string>('');
  otpStep = signal<'phone' | 'code'>('phone');
  otpCode = signal<string>('');
  otpAttempt = signal<number>(0);
  countdown = signal<number>(0);
  otpNotice = signal<string>('');
  private otpTimer: ReturnType<typeof setInterval> | null = null;

  readonly canSubmit = computed<boolean>(
    () => this.email().trim().length > 0 && this.password().length >= 6 && !this.loading(),
  );

  readonly canSendOtp = computed<boolean>(
    () => this.normalizePhone(this.phone()).length >= 10 && !this.loading(),
  );

  readonly canConfirmOtp = computed<boolean>(
    () => this.otpCode().trim().length === 6 && !this.loading(),
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.stopOtpWait());
  }

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

  // ── Phone OTP flow ────────────────────────────────────────────────────────
  // Send OTP → wait 40s. No code entered? Auto-resend (attempt 2) → wait 40s
  // again. Still nothing? Cancel the number and start over.

  setLoginMode(mode: 'email' | 'phone'): void {
    this.loginMode.set(mode);
    this.error.set('');
    this.otpNotice.set('');
    if (mode === 'email') this.resetOtp();
  }

  /** Keeps only digits (max 6) in the OTP field. */
  onOtpInput(value: string): void {
    this.otpCode.set(value.replace(/[^0-9]/g, '').slice(0, 6));
  }

  /** Accepts 01xxxxxxxxx or +201xxxxxxxxx and returns E.164. */
  private normalizePhone(raw: string): string {
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits.startsWith('00')) return '+' + digits.slice(2);
    if (digits.startsWith('0')) return '+20' + digits.slice(1);
    if (digits.startsWith('20')) return '+' + digits;
    return digits.length ? '+' + digits : '';
  }

  async sendOtp(): Promise<void> {
    if (!this.canSendOtp()) return;
    this.loading.set(true);
    this.error.set('');
    this.otpNotice.set('');
    try {
      await this.authService.sendPhoneOtp(this.normalizePhone(this.phone()));
      this.otpStep.set('code');
      this.startOtpWait(1);
    } catch (err) {
      this.error.set(this.friendlyOtpError(err));
    } finally {
      this.loading.set(false);
    }
  }

  async confirmOtp(): Promise<void> {
    if (!this.canConfirmOtp()) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.authService.confirmPhoneOtp(this.otpCode().trim());
      this.stopOtpWait();
      const success = await this.adminAuth.completePhoneLogin();
      if (success) {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.error.set(this.adminAuth.error() || 'Phone login failed.');
        this.resetOtp();
      }
    } catch (err) {
      this.error.set(this.friendlyOtpError(err));
    } finally {
      this.loading.set(false);
    }
  }

  /** Starts the 40s wait for the given attempt (1 = first send, 2 = resend). */
  private startOtpWait(attempt: number): void {
    this.stopOtpWait();
    this.otpAttempt.set(attempt);
    this.countdown.set(OTP_WAIT_SECONDS);
    this.otpTimer = setInterval(() => {
      this.countdown.update((s) => s - 1);
      if (this.countdown() <= 0) {
        this.stopOtpWait();
        if (this.otpAttempt() === 1) {
          // Code didn't arrive in time — resend automatically.
          this.otpNotice.set('Code did not arrive — resending automatically…');
          this.authService
            .sendPhoneOtp(this.normalizePhone(this.phone()))
            .then(() => this.startOtpWait(2))
            .catch((err) => {
              this.error.set(this.friendlyOtpError(err));
              this.resetOtp();
            });
        } else {
          // Second wait exhausted — cancel the number and start over.
          this.error.set(
            'The code still did not arrive. The number was cancelled — please start over.',
          );
          this.resetOtp();
        }
      }
    }, 1000);
  }

  private stopOtpWait(): void {
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
      this.otpTimer = null;
    }
  }

  resetOtp(): void {
    this.stopOtpWait();
    this.authService.cancelOtp();
    this.otpStep.set('phone');
    this.otpCode.set('');
    this.otpAttempt.set(0);
    this.countdown.set(0);
    this.otpNotice.set('');
  }

  cancelOtp(): void {
    this.resetOtp();
    this.error.set('');
  }

  private friendlyOtpError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number. Use the international format, e.g. +201002275366.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few minutes and try again.';
      case 'auth/invalid-verification-code':
        return 'Wrong code. Check the SMS and try again.';
      case 'auth/code-expired':
        return 'The code expired. Send a new one.';
      case 'auth/quota-exceeded':
        return 'SMS quota exceeded. Try again later.';
      case 'auth/operation-not-allowed':
        return 'Phone sign-in is not enabled for this Firebase project. Enable the Phone provider in Firebase Console → Authentication → Sign-in method.';
      default:
        return err instanceof Error ? err.message : 'Failed to send the code.';
    }
  }
}
