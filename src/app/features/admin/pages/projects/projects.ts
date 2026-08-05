import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminProjectService } from '@core/services/admin-project.service';
import { AdminTechnologyService } from '@core/services/admin-technology.service';
import { AdminCard } from '@features/admin/components/admin-card/admin-card';
import { AdminSelect } from '@features/admin/components/admin-select/admin-select';
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from '@core/models/project.model';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminCard, AdminSelect],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class AdminProjects implements OnInit {
  private readonly service = inject(AdminProjectService);
  readonly techService = inject(AdminTechnologyService);

  private static readonly MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB

  readonly categories = PROJECT_CATEGORIES;
  readonly formCategories = PROJECT_CATEGORIES.filter((c) => c !== 'All');
  readonly statuses = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

  readonly showModal = signal<boolean>(false);
  readonly editingId = signal<string | null>(null);
  readonly showDeleteConfirm = signal<string | null>(null);
  readonly form = signal<Partial<Project>>({});
  readonly saving = signal<boolean>(false);
  readonly uploadingCover = signal<boolean>(false);
  readonly isDragOver = signal<boolean>(false);

  readonly filtered = this.service.filteredProjects;
  readonly paginated = this.service.paginatedProjects;
  readonly totalPages = this.service.totalPages;
  readonly currentPage = this.service.currentPage;
  readonly loading = this.service.loading;
  readonly error = this.service.error;
  readonly searchQuery = this.service.searchQuery;
  readonly filterCategory = this.service.filterCategory;
  readonly filterStatus = this.service.filterStatus;

  readonly isEditing = computed<boolean>(() => this.editingId() !== null);
  readonly shortDescCount = computed<number>(() => (this.form().shortDescription ?? '').length);
  readonly descCount = computed<number>(() => (this.form().description ?? '').length);

  ngOnInit(): void {
    this.service.load();
    this.techService.load();
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.set({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      coverImage: '',
      gallery: [],
      technologies: [],
      github: '',
      liveDemo: '',
      category: 'Backend',
      featured: false,
      status: 'In Progress',
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.showModal.set(true);
  }

  openEdit(project: Project): void {
    this.editingId.set(project.id ?? null);
    this.form.set({ ...project });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
    this.form.set({});
  }

  updateField<K extends keyof Project>(key: K, value: Project[K]): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      const data = this.form() as Omit<Project, 'id'>;
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
    this.closeModal();
  }

  deleteFromEditor(): void {
    const id = this.editingId();
    if (id) this.confirmDelete(id);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  async toggleFeatured(project: Project): Promise<void> {
    await this.service.toggleFeatured(project.id!, project.featured);
  }

  isTechSelected(id: string): boolean {
    return (this.form().technologies ?? []).includes(id);
  }

  toggleTechnology(id: string): void {
    const current = this.form().technologies ?? [];
    const next = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
    this.updateField('technologies', next);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.service.setSearch(value);
  }

  onCategoryChange(value: string): void {
    this.service.setFilterCategory(value as ProjectCategory | 'All');
  }

  onStatusChange(value: string): void {
    this.service.setFilterStatus(value as ProjectStatus | 'All');
  }

  onPage(page: number): void {
    this.service.setPage(page);
  }

  generateSlug(): void {
    const title = this.form().title ?? '';
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    this.updateField('slug', slug);
  }

  async onCoverUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    const file = input.files[0];
    input.value = '';
    if (file.size > AdminProjects.MAX_COVER_SIZE) {
      this.error.set(
        'Image is larger than 5MB — compress it or paste an image URL in the Media section instead.',
      );
      return;
    }
    this.uploadingCover.set(true);
    try {
      const result = await this.service.uploadCover(file);
      this.updateField('coverImage', result.url);
    } catch (err) {
      this.error.set(
        (err instanceof Error ? err.message : 'Upload failed.') +
          ' You can paste an image URL below instead.',
      );
    } finally {
      this.uploadingCover.set(false);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  async onCoverDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > AdminProjects.MAX_COVER_SIZE) {
      this.error.set(
        'Image is larger than 5MB — compress it or paste an image URL in the Media section instead.',
      );
      return;
    }
    this.uploadingCover.set(true);
    try {
      const result = await this.service.uploadCover(file);
      this.updateField('coverImage', result.url);
    } catch (err) {
      this.error.set(
        (err instanceof Error ? err.message : 'Upload failed.') +
          ' You can paste an image URL below instead.',
      );
    } finally {
      this.uploadingCover.set(false);
    }
  }

  async onGalleryUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const current = this.form().gallery ?? [];
    const uploaded: string[] = [];
    for (const file of Array.from(input.files)) {
      const result = await this.service.uploadGalleryImage(file);
      uploaded.push(result.url);
    }
    this.updateField('gallery', [...current, ...uploaded]);
  }
}
