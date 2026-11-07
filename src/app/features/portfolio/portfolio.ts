import {
  Component,
  signal,
  inject,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PORTFOLIO_DATA, PortfolioData } from '@core/data/portfolio.data';
import { TechIconComponent } from './tech-icon';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, TechIconComponent],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class PortfolioComponent {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  // Static Data
  readonly data = signal<PortfolioData>(PORTFOLIO_DATA);

  // Loading state
  readonly isLoading = signal<boolean>(false);

  // Active section tracking
  readonly activeSection = signal<string>('bio');

  // Copy email feedback state
  readonly copiedEmail = signal<boolean>(false);

  // Scroll Progress (0 to 100%)
  readonly scrollProgress = signal<number>(0);

  // Floating Back to Top visibility
  readonly showBackToTop = signal<boolean>(false);

  constructor() {
    afterNextRender(() => {
      // 1. Scroll-reveal Observer for smooth animation on scroll
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px',
          }
        );
        revealElements.forEach((el) => observer.observe(el));
      } else {
        // Fallback for older environments
        revealElements.forEach((el) => el.classList.add('is-revealed'));
      }

      // 2. Window Scroll Listener
      const sections = ['bio', 'resume', 'projects', 'uses', 'contact'];
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Progress bar calculation
        if (docHeight > 0) {
          const progress = Math.min(Math.max((scrollY / docHeight) * 100, 0), 100);
          this.scrollProgress.set(progress);
        }

        // Floating Back-to-Top button visibility
        this.showBackToTop.set(scrollY > 350);

        // Active section spy
        const scrollPosition = scrollY + 160;
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              this.activeSection.set(sectionId);
              break;
            }
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      // Initial trigger
      handleScroll();
    });
  }

  /**
   * Smoothly scroll to a section by ID with header offset
   */
  scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      this.activeSection.set(sectionId);
    }
  }

  /**
   * Scroll back to the top of the page smoothly
   */
  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activeSection.set('bio');
  }

  /**
   * Copy email to clipboard with quick animated feedback
   */
  copyEmail(email: string): void {
    if (!this.isBrowser) return;
    navigator.clipboard.writeText(email).then(() => {
      this.copiedEmail.set(true);
      setTimeout(() => this.copiedEmail.set(false), 2200);
    });
  }
}
