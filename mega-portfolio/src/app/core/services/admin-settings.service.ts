import { Injectable, inject, signal } from '@angular/core';

import { FirestoreService } from '@core/firebase/firestore.service';
import { SiteSettings } from '@core/models/settings.model';

const COLLECTION = 'settings';
const DOC_ID = 'site';

@Injectable({ providedIn: 'root' })
export class AdminSettingsService {
  private readonly firestore = inject(FirestoreService);

  readonly settings = signal<SiteSettings | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly saving = signal<boolean>(false);
  readonly saved = signal<boolean>(false);

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const data = await this.firestore.getDocument<SiteSettings>(`${COLLECTION}/${DOC_ID}`);
      this.settings.set(data);
    } catch {
      const defaultSettings: SiteSettings = {
        id: DOC_ID,
        siteName: 'Ahmed Osama',
        siteDescription: 'Portfolio & Blog',
        email: '',
        phone: '',
        location: '',
        github: '',
        linkedin: '',
        resumeUrl: '',
        socialLinks: [],
        updatedAt: new Date(),
      };
      this.settings.set(defaultSettings);
    } finally {
      this.loading.set(false);
    }
  }

  async save(data: Partial<SiteSettings>): Promise<void> {
    this.saving.set(true);
    this.error.set('');
    this.saved.set(false);
    try {
      const payload = { ...data, updatedAt: new Date() };
      await this.firestore.update(COLLECTION, DOC_ID, payload);
      this.settings.update((current) => (current ? { ...current, ...payload } : null));
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 3000);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      this.saving.set(false);
    }
  }
}
