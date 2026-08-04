import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';

import { RADAR } from '@core/data/radar.data';
import { AnimationService } from '@core/services/animation.service';

@Component({
  selector: 'app-tech-radar',
  standalone: true,
  imports: [],
  templateUrl: './tech-radar.html',
  styleUrl: './tech-radar.scss',
})
export class TechRadar {
  radar = RADAR;

  private animation = inject(AnimationService);
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(async () => {
      const host = this.el.nativeElement as HTMLElement;
      const elements = [...host.querySelectorAll('.radar-card')];
      this.cleanup = await this.animation.reveal(elements);
    });

    this.destroyRef.onDestroy(() => this.cleanup?.());
  }
}
