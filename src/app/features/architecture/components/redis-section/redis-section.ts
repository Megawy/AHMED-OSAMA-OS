import { Component, afterNextRender, ElementRef, inject, DestroyRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AnimationService } from '@core/services/animation.service';

@Component({
  selector: 'app-redis-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './redis-section.html',
  styleUrl: './redis-section.scss',
})
export class RedisSection {
  private readonly el = inject(ElementRef);
  private readonly animations = inject(AnimationService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(async () => {
      const host = this.el.nativeElement as HTMLElement;
      const elements = Array.from(host.querySelectorAll('.reveal'));
      const cleanup = await this.animations.reveal(elements);
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
