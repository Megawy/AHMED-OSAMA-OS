import { Injectable, inject } from '@angular/core';

import { FirestoreService } from '@core/firebase/firestore.service';
import { type SiteSettings } from '@core/models/settings.model';

const DOC_PATH = 'settings/site';

/** CV bundled with the app — used when no resume is uploaded to Firebase Storage. */
export const LOCAL_CV_PATH = '/assets/cv/Ahmed_Osama_Abdalla_Backend_DotNet_Developer_CV.pdf';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly firestore = inject(FirestoreService);
  private cache: Promise<SiteSettings | null> | null = null;

  /** Returns the site settings document, cached after the first fetch. */
  getSettings(): Promise<SiteSettings | null> {
    this.cache ??= this.firestore.getDocument<SiteSettings>(DOC_PATH).catch(() => null);
    return this.cache;
  }

  /**
   * The CV / resume URL: the one uploaded via the admin panel if present,
   * otherwise the CV bundled with the app.
   */
  async getResumeUrl(): Promise<string> {
    const settings = await this.getSettings();
    return settings?.resumeUrl || LOCAL_CV_PATH;
  }
}
