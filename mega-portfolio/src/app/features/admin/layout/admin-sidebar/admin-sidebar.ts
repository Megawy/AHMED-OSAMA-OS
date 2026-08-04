import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminAuthService } from '@core/services/admin-auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  exact: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss',
})
export class AdminSidebar {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  private readonly adminAuth = inject(AdminAuthService);
  readonly admin = this.adminAuth.admin;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/admin', exact: true },
    { label: 'Projects', icon: '🚀', route: '/admin/projects', exact: false },
    { label: 'Technologies', icon: '⚡', route: '/admin/technologies', exact: false },
    { label: 'Skills', icon: '🎯', route: '/admin/skills', exact: false },
    { label: 'Experience', icon: '💼', route: '/admin/experience', exact: false },
    { label: 'Messages', icon: '✉️', route: '/admin/messages', exact: false },
    { label: 'Settings', icon: '⚙️', route: '/admin/settings', exact: false },
    { label: 'Media', icon: '🖼️', route: '/admin/media', exact: false },
  ];

  onClose(): void {
    this.close.emit();
  }

  async onLogout(): Promise<void> {
    await this.adminAuth.logout();
    this.onClose();
  }
}
