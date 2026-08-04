import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminSidebar } from '@features/admin/layout/admin-sidebar/admin-sidebar';
import { AdminNavbar } from '@features/admin/layout/admin-navbar/admin-navbar';
import { AdminAuthService } from '@core/services/admin-auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebar, AdminNavbar],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss',
})
export class AdminShell {
  readonly sidebarOpen = signal<boolean>(false);
  readonly adminAuth = inject(AdminAuthService);

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
