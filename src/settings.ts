import type { TodoistBoardSettings } from "./types";

export const COMMON_TIMEZONES = [
  "UTC",
  "Europe/London",
  "Europe/Dublin",
  "Europe/Lisbon",
  "Europe/Madrid",
  "Europe/Paris",
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/Zurich",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Stockholm",
  "Europe/Copenhagen",
  "Europe/Oslo",
  "Europe/Warsaw",
  "Europe/Prague",
  "Europe/Athens",
  "Europe/Bucharest",
  "Europe/Helsinki",
  "Europe/Kyiv",
  "Europe/Istanbul",
  "Europe/Minsk",
  "Europe/Moscow",
  "Africa/Casablanca",
  "Africa/Algiers",
  "Africa/Tunis",
  "Africa/Tripoli",
  "Africa/Cairo",
  "Africa/Khartoum",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Accra",
  "Asia/Jerusalem",
  "Asia/Amman",
  "Asia/Beirut",
  "Asia/Baghdad",
  "Asia/Riyadh",
  "Asia/Kuwait",
  "Asia/Qatar",
  "Asia/Bahrain",
  "Asia/Dubai",
  "Asia/Muscat",
  "Asia/Tehran",
  "Asia/Karachi",
  "Asia/Kabul",
  "Asia/Tashkent",
  "Asia/Almaty",
  "Asia/Colombo",
  "Asia/Kolkata",
  "Asia/Kathmandu",
  "Asia/Shanghai",
  "Asia/Taipei",
  "Asia/Hong_Kong",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Bangkok",
  "Asia/Kuala_Lumpur",
  "Asia/Jakarta",
  "Asia/Manila",
  "Asia/Ho_Chi_Minh",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Adelaide",
  "Australia/Darwin",
  "Australia/Perth",
  "Pacific/Auckland",
  "Pacific/Fiji",
  "Pacific/Guam",
  "Pacific/Honolulu",
  "America/New_York",
  "America/Toronto",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "America/Halifax",
  "America/Puerto_Rico",
  "America/Mexico_City",
  "America/Bogota",
  "America/Lima",
  "America/La_Paz",
  "America/Santiago",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
  "America/Montevideo",
];

export const DEFAULT_SETTINGS: TodoistBoardSettings = {
  apiKey: "",
  debug: false,
  enableLogs: false,
  filters: [
    { icon: "star", filter: "today", title: "Today" },
    { icon: "hourglass", filter: "overdue", title: "Overdue" },
    {
      icon: "moon",
      filter: "due after: today & due before: +30 days",
      title: "upcoming",
    },
    { icon: "inbox", filter: "#inbox", title: "Inbox" },
  ],
  compactMode: false,
  defaultFilter: "today",
  timezoneMode: "auto",
  manualTimezone: "Europe/London",
  contextMenuActions: {
    scheduleToday: true,
    scheduleTomorrow: true,
    setPriority: true,
    editTask: true,
    deleteTask: true,
    openInTodoist: true,
  },
  chinBarActions: {
    scheduleToday: true,
    scheduleTomorrow: true,
    editTask: true,
    hideTask: true,
    deleteTask: true,
    setPriority: false,
    setDeadline: false,
    openInTodoist: false,
  },
  addTaskModal: {
    dueDate: true,
    deadline: true,
    priority: true,
    project: true,
    labels: true,
  },
};

export function normalizeSettings(saved: Partial<TodoistBoardSettings> | null | undefined): TodoistBoardSettings {
  const merged = Object.assign({}, DEFAULT_SETTINGS, saved || {});
  if (!Array.isArray(merged.filters) || merged.filters.length === 0) {
    merged.filters = DEFAULT_SETTINGS.filters?.slice();
  }
  if (!merged.filters?.some((filter) => filter.isDefault) && merged.filters?.[0]) {
    merged.filters[0].isDefault = true;
  }
  merged.contextMenuActions = Object.assign(
    {},
    DEFAULT_SETTINGS.contextMenuActions,
    merged.contextMenuActions || {},
  );
  merged.chinBarActions = Object.assign(
    {},
    DEFAULT_SETTINGS.chinBarActions,
    merged.chinBarActions || {},
  );
  merged.addTaskModal = Object.assign(
    {},
    DEFAULT_SETTINGS.addTaskModal,
    merged.addTaskModal || {},
  );
  return merged;
}

export function getDefaultFilter(settings: TodoistBoardSettings): string {
  return String(
    settings.filters?.find((filter) => filter.isDefault)?.filter
      ?? settings.filters?.[0]?.filter
      ?? settings.defaultFilter
      ?? "today",
  );
}
