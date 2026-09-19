import test from "node:test";
import assert from "node:assert/strict";
import { Settings } from "luxon";
import { __resetRequestUrl, __setRequestUrl } from "obsidian";
import { buildAddTaskDue, buildTaskDueUpdate, getTaskDateFields, rescheduleTaskDue } from "../src/task-dates.ts";
import { TodoistService, toSyncTaskArgs } from "../src/todoist-service.ts";
import type { Task } from "../src/types.ts";

const recurringTask: Task = {
  id: "task-1",
  content: "Check the garden",
  due: { date: "2026-09-21", string: "every Monday", is_recurring: true, lang: "en" },
};

test.beforeEach(() => {
  __resetRequestUrl();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { crypto: { randomUUID: () => "repeat-command" } },
  });
});

test("forms show recurrence and the calendar day in the display timezone for both API due formats", () => {
  assert.deepEqual(getTaskDateFields(recurringTask), { due: "2026-09-21", repeats: "every Monday" });
  for (const due of [
    { date: "2026-09-21T01:00:00Z", is_recurring: true, string: "every day at 6pm" },
    { date: "2026-09-21", datetime: "2026-09-21T01:00:00Z", isRecurring: true, string: "every day at 6pm" },
  ]) {
    assert.deepEqual(getTaskDateFields({ id: "timed", content: "", due }, "America/Los_Angeles"), {
      due: "2026-09-20", repeats: "every day at 6pm",
    });
  }
  assert.deepEqual(getTaskDateFields(undefined), { due: "", repeats: "" });
  assert.deepEqual(getTaskDateFields({ id: "one-off", content: "", due: { date: "2026-09-21", string: "Monday" } }), {
    due: "2026-09-21", repeats: "",
  });
});

test("new tasks use natural-language repeats with an optional start, including completion-based rules", () => {
  assert.deepEqual(buildAddTaskDue("", " every! 2 weeks "), { dueString: "every! 2 weeks", dueLang: "en" });
  assert.deepEqual(buildAddTaskDue("2026-09-21", "every Monday at 9am"), {
    dueString: "every Monday at 9am starting 2026-09-21", dueLang: "en",
  });
  for (const rule of ["every day starting 1 October", "every week from 1 October until 1 December"]) {
    assert.deepEqual(buildAddTaskDue("2026-09-21", rule), { dueString: rule, dueLang: "en" });
  }
  assert.deepEqual(buildAddTaskDue("2026-09-21", ""), { dueDate: "2026-09-21" });
  assert.deepEqual(buildAddTaskDue("", ""), {});
});

test("unrelated edits omit all due fields to retain next occurrence, time and timezone", () => {
  const initial = getTaskDateFields(recurringTask, "UTC");
  assert.deepEqual(buildTaskDueUpdate(recurringTask, initial, { ...initial }, "UTC"), {});
  const timed: Task = { id: "timed", content: "", due: { date: "2026-09-21T09:00:00Z", timezone: "Europe/London" } };
  const timedInitial = getTaskDateFields(timed, "Europe/London");
  assert.deepEqual(buildTaskDueUpdate(timed, timedInitial, timedInitial, "Europe/London"), {});
});

test("changing a recurring date moves only its next occurrence and preserves the complete rule", () => {
  const task: Task = {
    ...recurringTask,
    due: { ...recurringTask.due, string: "every! 2 weeks starting 1 September until 1 December", lang: "en" },
  };
  const initial = getTaskDateFields(task);
  assert.deepEqual(buildTaskDueUpdate(task, initial, { ...initial, due: "2026-09-22" }), {
    due: { date: "2026-09-22", string: task.due!.string, is_recurring: true, lang: "en" },
  });
});

test("rescheduling timed recurrence preserves local time across daylight saving transitions", () => {
  assert.deepEqual(rescheduleTaskDue({
    date: "2026-10-24T08:00:00Z", string: "every day at 9am", timezone: "Europe/London", lang: "en", is_recurring: true,
  }, "2026-10-26", "Europe/London"), {
    date: "2026-10-26T09:00:00.000Z", string: "every day at 9am", timezone: "Europe/London", lang: "en", is_recurring: true,
  });
  assert.deepEqual(rescheduleTaskDue({ date: "2026-09-21T09:30:00", string: "every weekday at 9:30", isRecurring: true }, "2026-09-22"), {
    date: "2026-09-22T09:30:00", string: "every weekday at 9:30", is_recurring: true,
  });
});

test("rescheduling preserves the task timezone's time when display and schedule DST differ", () => {
  assert.deepEqual(rescheduleTaskDue({
    date: "2026-10-24T08:00:00Z", string: "every day at 9am", timezone: "Europe/London", lang: "en", is_recurring: true,
  }, "2026-10-26", "America/Los_Angeles"), {
    date: "2026-10-26T09:00:00.000Z", string: "every day at 9am", timezone: "Europe/London", lang: "en", is_recurring: true,
  });
  // The first candidate falls in Berlin's skipped 02:30 hour; the final day does not.
  assert.equal(rescheduleTaskDue({
    date: "2026-03-28T01:30:00Z", string: "every day at 2:30am", timezone: "Europe/Berlin", is_recurring: true,
  }, "2026-03-29", "America/Los_Angeles").date, "2026-03-30T00:30:00.000Z");
});

test("a date selected in the display zone can require a different date in the schedule zone", () => {
  const task: Task = {
    id: "tokyo", content: "Call Tokyo", due: {
      date: "2026-09-20T00:00:00Z", string: "every day at 9am", timezone: "Asia/Tokyo", is_recurring: true,
    },
  };
  const initial = getTaskDateFields(task, "America/Los_Angeles");
  assert.equal(initial.due, "2026-09-19");
  const update = buildTaskDueUpdate(task, initial, { ...initial, due: "2026-09-21" }, "America/Los_Angeles");
  assert.deepEqual(update, {
    due: { date: "2026-09-22T00:00:00.000Z", string: "every day at 9am", timezone: "Asia/Tokyo", is_recurring: true },
  });
  assert.equal(getTaskDateFields({ ...task, due: update.due as Task["due"] }, "America/Los_Angeles").due, "2026-09-21");
});

test("changing a repeat rule reparses it, using the selected date as its start", () => {
  const initial = getTaskDateFields(recurringTask);
  assert.deepEqual(buildTaskDueUpdate(recurringTask, initial, { ...initial, repeats: "every Friday" }), {
    dueString: "every Friday starting 2026-09-21", dueLang: "en",
  });
});

test("clearing repeats retains the selected date and time but explicitly removes recurrence", () => {
  const task: Task = {
    ...recurringTask,
    due: { ...recurringTask.due, date: "2026-09-21T08:30:00Z", timezone: "Europe/London" },
  };
  const initial = getTaskDateFields(task, "Europe/London");
  assert.deepEqual(buildTaskDueUpdate(task, initial, { ...initial, repeats: "" }, "Europe/London"), {
    due: { date: "2026-09-21T08:30:00.000Z", is_recurring: false, lang: "en", timezone: "Europe/London" },
  });
  assert.deepEqual(buildTaskDueUpdate(task, initial, { due: "", repeats: "" }), { due: null });
});

test("clearing only the explicit date lets Todoist choose the next recurring occurrence", () => {
  const initial = getTaskDateFields(recurringTask);
  assert.deepEqual(buildTaskDueUpdate(recurringTask, initial, { ...initial, due: "" }), {
    dueString: "every Monday", dueLang: "en",
  });
});

test("sync conversion preserves rich due metadata and combined scalar dates", () => {
  assert.deepEqual(toSyncTaskArgs("task-1", { due: {
    date: "2026-09-21", datetime: "2026-09-21T09:00:00Z", string: "every day at 10am",
    isRecurring: true, lang: "en", timezone: "Europe/London",
  } }), {
    id: "task-1", due: { date: "2026-09-21T09:00:00Z", string: "every day at 10am", is_recurring: true, lang: "en", timezone: "Europe/London" },
  });
  assert.deepEqual(toSyncTaskArgs("task-1", { dueString: "every Monday", dueDate: "2026-09-21", dueLang: "en" }), {
    id: "task-1", due: { string: "every Monday", date: "2026-09-21", lang: "en" },
  });
  assert.deepEqual(toSyncTaskArgs("task-1", { due: null }), { id: "task-1", due: null });
});

test("adding recurring tasks sends API v1 due_string and language fields", async () => {
  __setRequestUrl(async (request: { url: string; body: string }) => {
    assert.equal(request.url, "https://api.todoist.com/api/v1/tasks");
    assert.deepEqual(JSON.parse(request.body), { content: "Garden", due_string: "every! 2 weeks starting 2026-09-21", due_lang: "en" });
    return { status: 200, text: JSON.stringify(recurringTask) };
  });
  const result = await new TodoistService("test-token").addTask({ content: "Garden", ...buildAddTaskDue("2026-09-21", "every! 2 weeks") });
  assert.equal(result.due?.isRecurring, true);
});

test("rich due edits use Sync directly without silently dropping recurrence metadata", async () => {
  const initial = getTaskDateFields(recurringTask);
  const update = buildTaskDueUpdate(recurringTask, initial, { ...initial, due: "2026-09-22" });
  let calls = 0;
  __setRequestUrl(async (request: { url: string; body: string }) => {
    calls++;
    assert.equal(request.url, "https://api.todoist.com/api/v1/sync");
    const [command] = JSON.parse(new URLSearchParams(request.body).get("commands")!);
    assert.deepEqual(command.args, { id: recurringTask.id, content: "Water plants", ...update });
    return { status: 200, text: JSON.stringify({ sync_status: { "repeat-command": "ok" } }) };
  });
  await new TodoistService("test-token").updateTask(recurringTask.id, { content: "Water plants", ...update });
  assert.equal(calls, 1);
});

test("REST fallback retains the parsed repeat string and language in Sync", async () => {
  let calls = 0;
  __setRequestUrl(async (request: { url: string; body: string }) => {
    calls++;
    if (calls === 1) return { status: 500, text: "retry using sync" };
    assert.equal(request.url, "https://api.todoist.com/api/v1/sync");
    const [command] = JSON.parse(new URLSearchParams(request.body).get("commands")!);
    assert.deepEqual(command.args, { id: "task-1", due: { string: "every! 2 weeks", lang: "en" } });
    return { status: 200, text: JSON.stringify({ sync_status: { "repeat-command": "ok" } }) };
  });
  await new TodoistService("test-token").updateTask("task-1", { dueString: "every! 2 weeks", dueLang: "en" });
  assert.equal(calls, 2);
});

test("scheduling without a snapshot reads the task and keeps its recurring rule", async () => {
  const requests: string[] = [];
  __setRequestUrl(async (request: { url: string; method: string; body: string }) => {
    requests.push(request.method);
    if (request.method === "GET") return { status: 200, text: JSON.stringify(recurringTask) };
    const [command] = JSON.parse(new URLSearchParams(request.body).get("commands")!);
    assert.deepEqual(command.args.due, { ...recurringTask.due, date: "2026-09-22" });
    return { status: 200, text: JSON.stringify({ sync_status: { "repeat-command": "ok" } }) };
  });
  await new TodoistService("test-token").scheduleTask(recurringTask.id, { due_date: "2026-09-22" });
  assert.deepEqual(requests, ["GET", "POST"]);
});

test("a failed task read cannot accidentally overwrite an unknown recurring schedule", async () => {
  __setRequestUrl(async (request: { method: string }) => {
    assert.equal(request.method, "GET");
    return { status: 503, text: "Unavailable" };
  });
  await assert.rejects(() => new TodoistService("test-token").scheduleTask("task-1", { due_string: "tomorrow" }), /503/);
});

test("today and tomorrow use the chosen timezone and preserve the repeat rule", async () => {
  const previousNow = Settings.now;
  Settings.now = () => Date.parse("2026-09-20T00:30:00Z");
  try {
    const dates: string[] = [];
    __setRequestUrl(async (request: { url: string; body: string }) => {
      assert.equal(request.url, "https://api.todoist.com/api/v1/sync");
      const [command] = JSON.parse(new URLSearchParams(request.body).get("commands")!);
      assert.equal(command.args.due.string, "every Monday");
      assert.equal(command.args.due.is_recurring, true);
      dates.push(command.args.due.date);
      return { status: 200, text: JSON.stringify({ sync_status: { "repeat-command": "ok" } }) };
    });
    const service = new TodoistService("test-token");
    await service.scheduleTask(recurringTask.id, { due_string: "today" }, recurringTask, "America/Los_Angeles");
    await service.scheduleTask(recurringTask.id, { due_string: "tomorrow" }, recurringTask, "America/Los_Angeles");
    assert.deepEqual(dates, ["2026-09-19", "2026-09-20"]);
  } finally {
    Settings.now = previousNow;
  }
});
