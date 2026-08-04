import { Injectable, inject, signal } from '@angular/core';
import { orderBy } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { Experience } from '@core/models/experience.model';

const COLLECTION = 'experience';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly firestore = inject(FirestoreService);

  readonly experiences = signal<Experience[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');

  async loadExperiences(): Promise<void> {
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set('');

    try {
      const data = await this.firestore.query<Experience>(COLLECTION, orderBy('order', 'asc'));
      this.experiences.set(data);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load experience.');
    } finally {
      this.loading.set(false);
    }
  }

  getExperiences(): Promise<Experience[]> {
    return this.firestore.query<Experience>(COLLECTION, orderBy('order', 'asc'));
  }

  getExperience(id: string): Promise<Experience> {
    return this.firestore.getDocument<Experience>(`${COLLECTION}/${id}`);
  }
}
