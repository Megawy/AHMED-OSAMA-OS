import { Injectable, computed, inject, signal } from '@angular/core';
import { orderBy } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { Skill, SkillCategory } from '@core/models/skill.model';

const COLLECTION = 'skills';

@Injectable({ providedIn: 'root' })
export class AdminSkillService {
  private readonly firestore = inject(FirestoreService);

  readonly skills = signal<Skill[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly filterCategory = signal<SkillCategory | 'All'>('All');

  readonly filtered = computed<Skill[]>(() => {
    let items = this.skills();
    const q = this.searchQuery().trim().toLowerCase();
    if (q) items = items.filter((s) => s.name.toLowerCase().includes(q));
    const cat = this.filterCategory();
    if (cat !== 'All') items = items.filter((s) => s.category === cat);
    return [...items].sort((a, b) => a.order - b.order);
  });

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const items = await this.firestore.query<Skill>(COLLECTION, orderBy('order', 'asc'));
      this.skills.set(items);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load skills.');
    } finally {
      this.loading.set(false);
    }
  }

  async create(data: Omit<Skill, 'id'>): Promise<string> {
    const ref = await this.firestore.create(COLLECTION, data);
    await this.load();
    return ref.id;
  }

  async update(id: string, data: Partial<Skill>): Promise<void> {
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

  setFilterCategory(cat: SkillCategory | 'All'): void {
    this.filterCategory.set(cat);
  }
}
