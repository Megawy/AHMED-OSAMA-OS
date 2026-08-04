import { Injectable, computed, inject, signal } from '@angular/core';
import { orderBy } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { Experience } from '@core/models/experience.model';

const COLLECTION = 'experience';

@Injectable({ providedIn: 'root' })
export class AdminExperienceService {
  private readonly firestore = inject(FirestoreService);

  readonly experiences = signal<Experience[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly searchQuery = signal<string>('');

  readonly filtered = computed<Experience[]>(() => {
    let items = this.experiences();
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      items = items.filter(
        (e) => e.company.toLowerCase().includes(q) || e.role.toLowerCase().includes(q),
      );
    }
    return [...items].sort((a, b) => a.order - b.order);
  });

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const items = await this.firestore.query<Experience>(COLLECTION, orderBy('order', 'asc'));
      this.experiences.set(items);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load experiences.');
    } finally {
      this.loading.set(false);
    }
  }

  async create(data: Omit<Experience, 'id'>): Promise<string> {
    const ref = await this.firestore.create(COLLECTION, data);
    await this.load();
    return ref.id;
  }

  async update(id: string, data: Partial<Experience>): Promise<void> {
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
}
