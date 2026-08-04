import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';

import { Project } from '@core/models/project.model';
import { AnimationService } from '@core/services/animation.service';
import { ProjectService } from '@core/services/project.service';

const MAX_CARDS = 3;

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [],
  templateUrl: './featured-projects.html',
  styleUrl: './featured-projects.scss',
})
export class FeaturedProjects {
  readonly projects = signal<Project[]>([]);
  readonly loaded = signal<boolean>(false);

  private animation = inject(AnimationService);
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private projectService = inject(ProjectService);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(async () => {
      try {
        let items = await this.projectService.getFeaturedProjects();
        if (!items.length) {
          // No featured flags yet — show the first projects by display order.
          items = await this.projectService.getProjects();
        }
        this.projects.set(items.slice(0, MAX_CARDS));
      } catch {
        this.projects.set([]);
      } finally {
        this.loaded.set(true);
      }

      // Wait for the cards to render, then animate them in.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const host = this.el.nativeElement as HTMLElement;
      const elements = [...host.querySelectorAll('.project-card')];
      if (elements.length) {
        this.cleanup = await this.animation.reveal(elements);
      }
    });

    this.destroyRef.onDestroy(() => this.cleanup?.());
  }
}
