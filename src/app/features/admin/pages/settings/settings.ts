import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminCard } from '@features/admin/components/admin-card/admin-card';

import { AdminSettingsService } from '@core/services/admin-settings.service';
import { LOCAL_CV_PATH } from '@core/services/settings.service';
import { AuthService } from '@core/firebase/auth.service';
import { type SiteSettings, type SocialLink } from '@core/models/settings.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminCard],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class AdminSettings implements OnInit {
  private readonly service = inject(AdminSettingsService);
  private readonly authService = inject(AuthService);

  readonly authUser = this.authService.user;

  readonly form = signal<Partial<SiteSettings>>({});
  readonly loading = this.service.loading;
  readonly error = this.service.error;
  readonly saving = this.service.saving;
  readonly saved = this.service.saved;
  readonly uploadingCv = this.service.uploadingCv;

  /** The CV bundled with the app — shown when no resume was uploaded yet. */
  readonly localCv = LOCAL_CV_PATH;

  /** The CV currently served to visitors (uploaded one wins over the bundled one). */
  get effectiveCvUrl(): string {
    return this.form().resumeUrl || this.localCv;
  }

  ngOnInit(): void {
    this.service.load().then(() => {
      const data = this.service.settings();
      if (data) {
        this.form.set({ ...data });
      }
    });
  }

  updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  get socialLinks(): SocialLink[] {
    return this.form().socialLinks ?? [];
  }

  addSocialLink(): void {
    const links = [...this.socialLinks, { platform: '', url: '', icon: '' }];
    this.updateField('socialLinks', links);
  }

  removeSocialLink(index: number): void {
    const links = this.socialLinks.filter((_, i) => i !== index);
    this.updateField('socialLinks', links);
  }

  updateSocialLink(index: number, field: keyof SocialLink, value: string): void {
    const links = this.socialLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link,
    );
    this.updateField('socialLinks', links);
  }

  async save(): Promise<void> {
    await this.service.save(this.form());
  }

  async onCvUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const url = await this.service.uploadCv(file);
      this.updateField('resumeUrl', url);
    } catch {
      // Error message is surfaced via service.error().
    }
  }

  removeCv(): void {
    this.updateField('resumeUrl', '');
  }

  // ── Security: link phone ────────────────────────────────────────────────
  readonly linkPhone = signal<string>('');
  readonly linkStep = signal<'idle' | 'code'>('idle');
  readonly linkCode = signal<string>('');
  readonly linkBusy = signal<boolean>(false);
  readonly linkMessage = signal<string>('');
  readonly linkError = signal<string>('');

  async sendLinkCode(): Promise<void> {
    const phone = this.normalizePhone(this.linkPhone());
    if (phone.length < 10 || this.linkBusy()) return;
    this.linkBusy.set(true);
    this.linkError.set('');
    this.linkMessage.set('');
    try {
      await this.authService.linkPhone(phone);
      this.linkStep.set('code');
    } catch (err) {
      this.linkError.set(this.securityError(err));
    } finally {
      this.linkBusy.set(false);
    }
  }

  async confirmLink(): Promise<void> {
    if (this.linkCode().trim().length !== 6 || this.linkBusy()) return;
    this.linkBusy.set(true);
    this.linkError.set('');
    try {
      await this.authService.confirmLinkPhone(this.linkCode().trim());
      this.linkMessage.set('Phone number linked successfully. You can now sign in with OTP.');
      this.linkStep.set('idle');
      this.linkCode.set('');
      this.linkPhone.set('');
    } catch (err) {
      this.linkError.set(this.securityError(err));
    } finally {
      this.linkBusy.set(false);
    }
  }

  cancelLink(): void {
    this.authService.cancelOtp();
    this.linkStep.set('idle');
    this.linkCode.set('');
    this.linkError.set('');
  }

  onLinkCodeInput(value: string): void {
    this.linkCode.set(value.replace(/[^0-9]/g, '').slice(0, 6));
  }

  // ── Security: change password ───────────────────────────────────────
  readonly pwCurrent = signal<string>('');
  readonly pwNew = signal<string>('');
  readonly pwConfirm = signal<string>('');
  readonly pwBusy = signal<boolean>(false);
  readonly pwMessage = signal<string>('');
  readonly pwError = signal<string>('');

  readonly canChangePw = computed<boolean>(
    () =>
      this.pwCurrent().length > 0 &&
      this.pwNew().length >= 8 &&
      this.pwNew() === this.pwConfirm() &&
      !this.pwBusy(),
  );

  async changePassword(): Promise<void> {
    if (!this.canChangePw()) {
      if (this.pwNew() !== this.pwConfirm()) {
        this.pwError.set('New password and confirmation do not match.');
      } else if (this.pwNew().length < 8) {
        this.pwError.set('The new password must be at least 8 characters.');
      }
      return;
    }
    this.pwBusy.set(true);
    this.pwMessage.set('');
    this.pwError.set('');
    try {
      await this.authService.changePassword(this.pwCurrent(), this.pwNew());
      this.pwMessage.set('Password changed successfully.');
      this.pwCurrent.set('');
      this.pwNew.set('');
      this.pwConfirm.set('');
    } catch (err) {
      // Handled errors only — nothing escapes to crash the page.
      this.pwError.set(this.securityError(err));
    } finally {
      this.pwBusy.set(false);
    }
  }

  private normalizePhone(raw: string): string {
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits.startsWith('00')) return '+' + digits.slice(2);
    if (digits.startsWith('0')) return '+20' + digits.slice(1);
    if (digits.startsWith('20')) return '+' + digits;
    return digits.length ? '+' + digits : '';
  }

  private securityError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Current password is incorrect.';
      case 'auth/weak-password':
        return 'New password is too weak — use at least 8 characters.';
      case 'auth/requires-recent-login':
        return 'Session expired — sign in again, then change your password.';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number. Use the international format, e.g. +201002275366.';
      case 'auth/invalid-verification-code':
        return 'Wrong code. Check the SMS and try again.';
      case 'auth/provider-already-linked':
        return 'This account already has a linked phone number.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few minutes and try again.';
      default:
        return err instanceof Error ? err.message : 'Operation failed.';
    }
  }
}
