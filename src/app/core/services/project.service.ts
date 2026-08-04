import { Injectable, inject } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';

import { FirestoreService } from '@core/firebase/firestore.service';
import { Project, ProjectCategory, normalizeProject } from '@core/models/project.model';

const COLLECTION = 'projects';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly firestore = inject(FirestoreService);

  getProjects(): Promise<Project[]> {
    return this.firestore
      .query<Project>(COLLECTION, orderBy('order', 'asc'))
      .then((items) => items.map(normalizeProject));
  }

  getFeaturedProjects(): Promise<Project[]> {
    return this.firestore
      .query<Project>(COLLECTION, where('featured', '==', true), orderBy('order', 'asc'))
      .then((items) => items.map(normalizeProject));
  }

  getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
    // Legacy docs may store lowercase values, so filter client-side instead of
    // relying on an exact-match Firestore query.
    return this.getProjects().then((items) => items.filter((p) => p.category === category));
  }

  getProject(id: string): Promise<Project> {
    return this.firestore
      .getDocument<Project>(`${COLLECTION}/${id}`)
      .then(normalizeProject);
  }

  getProjectBySlug(slug: string): Promise<Project> {
    return this.firestore
      .query<Project>(COLLECTION, where('slug', '==', slug))
      .then((projects) => {
        if (!projects.length) {
          throw new Error(`Project not found: ${slug}`);
        }
        return normalizeProject(projects[0]);
      });
  }

  create(project: Omit<Project, 'id'>): Promise<{ id: string }> {
    return this.firestore.create(COLLECTION, project).then((ref) => ({ id: ref.id }));
  }

  update(id: string, project: Partial<Project>): Promise<void> {
    return this.firestore.update(COLLECTION, id, project);
  }

  delete(id: string): Promise<void> {
    return this.firestore.delete(COLLECTION, id);
  }
}
