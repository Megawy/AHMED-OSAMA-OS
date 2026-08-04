import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminCard } from '@features/admin/components/admin-card/admin-card';
import { AdminSelect } from '@features/admin/components/admin-select/admin-select';

import { AdminTechnologyService } from '@core/services/admin-technology.service';
import { TECHNOLOGY_CATEGORIES, type Technology } from '@core/models/technology.model';

@Component({
  selector: 'app-admin-technologies',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminCard, AdminSelect],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
})
export class AdminTechnologies implements OnInit {
  private readonly service = inject(AdminTechnologyService);

  readonly categories = TECHNOLOGY_CATEGORIES;

  readonly showModal = signal<boolean>(false);
  readonly editingId = signal<string | null>(null);
  readonly showDeleteConfirm = signal<string | null>(null);
  readonly form = signal<Partial<Technology>>({});
  readonly saving = signal<boolean>(false);

  readonly filtered = this.service.filtered;
  readonly loading = this.service.loading;
  readonly error = this.service.error;
  readonly searchQuery = this.service.searchQuery;
  readonly filterCategory = this.service.filterCategory;

  ngOnInit(): void {
    this.service.load();
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.set({
      name: '',
      icon: '',
      color: '#00e5ff',
      category: 'Backend',
      yearsOfExperience: 0,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.showModal.set(true);
  }

  openEdit(item: Technology): void {
    this.editingId.set(item.id ?? null);
    this.form.set({ ...item });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
    this.form.set({});
  }

  updateField<K extends keyof Technology>(key: K, value: Technology[K]): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      const data = this.form() as Omit<Technology, 'id'>;
      if (this.editingId()) {
        await this.service.update(this.editingId()!, data);
      } else {
        await this.service.create(data);
      }
      this.closeModal();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(id: string): void {
    this.showDeleteConfirm.set(id);
  }

  async doDelete(): Promise<void> {
    const id = this.showDeleteConfirm();
    if (!id) return;
    await this.service.delete(id);
    this.showDeleteConfirm.set(null);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.service.setSearch(value);
  }

  onCategoryChange(value: string): void {
    this.service.setFilterCategory(value);
  }
}
