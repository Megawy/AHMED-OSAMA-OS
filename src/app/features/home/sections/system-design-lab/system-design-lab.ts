import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';

import { AnimationService } from '@core/services/animation.service';

@Component({
  selector: 'app-system-design-lab',
  standalone: true,
  imports: [],
  templateUrl: './system-design-lab.html',
  styleUrl: './system-design-lab.scss',
})
export class SystemDesignLab {
  activeTab = signal('jwt');

  private animation = inject(AnimationService);
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(async () => {
      const host = this.el.nativeElement as HTMLElement;
      const elements = [...host.querySelectorAll('.lab')];
      this.cleanup = await this.animation.reveal(elements);
    });

    this.destroyRef.onDestroy(() => this.cleanup?.());
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
  }
}
