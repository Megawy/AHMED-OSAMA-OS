import { Component, Input, Output, EventEmitter, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '@shared/components/language-switcher/language-switcher';
import { LanguageService } from '@core/services/language.service';
import { SettingsService } from '@core/services/settings.service';

@Component({
  selector: 'app-mobile-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitcher],
  templateUrl: './mobile-sidebar.html',
  styleUrl: './mobile-sidebar.scss',
})
export class MobileSidebar {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  readonly languageService = inject(LanguageService);
  private readonly settingsService = inject(SettingsService);
  readonly resumeUrl = signal<string>('');

  constructor() {
    afterNextRender(async () => {
      this.resumeUrl.set(await this.settingsService.getResumeUrl());
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
