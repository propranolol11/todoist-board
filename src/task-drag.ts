export interface TaskDragCallbacks {
  onStart(event: PointerEvent): void;
  onMove(event: PointerEvent): void;
  onEnd(commit: boolean): void;
}

export function isTaskDragStart(event: PointerEvent): boolean {
  return event.button === 0 && event.buttons === 1 && event.isPrimary !== false
    && !(event.pointerType === "mouse" && event.ctrlKey)
    && ["mouse", "touch", "pen"].includes(event.pointerType);
}

/** Own every listener and timer for one press, including releases outside the row. */
export function trackTaskDrag(row: HTMLElement, down: PointerEvent, callbacks: TaskDragCallbacks, captureTarget = row): () => void {
  if (!isTaskDragStart(down)) return () => {};
  const document = row.ownerDocument;
  const ownerWindow = document.defaultView!;
  const pointerId = down.pointerId;
  const touch = down.pointerType === "touch" || down.pointerType === "pen";
  let ready = !touch;
  let state: "pending" | "dragging" | "finished" = "pending";
  let timer: number | undefined;
  const cleanups: Array<() => void> = [];
  const listen = (target: EventTarget, type: string, handler: EventListener, options?: AddEventListenerOptions | boolean) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  const finish = (commit = false) => {
    if (state === "finished") return;
    const wasDragging = state === "dragging";
    state = "finished";
    if (timer !== undefined) ownerWindow.clearTimeout(timer);
    for (const cleanup of cleanups) cleanup();
    try {
      if (captureTarget.hasPointerCapture(pointerId)) captureTarget.releasePointerCapture(pointerId);
    } catch {
      // A detached row or a pointer ended by the OS can already have lost capture.
    }
    callbacks.onEnd(wasDragging && commit);
  };

  listen(document, "pointermove", (event) => {
    const move = event as PointerEvent;
    if (move.pointerId !== pointerId) return;
    if (move.buttons !== 1 || (move.pointerType === "mouse" && move.ctrlKey) || !row.isConnected) {
      finish();
      return;
    }
    const distance = Math.max(Math.abs(move.clientX - down.clientX), Math.abs(move.clientY - down.clientY));
    if (state === "pending") {
      if (!ready) {
        if (distance > 25) finish(); // Preserve ordinary touch scrolling.
        return;
      }
      if (distance <= 5) return;
      // Capture can fail if a context menu/OS gesture already ended the pointer.
      // Do this before creating a preview or locking scrolling.
      try {
        captureTarget.setPointerCapture(pointerId);
        if (!captureTarget.hasPointerCapture(pointerId)) { finish(); return; }
      } catch {
        finish();
        return;
      }
      state = "dragging";
      try {
        callbacks.onStart(move);
      } catch (error) {
        finish();
        throw error;
      }
    }
    if (state !== "dragging") return;
    event.preventDefault();
    event.stopPropagation();
    try {
      callbacks.onMove(move);
    } catch (error) {
      finish();
      throw error;
    }
  }, { capture: true, passive: false });
  listen(document, "pointerup", (event) => {
    const up = event as PointerEvent;
    if (up.pointerId !== pointerId) return;
    if (state === "dragging") {
      event.preventDefault();
      event.stopPropagation(); // A drop must not also toggle task selection.
    }
    finish(up.button === 0);
  }, true);
  const cancelPointer = (event: Event) => {
    if ((event as PointerEvent).pointerId === pointerId) finish();
  };
  listen(document, "pointercancel", cancelPointer, true);
  listen(captureTarget, "lostpointercapture", (event) => {
    // Touch starts with implicit capture on the row. Ignore its transfer to the
    // stable list, which stays visible while the original row is hidden.
    if (event.target === captureTarget) cancelPointer(event);
  });
  listen(document, "pointerdown", () => finish(), true);
  listen(document, "contextmenu", () => finish(), true);
  listen(ownerWindow, "blur", () => finish());
  listen(document, "visibilitychange", () => {
    if (document.visibilityState !== "visible") finish();
  });
  listen(document, "keydown", (event) => {
    if ((event as KeyboardEvent).key !== "Escape") return;
    if (state === "dragging") { event.preventDefault(); event.stopPropagation(); }
    finish();
  }, true);
  if (touch) {
    // Holding alone leaves the native context-menu gesture available. Reordering
    // begins only when the held pointer moves; cancel touch scrolling at that point.
    timer = ownerWindow.setTimeout(() => { ready = true; }, 150);
    listen(document, "touchmove", (event) => {
      if (ready) event.preventDefault();
    }, { passive: false });
  }
  const observer = new MutationObserver(() => {
    if (!row.isConnected) finish();
  });
  observer.observe(document, { childList: true, subtree: true });
  cleanups.push(() => observer.disconnect());
  return () => finish();
}
