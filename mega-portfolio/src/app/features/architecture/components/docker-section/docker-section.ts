import { Component, afterNextRender, ElementRef, inject, DestroyRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AnimationService } from '@core/services/animation.service';
import {
  DEPLOYMENT_PIPELINE,
  TECH_STACK,
  DeploymentStep,
  TechStackItem,
} from '@core/data/architecture.data';

@Component({
  selector: 'app-docker-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './docker-section.html',
  styleUrl: './docker-section.scss',
})
export class DockerSection {
  private readonly el = inject(ElementRef);
  private readonly animations = inject(AnimationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pipeline: DeploymentStep[] = DEPLOYMENT_PIPELINE;
  readonly techStack: TechStackItem[] = TECH_STACK;

  constructor() {
    afterNextRender(async () => {
      const host = this.el.nativeElement as HTMLElement;
      const elements = Array.from(host.querySelectorAll('.reveal'));
      const cleanup = await this.animations.reveal(elements);
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
