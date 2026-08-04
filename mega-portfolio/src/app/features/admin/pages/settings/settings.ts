import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminCard } from '@features/admin/components/admin-card/admin-card';

import { AdminSettingsService } from '@core/services/admin-settings.service';
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
}
