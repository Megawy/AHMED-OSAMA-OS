import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';

import { AnimationService } from '@core/services/animation.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  private animation = inject(AnimationService);
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(async () => {
      const host = this.el.nativeElement as HTMLElement;
      const elements = [...host.querySelectorAll('.stat-card')];
      this.cleanup = await this.animation.reveal(elements);
    });

    this.destroyRef.onDestroy(() => this.cleanup?.());
  }
}
