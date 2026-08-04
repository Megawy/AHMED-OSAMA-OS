import { Injectable, inject, signal } from '@angular/core';

import { FirestoreService } from '@core/firebase/firestore.service';
import { StorageService } from '@core/firebase/storage.service';
import { SiteSettings } from '@core/models/settings.model';

const COLLECTION = 'settings';
const DOC_ID = 'site';

export const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable({ providedIn: 'root' })
export class AdminSettingsService {
  private readonly firestore = inject(FirestoreService);
  private readonly storage = inject(StorageService);

  readonly settings = signal<SiteSettings | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly saving = signal<boolean>(false);
  readonly saved = signal<boolean>(false);
  readonly uploadingCv = signal<boolean>(false);

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

  async uploadCv(file: File): Promise<string> {
    if (file.type !== 'application/pdf') {
      throw new Error('The CV must be a PDF file.');
    }
    if (file.size > MAX_CV_SIZE) {
      throw new Error('The CV is too large — maximum size is 5MB.');
    }
    this.uploadingCv.set(true);
    this.error.set('');
    try {
      // 'general' is a public-read folder in storage.rules.
      const uploaded = await this.storage.uploadFile(file, 'general');
      return uploaded.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'CV upload failed. Please try again.';
      this.error.set(message);
      throw err;
    } finally {
      this.uploadingCv.set(false);
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
