import {
  Injectable,
  inject,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ProjectService } from '@core/services/project.service';
import { TechnologyService } from '@core/services/technology.service';
import { Project, ProjectCategory } from '@core/models/project.model';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

const ITEMS_PER_PAGE = 9;

@Injectable({ providedIn: 'root' })
export class ProjectStateService {
  private readonly projectService = inject(ProjectService);
  private readonly technologyService = inject(TechnologyService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly allProjects = signal<Project[]>([]);
  readonly collectionTechCount = signal<number>(0);
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<ProjectCategory>('All');
  readonly currentPage = signal<number>(1);
  readonly loadingState = signal<LoadingState>('idle');
  readonly errorMessage = signal<string>('');
  readonly selectedProject = signal<Project | null>(null);

  readonly filteredProjects = computed<Project[]>(() => {
    const all = this.allProjects();
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();

    let filtered = all;

    if (category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.technologies.some((t) => t.toLowerCase().includes(query))
      );
    }

    return filtered;
  });

  readonly totalPages = computed<number>(() =>
    Math.max(1, Math.ceil(this.filteredProjects().length / ITEMS_PER_PAGE))
  );

  readonly paginatedProjects = computed<Project[]>(() => {
    const page = this.currentPage();
    const start = (page - 1) * ITEMS_PER_PAGE;
    return this.filteredProjects().slice(start, start + ITEMS_PER_PAGE);
  });

  readonly totalCount = computed<number>(() => this.allProjects().length);

  readonly featuredCount = computed<number>(
    () => this.allProjects().filter((p) => p.featured).length
  );

  readonly technologyCount = computed<number>(() => {
    // Prefer the live count from the technologies collection; fall back to the
    // distinct technologies referenced by projects.
    const collectionCount = this.collectionTechCount();
    if (collectionCount > 0) return collectionCount;
    const techs = new Set<string>();
    for (const project of this.allProjects()) {
      for (const tech of project.technologies) {
        techs.add(tech);
      }
    }
    return techs.size;
  });

  readonly resultCount = computed<number>(() => this.filteredProjects().length);

  readonly isEmpty = computed<boolean>(
    () =>
      this.loadingState() === 'success' && this.filteredProjects().length === 0
  );

  readonly isLoading = computed<boolean>(
    () => this.loadingState() === 'loading'
  );

  readonly hasError = computed<boolean>(() => this.loadingState() === 'error');

  readonly showPagination = computed<boolean>(
    () =>
      this.loadingState() === 'success' &&
      this.filteredProjects().length > ITEMS_PER_PAGE
  );

  async loadProjects(): Promise<void> {
    if (this.loadingState() === 'loading') return;

    this.loadingState.set('loading');
    this.errorMessage.set('');

    try {
      const [projects, technologies] = await Promise.all([
        this.projectService.getProjects(),
        this.technologyService.getTechnologies(),
      ]);
      this.allProjects.set(projects);
      this.collectionTechCount.set(technologies.length);
      this.loadingState.set('success');
    } catch (err: unknown) {
      this.loadingState.set('error');
      this.errorMessage.set(
        err instanceof Error ? err.message : 'Failed to load projects.'
      );
    }
  }

  retry(): void {
    this.loadingState.set('idle');
    this.loadProjects();
  }

  setSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  setCategory(category: ProjectCategory): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  setPage(page: number): void {
    const clamped = Math.min(Math.max(1, page), this.totalPages());
    this.currentPage.set(clamped);

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  openModal(project: Project): void {
    this.selectedProject.set(project);

    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.selectedProject.set(null);

    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
