import {
  Component,
  signal,
  computed,
  inject,
  DestroyRef,
  afterNextRender,
  ElementRef,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { ContactService } from '@core/services/contact.service';
import { AnimationService } from '@core/services/animation.service';
import { SettingsService, LOCAL_CV_PATH } from '@core/services/settings.service';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly contactService = inject(ContactService);
  private readonly animations = inject(AnimationService);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly settingsService = inject(SettingsService);

  /** CV link: the admin-uploaded resume if present, else the bundled PDF. */
  readonly resumeUrl = signal<string>(LOCAL_CV_PATH);

  readonly form = signal<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  readonly errors = signal<FormErrors>({});
  readonly touched = signal<Record<string, boolean>>({});

  readonly sending = this.contactService.sending;
  readonly sent = this.contactService.sent;
  readonly serviceError = this.contactService.error;

  readonly canSubmit = computed<boolean>(
    () => !this.sending() && !this.sent() && this.isFormValid(),
  );

  /** FAQ identifiers — text lives in i18n files under CONTACT.FAQ. */
  readonly faqs = ['1', '2', '3', '4'];

  readonly contactInfo = computed(() => [
    {
      icon: '📧',
      label: 'Email',
      value: 'ahmed.osama001@outlook.com',
      link: 'mailto:ahmed.osama001@outlook.com',
      download: false,
    },
    {
      icon: '📱',
      label: 'Phone',
      value: '+20 100 227 5366',
      link: 'tel:+201002275366',
      download: false,
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'Cairo, Egypt',
      link: null,
      download: false,
    },
    {
      icon: '🐙',
      label: 'GitHub',
      value: 'github.com/Megawy',
      link: 'https://github.com/Megawy',
      download: false,
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'linkedin.com/in/ahmed-osama-72a255241',
      link: 'https://linkedin.com/in/ahmed-osama-72a255241',
      download: false,
    },
    {
      icon: '📄',
      label: 'Resume',
      value: 'Download CV',
      link: this.resumeUrl(),
      download: true,
    },
  ]);

  constructor() {
    afterNextRender(async () => {
      this.resumeUrl.set(await this.settingsService.getResumeUrl());

      const host = this.el.nativeElement as HTMLElement;
      const elements = Array.from(host.querySelectorAll('.reveal'));
      const cleanup = await this.animations.reveal(elements);
      this.destroyRef.onDestroy(cleanup);
    });
  }

  updateField(field: keyof FormData, value: string): void {
    this.form.update((f) => ({ ...f, [field]: value }));
    this.touched.update((t) => ({ ...t, [field]: true }));

    if (this.touched()[field]) {
      this.validateField(field);
    }
  }

  private validateField(field: keyof FormData): void {
    const value = this.form()[field];
    const errors = { ...this.errors() };

    switch (field) {
      case 'name':
        errors.name = value.trim().length < 2 ? 'Name must be at least 2 characters.' : undefined;
        break;
      case 'email':
        errors.email = !this.isValidEmail(value)
          ? 'Please enter a valid email address.'
          : undefined;
        break;
      case 'subject':
        errors.subject =
          value.trim().length < 3 ? 'Subject must be at least 3 characters.' : undefined;
        break;
      case 'message':
        errors.message =
          value.trim().length < 10 ? 'Message must be at least 10 characters.' : undefined;
        break;
    }

    this.errors.set(errors);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isFormValid(): boolean {
    const f = this.form();
    return (
      f.name.trim().length >= 2 &&
      this.isValidEmail(f.email) &&
      f.subject.trim().length >= 3 &&
      f.message.trim().length >= 10
    );
  }

  markTouched(field: keyof FormData): void {
    this.touched.update((t) => ({ ...t, [field]: true }));
    this.validateField(field);
  }

  async onSubmit(event: Event): Promise<void> {
    // Native (submit) instead of (ngSubmit): FormsModule/NgForm isn't used on
    // this page, so the default GET navigation must be prevented manually.
    event.preventDefault();

    const fields: (keyof FormData)[] = ['name', 'email', 'subject', 'message'];
    fields.forEach((f) => {
      this.touched.update((t) => ({ ...t, [f]: true }));
      this.validateField(f);
    });

    if (!this.isFormValid()) return;

    const data = this.form();
    await this.contactService.sendMessage({
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    });
  }

  resetForm(): void {
    this.contactService.reset();
    this.form.set({ name: '', email: '', subject: '', message: '' });
    this.errors.set({});
    this.touched.set({});
  }
}
