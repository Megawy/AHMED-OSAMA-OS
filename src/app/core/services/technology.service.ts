import { Injectable, inject } from '@angular/core';
import { orderBy } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { type Technology } from '@core/models/technology.model';

const COLLECTION = 'technologies';

@Injectable({ providedIn: 'root' })
export class TechnologyService {
  private readonly firestore = inject(FirestoreService);

  private listCache: Promise<Technology[]> | null = null;
  private nameMapCache: Promise<Record<string, string>> | null = null;

  /** All technologies ordered by display order — cached after first fetch. */
  getTechnologies(): Promise<Technology[]> {
    this.listCache ??= this.firestore
      .query<Technology>(COLLECTION, orderBy('order', 'asc'))
      .catch(() => []);
    return this.listCache;
  }

  /**
   * Lookup map for resolving stored technology references (document IDs or
   * names, case-insensitive) to display names.
   */
  getNameMap(): Promise<Record<string, string>> {
    this.nameMapCache ??= this.getTechnologies().then((items) => {
      const map: Record<string, string> = {};
      for (const tech of items) {
        if (tech.id) map[tech.id.toLowerCase()] = tech.name;
        map[tech.name.toLowerCase()] = tech.name;
      }
      return map;
    });
    return this.nameMapCache;
  }
}
