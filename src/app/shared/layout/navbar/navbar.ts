import {
  Component,
  HostListener,
  Output,
  EventEmitter,
  inject,
  signal,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '@shared/components/language-switcher/language-switcher';
import { LanguageService } from '@core/services/language.service';
import { SettingsService } from '@core/services/settings.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitcher],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Output() toggleMobileSidebar = new EventEmitter<void>();

  readonly languageService = inject(LanguageService);
  private readonly settingsService = inject(SettingsService);
  readonly resumeUrl = signal<string>('');
  isScrolled = false;

  constructor() {
    afterNextRender(async () => {
      this.resumeUrl.set(await this.settingsService.getResumeUrl());
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 30;
  }

  onToggleSidebar(): void {
    this.toggleMobileSidebar.emit();
  }
}
