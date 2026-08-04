import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminMediaService } from '@core/services/admin-media.service';
import { type MediaItem } from '@core/models/media.model';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media.html',
  styleUrl: './media.scss',
})
export class AdminMedia implements OnInit {
  private readonly service = inject(AdminMediaService);

  readonly showDeleteConfirm = signal<{ id: string; path: string } | null>(null);
  readonly uploadFolder = signal<string>('general');
  readonly copiedUrl = signal<string>('');

  readonly filtered = this.service.filtered;
  readonly folders = this.service.folders;
  readonly loading = this.service.loading;
  readonly error = this.service.error;
  readonly uploading = this.service.uploading;
  readonly searchQuery = this.service.searchQuery;
  readonly currentFolder = this.service.currentFolder;

  ngOnInit(): void {
    this.service.load();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.service.setSearch(value);
  }

  onFolderChange(value: string): void {
    this.service.setFolder(value);
  }

  async onUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    for (const file of Array.from(input.files)) {
      await this.service.upload(file, this.uploadFolder());
    }
    input.value = '';
  }

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.copiedUrl.set(url);
      setTimeout(() => this.copiedUrl.set(''), 2000);
    });
  }

  confirmDelete(id: string, path: string): void {
    this.showDeleteConfirm.set({ id, path });
  }

  async doDelete(): Promise<void> {
    const item = this.showDeleteConfirm();
    if (!item) return;
    await this.service.delete(item.id, item.path);
    this.showDeleteConfirm.set(null);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
}
