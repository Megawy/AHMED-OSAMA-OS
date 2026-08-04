/**
 * Runtime Overflow Detection Utility
 *
 * This script detects elements that overflow the viewport.
 * Use it in the browser console to identify the root cause of horizontal scrollbars.
 *
 * Usage:
 * 1. Open browser DevTools console
 * 2. Paste this script and run it
 * 3. Check the console output for overflowing elements
 */

(() => {
  console.log('🔍 Starting overflow detection...\n');

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const overflowingElements: Array<{
    element: Element;
    tag: string;
    class: string;
    id: string;
    rect: DOMRect;
    overflow: { left: number; right: number };
  }> = [];

  document.querySelectorAll('*').forEach((el) => {
    const rect = el.getBoundingClientRect();

    // Check if element extends beyond viewport horizontally
    const overflowsLeft = rect.left < 0;
    const overflowsRight = rect.right > viewportWidth;

    if (overflowsLeft || overflowsRight) {
      // Skip if element is hidden or has zero dimensions
      const style = window.getComputedStyle(el);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        rect.width === 0 ||
        rect.height === 0
      ) {
        return;
      }

      overflowingElements.push({
        element: el,
        tag: el.tagName.toLowerCase(),
        class: el.className.toString(),
        id: el.id,
        rect: rect,
        overflow: {
          left: overflowsLeft ? Math.abs(rect.left) : 0,
          right: overflowsRight ? rect.right - viewportWidth : 0,
        },
      });
    }
  });

  if (overflowingElements.length === 0) {
    console.log('✅ No overflowing elements found!');
    console.log(`Viewport width: ${viewportWidth}px`);
    console.log(`Document width: ${document.documentElement.scrollWidth}px`);
    console.log(`Body width: ${document.body.scrollWidth}px`);
  } else {
    console.error(`❌ Found ${overflowingElements.length} overflowing element(s):\n`);

    overflowingElements.forEach((item, index) => {
      console.group(`Element ${index + 1}`);
      console.log('Element:', item.element);
      console.log('Tag:', item.tag);
      console.log('Class:', item.class);
      console.log('ID:', item.id || '(none)');
      console.log('Bounding Rect:', {
        left: `${item.rect.left.toFixed(2)}px`,
        right: `${item.rect.right.toFixed(2)}px`,
        width: `${item.rect.width.toFixed(2)}px`,
      });
      console.log('Overflow:', {
        left: item.overflow.left > 0 ? `${item.overflow.left.toFixed(2)}px` : 'none',
        right: item.overflow.right > 0 ? `${item.overflow.right.toFixed(2)}px` : 'none',
      });
      console.log('Computed styles:', {
        width: window.getComputedStyle(item.element).width,
        'max-width': window.getComputedStyle(item.element).maxWidth,
        'min-width': window.getComputedStyle(item.element).minWidth,
        padding: window.getComputedStyle(item.element).padding,
        margin: window.getComputedStyle(item.element).margin,
      });
      console.groupEnd();
    });

    console.log('\n📊 Summary:');
    console.log(`Viewport width: ${viewportWidth}px`);
    console.log(`Document scrollWidth: ${document.documentElement.scrollWidth}px`);
    console.log(`Body scrollWidth: ${document.body.scrollWidth}px`);
    console.log(`Horizontal overflow: ${document.documentElement.scrollWidth - viewportWidth}px`);
  }

  // Check for common causes
  console.log('\n🔎 Checking common overflow causes:');

  // Check for grids without minmax(0, 1fr)
  const grids = document.querySelectorAll('[style*="grid"], .stats, .projects-grid, .radar-grid');
  grids.forEach((grid) => {
    const style = window.getComputedStyle(grid);
    const template = style.gridTemplateColumns;
    if (template && template.includes('1fr') && !template.includes('minmax')) {
      console.warn('⚠️ Grid without minmax(0, 1fr):', grid, 'Template:', template);
    }
  });

  // Check for elements with min-width
  const minWidthElements = document.querySelectorAll('[style*="min-width"]');
  minWidthElements.forEach((el) => {
    const minWidth = window.getComputedStyle(el).minWidth;
    if (minWidth && minWidth !== '0px' && minWidth !== 'auto') {
      console.log('Element with min-width:', el, 'Value:', minWidth);
    }
  });

  console.log('\n✅ Detection complete!');
})();
