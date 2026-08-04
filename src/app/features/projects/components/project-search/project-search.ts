import { Component, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProjectStateService } from '../../services/project-state.service';

@Component({
  selector: 'app-project-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './project-search.html',
  styleUrl: './project-search.scss',
})
export class ProjectSearch {
  private readonly state = inject(ProjectStateService);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly search = signal('');

  // Expose only what the template needs
  readonly resultCount = this.state.resultCount;
  readonly isLoading = this.state.isLoading;

  constructor() {
    effect(() => {
      const query = this.search();

      untracked(() => {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
          this.state.setSearch(query);
        }, 280);
      });
    });
  }

  clear(): void {
    this.search.set('');
  }
}
