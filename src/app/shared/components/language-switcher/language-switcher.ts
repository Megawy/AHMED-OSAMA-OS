import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <button
      type="button"
      class="lang-btn"
      (click)="languageService.toggleLanguage()"
      [attr.aria-label]="'LANG.TOGGLE' | translate"
      title="Toggle Language"
    >
      <span class="globe-icon">🌐</span>
      <span class="lang-text">
        {{ languageService.currentLang() === 'en' ? 'العربية' : 'English' }}
      </span>
    </button>
  `,
  styles: [`
    .lang-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 20px;
      border: 1px solid rgba(0, 229, 255, 0.3);
      background: rgba(0, 229, 255, 0.08);
      color: #00e5ff;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      user-select: none;
    }

    .lang-btn:hover {
      background: rgba(0, 229, 255, 0.2);
      border-color: #00e5ff;
      transform: translateY(-1px);
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.25);
    }

    .globe-icon {
      font-size: 1rem;
      line-height: 1;
    }

    .lang-text {
      font-family: inherit;
    }
  `]
})
export class LanguageSwitcher {
  readonly languageService = inject(LanguageService);
}
