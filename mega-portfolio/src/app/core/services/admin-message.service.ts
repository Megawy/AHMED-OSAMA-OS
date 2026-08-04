import { Injectable, computed, inject, signal } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { ContactMessage, ContactStatus } from '@core/models/contact-message.model';

const COLLECTION = 'messages';

@Injectable({ providedIn: 'root' })
export class AdminMessageService {
  private readonly firestore = inject(FirestoreService);

  readonly messages = signal<ContactMessage[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly filterStatus = signal<ContactStatus | 'all'>('all');

  readonly filtered = computed<ContactMessage[]>(() => {
    let items = this.messages();
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      items = items.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q),
      );
    }
    const status = this.filterStatus();
    if (status !== 'all') items = items.filter((m) => m.status === status);
    return items;
  });

  readonly unreadCount = computed<number>(
    () => this.messages().filter((m) => m.status === 'new').length,
  );

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const items = await this.firestore.query<ContactMessage>(
        COLLECTION,
        orderBy('createdAt', 'desc'),
      );
      this.messages.set(items);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load messages.');
    } finally {
      this.loading.set(false);
    }
  }

  async updateStatus(id: string, status: ContactStatus): Promise<void> {
    const update: Partial<ContactMessage> = { status };
    if (status === 'read') {
      update.readAt = new Date();
    }
    await this.firestore.update(COLLECTION, id, update);
    await this.load();
  }

  async delete(id: string): Promise<void> {
    await this.firestore.delete(COLLECTION, id);
    await this.load();
  }

  async getMessagesByStatus(status: ContactStatus): Promise<ContactMessage[]> {
    return this.firestore.query<ContactMessage>(
      COLLECTION,
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
    );
  }

  setSearch(q: string): void {
    this.searchQuery.set(q);
  }

  setFilterStatus(status: ContactStatus | 'all'): void {
    this.filterStatus.set(status);
  }
}
