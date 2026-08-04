import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '@shared/components/language-switcher/language-switcher';
import { LanguageService } from '@core/services/language.service';

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

  onClose(): void {
    this.close.emit();
  }
}
