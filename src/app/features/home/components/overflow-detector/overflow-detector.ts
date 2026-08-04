import { afterNextRender, Component, inject, signal } from '@angular/core';

/**
 * FORENSIC OVERFLOW DETECTOR
 *
 * Temporary debugging component to identify the EXACT element causing horizontal overflow.
 * REMOVE after the bug is fixed.
 *
 * Usage:
 * 1. Add <app-overflow-detector></app-overflow-detector> to home.html
 * 2. Open browser DevTools console (F12)
 * 3. Reload the page
 * 4. Read the console output to find the overflowing element
 * 5. Remove this component after debugging
 */
@Component({
  selector: 'app-overflow-detector',
  standalone: true,
  template: `
    <div
      style="
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.95);
        color: #00e5ff;
        padding: 16px;
        border-radius: 12px;
        border: 2px solid #00e5ff;
        font-family: monospace;
        font-size: 11px;
        max-width: 420px;
        line-height: 1.6;
        box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
      "
    >
      <strong style="font-size: 13px">🔍 Overflow Detector</strong>
      <br /><br />
      Viewport: <strong>{{ viewportWidth() }}px</strong> | Doc:
      <strong>{{ docWidth() }}px</strong> | Overflow: <strong>{{ overflow() }}px</strong>
      <br />
      Direction: <strong>{{ direction() }}</strong> | Overflowing:
      <strong>{{ overflowingCount() }}</strong> <br /><br />
      <button
        (click)="scan()"
        style="
          padding: 6px 12px;
          background: #00e5ff;
          color: #000;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 700;
          margin: 2px;
        "
      >
        Re-scan
      </button>
      <button
        (click)="killGsapAndScan()"
        style="
          padding: 6px 12px;
          background: #ff4444;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 700;
          margin: 2px;
        "
      >
        Kill GSAP & Scan
      </button>
    </div>
  `,
})
export class OverflowDetector {
  viewportWidth = signal(0);
  docWidth = signal(0);
  overflow = signal(0);
  overflowingCount = signal(0);
  direction = signal('ltr');

  constructor() {
    afterNextRender(() => {
      console.log(
        '%c🔍 FORENSIC OVERFLOW DETECTOR ACTIVATED',
        'color: #00e5ff; font-size: 16px; font-weight: bold',
      );
      this.scan();
    });
  }

  scan(): void {
    const vw = window.innerWidth;
    const docWidth = document.documentElement.scrollWidth;
    const bodyWidth = document.body.scrollWidth;
    const dir = document.documentElement.dir || 'ltr';

    this.viewportWidth.set(vw);
    this.docWidth.set(docWidth);
    this.overflow.set(docWidth - vw);
    this.direction.set(dir);

    console.log(
      '\n%c========== FORENSIC OVERFLOW SCAN ==========',
      'color: #00e5ff; font-weight: bold',
    );
    console.log('\n%c📊 DIMENSIONS:', 'color: #ffaa00; font-weight: bold');
    console.log(`  Viewport width:       ${vw}px`);
    console.log(`  Document scrollWidth: ${docWidth}px`);
    console.log(`  Body scrollWidth:     ${bodyWidth}px`);
    console.log(`  Horizontal overflow:  ${docWidth - vw}px`);
    console.log(`  Direction:            ${dir}`);
    console.log(
      `  Scrollbar visible:    ${document.documentElement.clientWidth < vw ? 'YES' : 'NO'}`,
    );

    const overflowing: Array<{
      el: Element;
      tag: string;
      classes: string;
      rect: DOMRect;
      overflowLeft: number;
      overflowRight: number;
      width: string;
      minWidth: string;
      maxWidth: string;
      transform: string;
      position: string;
      component: string;
    }> = [];

    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);

      if (style.display === 'none' || style.visibility === 'hidden') return;
      if (rect.width === 0 && rect.height === 0) return;

      const oL = rect.left < 0 ? Math.abs(rect.left) : 0;
      const oR = rect.right > vw ? rect.right - vw : 0;

      if (oL > 0.5 || oR > 0.5) {
        let component = '(unknown)';
        let parent = el.parentElement;
        while (parent) {
          if (parent.tagName.toLowerCase().startsWith('app-')) {
            component = parent.tagName.toLowerCase();
            break;
          }
          parent = parent.parentElement;
        }

        overflowing.push({
          el,
          tag: el.tagName.toLowerCase(),
          classes: (el.className?.toString() || '').substring(0, 80),
          rect,
          overflowLeft: oL,
          overflowRight: oR,
          width: style.width,
          minWidth: style.minWidth,
          maxWidth: style.maxWidth,
          transform: style.transform,
          position: style.position,
          component,
        });
      }
    });

    this.overflowingCount.set(overflowing.length);

    if (overflowing.length === 0) {
      console.log('\n%c✅ NO OVERFLOWING ELEMENTS FOUND', 'color: #00ff00; font-weight: bold');
      console.log('   The page fits perfectly within the viewport.\n');
    } else {
      console.error(
        `\n%c❌ FOUND ${overflowing.length} OVERFLOWING ELEMENT(S):`,
        'color: #ff4444; font-weight: bold',
      );

      overflowing.forEach((item, i) => {
        console.group(
          `\n%c[${i + 1}] <${item.tag}> "${item.classes}"`,
          'color: #ff6600; font-weight: bold',
        );
        console.log('Element:     ', item.el);
        console.log('Component:   ', item.component);
        console.log(
          'Rect:        ',
          `left=${item.rect.left.toFixed(1)}  right=${item.rect.right.toFixed(1)}  width=${item.rect.width.toFixed(1)}`,
        );
        console.log(
          'Overflow:    ',
          `left=${item.overflowLeft.toFixed(1)}px  right=${item.overflowRight.toFixed(1)}px`,
        );
        console.log(
          'Styles:      ',
          `width=${item.width}  min=${item.minWidth}  max=${item.maxWidth}`,
        );
        console.log('Transform:   ', item.transform || 'none');
        console.log('Position:    ', item.position);
        console.groupEnd();
      });
    }

    console.log('\n%c========== SCAN COMPLETE ==========\n', 'color: #00e5ff; font-weight: bold');
  }

  killGsapAndScan(): void {
    console.log('\n%c🔧 KILLING ALL GSAP ANIMATIONS...', 'color: #ff4444; font-weight: bold');

    document.querySelectorAll('*').forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.transform = '';
      htmlEl.style.opacity = '';
      htmlEl.style.willChange = '';
    });

    setTimeout(() => {
      console.log('%c✅ GSAP cleared. Running scan...\n', 'color: #00ff00; font-weight: bold');
      this.scan();
    }, 200);
  }
}
