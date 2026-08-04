import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type LanguageCode = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentLang = signal<LanguageCode>('en');
  readonly isRtl = signal<boolean>(false);

  constructor() {
    this.initLanguage();
  }

  private initLanguage(): void {
    let defaultLang: LanguageCode = 'en';

    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('app_lang') as LanguageCode | null;
      if (savedLang === 'en' || savedLang === 'ar') {
        defaultLang = savedLang;
      } else {
        const browserLang = this.translate.getBrowserLang();
        if (browserLang?.startsWith('ar')) {
          defaultLang = 'ar';
        }
      }
    }

    this.setLanguage(defaultLang);
  }

  setLanguage(lang: LanguageCode): void {
    this.currentLang.set(lang);
    this.isRtl.set(lang === 'ar');
    this.translate.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('app_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      if (lang === 'ar') {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
  }

  toggleLanguage(): void {
    const nextLang: LanguageCode = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(nextLang);
  }
}
