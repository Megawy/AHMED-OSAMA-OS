import { Injectable, computed, inject, signal } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { StorageService } from '@core/firebase/storage.service';
import { Project, ProjectCategory, ProjectStatus } from '@core/models/project.model';

const COLLECTION = 'projects';

@Injectable({ providedIn: 'root' })
export class AdminProjectService {
  private readonly firestore = inject(FirestoreService);
  private readonly storage = inject(StorageService);

  readonly projects = signal<Project[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly filterCategory = signal<ProjectCategory | 'All'>('All');
  readonly filterStatus = signal<ProjectStatus | 'All'>('All');
  readonly sortBy = signal<string>('order');
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalCount = signal<number>(0);

  readonly filteredProjects = computed<Project[]>(() => {
    let items = this.projects();

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q),
      );
    }

    const cat = this.filterCategory();
    if (cat !== 'All') {
      items = items.filter((p) => p.category === cat);
    }

    const status = this.filterStatus();
    if (status !== 'All') {
      items = items.filter((p) => p.status === status);
    }

    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const sortBy = this.sortBy();
    items = [...items].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortBy];
      const bv = (b as unknown as Record<string, unknown>)[sortBy];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });

    return items;
  });

  readonly paginatedProjects = computed<Project[]>(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProjects().slice(start, start + this.pageSize());
  });

  readonly totalPages = computed<number>(() =>
    Math.max(1, Math.ceil(this.filteredProjects().length / this.pageSize())),
  );

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const items = await this.firestore.query<Project>(
        COLLECTION,
        orderBy(this.sortBy(), this.sortDir()),
      );
      this.projects.set(items);
      this.totalCount.set(items.length);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load projects.');
    } finally {
      this.loading.set(false);
    }
  }

  async create(data: Omit<Project, 'id'>): Promise<string> {
    const ref = await this.firestore.create(COLLECTION, data);
    await this.load();
    return ref.id;
  }

  async update(id: string, data: Partial<Project>): Promise<void> {
    await this.firestore.update(COLLECTION, id, { ...data, updatedAt: new Date() });
    await this.load();
  }

  async delete(id: string): Promise<void> {
    await this.firestore.delete(COLLECTION, id);
    await this.load();
  }

  async toggleFeatured(id: string, current: boolean): Promise<void> {
    await this.update(id, { featured: !current });
  }

  async uploadCover(file: File): Promise<{ url: string; path: string }> {
    const result = await this.storage.uploadFile(file, 'projects/covers');
    return { url: result.url, path: result.path };
  }

  async uploadGalleryImage(file: File): Promise<{ url: string; path: string }> {
    const result = await this.storage.uploadFile(file, 'projects/gallery');
    return { url: result.url, path: result.path };
  }

  async deleteImage(path: string): Promise<void> {
    await this.storage.deleteFile(path);
  }

  setSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  setFilterCategory(cat: ProjectCategory | 'All'): void {
    this.filterCategory.set(cat);
    this.currentPage.set(1);
  }

  setFilterStatus(status: ProjectStatus | 'All'): void {
    this.filterStatus.set(status);
    this.currentPage.set(1);
  }

  setSort(field: string): void {
    if (this.sortBy() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDir.set('asc');
    }
  }

  setPage(page: number): void {
    this.currentPage.set(Math.max(1, Math.min(page, this.totalPages())));
  }
}
