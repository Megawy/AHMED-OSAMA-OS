import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminCard } from '@features/admin/components/admin-card/admin-card';

import { AdminExperienceService } from '@core/services/admin-experience.service';
import { type Experience } from '@core/models/experience.model';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminCard],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class AdminExperience implements OnInit {
  private readonly service = inject(AdminExperienceService);

  readonly showModal = signal<boolean>(false);
  readonly editingId = signal<string | null>(null);
  readonly showDeleteConfirm = signal<string | null>(null);
  readonly form = signal<Partial<Experience>>({});
  readonly saving = signal<boolean>(false);

  readonly filtered = this.service.filtered;
  readonly loading = this.service.loading;
  readonly error = this.service.error;
  readonly searchQuery = this.service.searchQuery;

  ngOnInit(): void {
    this.service.load();
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.set({
      company: '',
      role: '',
      location: '',
      startDate: new Date(),
      endDate: null,
      current: false,
      description: '',
      achievements: [],
      technologies: [],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.showModal.set(true);
  }

  openEdit(item: Experience): void {
    this.editingId.set(item.id ?? null);
    this.form.set({ ...item });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
    this.form.set({});
  }

  updateField<K extends keyof Experience>(key: K, value: Experience[K]): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  onCurrentJobChange(checked: boolean): void {
    this.updateField('current', checked);
    if (checked) {
      this.updateField('endDate', null);
    }
  }

  toDateInputValue(date: Date | null | undefined): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  }

  onStartDateChange(value: string): void {
    if (value) this.updateField('startDate', new Date(value));
  }

  onEndDateChange(value: string): void {
    if (value) this.updateField('endDate', new Date(value));
    else this.updateField('endDate', null);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      const data = this.form() as Omit<Experience, 'id'>;
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
}
