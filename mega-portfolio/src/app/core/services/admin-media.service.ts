import { Injectable, computed, inject, signal } from '@angular/core';

import { FirestoreService } from '@core/firebase/firestore.service';
import { StorageService } from '@core/firebase/storage.service';
import { MediaItem } from '@core/models/media.model';

const COLLECTION = 'media';

@Injectable({ providedIn: 'root' })
export class AdminMediaService {
  private readonly firestore = inject(FirestoreService);
  private readonly storage = inject(StorageService);

  readonly media = signal<MediaItem[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly uploading = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly currentFolder = signal<string>('all');

  readonly filtered = computed<MediaItem[]>(() => {
    let items = this.media();
    const q = this.searchQuery().trim().toLowerCase();
    if (q) items = items.filter((m) => m.name.toLowerCase().includes(q));
    const folder = this.currentFolder();
    if (folder !== 'all') items = items.filter((m) => m.folder === folder);
    return [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  readonly folders = computed<string[]>(() => {
    const set = new Set(this.media().map((m) => m.folder));
    return ['all', ...Array.from(set).sort()];
  });

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const items = await this.firestore.query<MediaItem>(COLLECTION);
      this.media.set(items);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load media.');
    } finally {
      this.loading.set(false);
    }
  }

  async upload(file: File, folder: string): Promise<void> {
    this.uploading.set(true);
    this.error.set('');
    try {
      const uploaded = await this.storage.uploadFile(file, folder);
      const item: Omit<MediaItem, 'id'> = {
        name: uploaded.name,
        url: uploaded.url,
        path: uploaded.path,
        folder,
        size: uploaded.size,
        type: uploaded.type,
        createdAt: new Date(),
      };
      await this.firestore.create(COLLECTION, item);
      await this.load();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      this.uploading.set(false);
    }
  }

  async delete(id: string, path: string): Promise<void> {
    try {
      await this.storage.deleteFile(path);
      await this.firestore.delete(COLLECTION, id);
      await this.load();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  setSearch(q: string): void {
    this.searchQuery.set(q);
  }

  setFolder(folder: string): void {
    this.currentFolder.set(folder);
  }
}
