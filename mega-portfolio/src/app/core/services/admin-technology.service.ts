import { Injectable, computed, inject, signal } from '@angular/core';
import { orderBy } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { Technology } from '@core/models/technology.model';

const COLLECTION = 'technologies';

@Injectable({ providedIn: 'root' })
export class AdminTechnologyService {
  private readonly firestore = inject(FirestoreService);

  readonly technologies = signal<Technology[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly filterCategory = signal<string>('All');
  readonly sortBy = signal<string>('order');
  readonly sortDir = signal<'asc' | 'desc'>('asc');

  readonly filtered = computed<Technology[]>(() => {
    let items = this.technologies();
    const q = this.searchQuery().trim().toLowerCase();
    if (q) items = items.filter((t) => t.name.toLowerCase().includes(q));
    const cat = this.filterCategory();
    if (cat !== 'All') items = items.filter((t) => t.category === cat);
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const sortBy = this.sortBy();
    return [...items].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortBy];
      const bv = (b as unknown as Record<string, unknown>)[sortBy];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  });

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const items = await this.firestore.query<Technology>(
        COLLECTION,
        orderBy(this.sortBy(), this.sortDir()),
      );
      this.technologies.set(items);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load technologies.');
    } finally {
      this.loading.set(false);
    }
  }

  async create(data: Omit<Technology, 'id'>): Promise<string> {
    const ref = await this.firestore.create(COLLECTION, data);
    await this.load();
    return ref.id;
  }

  async update(id: string, data: Partial<Technology>): Promise<void> {
    await this.firestore.update(COLLECTION, id, { ...data, updatedAt: new Date() });
    await this.load();
  }

  async delete(id: string): Promise<void> {
    await this.firestore.delete(COLLECTION, id);
    await this.load();
  }

  setSearch(q: string): void {
    this.searchQuery.set(q);
  }

  setFilterCategory(cat: string): void {
    this.filterCategory.set(cat);
  }
}
