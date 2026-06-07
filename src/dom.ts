export function a11yButton(el: HTMLElement, label: string) {
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", label);
  el.setAttribute("tabindex", "0");
  el.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        el.click();
        event.preventDefault();
      }
    },
    { once: false },
  );
}

export function clearEl(el: Element | null | undefined) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function applyDimClass(el: HTMLElement, on: boolean) {
  ["tb-dim", "dimmed", "queue-dim"].forEach((className) => {
    el.classList.toggle(className, on);
  });
}
