export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const html = document.documentElement;

  return rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || html.clientHeight)
    && rect.right <= (window.innerWidth || html.clientWidth);
}

export function hasPastedElement(element: HTMLElement): boolean {
  const top = window.pageYOffset || document.documentElement.scrollTop;
  return top >= getElementOffset(element).top + element.clientHeight;
}

export function getElementOffset(element: HTMLElement): { top: number, left: number } {
  const de = document.documentElement;
  const box = element.getBoundingClientRect();
  const top = box.top + window.pageYOffset - de.clientTop;
  const left = box.left + window.pageXOffset - de.clientLeft;
  return { top: top, left: left };
}
