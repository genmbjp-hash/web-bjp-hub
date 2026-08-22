import { useEffect, useRef } from 'react';

/**
 * Makes a horizontally-scrolling container (usually paired with the
 * `.no-scrollbar` utility, which hides the native scrollbar) scrollable via
 * mouse wheel and click-and-drag. Without this, desktop mouse users have no
 * way to move a hidden-scrollbar strip: a plain vertical wheel doesn't pan
 * horizontal content, and there's no visible thumb left to drag.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      isDragging = true;
      startX = e.pageX;
      startScrollLeft = el.scrollLeft;
      el.classList.add('cursor-grabbing');
    };

    const stopDragging = () => {
      isDragging = false;
      el.classList.remove('cursor-grabbing');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      el.scrollLeft = startScrollLeft - (e.pageX - startX);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', stopDragging);
    el.addEventListener('mouseleave', stopDragging);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', stopDragging);
      el.removeEventListener('mouseleave', stopDragging);
    };
  }, []);

  return ref;
}
