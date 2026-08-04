import { Injectable, inject, signal, computed } from '@angular/core';
import { orderBy } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { ContactMessage, ContactStatus } from '@core/models/contact-message.model';

const COLLECTION = 'messages';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly firestore = inject(FirestoreService);

  readonly sending = signal<boolean>(false);
  readonly sent = signal<boolean>(false);
  readonly error = signal<string>('');

  readonly canSubmit = computed<boolean>(() => !this.sending() && !this.sent());

  async sendMessage(message: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<void> {
    this.sending.set(true);
    this.error.set('');

    try {
      const payload: Omit<ContactMessage, 'id'> = {
        ...message,
        status: 'new' as ContactStatus,
        createdAt: new Date(),
      };

      await this.firestore.create(COLLECTION, payload);
      this.sent.set(true);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : 'Failed to send message.');
    } finally {
      this.sending.set(false);
    }
  }

  getMessages(): Promise<ContactMessage[]> {
    return this.firestore.query<ContactMessage>(COLLECTION, orderBy('createdAt', 'desc'));
  }

  getMessage(id: string): Promise<ContactMessage> {
    return this.firestore.getDocument<ContactMessage>(`${COLLECTION}/${id}`);
  }

  updateStatus(id: string, status: ContactStatus): Promise<void> {
    return this.firestore.update(COLLECTION, id, { status });
  }

  reset(): void {
    this.sent.set(false);
    this.error.set('');
  }
}
