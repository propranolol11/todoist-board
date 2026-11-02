import test from "node:test";
import assert from "node:assert/strict";
import { isTaskDragStart, trackTaskDrag } from "../src/task-drag.ts";

function event(type: string, values: Record<string, unknown> = {}): PointerEvent {
  return Object.assign(new Event(type, { cancelable: true }), {
    pointerId: 1, pointerType: "mouse", button: 0, buttons: type === "pointerup" ? 0 : 1,
    isPrimary: true, clientX: 10, clientY: 10, ctrlKey: false,
    ...values,
  }) as PointerEvent;
}

function fixture(pointerType = "mouse", captureFails = false) {
  const document = Object.assign(new EventTarget(), { visibilityState: "visible" });
  const timers = new Map<number, () => void>();
  let timerId = 0;
  const ownerWindow = Object.assign(new EventTarget(), {
    setTimeout(callback: () => void) { timers.set(++timerId, callback); return timerId; },
    clearTimeout(id: number) { timers.delete(id); },
  });
  Object.assign(document, { defaultView: ownerWindow });
  let captured = false;
  const row = Object.assign(new EventTarget(), {
    ownerDocument: document, isConnected: true,
    setPointerCapture() {
      if (captureFails) throw new Error("No active pointer");
      captured = true;
    },
    hasPointerCapture() { return captured; },
    releasePointerCapture() { captured = false; row.dispatchEvent(event("lostpointercapture")); },
  });
  const observers: Array<{ callback: () => void; disconnected: boolean }> = [];
  Object.defineProperty(globalThis, "MutationObserver", {
    configurable: true,
    value: class {
      callback: () => void;
      disconnected = false;
      constructor(callback: () => void) { this.callback = callback; observers.push(this); }
      observe() {}
      disconnect() { this.disconnected = true; }
    },
  });
  let starts = 0;
  let moves = 0;
  const ends: boolean[] = [];
  const cancel = trackTaskDrag(row as unknown as HTMLElement, event("pointerdown", { pointerType }), {
    onStart() { starts++; },
    onMove() { moves++; },
    onEnd(commit) { ends.push(commit); },
  });
  return {
    document, ownerWindow, row, timers, observers, cancel, ends,
    get starts() { return starts; }, get moves() { return moves; }, get captured() { return captured; },
    move(values = {}) { document.dispatchEvent(event("pointermove", { pointerType, clientY: 30, ...values })); },
    hold() { for (const [id, callback] of timers) { timers.delete(id); callback(); } },
  };
}

test("only primary presses arm task dragging; right-click, middle-click and Ctrl-click never do", () => {
  for (const values of [{ button: 2, buttons: 2 }, { button: 1, buttons: 4 }, { buttons: 3 },
    { ctrlKey: true }, { isPrimary: false }, { pointerType: "pen", button: 2, buttons: 2 }]) {
    const down = event("pointerdown", values);
    assert.equal(isTaskDragStart(down), false);
    const cancel = trackTaskDrag({} as HTMLElement, down, {
      onStart() { assert.fail("secondary press must not start dragging"); },
      onMove() { assert.fail("secondary press must not move a task"); },
      onEnd() { assert.fail("secondary press must not arm listeners"); },
    });
    cancel();
  }
});

test("opening a context menu cancels a gesture and selects the task once without toggling it off", async () => {
  const { default: TodoistBoardPlugin } = await import("../main.ts");
  const plugin = new TodoistBoardPlugin() as any;
  let selections = 0;
  let cancellations = 0;
  const classes = new Set<string>();
  const row = { classList: { contains: (value: string) => classes.has(value) } };
  plugin.handleTaskSelection = () => { selections++; classes.add("selected-task"); };
  plugin.activeTaskDragCancel = () => { cancellations++; plugin.activeTaskDragCancel = null; };
  plugin.prepareTaskContextMenu(row, { id: "1", content: "Task" }, "");
  plugin.prepareTaskContextMenu(row, { id: "1", content: "Task" }, "");
  assert.equal(cancellations, 1);
  assert.equal(selections, 1);
  assert.equal(classes.has("selected-task"), true);
});

test("release outside the row removes a pending gesture so later movement cannot start a ghost drag", () => {
  const f = fixture();
  f.document.dispatchEvent(event("pointerup"));
  f.move();
  assert.equal(f.starts, 0);
  assert.deepEqual(f.ends, [false]);
  assert.equal(f.observers[0].disconnected, true);
});

test("lost-button and unrelated-pointer moves cannot activate a stale gesture", () => {
  const f = fixture();
  f.move({ pointerId: 2 });
  assert.equal(f.starts, 0);
  f.move({ buttons: 0 });
  f.move();
  assert.equal(f.starts, 0);
  assert.deepEqual(f.ends, [false]);
});

test("failed pointer capture cancels before any preview or scroll lock is created", () => {
  const f = fixture("mouse", true);
  f.move();
  assert.equal(f.starts, 0);
  assert.equal(f.moves, 0);
  assert.deepEqual(f.ends, [false]);
  f.cancel();
  assert.deepEqual(f.ends, [false]);
  const silent = fixture();
  silent.row.setPointerCapture = () => {};
  silent.move();
  assert.equal(silent.starts, 0);
  assert.deepEqual(silent.ends, [false]);
});

test("left drag commits once and consumes its release; cancellation never commits an order", () => {
  const f = fixture();
  f.move();
  assert.equal(f.starts, 1);
  assert.equal(f.captured, true);
  const up = event("pointerup");
  f.document.dispatchEvent(up);
  assert.equal(up.defaultPrevented, true);
  f.cancel();
  f.move();
  assert.deepEqual(f.ends, [true]);
  assert.equal(f.captured, false);
});

test("stationary touch/pen holds do not lift tasks; hold followed by movement still reorders", () => {
  for (const pointerType of ["touch", "pen"]) {
    const hold = fixture(pointerType);
    hold.hold();
    assert.equal(hold.starts, 0);
    hold.document.dispatchEvent(event("contextmenu"));
    hold.move();
    assert.equal(hold.starts, 0);
    assert.deepEqual(hold.ends, [false]);
    const drag = fixture(pointerType);
    drag.hold();
    drag.move();
    assert.equal(drag.starts, 1);
    const touchmove = new Event("touchmove", { cancelable: true });
    drag.document.dispatchEvent(touchmove);
    assert.equal(touchmove.defaultPrevented, true);
    drag.document.dispatchEvent(event("pointerup", { pointerType }));
    assert.deepEqual(drag.ends, [true]);
  }
});

test("normal mobile scrolling cancels the long-press timer and keeps scrolling available", () => {
  const f = fixture("touch");
  const scroll = new Event("touchmove", { cancelable: true });
  f.document.dispatchEvent(scroll);
  assert.equal(scroll.defaultPrevented, false);
  f.move({ clientY: 80 });
  f.hold();
  f.move();
  assert.equal(f.starts, 0);
  assert.equal(f.timers.size, 0);
  assert.deepEqual(f.ends, [false]);
});

test("context menu, OS cancellation, capture loss, app switch, Escape, rerender and second touch all clean up", () => {
  const cancellations = [
    (f: ReturnType<typeof fixture>) => f.document.dispatchEvent(event("contextmenu")),
    (f: ReturnType<typeof fixture>) => f.document.dispatchEvent(event("pointercancel")),
    (f: ReturnType<typeof fixture>) => f.row.dispatchEvent(event("lostpointercapture")),
    (f: ReturnType<typeof fixture>) => f.ownerWindow.dispatchEvent(new Event("blur")),
    (f: ReturnType<typeof fixture>) => { f.document.visibilityState = "hidden"; f.document.dispatchEvent(new Event("visibilitychange")); },
    (f: ReturnType<typeof fixture>) => f.document.dispatchEvent(event("keydown", { key: "Escape" })),
    (f: ReturnType<typeof fixture>) => { f.row.isConnected = false; f.observers[0].callback(); },
    (f: ReturnType<typeof fixture>) => f.document.dispatchEvent(event("pointerdown", { pointerId: 2 })),
    (f: ReturnType<typeof fixture>) => f.cancel(),
  ];
  for (const activate of [false, true]) {
    for (const cancel of cancellations) {
      const f = fixture("touch");
      if (activate) { f.hold(); f.move(); }
      cancel(f);
      f.hold();
      f.move();
      assert.deepEqual(f.ends, [false]);
      assert.equal(f.captured, false);
      assert.equal(f.observers[0].disconnected, true);
      assert.equal(f.timers.size, 0);
    }
  }
});
