import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';

import { PROJECTS } from '@core/data/projects.data';
import { AnimationService } from '@core/services/animation.service';

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [],
  templateUrl: './featured-projects.html',
  styleUrl: './featured-projects.scss',
})
export class FeaturedProjects {
  projects = PROJECTS;

  private animation = inject(AnimationService);
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(async () => {
      const host = this.el.nativeElement as HTMLElement;
      const elements = [...host.querySelectorAll('.project-card')];
      this.cleanup = await this.animation.reveal(elements);
    });

    this.destroyRef.onDestroy(() => this.cleanup?.());
  }
}
