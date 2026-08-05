import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminCard } from '@features/admin/components/admin-card/admin-card';

import { AdminSettingsService } from '@core/services/admin-settings.service';
import { LOCAL_CV_PATH } from '@core/services/settings.service';
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
}
