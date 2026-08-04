import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';

import { AnimationService } from '@core/services/animation.service';

@Component({
  selector: 'app-architecture-preview',
  standalone: true,
  templateUrl: './architecture-preview.html',
  styleUrl: './architecture-preview.scss',
})
export class ArchitecturePreview {
  private animation = inject(AnimationService);
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(async () => {
      const host = this.el.nativeElement as HTMLElement;
      const elements = [...host.querySelectorAll('.architecture')];
      this.cleanup = await this.animation.reveal(elements);
    });

    this.destroyRef.onDestroy(() => this.cleanup?.());
  }
}
