import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <button class="menu-btn" (click)="toggleSidebar.emit()" aria-label="Toggle sidebar">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="navbar-right">
        <a href="/" class="site-link" target="_blank" rel="noopener" aria-label="View live site">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span>View Site</span>
        </a>
      </div>
    </header>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.5rem;
        background: rgba(3, 7, 18, 0.85);
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        min-height: 52px;
        position: sticky;
        top: 0;
        z-index: 50;
      }

      .navbar-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .menu-btn {
        display: none;
        background: transparent;
        border: none;
        color: #64748b;
        cursor: pointer;
        padding: 0.4rem;
        border-radius: 6px;
        line-height: 0;
        transition: all 0.15s;

        &:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.05);
        }
      }

      .navbar-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-inline-start: auto;
      }

      .site-link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.35rem 0.7rem;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.03);
        color: #64748b;
        text-decoration: none;
        font-size: 0.75rem;
        font-weight: 500;
        transition: all 0.15s;
        border: 1px solid rgba(255, 255, 255, 0.04);

        &:hover {
          color: #00e5ff;
          background: rgba(0, 229, 255, 0.06);
          border-color: rgba(0, 229, 255, 0.1);
        }
      }

      @media (max-width: 1024px) {
        .menu-btn {
          display: flex;
          align-items: center;
        }
      }
    `,
  ],
})
export class AdminNavbar {
  @Output() toggleSidebar = new EventEmitter<void>();
}
