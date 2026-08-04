import { DestroyRef, Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  private registered: ScrollTrigger[] = [];
  private gsapReady: Promise<typeof import('gsap').default> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.registered.forEach((st) => st.kill());
      this.registered = [];
    });
  }

  private async loadGsap(): Promise<typeof import('gsap').default> {
    if (!this.gsapReady) {
      this.gsapReady = (async () => {
        const gsap = (await import('gsap')).default;
        const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
        gsap.registerPlugin(ScrollTrigger);
        return gsap;
      })();
    }
    return this.gsapReady;
  }

  /**
   * Scroll-triggered reveal animation.
   *
   * ================================================================
   * ROOT CAUSE OF THE HORIZONTAL SCROLLBAR BUG
   * ================================================================
   *
   * The original implementation used:
   *
   *   gsap.from(element, { y: 60, opacity: 0, scrollTrigger: st })
   *
   * gsap.from() defaults to immediateRender: true. This means GSAP
   * IMMEDIATELY writes two inline styles on every animated element
   * during setup — BEFORE the browser has finished its initial layout:
   *
   *   element.style.transform = 'translate3d(0px, 60px, 0px)'
   *   element.style.opacity   = '0'
   *
   * On the Home page, five sections call reveal() simultaneously inside
   * afterNextRender():
   *
   *   Stats             → 4 × .stat-card    (CSS Grid children)
   *   TechRadar         → N × .radar-card   (CSS Grid children)
   *   ArchitecturePreview → 1 × .architecture
   *   SystemDesignLab    → 1 × .lab
   *   FeaturedProjects   → N × .project-card
   *
   * Every grid/flex child that receives an inline transform gets a new
   * stacking context. The browser must recalculate grid track sizes for
   * all affected containers. During this synchronous recalculation, the
   * document's scrollWidth can temporarily exceed the viewport width,
   * producing a horizontal scrollbar.
   *
   * WHY SCROLLING FIXED IT:
   * 1. Scrolling fires ScrollTrigger's scroll listener.
   * 2. For in-view elements, the animation plays and completes,
   *    setting transform to translate3d(0,0,0) — the identity matrix.
   *    Identity transforms do not create stacking contexts, so the
   *    layout recalculation no longer overflows.
   * 3. ScrollTrigger.refresh() is implicitly called, recalculating
   *    all trigger positions against the now-stable layout.
   *
   * ================================================================
   * THE PERMANENT FIX (7 layers of defense)
   * ================================================================
   *
   * 1. Native DOM opacity:0 BEFORE GSAP loads
   *    Hides elements without writing a transform. Zero layout impact.
   *    Prevents FOUC during the async GSAP dynamic-import gap.
   *
   * 2. gsap.fromTo() with immediateRender:false
   *    The "from" state { y:60, opacity:0 } is NOT applied during
   *    setup. It is only applied when ScrollTrigger fires. Before that,
   *    elements have opacity:0 (from step 1) but NO inline transform.
   *
   * 3. requestAnimationFrame() wrapper
   *    Guarantees the browser has finished its initial layout pass
   *    before GSAP creates ScrollTrigger instances or measures
   *    element positions.
   *
   * 4. clearProps:'all'
   *    After the animation completes, GSAP strips EVERY inline style
   *    it wrote (transform, opacity, will-change, etc.). No lingering
   *    transforms remain to create stacking contexts.
   *
   * 5. force3D:false
   *    Forces 2D translate() instead of translate3d(). Reduces GPU
   *    compositor-layer promotion, which is a secondary cause of
   *    stacking-context creation on grid children.
   *
   * 6. invalidateOnRefresh:true + ScrollTrigger.refresh()
   *    After all animations are set up, refresh() recalculates every
   *    trigger's start/end against the final, stable layout.
   *    invalidateOnRefresh ensures positions are recalculated on
   *    every subsequent refresh (resize, font load, etc.).
   *
   * 7. prefers-reduced-motion guard
   *    If the user has reduced motion enabled, elements are shown
   *    immediately with no animation — accessibility compliance.
   *
   * @returns Cleanup function that kills all ScrollTrigger instances
   *          and resets element inline styles.
   */
  async reveal(elements: Element[]): Promise<() => void> {
    if (!isPlatformBrowser(this.platformId) || elements.length === 0) {
      return () => {};
    }

    // Guard: respect prefers-reduced-motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => {};
    }

    // STEP 1 — Immediately hide elements via native DOM.
    // Only opacity:0 — NO transform, NO will-change, ZERO layout impact.
    // This runs synchronously inside afterNextRender, before GSAP's
    // dynamic import resolves, preventing any flash of unstyled content.
    elements.forEach((element) => {
      (element as HTMLElement).style.opacity = '0';
    });

    // STEP 2 — Dynamically load GSAP + ScrollTrigger.
    const gsap = await this.loadGsap();
    const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
    const triggers: ScrollTrigger[] = [];

    // STEP 3 — Defer all GSAP work to the next animation frame.
    // afterNextRender fires after Angular's render cycle, but the
    // browser may not have completed its layout pass yet. RAF
    // guarantees we run after the browser has computed final positions.
    return new Promise<() => void>((resolve) => {
      requestAnimationFrame(() => {
        elements.forEach((element) => {
          const st = ScrollTrigger.create({
            trigger: element,
            start: 'top 85%',
            once: true,
            invalidateOnRefresh: true,
          });

          // gsap.fromTo() with immediateRender:false:
          //
          // - "from" { y:60, opacity:0 } is NOT applied during setup.
          // - It is only applied when ScrollTrigger fires.
          // - Before that, the element has opacity:0 (step 1) but
          //   NO inline transform — zero layout impact.
          // - When ScrollTrigger fires, GSAP applies y:60 and
          //   immediately begins animating toward y:0, opacity:1.
          // - clearProps:'all' strips every inline style after
          //   completion, leaving the element pristine.
          // - force3D:false uses 2D translate() instead of
          //   translate3d(), reducing compositor-layer promotion.
          gsap.fromTo(
            element,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: st,
              immediateRender: false,
              force3D: false,
              clearProps: 'all',
            },
          );

          triggers.push(st);
        });

        this.registered.push(...triggers);

        // STEP 4 — Refresh ScrollTrigger after all animations are set up.
        // Recalculates every trigger's start/end against the final layout.
        ScrollTrigger.refresh();

        const cleanup = () => {
          triggers.forEach((st) => st.kill());
          this.registered = this.registered.filter((t) => !triggers.includes(t));
          // Reset inline styles in case the animation never fired
          // (component destroyed before user scrolled to it).
          elements.forEach((element) => {
            const el = element as HTMLElement;
            el.style.opacity = '';
            el.style.transform = '';
          });
        };

        resolve(cleanup);
      });
    });
  }
}
