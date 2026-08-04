import {
  Component,
  AfterViewInit,
  PLATFORM_ID,
  inject,
  ElementRef,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ProjectStateService } from '../../services/project-state.service';

@Component({
  selector: 'app-project-hero',
  standalone: true,
  imports: [],
  templateUrl: './project-hero.html',
  styleUrl: './project-hero.scss',
})
export class ProjectHero implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  readonly state = inject(ProjectStateService);

  readonly projectCount = computed(() => {
    const count = this.state.totalCount();
    return count > 0 ? `${count}+` : '—';
  });

  readonly techCount = computed(() => {
    const count = this.state.technologyCount();
    return count > 0 ? `${count}+` : '—';
  });

  readonly featuredCount = computed(() => {
    const count = this.state.featuredCount();
    return count > 0 ? `${count}` : '—';
  });

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const gsap = (await import('gsap')).default;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const host = this.el.nativeElement as HTMLElement;

    tl.from(host.querySelector('.badge'), {
      y: -20,
      opacity: 0,
      duration: 0.6,
    })
      .from(host.querySelector('h1'), { y: 40, opacity: 0, duration: 0.8 }, '-=0.3')
      .from(host.querySelector('.subtitle'), { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
      .from(
        host.querySelectorAll('.stat'),
        { y: 20, opacity: 0, stagger: 0.15, duration: 0.6 },
        '-=0.4'
      );
  }
}
