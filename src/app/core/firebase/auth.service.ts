import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from 'firebase/auth';

import { firebaseApp } from './firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly auth = getAuth(firebaseApp);
  private readonly platformId = inject(PLATFORM_ID);

  readonly user = signal<User | null>(null);
  readonly loading = signal<boolean>(true);

  private recaptcha: RecaptchaVerifier | null = null;
  private confirmation: ConfirmationResult | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      onAuthStateChanged(this.auth, (user) => {
        this.user.set(user);
        this.loading.set(false);
      });
    } else {
      this.loading.set(false);
    }
  }

  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async signup(email: string, password: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  // ── Phone OTP ──────────────────────────────────────────────────────────

  private ensureRecaptcha(): RecaptchaVerifier {
    if (!this.recaptcha) {
      let el = document.getElementById('recaptcha-container');
      if (!el) {
        el = document.createElement('div');
        el.id = 'recaptcha-container';
        document.body.appendChild(el);
      }
      this.recaptcha = new RecaptchaVerifier(this.auth, el, { size: 'invisible' });
    }
    return this.recaptcha;
  }

  /** Sends an OTP to the given phone number (E.164, e.g. +201002275366). */
  async sendPhoneOtp(phone: string): Promise<void> {
    try {
      this.confirmation = await signInWithPhoneNumber(
        this.auth,
        phone,
        this.ensureRecaptcha(),
      );
    } catch (err) {
      // Invisible reCAPTCHA can go stale between attempts — recreate once.
      this.resetRecaptcha();
      throw err;
    }
  }

  /** Confirms the OTP and signs the user in. */
  async confirmPhoneOtp(code: string): Promise<User> {
    if (!this.confirmation) throw new Error('No active OTP session.');
    const cred = await this.confirmation.confirm(code);
    this.confirmation = null;
    return cred.user;
  }

  /** Starts linking a phone number to the currently signed-in user. */
  async linkPhone(phone: string): Promise<void> {
    const user = this.currentUser;
    if (!user) throw new Error('You must be signed in to link a phone number.');
    this.confirmation = await linkWithPhoneNumber(user, phone, this.ensureRecaptcha());
  }

  /** Confirms the OTP for a phone-linking session. */
  async confirmLinkPhone(code: string): Promise<void> {
    if (!this.confirmation) throw new Error('No active OTP session.');
    await this.confirmation.confirm(code);
    this.confirmation = null;
  }

  /** Abandons the current OTP session (used by the 2-attempt timeout flow). */
  cancelOtp(): void {
    this.confirmation = null;
  }

  private resetRecaptcha(): void {
    try {
      this.recaptcha?.clear();
    } catch {
      // Best-effort cleanup.
    }
    this.recaptcha = null;
  }

  // ── Password change ────────────────────────────────────────────────────

  /**
   * Changes the password of the signed-in email user. Re-authenticates first
   * so Firebase doesn't reject with `auth/requires-recent-login`.
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.currentUser;
    if (!user?.email) throw new Error('Password change requires an email account.');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  }

  async updateUserProfile(
    user: User,
    data: { displayName?: string; photoURL?: string },
  ): Promise<void> {
    await updateProfile(user, data);
    this.user.set({ ...user, ...data });
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}
