import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminMessageService } from '@core/services/admin-message.service';
import {
  CONTACT_STATUS_LABELS,
  type ContactMessage,
  type ContactStatus,
} from '@core/models/contact-message.model';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class AdminMessages implements OnInit {
  private readonly service = inject(AdminMessageService);

  readonly statusLabels = CONTACT_STATUS_LABELS;
  readonly statusOptions: (ContactStatus | 'all')[] = ['all', 'new', 'read', 'replied', 'archived'];

  readonly showDeleteConfirm = signal<string | null>(null);
  readonly selectedMessage = signal<ContactMessage | null>(null);

  readonly filtered = this.service.filtered;
  readonly loading = this.service.loading;
  readonly error = this.service.error;
  readonly searchQuery = this.service.searchQuery;
  readonly filterStatus = this.service.filterStatus;
  readonly unreadCount = this.service.unreadCount;

  readonly statusLabelMap: Record<ContactStatus | 'all', string> = {
    all: 'All',
    new: 'New',
    read: 'Read',
    replied: 'Replied',
    archived: 'Archived',
  };

  ngOnInit(): void {
    this.service.load();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.service.setSearch(value);
  }

  onStatusChange(value: string): void {
    this.service.setFilterStatus(value as ContactStatus | 'all');
  }

  viewMessage(msg: ContactMessage): void {
    this.selectedMessage.set(msg);
    if (msg.status === 'new' && msg.id) {
      this.service.updateStatus(msg.id, 'read');
    }
  }

  closeMessage(): void {
    this.selectedMessage.set(null);
  }

  async markAsRead(msg: ContactMessage): Promise<void> {
    if (msg.id) await this.service.updateStatus(msg.id, 'read');
  }

  async markAsReplied(msg: ContactMessage): Promise<void> {
    if (msg.id) await this.service.updateStatus(msg.id, 'replied');
  }

  async archive(msg: ContactMessage): Promise<void> {
    if (msg.id) await this.service.updateStatus(msg.id, 'archived');
  }

  confirmDelete(id: string): void {
    this.showDeleteConfirm.set(id);
  }

  async doDelete(): Promise<void> {
    const id = this.showDeleteConfirm();
    if (!id) return;
    await this.service.delete(id);
    this.showDeleteConfirm.set(null);
    if (this.selectedMessage()?.id === id) {
      this.selectedMessage.set(null);
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'new':
        return 'new';
      case 'read':
        return 'read';
      case 'archived':
        return 'archived';
      default:
        return '';
    }
  }
}
