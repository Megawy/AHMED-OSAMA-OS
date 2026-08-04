import { Injectable, inject } from '@angular/core';

import { FirestoreService } from '@core/firebase/firestore.service';
import { type SiteSettings } from '@core/models/settings.model';

const DOC_PATH = 'settings/site';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly firestore = inject(FirestoreService);
  private cache: Promise<SiteSettings | null> | null = null;

  /** Returns the site settings document, cached after the first fetch. */
  getSettings(): Promise<SiteSettings | null> {
    this.cache ??= this.firestore.getDocument<SiteSettings>(DOC_PATH).catch(() => null);
    return this.cache;
  }

  /** Convenience accessor for the uploaded CV / resume URL. */
  async getResumeUrl(): Promise<string> {
    const settings = await this.getSettings();
    return settings?.resumeUrl ?? '';
  }
}
