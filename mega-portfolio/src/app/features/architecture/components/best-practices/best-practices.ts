import { Component, afterNextRender, ElementRef, inject, DestroyRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AnimationService } from '@core/services/animation.service';
import { BEST_PRACTICES } from '@core/data/architecture.data';

@Component({
  selector: 'app-best-practices',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './best-practices.html',
  styleUrl: './best-practices.scss',
})
export class BestPractices {
  private readonly el = inject(ElementRef);
  private readonly animations = inject(AnimationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly practices = BEST_PRACTICES;

  constructor() {
    afterNextRender(async () => {
      const host = this.el.nativeElement as HTMLElement;
      const elements = Array.from(host.querySelectorAll('.reveal'));
      const cleanup = await this.animations.reveal(elements);
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
