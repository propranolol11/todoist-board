'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var obsidian = require('obsidian');

const TODOIST_BOARD_VIEW_TYPE$1 = "todoist-board-view";
const TODOIST_COLORS = {
    berry_red: "#b8256f",
    red: "#db4035",
    orange: "#ff9933",
    yellow: "#fad000",
    olive_green: "#afb83b",
    lime_green: "#7ecc49",
    green: "#299438",
    mint_green: "#6accbc",
    teal: "#158fad",
    sky_blue: "#14aaf5",
    light_blue: "#96c3eb",
    blue: "#4073ff",
    grape: "#884dff",
    violet: "#af38eb",
    lavender: "#eb96eb",
    magenta: "#e05194",
    salmon: "#ff8d85",
    charcoal: "#808080",
    grey: "#b8b8b8",
    taupe: "#ccac93",
};
const TODOIST_COLORS_NUM = {
    30: "#b8256f",
    31: "#db4035",
    32: "#ff9933",
    33: "#fad000",
    34: "#afb83b",
    35: "#7ecc49",
    36: "#299438",
    37: "#6accbc",
    38: "#158fad",
    39: "#14aaf5",
    40: "#96c3eb",
    41: "#4073ff",
    42: "#884dff",
    43: "#af38eb",
    44: "#eb96eb",
    45: "#e05194",
    46: "#ff8d85",
    47: "#808080",
    48: "#b8b8b8",
    49: "#ccac93",
};

const COMMON_TIMEZONES = [
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
const DEFAULT_SETTINGS$1 = {
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
};
function normalizeSettings(saved) {
    const merged = Object.assign({}, DEFAULT_SETTINGS$1, saved || {});
    if (!Array.isArray(merged.filters) || merged.filters.length === 0) {
        merged.filters = DEFAULT_SETTINGS$1.filters?.slice();
    }
    if (!merged.filters?.some((filter) => filter.isDefault) && merged.filters?.[0]) {
        merged.filters[0].isDefault = true;
    }
    merged.contextMenuActions = Object.assign({}, DEFAULT_SETTINGS$1.contextMenuActions, merged.contextMenuActions || {});
    return merged;
}
function getDefaultFilter(settings) {
    return String(settings.filters?.find((filter) => filter.isDefault)?.filter
        ?? settings.filters?.[0]?.filter
        ?? settings.defaultFilter
        ?? "today");
}

// these aren't really private, but nor are they really useful to document

/**
 * @private
 */
class LuxonError extends Error {}

/**
 * @private
 */
class InvalidDateTimeError extends LuxonError {
  constructor(reason) {
    super(`Invalid DateTime: ${reason.toMessage()}`);
  }
}

/**
 * @private
 */
class InvalidIntervalError extends LuxonError {
  constructor(reason) {
    super(`Invalid Interval: ${reason.toMessage()}`);
  }
}

/**
 * @private
 */
class InvalidDurationError extends LuxonError {
  constructor(reason) {
    super(`Invalid Duration: ${reason.toMessage()}`);
  }
}

/**
 * @private
 */
class ConflictingSpecificationError extends LuxonError {}

/**
 * @private
 */
class InvalidUnitError extends LuxonError {
  constructor(unit) {
    super(`Invalid unit ${unit}`);
  }
}

/**
 * @private
 */
class InvalidArgumentError extends LuxonError {}

/**
 * @private
 */
class ZoneIsAbstractError extends LuxonError {
  constructor() {
    super("Zone is an abstract class");
  }
}

/**
 * @private
 */

const n = "numeric",
  s = "short",
  l = "long";

const DATE_SHORT = {
  year: n,
  month: n,
  day: n,
};

const DATE_MED = {
  year: n,
  month: s,
  day: n,
};

const DATE_MED_WITH_WEEKDAY = {
  year: n,
  month: s,
  day: n,
  weekday: s,
};

const DATE_FULL = {
  year: n,
  month: l,
  day: n,
};

const DATE_HUGE = {
  year: n,
  month: l,
  day: n,
  weekday: l,
};

const TIME_SIMPLE = {
  hour: n,
  minute: n,
};

const TIME_WITH_SECONDS = {
  hour: n,
  minute: n,
  second: n,
};

const TIME_WITH_SHORT_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  timeZoneName: s,
};

const TIME_WITH_LONG_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  timeZoneName: l,
};

const TIME_24_SIMPLE = {
  hour: n,
  minute: n,
  hourCycle: "h23",
};

const TIME_24_WITH_SECONDS = {
  hour: n,
  minute: n,
  second: n,
  hourCycle: "h23",
};

const TIME_24_WITH_SHORT_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  hourCycle: "h23",
  timeZoneName: s,
};

const TIME_24_WITH_LONG_OFFSET = {
  hour: n,
  minute: n,
  second: n,
  hourCycle: "h23",
  timeZoneName: l,
};

const DATETIME_SHORT = {
  year: n,
  month: n,
  day: n,
  hour: n,
  minute: n,
};

const DATETIME_SHORT_WITH_SECONDS = {
  year: n,
  month: n,
  day: n,
  hour: n,
  minute: n,
  second: n,
};

const DATETIME_MED = {
  year: n,
  month: s,
  day: n,
  hour: n,
  minute: n,
};

const DATETIME_MED_WITH_SECONDS = {
  year: n,
  month: s,
  day: n,
  hour: n,
  minute: n,
  second: n,
};

const DATETIME_MED_WITH_WEEKDAY = {
  year: n,
  month: s,
  day: n,
  weekday: s,
  hour: n,
  minute: n,
};

const DATETIME_FULL = {
  year: n,
  month: l,
  day: n,
  hour: n,
  minute: n,
  timeZoneName: s,
};

const DATETIME_FULL_WITH_SECONDS = {
  year: n,
  month: l,
  day: n,
  hour: n,
  minute: n,
  second: n,
  timeZoneName: s,
};

const DATETIME_HUGE = {
  year: n,
  month: l,
  day: n,
  weekday: l,
  hour: n,
  minute: n,
  timeZoneName: l,
};

const DATETIME_HUGE_WITH_SECONDS = {
  year: n,
  month: l,
  day: n,
  weekday: l,
  hour: n,
  minute: n,
  second: n,
  timeZoneName: l,
};

/**
 * @interface
 */
class Zone {
  /**
   * The type of zone
   * @abstract
   * @type {string}
   */
  get type() {
    throw new ZoneIsAbstractError();
  }

  /**
   * The name of this zone.
   * @abstract
   * @type {string}
   */
  get name() {
    throw new ZoneIsAbstractError();
  }

  /**
   * The IANA name of this zone.
   * Defaults to `name` if not overwritten by a subclass.
   * @abstract
   * @type {string}
   */
  get ianaName() {
    return this.name;
  }

  /**
   * Returns whether the offset is known to be fixed for the whole year.
   * @abstract
   * @type {boolean}
   */
  get isUniversal() {
    throw new ZoneIsAbstractError();
  }

  /**
   * Returns the offset's common name (such as EST) at the specified timestamp
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the name
   * @param {Object} opts - Options to affect the format
   * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
   * @param {string} opts.locale - What locale to return the offset name in.
   * @return {string}
   */
  offsetName(ts, opts) {
    throw new ZoneIsAbstractError();
  }

  /**
   * Returns the offset's value as a string
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(ts, format) {
    throw new ZoneIsAbstractError();
  }

  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @abstract
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(ts) {
    throw new ZoneIsAbstractError();
  }

  /**
   * Return whether this Zone is equal to another zone
   * @abstract
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(otherZone) {
    throw new ZoneIsAbstractError();
  }

  /**
   * Return whether this Zone is valid.
   * @abstract
   * @type {boolean}
   */
  get isValid() {
    throw new ZoneIsAbstractError();
  }
}

let singleton$1 = null;

/**
 * Represents the local zone for this JavaScript environment.
 * @implements {Zone}
 */
class SystemZone extends Zone {
  /**
   * Get a singleton instance of the local zone
   * @return {SystemZone}
   */
  static get instance() {
    if (singleton$1 === null) {
      singleton$1 = new SystemZone();
    }
    return singleton$1;
  }

  /** @override **/
  get type() {
    return "system";
  }

  /** @override **/
  get name() {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /** @override **/
  get isUniversal() {
    return false;
  }

  /** @override **/
  offsetName(ts, { format, locale }) {
    return parseZoneInfo(ts, format, locale);
  }

  /** @override **/
  formatOffset(ts, format) {
    return formatOffset(this.offset(ts), format);
  }

  /** @override **/
  offset(ts) {
    return -new Date(ts).getTimezoneOffset();
  }

  /** @override **/
  equals(otherZone) {
    return otherZone.type === "system";
  }

  /** @override **/
  get isValid() {
    return true;
  }
}

const dtfCache = new Map();
function makeDTF(zoneName) {
  let dtf = dtfCache.get(zoneName);
  if (dtf === undefined) {
    dtf = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: zoneName,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      era: "short",
    });
    dtfCache.set(zoneName, dtf);
  }
  return dtf;
}

const typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  era: 3,
  hour: 4,
  minute: 5,
  second: 6,
};

function hackyOffset(dtf, date) {
  const formatted = dtf.format(date).replace(/\u200E/g, ""),
    parsed = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(formatted),
    [, fMonth, fDay, fYear, fadOrBc, fHour, fMinute, fSecond] = parsed;
  return [fYear, fMonth, fDay, fadOrBc, fHour, fMinute, fSecond];
}

function partsOffset(dtf, date) {
  const formatted = dtf.formatToParts(date);
  const filled = [];
  for (let i = 0; i < formatted.length; i++) {
    const { type, value } = formatted[i];
    const pos = typeToPos[type];

    if (type === "era") {
      filled[pos] = value;
    } else if (!isUndefined(pos)) {
      filled[pos] = parseInt(value, 10);
    }
  }
  return filled;
}

const ianaZoneCache = new Map();
/**
 * A zone identified by an IANA identifier, like America/New_York
 * @implements {Zone}
 */
class IANAZone extends Zone {
  /**
   * @param {string} name - Zone name
   * @return {IANAZone}
   */
  static create(name) {
    let zone = ianaZoneCache.get(name);
    if (zone === undefined) {
      ianaZoneCache.set(name, (zone = new IANAZone(name)));
    }
    return zone;
  }

  /**
   * Reset local caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCache() {
    ianaZoneCache.clear();
    dtfCache.clear();
  }

  /**
   * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
   * @param {string} s - The string to check validity on
   * @example IANAZone.isValidSpecifier("America/New_York") //=> true
   * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
   * @deprecated For backward compatibility, this forwards to isValidZone, better use `isValidZone()` directly instead.
   * @return {boolean}
   */
  static isValidSpecifier(s) {
    return this.isValidZone(s);
  }

  /**
   * Returns whether the provided string identifies a real zone
   * @param {string} zone - The string to check
   * @example IANAZone.isValidZone("America/New_York") //=> true
   * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
   * @example IANAZone.isValidZone("Sport~~blorp") //=> false
   * @return {boolean}
   */
  static isValidZone(zone) {
    if (!zone) {
      return false;
    }
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: zone }).format();
      return true;
    } catch (e) {
      return false;
    }
  }

  constructor(name) {
    super();
    /** @private **/
    this.zoneName = name;
    /** @private **/
    this.valid = IANAZone.isValidZone(name);
  }

  /**
   * The type of zone. `iana` for all instances of `IANAZone`.
   * @override
   * @type {string}
   */
  get type() {
    return "iana";
  }

  /**
   * The name of this zone (i.e. the IANA zone name).
   * @override
   * @type {string}
   */
  get name() {
    return this.zoneName;
  }

  /**
   * Returns whether the offset is known to be fixed for the whole year:
   * Always returns false for all IANA zones.
   * @override
   * @type {boolean}
   */
  get isUniversal() {
    return false;
  }

  /**
   * Returns the offset's common name (such as EST) at the specified timestamp
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the name
   * @param {Object} opts - Options to affect the format
   * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
   * @param {string} opts.locale - What locale to return the offset name in.
   * @return {string}
   */
  offsetName(ts, { format, locale }) {
    return parseZoneInfo(ts, format, locale, this.name);
  }

  /**
   * Returns the offset's value as a string
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(ts, format) {
    return formatOffset(this.offset(ts), format);
  }

  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   * @override
   * @param {number} ts - Epoch milliseconds for which to compute the offset
   * @return {number}
   */
  offset(ts) {
    if (!this.valid) return NaN;
    const date = new Date(ts);

    if (isNaN(date)) return NaN;

    const dtf = makeDTF(this.name);
    let [year, month, day, adOrBc, hour, minute, second] = dtf.formatToParts
      ? partsOffset(dtf, date)
      : hackyOffset(dtf, date);

    if (adOrBc === "BC") {
      year = -Math.abs(year) + 1;
    }

    // because we're using hour12 and https://bugs.chromium.org/p/chromium/issues/detail?id=1025564&can=2&q=%2224%3A00%22%20datetimeformat
    const adjustedHour = hour === 24 ? 0 : hour;

    const asUTC = objToLocalTS({
      year,
      month,
      day,
      hour: adjustedHour,
      minute,
      second,
      millisecond: 0,
    });

    let asTS = +date;
    const over = asTS % 1000;
    asTS -= over >= 0 ? over : 1000 + over;
    return (asUTC - asTS) / (60 * 1000);
  }

  /**
   * Return whether this Zone is equal to another zone
   * @override
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(otherZone) {
    return otherZone.type === "iana" && otherZone.name === this.name;
  }

  /**
   * Return whether this Zone is valid.
   * @override
   * @type {boolean}
   */
  get isValid() {
    return this.valid;
  }
}

// todo - remap caching

let intlLFCache = {};
function getCachedLF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlLFCache[key];
  if (!dtf) {
    dtf = new Intl.ListFormat(locString, opts);
    intlLFCache[key] = dtf;
  }
  return dtf;
}

const intlDTCache = new Map();
function getCachedDTF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache.get(key);
  if (dtf === undefined) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache.set(key, dtf);
  }
  return dtf;
}

const intlNumCache = new Map();
function getCachedINF(locString, opts = {}) {
  const key = JSON.stringify([locString, opts]);
  let inf = intlNumCache.get(key);
  if (inf === undefined) {
    inf = new Intl.NumberFormat(locString, opts);
    intlNumCache.set(key, inf);
  }
  return inf;
}

const intlRelCache = new Map();
function getCachedRTF(locString, opts = {}) {
  const { base, ...cacheKeyOpts } = opts; // exclude `base` from the options
  const key = JSON.stringify([locString, cacheKeyOpts]);
  let inf = intlRelCache.get(key);
  if (inf === undefined) {
    inf = new Intl.RelativeTimeFormat(locString, opts);
    intlRelCache.set(key, inf);
  }
  return inf;
}

let sysLocaleCache = null;
function systemLocale() {
  if (sysLocaleCache) {
    return sysLocaleCache;
  } else {
    sysLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
    return sysLocaleCache;
  }
}

const intlResolvedOptionsCache = new Map();
function getCachedIntResolvedOptions(locString) {
  let opts = intlResolvedOptionsCache.get(locString);
  if (opts === undefined) {
    opts = new Intl.DateTimeFormat(locString).resolvedOptions();
    intlResolvedOptionsCache.set(locString, opts);
  }
  return opts;
}

const weekInfoCache = new Map();
function getCachedWeekInfo(locString) {
  let data = weekInfoCache.get(locString);
  if (!data) {
    const locale = new Intl.Locale(locString);
    // browsers currently implement this as a property, but spec says it should be a getter function
    data = "getWeekInfo" in locale ? locale.getWeekInfo() : locale.weekInfo;
    // minimalDays was removed from WeekInfo: https://github.com/tc39/proposal-intl-locale-info/issues/86
    if (!("minimalDays" in data)) {
      data = { ...fallbackWeekSettings, ...data };
    }
    weekInfoCache.set(locString, data);
  }
  return data;
}

function parseLocaleString(localeStr) {
  // I really want to avoid writing a BCP 47 parser
  // see, e.g. https://github.com/wooorm/bcp-47
  // Instead, we'll do this:

  // a) if the string has no -u extensions, just leave it alone
  // b) if it does, use Intl to resolve everything
  // c) if Intl fails, try again without the -u

  // private subtags and unicode subtags have ordering requirements,
  // and we're not properly parsing this, so just strip out the
  // private ones if they exist.
  const xIndex = localeStr.indexOf("-x-");
  if (xIndex !== -1) {
    localeStr = localeStr.substring(0, xIndex);
  }

  const uIndex = localeStr.indexOf("-u-");
  if (uIndex === -1) {
    return [localeStr];
  } else {
    let options;
    let selectedStr;
    try {
      options = getCachedDTF(localeStr).resolvedOptions();
      selectedStr = localeStr;
    } catch (e) {
      const smaller = localeStr.substring(0, uIndex);
      options = getCachedDTF(smaller).resolvedOptions();
      selectedStr = smaller;
    }

    const { numberingSystem, calendar } = options;
    return [selectedStr, numberingSystem, calendar];
  }
}

function intlConfigString(localeStr, numberingSystem, outputCalendar) {
  if (outputCalendar || numberingSystem) {
    if (!localeStr.includes("-u-")) {
      localeStr += "-u";
    }

    if (outputCalendar) {
      localeStr += `-ca-${outputCalendar}`;
    }

    if (numberingSystem) {
      localeStr += `-nu-${numberingSystem}`;
    }
    return localeStr;
  } else {
    return localeStr;
  }
}

function mapMonths(f) {
  const ms = [];
  for (let i = 1; i <= 12; i++) {
    const dt = DateTime.utc(2009, i, 1);
    ms.push(f(dt));
  }
  return ms;
}

function mapWeekdays(f) {
  const ms = [];
  for (let i = 1; i <= 7; i++) {
    const dt = DateTime.utc(2016, 11, 13 + i);
    ms.push(f(dt));
  }
  return ms;
}

function listStuff(loc, length, englishFn, intlFn) {
  const mode = loc.listingMode();

  if (mode === "error") {
    return null;
  } else if (mode === "en") {
    return englishFn(length);
  } else {
    return intlFn(length);
  }
}

function supportsFastNumbers(loc) {
  if (loc.numberingSystem && loc.numberingSystem !== "latn") {
    return false;
  } else {
    return (
      loc.numberingSystem === "latn" ||
      !loc.locale ||
      loc.locale.startsWith("en") ||
      getCachedIntResolvedOptions(loc.locale).numberingSystem === "latn"
    );
  }
}

/**
 * @private
 */

class PolyNumberFormatter {
  constructor(intl, forceSimple, opts) {
    this.padTo = opts.padTo || 0;
    this.floor = opts.floor || false;

    const { padTo, floor, ...otherOpts } = opts;

    if (!forceSimple || Object.keys(otherOpts).length > 0) {
      const intlOpts = { useGrouping: false, ...opts };
      if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
      this.inf = getCachedINF(intl, intlOpts);
    }
  }

  format(i) {
    if (this.inf) {
      const fixed = this.floor ? Math.floor(i) : i;
      return this.inf.format(fixed);
    } else {
      // to match the browser's numberformatter defaults
      const fixed = this.floor ? Math.floor(i) : roundTo(i, 3);
      return padStart(fixed, this.padTo);
    }
  }
}

/**
 * @private
 */

class PolyDateFormatter {
  constructor(dt, intl, opts) {
    this.opts = opts;
    this.originalZone = undefined;

    let z = undefined;
    if (this.opts.timeZone) {
      // Don't apply any workarounds if a timeZone is explicitly provided in opts
      this.dt = dt;
    } else if (dt.zone.type === "fixed") {
      // UTC-8 or Etc/UTC-8 are not part of tzdata, only Etc/GMT+8 and the like.
      // That is why fixed-offset TZ is set to that unless it is:
      // 1. Representing offset 0 when UTC is used to maintain previous behavior and does not become GMT.
      // 2. Unsupported by the browser:
      //    - some do not support Etc/
      //    - < Etc/GMT-14, > Etc/GMT+12, and 30-minute or 45-minute offsets are not part of tzdata
      const gmtOffset = -1 * (dt.offset / 60);
      const offsetZ = gmtOffset >= 0 ? `Etc/GMT+${gmtOffset}` : `Etc/GMT${gmtOffset}`;
      if (dt.offset !== 0 && IANAZone.create(offsetZ).valid) {
        z = offsetZ;
        this.dt = dt;
      } else {
        // Not all fixed-offset zones like Etc/+4:30 are present in tzdata so
        // we manually apply the offset and substitute the zone as needed.
        z = "UTC";
        this.dt = dt.offset === 0 ? dt : dt.setZone("UTC").plus({ minutes: dt.offset });
        this.originalZone = dt.zone;
      }
    } else if (dt.zone.type === "system") {
      this.dt = dt;
    } else if (dt.zone.type === "iana") {
      this.dt = dt;
      z = dt.zone.name;
    } else {
      // Custom zones can have any offset / offsetName so we just manually
      // apply the offset and substitute the zone as needed.
      z = "UTC";
      this.dt = dt.setZone("UTC").plus({ minutes: dt.offset });
      this.originalZone = dt.zone;
    }

    const intlOpts = { ...this.opts };
    intlOpts.timeZone = intlOpts.timeZone || z;
    this.dtf = getCachedDTF(intl, intlOpts);
  }

  format() {
    if (this.originalZone) {
      // If we have to substitute in the actual zone name, we have to use
      // formatToParts so that the timezone can be replaced.
      return this.formatToParts()
        .map(({ value }) => value)
        .join("");
    }
    return this.dtf.format(this.dt.toJSDate());
  }

  formatToParts() {
    const parts = this.dtf.formatToParts(this.dt.toJSDate());
    if (this.originalZone) {
      return parts.map((part) => {
        if (part.type === "timeZoneName") {
          const offsetName = this.originalZone.offsetName(this.dt.ts, {
            locale: this.dt.locale,
            format: this.opts.timeZoneName,
          });
          return {
            ...part,
            value: offsetName,
          };
        } else {
          return part;
        }
      });
    }
    return parts;
  }

  resolvedOptions() {
    return this.dtf.resolvedOptions();
  }
}

/**
 * @private
 */
class PolyRelFormatter {
  constructor(intl, isEnglish, opts) {
    this.opts = { style: "long", ...opts };
    if (!isEnglish && hasRelative()) {
      this.rtf = getCachedRTF(intl, opts);
    }
  }

  format(count, unit) {
    if (this.rtf) {
      return this.rtf.format(count, unit);
    } else {
      return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
    }
  }

  formatToParts(count, unit) {
    if (this.rtf) {
      return this.rtf.formatToParts(count, unit);
    } else {
      return [];
    }
  }
}

const fallbackWeekSettings = {
  firstDay: 1,
  minimalDays: 4,
  weekend: [6, 7],
};

/**
 * @private
 */
class Locale {
  static fromOpts(opts) {
    return Locale.create(
      opts.locale,
      opts.numberingSystem,
      opts.outputCalendar,
      opts.weekSettings,
      opts.defaultToEN
    );
  }

  static create(locale, numberingSystem, outputCalendar, weekSettings, defaultToEN = false) {
    const specifiedLocale = locale || Settings.defaultLocale;
    // the system locale is useful for human-readable strings but annoying for parsing/formatting known formats
    const localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale());
    const numberingSystemR = numberingSystem || Settings.defaultNumberingSystem;
    const outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
    const weekSettingsR = validateWeekSettings(weekSettings) || Settings.defaultWeekSettings;
    return new Locale(localeR, numberingSystemR, outputCalendarR, weekSettingsR, specifiedLocale);
  }

  static resetCache() {
    sysLocaleCache = null;
    intlDTCache.clear();
    intlNumCache.clear();
    intlRelCache.clear();
    intlResolvedOptionsCache.clear();
    weekInfoCache.clear();
  }

  static fromObject({ locale, numberingSystem, outputCalendar, weekSettings } = {}) {
    return Locale.create(locale, numberingSystem, outputCalendar, weekSettings);
  }

  constructor(locale, numbering, outputCalendar, weekSettings, specifiedLocale) {
    const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale);

    this.locale = parsedLocale;
    this.numberingSystem = numbering || parsedNumberingSystem || null;
    this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
    this.weekSettings = weekSettings;
    this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);

    this.weekdaysCache = { format: {}, standalone: {} };
    this.monthsCache = { format: {}, standalone: {} };
    this.meridiemCache = null;
    this.eraCache = {};

    this.specifiedLocale = specifiedLocale;
    this.fastNumbersCached = null;
  }

  get fastNumbers() {
    if (this.fastNumbersCached == null) {
      this.fastNumbersCached = supportsFastNumbers(this);
    }

    return this.fastNumbersCached;
  }

  listingMode() {
    const isActuallyEn = this.isEnglish();
    const hasNoWeirdness =
      (this.numberingSystem === null || this.numberingSystem === "latn") &&
      (this.outputCalendar === null || this.outputCalendar === "gregory");
    return isActuallyEn && hasNoWeirdness ? "en" : "intl";
  }

  clone(alts) {
    if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
      return this;
    } else {
      return Locale.create(
        alts.locale || this.specifiedLocale,
        alts.numberingSystem || this.numberingSystem,
        alts.outputCalendar || this.outputCalendar,
        validateWeekSettings(alts.weekSettings) || this.weekSettings,
        alts.defaultToEN || false
      );
    }
  }

  redefaultToEN(alts = {}) {
    return this.clone({ ...alts, defaultToEN: true });
  }

  redefaultToSystem(alts = {}) {
    return this.clone({ ...alts, defaultToEN: false });
  }

  months(length, format = false) {
    return listStuff(this, length, months, () => {
      // Workaround for "ja" locale: formatToParts does not label all parts of the month
      // as "month" and for this locale there is no difference between "format" and "non-format".
      // As such, just use format() instead of formatToParts() and take the whole string
      const monthSpecialCase = this.intl === "ja" || this.intl.startsWith("ja-");
      format &= !monthSpecialCase;
      const intl = format ? { month: length, day: "numeric" } : { month: length },
        formatStr = format ? "format" : "standalone";
      if (!this.monthsCache[formatStr][length]) {
        const mapper = !monthSpecialCase
          ? (dt) => this.extract(dt, intl, "month")
          : (dt) => this.dtFormatter(dt, intl).format();
        this.monthsCache[formatStr][length] = mapMonths(mapper);
      }
      return this.monthsCache[formatStr][length];
    });
  }

  weekdays(length, format = false) {
    return listStuff(this, length, weekdays, () => {
      const intl = format
          ? { weekday: length, year: "numeric", month: "long", day: "numeric" }
          : { weekday: length },
        formatStr = format ? "format" : "standalone";
      if (!this.weekdaysCache[formatStr][length]) {
        this.weekdaysCache[formatStr][length] = mapWeekdays((dt) =>
          this.extract(dt, intl, "weekday")
        );
      }
      return this.weekdaysCache[formatStr][length];
    });
  }

  meridiems() {
    return listStuff(
      this,
      undefined,
      () => meridiems,
      () => {
        // In theory there could be aribitrary day periods. We're gonna assume there are exactly two
        // for AM and PM. This is probably wrong, but it's makes parsing way easier.
        if (!this.meridiemCache) {
          const intl = { hour: "numeric", hourCycle: "h12" };
          this.meridiemCache = [DateTime.utc(2016, 11, 13, 9), DateTime.utc(2016, 11, 13, 19)].map(
            (dt) => this.extract(dt, intl, "dayperiod")
          );
        }

        return this.meridiemCache;
      }
    );
  }

  eras(length) {
    return listStuff(this, length, eras, () => {
      const intl = { era: length };

      // This is problematic. Different calendars are going to define eras totally differently. What I need is the minimum set of dates
      // to definitely enumerate them.
      if (!this.eraCache[length]) {
        this.eraCache[length] = [DateTime.utc(-40, 1, 1), DateTime.utc(2017, 1, 1)].map((dt) =>
          this.extract(dt, intl, "era")
        );
      }

      return this.eraCache[length];
    });
  }

  extract(dt, intlOpts, field) {
    const df = this.dtFormatter(dt, intlOpts),
      results = df.formatToParts(),
      matching = results.find((m) => m.type.toLowerCase() === field);
    return matching ? matching.value : null;
  }

  numberFormatter(opts = {}) {
    // this forcesimple option is never used (the only caller short-circuits on it, but it seems safer to leave)
    // (in contrast, the rest of the condition is used heavily)
    return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
  }

  dtFormatter(dt, intlOpts = {}) {
    return new PolyDateFormatter(dt, this.intl, intlOpts);
  }

  relFormatter(opts = {}) {
    return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
  }

  listFormatter(opts = {}) {
    return getCachedLF(this.intl, opts);
  }

  isEnglish() {
    return (
      this.locale === "en" ||
      this.locale.toLowerCase() === "en-us" ||
      getCachedIntResolvedOptions(this.intl).locale.startsWith("en-us")
    );
  }

  getWeekSettings() {
    if (this.weekSettings) {
      return this.weekSettings;
    } else if (!hasLocaleWeekInfo()) {
      return fallbackWeekSettings;
    } else {
      return getCachedWeekInfo(this.locale);
    }
  }

  getStartOfWeek() {
    return this.getWeekSettings().firstDay;
  }

  getMinDaysInFirstWeek() {
    return this.getWeekSettings().minimalDays;
  }

  getWeekendDays() {
    return this.getWeekSettings().weekend;
  }

  equals(other) {
    return (
      this.locale === other.locale &&
      this.numberingSystem === other.numberingSystem &&
      this.outputCalendar === other.outputCalendar
    );
  }

  toString() {
    return `Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`;
  }
}

let singleton = null;

/**
 * A zone with a fixed offset (meaning no DST)
 * @implements {Zone}
 */
class FixedOffsetZone extends Zone {
  /**
   * Get a singleton instance of UTC
   * @return {FixedOffsetZone}
   */
  static get utcInstance() {
    if (singleton === null) {
      singleton = new FixedOffsetZone(0);
    }
    return singleton;
  }

  /**
   * Get an instance with a specified offset
   * @param {number} offset - The offset in minutes
   * @return {FixedOffsetZone}
   */
  static instance(offset) {
    return offset === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset);
  }

  /**
   * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
   * @param {string} s - The offset string to parse
   * @example FixedOffsetZone.parseSpecifier("UTC+6")
   * @example FixedOffsetZone.parseSpecifier("UTC+06")
   * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
   * @return {FixedOffsetZone}
   */
  static parseSpecifier(s) {
    if (s) {
      const r = s.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
      if (r) {
        return new FixedOffsetZone(signedOffset(r[1], r[2]));
      }
    }
    return null;
  }

  constructor(offset) {
    super();
    /** @private **/
    this.fixed = offset;
  }

  /**
   * The type of zone. `fixed` for all instances of `FixedOffsetZone`.
   * @override
   * @type {string}
   */
  get type() {
    return "fixed";
  }

  /**
   * The name of this zone.
   * All fixed zones' names always start with "UTC" (plus optional offset)
   * @override
   * @type {string}
   */
  get name() {
    return this.fixed === 0 ? "UTC" : `UTC${formatOffset(this.fixed, "narrow")}`;
  }

  /**
   * The IANA name of this zone, i.e. `Etc/UTC` or `Etc/GMT+/-nn`
   *
   * @override
   * @type {string}
   */
  get ianaName() {
    if (this.fixed === 0) {
      return "Etc/UTC";
    } else {
      return `Etc/GMT${formatOffset(-this.fixed, "narrow")}`;
    }
  }

  /**
   * Returns the offset's common name at the specified timestamp.
   *
   * For fixed offset zones this equals to the zone name.
   * @override
   */
  offsetName() {
    return this.name;
  }

  /**
   * Returns the offset's value as a string
   * @override
   * @param {number} ts - Epoch milliseconds for which to get the offset
   * @param {string} format - What style of offset to return.
   *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
   * @return {string}
   */
  formatOffset(ts, format) {
    return formatOffset(this.fixed, format);
  }

  /**
   * Returns whether the offset is known to be fixed for the whole year:
   * Always returns true for all fixed offset zones.
   * @override
   * @type {boolean}
   */
  get isUniversal() {
    return true;
  }

  /**
   * Return the offset in minutes for this zone at the specified timestamp.
   *
   * For fixed offset zones, this is constant and does not depend on a timestamp.
   * @override
   * @return {number}
   */
  offset() {
    return this.fixed;
  }

  /**
   * Return whether this Zone is equal to another zone (i.e. also fixed and same offset)
   * @override
   * @param {Zone} otherZone - the zone to compare
   * @return {boolean}
   */
  equals(otherZone) {
    return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
  }

  /**
   * Return whether this Zone is valid:
   * All fixed offset zones are valid.
   * @override
   * @type {boolean}
   */
  get isValid() {
    return true;
  }
}

/**
 * A zone that failed to parse. You should never need to instantiate this.
 * @implements {Zone}
 */
class InvalidZone extends Zone {
  constructor(zoneName) {
    super();
    /**  @private */
    this.zoneName = zoneName;
  }

  /** @override **/
  get type() {
    return "invalid";
  }

  /** @override **/
  get name() {
    return this.zoneName;
  }

  /** @override **/
  get isUniversal() {
    return false;
  }

  /** @override **/
  offsetName() {
    return null;
  }

  /** @override **/
  formatOffset() {
    return "";
  }

  /** @override **/
  offset() {
    return NaN;
  }

  /** @override **/
  equals() {
    return false;
  }

  /** @override **/
  get isValid() {
    return false;
  }
}

/**
 * @private
 */


function normalizeZone(input, defaultZone) {
  if (isUndefined(input) || input === null) {
    return defaultZone;
  } else if (input instanceof Zone) {
    return input;
  } else if (isString(input)) {
    const lowered = input.toLowerCase();
    if (lowered === "default") return defaultZone;
    else if (lowered === "local" || lowered === "system") return SystemZone.instance;
    else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone.utcInstance;
    else return FixedOffsetZone.parseSpecifier(lowered) || IANAZone.create(input);
  } else if (isNumber(input)) {
    return FixedOffsetZone.instance(input);
  } else if (typeof input === "object" && "offset" in input && typeof input.offset === "function") {
    // This is dumb, but the instanceof check above doesn't seem to really work
    // so we're duck checking it
    return input;
  } else {
    return new InvalidZone(input);
  }
}

const numberingSystems = {
  arab: "[\u0660-\u0669]",
  arabext: "[\u06F0-\u06F9]",
  bali: "[\u1B50-\u1B59]",
  beng: "[\u09E6-\u09EF]",
  deva: "[\u0966-\u096F]",
  fullwide: "[\uFF10-\uFF19]",
  gujr: "[\u0AE6-\u0AEF]",
  hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
  khmr: "[\u17E0-\u17E9]",
  knda: "[\u0CE6-\u0CEF]",
  laoo: "[\u0ED0-\u0ED9]",
  limb: "[\u1946-\u194F]",
  mlym: "[\u0D66-\u0D6F]",
  mong: "[\u1810-\u1819]",
  mymr: "[\u1040-\u1049]",
  orya: "[\u0B66-\u0B6F]",
  tamldec: "[\u0BE6-\u0BEF]",
  telu: "[\u0C66-\u0C6F]",
  thai: "[\u0E50-\u0E59]",
  tibt: "[\u0F20-\u0F29]",
  latn: "\\d",
};

const numberingSystemsUTF16 = {
  arab: [1632, 1641],
  arabext: [1776, 1785],
  bali: [6992, 7001],
  beng: [2534, 2543],
  deva: [2406, 2415],
  fullwide: [65296, 65303],
  gujr: [2790, 2799],
  khmr: [6112, 6121],
  knda: [3302, 3311],
  laoo: [3792, 3801],
  limb: [6470, 6479],
  mlym: [3430, 3439],
  mong: [6160, 6169],
  mymr: [4160, 4169],
  orya: [2918, 2927],
  tamldec: [3046, 3055],
  telu: [3174, 3183],
  thai: [3664, 3673],
  tibt: [3872, 3881],
};

const hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");

function parseDigits(str) {
  let value = parseInt(str, 10);
  if (isNaN(value)) {
    value = "";
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);

      if (str[i].search(numberingSystems.hanidec) !== -1) {
        value += hanidecChars.indexOf(str[i]);
      } else {
        for (const key in numberingSystemsUTF16) {
          const [min, max] = numberingSystemsUTF16[key];
          if (code >= min && code <= max) {
            value += code - min;
          }
        }
      }
    }
    return parseInt(value, 10);
  } else {
    return value;
  }
}

// cache of {numberingSystem: {append: regex}}
const digitRegexCache = new Map();
function resetDigitRegexCache() {
  digitRegexCache.clear();
}

function digitRegex({ numberingSystem }, append = "") {
  const ns = numberingSystem || "latn";

  let appendCache = digitRegexCache.get(ns);
  if (appendCache === undefined) {
    appendCache = new Map();
    digitRegexCache.set(ns, appendCache);
  }
  let regex = appendCache.get(append);
  if (regex === undefined) {
    regex = new RegExp(`${numberingSystems[ns]}${append}`);
    appendCache.set(append, regex);
  }

  return regex;
}

let now = () => Date.now(),
  defaultZone = "system",
  defaultLocale = null,
  defaultNumberingSystem = null,
  defaultOutputCalendar = null,
  twoDigitCutoffYear = 60,
  throwOnInvalid,
  defaultWeekSettings = null;

/**
 * Settings contains static getters and setters that control Luxon's overall behavior. Luxon is a simple library with few options, but the ones it does have live here.
 */
class Settings {
  /**
   * Get the callback for returning the current timestamp.
   * @type {function}
   */
  static get now() {
    return now;
  }

  /**
   * Set the callback for returning the current timestamp.
   * The function should return a number, which will be interpreted as an Epoch millisecond count
   * @type {function}
   * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
   * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
   */
  static set now(n) {
    now = n;
  }

  /**
   * Set the default time zone to create DateTimes in. Does not affect existing instances.
   * Use the value "system" to reset this value to the system's time zone.
   * @type {string}
   */
  static set defaultZone(zone) {
    defaultZone = zone;
  }

  /**
   * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
   * The default value is the system's time zone (the one set on the machine that runs this code).
   * @type {Zone}
   */
  static get defaultZone() {
    return normalizeZone(defaultZone, SystemZone.instance);
  }

  /**
   * Get the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultLocale() {
    return defaultLocale;
  }

  /**
   * Set the default locale to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultLocale(locale) {
    defaultLocale = locale;
  }

  /**
   * Get the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultNumberingSystem() {
    return defaultNumberingSystem;
  }

  /**
   * Set the default numbering system to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultNumberingSystem(numberingSystem) {
    defaultNumberingSystem = numberingSystem;
  }

  /**
   * Get the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static get defaultOutputCalendar() {
    return defaultOutputCalendar;
  }

  /**
   * Set the default output calendar to create DateTimes with. Does not affect existing instances.
   * @type {string}
   */
  static set defaultOutputCalendar(outputCalendar) {
    defaultOutputCalendar = outputCalendar;
  }

  /**
   * @typedef {Object} WeekSettings
   * @property {number} firstDay
   * @property {number} minimalDays
   * @property {number[]} weekend
   */

  /**
   * @return {WeekSettings|null}
   */
  static get defaultWeekSettings() {
    return defaultWeekSettings;
  }

  /**
   * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
   * how many days are required in the first week of a year.
   * Does not affect existing instances.
   *
   * @param {WeekSettings|null} weekSettings
   */
  static set defaultWeekSettings(weekSettings) {
    defaultWeekSettings = validateWeekSettings(weekSettings);
  }

  /**
   * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   */
  static get twoDigitCutoffYear() {
    return twoDigitCutoffYear;
  }

  /**
   * Set the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
   * @type {number}
   * @example Settings.twoDigitCutoffYear = 0 // all 'yy' are interpreted as 20th century
   * @example Settings.twoDigitCutoffYear = 99 // all 'yy' are interpreted as 21st century
   * @example Settings.twoDigitCutoffYear = 50 // '49' -> 2049; '50' -> 1950
   * @example Settings.twoDigitCutoffYear = 1950 // interpreted as 50
   * @example Settings.twoDigitCutoffYear = 2050 // ALSO interpreted as 50
   */
  static set twoDigitCutoffYear(cutoffYear) {
    twoDigitCutoffYear = cutoffYear % 100;
  }

  /**
   * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static get throwOnInvalid() {
    return throwOnInvalid;
  }

  /**
   * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
   * @type {boolean}
   */
  static set throwOnInvalid(t) {
    throwOnInvalid = t;
  }

  /**
   * Reset Luxon's global caches. Should only be necessary in testing scenarios.
   * @return {void}
   */
  static resetCaches() {
    Locale.resetCache();
    IANAZone.resetCache();
    DateTime.resetCache();
    resetDigitRegexCache();
  }
}

class Invalid {
  constructor(reason, explanation) {
    this.reason = reason;
    this.explanation = explanation;
  }

  toMessage() {
    if (this.explanation) {
      return `${this.reason}: ${this.explanation}`;
    } else {
      return this.reason;
    }
  }
}

const nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
  leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

function unitOutOfRange(unit, value) {
  return new Invalid(
    "unit out of range",
    `you specified ${value} (of type ${typeof value}) as a ${unit}, which is invalid`
  );
}

function dayOfWeek(year, month, day) {
  const d = new Date(Date.UTC(year, month - 1, day));

  if (year < 100 && year >= 0) {
    d.setUTCFullYear(d.getUTCFullYear() - 1900);
  }

  const js = d.getUTCDay();

  return js === 0 ? 7 : js;
}

function computeOrdinal(year, month, day) {
  return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
}

function uncomputeOrdinal(year, ordinal) {
  const table = isLeapYear(year) ? leapLadder : nonLeapLadder,
    month0 = table.findIndex((i) => i < ordinal),
    day = ordinal - table[month0];
  return { month: month0 + 1, day };
}

function isoWeekdayToLocal(isoWeekday, startOfWeek) {
  return ((isoWeekday - startOfWeek + 7) % 7) + 1;
}

/**
 * @private
 */

function gregorianToWeek(gregObj, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const { year, month, day } = gregObj,
    ordinal = computeOrdinal(year, month, day),
    weekday = isoWeekdayToLocal(dayOfWeek(year, month, day), startOfWeek);

  let weekNumber = Math.floor((ordinal - weekday + 14 - minDaysInFirstWeek) / 7),
    weekYear;

  if (weekNumber < 1) {
    weekYear = year - 1;
    weekNumber = weeksInWeekYear(weekYear, minDaysInFirstWeek, startOfWeek);
  } else if (weekNumber > weeksInWeekYear(year, minDaysInFirstWeek, startOfWeek)) {
    weekYear = year + 1;
    weekNumber = 1;
  } else {
    weekYear = year;
  }

  return { weekYear, weekNumber, weekday, ...timeObject(gregObj) };
}

function weekToGregorian(weekData, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const { weekYear, weekNumber, weekday } = weekData,
    weekdayOfJan4 = isoWeekdayToLocal(dayOfWeek(weekYear, 1, minDaysInFirstWeek), startOfWeek),
    yearInDays = daysInYear(weekYear);

  let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 7 + minDaysInFirstWeek,
    year;

  if (ordinal < 1) {
    year = weekYear - 1;
    ordinal += daysInYear(year);
  } else if (ordinal > yearInDays) {
    year = weekYear + 1;
    ordinal -= daysInYear(weekYear);
  } else {
    year = weekYear;
  }

  const { month, day } = uncomputeOrdinal(year, ordinal);
  return { year, month, day, ...timeObject(weekData) };
}

function gregorianToOrdinal(gregData) {
  const { year, month, day } = gregData;
  const ordinal = computeOrdinal(year, month, day);
  return { year, ordinal, ...timeObject(gregData) };
}

function ordinalToGregorian(ordinalData) {
  const { year, ordinal } = ordinalData;
  const { month, day } = uncomputeOrdinal(year, ordinal);
  return { year, month, day, ...timeObject(ordinalData) };
}

/**
 * Check if local week units like localWeekday are used in obj.
 * If so, validates that they are not mixed with ISO week units and then copies them to the normal week unit properties.
 * Modifies obj in-place!
 * @param obj the object values
 */
function usesLocalWeekValues(obj, loc) {
  const hasLocaleWeekData =
    !isUndefined(obj.localWeekday) ||
    !isUndefined(obj.localWeekNumber) ||
    !isUndefined(obj.localWeekYear);
  if (hasLocaleWeekData) {
    const hasIsoWeekData =
      !isUndefined(obj.weekday) || !isUndefined(obj.weekNumber) || !isUndefined(obj.weekYear);

    if (hasIsoWeekData) {
      throw new ConflictingSpecificationError(
        "Cannot mix locale-based week fields with ISO-based week fields"
      );
    }
    if (!isUndefined(obj.localWeekday)) obj.weekday = obj.localWeekday;
    if (!isUndefined(obj.localWeekNumber)) obj.weekNumber = obj.localWeekNumber;
    if (!isUndefined(obj.localWeekYear)) obj.weekYear = obj.localWeekYear;
    delete obj.localWeekday;
    delete obj.localWeekNumber;
    delete obj.localWeekYear;
    return {
      minDaysInFirstWeek: loc.getMinDaysInFirstWeek(),
      startOfWeek: loc.getStartOfWeek(),
    };
  } else {
    return { minDaysInFirstWeek: 4, startOfWeek: 1 };
  }
}

function hasInvalidWeekData(obj, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const validYear = isInteger(obj.weekYear),
    validWeek = integerBetween(
      obj.weekNumber,
      1,
      weeksInWeekYear(obj.weekYear, minDaysInFirstWeek, startOfWeek)
    ),
    validWeekday = integerBetween(obj.weekday, 1, 7);

  if (!validYear) {
    return unitOutOfRange("weekYear", obj.weekYear);
  } else if (!validWeek) {
    return unitOutOfRange("week", obj.weekNumber);
  } else if (!validWeekday) {
    return unitOutOfRange("weekday", obj.weekday);
  } else return false;
}

function hasInvalidOrdinalData(obj) {
  const validYear = isInteger(obj.year),
    validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));

  if (!validYear) {
    return unitOutOfRange("year", obj.year);
  } else if (!validOrdinal) {
    return unitOutOfRange("ordinal", obj.ordinal);
  } else return false;
}

function hasInvalidGregorianData(obj) {
  const validYear = isInteger(obj.year),
    validMonth = integerBetween(obj.month, 1, 12),
    validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));

  if (!validYear) {
    return unitOutOfRange("year", obj.year);
  } else if (!validMonth) {
    return unitOutOfRange("month", obj.month);
  } else if (!validDay) {
    return unitOutOfRange("day", obj.day);
  } else return false;
}

function hasInvalidTimeData(obj) {
  const { hour, minute, second, millisecond } = obj;
  const validHour =
      integerBetween(hour, 0, 23) ||
      (hour === 24 && minute === 0 && second === 0 && millisecond === 0),
    validMinute = integerBetween(minute, 0, 59),
    validSecond = integerBetween(second, 0, 59),
    validMillisecond = integerBetween(millisecond, 0, 999);

  if (!validHour) {
    return unitOutOfRange("hour", hour);
  } else if (!validMinute) {
    return unitOutOfRange("minute", minute);
  } else if (!validSecond) {
    return unitOutOfRange("second", second);
  } else if (!validMillisecond) {
    return unitOutOfRange("millisecond", millisecond);
  } else return false;
}

/*
  This is just a junk drawer, containing anything used across multiple classes.
  Because Luxon is small(ish), this should stay small and we won't worry about splitting
  it up into, say, parsingUtil.js and basicUtil.js and so on. But they are divided up by feature area.
*/


/**
 * @private
 */

// TYPES

function isUndefined(o) {
  return typeof o === "undefined";
}

function isNumber(o) {
  return typeof o === "number";
}

function isInteger(o) {
  return typeof o === "number" && o % 1 === 0;
}

function isString(o) {
  return typeof o === "string";
}

function isDate(o) {
  return Object.prototype.toString.call(o) === "[object Date]";
}

// CAPABILITIES

function hasRelative() {
  try {
    return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
  } catch (e) {
    return false;
  }
}

function hasLocaleWeekInfo() {
  try {
    return (
      typeof Intl !== "undefined" &&
      !!Intl.Locale &&
      ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype)
    );
  } catch (e) {
    return false;
  }
}

// OBJECTS AND ARRAYS

function maybeArray(thing) {
  return Array.isArray(thing) ? thing : [thing];
}

function bestBy(arr, by, compare) {
  if (arr.length === 0) {
    return undefined;
  }
  return arr.reduce((best, next) => {
    const pair = [by(next), next];
    if (!best) {
      return pair;
    } else if (compare(best[0], pair[0]) === best[0]) {
      return best;
    } else {
      return pair;
    }
  }, null)[1];
}

function pick(obj, keys) {
  return keys.reduce((a, k) => {
    a[k] = obj[k];
    return a;
  }, {});
}

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function validateWeekSettings(settings) {
  if (settings == null) {
    return null;
  } else if (typeof settings !== "object") {
    throw new InvalidArgumentError("Week settings must be an object");
  } else {
    if (
      !integerBetween(settings.firstDay, 1, 7) ||
      !integerBetween(settings.minimalDays, 1, 7) ||
      !Array.isArray(settings.weekend) ||
      settings.weekend.some((v) => !integerBetween(v, 1, 7))
    ) {
      throw new InvalidArgumentError("Invalid week settings");
    }
    return {
      firstDay: settings.firstDay,
      minimalDays: settings.minimalDays,
      weekend: Array.from(settings.weekend),
    };
  }
}

// NUMBERS AND STRINGS

function integerBetween(thing, bottom, top) {
  return isInteger(thing) && thing >= bottom && thing <= top;
}

// x % n but takes the sign of n instead of x
function floorMod(x, n) {
  return x - n * Math.floor(x / n);
}

function padStart(input, n = 2) {
  const isNeg = input < 0;
  let padded;
  if (isNeg) {
    padded = "-" + ("" + -input).padStart(n, "0");
  } else {
    padded = ("" + input).padStart(n, "0");
  }
  return padded;
}

function parseInteger(string) {
  if (isUndefined(string) || string === null || string === "") {
    return undefined;
  } else {
    return parseInt(string, 10);
  }
}

function parseFloating(string) {
  if (isUndefined(string) || string === null || string === "") {
    return undefined;
  } else {
    return parseFloat(string);
  }
}

function parseMillis(fraction) {
  // Return undefined (instead of 0) in these cases, where fraction is not set
  if (isUndefined(fraction) || fraction === null || fraction === "") {
    return undefined;
  } else {
    const f = parseFloat("0." + fraction) * 1000;
    return Math.floor(f);
  }
}

function roundTo(number, digits, rounding = "round") {
  const factor = 10 ** digits;
  switch (rounding) {
    case "expand":
      return number > 0
        ? Math.ceil(number * factor) / factor
        : Math.floor(number * factor) / factor;
    case "trunc":
      return Math.trunc(number * factor) / factor;
    case "round":
      return Math.round(number * factor) / factor;
    case "floor":
      return Math.floor(number * factor) / factor;
    case "ceil":
      return Math.ceil(number * factor) / factor;
    default:
      throw new RangeError(`Value rounding ${rounding} is out of range`);
  }
}

// DATE BASICS

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

function daysInMonth(year, month) {
  const modMonth = floorMod(month - 1, 12) + 1,
    modYear = year + (month - modMonth) / 12;

  if (modMonth === 2) {
    return isLeapYear(modYear) ? 29 : 28;
  } else {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
  }
}

// convert a calendar object to a local timestamp (epoch, but with the offset baked in)
function objToLocalTS(obj) {
  let d = Date.UTC(
    obj.year,
    obj.month - 1,
    obj.day,
    obj.hour,
    obj.minute,
    obj.second,
    obj.millisecond
  );

  // for legacy reasons, years between 0 and 99 are interpreted as 19XX; revert that
  if (obj.year < 100 && obj.year >= 0) {
    d = new Date(d);
    // set the month and day again, this is necessary because year 2000 is a leap year, but year 100 is not
    // so if obj.year is in 99, but obj.day makes it roll over into year 100,
    // the calculations done by Date.UTC are using year 2000 - which is incorrect
    d.setUTCFullYear(obj.year, obj.month - 1, obj.day);
  }
  return +d;
}

// adapted from moment.js: https://github.com/moment/moment/blob/000ac1800e620f770f4eb31b5ae908f6167b0ab2/src/lib/units/week-calendar-utils.js
function firstWeekOffset(year, minDaysInFirstWeek, startOfWeek) {
  const fwdlw = isoWeekdayToLocal(dayOfWeek(year, 1, minDaysInFirstWeek), startOfWeek);
  return -fwdlw + minDaysInFirstWeek - 1;
}

function weeksInWeekYear(weekYear, minDaysInFirstWeek = 4, startOfWeek = 1) {
  const weekOffset = firstWeekOffset(weekYear, minDaysInFirstWeek, startOfWeek);
  const weekOffsetNext = firstWeekOffset(weekYear + 1, minDaysInFirstWeek, startOfWeek);
  return (daysInYear(weekYear) - weekOffset + weekOffsetNext) / 7;
}

function untruncateYear(year) {
  if (year > 99) {
    return year;
  } else return year > Settings.twoDigitCutoffYear ? 1900 + year : 2000 + year;
}

// PARSING

function parseZoneInfo(ts, offsetFormat, locale, timeZone = null) {
  const date = new Date(ts),
    intlOpts = {
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

  if (timeZone) {
    intlOpts.timeZone = timeZone;
  }

  const modified = { timeZoneName: offsetFormat, ...intlOpts };

  const parsed = new Intl.DateTimeFormat(locale, modified)
    .formatToParts(date)
    .find((m) => m.type.toLowerCase() === "timezonename");
  return parsed ? parsed.value : null;
}

// signedOffset('-5', '30') -> -330
function signedOffset(offHourStr, offMinuteStr) {
  let offHour = parseInt(offHourStr, 10);

  // don't || this because we want to preserve -0
  if (Number.isNaN(offHour)) {
    offHour = 0;
  }

  const offMin = parseInt(offMinuteStr, 10) || 0,
    offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
  return offHour * 60 + offMinSigned;
}

// COERCION

function asNumber(value) {
  const numericValue = Number(value);
  if (typeof value === "boolean" || value === "" || !Number.isFinite(numericValue))
    throw new InvalidArgumentError(`Invalid unit value ${value}`);
  return numericValue;
}

function normalizeObject(obj, normalizer) {
  const normalized = {};
  for (const u in obj) {
    if (hasOwnProperty(obj, u)) {
      const v = obj[u];
      if (v === undefined || v === null) continue;
      normalized[normalizer(u)] = asNumber(v);
    }
  }
  return normalized;
}

/**
 * Returns the offset's value as a string
 * @param {number} ts - Epoch milliseconds for which to get the offset
 * @param {string} format - What style of offset to return.
 *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
 * @return {string}
 */
function formatOffset(offset, format) {
  const hours = Math.trunc(Math.abs(offset / 60)),
    minutes = Math.trunc(Math.abs(offset % 60)),
    sign = offset >= 0 ? "+" : "-";

  switch (format) {
    case "short":
      return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
    case "narrow":
      return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
    case "techie":
      return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
    default:
      throw new RangeError(`Value format ${format} is out of range for property format`);
  }
}

function timeObject(obj) {
  return pick(obj, ["hour", "minute", "second", "millisecond"]);
}

/**
 * @private
 */

const monthsLong = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function months(length) {
  switch (length) {
    case "narrow":
      return [...monthsNarrow];
    case "short":
      return [...monthsShort];
    case "long":
      return [...monthsLong];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    case "2-digit":
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    default:
      return null;
  }
}

const weekdaysLong = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];

function weekdays(length) {
  switch (length) {
    case "narrow":
      return [...weekdaysNarrow];
    case "short":
      return [...weekdaysShort];
    case "long":
      return [...weekdaysLong];
    case "numeric":
      return ["1", "2", "3", "4", "5", "6", "7"];
    default:
      return null;
  }
}

const meridiems = ["AM", "PM"];

const erasLong = ["Before Christ", "Anno Domini"];

const erasShort = ["BC", "AD"];

const erasNarrow = ["B", "A"];

function eras(length) {
  switch (length) {
    case "narrow":
      return [...erasNarrow];
    case "short":
      return [...erasShort];
    case "long":
      return [...erasLong];
    default:
      return null;
  }
}

function meridiemForDateTime(dt) {
  return meridiems[dt.hour < 12 ? 0 : 1];
}

function weekdayForDateTime(dt, length) {
  return weekdays(length)[dt.weekday - 1];
}

function monthForDateTime(dt, length) {
  return months(length)[dt.month - 1];
}

function eraForDateTime(dt, length) {
  return eras(length)[dt.year < 0 ? 0 : 1];
}

function formatRelativeTime(unit, count, numeric = "always", narrow = false) {
  const units = {
    years: ["year", "yr."],
    quarters: ["quarter", "qtr."],
    months: ["month", "mo."],
    weeks: ["week", "wk."],
    days: ["day", "day", "days"],
    hours: ["hour", "hr."],
    minutes: ["minute", "min."],
    seconds: ["second", "sec."],
  };

  const lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;

  if (numeric === "auto" && lastable) {
    const isDay = unit === "days";
    switch (count) {
      case 1:
        return isDay ? "tomorrow" : `next ${units[unit][0]}`;
      case -1:
        return isDay ? "yesterday" : `last ${units[unit][0]}`;
      case 0:
        return isDay ? "today" : `this ${units[unit][0]}`;
    }
  }

  const isInPast = Object.is(count, -0) || count < 0,
    fmtValue = Math.abs(count),
    singular = fmtValue === 1,
    lilUnits = units[unit],
    fmtUnit = narrow
      ? singular
        ? lilUnits[1]
        : lilUnits[2] || lilUnits[1]
      : singular
      ? units[unit][0]
      : unit;
  return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
}

function stringifyTokens(splits, tokenToString) {
  let s = "";
  for (const token of splits) {
    if (token.literal) {
      s += token.val;
    } else {
      s += tokenToString(token.val);
    }
  }
  return s;
}

const macroTokenToFormatOpts = {
  D: DATE_SHORT,
  DD: DATE_MED,
  DDD: DATE_FULL,
  DDDD: DATE_HUGE,
  t: TIME_SIMPLE,
  tt: TIME_WITH_SECONDS,
  ttt: TIME_WITH_SHORT_OFFSET,
  tttt: TIME_WITH_LONG_OFFSET,
  T: TIME_24_SIMPLE,
  TT: TIME_24_WITH_SECONDS,
  TTT: TIME_24_WITH_SHORT_OFFSET,
  TTTT: TIME_24_WITH_LONG_OFFSET,
  f: DATETIME_SHORT,
  ff: DATETIME_MED,
  fff: DATETIME_FULL,
  ffff: DATETIME_HUGE,
  F: DATETIME_SHORT_WITH_SECONDS,
  FF: DATETIME_MED_WITH_SECONDS,
  FFF: DATETIME_FULL_WITH_SECONDS,
  FFFF: DATETIME_HUGE_WITH_SECONDS,
};

/**
 * @private
 */

class Formatter {
  static create(locale, opts = {}) {
    return new Formatter(locale, opts);
  }

  static parseFormat(fmt) {
    // white-space is always considered a literal in user-provided formats
    // the " " token has a special meaning (see unitForToken)

    let current = null,
      currentFull = "",
      bracketed = false;
    const splits = [];
    for (let i = 0; i < fmt.length; i++) {
      const c = fmt.charAt(i);
      if (c === "'") {
        // turn '' into a literal signal quote instead of just skipping the empty literal
        if (currentFull.length > 0 || bracketed) {
          splits.push({
            literal: bracketed || /^\s+$/.test(currentFull),
            val: currentFull === "" ? "'" : currentFull,
          });
        }
        current = null;
        currentFull = "";
        bracketed = !bracketed;
      } else if (bracketed) {
        currentFull += c;
      } else if (c === current) {
        currentFull += c;
      } else {
        if (currentFull.length > 0) {
          splits.push({ literal: /^\s+$/.test(currentFull), val: currentFull });
        }
        currentFull = c;
        current = c;
      }
    }

    if (currentFull.length > 0) {
      splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
    }

    return splits;
  }

  static macroTokenToFormatOpts(token) {
    return macroTokenToFormatOpts[token];
  }

  constructor(locale, formatOpts) {
    this.opts = formatOpts;
    this.loc = locale;
    this.systemLoc = null;
  }

  formatWithSystemDefault(dt, opts) {
    if (this.systemLoc === null) {
      this.systemLoc = this.loc.redefaultToSystem();
    }
    const df = this.systemLoc.dtFormatter(dt, { ...this.opts, ...opts });
    return df.format();
  }

  dtFormatter(dt, opts = {}) {
    return this.loc.dtFormatter(dt, { ...this.opts, ...opts });
  }

  formatDateTime(dt, opts) {
    return this.dtFormatter(dt, opts).format();
  }

  formatDateTimeParts(dt, opts) {
    return this.dtFormatter(dt, opts).formatToParts();
  }

  formatInterval(interval, opts) {
    const df = this.dtFormatter(interval.start, opts);
    return df.dtf.formatRange(interval.start.toJSDate(), interval.end.toJSDate());
  }

  resolvedOptions(dt, opts) {
    return this.dtFormatter(dt, opts).resolvedOptions();
  }

  num(n, p = 0, signDisplay = undefined) {
    // we get some perf out of doing this here, annoyingly
    if (this.opts.forceSimple) {
      return padStart(n, p);
    }

    const opts = { ...this.opts };

    if (p > 0) {
      opts.padTo = p;
    }
    if (signDisplay) {
      opts.signDisplay = signDisplay;
    }

    return this.loc.numberFormatter(opts).format(n);
  }

  formatDateTimeFromString(dt, fmt) {
    const knownEnglish = this.loc.listingMode() === "en",
      useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory",
      string = (opts, extract) => this.loc.extract(dt, opts, extract),
      formatOffset = (opts) => {
        if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
          return "Z";
        }

        return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
      },
      meridiem = () =>
        knownEnglish
          ? meridiemForDateTime(dt)
          : string({ hour: "numeric", hourCycle: "h12" }, "dayperiod"),
      month = (length, standalone) =>
        knownEnglish
          ? monthForDateTime(dt, length)
          : string(standalone ? { month: length } : { month: length, day: "numeric" }, "month"),
      weekday = (length, standalone) =>
        knownEnglish
          ? weekdayForDateTime(dt, length)
          : string(
              standalone ? { weekday: length } : { weekday: length, month: "long", day: "numeric" },
              "weekday"
            ),
      maybeMacro = (token) => {
        const formatOpts = Formatter.macroTokenToFormatOpts(token);
        if (formatOpts) {
          return this.formatWithSystemDefault(dt, formatOpts);
        } else {
          return token;
        }
      },
      era = (length) =>
        knownEnglish ? eraForDateTime(dt, length) : string({ era: length }, "era"),
      tokenToString = (token) => {
        // Where possible: https://cldr.unicode.org/translation/date-time/date-time-symbols
        switch (token) {
          // ms
          case "S":
            return this.num(dt.millisecond);
          case "u":
          // falls through
          case "SSS":
            return this.num(dt.millisecond, 3);
          // seconds
          case "s":
            return this.num(dt.second);
          case "ss":
            return this.num(dt.second, 2);
          // fractional seconds
          case "uu":
            return this.num(Math.floor(dt.millisecond / 10), 2);
          case "uuu":
            return this.num(Math.floor(dt.millisecond / 100));
          // minutes
          case "m":
            return this.num(dt.minute);
          case "mm":
            return this.num(dt.minute, 2);
          // hours
          case "h":
            return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
          case "hh":
            return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
          case "H":
            return this.num(dt.hour);
          case "HH":
            return this.num(dt.hour, 2);
          // offset
          case "Z":
            // like +6
            return formatOffset({ format: "narrow", allowZ: this.opts.allowZ });
          case "ZZ":
            // like +06:00
            return formatOffset({ format: "short", allowZ: this.opts.allowZ });
          case "ZZZ":
            // like +0600
            return formatOffset({ format: "techie", allowZ: this.opts.allowZ });
          case "ZZZZ":
            // like EST
            return dt.zone.offsetName(dt.ts, { format: "short", locale: this.loc.locale });
          case "ZZZZZ":
            // like Eastern Standard Time
            return dt.zone.offsetName(dt.ts, { format: "long", locale: this.loc.locale });
          // zone
          case "z":
            // like America/New_York
            return dt.zoneName;
          // meridiems
          case "a":
            return meridiem();
          // dates
          case "d":
            return useDateTimeFormatter ? string({ day: "numeric" }, "day") : this.num(dt.day);
          case "dd":
            return useDateTimeFormatter ? string({ day: "2-digit" }, "day") : this.num(dt.day, 2);
          // weekdays - standalone
          case "c":
            // like 1
            return this.num(dt.weekday);
          case "ccc":
            // like 'Tues'
            return weekday("short", true);
          case "cccc":
            // like 'Tuesday'
            return weekday("long", true);
          case "ccccc":
            // like 'T'
            return weekday("narrow", true);
          // weekdays - format
          case "E":
            // like 1
            return this.num(dt.weekday);
          case "EEE":
            // like 'Tues'
            return weekday("short", false);
          case "EEEE":
            // like 'Tuesday'
            return weekday("long", false);
          case "EEEEE":
            // like 'T'
            return weekday("narrow", false);
          // months - standalone
          case "L":
            // like 1
            return useDateTimeFormatter
              ? string({ month: "numeric", day: "numeric" }, "month")
              : this.num(dt.month);
          case "LL":
            // like 01, doesn't seem to work
            return useDateTimeFormatter
              ? string({ month: "2-digit", day: "numeric" }, "month")
              : this.num(dt.month, 2);
          case "LLL":
            // like Jan
            return month("short", true);
          case "LLLL":
            // like January
            return month("long", true);
          case "LLLLL":
            // like J
            return month("narrow", true);
          // months - format
          case "M":
            // like 1
            return useDateTimeFormatter
              ? string({ month: "numeric" }, "month")
              : this.num(dt.month);
          case "MM":
            // like 01
            return useDateTimeFormatter
              ? string({ month: "2-digit" }, "month")
              : this.num(dt.month, 2);
          case "MMM":
            // like Jan
            return month("short", false);
          case "MMMM":
            // like January
            return month("long", false);
          case "MMMMM":
            // like J
            return month("narrow", false);
          // years
          case "y":
            // like 2014
            return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year);
          case "yy":
            // like 14
            return useDateTimeFormatter
              ? string({ year: "2-digit" }, "year")
              : this.num(dt.year.toString().slice(-2), 2);
          case "yyyy":
            // like 0012
            return useDateTimeFormatter
              ? string({ year: "numeric" }, "year")
              : this.num(dt.year, 4);
          case "yyyyyy":
            // like 000012
            return useDateTimeFormatter
              ? string({ year: "numeric" }, "year")
              : this.num(dt.year, 6);
          // eras
          case "G":
            // like AD
            return era("short");
          case "GG":
            // like Anno Domini
            return era("long");
          case "GGGGG":
            return era("narrow");
          case "kk":
            return this.num(dt.weekYear.toString().slice(-2), 2);
          case "kkkk":
            return this.num(dt.weekYear, 4);
          case "W":
            return this.num(dt.weekNumber);
          case "WW":
            return this.num(dt.weekNumber, 2);
          case "n":
            return this.num(dt.localWeekNumber);
          case "nn":
            return this.num(dt.localWeekNumber, 2);
          case "ii":
            return this.num(dt.localWeekYear.toString().slice(-2), 2);
          case "iiii":
            return this.num(dt.localWeekYear, 4);
          case "o":
            return this.num(dt.ordinal);
          case "ooo":
            return this.num(dt.ordinal, 3);
          case "q":
            // like 1
            return this.num(dt.quarter);
          case "qq":
            // like 01
            return this.num(dt.quarter, 2);
          case "X":
            return this.num(Math.floor(dt.ts / 1000));
          case "x":
            return this.num(dt.ts);
          default:
            return maybeMacro(token);
        }
      };

    return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
  }

  formatDurationFromString(dur, fmt) {
    const invertLargest = this.opts.signMode === "negativeLargestOnly" ? -1 : 1;
    const tokenToField = (token) => {
        switch (token[0]) {
          case "S":
            return "milliseconds";
          case "s":
            return "seconds";
          case "m":
            return "minutes";
          case "h":
            return "hours";
          case "d":
            return "days";
          case "w":
            return "weeks";
          case "M":
            return "months";
          case "y":
            return "years";
          default:
            return null;
        }
      },
      tokenToString = (lildur, info) => (token) => {
        const mapped = tokenToField(token);
        if (mapped) {
          const inversionFactor =
            info.isNegativeDuration && mapped !== info.largestUnit ? invertLargest : 1;
          let signDisplay;
          if (this.opts.signMode === "negativeLargestOnly" && mapped !== info.largestUnit) {
            signDisplay = "never";
          } else if (this.opts.signMode === "all") {
            signDisplay = "always";
          } else {
            // "auto" and "negative" are the same, but "auto" has better support
            signDisplay = "auto";
          }
          return this.num(lildur.get(mapped) * inversionFactor, token.length, signDisplay);
        } else {
          return token;
        }
      },
      tokens = Formatter.parseFormat(fmt),
      realTokens = tokens.reduce(
        (found, { literal, val }) => (literal ? found : found.concat(val)),
        []
      ),
      collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t) => t)),
      durationInfo = {
        isNegativeDuration: collapsed < 0,
        // this relies on "collapsed" being based on "shiftTo", which builds up the object
        // in order
        largestUnit: Object.keys(collapsed.values)[0],
      };
    return stringifyTokens(tokens, tokenToString(collapsed, durationInfo));
  }
}

/*
 * This file handles parsing for well-specified formats. Here's how it works:
 * Two things go into parsing: a regex to match with and an extractor to take apart the groups in the match.
 * An extractor is just a function that takes a regex match array and returns a { year: ..., month: ... } object
 * parse() does the work of executing the regex and applying the extractor. It takes multiple regex/extractor pairs to try in sequence.
 * Extractors can take a "cursor" representing the offset in the match to look at. This makes it easy to combine extractors.
 * combineExtractors() does the work of combining them, keeping track of the cursor through multiple extractions.
 * Some extractions are super dumb and simpleParse and fromStrings help DRY them.
 */

const ianaRegex = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;

function combineRegexes(...regexes) {
  const full = regexes.reduce((f, r) => f + r.source, "");
  return RegExp(`^${full}$`);
}

function combineExtractors(...extractors) {
  return (m) =>
    extractors
      .reduce(
        ([mergedVals, mergedZone, cursor], ex) => {
          const [val, zone, next] = ex(m, cursor);
          return [{ ...mergedVals, ...val }, zone || mergedZone, next];
        },
        [{}, null, 1]
      )
      .slice(0, 2);
}

function parse(s, ...patterns) {
  if (s == null) {
    return [null, null];
  }

  for (const [regex, extractor] of patterns) {
    const m = regex.exec(s);
    if (m) {
      return extractor(m);
    }
  }
  return [null, null];
}

function simpleParse(...keys) {
  return (match, cursor) => {
    const ret = {};
    let i;

    for (i = 0; i < keys.length; i++) {
      ret[keys[i]] = parseInteger(match[cursor + i]);
    }
    return [ret, null, cursor + i];
  };
}

// ISO and SQL parsing
const offsetRegex = /(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/;
const isoExtendedZone = `(?:${offsetRegex.source}?(?:\\[(${ianaRegex.source})\\])?)?`;
const isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
const isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${isoExtendedZone}`);
const isoTimeExtensionRegex = RegExp(`(?:[Tt]${isoTimeRegex.source})?`);
const isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
const isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
const isoOrdinalRegex = /(\d{4})-?(\d{3})/;
const extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay");
const extractISOOrdinalData = simpleParse("year", "ordinal");
const sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/; // dumbed-down version of the ISO one
const sqlTimeRegex = RegExp(
  `${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex.source}))?`
);
const sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);

function int(match, pos, fallback) {
  const m = match[pos];
  return isUndefined(m) ? fallback : parseInteger(m);
}

function extractISOYmd(match, cursor) {
  const item = {
    year: int(match, cursor),
    month: int(match, cursor + 1, 1),
    day: int(match, cursor + 2, 1),
  };

  return [item, null, cursor + 3];
}

function extractISOTime(match, cursor) {
  const item = {
    hours: int(match, cursor, 0),
    minutes: int(match, cursor + 1, 0),
    seconds: int(match, cursor + 2, 0),
    milliseconds: parseMillis(match[cursor + 3]),
  };

  return [item, null, cursor + 4];
}

function extractISOOffset(match, cursor) {
  const local = !match[cursor] && !match[cursor + 1],
    fullOffset = signedOffset(match[cursor + 1], match[cursor + 2]),
    zone = local ? null : FixedOffsetZone.instance(fullOffset);
  return [{}, zone, cursor + 3];
}

function extractIANAZone(match, cursor) {
  const zone = match[cursor] ? IANAZone.create(match[cursor]) : null;
  return [{}, zone, cursor + 1];
}

// ISO time parsing

const isoTimeOnly = RegExp(`^T?${isoTimeBaseRegex.source}$`);

// ISO duration parsing

const isoDuration =
  /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;

function extractISODuration(match) {
  const [s, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] =
    match;

  const hasNegativePrefix = s[0] === "-";
  const negativeSeconds = secondStr && secondStr[0] === "-";

  const maybeNegate = (num, force = false) =>
    num !== undefined && (force || (num && hasNegativePrefix)) ? -num : num;

  return [
    {
      years: maybeNegate(parseFloating(yearStr)),
      months: maybeNegate(parseFloating(monthStr)),
      weeks: maybeNegate(parseFloating(weekStr)),
      days: maybeNegate(parseFloating(dayStr)),
      hours: maybeNegate(parseFloating(hourStr)),
      minutes: maybeNegate(parseFloating(minuteStr)),
      seconds: maybeNegate(parseFloating(secondStr), secondStr === "-0"),
      milliseconds: maybeNegate(parseMillis(millisecondsStr), negativeSeconds),
    },
  ];
}

// These are a little braindead. EDT *should* tell us that we're in, say, America/New_York
// and not just that we're in -240 *right now*. But since I don't think these are used that often
// I'm just going to ignore that
const obsOffsets = {
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60,
};

function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  const result = {
    year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
    month: monthsShort.indexOf(monthStr) + 1,
    day: parseInteger(dayStr),
    hour: parseInteger(hourStr),
    minute: parseInteger(minuteStr),
  };

  if (secondStr) result.second = parseInteger(secondStr);
  if (weekdayStr) {
    result.weekday =
      weekdayStr.length > 3
        ? weekdaysLong.indexOf(weekdayStr) + 1
        : weekdaysShort.indexOf(weekdayStr) + 1;
  }

  return result;
}

// RFC 2822/5322
const rfc2822 =
  /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;

function extractRFC2822(match) {
  const [
      ,
      weekdayStr,
      dayStr,
      monthStr,
      yearStr,
      hourStr,
      minuteStr,
      secondStr,
      obsOffset,
      milOffset,
      offHourStr,
      offMinuteStr,
    ] = match,
    result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);

  let offset;
  if (obsOffset) {
    offset = obsOffsets[obsOffset];
  } else if (milOffset) {
    offset = 0;
  } else {
    offset = signedOffset(offHourStr, offMinuteStr);
  }

  return [result, new FixedOffsetZone(offset)];
}

function preprocessRFC2822(s) {
  // Remove comments and folding whitespace and replace multiple-spaces with a single space
  return s
    .replace(/\([^()]*\)|[\n\t]/g, " ")
    .replace(/(\s\s+)/g, " ")
    .trim();
}

// http date

const rfc1123 =
    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,
  rfc850 =
    /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,
  ascii =
    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;

function extractRFC1123Or850(match) {
  const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match,
    result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone.utcInstance];
}

function extractASCII(match) {
  const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match,
    result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
  return [result, FixedOffsetZone.utcInstance];
}

const isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
const isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
const isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
const isoTimeCombinedRegex = combineRegexes(isoTimeRegex);

const extractISOYmdTimeAndOffset = combineExtractors(
  extractISOYmd,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOWeekTimeAndOffset = combineExtractors(
  extractISOWeekData,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOOrdinalDateAndTime = combineExtractors(
  extractISOOrdinalData,
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);
const extractISOTimeAndOffset = combineExtractors(
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);

/*
 * @private
 */

function parseISODate(s) {
  return parse(
    s,
    [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
    [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset],
    [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDateAndTime],
    [isoTimeCombinedRegex, extractISOTimeAndOffset]
  );
}

function parseRFC2822Date(s) {
  return parse(preprocessRFC2822(s), [rfc2822, extractRFC2822]);
}

function parseHTTPDate(s) {
  return parse(
    s,
    [rfc1123, extractRFC1123Or850],
    [rfc850, extractRFC1123Or850],
    [ascii, extractASCII]
  );
}

function parseISODuration(s) {
  return parse(s, [isoDuration, extractISODuration]);
}

const extractISOTimeOnly = combineExtractors(extractISOTime);

function parseISOTimeOnly(s) {
  return parse(s, [isoTimeOnly, extractISOTimeOnly]);
}

const sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
const sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);

const extractISOTimeOffsetAndIANAZone = combineExtractors(
  extractISOTime,
  extractISOOffset,
  extractIANAZone
);

function parseSQL(s) {
  return parse(
    s,
    [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
    [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]
  );
}

const INVALID$2 = "Invalid Duration";

// unit conversion constants
const lowOrderMatrix = {
    weeks: {
      days: 7,
      hours: 7 * 24,
      minutes: 7 * 24 * 60,
      seconds: 7 * 24 * 60 * 60,
      milliseconds: 7 * 24 * 60 * 60 * 1000,
    },
    days: {
      hours: 24,
      minutes: 24 * 60,
      seconds: 24 * 60 * 60,
      milliseconds: 24 * 60 * 60 * 1000,
    },
    hours: { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1000 },
    minutes: { seconds: 60, milliseconds: 60 * 1000 },
    seconds: { milliseconds: 1000 },
  },
  casualMatrix = {
    years: {
      quarters: 4,
      months: 12,
      weeks: 52,
      days: 365,
      hours: 365 * 24,
      minutes: 365 * 24 * 60,
      seconds: 365 * 24 * 60 * 60,
      milliseconds: 365 * 24 * 60 * 60 * 1000,
    },
    quarters: {
      months: 3,
      weeks: 13,
      days: 91,
      hours: 91 * 24,
      minutes: 91 * 24 * 60,
      seconds: 91 * 24 * 60 * 60,
      milliseconds: 91 * 24 * 60 * 60 * 1000,
    },
    months: {
      weeks: 4,
      days: 30,
      hours: 30 * 24,
      minutes: 30 * 24 * 60,
      seconds: 30 * 24 * 60 * 60,
      milliseconds: 30 * 24 * 60 * 60 * 1000,
    },

    ...lowOrderMatrix,
  },
  daysInYearAccurate = 146097.0 / 400,
  daysInMonthAccurate = 146097.0 / 4800,
  accurateMatrix = {
    years: {
      quarters: 4,
      months: 12,
      weeks: daysInYearAccurate / 7,
      days: daysInYearAccurate,
      hours: daysInYearAccurate * 24,
      minutes: daysInYearAccurate * 24 * 60,
      seconds: daysInYearAccurate * 24 * 60 * 60,
      milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000,
    },
    quarters: {
      months: 3,
      weeks: daysInYearAccurate / 28,
      days: daysInYearAccurate / 4,
      hours: (daysInYearAccurate * 24) / 4,
      minutes: (daysInYearAccurate * 24 * 60) / 4,
      seconds: (daysInYearAccurate * 24 * 60 * 60) / 4,
      milliseconds: (daysInYearAccurate * 24 * 60 * 60 * 1000) / 4,
    },
    months: {
      weeks: daysInMonthAccurate / 7,
      days: daysInMonthAccurate,
      hours: daysInMonthAccurate * 24,
      minutes: daysInMonthAccurate * 24 * 60,
      seconds: daysInMonthAccurate * 24 * 60 * 60,
      milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1000,
    },
    ...lowOrderMatrix,
  };

// units ordered by size
const orderedUnits$1 = [
  "years",
  "quarters",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
];

const reverseUnits = orderedUnits$1.slice(0).reverse();

// clone really means "create another instance just like this one, but with these changes"
function clone$1(dur, alts, clear = false) {
  // deep merge for vals
  const conf = {
    values: clear ? alts.values : { ...dur.values, ...(alts.values || {}) },
    loc: dur.loc.clone(alts.loc),
    conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy,
    matrix: alts.matrix || dur.matrix,
  };
  return new Duration(conf);
}

function durationToMillis(matrix, vals) {
  let sum = vals.milliseconds ?? 0;
  for (const unit of reverseUnits.slice(1)) {
    if (vals[unit]) {
      sum += vals[unit] * matrix[unit]["milliseconds"];
    }
  }
  return sum;
}

// NB: mutates parameters
function normalizeValues(matrix, vals) {
  // the logic below assumes the overall value of the duration is positive
  // if this is not the case, factor is used to make it so
  const factor = durationToMillis(matrix, vals) < 0 ? -1 : 1;

  orderedUnits$1.reduceRight((previous, current) => {
    if (!isUndefined(vals[current])) {
      if (previous) {
        const previousVal = vals[previous] * factor;
        const conv = matrix[current][previous];

        // if (previousVal < 0):
        // lower order unit is negative (e.g. { years: 2, days: -2 })
        // normalize this by reducing the higher order unit by the appropriate amount
        // and increasing the lower order unit
        // this can never make the higher order unit negative, because this function only operates
        // on positive durations, so the amount of time represented by the lower order unit cannot
        // be larger than the higher order unit
        // else:
        // lower order unit is positive (e.g. { years: 2, days: 450 } or { years: -2, days: 450 })
        // in this case we attempt to convert as much as possible from the lower order unit into
        // the higher order one
        //
        // Math.floor takes care of both of these cases, rounding away from 0
        // if previousVal < 0 it makes the absolute value larger
        // if previousVal >= it makes the absolute value smaller
        const rollUp = Math.floor(previousVal / conv);
        vals[current] += rollUp * factor;
        vals[previous] -= rollUp * conv * factor;
      }
      return current;
    } else {
      return previous;
    }
  }, null);

  // try to convert any decimals into smaller units if possible
  // for example for { years: 2.5, days: 0, seconds: 0 } we want to get { years: 2, days: 182, hours: 12 }
  orderedUnits$1.reduce((previous, current) => {
    if (!isUndefined(vals[current])) {
      if (previous) {
        const fraction = vals[previous] % 1;
        vals[previous] -= fraction;
        vals[current] += fraction * matrix[previous][current];
      }
      return current;
    } else {
      return previous;
    }
  }, null);
}

// Remove all properties with a value of 0 from an object
function removeZeroes(vals) {
  const newVals = {};
  for (const [key, value] of Object.entries(vals)) {
    if (value !== 0) {
      newVals[key] = value;
    }
  }
  return newVals;
}

/**
 * A Duration object represents a period of time, like "2 months" or "1 day, 1 hour". Conceptually, it's just a map of units to their quantities, accompanied by some additional configuration and methods for creating, parsing, interrogating, transforming, and formatting them. They can be used on their own or in conjunction with other Luxon types; for example, you can use {@link DateTime#plus} to add a Duration object to a DateTime, producing another DateTime.
 *
 * Here is a brief overview of commonly used methods and getters in Duration:
 *
 * * **Creation** To create a Duration, use {@link Duration.fromMillis}, {@link Duration.fromObject}, or {@link Duration.fromISO}.
 * * **Unit values** See the {@link Duration#years}, {@link Duration#months}, {@link Duration#weeks}, {@link Duration#days}, {@link Duration#hours}, {@link Duration#minutes}, {@link Duration#seconds}, {@link Duration#milliseconds} accessors.
 * * **Configuration** See  {@link Duration#locale} and {@link Duration#numberingSystem} accessors.
 * * **Transformation** To create new Durations out of old ones use {@link Duration#plus}, {@link Duration#minus}, {@link Duration#normalize}, {@link Duration#set}, {@link Duration#reconfigure}, {@link Duration#shiftTo}, and {@link Duration#negate}.
 * * **Output** To convert the Duration into other representations, see {@link Duration#as}, {@link Duration#toISO}, {@link Duration#toFormat}, and {@link Duration#toJSON}
 *
 * There's are more methods documented below. In addition, for more information on subtler topics like internationalization and validity, see the external documentation.
 */
class Duration {
  /**
   * @private
   */
  constructor(config) {
    const accurate = config.conversionAccuracy === "longterm" || false;
    let matrix = accurate ? accurateMatrix : casualMatrix;

    if (config.matrix) {
      matrix = config.matrix;
    }

    /**
     * @access private
     */
    this.values = config.values;
    /**
     * @access private
     */
    this.loc = config.loc || Locale.create();
    /**
     * @access private
     */
    this.conversionAccuracy = accurate ? "longterm" : "casual";
    /**
     * @access private
     */
    this.invalid = config.invalid || null;
    /**
     * @access private
     */
    this.matrix = matrix;
    /**
     * @access private
     */
    this.isLuxonDuration = true;
  }

  /**
   * Create Duration from a number of milliseconds.
   * @param {number} count of milliseconds
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  static fromMillis(count, opts) {
    return Duration.fromObject({ milliseconds: count }, opts);
  }

  /**
   * Create a Duration from a JavaScript object with keys like 'years' and 'hours'.
   * If this object is empty then a zero milliseconds duration is returned.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.years
   * @param {number} obj.quarters
   * @param {number} obj.months
   * @param {number} obj.weeks
   * @param {number} obj.days
   * @param {number} obj.hours
   * @param {number} obj.minutes
   * @param {number} obj.seconds
   * @param {number} obj.milliseconds
   * @param {Object} [opts=[]] - options for creating this Duration
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the custom conversion system to use
   * @return {Duration}
   */
  static fromObject(obj, opts = {}) {
    if (obj == null || typeof obj !== "object") {
      throw new InvalidArgumentError(
        `Duration.fromObject: argument expected to be an object, got ${
          obj === null ? "null" : typeof obj
        }`
      );
    }

    return new Duration({
      values: normalizeObject(obj, Duration.normalizeUnit),
      loc: Locale.fromObject(opts),
      conversionAccuracy: opts.conversionAccuracy,
      matrix: opts.matrix,
    });
  }

  /**
   * Create a Duration from DurationLike.
   *
   * @param {Object | number | Duration} durationLike
   * One of:
   * - object with keys like 'years' and 'hours'.
   * - number representing milliseconds
   * - Duration instance
   * @return {Duration}
   */
  static fromDurationLike(durationLike) {
    if (isNumber(durationLike)) {
      return Duration.fromMillis(durationLike);
    } else if (Duration.isDuration(durationLike)) {
      return durationLike;
    } else if (typeof durationLike === "object") {
      return Duration.fromObject(durationLike);
    } else {
      throw new InvalidArgumentError(
        `Unknown duration argument ${durationLike} of type ${typeof durationLike}`
      );
    }
  }

  /**
   * Create a Duration from an ISO 8601 duration string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the preset conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromISO('P3Y6M1W4DT12H30M5S').toObject() //=> { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
   * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
   * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
   * @return {Duration}
   */
  static fromISO(text, opts) {
    const [parsed] = parseISODuration(text);
    if (parsed) {
      return Duration.fromObject(parsed, opts);
    } else {
      return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
  }

  /**
   * Create a Duration from an ISO 8601 time string.
   * @param {string} text - text to parse
   * @param {Object} opts - options for parsing
   * @param {string} [opts.locale='en-US'] - the locale to use
   * @param {string} opts.numberingSystem - the numbering system to use
   * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
   * @param {string} [opts.matrix=Object] - the conversion system to use
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   * @example Duration.fromISOTime('11:22:33.444').toObject() //=> { hours: 11, minutes: 22, seconds: 33, milliseconds: 444 }
   * @example Duration.fromISOTime('11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('T11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @example Duration.fromISOTime('T1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
   * @return {Duration}
   */
  static fromISOTime(text, opts) {
    const [parsed] = parseISOTimeOnly(text);
    if (parsed) {
      return Duration.fromObject(parsed, opts);
    } else {
      return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
  }

  /**
   * Create an invalid Duration.
   * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Duration}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
    }

    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

    if (Settings.throwOnInvalid) {
      throw new InvalidDurationError(invalid);
    } else {
      return new Duration({ invalid });
    }
  }

  /**
   * @private
   */
  static normalizeUnit(unit) {
    const normalized = {
      year: "years",
      years: "years",
      quarter: "quarters",
      quarters: "quarters",
      month: "months",
      months: "months",
      week: "weeks",
      weeks: "weeks",
      day: "days",
      days: "days",
      hour: "hours",
      hours: "hours",
      minute: "minutes",
      minutes: "minutes",
      second: "seconds",
      seconds: "seconds",
      millisecond: "milliseconds",
      milliseconds: "milliseconds",
    }[unit ? unit.toLowerCase() : unit];

    if (!normalized) throw new InvalidUnitError(unit);

    return normalized;
  }

  /**
   * Check if an object is a Duration. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDuration(o) {
    return (o && o.isLuxonDuration) || false;
  }

  /**
   * Get  the locale of a Duration, such 'en-GB'
   * @type {string}
   */
  get locale() {
    return this.isValid ? this.loc.locale : null;
  }

  /**
   * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
   *
   * @type {string}
   */
  get numberingSystem() {
    return this.isValid ? this.loc.numberingSystem : null;
  }

  /**
   * Returns a string representation of this Duration formatted according to the specified format string. You may use these tokens:
   * * `S` for milliseconds
   * * `s` for seconds
   * * `m` for minutes
   * * `h` for hours
   * * `d` for days
   * * `w` for weeks
   * * `M` for months
   * * `y` for years
   * Notes:
   * * Add padding by repeating the token, e.g. "yy" pads the years to two digits, "hhhh" pads the hours out to four digits
   * * Tokens can be escaped by wrapping with single quotes.
   * * The duration will be converted to the set of units in the format string using {@link Duration#shiftTo} and the Durations's conversion accuracy setting.
   * @param {string} fmt - the format string
   * @param {Object} opts - options
   * @param {boolean} [opts.floor=true] - floor numerical values
   * @param {'negative'|'all'|'negativeLargestOnly'} [opts.signMode=negative] - How to handle signs
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
   * @example Duration.fromObject({ days: 6, seconds: 2 }).toFormat("d s", { signMode: "all" }) //=> "+6 +2"
   * @example Duration.fromObject({ days: -6, seconds: -2 }).toFormat("d s", { signMode: "all" }) //=> "-6 -2"
   * @example Duration.fromObject({ days: -6, seconds: -2 }).toFormat("d s", { signMode: "negativeLargestOnly" }) //=> "-6 2"
   * @return {string}
   */
  toFormat(fmt, opts = {}) {
    // reverse-compat since 1.2; we always round down now, never up, and we do it by default
    const fmtOpts = {
      ...opts,
      floor: opts.round !== false && opts.floor !== false,
    };
    return this.isValid
      ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt)
      : INVALID$2;
  }

  /**
   * Returns a string representation of a Duration with all units included.
   * To modify its behavior, use `listStyle` and any Intl.NumberFormat option, though `unitDisplay` is especially relevant.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
   * @param {Object} opts - Formatting options. Accepts the same keys as the options parameter of the native `Intl.NumberFormat` constructor, as well as `listStyle`.
   * @param {string} [opts.listStyle='narrow'] - How to format the merged list. Corresponds to the `style` property of the options parameter of the native `Intl.ListFormat` constructor.
   * @param {boolean} [opts.showZeros=true] - Show all units previously used by the duration even if they are zero
   * @example
   * ```js
   * var dur = Duration.fromObject({ months: 1, weeks: 0, hours: 5, minutes: 6 })
   * dur.toHuman() //=> '1 month, 0 weeks, 5 hours, 6 minutes'
   * dur.toHuman({ listStyle: "long" }) //=> '1 month, 0 weeks, 5 hours, and 6 minutes'
   * dur.toHuman({ unitDisplay: "short" }) //=> '1 mth, 0 wks, 5 hr, 6 min'
   * dur.toHuman({ showZeros: false }) //=> '1 month, 5 hours, 6 minutes'
   * ```
   */
  toHuman(opts = {}) {
    if (!this.isValid) return INVALID$2;

    const showZeros = opts.showZeros !== false;

    const l = orderedUnits$1
      .map((unit) => {
        const val = this.values[unit];
        if (isUndefined(val) || (val === 0 && !showZeros)) {
          return null;
        }
        return this.loc
          .numberFormatter({ style: "unit", unitDisplay: "long", ...opts, unit: unit.slice(0, -1) })
          .format(val);
      })
      .filter((n) => n);

    return this.loc
      .listFormatter({ type: "conjunction", style: opts.listStyle || "narrow", ...opts })
      .format(l);
  }

  /**
   * Returns a JavaScript object with this Duration's values.
   * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
   * @return {Object}
   */
  toObject() {
    if (!this.isValid) return {};
    return { ...this.values };
  }

  /**
   * Returns an ISO 8601-compliant string representation of this Duration.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
   * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
   * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
   * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
   * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
   * @example Duration.fromObject({ milliseconds: 6 }).toISO() //=> 'PT0.006S'
   * @return {string}
   */
  toISO() {
    // we could use the formatter, but this is an easier way to get the minimum string
    if (!this.isValid) return null;

    let s = "P";
    if (this.years !== 0) s += this.years + "Y";
    if (this.months !== 0 || this.quarters !== 0) s += this.months + this.quarters * 3 + "M";
    if (this.weeks !== 0) s += this.weeks + "W";
    if (this.days !== 0) s += this.days + "D";
    if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0)
      s += "T";
    if (this.hours !== 0) s += this.hours + "H";
    if (this.minutes !== 0) s += this.minutes + "M";
    if (this.seconds !== 0 || this.milliseconds !== 0)
      // this will handle "floating point madness" by removing extra decimal places
      // https://stackoverflow.com/questions/588004/is-floating-point-math-broken
      s += roundTo(this.seconds + this.milliseconds / 1000, 3) + "S";
    if (s === "P") s += "T0S";
    return s;
  }

  /**
   * Returns an ISO 8601-compliant string representation of this Duration, formatted as a time of day.
   * Note that this will return null if the duration is invalid, negative, or equal to or greater than 24 hours.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @example Duration.fromObject({ hours: 11 }).toISOTime() //=> '11:00:00.000'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressMilliseconds: true }) //=> '11:00:00'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressSeconds: true }) //=> '11:00'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ includePrefix: true }) //=> 'T11:00:00.000'
   * @example Duration.fromObject({ hours: 11 }).toISOTime({ format: 'basic' }) //=> '110000.000'
   * @return {string}
   */
  toISOTime(opts = {}) {
    if (!this.isValid) return null;

    const millis = this.toMillis();
    if (millis < 0 || millis >= 86400000) return null;

    opts = {
      suppressMilliseconds: false,
      suppressSeconds: false,
      includePrefix: false,
      format: "extended",
      ...opts,
      includeOffset: false,
    };

    const dateTime = DateTime.fromMillis(millis, { zone: "UTC" });
    return dateTime.toISOTime(opts);
  }

  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
   * @return {string}
   */
  toJSON() {
    return this.toISO();
  }

  /**
   * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
   * @return {string}
   */
  toString() {
    return this.toISO();
  }

  /**
   * Returns a string representation of this Duration appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `Duration { values: ${JSON.stringify(this.values)} }`;
    } else {
      return `Duration { Invalid, reason: ${this.invalidReason} }`;
    }
  }

  /**
   * Returns an milliseconds value of this Duration.
   * @return {number}
   */
  toMillis() {
    if (!this.isValid) return NaN;

    return durationToMillis(this.matrix, this.values);
  }

  /**
   * Returns an milliseconds value of this Duration. Alias of {@link toMillis}
   * @return {number}
   */
  valueOf() {
    return this.toMillis();
  }

  /**
   * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  plus(duration) {
    if (!this.isValid) return this;

    const dur = Duration.fromDurationLike(duration),
      result = {};

    for (const k of orderedUnits$1) {
      if (hasOwnProperty(dur.values, k) || hasOwnProperty(this.values, k)) {
        result[k] = dur.get(k) + this.get(k);
      }
    }

    return clone$1(this, { values: result }, true);
  }

  /**
   * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @return {Duration}
   */
  minus(duration) {
    if (!this.isValid) return this;

    const dur = Duration.fromDurationLike(duration);
    return this.plus(dur.negate());
  }

  /**
   * Scale this Duration by the specified amount. Return a newly-constructed Duration.
   * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
   * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hours" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
   * @return {Duration}
   */
  mapUnits(fn) {
    if (!this.isValid) return this;
    const result = {};
    for (const k of Object.keys(this.values)) {
      result[k] = asNumber(fn(this.values[k], k));
    }
    return clone$1(this, { values: result }, true);
  }

  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example Duration.fromObject({years: 2, days: 3}).get('years') //=> 2
   * @example Duration.fromObject({years: 2, days: 3}).get('months') //=> 0
   * @example Duration.fromObject({years: 2, days: 3}).get('days') //=> 3
   * @return {number}
   */
  get(unit) {
    return this[Duration.normalizeUnit(unit)];
  }

  /**
   * "Set" the values of specified units. Return a newly-constructed Duration.
   * @param {Object} values - a mapping of units to numbers
   * @example dur.set({ years: 2017 })
   * @example dur.set({ hours: 8, minutes: 30 })
   * @return {Duration}
   */
  set(values) {
    if (!this.isValid) return this;

    const mixed = { ...this.values, ...normalizeObject(values, Duration.normalizeUnit) };
    return clone$1(this, { values: mixed });
  }

  /**
   * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
   * @example dur.reconfigure({ locale: 'en-GB' })
   * @return {Duration}
   */
  reconfigure({ locale, numberingSystem, conversionAccuracy, matrix } = {}) {
    const loc = this.loc.clone({ locale, numberingSystem });
    const opts = { loc, matrix, conversionAccuracy };
    return clone$1(this, opts);
  }

  /**
   * Return the length of the duration in the specified unit.
   * @param {string} unit - a unit such as 'minutes' or 'days'
   * @example Duration.fromObject({years: 1}).as('days') //=> 365
   * @example Duration.fromObject({years: 1}).as('months') //=> 12
   * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
   * @return {number}
   */
  as(unit) {
    return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
  }

  /**
   * Reduce this Duration to its canonical representation in its current units.
   * Assuming the overall value of the Duration is positive, this means:
   * - excessive values for lower-order units are converted to higher-order units (if possible, see first and second example)
   * - negative lower-order units are converted to higher order units (there must be such a higher order unit, otherwise
   *   the overall value would be negative, see third example)
   * - fractional values for higher-order units are converted to lower-order units (if possible, see fourth example)
   *
   * If the overall value is negative, the result of this method is equivalent to `this.negate().normalize().negate()`.
   * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
   * @example Duration.fromObject({ days: 5000 }).normalize().toObject() //=> { days: 5000 }
   * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
   * @example Duration.fromObject({ years: 2.5, days: 0, hours: 0 }).normalize().toObject() //=> { years: 2, days: 182, hours: 12 }
   * @return {Duration}
   */
  normalize() {
    if (!this.isValid) return this;
    const vals = this.toObject();
    normalizeValues(this.matrix, vals);
    return clone$1(this, { values: vals }, true);
  }

  /**
   * Rescale units to its largest representation
   * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
   * @return {Duration}
   */
  rescale() {
    if (!this.isValid) return this;
    const vals = removeZeroes(this.normalize().shiftToAll().toObject());
    return clone$1(this, { values: vals }, true);
  }

  /**
   * Convert this Duration into its representation in a different set of units.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
   * @return {Duration}
   */
  shiftTo(...units) {
    if (!this.isValid) return this;

    if (units.length === 0) {
      return this;
    }

    units = units.map((u) => Duration.normalizeUnit(u));

    const built = {},
      accumulated = {},
      vals = this.toObject();
    let lastUnit;

    for (const k of orderedUnits$1) {
      if (units.indexOf(k) >= 0) {
        lastUnit = k;

        let own = 0;

        // anything we haven't boiled down yet should get boiled to this unit
        for (const ak in accumulated) {
          own += this.matrix[ak][k] * accumulated[ak];
          accumulated[ak] = 0;
        }

        // plus anything that's already in this unit
        if (isNumber(vals[k])) {
          own += vals[k];
        }

        // only keep the integer part for now in the hopes of putting any decimal part
        // into a smaller unit later
        const i = Math.trunc(own);
        built[k] = i;
        accumulated[k] = (own * 1000 - i * 1000) / 1000;

        // otherwise, keep it in the wings to boil it later
      } else if (isNumber(vals[k])) {
        accumulated[k] = vals[k];
      }
    }

    // anything leftover becomes the decimal for the last unit
    // lastUnit must be defined since units is not empty
    for (const key in accumulated) {
      if (accumulated[key] !== 0) {
        built[lastUnit] +=
          key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
      }
    }

    normalizeValues(this.matrix, built);
    return clone$1(this, { values: built }, true);
  }

  /**
   * Shift this Duration to all available units.
   * Same as shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")
   * @return {Duration}
   */
  shiftToAll() {
    if (!this.isValid) return this;
    return this.shiftTo(
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds"
    );
  }

  /**
   * Return the negative of this Duration.
   * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
   * @return {Duration}
   */
  negate() {
    if (!this.isValid) return this;
    const negated = {};
    for (const k of Object.keys(this.values)) {
      negated[k] = this.values[k] === 0 ? 0 : -this.values[k];
    }
    return clone$1(this, { values: negated }, true);
  }

  /**
   * Removes all units with values equal to 0 from this Duration.
   * @example Duration.fromObject({ years: 2, days: 0, hours: 0, minutes: 0 }).removeZeros().toObject() //=> { years: 2 }
   * @return {Duration}
   */
  removeZeros() {
    if (!this.isValid) return this;
    const vals = removeZeroes(this.values);
    return clone$1(this, { values: vals }, true);
  }

  /**
   * Get the years.
   * @type {number}
   */
  get years() {
    return this.isValid ? this.values.years || 0 : NaN;
  }

  /**
   * Get the quarters.
   * @type {number}
   */
  get quarters() {
    return this.isValid ? this.values.quarters || 0 : NaN;
  }

  /**
   * Get the months.
   * @type {number}
   */
  get months() {
    return this.isValid ? this.values.months || 0 : NaN;
  }

  /**
   * Get the weeks
   * @type {number}
   */
  get weeks() {
    return this.isValid ? this.values.weeks || 0 : NaN;
  }

  /**
   * Get the days.
   * @type {number}
   */
  get days() {
    return this.isValid ? this.values.days || 0 : NaN;
  }

  /**
   * Get the hours.
   * @type {number}
   */
  get hours() {
    return this.isValid ? this.values.hours || 0 : NaN;
  }

  /**
   * Get the minutes.
   * @type {number}
   */
  get minutes() {
    return this.isValid ? this.values.minutes || 0 : NaN;
  }

  /**
   * Get the seconds.
   * @return {number}
   */
  get seconds() {
    return this.isValid ? this.values.seconds || 0 : NaN;
  }

  /**
   * Get the milliseconds.
   * @return {number}
   */
  get milliseconds() {
    return this.isValid ? this.values.milliseconds || 0 : NaN;
  }

  /**
   * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
   * on invalid DateTimes or Intervals.
   * @return {boolean}
   */
  get isValid() {
    return this.invalid === null;
  }

  /**
   * Returns an error code if this Duration became invalid, or null if the Duration is valid
   * @return {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }

  /**
   * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }

  /**
   * Equality check
   * Two Durations are equal iff they have the same units and the same values for each unit.
   * @param {Duration} other
   * @return {boolean}
   */
  equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }

    if (!this.loc.equals(other.loc)) {
      return false;
    }

    function eq(v1, v2) {
      // Consider 0 and undefined as equal
      if (v1 === undefined || v1 === 0) return v2 === undefined || v2 === 0;
      return v1 === v2;
    }

    for (const u of orderedUnits$1) {
      if (!eq(this.values[u], other.values[u])) {
        return false;
      }
    }
    return true;
  }
}

const INVALID$1 = "Invalid Interval";

// checks if the start is equal to or before the end
function validateStartEnd(start, end) {
  if (!start || !start.isValid) {
    return Interval.invalid("missing or invalid start");
  } else if (!end || !end.isValid) {
    return Interval.invalid("missing or invalid end");
  } else if (end < start) {
    return Interval.invalid(
      "end before start",
      `The end of an interval must be after its start, but you had start=${start.toISO()} and end=${end.toISO()}`
    );
  } else {
    return null;
  }
}

/**
 * An Interval object represents a half-open interval of time, where each endpoint is a {@link DateTime}. Conceptually, it's a container for those two endpoints, accompanied by methods for creating, parsing, interrogating, comparing, transforming, and formatting them.
 *
 * Here is a brief overview of the most commonly used methods and getters in Interval:
 *
 * * **Creation** To create an Interval, use {@link Interval.fromDateTimes}, {@link Interval.after}, {@link Interval.before}, or {@link Interval.fromISO}.
 * * **Accessors** Use {@link Interval#start} and {@link Interval#end} to get the start and end.
 * * **Interrogation** To analyze the Interval, use {@link Interval#count}, {@link Interval#length}, {@link Interval#hasSame}, {@link Interval#contains}, {@link Interval#isAfter}, or {@link Interval#isBefore}.
 * * **Transformation** To create other Intervals out of this one, use {@link Interval#set}, {@link Interval#splitAt}, {@link Interval#splitBy}, {@link Interval#divideEqually}, {@link Interval.merge}, {@link Interval.xor}, {@link Interval#union}, {@link Interval#intersection}, or {@link Interval#difference}.
 * * **Comparison** To compare this Interval to another one, use {@link Interval#equals}, {@link Interval#overlaps}, {@link Interval#abutsStart}, {@link Interval#abutsEnd}, {@link Interval#engulfs}
 * * **Output** To convert the Interval into other representations, see {@link Interval#toString}, {@link Interval#toLocaleString}, {@link Interval#toISO}, {@link Interval#toISODate}, {@link Interval#toISOTime}, {@link Interval#toFormat}, and {@link Interval#toDuration}.
 */
class Interval {
  /**
   * @private
   */
  constructor(config) {
    /**
     * @access private
     */
    this.s = config.start;
    /**
     * @access private
     */
    this.e = config.end;
    /**
     * @access private
     */
    this.invalid = config.invalid || null;
    /**
     * @access private
     */
    this.isLuxonInterval = true;
  }

  /**
   * Create an invalid Interval.
   * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {Interval}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
    }

    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

    if (Settings.throwOnInvalid) {
      throw new InvalidIntervalError(invalid);
    } else {
      return new Interval({ invalid });
    }
  }

  /**
   * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
   * @param {DateTime|Date|Object} start
   * @param {DateTime|Date|Object} end
   * @return {Interval}
   */
  static fromDateTimes(start, end) {
    const builtStart = friendlyDateTime(start),
      builtEnd = friendlyDateTime(end);

    const validateError = validateStartEnd(builtStart, builtEnd);

    if (validateError == null) {
      return new Interval({
        start: builtStart,
        end: builtEnd,
      });
    } else {
      return validateError;
    }
  }

  /**
   * Create an Interval from a start DateTime and a Duration to extend to.
   * @param {DateTime|Date|Object} start
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static after(start, duration) {
    const dur = Duration.fromDurationLike(duration),
      dt = friendlyDateTime(start);
    return Interval.fromDateTimes(dt, dt.plus(dur));
  }

  /**
   * Create an Interval from an end DateTime and a Duration to extend backwards to.
   * @param {DateTime|Date|Object} end
   * @param {Duration|Object|number} duration - the length of the Interval.
   * @return {Interval}
   */
  static before(end, duration) {
    const dur = Duration.fromDurationLike(duration),
      dt = friendlyDateTime(end);
    return Interval.fromDateTimes(dt.minus(dur), dt);
  }

  /**
   * Create an Interval from an ISO 8601 string.
   * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
   * @param {string} text - the ISO string to parse
   * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {Interval}
   */
  static fromISO(text, opts) {
    const [s, e] = (text || "").split("/", 2);
    if (s && e) {
      let start, startIsValid;
      try {
        start = DateTime.fromISO(s, opts);
        startIsValid = start.isValid;
      } catch (e) {
        startIsValid = false;
      }

      let end, endIsValid;
      try {
        end = DateTime.fromISO(e, opts);
        endIsValid = end.isValid;
      } catch (e) {
        endIsValid = false;
      }

      if (startIsValid && endIsValid) {
        return Interval.fromDateTimes(start, end);
      }

      if (startIsValid) {
        const dur = Duration.fromISO(e, opts);
        if (dur.isValid) {
          return Interval.after(start, dur);
        }
      } else if (endIsValid) {
        const dur = Duration.fromISO(s, opts);
        if (dur.isValid) {
          return Interval.before(end, dur);
        }
      }
    }
    return Interval.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
  }

  /**
   * Check if an object is an Interval. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isInterval(o) {
    return (o && o.isLuxonInterval) || false;
  }

  /**
   * Returns the start of the Interval
   * @type {DateTime}
   */
  get start() {
    return this.isValid ? this.s : null;
  }

  /**
   * Returns the end of the Interval. This is the first instant which is not part of the interval
   * (Interval is half-open).
   * @type {DateTime}
   */
  get end() {
    return this.isValid ? this.e : null;
  }

  /**
   * Returns the last DateTime included in the interval (since end is not part of the interval)
   * @type {DateTime}
   */
  get lastDateTime() {
    return this.isValid ? (this.e ? this.e.minus(1) : null) : null;
  }

  /**
   * Returns whether this Interval's end is at least its start, meaning that the Interval isn't 'backwards'.
   * @type {boolean}
   */
  get isValid() {
    return this.invalidReason === null;
  }

  /**
   * Returns an error code if this Interval is invalid, or null if the Interval is valid
   * @type {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }

  /**
   * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }

  /**
   * Returns the length of the Interval in the specified unit.
   * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
   * @return {number}
   */
  length(unit = "milliseconds") {
    return this.isValid ? this.toDuration(...[unit]).get(unit) : NaN;
  }

  /**
   * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
   * Unlike {@link Interval#length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
   * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
   * @param {string} [unit='milliseconds'] - the unit of time to count.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; this operation will always use the locale of the start DateTime
   * @return {number}
   */
  count(unit = "milliseconds", opts) {
    if (!this.isValid) return NaN;
    const start = this.start.startOf(unit, opts);
    let end;
    if (opts?.useLocaleWeeks) {
      end = this.end.reconfigure({ locale: start.locale });
    } else {
      end = this.end;
    }
    end = end.startOf(unit, opts);
    return Math.floor(end.diff(start, unit).get(unit)) + (end.valueOf() !== this.end.valueOf());
  }

  /**
   * Returns whether this Interval's start and end are both in the same unit of time
   * @param {string} unit - the unit of time to check sameness on
   * @return {boolean}
   */
  hasSame(unit) {
    return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
  }

  /**
   * Return whether this Interval has the same start and end DateTimes.
   * @return {boolean}
   */
  isEmpty() {
    return this.s.valueOf() === this.e.valueOf();
  }

  /**
   * Return whether this Interval's start is after the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isAfter(dateTime) {
    if (!this.isValid) return false;
    return this.s > dateTime;
  }

  /**
   * Return whether this Interval's end is before the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  isBefore(dateTime) {
    if (!this.isValid) return false;
    return this.e <= dateTime;
  }

  /**
   * Return whether this Interval contains the specified DateTime.
   * @param {DateTime} dateTime
   * @return {boolean}
   */
  contains(dateTime) {
    if (!this.isValid) return false;
    return this.s <= dateTime && this.e > dateTime;
  }

  /**
   * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
   * @param {Object} values - the values to set
   * @param {DateTime} values.start - the starting DateTime
   * @param {DateTime} values.end - the ending DateTime
   * @return {Interval}
   */
  set({ start, end } = {}) {
    if (!this.isValid) return this;
    return Interval.fromDateTimes(start || this.s, end || this.e);
  }

  /**
   * Split this Interval at each of the specified DateTimes
   * @param {...DateTime} dateTimes - the unit of time to count.
   * @return {Array}
   */
  splitAt(...dateTimes) {
    if (!this.isValid) return [];
    const sorted = dateTimes
        .map(friendlyDateTime)
        .filter((d) => this.contains(d))
        .sort((a, b) => a.toMillis() - b.toMillis()),
      results = [];
    let { s } = this,
      i = 0;

    while (s < this.e) {
      const added = sorted[i] || this.e,
        next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s, next));
      s = next;
      i += 1;
    }

    return results;
  }

  /**
   * Split this Interval into smaller Intervals, each of the specified length.
   * Left over time is grouped into a smaller interval
   * @param {Duration|Object|number} duration - The length of each resulting interval.
   * @return {Array}
   */
  splitBy(duration) {
    const dur = Duration.fromDurationLike(duration);

    if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
      return [];
    }

    let { s } = this,
      idx = 1,
      next;

    const results = [];
    while (s < this.e) {
      const added = this.start.plus(dur.mapUnits((x) => x * idx));
      next = +added > +this.e ? this.e : added;
      results.push(Interval.fromDateTimes(s, next));
      s = next;
      idx += 1;
    }

    return results;
  }

  /**
   * Split this Interval into the specified number of smaller intervals.
   * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
   * @return {Array}
   */
  divideEqually(numberOfParts) {
    if (!this.isValid) return [];
    return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
  }

  /**
   * Return whether this Interval overlaps with the specified Interval
   * @param {Interval} other
   * @return {boolean}
   */
  overlaps(other) {
    return this.e > other.s && this.s < other.e;
  }

  /**
   * Return whether this Interval's end is adjacent to the specified Interval's start.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsStart(other) {
    if (!this.isValid) return false;
    return +this.e === +other.s;
  }

  /**
   * Return whether this Interval's start is adjacent to the specified Interval's end.
   * @param {Interval} other
   * @return {boolean}
   */
  abutsEnd(other) {
    if (!this.isValid) return false;
    return +other.e === +this.s;
  }

  /**
   * Returns true if this Interval fully contains the specified Interval, specifically if the intersect (of this Interval and the other Interval) is equal to the other Interval; false otherwise.
   * @param {Interval} other
   * @return {boolean}
   */
  engulfs(other) {
    if (!this.isValid) return false;
    return this.s <= other.s && this.e >= other.e;
  }

  /**
   * Return whether this Interval has the same start and end as the specified Interval.
   * @param {Interval} other
   * @return {boolean}
   */
  equals(other) {
    if (!this.isValid || !other.isValid) {
      return false;
    }

    return this.s.equals(other.s) && this.e.equals(other.e);
  }

  /**
   * Return an Interval representing the intersection of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
   * Returns null if the intersection is empty, meaning, the intervals don't intersect.
   * @param {Interval} other
   * @return {Interval}
   */
  intersection(other) {
    if (!this.isValid) return this;
    const s = this.s > other.s ? this.s : other.s,
      e = this.e < other.e ? this.e : other.e;

    if (s >= e) {
      return null;
    } else {
      return Interval.fromDateTimes(s, e);
    }
  }

  /**
   * Return an Interval representing the union of this Interval and the specified Interval.
   * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
   * @param {Interval} other
   * @return {Interval}
   */
  union(other) {
    if (!this.isValid) return this;
    const s = this.s < other.s ? this.s : other.s,
      e = this.e > other.e ? this.e : other.e;
    return Interval.fromDateTimes(s, e);
  }

  /**
   * Merge an array of Intervals into an equivalent minimal set of Intervals.
   * Combines overlapping and adjacent Intervals.
   * The resulting array will contain the Intervals in ascending order, that is, starting with the earliest Interval
   * and ending with the latest.
   *
   * @param {Array} intervals
   * @return {Array}
   */
  static merge(intervals) {
    const [found, final] = intervals
      .sort((a, b) => a.s - b.s)
      .reduce(
        ([sofar, current], item) => {
          if (!current) {
            return [sofar, item];
          } else if (current.overlaps(item) || current.abutsStart(item)) {
            return [sofar, current.union(item)];
          } else {
            return [sofar.concat([current]), item];
          }
        },
        [[], null]
      );
    if (final) {
      found.push(final);
    }
    return found;
  }

  /**
   * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
   * @param {Array} intervals
   * @return {Array}
   */
  static xor(intervals) {
    let start = null,
      currentCount = 0;
    const results = [],
      ends = intervals.map((i) => [
        { time: i.s, type: "s" },
        { time: i.e, type: "e" },
      ]),
      flattened = Array.prototype.concat(...ends),
      arr = flattened.sort((a, b) => a.time - b.time);

    for (const i of arr) {
      currentCount += i.type === "s" ? 1 : -1;

      if (currentCount === 1) {
        start = i.time;
      } else {
        if (start && +start !== +i.time) {
          results.push(Interval.fromDateTimes(start, i.time));
        }

        start = null;
      }
    }

    return Interval.merge(results);
  }

  /**
   * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
   * @param {...Interval} intervals
   * @return {Array}
   */
  difference(...intervals) {
    return Interval.xor([this].concat(intervals))
      .map((i) => this.intersection(i))
      .filter((i) => i && !i.isEmpty());
  }

  /**
   * Returns a string representation of this Interval appropriate for debugging.
   * @return {string}
   */
  toString() {
    if (!this.isValid) return INVALID$1;
    return `[${this.s.toISO()} – ${this.e.toISO()})`;
  }

  /**
   * Returns a string representation of this Interval appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`;
    } else {
      return `Interval { Invalid, reason: ${this.invalidReason} }`;
    }
  }

  /**
   * Returns a localized string representing this Interval. Accepts the same options as the
   * Intl.DateTimeFormat constructor and any presets defined by Luxon, such as
   * {@link DateTime.DATE_FULL} or {@link DateTime.TIME_SIMPLE}. The exact behavior of this method
   * is browser-specific, but in general it will return an appropriate representation of the
   * Interval in the assigned locale. Defaults to the system's locale if no locale has been
   * specified.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {Object} [formatOpts=DateTime.DATE_SHORT] - Either a DateTime preset or
   * Intl.DateTimeFormat constructor options.
   * @param {Object} opts - Options to override the configuration of the start DateTime.
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(); //=> 11/7/2022 – 11/8/2022
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL); //=> November 7 – 8, 2022
   * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL, { locale: 'fr-FR' }); //=> 7–8 novembre 2022
   * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString(DateTime.TIME_SIMPLE); //=> 6:00 – 8:00 PM
   * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> Mon, Nov 07, 6:00 – 8:00 p
   * @return {string}
   */
  toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
    return this.isValid
      ? Formatter.create(this.s.loc.clone(opts), formatOpts).formatInterval(this)
      : INVALID$1;
  }

  /**
   * Returns an ISO 8601-compliant string representation of this Interval.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISO(opts) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
  }

  /**
   * Returns an ISO 8601-compliant string representation of date of this Interval.
   * The time components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @return {string}
   */
  toISODate() {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISODate()}/${this.e.toISODate()}`;
  }

  /**
   * Returns an ISO 8601-compliant string representation of time of this Interval.
   * The date components are ignored.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
   * @param {Object} opts - The same options as {@link DateTime#toISO}
   * @return {string}
   */
  toISOTime(opts) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
  }

  /**
   * Returns a string representation of this Interval formatted according to the specified format
   * string. **You may not want this.** See {@link Interval#toLocaleString} for a more flexible
   * formatting tool.
   * @param {string} dateFormat - The format string. This string formats the start and end time.
   * See {@link DateTime#toFormat} for details.
   * @param {Object} opts - Options.
   * @param {string} [opts.separator =  ' – '] - A separator to place between the start and end
   * representations.
   * @return {string}
   */
  toFormat(dateFormat, { separator = " – " } = {}) {
    if (!this.isValid) return INVALID$1;
    return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
  }

  /**
   * Return a Duration representing the time spanned by this interval.
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
   * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
   * @return {Duration}
   */
  toDuration(unit, opts) {
    if (!this.isValid) {
      return Duration.invalid(this.invalidReason);
    }
    return this.e.diff(this.s, unit, opts);
  }

  /**
   * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
   * @param {function} mapFn
   * @return {Interval}
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
   * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
   */
  mapEndpoints(mapFn) {
    return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
  }
}

/**
 * The Info class contains static methods for retrieving general time and date related data. For example, it has methods for finding out if a time zone has a DST, for listing the months in any supported locale, and for discovering which of Luxon features are available in the current environment.
 */
class Info {
  /**
   * Return whether the specified zone contains a DST.
   * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
   * @return {boolean}
   */
  static hasDST(zone = Settings.defaultZone) {
    const proto = DateTime.now().setZone(zone).set({ month: 12 });

    return !zone.isUniversal && proto.offset !== proto.set({ month: 6 }).offset;
  }

  /**
   * Return whether the specified zone is a valid IANA specifier.
   * @param {string} zone - Zone to check
   * @return {boolean}
   */
  static isValidIANAZone(zone) {
    return IANAZone.isValidZone(zone);
  }

  /**
   * Converts the input into a {@link Zone} instance.
   *
   * * If `input` is already a Zone instance, it is returned unchanged.
   * * If `input` is a string containing a valid time zone name, a Zone instance
   *   with that name is returned.
   * * If `input` is a string that doesn't refer to a known time zone, a Zone
   *   instance with {@link Zone#isValid} == false is returned.
   * * If `input is a number, a Zone instance with the specified fixed offset
   *   in minutes is returned.
   * * If `input` is `null` or `undefined`, the default zone is returned.
   * @param {string|Zone|number} [input] - the value to be converted
   * @return {Zone}
   */
  static normalizeZone(input) {
    return normalizeZone(input, Settings.defaultZone);
  }

  /**
   * Get the weekday on which the week starts according to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number} the start of the week, 1 for Monday through 7 for Sunday
   */
  static getStartOfWeek({ locale = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale)).getStartOfWeek();
  }

  /**
   * Get the minimum number of days necessary in a week before it is considered part of the next year according
   * to the given locale.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number}
   */
  static getMinimumDaysInFirstWeek({ locale = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale)).getMinDaysInFirstWeek();
  }

  /**
   * Get the weekdays, which are considered the weekend according to the given locale
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
   */
  static getWeekendWeekdays({ locale = null, locObj = null } = {}) {
    // copy the array, because we cache it internally
    return (locObj || Locale.create(locale)).getWeekendDays().slice();
  }

  /**
   * Return an array of standalone month names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @example Info.months()[0] //=> 'January'
   * @example Info.months('short')[0] //=> 'Jan'
   * @example Info.months('numeric')[0] //=> '1'
   * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
   * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
   * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
   * @return {Array}
   */
  static months(
    length = "long",
    { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}
  ) {
    return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length);
  }

  /**
   * Return an array of format month names.
   * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
   * changes the string.
   * See {@link Info#months}
   * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @param {string} [opts.outputCalendar='gregory'] - the calendar
   * @return {Array}
   */
  static monthsFormat(
    length = "long",
    { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}
  ) {
    return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length, true);
  }

  /**
   * Return an array of standalone week names.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param {string} [length='long'] - the length of the weekday representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @example Info.weekdays()[0] //=> 'Monday'
   * @example Info.weekdays('short')[0] //=> 'Mon'
   * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
   * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
   * @return {Array}
   */
  static weekdays(length = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
    return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length);
  }

  /**
   * Return an array of format week names.
   * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
   * changes the string.
   * See {@link Info#weekdays}
   * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale=null] - the locale code
   * @param {string} [opts.numberingSystem=null] - the numbering system
   * @param {string} [opts.locObj=null] - an existing locale object to use
   * @return {Array}
   */
  static weekdaysFormat(
    length = "long",
    { locale = null, numberingSystem = null, locObj = null } = {}
  ) {
    return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length, true);
  }

  /**
   * Return an array of meridiems.
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.meridiems() //=> [ 'AM', 'PM' ]
   * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
   * @return {Array}
   */
  static meridiems({ locale = null } = {}) {
    return Locale.create(locale).meridiems();
  }

  /**
   * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
   * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
   * @param {Object} opts - options
   * @param {string} [opts.locale] - the locale code
   * @example Info.eras() //=> [ 'BC', 'AD' ]
   * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
   * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
   * @return {Array}
   */
  static eras(length = "short", { locale = null } = {}) {
    return Locale.create(locale, null, "gregory").eras(length);
  }

  /**
   * Return the set of available features in this environment.
   * Some features of Luxon are not available in all environments. For example, on older browsers, relative time formatting support is not available. Use this function to figure out if that's the case.
   * Keys:
   * * `relative`: whether this environment supports relative time formatting
   * * `localeWeek`: whether this environment supports different weekdays for the start of the week based on the locale
   * @example Info.features() //=> { relative: false, localeWeek: true }
   * @return {Object}
   */
  static features() {
    return { relative: hasRelative(), localeWeek: hasLocaleWeekInfo() };
  }
}

function dayDiff(earlier, later) {
  const utcDayStart = (dt) => dt.toUTC(0, { keepLocalTime: true }).startOf("day").valueOf(),
    ms = utcDayStart(later) - utcDayStart(earlier);
  return Math.floor(Duration.fromMillis(ms).as("days"));
}

function highOrderDiffs(cursor, later, units) {
  const differs = [
    ["years", (a, b) => b.year - a.year],
    ["quarters", (a, b) => b.quarter - a.quarter + (b.year - a.year) * 4],
    ["months", (a, b) => b.month - a.month + (b.year - a.year) * 12],
    [
      "weeks",
      (a, b) => {
        const days = dayDiff(a, b);
        return (days - (days % 7)) / 7;
      },
    ],
    ["days", dayDiff],
  ];

  const results = {};
  const earlier = cursor;
  let lowestOrder, highWater;

  /* This loop tries to diff using larger units first.
     If we overshoot, we backtrack and try the next smaller unit.
     "cursor" starts out at the earlier timestamp and moves closer and closer to "later"
     as we use smaller and smaller units.
     highWater keeps track of where we would be if we added one more of the smallest unit,
     this is used later to potentially convert any difference smaller than the smallest higher order unit
     into a fraction of that smallest higher order unit
  */
  for (const [unit, differ] of differs) {
    if (units.indexOf(unit) >= 0) {
      lowestOrder = unit;

      results[unit] = differ(cursor, later);
      highWater = earlier.plus(results);

      if (highWater > later) {
        // we overshot the end point, backtrack cursor by 1
        results[unit]--;
        cursor = earlier.plus(results);

        // if we are still overshooting now, we need to backtrack again
        // this happens in certain situations when diffing times in different zones,
        // because this calculation ignores time zones
        if (cursor > later) {
          // keep the "overshot by 1" around as highWater
          highWater = cursor;
          // backtrack cursor by 1
          results[unit]--;
          cursor = earlier.plus(results);
        }
      } else {
        cursor = highWater;
      }
    }
  }

  return [cursor, results, highWater, lowestOrder];
}

function diff (earlier, later, units, opts) {
  let [cursor, results, highWater, lowestOrder] = highOrderDiffs(earlier, later, units);

  const remainingMillis = later - cursor;

  const lowerOrderUnits = units.filter(
    (u) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(u) >= 0
  );

  if (lowerOrderUnits.length === 0) {
    if (highWater < later) {
      highWater = cursor.plus({ [lowestOrder]: 1 });
    }

    if (highWater !== cursor) {
      results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
    }
  }

  const duration = Duration.fromObject(results, opts);

  if (lowerOrderUnits.length > 0) {
    return Duration.fromMillis(remainingMillis, opts)
      .shiftTo(...lowerOrderUnits)
      .plus(duration);
  } else {
    return duration;
  }
}

const MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";

function intUnit(regex, post = (i) => i) {
  return { regex, deser: ([s]) => post(parseDigits(s)) };
}

const NBSP = String.fromCharCode(160);
const spaceOrNBSP = `[ ${NBSP}]`;
const spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");

function fixListRegex(s) {
  // make dots optional and also make them literal
  // make space and non breakable space characters interchangeable
  return s.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
}

function stripInsensitivities(s) {
  return s
    .replace(/\./g, "") // ignore dots that were made optional
    .replace(spaceOrNBSPRegExp, " ") // interchange space and nbsp
    .toLowerCase();
}

function oneOf(strings, startIndex) {
  if (strings === null) {
    return null;
  } else {
    return {
      regex: RegExp(strings.map(fixListRegex).join("|")),
      deser: ([s]) =>
        strings.findIndex((i) => stripInsensitivities(s) === stripInsensitivities(i)) + startIndex,
    };
  }
}

function offset(regex, groups) {
  return { regex, deser: ([, h, m]) => signedOffset(h, m), groups };
}

function simple(regex) {
  return { regex, deser: ([s]) => s };
}

function escapeToken(value) {
  return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}

/**
 * @param token
 * @param {Locale} loc
 */
function unitForToken(token, loc) {
  const one = digitRegex(loc),
    two = digitRegex(loc, "{2}"),
    three = digitRegex(loc, "{3}"),
    four = digitRegex(loc, "{4}"),
    six = digitRegex(loc, "{6}"),
    oneOrTwo = digitRegex(loc, "{1,2}"),
    oneToThree = digitRegex(loc, "{1,3}"),
    oneToSix = digitRegex(loc, "{1,6}"),
    oneToNine = digitRegex(loc, "{1,9}"),
    twoToFour = digitRegex(loc, "{2,4}"),
    fourToSix = digitRegex(loc, "{4,6}"),
    literal = (t) => ({ regex: RegExp(escapeToken(t.val)), deser: ([s]) => s, literal: true }),
    unitate = (t) => {
      if (token.literal) {
        return literal(t);
      }
      switch (t.val) {
        // era
        case "G":
          return oneOf(loc.eras("short"), 0);
        case "GG":
          return oneOf(loc.eras("long"), 0);
        // years
        case "y":
          return intUnit(oneToSix);
        case "yy":
          return intUnit(twoToFour, untruncateYear);
        case "yyyy":
          return intUnit(four);
        case "yyyyy":
          return intUnit(fourToSix);
        case "yyyyyy":
          return intUnit(six);
        // months
        case "M":
          return intUnit(oneOrTwo);
        case "MM":
          return intUnit(two);
        case "MMM":
          return oneOf(loc.months("short", true), 1);
        case "MMMM":
          return oneOf(loc.months("long", true), 1);
        case "L":
          return intUnit(oneOrTwo);
        case "LL":
          return intUnit(two);
        case "LLL":
          return oneOf(loc.months("short", false), 1);
        case "LLLL":
          return oneOf(loc.months("long", false), 1);
        // dates
        case "d":
          return intUnit(oneOrTwo);
        case "dd":
          return intUnit(two);
        // ordinals
        case "o":
          return intUnit(oneToThree);
        case "ooo":
          return intUnit(three);
        // time
        case "HH":
          return intUnit(two);
        case "H":
          return intUnit(oneOrTwo);
        case "hh":
          return intUnit(two);
        case "h":
          return intUnit(oneOrTwo);
        case "mm":
          return intUnit(two);
        case "m":
          return intUnit(oneOrTwo);
        case "q":
          return intUnit(oneOrTwo);
        case "qq":
          return intUnit(two);
        case "s":
          return intUnit(oneOrTwo);
        case "ss":
          return intUnit(two);
        case "S":
          return intUnit(oneToThree);
        case "SSS":
          return intUnit(three);
        case "u":
          return simple(oneToNine);
        case "uu":
          return simple(oneOrTwo);
        case "uuu":
          return intUnit(one);
        // meridiem
        case "a":
          return oneOf(loc.meridiems(), 0);
        // weekYear (k)
        case "kkkk":
          return intUnit(four);
        case "kk":
          return intUnit(twoToFour, untruncateYear);
        // weekNumber (W)
        case "W":
          return intUnit(oneOrTwo);
        case "WW":
          return intUnit(two);
        // weekdays
        case "E":
        case "c":
          return intUnit(one);
        case "EEE":
          return oneOf(loc.weekdays("short", false), 1);
        case "EEEE":
          return oneOf(loc.weekdays("long", false), 1);
        case "ccc":
          return oneOf(loc.weekdays("short", true), 1);
        case "cccc":
          return oneOf(loc.weekdays("long", true), 1);
        // offset/zone
        case "Z":
        case "ZZ":
          return offset(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
        case "ZZZ":
          return offset(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
        // we don't support ZZZZ (PST) or ZZZZZ (Pacific Standard Time) in parsing
        // because we don't have any way to figure out what they are
        case "z":
          return simple(/[a-z_+-/]{1,256}?/i);
        // this special-case "token" represents a place where a macro-token expanded into a white-space literal
        // in this case we accept any non-newline white-space
        case " ":
          return simple(/[^\S\n\r]/);
        default:
          return literal(t);
      }
    };

  const unit = unitate(token) || {
    invalidReason: MISSING_FTP,
  };

  unit.token = token;

  return unit;
}

const partTypeStyleToTokenVal = {
  year: {
    "2-digit": "yy",
    numeric: "yyyyy",
  },
  month: {
    numeric: "M",
    "2-digit": "MM",
    short: "MMM",
    long: "MMMM",
  },
  day: {
    numeric: "d",
    "2-digit": "dd",
  },
  weekday: {
    short: "EEE",
    long: "EEEE",
  },
  dayperiod: "a",
  dayPeriod: "a",
  hour12: {
    numeric: "h",
    "2-digit": "hh",
  },
  hour24: {
    numeric: "H",
    "2-digit": "HH",
  },
  minute: {
    numeric: "m",
    "2-digit": "mm",
  },
  second: {
    numeric: "s",
    "2-digit": "ss",
  },
  timeZoneName: {
    long: "ZZZZZ",
    short: "ZZZ",
  },
};

function tokenForPart(part, formatOpts, resolvedOpts) {
  const { type, value } = part;

  if (type === "literal") {
    const isSpace = /^\s+$/.test(value);
    return {
      literal: !isSpace,
      val: isSpace ? " " : value,
    };
  }

  const style = formatOpts[type];

  // The user might have explicitly specified hour12 or hourCycle
  // if so, respect their decision
  // if not, refer back to the resolvedOpts, which are based on the locale
  let actualType = type;
  if (type === "hour") {
    if (formatOpts.hour12 != null) {
      actualType = formatOpts.hour12 ? "hour12" : "hour24";
    } else if (formatOpts.hourCycle != null) {
      if (formatOpts.hourCycle === "h11" || formatOpts.hourCycle === "h12") {
        actualType = "hour12";
      } else {
        actualType = "hour24";
      }
    } else {
      // tokens only differentiate between 24 hours or not,
      // so we do not need to check hourCycle here, which is less supported anyways
      actualType = resolvedOpts.hour12 ? "hour12" : "hour24";
    }
  }
  let val = partTypeStyleToTokenVal[actualType];
  if (typeof val === "object") {
    val = val[style];
  }

  if (val) {
    return {
      literal: false,
      val,
    };
  }

  return undefined;
}

function buildRegex(units) {
  const re = units.map((u) => u.regex).reduce((f, r) => `${f}(${r.source})`, "");
  return [`^${re}$`, units];
}

function match(input, regex, handlers) {
  const matches = input.match(regex);

  if (matches) {
    const all = {};
    let matchIndex = 1;
    for (const i in handlers) {
      if (hasOwnProperty(handlers, i)) {
        const h = handlers[i],
          groups = h.groups ? h.groups + 1 : 1;
        if (!h.literal && h.token) {
          all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
        }
        matchIndex += groups;
      }
    }
    return [matches, all];
  } else {
    return [matches, {}];
  }
}

function dateTimeFromMatches(matches) {
  const toField = (token) => {
    switch (token) {
      case "S":
        return "millisecond";
      case "s":
        return "second";
      case "m":
        return "minute";
      case "h":
      case "H":
        return "hour";
      case "d":
        return "day";
      case "o":
        return "ordinal";
      case "L":
      case "M":
        return "month";
      case "y":
        return "year";
      case "E":
      case "c":
        return "weekday";
      case "W":
        return "weekNumber";
      case "k":
        return "weekYear";
      case "q":
        return "quarter";
      default:
        return null;
    }
  };

  let zone = null;
  let specificOffset;
  if (!isUndefined(matches.z)) {
    zone = IANAZone.create(matches.z);
  }

  if (!isUndefined(matches.Z)) {
    if (!zone) {
      zone = new FixedOffsetZone(matches.Z);
    }
    specificOffset = matches.Z;
  }

  if (!isUndefined(matches.q)) {
    matches.M = (matches.q - 1) * 3 + 1;
  }

  if (!isUndefined(matches.h)) {
    if (matches.h < 12 && matches.a === 1) {
      matches.h += 12;
    } else if (matches.h === 12 && matches.a === 0) {
      matches.h = 0;
    }
  }

  if (matches.G === 0 && matches.y) {
    matches.y = -matches.y;
  }

  if (!isUndefined(matches.u)) {
    matches.S = parseMillis(matches.u);
  }

  const vals = Object.keys(matches).reduce((r, k) => {
    const f = toField(k);
    if (f) {
      r[f] = matches[k];
    }

    return r;
  }, {});

  return [vals, zone, specificOffset];
}

let dummyDateTimeCache = null;

function getDummyDateTime() {
  if (!dummyDateTimeCache) {
    dummyDateTimeCache = DateTime.fromMillis(1555555555555);
  }

  return dummyDateTimeCache;
}

function maybeExpandMacroToken(token, locale) {
  if (token.literal) {
    return token;
  }

  const formatOpts = Formatter.macroTokenToFormatOpts(token.val);
  const tokens = formatOptsToTokens(formatOpts, locale);

  if (tokens == null || tokens.includes(undefined)) {
    return token;
  }

  return tokens;
}

function expandMacroTokens(tokens, locale) {
  return Array.prototype.concat(...tokens.map((t) => maybeExpandMacroToken(t, locale)));
}

/**
 * @private
 */

class TokenParser {
  constructor(locale, format) {
    this.locale = locale;
    this.format = format;
    this.tokens = expandMacroTokens(Formatter.parseFormat(format), locale);
    this.units = this.tokens.map((t) => unitForToken(t, locale));
    this.disqualifyingUnit = this.units.find((t) => t.invalidReason);

    if (!this.disqualifyingUnit) {
      const [regexString, handlers] = buildRegex(this.units);
      this.regex = RegExp(regexString, "i");
      this.handlers = handlers;
    }
  }

  explainFromTokens(input) {
    if (!this.isValid) {
      return { input, tokens: this.tokens, invalidReason: this.invalidReason };
    } else {
      const [rawMatches, matches] = match(input, this.regex, this.handlers),
        [result, zone, specificOffset] = matches
          ? dateTimeFromMatches(matches)
          : [null, null, undefined];
      if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
        throw new ConflictingSpecificationError(
          "Can't include meridiem when specifying 24-hour format"
        );
      }
      return {
        input,
        tokens: this.tokens,
        regex: this.regex,
        rawMatches,
        matches,
        result,
        zone,
        specificOffset,
      };
    }
  }

  get isValid() {
    return !this.disqualifyingUnit;
  }

  get invalidReason() {
    return this.disqualifyingUnit ? this.disqualifyingUnit.invalidReason : null;
  }
}

function explainFromTokens(locale, input, format) {
  const parser = new TokenParser(locale, format);
  return parser.explainFromTokens(input);
}

function parseFromTokens(locale, input, format) {
  const { result, zone, specificOffset, invalidReason } = explainFromTokens(locale, input, format);
  return [result, zone, specificOffset, invalidReason];
}

function formatOptsToTokens(formatOpts, locale) {
  if (!formatOpts) {
    return null;
  }

  const formatter = Formatter.create(locale, formatOpts);
  const df = formatter.dtFormatter(getDummyDateTime());
  const parts = df.formatToParts();
  const resolvedOpts = df.resolvedOptions();
  return parts.map((p) => tokenForPart(p, formatOpts, resolvedOpts));
}

const INVALID = "Invalid DateTime";
const MAX_DATE = 8.64e15;

function unsupportedZone(zone) {
  return new Invalid("unsupported zone", `the zone "${zone.name}" is not supported`);
}

// we cache week data on the DT object and this intermediates the cache
/**
 * @param {DateTime} dt
 */
function possiblyCachedWeekData(dt) {
  if (dt.weekData === null) {
    dt.weekData = gregorianToWeek(dt.c);
  }
  return dt.weekData;
}

/**
 * @param {DateTime} dt
 */
function possiblyCachedLocalWeekData(dt) {
  if (dt.localWeekData === null) {
    dt.localWeekData = gregorianToWeek(
      dt.c,
      dt.loc.getMinDaysInFirstWeek(),
      dt.loc.getStartOfWeek()
    );
  }
  return dt.localWeekData;
}

// clone really means, "make a new object with these modifications". all "setters" really use this
// to create a new object while only changing some of the properties
function clone(inst, alts) {
  const current = {
    ts: inst.ts,
    zone: inst.zone,
    c: inst.c,
    o: inst.o,
    loc: inst.loc,
    invalid: inst.invalid,
  };
  return new DateTime({ ...current, ...alts, old: current });
}

// find the right offset a given local time. The o input is our guess, which determines which
// offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)
function fixOffset(localTS, o, tz) {
  // Our UTC time is just a guess because our offset is just a guess
  let utcGuess = localTS - o * 60 * 1000;

  // Test whether the zone matches the offset for this ts
  const o2 = tz.offset(utcGuess);

  // If so, offset didn't change and we're done
  if (o === o2) {
    return [utcGuess, o];
  }

  // If not, change the ts by the difference in the offset
  utcGuess -= (o2 - o) * 60 * 1000;

  // If that gives us the local time we want, we're done
  const o3 = tz.offset(utcGuess);
  if (o2 === o3) {
    return [utcGuess, o2];
  }

  // If it's different, we're in a hole time. The offset has changed, but the we don't adjust the time
  return [localTS - Math.min(o2, o3) * 60 * 1000, Math.max(o2, o3)];
}

// convert an epoch timestamp into a calendar object with the given offset
function tsToObj(ts, offset) {
  ts += offset * 60 * 1000;

  const d = new Date(ts);

  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    millisecond: d.getUTCMilliseconds(),
  };
}

// convert a calendar object to a epoch timestamp
function objToTS(obj, offset, zone) {
  return fixOffset(objToLocalTS(obj), offset, zone);
}

// create a new DT instance by adding a duration, adjusting for DSTs
function adjustTime(inst, dur) {
  const oPre = inst.o,
    year = inst.c.year + Math.trunc(dur.years),
    month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3,
    c = {
      ...inst.c,
      year,
      month,
      day:
        Math.min(inst.c.day, daysInMonth(year, month)) +
        Math.trunc(dur.days) +
        Math.trunc(dur.weeks) * 7,
    },
    millisToAdd = Duration.fromObject({
      years: dur.years - Math.trunc(dur.years),
      quarters: dur.quarters - Math.trunc(dur.quarters),
      months: dur.months - Math.trunc(dur.months),
      weeks: dur.weeks - Math.trunc(dur.weeks),
      days: dur.days - Math.trunc(dur.days),
      hours: dur.hours,
      minutes: dur.minutes,
      seconds: dur.seconds,
      milliseconds: dur.milliseconds,
    }).as("milliseconds"),
    localTS = objToLocalTS(c);

  let [ts, o] = fixOffset(localTS, oPre, inst.zone);

  if (millisToAdd !== 0) {
    ts += millisToAdd;
    // that could have changed the offset by going over a DST, but we want to keep the ts the same
    o = inst.zone.offset(ts);
  }

  return { ts, o };
}

// helper useful in turning the results of parsing into real dates
// by handling the zone options
function parseDataToDateTime(parsed, parsedZone, opts, format, text, specificOffset) {
  const { setZone, zone } = opts;
  if ((parsed && Object.keys(parsed).length !== 0) || parsedZone) {
    const interpretationZone = parsedZone || zone,
      inst = DateTime.fromObject(parsed, {
        ...opts,
        zone: interpretationZone,
        specificOffset,
      });
    return setZone ? inst : inst.setZone(zone);
  } else {
    return DateTime.invalid(
      new Invalid("unparsable", `the input "${text}" can't be parsed as ${format}`)
    );
  }
}

// if you want to output a technical format (e.g. RFC 2822), this helper
// helps handle the details
function toTechFormat(dt, format, allowZ = true) {
  return dt.isValid
    ? Formatter.create(Locale.create("en-US"), {
        allowZ,
        forceSimple: true,
      }).formatDateTimeFromString(dt, format)
    : null;
}

function toISODate(o, extended, precision) {
  const longFormat = o.c.year > 9999 || o.c.year < 0;
  let c = "";
  if (longFormat && o.c.year >= 0) c += "+";
  c += padStart(o.c.year, longFormat ? 6 : 4);
  if (precision === "year") return c;
  if (extended) {
    c += "-";
    c += padStart(o.c.month);
    if (precision === "month") return c;
    c += "-";
  } else {
    c += padStart(o.c.month);
    if (precision === "month") return c;
  }
  c += padStart(o.c.day);
  return c;
}

function toISOTime(
  o,
  extended,
  suppressSeconds,
  suppressMilliseconds,
  includeOffset,
  extendedZone,
  precision
) {
  let showSeconds = !suppressSeconds || o.c.millisecond !== 0 || o.c.second !== 0,
    c = "";
  switch (precision) {
    case "day":
    case "month":
    case "year":
      break;
    default:
      c += padStart(o.c.hour);
      if (precision === "hour") break;
      if (extended) {
        c += ":";
        c += padStart(o.c.minute);
        if (precision === "minute") break;
        if (showSeconds) {
          c += ":";
          c += padStart(o.c.second);
        }
      } else {
        c += padStart(o.c.minute);
        if (precision === "minute") break;
        if (showSeconds) {
          c += padStart(o.c.second);
        }
      }
      if (precision === "second") break;
      if (showSeconds && (!suppressMilliseconds || o.c.millisecond !== 0)) {
        c += ".";
        c += padStart(o.c.millisecond, 3);
      }
  }

  if (includeOffset) {
    if (o.isOffsetFixed && o.offset === 0 && !extendedZone) {
      c += "Z";
    } else if (o.o < 0) {
      c += "-";
      c += padStart(Math.trunc(-o.o / 60));
      c += ":";
      c += padStart(Math.trunc(-o.o % 60));
    } else {
      c += "+";
      c += padStart(Math.trunc(o.o / 60));
      c += ":";
      c += padStart(Math.trunc(o.o % 60));
    }
  }

  if (extendedZone) {
    c += "[" + o.zone.ianaName + "]";
  }
  return c;
}

// defaults for unspecified units in the supported calendars
const defaultUnitValues = {
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  },
  defaultWeekUnitValues = {
    weekNumber: 1,
    weekday: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  },
  defaultOrdinalUnitValues = {
    ordinal: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };

// Units in the supported calendars, sorted by bigness
const orderedUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"],
  orderedWeekUnits = [
    "weekYear",
    "weekNumber",
    "weekday",
    "hour",
    "minute",
    "second",
    "millisecond",
  ],
  orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"];

// standardize case and plurality in units
function normalizeUnit(unit) {
  const normalized = {
    year: "year",
    years: "year",
    month: "month",
    months: "month",
    day: "day",
    days: "day",
    hour: "hour",
    hours: "hour",
    minute: "minute",
    minutes: "minute",
    quarter: "quarter",
    quarters: "quarter",
    second: "second",
    seconds: "second",
    millisecond: "millisecond",
    milliseconds: "millisecond",
    weekday: "weekday",
    weekdays: "weekday",
    weeknumber: "weekNumber",
    weeksnumber: "weekNumber",
    weeknumbers: "weekNumber",
    weekyear: "weekYear",
    weekyears: "weekYear",
    ordinal: "ordinal",
  }[unit.toLowerCase()];

  if (!normalized) throw new InvalidUnitError(unit);

  return normalized;
}

function normalizeUnitWithLocalWeeks(unit) {
  switch (unit.toLowerCase()) {
    case "localweekday":
    case "localweekdays":
      return "localWeekday";
    case "localweeknumber":
    case "localweeknumbers":
      return "localWeekNumber";
    case "localweekyear":
    case "localweekyears":
      return "localWeekYear";
    default:
      return normalizeUnit(unit);
  }
}

// cache offsets for zones based on the current timestamp when this function is
// first called. When we are handling a datetime from components like (year,
// month, day, hour) in a time zone, we need a guess about what the timezone
// offset is so that we can convert into a UTC timestamp. One way is to find the
// offset of now in the zone. The actual date may have a different offset (for
// example, if we handle a date in June while we're in December in a zone that
// observes DST), but we can check and adjust that.
//
// When handling many dates, calculating the offset for now every time is
// expensive. It's just a guess, so we can cache the offset to use even if we
// are right on a time change boundary (we'll just correct in the other
// direction). Using a timestamp from first read is a slight optimization for
// handling dates close to the current date, since those dates will usually be
// in the same offset (we could set the timestamp statically, instead). We use a
// single timestamp for all zones to make things a bit more predictable.
//
// This is safe for quickDT (used by local() and utc()) because we don't fill in
// higher-order units from tsNow (as we do in fromObject, this requires that
// offset is calculated from tsNow).
/**
 * @param {Zone} zone
 * @return {number}
 */
function guessOffsetForZone(zone) {
  if (zoneOffsetTs === undefined) {
    zoneOffsetTs = Settings.now();
  }

  // Do not cache anything but IANA zones, because it is not safe to do so.
  // Guessing an offset which is not present in the zone can cause wrong results from fixOffset
  if (zone.type !== "iana") {
    return zone.offset(zoneOffsetTs);
  }
  const zoneName = zone.name;
  let offsetGuess = zoneOffsetGuessCache.get(zoneName);
  if (offsetGuess === undefined) {
    offsetGuess = zone.offset(zoneOffsetTs);
    zoneOffsetGuessCache.set(zoneName, offsetGuess);
  }
  return offsetGuess;
}

// this is a dumbed down version of fromObject() that runs about 60% faster
// but doesn't do any validation, makes a bunch of assumptions about what units
// are present, and so on.
function quickDT(obj, opts) {
  const zone = normalizeZone(opts.zone, Settings.defaultZone);
  if (!zone.isValid) {
    return DateTime.invalid(unsupportedZone(zone));
  }

  const loc = Locale.fromObject(opts);

  let ts, o;

  // assume we have the higher-order units
  if (!isUndefined(obj.year)) {
    for (const u of orderedUnits) {
      if (isUndefined(obj[u])) {
        obj[u] = defaultUnitValues[u];
      }
    }

    const invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);
    if (invalid) {
      return DateTime.invalid(invalid);
    }

    const offsetProvis = guessOffsetForZone(zone);
    [ts, o] = objToTS(obj, offsetProvis, zone);
  } else {
    ts = Settings.now();
  }

  return new DateTime({ ts, zone, loc, o });
}

function diffRelative(start, end, opts) {
  const round = isUndefined(opts.round) ? true : opts.round,
    rounding = isUndefined(opts.rounding) ? "trunc" : opts.rounding,
    format = (c, unit) => {
      c = roundTo(c, round || opts.calendary ? 0 : 2, opts.calendary ? "round" : rounding);
      const formatter = end.loc.clone(opts).relFormatter(opts);
      return formatter.format(c, unit);
    },
    differ = (unit) => {
      if (opts.calendary) {
        if (!end.hasSame(start, unit)) {
          return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
        } else return 0;
      } else {
        return end.diff(start, unit).get(unit);
      }
    };

  if (opts.unit) {
    return format(differ(opts.unit), opts.unit);
  }

  for (const unit of opts.units) {
    const count = differ(unit);
    if (Math.abs(count) >= 1) {
      return format(count, unit);
    }
  }
  return format(start > end ? -0 : 0, opts.units[opts.units.length - 1]);
}

function lastOpts(argList) {
  let opts = {},
    args;
  if (argList.length > 0 && typeof argList[argList.length - 1] === "object") {
    opts = argList[argList.length - 1];
    args = Array.from(argList).slice(0, argList.length - 1);
  } else {
    args = Array.from(argList);
  }
  return [opts, args];
}

/**
 * Timestamp to use for cached zone offset guesses (exposed for test)
 */
let zoneOffsetTs;
/**
 * Cache for zone offset guesses (exposed for test).
 *
 * This optimizes quickDT via guessOffsetForZone to avoid repeated calls of
 * zone.offset().
 */
const zoneOffsetGuessCache = new Map();

/**
 * A DateTime is an immutable data structure representing a specific date and time and accompanying methods. It contains class and instance methods for creating, parsing, interrogating, transforming, and formatting them.
 *
 * A DateTime comprises of:
 * * A timestamp. Each DateTime instance refers to a specific millisecond of the Unix epoch.
 * * A time zone. Each instance is considered in the context of a specific zone (by default the local system's zone).
 * * Configuration properties that effect how output strings are formatted, such as `locale`, `numberingSystem`, and `outputCalendar`.
 *
 * Here is a brief overview of the most commonly used functionality it provides:
 *
 * * **Creation**: To create a DateTime from its components, use one of its factory class methods: {@link DateTime.local}, {@link DateTime.utc}, and (most flexibly) {@link DateTime.fromObject}. To create one from a standard string format, use {@link DateTime.fromISO}, {@link DateTime.fromHTTP}, and {@link DateTime.fromRFC2822}. To create one from a custom string format, use {@link DateTime.fromFormat}. To create one from a native JS date, use {@link DateTime.fromJSDate}.
 * * **Gregorian calendar and time**: To examine the Gregorian properties of a DateTime individually (i.e as opposed to collectively through {@link DateTime#toObject}), use the {@link DateTime#year}, {@link DateTime#month},
 * {@link DateTime#day}, {@link DateTime#hour}, {@link DateTime#minute}, {@link DateTime#second}, {@link DateTime#millisecond} accessors.
 * * **Week calendar**: For ISO week calendar attributes, see the {@link DateTime#weekYear}, {@link DateTime#weekNumber}, and {@link DateTime#weekday} accessors.
 * * **Configuration** See the {@link DateTime#locale} and {@link DateTime#numberingSystem} accessors.
 * * **Transformation**: To transform the DateTime into other DateTimes, use {@link DateTime#set}, {@link DateTime#reconfigure}, {@link DateTime#setZone}, {@link DateTime#setLocale}, {@link DateTime.plus}, {@link DateTime#minus}, {@link DateTime#endOf}, {@link DateTime#startOf}, {@link DateTime#toUTC}, and {@link DateTime#toLocal}.
 * * **Output**: To convert the DateTime to other representations, use the {@link DateTime#toRelative}, {@link DateTime#toRelativeCalendar}, {@link DateTime#toJSON}, {@link DateTime#toISO}, {@link DateTime#toHTTP}, {@link DateTime#toObject}, {@link DateTime#toRFC2822}, {@link DateTime#toString}, {@link DateTime#toLocaleString}, {@link DateTime#toFormat}, {@link DateTime#toMillis} and {@link DateTime#toJSDate}.
 *
 * There's plenty others documented below. In addition, for more information on subtler topics like internationalization, time zones, alternative calendars, validity, and so on, see the external documentation.
 */
class DateTime {
  /**
   * @access private
   */
  constructor(config) {
    const zone = config.zone || Settings.defaultZone;

    let invalid =
      config.invalid ||
      (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) ||
      (!zone.isValid ? unsupportedZone(zone) : null);
    /**
     * @access private
     */
    this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;

    let c = null,
      o = null;
    if (!invalid) {
      const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);

      if (unchanged) {
        [c, o] = [config.old.c, config.old.o];
      } else {
        // If an offset has been passed and we have not been called from
        // clone(), we can trust it and avoid the offset calculation.
        const ot = isNumber(config.o) && !config.old ? config.o : zone.offset(this.ts);
        c = tsToObj(this.ts, ot);
        invalid = Number.isNaN(c.year) ? new Invalid("invalid input") : null;
        c = invalid ? null : c;
        o = invalid ? null : ot;
      }
    }

    /**
     * @access private
     */
    this._zone = zone;
    /**
     * @access private
     */
    this.loc = config.loc || Locale.create();
    /**
     * @access private
     */
    this.invalid = invalid;
    /**
     * @access private
     */
    this.weekData = null;
    /**
     * @access private
     */
    this.localWeekData = null;
    /**
     * @access private
     */
    this.c = c;
    /**
     * @access private
     */
    this.o = o;
    /**
     * @access private
     */
    this.isLuxonDateTime = true;
  }

  // CONSTRUCT

  /**
   * Create a DateTime for the current instant, in the system's time zone.
   *
   * Use Settings to override these default values if needed.
   * @example DateTime.now().toISO() //~> now in the ISO format
   * @return {DateTime}
   */
  static now() {
    return new DateTime({});
  }

  /**
   * Create a local DateTime
   * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month, 1-indexed
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @example DateTime.local()                                  //~> now
   * @example DateTime.local({ zone: "America/New_York" })      //~> now, in US east coast time
   * @example DateTime.local(2017)                              //~> 2017-01-01T00:00:00
   * @example DateTime.local(2017, 3)                           //~> 2017-03-01T00:00:00
   * @example DateTime.local(2017, 3, 12, { locale: "fr" })     //~> 2017-03-12T00:00:00, with a French locale
   * @example DateTime.local(2017, 3, 12, 5)                    //~> 2017-03-12T05:00:00
   * @example DateTime.local(2017, 3, 12, 5, { zone: "utc" })   //~> 2017-03-12T05:00:00, in UTC
   * @example DateTime.local(2017, 3, 12, 5, 45)                //~> 2017-03-12T05:45:00
   * @example DateTime.local(2017, 3, 12, 5, 45, 10)            //~> 2017-03-12T05:45:10
   * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765)       //~> 2017-03-12T05:45:10.765
   * @return {DateTime}
   */
  static local() {
    const [opts, args] = lastOpts(arguments),
      [year, month, day, hour, minute, second, millisecond] = args;
    return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
  }

  /**
   * Create a DateTime in UTC
   * @param {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
   * @param {number} [month=1] - The month, 1-indexed
   * @param {number} [day=1] - The day of the month
   * @param {number} [hour=0] - The hour of the day, in 24-hour time
   * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
   * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
   * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
   * @param {Object} options - configuration options for the DateTime
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
   * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
   * @param {string} [options.weekSettings] - the week settings to set on the resulting DateTime instance
   * @example DateTime.utc()                                              //~> now
   * @example DateTime.utc(2017)                                          //~> 2017-01-01T00:00:00Z
   * @example DateTime.utc(2017, 3)                                       //~> 2017-03-01T00:00:00Z
   * @example DateTime.utc(2017, 3, 12)                                   //~> 2017-03-12T00:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5)                                //~> 2017-03-12T05:00:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45)                            //~> 2017-03-12T05:45:00Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, { locale: "fr" })          //~> 2017-03-12T05:45:00Z with a French locale
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10)                        //~> 2017-03-12T05:45:10Z
   * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr" }) //~> 2017-03-12T05:45:10.765Z with a French locale
   * @return {DateTime}
   */
  static utc() {
    const [opts, args] = lastOpts(arguments),
      [year, month, day, hour, minute, second, millisecond] = args;

    opts.zone = FixedOffsetZone.utcInstance;
    return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
  }

  /**
   * Create a DateTime from a JavaScript Date object. Uses the default zone.
   * @param {Date} date - a JavaScript Date object
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @return {DateTime}
   */
  static fromJSDate(date, options = {}) {
    const ts = isDate(date) ? date.valueOf() : NaN;
    if (Number.isNaN(ts)) {
      return DateTime.invalid("invalid input");
    }

    const zoneToUse = normalizeZone(options.zone, Settings.defaultZone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone(zoneToUse));
    }

    return new DateTime({
      ts: ts,
      zone: zoneToUse,
      loc: Locale.fromObject(options),
    });
  }

  /**
   * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} milliseconds - a number of milliseconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} options.weekSettings - the week settings to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromMillis(milliseconds, options = {}) {
    if (!isNumber(milliseconds)) {
      throw new InvalidArgumentError(
        `fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`
      );
    } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
      // this isn't perfect because we can still end up out of range because of additional shifting, but it's a start
      return DateTime.invalid("Timestamp out of range");
    } else {
      return new DateTime({
        ts: milliseconds,
        zone: normalizeZone(options.zone, Settings.defaultZone),
        loc: Locale.fromObject(options),
      });
    }
  }

  /**
   * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
   * @param {number} seconds - a number of seconds since 1970 UTC
   * @param {Object} options - configuration options for the DateTime
   * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
   * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
   * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} options.weekSettings - the week settings to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromSeconds(seconds, options = {}) {
    if (!isNumber(seconds)) {
      throw new InvalidArgumentError("fromSeconds requires a numerical input");
    } else {
      return new DateTime({
        ts: seconds * 1000,
        zone: normalizeZone(options.zone, Settings.defaultZone),
        loc: Locale.fromObject(options),
      });
    }
  }

  /**
   * Create a DateTime from a JavaScript object with keys like 'year' and 'hour' with reasonable defaults.
   * @param {Object} obj - the object to create the DateTime from
   * @param {number} obj.year - a year, such as 1987
   * @param {number} obj.month - a month, 1-12
   * @param {number} obj.day - a day of the month, 1-31, depending on the month
   * @param {number} obj.ordinal - day of the year, 1-365 or 366
   * @param {number} obj.weekYear - an ISO week year
   * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
   * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
   * @param {number} obj.localWeekYear - a week year, according to the locale
   * @param {number} obj.localWeekNumber - a week number, between 1 and 52 or 53, depending on the year, according to the locale
   * @param {number} obj.localWeekday - a weekday, 1-7, where 1 is the first and 7 is the last day of the week, according to the locale
   * @param {number} obj.hour - hour of the day, 0-23
   * @param {number} obj.minute - minute of the hour, 0-59
   * @param {number} obj.second - second of the minute, 0-59
   * @param {number} obj.millisecond - millisecond of the second, 0-999
   * @param {Object} opts - options for creating this DateTime
   * @param {string|Zone} [opts.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
   * @param {string} [opts.locale='system\'s locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
   * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'utc' }),
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'local' })
   * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'America/New_York' })
   * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
   * @example DateTime.fromObject({ localWeekYear: 2022, localWeekNumber: 1, localWeekday: 1 }, { locale: "en-US" }).toISODate() //=> '2021-12-26'
   * @return {DateTime}
   */
  static fromObject(obj, opts = {}) {
    obj = obj || {};
    const zoneToUse = normalizeZone(opts.zone, Settings.defaultZone);
    if (!zoneToUse.isValid) {
      return DateTime.invalid(unsupportedZone(zoneToUse));
    }

    const loc = Locale.fromObject(opts);
    const normalized = normalizeObject(obj, normalizeUnitWithLocalWeeks);
    const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, loc);

    const tsNow = Settings.now(),
      offsetProvis = !isUndefined(opts.specificOffset)
        ? opts.specificOffset
        : zoneToUse.offset(tsNow),
      containsOrdinal = !isUndefined(normalized.ordinal),
      containsGregorYear = !isUndefined(normalized.year),
      containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day),
      containsGregor = containsGregorYear || containsGregorMD,
      definiteWeekDef = normalized.weekYear || normalized.weekNumber;

    // cases:
    // just a weekday -> this week's instance of that weekday, no worries
    // (gregorian data or ordinal) + (weekYear or weekNumber) -> error
    // (gregorian month or day) + ordinal -> error
    // otherwise just use weeks or ordinals or gregorian, depending on what's specified

    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    }

    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
    }

    const useWeekData = definiteWeekDef || (normalized.weekday && !containsGregor);

    // configure ourselves to deal with gregorian dates or week stuff
    let units,
      defaultValues,
      objNow = tsToObj(tsNow, offsetProvis);
    if (useWeekData) {
      units = orderedWeekUnits;
      defaultValues = defaultWeekUnitValues;
      objNow = gregorianToWeek(objNow, minDaysInFirstWeek, startOfWeek);
    } else if (containsOrdinal) {
      units = orderedOrdinalUnits;
      defaultValues = defaultOrdinalUnitValues;
      objNow = gregorianToOrdinal(objNow);
    } else {
      units = orderedUnits;
      defaultValues = defaultUnitValues;
    }

    // set default values for missing stuff
    let foundFirst = false;
    for (const u of units) {
      const v = normalized[u];
      if (!isUndefined(v)) {
        foundFirst = true;
      } else if (foundFirst) {
        normalized[u] = defaultValues[u];
      } else {
        normalized[u] = objNow[u];
      }
    }

    // make sure the values we have are in range
    const higherOrderInvalid = useWeekData
        ? hasInvalidWeekData(normalized, minDaysInFirstWeek, startOfWeek)
        : containsOrdinal
        ? hasInvalidOrdinalData(normalized)
        : hasInvalidGregorianData(normalized),
      invalid = higherOrderInvalid || hasInvalidTimeData(normalized);

    if (invalid) {
      return DateTime.invalid(invalid);
    }

    // compute the actual time
    const gregorian = useWeekData
        ? weekToGregorian(normalized, minDaysInFirstWeek, startOfWeek)
        : containsOrdinal
        ? ordinalToGregorian(normalized)
        : normalized,
      [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse),
      inst = new DateTime({
        ts: tsFinal,
        zone: zoneToUse,
        o: offsetFinal,
        loc,
      });

    // gregorian data + weekday serves only to validate
    if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
      return DateTime.invalid(
        "mismatched weekday",
        `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`
      );
    }

    if (!inst.isValid) {
      return DateTime.invalid(inst.invalid);
    }

    return inst;
  }

  /**
   * Create a DateTime from an ISO 8601 string
   * @param {string} text - the ISO string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} [opts.outputCalendar] - the output calendar to set on the resulting DateTime instance
   * @param {string} [opts.numberingSystem] - the numbering system to set on the resulting DateTime instance
   * @param {string} [opts.weekSettings] - the week settings to set on the resulting DateTime instance
   * @example DateTime.fromISO('2016-05-25T09:08:34.123')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
   * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
   * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
   * @example DateTime.fromISO('2016-W05-4')
   * @return {DateTime}
   */
  static fromISO(text, opts = {}) {
    const [vals, parsedZone] = parseISODate(text);
    return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
  }

  /**
   * Create a DateTime from an RFC 2822 string
   * @param {string} text - the RFC 2822 string
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
   * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
   * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
   * @return {DateTime}
   */
  static fromRFC2822(text, opts = {}) {
    const [vals, parsedZone] = parseRFC2822Date(text);
    return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
  }

  /**
   * Create a DateTime from an HTTP header date
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @param {string} text - the HTTP header date
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
   * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
   * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
   * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
   * @return {DateTime}
   */
  static fromHTTP(text, opts = {}) {
    const [vals, parsedZone] = parseHTTPDate(text);
    return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
  }

  /**
   * Create a DateTime from an input string and format string.
   * Defaults to en-US if no locale has been specified, regardless of the system's locale. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/parsing?id=table-of-tokens).
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @return {DateTime}
   */
  static fromFormat(text, fmt, opts = {}) {
    if (isUndefined(text) || isUndefined(fmt)) {
      throw new InvalidArgumentError("fromFormat requires an input string and a format");
    }

    const { locale = null, numberingSystem = null } = opts,
      localeToUse = Locale.fromOpts({
        locale,
        numberingSystem,
        defaultToEN: true,
      }),
      [vals, parsedZone, specificOffset, invalid] = parseFromTokens(localeToUse, text, fmt);
    if (invalid) {
      return DateTime.invalid(invalid);
    } else {
      return parseDataToDateTime(vals, parsedZone, opts, `format ${fmt}`, text, specificOffset);
    }
  }

  /**
   * @deprecated use fromFormat instead
   */
  static fromString(text, fmt, opts = {}) {
    return DateTime.fromFormat(text, fmt, opts);
  }

  /**
   * Create a DateTime from a SQL date, time, or datetime
   * Defaults to en-US if no locale has been specified, regardless of the system's locale
   * @param {string} text - the string to parse
   * @param {Object} opts - options to affect the creation
   * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
   * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
   * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
   * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
   * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
   * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
   * @example DateTime.fromSQL('2017-05-15')
   * @example DateTime.fromSQL('2017-05-15 09:12:34')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
   * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
   * @example DateTime.fromSQL('09:12:34.342')
   * @return {DateTime}
   */
  static fromSQL(text, opts = {}) {
    const [vals, parsedZone] = parseSQL(text);
    return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
  }

  /**
   * Create an invalid DateTime.
   * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
   * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
   * @return {DateTime}
   */
  static invalid(reason, explanation = null) {
    if (!reason) {
      throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
    }

    const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

    if (Settings.throwOnInvalid) {
      throw new InvalidDateTimeError(invalid);
    } else {
      return new DateTime({ invalid });
    }
  }

  /**
   * Check if an object is an instance of DateTime. Works across context boundaries
   * @param {object} o
   * @return {boolean}
   */
  static isDateTime(o) {
    return (o && o.isLuxonDateTime) || false;
  }

  /**
   * Produce the format string for a set of options
   * @param formatOpts
   * @param localeOpts
   * @returns {string}
   */
  static parseFormatForOpts(formatOpts, localeOpts = {}) {
    const tokenList = formatOptsToTokens(formatOpts, Locale.fromObject(localeOpts));
    return !tokenList ? null : tokenList.map((t) => (t ? t.val : null)).join("");
  }

  /**
   * Produce the the fully expanded format token for the locale
   * Does NOT quote characters, so quoted tokens will not round trip correctly
   * @param fmt
   * @param localeOpts
   * @returns {string}
   */
  static expandFormat(fmt, localeOpts = {}) {
    const expanded = expandMacroTokens(Formatter.parseFormat(fmt), Locale.fromObject(localeOpts));
    return expanded.map((t) => t.val).join("");
  }

  static resetCache() {
    zoneOffsetTs = undefined;
    zoneOffsetGuessCache.clear();
  }

  // INFO

  /**
   * Get the value of unit.
   * @param {string} unit - a unit such as 'minute' or 'day'
   * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
   * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
   * @return {number}
   */
  get(unit) {
    return this[unit];
  }

  /**
   * Returns whether the DateTime is valid. Invalid DateTimes occur when:
   * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
   * * The DateTime was created by an operation on another invalid date
   * @type {boolean}
   */
  get isValid() {
    return this.invalid === null;
  }

  /**
   * Returns an error code if this DateTime is invalid, or null if the DateTime is valid
   * @type {string}
   */
  get invalidReason() {
    return this.invalid ? this.invalid.reason : null;
  }

  /**
   * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
   * @type {string}
   */
  get invalidExplanation() {
    return this.invalid ? this.invalid.explanation : null;
  }

  /**
   * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
   *
   * @type {string}
   */
  get locale() {
    return this.isValid ? this.loc.locale : null;
  }

  /**
   * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
   *
   * @type {string}
   */
  get numberingSystem() {
    return this.isValid ? this.loc.numberingSystem : null;
  }

  /**
   * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
   *
   * @type {string}
   */
  get outputCalendar() {
    return this.isValid ? this.loc.outputCalendar : null;
  }

  /**
   * Get the time zone associated with this DateTime.
   * @type {Zone}
   */
  get zone() {
    return this._zone;
  }

  /**
   * Get the name of the time zone.
   * @type {string}
   */
  get zoneName() {
    return this.isValid ? this.zone.name : null;
  }

  /**
   * Get the year
   * @example DateTime.local(2017, 5, 25).year //=> 2017
   * @type {number}
   */
  get year() {
    return this.isValid ? this.c.year : NaN;
  }

  /**
   * Get the quarter
   * @example DateTime.local(2017, 5, 25).quarter //=> 2
   * @type {number}
   */
  get quarter() {
    return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
  }

  /**
   * Get the month (1-12).
   * @example DateTime.local(2017, 5, 25).month //=> 5
   * @type {number}
   */
  get month() {
    return this.isValid ? this.c.month : NaN;
  }

  /**
   * Get the day of the month (1-30ish).
   * @example DateTime.local(2017, 5, 25).day //=> 25
   * @type {number}
   */
  get day() {
    return this.isValid ? this.c.day : NaN;
  }

  /**
   * Get the hour of the day (0-23).
   * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
   * @type {number}
   */
  get hour() {
    return this.isValid ? this.c.hour : NaN;
  }

  /**
   * Get the minute of the hour (0-59).
   * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
   * @type {number}
   */
  get minute() {
    return this.isValid ? this.c.minute : NaN;
  }

  /**
   * Get the second of the minute (0-59).
   * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
   * @type {number}
   */
  get second() {
    return this.isValid ? this.c.second : NaN;
  }

  /**
   * Get the millisecond of the second (0-999).
   * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
   * @type {number}
   */
  get millisecond() {
    return this.isValid ? this.c.millisecond : NaN;
  }

  /**
   * Get the week year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 12, 31).weekYear //=> 2015
   * @type {number}
   */
  get weekYear() {
    return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
  }

  /**
   * Get the week number of the week year (1-52ish).
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
   * @type {number}
   */
  get weekNumber() {
    return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
  }

  /**
   * Get the day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2014, 11, 31).weekday //=> 4
   * @type {number}
   */
  get weekday() {
    return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
  }

  /**
   * Returns true if this date is on a weekend according to the locale, false otherwise
   * @returns {boolean}
   */
  get isWeekend() {
    return this.isValid && this.loc.getWeekendDays().includes(this.weekday);
  }

  /**
   * Get the day of the week according to the locale.
   * 1 is the first day of the week and 7 is the last day of the week.
   * If the locale assigns Sunday as the first day of the week, then a date which is a Sunday will return 1,
   * @returns {number}
   */
  get localWeekday() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekday : NaN;
  }

  /**
   * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
   * because the week can start on different days of the week (see localWeekday) and because a different number of days
   * is required for a week to count as the first week of a year.
   * @returns {number}
   */
  get localWeekNumber() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekNumber : NaN;
  }

  /**
   * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
   * differently, see localWeekNumber.
   * @returns {number}
   */
  get localWeekYear() {
    return this.isValid ? possiblyCachedLocalWeekData(this).weekYear : NaN;
  }

  /**
   * Get the ordinal (meaning the day of the year)
   * @example DateTime.local(2017, 5, 25).ordinal //=> 145
   * @type {number|DateTime}
   */
  get ordinal() {
    return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
  }

  /**
   * Get the human readable short month name, such as 'Oct'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
   * @type {string}
   */
  get monthShort() {
    return this.isValid ? Info.months("short", { locObj: this.loc })[this.month - 1] : null;
  }

  /**
   * Get the human readable long month name, such as 'October'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).monthLong //=> October
   * @type {string}
   */
  get monthLong() {
    return this.isValid ? Info.months("long", { locObj: this.loc })[this.month - 1] : null;
  }

  /**
   * Get the human readable short weekday, such as 'Mon'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
   * @type {string}
   */
  get weekdayShort() {
    return this.isValid ? Info.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
  }

  /**
   * Get the human readable long weekday, such as 'Monday'.
   * Defaults to the system's locale if no locale has been specified
   * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
   * @type {string}
   */
  get weekdayLong() {
    return this.isValid ? Info.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
  }

  /**
   * Get the UTC offset of this DateTime in minutes
   * @example DateTime.now().offset //=> -240
   * @example DateTime.utc().offset //=> 0
   * @type {number}
   */
  get offset() {
    return this.isValid ? +this.o : NaN;
  }

  /**
   * Get the short human name for the zone's current offset, for example "EST" or "EDT".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameShort() {
    if (this.isValid) {
      return this.zone.offsetName(this.ts, {
        format: "short",
        locale: this.locale,
      });
    } else {
      return null;
    }
  }

  /**
   * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
   * Defaults to the system's locale if no locale has been specified
   * @type {string}
   */
  get offsetNameLong() {
    if (this.isValid) {
      return this.zone.offsetName(this.ts, {
        format: "long",
        locale: this.locale,
      });
    } else {
      return null;
    }
  }

  /**
   * Get whether this zone's offset ever changes, as in a DST.
   * @type {boolean}
   */
  get isOffsetFixed() {
    return this.isValid ? this.zone.isUniversal : null;
  }

  /**
   * Get whether the DateTime is in a DST.
   * @type {boolean}
   */
  get isInDST() {
    if (this.isOffsetFixed) {
      return false;
    } else {
      return (
        this.offset > this.set({ month: 1, day: 1 }).offset ||
        this.offset > this.set({ month: 5 }).offset
      );
    }
  }

  /**
   * Get those DateTimes which have the same local time as this DateTime, but a different offset from UTC
   * in this DateTime's zone. During DST changes local time can be ambiguous, for example
   * `2023-10-29T02:30:00` in `Europe/Berlin` can have offset `+01:00` or `+02:00`.
   * This method will return both possible DateTimes if this DateTime's local time is ambiguous.
   * @returns {DateTime[]}
   */
  getPossibleOffsets() {
    if (!this.isValid || this.isOffsetFixed) {
      return [this];
    }
    const dayMs = 86400000;
    const minuteMs = 60000;
    const localTS = objToLocalTS(this.c);
    const oEarlier = this.zone.offset(localTS - dayMs);
    const oLater = this.zone.offset(localTS + dayMs);

    const o1 = this.zone.offset(localTS - oEarlier * minuteMs);
    const o2 = this.zone.offset(localTS - oLater * minuteMs);
    if (o1 === o2) {
      return [this];
    }
    const ts1 = localTS - o1 * minuteMs;
    const ts2 = localTS - o2 * minuteMs;
    const c1 = tsToObj(ts1, o1);
    const c2 = tsToObj(ts2, o2);
    if (
      c1.hour === c2.hour &&
      c1.minute === c2.minute &&
      c1.second === c2.second &&
      c1.millisecond === c2.millisecond
    ) {
      return [clone(this, { ts: ts1 }), clone(this, { ts: ts2 })];
    }
    return [this];
  }

  /**
   * Returns true if this DateTime is in a leap year, false otherwise
   * @example DateTime.local(2016).isInLeapYear //=> true
   * @example DateTime.local(2013).isInLeapYear //=> false
   * @type {boolean}
   */
  get isInLeapYear() {
    return isLeapYear(this.year);
  }

  /**
   * Returns the number of days in this DateTime's month
   * @example DateTime.local(2016, 2).daysInMonth //=> 29
   * @example DateTime.local(2016, 3).daysInMonth //=> 31
   * @type {number}
   */
  get daysInMonth() {
    return daysInMonth(this.year, this.month);
  }

  /**
   * Returns the number of days in this DateTime's year
   * @example DateTime.local(2016).daysInYear //=> 366
   * @example DateTime.local(2013).daysInYear //=> 365
   * @type {number}
   */
  get daysInYear() {
    return this.isValid ? daysInYear(this.year) : NaN;
  }

  /**
   * Returns the number of weeks in this DateTime's year
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example DateTime.local(2004).weeksInWeekYear //=> 53
   * @example DateTime.local(2013).weeksInWeekYear //=> 52
   * @type {number}
   */
  get weeksInWeekYear() {
    return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
  }

  /**
   * Returns the number of weeks in this DateTime's local week year
   * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
   * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
   * @type {number}
   */
  get weeksInLocalWeekYear() {
    return this.isValid
      ? weeksInWeekYear(
          this.localWeekYear,
          this.loc.getMinDaysInFirstWeek(),
          this.loc.getStartOfWeek()
        )
      : NaN;
  }

  /**
   * Returns the resolved Intl options for this DateTime.
   * This is useful in understanding the behavior of formatting methods
   * @param {Object} opts - the same options as toLocaleString
   * @return {Object}
   */
  resolvedLocaleOptions(opts = {}) {
    const { locale, numberingSystem, calendar } = Formatter.create(
      this.loc.clone(opts),
      opts
    ).resolvedOptions(this);
    return { locale, numberingSystem, outputCalendar: calendar };
  }

  // TRANSFORM

  /**
   * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
   *
   * Equivalent to {@link DateTime#setZone}('utc')
   * @param {number} [offset=0] - optionally, an offset from UTC in minutes
   * @param {Object} [opts={}] - options to pass to `setZone()`
   * @return {DateTime}
   */
  toUTC(offset = 0, opts = {}) {
    return this.setZone(FixedOffsetZone.instance(offset), opts);
  }

  /**
   * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
   *
   * Equivalent to `setZone('local')`
   * @return {DateTime}
   */
  toLocal() {
    return this.setZone(Settings.defaultZone);
  }

  /**
   * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
   *
   * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link DateTime#plus}. You may wish to use {@link DateTime#toLocal} and {@link DateTime#toUTC} which provide simple convenience wrappers for commonly used zones.
   * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link DateTime#Zone} class.
   * @param {Object} opts - options
   * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
   * @return {DateTime}
   */
  setZone(zone, { keepLocalTime = false, keepCalendarTime = false } = {}) {
    zone = normalizeZone(zone, Settings.defaultZone);
    if (zone.equals(this.zone)) {
      return this;
    } else if (!zone.isValid) {
      return DateTime.invalid(unsupportedZone(zone));
    } else {
      let newTS = this.ts;
      if (keepLocalTime || keepCalendarTime) {
        const offsetGuess = zone.offset(this.ts);
        const asObj = this.toObject();
        [newTS] = objToTS(asObj, offsetGuess, zone);
      }
      return clone(this, { ts: newTS, zone });
    }
  }

  /**
   * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
   * @param {Object} properties - the properties to set
   * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
   * @return {DateTime}
   */
  reconfigure({ locale, numberingSystem, outputCalendar } = {}) {
    const loc = this.loc.clone({ locale, numberingSystem, outputCalendar });
    return clone(this, { loc });
  }

  /**
   * "Set" the locale. Returns a newly-constructed DateTime.
   * Just a convenient alias for reconfigure({ locale })
   * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
   * @return {DateTime}
   */
  setLocale(locale) {
    return this.reconfigure({ locale });
  }

  /**
   * "Set" the values of specified units. Returns a newly-constructed DateTime.
   * You can only set units with this method; for "setting" metadata, see {@link DateTime#reconfigure} and {@link DateTime#setZone}.
   *
   * This method also supports setting locale-based week units, i.e. `localWeekday`, `localWeekNumber` and `localWeekYear`.
   * They cannot be mixed with ISO-week units like `weekday`.
   * @param {Object} values - a mapping of units to numbers
   * @example dt.set({ year: 2017 })
   * @example dt.set({ hour: 8, minute: 30 })
   * @example dt.set({ weekday: 5 })
   * @example dt.set({ year: 2005, ordinal: 234 })
   * @return {DateTime}
   */
  set(values) {
    if (!this.isValid) return this;

    const normalized = normalizeObject(values, normalizeUnitWithLocalWeeks);
    const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, this.loc);

    const settingWeekStuff =
        !isUndefined(normalized.weekYear) ||
        !isUndefined(normalized.weekNumber) ||
        !isUndefined(normalized.weekday),
      containsOrdinal = !isUndefined(normalized.ordinal),
      containsGregorYear = !isUndefined(normalized.year),
      containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day),
      containsGregor = containsGregorYear || containsGregorMD,
      definiteWeekDef = normalized.weekYear || normalized.weekNumber;

    if ((containsGregor || containsOrdinal) && definiteWeekDef) {
      throw new ConflictingSpecificationError(
        "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
      );
    }

    if (containsGregorMD && containsOrdinal) {
      throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
    }

    let mixed;
    if (settingWeekStuff) {
      mixed = weekToGregorian(
        { ...gregorianToWeek(this.c, minDaysInFirstWeek, startOfWeek), ...normalized },
        minDaysInFirstWeek,
        startOfWeek
      );
    } else if (!isUndefined(normalized.ordinal)) {
      mixed = ordinalToGregorian({ ...gregorianToOrdinal(this.c), ...normalized });
    } else {
      mixed = { ...this.toObject(), ...normalized };

      // if we didn't set the day but we ended up on an overflow date,
      // use the last day of the right month
      if (isUndefined(normalized.day)) {
        mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
      }
    }

    const [ts, o] = objToTS(mixed, this.o, this.zone);
    return clone(this, { ts, o });
  }

  /**
   * Add a period of time to this DateTime and return the resulting DateTime
   *
   * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
   * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   * @example DateTime.now().plus(123) //~> in 123 milliseconds
   * @example DateTime.now().plus({ minutes: 15 }) //~> in 15 minutes
   * @example DateTime.now().plus({ days: 1 }) //~> this time tomorrow
   * @example DateTime.now().plus({ days: -1 }) //~> this time yesterday
   * @example DateTime.now().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
   * @example DateTime.now().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
   * @return {DateTime}
   */
  plus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration);
    return clone(this, adjustTime(this, dur));
  }

  /**
   * Subtract a period of time to this DateTime and return the resulting DateTime
   * See {@link DateTime#plus}
   * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
   @return {DateTime}
   */
  minus(duration) {
    if (!this.isValid) return this;
    const dur = Duration.fromDurationLike(duration).negate();
    return clone(this, adjustTime(this, dur));
  }

  /**
   * "Set" this DateTime to the beginning of a unit of time.
   * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
   * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
   * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
   * @example DateTime.local(2014, 3, 3).startOf('week').toISODate(); //=> '2014-03-03', weeks always start on Mondays
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
   * @return {DateTime}
   */
  startOf(unit, { useLocaleWeeks = false } = {}) {
    if (!this.isValid) return this;

    const o = {},
      normalizedUnit = Duration.normalizeUnit(unit);
    switch (normalizedUnit) {
      case "years":
        o.month = 1;
      // falls through
      case "quarters":
      case "months":
        o.day = 1;
      // falls through
      case "weeks":
      case "days":
        o.hour = 0;
      // falls through
      case "hours":
        o.minute = 0;
      // falls through
      case "minutes":
        o.second = 0;
      // falls through
      case "seconds":
        o.millisecond = 0;
        break;
      // no default, invalid units throw in normalizeUnit()
    }

    if (normalizedUnit === "weeks") {
      if (useLocaleWeeks) {
        const startOfWeek = this.loc.getStartOfWeek();
        const { weekday } = this;
        if (weekday < startOfWeek) {
          o.weekNumber = this.weekNumber - 1;
        }
        o.weekday = startOfWeek;
      } else {
        o.weekday = 1;
      }
    }

    if (normalizedUnit === "quarters") {
      const q = Math.ceil(this.month / 3);
      o.month = (q - 1) * 3 + 1;
    }

    return this.set(o);
  }

  /**
   * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
   * @param {string} unit - The unit to go to the end of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
   * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3).endOf('week').toISO(); // => '2014-03-09T23:59:59.999-05:00', weeks start on Mondays
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
   * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
   * @return {DateTime}
   */
  endOf(unit, opts) {
    return this.isValid
      ? this.plus({ [unit]: 1 })
          .startOf(unit, opts)
          .minus(1)
      : this;
  }

  // OUTPUT

  /**
   * Returns a string representation of this DateTime formatted according to the specified format string.
   * **You may not want this.** See {@link DateTime#toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
   * Defaults to en-US if no locale has been specified, regardless of the system's locale.
   * @param {string} fmt - the format string
   * @param {Object} opts - opts to override the configuration options on this DateTime
   * @example DateTime.now().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
   * @example DateTime.now().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
   * @example DateTime.now().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
   * @example DateTime.now().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
   * @return {string}
   */
  toFormat(fmt, opts = {}) {
    return this.isValid
      ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt)
      : INVALID;
  }

  /**
   * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
   * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
   * of the DateTime in the assigned locale.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
   * @param formatOpts {Object} - Intl.DateTimeFormat constructor options and configuration options
   * @param {Object} opts - opts to override the configuration options on this DateTime
   * @example DateTime.now().toLocaleString(); //=> 4/20/2017
   * @example DateTime.now().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
   * @example DateTime.now().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
   * @example DateTime.now().toLocaleString(DateTime.DATE_FULL, { locale: 'fr' }); //=> '28 août 2022'
   * @example DateTime.now().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
   * @example DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
   * @example DateTime.now().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
   * @example DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
   * @example DateTime.now().toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); //=> '11:32'
   * @return {string}
   */
  toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
    return this.isValid
      ? Formatter.create(this.loc.clone(opts), formatOpts).formatDateTime(this)
      : INVALID;
  }

  /**
   * Returns an array of format "parts", meaning individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
   * Defaults to the system's locale if no locale has been specified
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
   * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
   * @example DateTime.now().toLocaleParts(); //=> [
   *                                   //=>   { type: 'day', value: '25' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'month', value: '05' },
   *                                   //=>   { type: 'literal', value: '/' },
   *                                   //=>   { type: 'year', value: '1982' }
   *                                   //=> ]
   */
  toLocaleParts(opts = {}) {
    return this.isValid
      ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this)
      : [];
  }

  /**
   * Returns an ISO 8601-compliant string representation of this DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=false] - add the time zone format extension
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @param {string} [opts.precision='milliseconds'] - truncate output to desired presicion: 'years', 'months', 'days', 'hours', 'minutes', 'seconds' or 'milliseconds'. When precision and suppressSeconds or suppressMilliseconds are used together, precision sets the maximum unit shown in the output, however seconds or milliseconds will still be suppressed if they are 0.
   * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
   * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
   * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
   * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
   * @example DateTime.now().toISO({ precision: 'day' }) //=> '2017-04-22Z'
   * @example DateTime.now().toISO({ precision: 'minute' }) //=> '2017-04-22T20:47Z'
   * @return {string|null}
   */
  toISO({
    format = "extended",
    suppressSeconds = false,
    suppressMilliseconds = false,
    includeOffset = true,
    extendedZone = false,
    precision = "milliseconds",
  } = {}) {
    if (!this.isValid) {
      return null;
    }

    precision = normalizeUnit(precision);
    const ext = format === "extended";

    let c = toISODate(this, ext, precision);
    if (orderedUnits.indexOf(precision) >= 3) c += "T";
    c += toISOTime(
      this,
      ext,
      suppressSeconds,
      suppressMilliseconds,
      includeOffset,
      extendedZone,
      precision
    );
    return c;
  }

  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's date component
   * @param {Object} opts - options
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @param {string} [opts.precision='day'] - truncate output to desired precision: 'years', 'months', or 'days'.
   * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
   * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
   * @example DateTime.utc(1982, 5, 25).toISODate({ precision: 'month' }) //=> '1982-05'
   * @return {string|null}
   */
  toISODate({ format = "extended", precision = "day" } = {}) {
    if (!this.isValid) {
      return null;
    }
    return toISODate(this, format === "extended", normalizeUnit(precision));
  }

  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's week date
   * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
   * @return {string}
   */
  toISOWeekDate() {
    return toTechFormat(this, "kkkk-'W'WW-c");
  }

  /**
   * Returns an ISO 8601-compliant string representation of this DateTime's time component
   * @param {Object} opts - options
   * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
   * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.extendedZone=true] - add the time zone format extension
   * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
   * @param {string} [opts.format='extended'] - choose between the basic and extended format
   * @param {string} [opts.precision='milliseconds'] - truncate output to desired presicion: 'hours', 'minutes', 'seconds' or 'milliseconds'. When precision and suppressSeconds or suppressMilliseconds are used together, precision sets the maximum unit shown in the output, however seconds or milliseconds will still be suppressed if they are 0.
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
   * @example DateTime.utc().set({ hour: 7, minute: 34, second: 56 }).toISOTime({ precision: 'minute' }) //=> '07:34Z'
   * @return {string}
   */
  toISOTime({
    suppressMilliseconds = false,
    suppressSeconds = false,
    includeOffset = true,
    includePrefix = false,
    extendedZone = false,
    format = "extended",
    precision = "milliseconds",
  } = {}) {
    if (!this.isValid) {
      return null;
    }

    precision = normalizeUnit(precision);
    let c = includePrefix && orderedUnits.indexOf(precision) >= 3 ? "T" : "";
    return (
      c +
      toISOTime(
        this,
        format === "extended",
        suppressSeconds,
        suppressMilliseconds,
        includeOffset,
        extendedZone,
        precision
      )
    );
  }

  /**
   * Returns an RFC 2822-compatible string representation of this DateTime
   * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
   * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
   * @return {string}
   */
  toRFC2822() {
    return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
  }

  /**
   * Returns a string representation of this DateTime appropriate for use in HTTP headers. The output is always expressed in GMT.
   * Specifically, the string conforms to RFC 1123.
   * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
   * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
   * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
   * @return {string}
   */
  toHTTP() {
    return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
  }

  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Date
   * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
   * @return {string|null}
   */
  toSQLDate() {
    if (!this.isValid) {
      return null;
    }
    return toISODate(this, true);
  }

  /**
   * Returns a string representation of this DateTime appropriate for use in SQL Time
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
   * @example DateTime.utc().toSQL() //=> '05:15:16.345'
   * @example DateTime.now().toSQL() //=> '05:15:16.345 -04:00'
   * @example DateTime.now().toSQL({ includeOffset: false }) //=> '05:15:16.345'
   * @example DateTime.now().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
   * @return {string}
   */
  toSQLTime({ includeOffset = true, includeZone = false, includeOffsetSpace = true } = {}) {
    let fmt = "HH:mm:ss.SSS";

    if (includeZone || includeOffset) {
      if (includeOffsetSpace) {
        fmt += " ";
      }
      if (includeZone) {
        fmt += "z";
      } else if (includeOffset) {
        fmt += "ZZ";
      }
    }

    return toTechFormat(this, fmt, true);
  }

  /**
   * Returns a string representation of this DateTime appropriate for use in SQL DateTime
   * @param {Object} opts - options
   * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
   * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
   * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
   * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
   * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
   * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
   * @return {string}
   */
  toSQL(opts = {}) {
    if (!this.isValid) {
      return null;
    }

    return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
  }

  /**
   * Returns a string representation of this DateTime appropriate for debugging
   * @return {string}
   */
  toString() {
    return this.isValid ? this.toISO() : INVALID;
  }

  /**
   * Returns a string representation of this DateTime appropriate for the REPL.
   * @return {string}
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid) {
      return `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`;
    } else {
      return `DateTime { Invalid, reason: ${this.invalidReason} }`;
    }
  }

  /**
   * Returns the epoch milliseconds of this DateTime. Alias of {@link DateTime#toMillis}
   * @return {number}
   */
  valueOf() {
    return this.toMillis();
  }

  /**
   * Returns the epoch milliseconds of this DateTime.
   * @return {number}
   */
  toMillis() {
    return this.isValid ? this.ts : NaN;
  }

  /**
   * Returns the epoch seconds (including milliseconds in the fractional part) of this DateTime.
   * @return {number}
   */
  toSeconds() {
    return this.isValid ? this.ts / 1000 : NaN;
  }

  /**
   * Returns the epoch seconds (as a whole number) of this DateTime.
   * @return {number}
   */
  toUnixInteger() {
    return this.isValid ? Math.floor(this.ts / 1000) : NaN;
  }

  /**
   * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
   * @return {string}
   */
  toJSON() {
    return this.toISO();
  }

  /**
   * Returns a BSON serializable equivalent to this DateTime.
   * @return {Date}
   */
  toBSON() {
    return this.toJSDate();
  }

  /**
   * Returns a JavaScript object with this DateTime's year, month, day, and so on.
   * @param opts - options for generating the object
   * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
   * @example DateTime.now().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
   * @return {Object}
   */
  toObject(opts = {}) {
    if (!this.isValid) return {};

    const base = { ...this.c };

    if (opts.includeConfig) {
      base.outputCalendar = this.outputCalendar;
      base.numberingSystem = this.loc.numberingSystem;
      base.locale = this.loc.locale;
    }
    return base;
  }

  /**
   * Returns a JavaScript Date equivalent to this DateTime.
   * @return {Date}
   */
  toJSDate() {
    return new Date(this.isValid ? this.ts : NaN);
  }

  // COMPARE

  /**
   * Return the difference between two DateTimes as a Duration.
   * @param {DateTime} otherDateTime - the DateTime to compare this one to
   * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @example
   * var i1 = DateTime.fromISO('1982-05-25T09:45'),
   *     i2 = DateTime.fromISO('1983-10-14T10:30');
   * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
   * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
   * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
   * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
   * @return {Duration}
   */
  diff(otherDateTime, unit = "milliseconds", opts = {}) {
    if (!this.isValid || !otherDateTime.isValid) {
      return Duration.invalid("created by diffing an invalid DateTime");
    }

    const durOpts = { locale: this.locale, numberingSystem: this.numberingSystem, ...opts };

    const units = maybeArray(unit).map(Duration.normalizeUnit),
      otherIsLater = otherDateTime.valueOf() > this.valueOf(),
      earlier = otherIsLater ? this : otherDateTime,
      later = otherIsLater ? otherDateTime : this,
      diffed = diff(earlier, later, units, durOpts);

    return otherIsLater ? diffed.negate() : diffed;
  }

  /**
   * Return the difference between this DateTime and right now.
   * See {@link DateTime#diff}
   * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
   * @param {Object} opts - options that affect the creation of the Duration
   * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
   * @return {Duration}
   */
  diffNow(unit = "milliseconds", opts = {}) {
    return this.diff(DateTime.now(), unit, opts);
  }

  /**
   * Return an Interval spanning between this DateTime and another DateTime
   * @param {DateTime} otherDateTime - the other end point of the Interval
   * @return {Interval|DateTime}
   */
  until(otherDateTime) {
    return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
  }

  /**
   * Return whether this DateTime is in the same unit of time as another DateTime.
   * Higher-order units must also be identical for this function to return `true`.
   * Note that time zones are **ignored** in this comparison, which compares the **local** calendar time. Use {@link DateTime#setZone} to convert one of the dates if needed.
   * @param {DateTime} otherDateTime - the other DateTime
   * @param {string} unit - the unit of time to check sameness on
   * @param {Object} opts - options
   * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; only the locale of this DateTime is used
   * @example DateTime.now().hasSame(otherDT, 'day'); //~> true if otherDT is in the same current calendar day
   * @return {boolean}
   */
  hasSame(otherDateTime, unit, opts) {
    if (!this.isValid) return false;

    const inputMs = otherDateTime.valueOf();
    const adjustedToZone = this.setZone(otherDateTime.zone, { keepLocalTime: true });
    return (
      adjustedToZone.startOf(unit, opts) <= inputMs && inputMs <= adjustedToZone.endOf(unit, opts)
    );
  }

  /**
   * Equality check
   * Two DateTimes are equal if and only if they represent the same millisecond, have the same zone and location, and are both valid.
   * To compare just the millisecond values, use `+dt1 === +dt2`.
   * @param {DateTime} other - the other DateTime
   * @return {boolean}
   */
  equals(other) {
    return (
      this.isValid &&
      other.isValid &&
      this.valueOf() === other.valueOf() &&
      this.zone.equals(other.zone) &&
      this.loc.equals(other.loc)
    );
  }

  /**
   * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
   * platform supports Intl.RelativeTimeFormat. Rounds towards zero by default.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
   * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
   * @param {boolean} [options.round=true] - whether to round the numbers in the output.
   * @param {string} [options.rounding="trunc"] - rounding method to use when rounding the numbers in the output. Can be "trunc" (toward zero), "expand" (away from zero), "round", "floor", or "ceil".
   * @param {number} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.now().plus({ days: 1 }).toRelative() //=> "in 1 day"
   * @example DateTime.now().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
   * @example DateTime.now().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
   * @example DateTime.now().minus({ days: 2 }).toRelative() //=> "2 days ago"
   * @example DateTime.now().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
   * @example DateTime.now().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
   */
  toRelative(options = {}) {
    if (!this.isValid) return null;
    const base = options.base || DateTime.fromObject({}, { zone: this.zone }),
      padding = options.padding ? (this < base ? -options.padding : options.padding) : 0;
    let units = ["years", "months", "days", "hours", "minutes", "seconds"];
    let unit = options.unit;
    if (Array.isArray(options.unit)) {
      units = options.unit;
      unit = undefined;
    }
    return diffRelative(base, this.plus(padding), {
      ...options,
      numeric: "always",
      units,
      unit,
    });
  }

  /**
   * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
   * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
   * @param {Object} options - options that affect the output
   * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
   * @param {string} options.locale - override the locale of this DateTime
   * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
   * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
   * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
   * @example DateTime.now().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
   * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
   * @example DateTime.now().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
   */
  toRelativeCalendar(options = {}) {
    if (!this.isValid) return null;

    return diffRelative(options.base || DateTime.fromObject({}, { zone: this.zone }), this, {
      ...options,
      numeric: "auto",
      units: ["years", "months", "days"],
      calendary: true,
    });
  }

  /**
   * Return the min of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
   * @return {DateTime} the min DateTime, or undefined if called with no argument
   */
  static min(...dateTimes) {
    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError("min requires all arguments be DateTimes");
    }
    return bestBy(dateTimes, (i) => i.valueOf(), Math.min);
  }

  /**
   * Return the max of several date times
   * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
   * @return {DateTime} the max DateTime, or undefined if called with no argument
   */
  static max(...dateTimes) {
    if (!dateTimes.every(DateTime.isDateTime)) {
      throw new InvalidArgumentError("max requires all arguments be DateTimes");
    }
    return bestBy(dateTimes, (i) => i.valueOf(), Math.max);
  }

  // MISC

  /**
   * Explain how a string would be parsed by fromFormat()
   * @param {string} text - the string to parse
   * @param {string} fmt - the format the string is expected to be in (see description)
   * @param {Object} options - options taken by fromFormat()
   * @return {Object}
   */
  static fromFormatExplain(text, fmt, options = {}) {
    const { locale = null, numberingSystem = null } = options,
      localeToUse = Locale.fromOpts({
        locale,
        numberingSystem,
        defaultToEN: true,
      });
    return explainFromTokens(localeToUse, text, fmt);
  }

  /**
   * @deprecated use fromFormatExplain instead
   */
  static fromStringExplain(text, fmt, options = {}) {
    return DateTime.fromFormatExplain(text, fmt, options);
  }

  /**
   * Build a parser for `fmt` using the given locale. This parser can be passed
   * to {@link DateTime.fromFormatParser} to a parse a date in this format. This
   * can be used to optimize cases where many dates need to be parsed in a
   * specific format.
   *
   * @param {String} fmt - the format the string is expected to be in (see
   * description)
   * @param {Object} options - options used to set locale and numberingSystem
   * for parser
   * @returns {TokenParser} - opaque object to be used
   */
  static buildFormatParser(fmt, options = {}) {
    const { locale = null, numberingSystem = null } = options,
      localeToUse = Locale.fromOpts({
        locale,
        numberingSystem,
        defaultToEN: true,
      });
    return new TokenParser(localeToUse, fmt);
  }

  /**
   * Create a DateTime from an input string and format parser.
   *
   * The format parser must have been created with the same locale as this call.
   *
   * @param {String} text - the string to parse
   * @param {TokenParser} formatParser - parser from {@link DateTime.buildFormatParser}
   * @param {Object} opts - options taken by fromFormat()
   * @returns {DateTime}
   */
  static fromFormatParser(text, formatParser, opts = {}) {
    if (isUndefined(text) || isUndefined(formatParser)) {
      throw new InvalidArgumentError(
        "fromFormatParser requires an input string and a format parser"
      );
    }
    const { locale = null, numberingSystem = null } = opts,
      localeToUse = Locale.fromOpts({
        locale,
        numberingSystem,
        defaultToEN: true,
      });

    if (!localeToUse.equals(formatParser.locale)) {
      throw new InvalidArgumentError(
        `fromFormatParser called with a locale of ${localeToUse}, ` +
          `but the format parser was created for ${formatParser.locale}`
      );
    }

    const { result, zone, specificOffset, invalidReason } = formatParser.explainFromTokens(text);

    if (invalidReason) {
      return DateTime.invalid(invalidReason);
    } else {
      return parseDataToDateTime(
        result,
        zone,
        opts,
        `format ${formatParser.format}`,
        text,
        specificOffset
      );
    }
  }

  // FORMAT PRESETS

  /**
   * {@link DateTime#toLocaleString} format like 10/14/1983
   * @type {Object}
   */
  static get DATE_SHORT() {
    return DATE_SHORT;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED() {
    return DATE_MED;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
   * @type {Object}
   */
  static get DATE_MED_WITH_WEEKDAY() {
    return DATE_MED_WITH_WEEKDAY;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983'
   * @type {Object}
   */
  static get DATE_FULL() {
    return DATE_FULL;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
   * @type {Object}
   */
  static get DATE_HUGE() {
    return DATE_HUGE;
  }

  /**
   * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_SIMPLE() {
    return TIME_SIMPLE;
  }

  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SECONDS() {
    return TIME_WITH_SECONDS;
  }

  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_SHORT_OFFSET() {
    return TIME_WITH_SHORT_OFFSET;
  }

  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get TIME_WITH_LONG_OFFSET() {
    return TIME_WITH_LONG_OFFSET;
  }

  /**
   * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_SIMPLE() {
    return TIME_24_SIMPLE;
  }

  /**
   * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SECONDS() {
    return TIME_24_WITH_SECONDS;
  }

  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_SHORT_OFFSET() {
    return TIME_24_WITH_SHORT_OFFSET;
  }

  /**
   * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
   * @type {Object}
   */
  static get TIME_24_WITH_LONG_OFFSET() {
    return TIME_24_WITH_LONG_OFFSET;
  }

  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT() {
    return DATETIME_SHORT;
  }

  /**
   * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_SHORT_WITH_SECONDS() {
    return DATETIME_SHORT_WITH_SECONDS;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED() {
    return DATETIME_MED;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_SECONDS() {
    return DATETIME_MED_WITH_SECONDS;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_MED_WITH_WEEKDAY() {
    return DATETIME_MED_WITH_WEEKDAY;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL() {
    return DATETIME_FULL;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_FULL_WITH_SECONDS() {
    return DATETIME_FULL_WITH_SECONDS;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE() {
    return DATETIME_HUGE;
  }

  /**
   * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
   * @type {Object}
   */
  static get DATETIME_HUGE_WITH_SECONDS() {
    return DATETIME_HUGE_WITH_SECONDS;
  }
}

/**
 * @private
 */
function friendlyDateTime(dateTimeish) {
  if (DateTime.isDateTime(dateTimeish)) {
    return dateTimeish;
  } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
    return DateTime.fromJSDate(dateTimeish);
  } else if (dateTimeish && typeof dateTimeish === "object") {
    return DateTime.fromObject(dateTimeish);
  } else {
    throw new InvalidArgumentError(
      `Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`
    );
  }
}

const ORDER_DUE = ["hasDue", "day", "allDay", "slot", "negPr", "alpha", "id"];
const ORDER_PRIO = ["negPr", "hasDue", "day", "allDay", "slot", "alpha", "id"];
const ORDER_ALPHA = ["alpha", "hasDue", "day", "allDay", "slot", "negPr", "id"];
function toRow(task, timezone) {
    const due = task?.due;
    let hasDue = 1;
    let day = Number.POSITIVE_INFINITY;
    let allDay = 1;
    let slot = Number.POSITIVE_INFINITY;
    if (due?.datetime) {
        const dt = DateTime.fromISO(due.datetime).setZone(timezone);
        if (dt.isValid) {
            hasDue = 0;
            allDay = 0;
            day = dt.startOf("day").toMillis();
            slot = dt.toMillis();
        }
    }
    else if (due?.date) {
        const dt = DateTime.fromISO(due.date, { zone: timezone });
        if (dt.isValid) {
            hasDue = 0;
            allDay = 1;
            day = dt.startOf("day").toMillis();
            slot = dt.endOf("day").toMillis();
        }
    }
    return {
        t: task,
        id: String(task?.id ?? ""),
        hasDue,
        day,
        allDay,
        slot,
        negPr: -(Number(task?.priority) || 0),
        alpha: String(task?.content || "").toLowerCase(),
    };
}
function compareBy(order) {
    return (a, b) => {
        for (const key of order) {
            if (key === "t")
                continue;
            if (key === "alpha") {
                const result = a.alpha.localeCompare(b.alpha, undefined, {
                    numeric: true,
                    sensitivity: "base",
                });
                if (result)
                    return result;
            }
            else if (key === "id") {
                const result = a.id.localeCompare(b.id);
                if (result)
                    return result;
            }
            else {
                const left = a[key];
                const right = b[key];
                if (left !== right)
                    return left - right;
            }
        }
        return 0;
    };
}
function normalizeSortMode(mode) {
    if (mode === "Priority" || mode === "Alphabetical" || mode === "Manual")
        return mode;
    return "Due Date";
}
function sortTasksLikeTodoist(tasks, mode, timezone) {
    const normalized = normalizeSortMode(mode);
    if (normalized === "Manual")
        return tasks.slice();
    const rows = (tasks || []).map((task) => toRow(task, timezone));
    if (normalized === "Priority")
        rows.sort(compareBy(ORDER_PRIO));
    else if (normalized === "Alphabetical")
        rows.sort(compareBy(ORDER_ALPHA));
    else
        rows.sort(compareBy(ORDER_DUE));
    return rows.map((row) => row.t);
}
function buildRenderInput(args) {
    const mode = normalizeSortMode(args.mode);
    const base = Array.isArray(args.base) ? args.base.slice() : [];
    return {
        mode,
        viewTasks: mode === "Manual" ? base : sortTasksLikeTodoist(base, mode, args.timezone),
        projects: Array.isArray(args.projects) ? args.projects : [],
        labels: Array.isArray(args.labels) ? args.labels : [],
    };
}

const V2_PREFIX = "todoistBoard:v2";
function readJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        if (value === null || value === undefined)
            return fallback;
        return JSON.parse(value);
    }
    catch {
        return fallback;
    }
}
function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch {
        // localStorage can be full or blocked.
    }
}
const hiddenKey = () => {
    try {
        const vaultName = window?.app?.vault?.getName?.();
        return `todoistHiddenTasks:${vaultName ?? "default"}`;
    }
    catch {
        return "todoistHiddenTasks:default";
    }
};
const inlineCompactKey = (path, filterKey) => {
    return `todoistInlineCompact:${path || "__unknown__"}:${String(filterKey)}`;
};
const getHiddenSet = () => {
    return new Set(readJSON(hiddenKey(), []));
};
const saveHiddenSet = (tasks) => {
    writeJSON(hiddenKey(), Array.from(tasks));
};
const getInlineCompact = (path, filterKey) => {
    return !!readJSON(inlineCompactKey(path, filterKey), false);
};
const setInlineCompact = (path, filterKey, on) => {
    try {
        writeJSON(inlineCompactKey(path, filterKey), !!on);
    }
    catch { }
};
class TodoistBoardStorage {
    constructor(appOrPrefix, prefix = V2_PREFIX) {
        if (typeof appOrPrefix === "string") {
            this.prefix = appOrPrefix;
        }
        else {
            this.app = appOrPrefix;
            this.prefix = prefix;
        }
    }
    key(name) {
        return `${this.prefix}:${name}`;
    }
    loadValue(key, fallback) {
        try {
            const value = this.app?.loadLocalStorage?.(key);
            if (value !== null && value !== undefined)
                return value;
        }
        catch {
            // Fall back to legacy global localStorage below.
        }
        return readJSON(key, fallback);
    }
    loadString(key, fallback = "") {
        try {
            const value = this.app?.loadLocalStorage?.(key);
            if (value !== null && value !== undefined)
                return String(value);
        }
        catch {
            // Fall back to legacy global localStorage below.
        }
        try {
            return localStorage.getItem(key) ?? fallback;
        }
        catch {
            return fallback;
        }
    }
    saveValue(key, value) {
        try {
            this.app?.saveLocalStorage?.(key, value);
            return;
        }
        catch {
            // Fall back to legacy global localStorage below.
        }
        writeJSON(key, value);
    }
    saveString(key, value) {
        try {
            this.app?.saveLocalStorage?.(key, value);
            return;
        }
        catch {
            // Fall back to legacy global localStorage below.
        }
        try {
            localStorage.setItem(key, value);
        }
        catch {
            // Ignore storage failures.
        }
    }
    loadTaskSnapshot(filterKeys = []) {
        const snapshot = this.loadValue(this.key("tasks"), {
            tasksById: {},
            filterIndex: {},
            taskCache: {},
            timestamps: {},
        });
        if (Object.keys(snapshot.tasksById || {}).length > 0) {
            return this.normalizeSnapshot(snapshot);
        }
        return this.loadLegacyTaskSnapshot(filterKeys);
    }
    saveTaskSnapshot(snapshot) {
        this.saveValue(this.key("tasks"), this.normalizeSnapshot(snapshot));
    }
    loadLegacyTaskSnapshot(filterKeys = []) {
        const tasksById = this.loadValue("todoistTaskStore", {});
        const filterIndex = {};
        const taskCache = {};
        const timestamps = {};
        for (const filterKey of filterKeys) {
            const ids = this.loadValue(`todoistFilterIndex:${filterKey}`, []);
            const cached = this.loadValue(`todoistTasksCache:${filterKey}`, []);
            const timestamp = Number(this.loadString(`todoistTasksCacheTimestamp:${filterKey}`, "0"));
            if (ids.length)
                filterIndex[filterKey] = ids.map(String);
            if (Array.isArray(cached) && cached.length) {
                taskCache[filterKey] = cached;
                filterIndex[filterKey] = cached.map((task) => String(task?.id ?? "")).filter(Boolean);
                for (const task of cached) {
                    const id = String(task?.id ?? "");
                    if (id && !tasksById[id])
                        tasksById[id] = task;
                }
            }
            if (timestamp)
                timestamps[filterKey] = timestamp;
        }
        return this.normalizeSnapshot({ tasksById, filterIndex, taskCache, timestamps });
    }
    saveLegacyFilterCache(filterKey, tasks, ids, timestamp = Date.now()) {
        const snapshot = this.loadTaskSnapshot([filterKey]);
        snapshot.filterIndex[filterKey] = ids.map(String);
        snapshot.taskCache[filterKey] = Array.isArray(tasks) ? tasks : [];
        snapshot.timestamps[filterKey] = timestamp;
        for (const task of Array.isArray(tasks) ? tasks : []) {
            const id = String(task?.id ?? "");
            if (id)
                snapshot.tasksById[id] = task;
        }
        this.saveTaskSnapshot(snapshot);
    }
    saveLegacyTaskStore(tasksById) {
        const snapshot = this.loadTaskSnapshot();
        snapshot.tasksById = { ...snapshot.tasksById, ...tasksById };
        this.saveTaskSnapshot(snapshot);
    }
    loadMetadata() {
        const metadata = this.loadValue(this.key("metadata"), {
            projects: [],
            sections: [],
            labels: [],
        });
        if (metadata.projects.length || metadata.labels.length) {
            return {
                projects: metadata.projects || [],
                sections: metadata.sections || [],
                labels: metadata.labels || [],
            };
        }
        return {
            projects: this.loadValue("todoistProjectsCache", []),
            sections: [],
            labels: this.loadValue("todoistLabelsCache", []),
        };
    }
    saveMetadata(metadata, timestamp = Date.now()) {
        this.saveValue(this.key("metadata"), metadata);
        this.saveString(this.key("metadataTimestamp"), String(timestamp));
    }
    getMetadataTimestamp() {
        return Number(this.loadString(this.key("metadataTimestamp"))
            || this.loadString("todoistProjectsCacheTimestamp")
            || "0");
    }
    getSortMode(filterKey) {
        return normalizeSortMode(this.loadString(this.key(`sort:${filterKey}`))
            || this.loadString(`todoistSortMode:${filterKey}`));
    }
    setSortMode(filterKey, mode) {
        const normalized = normalizeSortMode(mode);
        this.saveString(this.key(`sort:${filterKey}`), normalized);
    }
    getInlineCompact(path, filterKey) {
        const legacyKey = `todoistInlineCompact:${path || "__unknown__"}:${String(filterKey)}`;
        return Boolean(this.loadValue(this.key(`inlineCompact:${path || "__unknown__"}:${filterKey}`), readJSON(legacyKey, false)));
    }
    setInlineCompact(path, filterKey, on) {
        this.saveValue(this.key(`inlineCompact:${path || "__unknown__"}:${filterKey}`), Boolean(on));
    }
    getHiddenSet(vaultName = "default") {
        const legacy = readJSON(`todoistHiddenTasks:${vaultName}`, []);
        return new Set(this.loadValue(this.key(`hidden:${vaultName}`), legacy));
    }
    saveHiddenSet(ids, vaultName = "default") {
        const values = Array.from(ids);
        this.saveValue(this.key(`hidden:${vaultName}`), values);
    }
    getManualOrder(filterKey) {
        return this.loadValue(this.key(`order:${filterKey}`), readJSON(`todoistBoardOrder:${filterKey}`, []));
    }
    setManualOrder(filterKey, ids) {
        this.saveValue(this.key(`order:${filterKey}`), ids);
    }
    loadTaskCache(filterKey) {
        return this.loadTaskSnapshot([filterKey]).taskCache[String(filterKey)] || [];
    }
    getTaskCacheTimestamp(filterKey) {
        return this.loadTaskSnapshot([filterKey]).timestamps[String(filterKey)] || 0;
    }
    saveTaskCache(filterKey, tasks, timestamp = Date.now()) {
        const ids = (Array.isArray(tasks) ? tasks : [])
            .map((task) => String(task?.id ?? ""))
            .filter(Boolean);
        this.saveLegacyFilterCache(String(filterKey), Array.isArray(tasks) ? tasks : [], ids, timestamp);
    }
    removeTaskCache(filterKey) {
        const snapshot = this.loadTaskSnapshot([filterKey]);
        delete snapshot.filterIndex[String(filterKey)];
        delete snapshot.taskCache[String(filterKey)];
        delete snapshot.timestamps[String(filterKey)];
        this.saveTaskSnapshot(snapshot);
    }
    getTimezone() {
        return this.loadString("todoistTimezone");
    }
    setTimezone(timezone) {
        this.saveString("todoistTimezone", timezone);
    }
    setLastFilter(source) {
        this.saveString("todoistBoardLastFilter", source);
    }
    getCountForFilter(filterKey, memCache = {}) {
        const key = String(filterKey);
        const snapshot = this.loadTaskSnapshot([key]);
        const ids = snapshot.filterIndex[key];
        if (Array.isArray(ids) && ids.length)
            return ids.length;
        const mem = memCache[key];
        if (Array.isArray(mem))
            return mem.length;
        const cached = snapshot.taskCache[key];
        return Array.isArray(cached) ? cached.length : 0;
    }
    clearTaskAndMetadataCaches() {
        const prefixes = [
            this.key("tasks"),
            this.key("metadata"),
            "todoistTaskStore",
            "todoistProjectsCache",
            "todoistLabelsCache",
        ];
        for (const key of prefixes)
            this.remove(key);
        this.remove(this.key("metadataTimestamp"));
        this.saveTaskSnapshot({
            tasksById: {},
            filterIndex: {},
            taskCache: {},
            timestamps: {},
        });
        this.removeMatching((key) => key.startsWith("todoistTasksCache:")
            || key.startsWith("todoistTasksCacheTimestamp:")
            || key.startsWith("todoistFilterIndex:")
            || key.startsWith(`${this.prefix}:sort:`)
            || key.startsWith(`${this.prefix}:order:`));
    }
    removeMatching(predicate) {
        for (let index = localStorage.length - 1; index >= 0; index--) {
            const key = localStorage.key(index) || "";
            if (predicate(key))
                this.remove(key);
        }
    }
    remove(key) {
        try {
            this.app?.saveLocalStorage?.(key, null);
            return;
        }
        catch {
            // Fall back to legacy global localStorage below.
        }
        try {
            localStorage.removeItem(key);
        }
        catch {
            // Ignore storage failures.
        }
    }
    normalizeSnapshot(snapshot) {
        return {
            tasksById: snapshot.tasksById || {},
            filterIndex: snapshot.filterIndex || {},
            taskCache: snapshot.taskCache || {},
            timestamps: snapshot.timestamps || {},
        };
    }
}

class TaskStore {
    constructor(storage) {
        this.storage = storage;
        this.snapshot = {
            tasksById: {},
            filterIndex: {},
            taskCache: {},
            timestamps: {},
        };
    }
    hydrate(filterKeys = []) {
        this.snapshot = this.storage.loadTaskSnapshot(filterKeys);
    }
    get tasksById() {
        return this.snapshot.tasksById;
    }
    get filterIndex() {
        return this.snapshot.filterIndex;
    }
    get taskCache() {
        return this.snapshot.taskCache;
    }
    get timestamps() {
        return this.snapshot.timestamps;
    }
    getSnapshot() {
        return this.snapshot;
    }
    upsert(filterKey, tasks, options = {}) {
        const key = String(filterKey);
        const previousIds = Array.isArray(this.snapshot.filterIndex[key])
            ? this.snapshot.filterIndex[key].slice()
            : [];
        const ids = [];
        const normalizedTasks = [];
        for (const task of Array.isArray(tasks) ? tasks : []) {
            const id = String(task?.id ?? "");
            if (!id)
                continue;
            if (!(options.preferExisting && this.snapshot.tasksById[id])) {
                this.snapshot.tasksById[id] = task;
            }
            ids.push(id);
            normalizedTasks.push(this.snapshot.tasksById[id]);
        }
        this.snapshot.filterIndex[key] = ids;
        this.snapshot.taskCache[key] = normalizedTasks;
        this.snapshot.timestamps[key] = Date.now();
        this.persist();
        const changed = previousIds.length !== ids.length || previousIds.some((id, index) => id !== ids[index]);
        return { changed, ids };
    }
    removeEverywhere(taskId) {
        const id = String(taskId);
        delete this.snapshot.tasksById[id];
        for (const filterKey of Object.keys(this.snapshot.filterIndex)) {
            const ids = (this.snapshot.filterIndex[filterKey] || []).filter((taskIdValue) => taskIdValue !== id);
            this.snapshot.filterIndex[filterKey] = ids;
            this.snapshot.taskCache[filterKey] = ids
                .map((taskIdValue) => this.snapshot.tasksById[taskIdValue])
                .filter(Boolean);
            this.snapshot.timestamps[filterKey] = Date.now();
        }
        this.persist();
    }
    getViewTasks(filterKey) {
        const key = String(filterKey);
        const ids = this.snapshot.filterIndex[key] || [];
        if (ids.length) {
            return ids.map((id) => this.snapshot.tasksById[id]).filter(Boolean);
        }
        const cached = this.snapshot.taskCache[key] || [];
        if (cached.length) {
            this.upsert(key, cached, { preferExisting: true });
            return cached;
        }
        return [];
    }
    getCount(filterKey) {
        const key = String(filterKey);
        const ids = this.snapshot.filterIndex[key];
        if (Array.isArray(ids) && ids.length)
            return ids.length;
        const cached = this.snapshot.taskCache[key];
        return Array.isArray(cached) ? cached.length : 0;
    }
    persist() {
        this.storage.saveTaskSnapshot(this.snapshot);
        this.storage.saveLegacyTaskStore(this.snapshot.tasksById);
        for (const filterKey of Object.keys(this.snapshot.filterIndex)) {
            const ids = this.snapshot.filterIndex[filterKey] || [];
            const tasks = ids.map((id) => this.snapshot.tasksById[id]).filter(Boolean);
            this.storage.saveLegacyFilterCache(filterKey, tasks, ids, this.snapshot.timestamps[filterKey] || Date.now());
        }
    }
}

const API_BASE = "https://api.todoist.com/api/v1";
function normalizeApiToken(apiKey) {
    return String(apiKey || "")
        .trim()
        .replace(/^Bearer\s+/i, "")
        .replace(/^["']|["']$/g, "")
        .trim();
}
function createCommandUuid() {
    try {
        return window.crypto.randomUUID();
    }
    catch {
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
}
function toTodoistUrl(path, query) {
    const url = new URL(`${API_BASE}${path}`);
    for (const [key, value] of Object.entries(query || {})) {
        if (value === undefined || value === null || value === "")
            continue;
        url.searchParams.set(key, String(value));
    }
    return url.toString();
}
function normalizeDue(due) {
    if (!due || typeof due !== "object")
        return due ?? null;
    return {
        ...due,
        isRecurring: due.isRecurring ?? due.is_recurring,
        is_recurring: due.is_recurring ?? due.isRecurring,
    };
}
function normalizeTask(task) {
    return {
        ...task,
        id: String(task?.id ?? ""),
        content: String(task?.content ?? ""),
        url: task?.url ?? (task?.id ? `https://app.todoist.com/app/task/${task.id}` : undefined),
        projectId: task?.projectId ?? task?.project_id,
        sectionId: task?.sectionId ?? task?.section_id ?? null,
        parentId: task?.parentId ?? task?.parent_id ?? null,
        commentCount: task?.commentCount ?? task?.comment_count,
        creatorId: task?.creatorId ?? task?.creator_id,
        addedByUid: task?.addedByUid ?? task?.added_by_uid,
        assignedByUid: task?.assignedByUid ?? task?.assigned_by_uid,
        responsibleUid: task?.responsibleUid ?? task?.responsible_uid,
        assigneeId: task?.assigneeId ?? task?.assignee_id ?? null,
        assignerId: task?.assignerId ?? task?.assigner_id ?? null,
        createdAt: task?.createdAt ?? task?.created_at,
        addedAt: task?.addedAt ?? task?.added_at,
        updatedAt: task?.updatedAt ?? task?.updated_at,
        completedAt: task?.completedAt ?? task?.completed_at,
        completedByUid: task?.completedByUid ?? task?.completed_by_uid,
        isCompleted: task?.isCompleted ?? task?.is_completed,
        isDeleted: task?.isDeleted ?? task?.is_deleted,
        isCollapsed: task?.isCollapsed ?? task?.is_collapsed,
        childOrder: task?.childOrder ?? task?.child_order,
        dayOrder: task?.dayOrder ?? task?.day_order,
        noteCount: task?.noteCount ?? task?.note_count,
        due: normalizeDue(task?.due),
    };
}
function normalizeProject(project) {
    return {
        ...project,
        id: String(project?.id ?? ""),
        name: String(project?.name ?? ""),
        parentId: project?.parentId ?? project?.parent_id ?? null,
        commentCount: project?.commentCount ?? project?.comment_count,
        isShared: project?.isShared ?? project?.is_shared,
        isFavorite: project?.isFavorite ?? project?.is_favorite,
        isInboxProject: project?.isInboxProject ?? project?.is_inbox_project ?? project?.inbox_project,
        isTeamInbox: project?.isTeamInbox ?? project?.is_team_inbox,
        isArchived: project?.isArchived ?? project?.is_archived,
        isDeleted: project?.isDeleted ?? project?.is_deleted,
        isCollapsed: project?.isCollapsed ?? project?.is_collapsed,
        canAssignTasks: project?.canAssignTasks ?? project?.can_assign_tasks,
        canComment: project?.canComment ?? project?.can_comment,
        childOrder: project?.childOrder ?? project?.child_order,
        defaultOrder: project?.defaultOrder ?? project?.default_order,
        createdAt: project?.createdAt ?? project?.created_at,
        updatedAt: project?.updatedAt ?? project?.updated_at,
        viewStyle: project?.viewStyle ?? project?.view_style,
    };
}
function normalizeLabel(label) {
    return {
        ...label,
        id: String(label?.id ?? ""),
        name: String(label?.name ?? ""),
        isFavorite: label?.isFavorite ?? label?.is_favorite,
    };
}
function normalizeSection(section) {
    return {
        ...section,
        id: String(section?.id ?? ""),
        name: String(section?.name ?? ""),
        projectId: section?.projectId ?? section?.project_id,
        sectionOrder: section?.sectionOrder ?? section?.section_order,
        isCollapsed: section?.isCollapsed ?? section?.is_collapsed,
        isArchived: section?.isArchived ?? section?.is_archived,
        isDeleted: section?.isDeleted ?? section?.is_deleted,
        addedAt: section?.addedAt ?? section?.added_at,
        updatedAt: section?.updatedAt ?? section?.updated_at,
        archivedAt: section?.archivedAt ?? section?.archived_at,
    };
}
function toRestTaskPayload(args) {
    const payload = {};
    const copy = (from, to = from) => {
        if (args[from] !== undefined)
            payload[to] = args[from];
    };
    copy("content");
    copy("description");
    copy("labels");
    copy("priority");
    copy("projectId", "project_id");
    copy("project_id");
    copy("sectionId", "section_id");
    copy("section_id");
    copy("parentId", "parent_id");
    copy("parent_id");
    copy("dueString", "due_string");
    copy("due_string");
    copy("dueDate", "due_date");
    copy("due_date");
    copy("dueDatetime", "due_datetime");
    copy("due_datetime");
    copy("dueLang", "due_lang");
    copy("due_lang");
    copy("assigneeId", "assignee_id");
    copy("assignee_id");
    copy("duration");
    copy("durationUnit", "duration_unit");
    copy("duration_unit");
    copy("deadlineDate", "deadline_date");
    copy("deadline_date");
    copy("order");
    copy("childOrder", "child_order");
    copy("child_order");
    copy("isCollapsed", "is_collapsed");
    copy("is_collapsed");
    copy("dayOrder", "day_order");
    copy("day_order");
    return payload;
}
function toSyncTaskArgs(taskId, args) {
    const payload = toRestTaskPayload(args);
    const syncArgs = { id: String(taskId) };
    const copy = (from, to = from) => {
        if (payload[from] !== undefined)
            syncArgs[to] = payload[from];
    };
    copy("content");
    copy("description");
    copy("labels");
    copy("priority");
    copy("duration");
    copy("duration_unit");
    copy("child_order");
    copy("is_collapsed");
    copy("day_order");
    if (payload.due_string !== undefined) {
        syncArgs.due = payload.due_string === null ? null : { string: payload.due_string };
    }
    else if (payload.due_date !== undefined) {
        syncArgs.due = payload.due_date === null ? null : { date: payload.due_date };
    }
    else if (payload.due_datetime !== undefined) {
        syncArgs.due = payload.due_datetime === null ? null : { date: payload.due_datetime };
    }
    if (payload.due_lang !== undefined && syncArgs.due)
        syncArgs.due.lang = payload.due_lang;
    if (payload.deadline_date !== undefined) {
        syncArgs.deadline = payload.deadline_date === null ? null : { date: payload.deadline_date };
    }
    return syncArgs;
}
class TodoistService {
    constructor(apiKey, options = {}) {
        this.options = options;
        this.apiKey = normalizeApiToken(apiKey);
    }
    setApiKey(apiKey) {
        this.apiKey = normalizeApiToken(apiKey);
    }
    getApi() {
        return {
            getTasksByFilter: ({ query }) => this.fetchFilteredTasks(query).then((result) => result.results),
            getProjects: () => this.getProjects(),
            getSections: ({ projectId }) => this.getSections(projectId),
            getLabels: () => this.getLabels(),
            addTask: (args) => this.addTask(args),
            updateTask: (taskId, args) => this.updateTask(taskId, args),
            getTask: (taskId) => this.getTask(taskId),
            getProject: (projectId) => this.getProject(projectId),
            closeTask: (taskId) => this.completeTask(taskId),
            moveTasks: async (taskIds, args) => {
                if (!taskIds.length)
                    return null;
                return this.moveTask(taskIds[0], args.projectId);
            },
        };
    }
    async fetchFilteredTasks(filterKey, options = {}) {
        const key = String(filterKey || "today");
        if (typeof navigator !== "undefined" && !navigator.onLine) {
            return { results: this.getCachedTasks(key), source: "cache" };
        }
        try {
            const response = await this.requestPaginatedPage("/tasks/filter", {
                query: {
                    query: key,
                    limit: options.limit ?? 100,
                    cursor: options.cursor ?? undefined,
                },
            });
            return {
                results: response.results.map(normalizeTask),
                source: "remote",
                nextCursor: response.nextCursor,
                hasMore: Boolean(response.nextCursor),
            };
        }
        catch {
            const cached = this.getCachedTasks(key);
            return { results: cached, source: cached.length ? "cache" : "empty" };
        }
    }
    async fetchMetadata() {
        try {
            const projects = await this.getProjects();
            let sections = [];
            if (projects.length) {
                const grouped = await Promise.all(projects.map(async (project) => {
                    try {
                        return await this.getSections(project.id);
                    }
                    catch {
                        return [];
                    }
                }));
                sections = grouped.flat();
            }
            const labels = await this.getLabels();
            return { projects, sections, labels };
        }
        catch {
            return { projects: [], sections: [], labels: [] };
        }
    }
    async validateApiKey(apiKey) {
        try {
            const response = await obsidian.requestUrl({
                url: `${API_BASE}/sync`,
                method: "POST",
                headers: {
                    Authorization: this.authHeader(apiKey),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    sync_token: "*",
                    resource_types: JSON.stringify(["projects"]),
                }).toString(),
            });
            return response.status === 200;
        }
        catch {
            return false;
        }
    }
    async getProjects() {
        const projects = await this.requestPage("/projects");
        return projects.map(normalizeProject);
    }
    async getSections(projectId) {
        const sections = await this.requestPage("/sections", { query: { project_id: projectId } });
        return sections.map(normalizeSection);
    }
    async getLabels() {
        const labels = await this.requestPage("/labels");
        return labels.map(normalizeLabel);
    }
    async addTask(args) {
        const task = await this.request("/tasks", { method: "POST", body: toRestTaskPayload(args) });
        return normalizeTask(task);
    }
    async updateTask(taskId, args) {
        try {
            const response = await this.request(`/tasks/${encodeURIComponent(String(taskId))}`, {
                method: "POST",
                body: toRestTaskPayload(args),
            });
            return { ok: true, data: response ? normalizeTask(response) : null };
        }
        catch (error) {
            await this.syncUpdateTask(taskId, args);
            return { ok: true, data: null, error };
        }
    }
    async getTask(taskId) {
        return normalizeTask(await this.request(`/tasks/${encodeURIComponent(String(taskId))}`));
    }
    async getProject(projectId) {
        return normalizeProject(await this.request(`/projects/${encodeURIComponent(String(projectId))}`));
    }
    async completeTask(taskId) {
        await this.request(`/tasks/${encodeURIComponent(String(taskId))}/close`, { method: "POST" });
        return { ok: true };
    }
    async moveTask(taskId, projectId) {
        return this.moveTaskREST(taskId, { project_id: String(projectId) });
    }
    async moveTaskREST(taskId, payload) {
        const response = await obsidian.requestUrl({
            url: `${API_BASE}/tasks/${encodeURIComponent(String(taskId))}/move`,
            method: "POST",
            headers: {
                Authorization: this.authHeader(),
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`[Todoist Board] moveTaskREST failed ${response.status}: ${response.text}`);
        }
        const raw = response.text || "";
        return raw ? normalizeTask(JSON.parse(raw)) : null;
    }
    async scheduleTask(taskId, dueStringOrDate) {
        return this.syncUpdateTask(taskId, dueStringOrDate);
    }
    async updatePriority(taskId, priority) {
        return this.syncUpdateTask(taskId, { priority });
    }
    async deleteTask(taskId) {
        return obsidian.requestUrl({
            url: `${API_BASE}/tasks/${encodeURIComponent(String(taskId))}`,
            method: "DELETE",
            headers: {
                Authorization: this.authHeader(),
            },
        });
    }
    async postRestTask(taskId, body) {
        return obsidian.requestUrl({
            url: `${API_BASE}/tasks/${encodeURIComponent(String(taskId))}`,
            method: "POST",
            headers: {
                Authorization: this.authHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(toRestTaskPayload(body)),
        });
    }
    async request(path, options = {}) {
        const response = await obsidian.requestUrl({
            url: toTodoistUrl(path, options.query),
            method: options.method || "GET",
            headers: {
                Authorization: this.authHeader(),
                Accept: "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`[Todoist Board] Todoist request failed ${response.status}: ${response.text}`);
        }
        const raw = response.text || "";
        return raw ? JSON.parse(raw) : undefined;
    }
    async requestPage(path, options = {}) {
        const results = [];
        let cursor = undefined;
        do {
            const query = {
                ...options.query,
                limit: options.query?.limit ?? 200,
                cursor,
            };
            const response = await this.request(path, {
                ...options,
                query,
            });
            if (Array.isArray(response)) {
                results.push(...response);
                return results;
            }
            results.push(...(Array.isArray(response?.results) ? response.results : []));
            cursor = response?.next_cursor ?? response?.nextCursor ?? null;
        } while (cursor);
        return results;
    }
    async requestPaginatedPage(path, options = {}) {
        const response = await this.request(path, options);
        if (Array.isArray(response)) {
            return { results: response, nextCursor: null };
        }
        return {
            results: Array.isArray(response?.results) ? response.results : [],
            nextCursor: response?.next_cursor ?? response?.nextCursor ?? null,
        };
    }
    async syncUpdateTask(taskId, args) {
        const uuid = createCommandUuid();
        const response = await this.syncCommand({
            type: "item_update",
            uuid,
            args: toSyncTaskArgs(taskId, args),
        });
        const status = response?.sync_status?.[uuid];
        if (status && status !== "ok") {
            throw new Error(`[Todoist Board] Todoist sync item_update failed: ${JSON.stringify(status)}`);
        }
        return { status: 200, text: JSON.stringify(response), json: response };
    }
    async syncCommand(command) {
        const response = await obsidian.requestUrl({
            url: `${API_BASE}/sync`,
            method: "POST",
            headers: {
                Authorization: this.authHeader(),
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: new URLSearchParams({
                commands: JSON.stringify([command]),
            }).toString(),
        });
        const raw = response.text || "";
        return raw ? JSON.parse(raw) : {};
    }
    authHeader(apiKey = this.apiKey) {
        return `Bearer ${normalizeApiToken(apiKey)}`;
    }
    getCachedTasks(filterKey) {
        try {
            return this.options.getCachedTasks?.(filterKey) || [];
        }
        catch {
            return [];
        }
    }
}

function a11yButton(el, label) {
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", label);
    el.setAttribute("tabindex", "0");
    el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            el.click?.();
            event.preventDefault();
        }
    }, { once: false });
}
function clearEl(el) {
    if (!el)
        return;
    while (el.firstChild)
        el.removeChild(el.firstChild);
}
function applyDimClass(el, on) {
    ["tb-dim", "dimmed", "queue-dim"].forEach((className) => {
        el.classList.toggle(className, on);
    });
}

class TaskSheetModal extends obsidian.Modal {
    constructor(app, options) {
        super(app);
        this.opened = false;
        this.titleInput = null;
        this.viewportCleanup = null;
        this.options = options;
    }
    onOpen() {
        this.opened = true;
        this.containerEl.classList.add("todoist-edit-task-modal", "todoist-task-sheet-modal");
        this.installViewportTracking();
        this.renderForm();
        window.setTimeout(() => this.focusTitle(), 10);
    }
    onClose() {
        this.opened = false;
        this.viewportCleanup?.();
        this.viewportCleanup = null;
        this.containerEl.style.removeProperty("--todoist-task-sheet-keyboard-offset");
        this.containerEl.style.removeProperty("--todoist-task-sheet-viewport-height");
        clearEl(this.contentEl);
        this.titleInput = null;
    }
    setLoading(title = this.options.title) {
        this.options = { ...this.options, title };
        if (!this.opened)
            return;
        this.setTitle(title);
        clearEl(this.contentEl);
        this.contentEl.appendChild(this.createSkeleton());
    }
    setForm(options) {
        this.options = { ...this.options, ...options };
        if (this.opened) {
            this.renderForm();
        }
    }
    focusTitle(select = false) {
        this.titleInput?.focus();
        if (select)
            this.titleInput?.select();
    }
    renderForm() {
        this.setTitle(this.options.title);
        clearEl(this.contentEl);
        this.contentEl.appendChild(this.createForm());
        this.syncViewportSize();
    }
    installViewportTracking() {
        this.viewportCleanup?.();
        const ownerWindow = this.containerEl.ownerDocument.defaultView ?? window;
        const viewport = ownerWindow.visualViewport;
        const sync = () => {
            this.syncViewportSize();
            ownerWindow.requestAnimationFrame(() => this.scrollFocusedFieldIntoView());
        };
        sync();
        viewport?.addEventListener("resize", sync);
        viewport?.addEventListener("scroll", sync);
        ownerWindow.addEventListener("resize", sync);
        ownerWindow.addEventListener("orientationchange", sync);
        this.contentEl.addEventListener("focusin", sync);
        this.viewportCleanup = () => {
            viewport?.removeEventListener("resize", sync);
            viewport?.removeEventListener("scroll", sync);
            ownerWindow.removeEventListener("resize", sync);
            ownerWindow.removeEventListener("orientationchange", sync);
            this.contentEl.removeEventListener("focusin", sync);
        };
    }
    syncViewportSize() {
        const ownerWindow = this.containerEl.ownerDocument.defaultView ?? window;
        const viewport = ownerWindow.visualViewport;
        const viewportHeight = viewport?.height ?? ownerWindow.innerHeight;
        const viewportTop = viewport?.offsetTop ?? 0;
        const keyboardOffset = Math.max(0, ownerWindow.innerHeight - viewportHeight - viewportTop);
        this.containerEl.style.setProperty("--todoist-task-sheet-viewport-height", `${viewportHeight}px`);
        this.containerEl.style.setProperty("--todoist-task-sheet-keyboard-offset", `${keyboardOffset}px`);
    }
    scrollFocusedFieldIntoView() {
        const focused = activeDocument.activeElement;
        if (!(focused instanceof HTMLElement) || !this.contentEl.contains(focused))
            return;
        focused.scrollIntoView({ block: "center", inline: "nearest" });
    }
    createSkeleton() {
        const wrapper = activeDocument.createElement("div");
        wrapper.className = "taskmodal-wrapper taskmodal-skeleton";
        const title = wrapper.createDiv({ cls: "taskmodal-title-field" });
        title.createEl("div", { cls: "taskmodal-skeleton-line taskmodal-skeleton-title" });
        const description = wrapper.createDiv({ cls: "taskmodal-description-field" });
        description.createEl("div", { cls: "taskmodal-skeleton-line taskmodal-skeleton-description" });
        const row = wrapper.createDiv({ cls: "taskmodal-row" });
        row.createEl("div", { cls: "taskmodal-skeleton-line" });
        row.createEl("div", { cls: "taskmodal-skeleton-line" });
        wrapper.createDiv({ cls: "taskmodal-skeleton-line taskmodal-skeleton-labels" });
        return wrapper;
    }
    createForm() {
        const { fields, submitLabel, projects, labels } = this.options;
        const wrapper = activeDocument.createElement("div");
        wrapper.className = "taskmodal-wrapper";
        const titleField = wrapper.createDiv({ cls: "taskmodal-title-field" });
        const titleInput = titleField.createEl("input", {
            cls: "taskmodal-title-input",
            type: "text",
            value: fields.title ?? "",
        });
        titleInput.placeholder = "Task title";
        this.titleInput = titleInput;
        const descriptionField = wrapper.createDiv({ cls: "taskmodal-description-field" });
        const descriptionInput = descriptionField.createEl("textarea", {
            cls: "taskmodal-description-input",
        });
        descriptionInput.placeholder = "Description";
        descriptionInput.value = fields.description ?? "";
        const projectAndDateRow = wrapper.createDiv({ cls: "taskmodal-row" });
        const projectField = projectAndDateRow.createDiv({ cls: "taskmodal-project-field" });
        const projectLabel = projectField.createEl("label", { cls: "taskmodal-project-label" });
        const projectIcon = projectLabel.createSpan({ cls: "taskmodal-label-icon" });
        obsidian.setIcon(projectIcon, "inbox");
        projectLabel.append("Project");
        const projectControl = projectField.createDiv({ cls: "taskmodal-control taskmodal-project-control" });
        const projectSelect = projectControl.createEl("select", { cls: "taskmodal-project-select" });
        for (const project of Array.isArray(projects) ? projects : []) {
            const option = activeDocument.createElement("option");
            option.value = String(project.id);
            option.textContent = project.name;
            if (fields.projectId && String(project.id) === String(fields.projectId)) {
                option.selected = true;
            }
            projectSelect.appendChild(option);
        }
        const dateField = projectAndDateRow.createDiv({ cls: "taskmodal-date-field" });
        const dateLabel = dateField.createEl("label", { cls: "taskmodal-date-label" });
        const dateIcon = dateLabel.createSpan({ cls: "taskmodal-label-icon" });
        obsidian.setIcon(dateIcon, "calendar");
        dateLabel.append("Due date");
        const dateRow = dateField.createDiv({ cls: "taskmodal-control taskmodal-date-input-row" });
        const dueInput = dateRow.createEl("input", {
            cls: "taskmodal-date-input",
            type: "date",
            value: fields.due ?? "",
        });
        dueInput.placeholder = "Due date";
        const clearDateButton = dateRow.createEl("button", { cls: "taskmodal-clear-date" });
        clearDateButton.type = "button";
        clearDateButton.title = "Clear due date";
        clearDateButton.setAttribute("aria-label", "Clear due date");
        obsidian.setIcon(clearDateButton, "x");
        clearDateButton.onclick = () => {
            dueInput.value = "";
        };
        const labelField = wrapper.createDiv({ cls: "taskmodal-labels-field" });
        const labelsLabel = labelField.createEl("label", { cls: "taskmodal-labels-label" });
        const labelsIcon = labelsLabel.createSpan({ cls: "taskmodal-label-icon" });
        obsidian.setIcon(labelsIcon, "tag");
        labelsLabel.append("Labels");
        const labelList = labelField.createDiv({ cls: "taskmodal-label-list" });
        for (const label of Array.isArray(labels) ? labels : []) {
            const labelCheckbox = labelList.createEl("label", { cls: "taskmodal-label-checkbox" });
            const checkbox = labelCheckbox.createEl("input", { type: "checkbox" });
            checkbox.value = label.name;
            checkbox.checked = Array.isArray(fields.labels) && fields.labels.includes(label.name);
            labelCheckbox.classList.toggle("is-selected", checkbox.checked);
            checkbox.addEventListener("change", () => {
                labelCheckbox.classList.toggle("is-selected", checkbox.checked);
            });
            labelCheckbox.append(label.name);
        }
        const buttonRow = wrapper.createDiv({ cls: "taskmodal-button-row" });
        const cancelButton = buttonRow.createEl("button", { cls: "taskmodal-button-cancel", text: "Cancel" });
        cancelButton.type = "button";
        cancelButton.onclick = () => this.close();
        const submitButton = buttonRow.createEl("button", { cls: "taskmodal-button-save", text: submitLabel });
        submitButton.type = "button";
        submitButton.onclick = () => {
            const title = titleInput.value.trim();
            if (!title) {
                titleInput.focus();
                return;
            }
            const data = {
                title,
                description: descriptionInput.value.trim(),
                due: dueInput.value,
                projectId: projectSelect.value,
                labels: Array.from(labelList.querySelectorAll("input[type='checkbox']:checked"))
                    .map((input) => input.value),
            };
            this.close();
            window.setTimeout(() => {
                void this.options.onSubmit(data);
            }, 10);
        };
        wrapper.addEventListener("keydown", (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                submitButton.click();
            }
        });
        return wrapper;
    }
}

const FILTER_ICON_COLORS = [
    "#FF6B6B", "#F06595", "#CC5DE8", "#845EF7", "#5C7CFA", "#339AF0",
    "#22B8CF", "#20C997", "#51CF66", "#94D82D", "#FCC419", "#FF922B",
    "#FF6B00", "#FFD43B", "#A9E34B", "#69DB7C", "#38D9A9", "#4DABF7",
    "#748FFC", "#9775FA", "#DA77F2", "#F783AC", "#FF8787", "#FF9F40",
];
const OBSIDIAN_ICONS = [
    "check", "calendar", "star", "heart", "search", "plus", "trash", "pencil", "folder", "document",
    "file-plus", "anchor", "zap", "settings", "book-open", "box", "bug", "camera", "cast", "cloud",
    "command", "compass", "database", "download", "eye", "flag", "globe", "image", "key", "layers",
    "link", "list", "lock", "map", "mic", "moon", "music", "pause", "phone", "refresh-cw", "save",
    "scissors", "send", "share", "shield", "shopping-cart", "sliders", "sun", "terminal", "thumbs-up",
    "toggle-left", "trash-2", "trending-up", "upload", "user", "video", "watch", "wifi", "x-circle",
    "alarm-clock", "bell", "briefcase", "clipboard", "coffee", "credit-card", "disc", "dollar-sign",
    "edit-2", "fast-forward", "file-text", "film", "gift", "hand", "home", "inbox", "info", "layout",
    "lightbulb", "list-checks", "loader", "log-in", "log-out", "menu", "message-circle", "navigation",
    "notebook", "package", "palette", "paperclip", "play", "printer", "repeat", "rss", "server", "shopping-bag",
    "sidebar", "smile", "timer", "target", "toggle-right", "swords", "truck", "umbrella", "wallet", "zap-off",
];
function openFilterSettingsModal(options) {
    const { app, settings } = options;
    const modal = new obsidian.Modal(app);
    modal.containerEl.classList.add("settings-modal", "todoist-settings-modal");
    modal.titleEl.setText("Customize toolbar filters");
    if (!settings.filters)
        settings.filters = [];
    if (settings.filters.length === 0) {
        settings.filters.push({ icon: "star", filter: "today", title: "Today" });
    }
    const renderSettingsUI = () => {
        const container = modal.contentEl;
        clearEl(container);
        const table = container.createEl("table", { cls: "settings-filter-table" });
        const header = table.createEl("thead").createEl("tr");
        ["", "Icon", "Title", "Todoist filter", "Default", ""].forEach((text) => {
            header.createEl("th", { text });
        });
        const tbody = table.createEl("tbody");
        const renderFilterRow = (filter, index) => {
            const currentFilter = settings.filters[index];
            const row = tbody.createEl("tr");
            row.dataset.index = String(index);
            renderDragHandle(row, tbody, index, settings, renderSettingsUI);
            renderIconPicker(row, filter, currentFilter);
            renderTitleInput(row, filter);
            renderFilterInput(row, filter);
            renderDefaultToggle(row, index, filter, settings, renderSettingsUI);
            renderDeleteButton(row, index, settings, renderSettingsUI);
        };
        settings.filters.forEach((filter, index) => renderFilterRow(filter, index));
        const addRow = container.createEl("div", { cls: "settings-action-row" });
        const addButton = addRow.createEl("button", { cls: "settings-add-filter-btn" });
        const addIcon = addButton.createSpan();
        obsidian.setIcon(addIcon, "plus");
        addButton.append("Add Filter");
        addButton.onclick = () => {
            const newFilter = { icon: "help-circle", title: "", filter: "" };
            settings.filters.push(newFilter);
            renderSettingsUI();
        };
        const saveRow = container.createEl("div", { cls: "settings-save-row" });
        const saveButton = saveRow.createEl("button", { cls: "settings-save-btn", text: "Save" });
        saveButton.onclick = async () => {
            readFilterInputs(modal, settings);
            if (!settings.filters.some((filter) => filter.isDefault)) {
                settings.filters[0].isDefault = true;
            }
            settings.filters = [...settings.filters];
            await options.onSave();
            options.onResetFilterIndex();
            app.workspace.trigger("markdown-preview-rendered");
            options.onRerenderBoards();
            modal.close();
            window.setTimeout(() => options.onRerenderCodeBlocks(), 100);
        };
        const clearCacheButton = saveRow.createEl("button");
        clearCacheButton.addClass("clear-cache-btn");
        const clearCacheIcon = clearCacheButton.createSpan();
        clearCacheIcon.addClass("tb-mr-6");
        obsidian.setIcon(clearCacheIcon, "x-circle");
        clearCacheButton.append("Clear Cache");
        clearCacheButton.onclick = () => {
            options.onClearCache();
            new obsidian.Notice("Todoist task cache cleared. Plugin will re-fetch data.");
        };
        modal.containerEl.addEventListener("mousedown", (event) => {
            modal.containerEl.querySelectorAll(".icon-picker-wrapper.visible").forEach((element) => {
                const trigger = element.previousElementSibling;
                if (!element.contains(event.target) && !trigger?.contains(event.target)) {
                    element.classList.remove("visible");
                }
            });
        });
    };
    renderSettingsUI();
    modal.open();
}
function renderDragHandle(row, tbody, index, settings, rerender) {
    const dragCell = row.createEl("td", { cls: "settings-drag-cell" });
    const dragHandle = dragCell.createEl("button", { cls: "settings-drag-handle" });
    dragHandle.type = "button";
    dragHandle.draggable = true;
    dragHandle.setAttribute("aria-label", "Drag to reorder filter");
    obsidian.setIcon(dragHandle, "grip-vertical");
    dragHandle.addEventListener("dragstart", (event) => {
        event.dataTransfer?.setData("text/plain", String(index));
        event.dataTransfer?.setDragImage(row, 16, 16);
        if (event.dataTransfer)
            event.dataTransfer.effectAllowed = "move";
        row.classList.add("is-dragging");
    });
    dragHandle.addEventListener("dragend", () => {
        row.classList.remove("is-dragging");
        tbody.querySelectorAll(".is-drag-over").forEach((element) => element.classList.remove("is-drag-over"));
    });
    row.addEventListener("dragover", (event) => {
        event.preventDefault();
        row.classList.add("is-drag-over");
        if (event.dataTransfer)
            event.dataTransfer.dropEffect = "move";
    });
    row.addEventListener("dragleave", () => row.classList.remove("is-drag-over"));
    row.addEventListener("drop", (event) => {
        event.preventDefault();
        row.classList.remove("is-drag-over");
        const from = Number(event.dataTransfer?.getData("text/plain"));
        const to = index;
        if (!Number.isInteger(from) || from === to)
            return;
        const [moved] = settings.filters.splice(from, 1);
        settings.filters.splice(to, 0, moved);
        rerender();
    });
}
function renderIconPicker(row, filter, currentFilter) {
    const iconCell = row.createEl("td");
    const iconTrigger = iconCell.createDiv({ cls: "icon-trigger" });
    clearEl(iconTrigger);
    obsidian.setIcon(iconTrigger, filter.icon || "star");
    const iconPicker = iconCell.createDiv({ cls: "icon-picker-wrapper" });
    const colorRow = iconPicker.createDiv({ cls: "icon-color-row" });
    FILTER_ICON_COLORS.forEach((color) => {
        const swatch = colorRow.createDiv({ cls: "icon-color-swatch" });
        swatch.style.background = color;
        swatch.onclick = () => {
            iconTrigger.querySelector("svg")?.setAttribute("stroke", color);
            currentFilter.color = color;
        };
    });
    const customColor = row.ownerDocument.createElement("input");
    customColor.type = "color";
    customColor.className = "icon-color-picker custom-color-swatch";
    customColor.oninput = () => {
        iconTrigger.querySelector("svg")?.setAttribute("stroke", customColor.value);
        currentFilter.color = customColor.value;
    };
    colorRow.appendChild(customColor);
    OBSIDIAN_ICONS.forEach((iconName) => {
        const iconButton = iconPicker.createSpan({ cls: "icon-grid-btn" });
        obsidian.setIcon(iconButton, iconName);
        iconButton.title = iconName;
        if (filter.icon === iconName)
            iconButton.classList.add("selected");
        iconButton.onclick = (event) => {
            event.preventDefault();
            currentFilter.icon = iconName;
            clearEl(iconTrigger);
            obsidian.setIcon(iconTrigger, iconName);
            iconPicker.classList.remove("visible");
            iconPicker.querySelectorAll(".icon-grid-btn").forEach((button) => button.classList.remove("selected"));
            iconButton.classList.add("selected");
        };
    });
    iconTrigger.onclick = (event) => {
        event.stopPropagation();
        row.ownerDocument.querySelectorAll(".icon-picker-wrapper.visible").forEach((element) => {
            if (element !== iconPicker)
                element.classList.remove("visible");
        });
        iconPicker.classList.toggle("visible");
    };
}
function renderTitleInput(row, filter) {
    const titleCell = row.createEl("td");
    const titleInput = titleCell.createEl("input", { type: "text" });
    titleInput.value = filter.title || "";
    titleInput.oninput = () => {
        filter.title = titleInput.value;
    };
}
function renderFilterInput(row, filter) {
    const filterCell = row.createEl("td");
    const filterInput = filterCell.createEl("input", { type: "text" });
    filterInput.value = typeof filter.filter === "string" ? filter.filter : JSON.stringify(filter.filter ?? {});
}
function renderDefaultToggle(row, index, filter, settings, rerender) {
    const defaultCell = row.createEl("td", { cls: "settings-default-cell" });
    const defaultLabel = defaultCell.createEl("label", { cls: "settings-default-toggle" });
    const defaultInput = defaultLabel.createEl("input", { type: "radio" });
    defaultInput.name = "default-filter";
    defaultInput.checked = !!filter.isDefault;
    defaultInput.onchange = () => {
        settings.filters.forEach((_, filterIndex) => {
            settings.filters[filterIndex].isDefault = filterIndex === index;
        });
        rerender();
    };
    const defaultIcon = defaultLabel.createSpan();
    obsidian.setIcon(defaultIcon, "check");
}
function renderDeleteButton(row, index, settings, rerender) {
    const deleteCell = row.createEl("td");
    const deleteButton = deleteCell.createEl("button");
    obsidian.setIcon(deleteButton, "trash-2");
    deleteButton.querySelector("svg")?.removeAttribute("fill");
    deleteButton.className = "icon-button";
    deleteButton.setAttribute("aria-label", "Delete filter");
    deleteButton.onclick = () => {
        settings.filters.splice(index, 1);
        rerender();
    };
}
function readFilterInputs(modal, settings) {
    const filterRows = Array.from(modal.contentEl.querySelectorAll("tbody tr"));
    filterRows.forEach((row, index) => {
        const filterInput = row.querySelector("td:nth-child(4) input");
        if (!filterInput)
            return;
        const value = filterInput.value.trim();
        try {
            settings.filters[index].filter = JSON.parse(value);
        }
        catch {
            settings.filters[index].filter = value;
        }
    });
}

function startTaskPolling(plugin, interval = 10000) {
    let lastActivity = Date.now();
    const handlers = [];
    const updateActivity = () => {
        lastActivity = Date.now();
    };
    ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
        window.addEventListener(event, updateActivity, { passive: true });
        handlers.push({ event, fn: updateActivity });
    });
    const timer = window.setInterval(async () => {
        if (activeDocument.visibilityState !== "visible")
            return;
        if (Date.now() - lastActivity >= interval * 2)
            return;
        try {
            const filters = Array.from(new Set(Array.from(activeDocument.querySelectorAll(".todoist-board"))
                .map((el) => el.getAttribute("data-current-filter") || "today")));
            let changedAny = false;
            for (const filter of filters) {
                const response = await plugin.fetchFilteredTasksFromREST(plugin.settings.apiKey, filter);
                const tasks = Array.isArray(response?.results) ? response.results : [];
                const existing = plugin.getViewTasks(filter);
                if (hasTaskChanges(existing, tasks)) {
                    changedAny = true;
                    plugin.upsertTasks(filter, tasks);
                }
            }
            if (!changedAny)
                return;
            activeDocument.querySelectorAll(".todoist-board.plugin-view").forEach(async (el) => {
                const filter = el.getAttribute("data-current-filter") || "today";
                const metadata = await plugin.fetchMetadataFromSync(plugin.settings.apiKey);
                plugin.projectCache = metadata.projects || [];
                plugin.labelCache = metadata.labels || [];
                plugin.projectCacheTimestamp = Date.now();
                plugin.labelCacheTimestamp = Date.now();
                plugin.renderTodoistBoard(el, `filter: ${filter}`, {}, plugin.settings.apiKey, {
                    tasks: plugin.getViewTasks(filter),
                    projects: plugin.projectCache,
                    labels: plugin.labelCache,
                });
            });
            plugin.refreshAllInlineBoards();
        }
        catch {
            // Polling should never break the plugin UI.
        }
    }, interval);
    return () => {
        window.clearInterval(timer);
        handlers.forEach(({ event, fn }) => window.removeEventListener(event, fn));
    };
}
function hasTaskChanges(previous, next) {
    const oldTasks = Array.isArray(previous) ? previous : [];
    const newTasks = Array.isArray(next) ? next : [];
    if (oldTasks.length !== newTasks.length)
        return true;
    const oldIds = new Set(oldTasks.map((task) => String(task.id)));
    const newIds = new Set(newTasks.map((task) => String(task.id)));
    if ([...oldIds].some((id) => !newIds.has(id)))
        return true;
    return newTasks.some((task) => {
        const previousTask = oldTasks.find((candidate) => String(candidate.id) === String(task.id));
        if (!previousTask)
            return true;
        const previousDue = previousTask.due?.datetime ?? previousTask.due?.date ?? null;
        const nextDue = task.due?.datetime ?? task.due?.date ?? null;
        const previousLabels = Array.isArray(previousTask.labels)
            ? previousTask.labels.join(",")
            : previousTask.labels;
        const nextLabels = Array.isArray(task.labels)
            ? task.labels.join(",")
            : task.labels;
        return previousDue !== nextDue
            || previousTask.content !== task.content
            || previousLabels !== nextLabels
            || String(previousTask.projectId ?? "") !== String(task.projectId ?? "");
    });
}

class TodoistBoardView extends obsidian.ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.icon = "list-todo";
    }
    getViewType() {
        return TODOIST_BOARD_VIEW_TYPE$1;
    }
    getDisplayText() {
        return "Todoist Board";
    }
    async onOpen() {
        let container = this.containerEl.querySelector(".view-content");
        if (!container) {
            container = this.containerEl.createDiv({ cls: "view-content" });
        }
        container.empty?.();
        container.classList.add("todoist-board", "plugin-view");
        container.setAttribute("id", "todoist-main-board");
        const plugin = this.plugin;
        const defaultFilter = getDefaultFilter(plugin.settings);
        plugin.settings.currentFilter = defaultFilter;
        container.setAttribute("data-current-filter", String(defaultFilter));
        await new Promise((resolve) => {
            const checkVisible = () => {
                if (container.offsetParent !== null)
                    return resolve(undefined);
                window.setTimeout(checkVisible, 100);
            };
            checkVisible();
        });
        if (!plugin.taskCache[defaultFilter] || plugin.taskCache[defaultFilter].length === 0) {
            await plugin.preloadFilters();
        }
        const response = await plugin.fetchFilteredTasksFromREST(plugin.settings.apiKey, defaultFilter);
        const live = Array.isArray(response?.results) ? response.results : [];
        const cachedTasks = live.length ? live : plugin.getViewTasks(defaultFilter);
        plugin.upsertTasks(defaultFilter, cachedTasks);
        let projects = plugin.projectCache;
        let labels = plugin.labelCache;
        if (!Array.isArray(projects) || projects.length === 0) {
            projects = readJSON("todoistProjectsCache", []);
            plugin.projectCache = projects;
        }
        if (!Array.isArray(labels) || labels.length === 0) {
            labels = readJSON("todoistLabelsCache", []);
            plugin.labelCache = labels;
        }
        await plugin.renderTodoistBoard(container, `filter: ${defaultFilter}`, {}, plugin.settings.apiKey, {
            tasks: cachedTasks,
            projects,
            labels,
        });
    }
    async onClose() {
        // Obsidian handles the leaf disposal; plugin unload handles global cleanup.
    }
}

class TodoistBoardSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        const pluginSettings = this.plugin.settings;
        new obsidian.Setting(containerEl)
            .setName("🔑 Todoist API key")
            .setDesc("Enter your Todoist API key to enable the plugin.")
            .addText((text) => {
            text
                .setPlaceholder("API key")
                .setValue(pluginSettings.apiKey);
            const submitBtn = activeDocument.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.classList.add("tb-ml-8");
            const indicator = activeDocument.createElement("span");
            indicator.classList.add("tb-ml-8", "tb-bold");
            submitBtn.onclick = async () => {
                indicator.textContent = "⏳";
                try {
                    const valid = await this.plugin.validateTodoistApiKey(text.inputEl.value);
                    if (!valid)
                        throw new Error("Invalid");
                    pluginSettings.apiKey = text.inputEl.value;
                    indicator.textContent = "✅";
                    await this.plugin.savePluginData();
                }
                catch {
                    indicator.textContent = "❌";
                }
            };
            text.inputEl.parentElement?.appendChild(submitBtn);
            text.inputEl.parentElement?.appendChild(indicator);
        });
        new obsidian.Setting(containerEl)
            .setName("👯‍♀️ support my work")
            .setDesc("If you like how this plugin is shaping up, please consider supporting my work by buying me a coffee or ten!")
            .addButton((button) => {
            button.setButtonText("☕ Coffee season");
            button.buttonEl.classList.add("tb-cta");
            button.onClick(() => {
                window.open("https://ko-fi.com/jamiedaghaim", "_blank");
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Console logging")
            .setDesc("Print debug output of Todoist Board to the developer console.")
            .addToggle((toggle) => {
            toggle
                .setValue(!!this.plugin.settings.enableLogs)
                .onChange(async (value) => {
                this.plugin.settings.enableLogs = value;
                await this.plugin.saveSettings();
                new obsidian.Notice(value ? "Console logging: ON" : "Console logging: OFF", 1500);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Timezone mode")
            .setDesc("Choose how timezone is determined for your tasks.")
            .addDropdown((dropdown) => dropdown
            .addOption("auto", "Auto (use device timezone)")
            .addOption("manual", "Manual")
            .setValue(pluginSettings.timezoneMode)
            .onChange(async (value) => {
            pluginSettings.timezoneMode = value;
            await this.plugin.saveSettings();
            this.display();
        }));
        if (pluginSettings.timezoneMode === "manual") {
            new obsidian.Setting(containerEl)
                .setName("Manual timezone")
                .setDesc("Overrides system timezone if 'manual' mode is selected above")
                .addDropdown((dropdown) => {
                for (const timezone of COMMON_TIMEZONES)
                    dropdown.addOption(timezone, timezone);
                dropdown.setValue(this.plugin.settings.manualTimezone);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.manualTimezone = value;
                    await this.plugin.saveSettings();
                    new obsidian.Notice("Timezone saved. Restart Obsidian to apply.");
                });
            });
        }
        new obsidian.Setting(containerEl)
            .setName("Context menu actions")
            .setDesc("Select which actions appear in the right-click context menu for tasks.")
            .setHeading();
        const actions = [
            { key: "scheduleToday", label: "Schedule today" },
            { key: "scheduleTomorrow", label: "Schedule tomorrow" },
            { key: "setPriority", label: "Set priority" },
            { key: "editTask", label: "Edit task" },
            { key: "deleteTask", label: "Delete task" },
            { key: "openInTodoist", label: "Open in Todoist" },
        ];
        actions.forEach((action) => {
            new obsidian.Setting(containerEl)
                .setName(action.label)
                .addToggle((toggle) => toggle
                .setValue(pluginSettings.contextMenuActions?.[action.key] ?? true)
                .onChange(async (value) => {
                if (!pluginSettings.contextMenuActions) {
                    pluginSettings.contextMenuActions = {};
                }
                pluginSettings.contextMenuActions[action.key] = value;
                await this.plugin.saveSettings();
            }));
        });
    }
}

let hour12 = null;
function getZone(settings) {
    return settings.timezoneMode === "manual"
        ? settings.manualTimezone
        : Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function safeZone(zone) {
    return (zone && zone.trim()) || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
function useHour12() {
    if (hour12 !== null)
        return hour12;
    try {
        const formatter = new Intl.DateTimeFormat(undefined, { timeStyle: "short" });
        const resolved = typeof formatter.resolvedOptions === "function"
            ? formatter.resolvedOptions()
            : null;
        if (resolved && typeof resolved.hour12 === "boolean") {
            hour12 = resolved.hour12;
            return hour12 ?? false;
        }
        const parts = new Intl.DateTimeFormat(undefined, {
            hour: "numeric",
            hour12: false,
        }).formatToParts(new Date());
        hour12 = parts.some((part) => part.type === "dayPeriod");
        return hour12;
    }
    catch {
        hour12 = false;
        return hour12;
    }
}

function getProjectHexColor(task, projects) {
    const color = projects.find((project) => String(project.id) === String(task.projectId))?.color;
    if (typeof color === "number") {
        return TODOIST_COLORS_NUM[color] || "#e5e7eb";
    }
    if (typeof color === "string") {
        return TODOIST_COLORS[color] || "#e5e7eb";
    }
    return "#e5e7eb";
}
function createTaskContent(options) {
    const { task, projectMap, labelMap, labelColorMap, projects, labels, settings, app, owner, } = options;
    const left = activeDocument.createElement("div");
    left.className = "task-content";
    const titleSpan = activeDocument.createElement("span");
    clearEl(titleSpan);
    void obsidian.MarkdownRenderer.render(app, task.content, titleSpan, "", owner);
    titleSpan.className = "task-title";
    const metaSpan = activeDocument.createElement("small");
    metaSpan.className = "task-metadata";
    const pills = createTaskPills({
        task,
        projectMap,
        labelMap,
        labelColorMap,
        projects,
        labels,
        settings,
    });
    pills.forEach((pill) => metaSpan.appendChild(pill));
    const descEl = activeDocument.createElement("div");
    descEl.className = "task-description";
    if (typeof task.description === "string" && task.description.trim()) {
        descEl.textContent = task.description;
    }
    else {
        descEl.textContent = " ";
        descEl.classList.add("desc-empty");
    }
    const contentWrapper = activeDocument.createElement("div");
    contentWrapper.className = "task-content-wrapper";
    contentWrapper.appendChild(titleSpan);
    const whenRow = activeDocument.createElement("div");
    whenRow.className = "task-when";
    const dueInline = createDueInline(task, settings);
    if (dueInline)
        whenRow.appendChild(dueInline);
    const deadlineInline = createDeadlineInline(task, settings);
    if (deadlineInline) {
        if (whenRow.childNodes.length) {
            whenRow.appendChild(createMidSeparator());
        }
        whenRow.appendChild(deadlineInline);
    }
    contentWrapper.appendChild(whenRow);
    const metaRow = activeDocument.createElement("div");
    metaRow.className = "task-meta-compact";
    const projectInline = createProjectPill(task.projectId, projectMap, projects);
    if (projectInline)
        metaRow.appendChild(projectInline);
    const labelsInline = createLabelPill(task.labels, labelMap, labelColorMap, labels);
    if (labelsInline) {
        if (projectInline) {
            metaRow.appendChild(createMidSeparator());
        }
        metaRow.appendChild(labelsInline);
    }
    contentWrapper.appendChild(metaRow);
    contentWrapper.appendChild(descEl);
    contentWrapper.appendChild(metaSpan);
    left.appendChild(contentWrapper);
    return left;
}
function createTaskPills(options) {
    const { task, projectMap, labelMap, labelColorMap, projects, labels, settings } = options;
    const pills = [];
    const zone = safeZone(getZone(settings));
    let dueDate = task.due?.date;
    let dueTime;
    let sourceDateTime = null;
    if (task.due?.datetime) {
        sourceDateTime = DateTime.fromISO(task.due.datetime, { setZone: true });
    }
    else if (task.due?.date && task.due.date.includes("T")) {
        sourceDateTime = DateTime.fromISO(task.due.date, { setZone: true });
    }
    else if (task.due?.time) {
        sourceDateTime = DateTime.fromISO(`${task.due.date}T${task.due.time}`, { setZone: true });
    }
    if (sourceDateTime?.isValid) {
        const dt = sourceDateTime.setZone(zone);
        if (dt.hour !== 0 || dt.minute !== 0) {
            dueTime = dt.toFormat(useHour12() ? "h:mm a" : "HH:mm");
        }
        dueDate = dt.toISODate() || dueDate;
    }
    const duePill = createDuePill(dueDate, dueTime, settings);
    if (duePill)
        pills.push(duePill);
    const projectPill = createProjectPill(task.projectId, projectMap, projects);
    if (projectPill)
        pills.push(projectPill);
    const labelPill = createLabelPill(task.labels, labelMap, labelColorMap, labels);
    if (labelPill)
        pills.push(labelPill);
    return pills.filter((pill) => pill.style.display !== "none");
}
function createDueInline(task, settings) {
    const due = task?.due?.datetime || task?.due?.date;
    if (!due)
        return null;
    const zone = getZone(settings);
    const dt = DateTime.fromISO(due).setZone(zone);
    if (!dt?.isValid)
        return null;
    const today = DateTime.now().setZone(zone).startOf("day");
    const target = dt.startOf("day");
    const days = Math.round(target.diff(today, "days").days);
    const hasTime = /T\d{2}:\d{2}/.test(due);
    const dateLabel = days === 0 ? "Today"
        : days === 1 ? "Tomorrow"
            : dt.toFormat("ccc, LLL d");
    const span = activeDocument.createElement("span");
    span.className = "due-inline";
    span.textContent = hasTime ? `${dateLabel} @ ${dt.toFormat(useHour12() ? "h:mm a" : "HH:mm")}` : dateLabel;
    const isRecurring = Boolean(task?.due?.isRecurring === true ||
        (typeof task?.due?.string === "string" && /\b(every|daily|weekly|monthly|yearly|weekday|weekend)\b/i.test(task.due.string)));
    if (isRecurring) {
        const recurring = activeDocument.createElement("span");
        recurring.className = "repeat-indicator";
        recurring.setAttribute("aria-label", "Repeats");
        recurring.title = "Repeats";
        recurring.textContent = " \uD83D\uDD01";
        span.appendChild(recurring);
    }
    return span;
}
function createDeadlineInline(task, settings) {
    const deadline = task?.deadline?.date;
    if (!deadline)
        return null;
    const zone = getZone(settings);
    const dt = DateTime.fromISO(deadline, { zone });
    if (!dt?.isValid)
        return null;
    const today = DateTime.now().setZone(zone).startOf("day");
    const target = dt.startOf("day");
    const days = Math.round(target.diff(today, "days").days);
    const span = activeDocument.createElement("span");
    span.className = "deadline-inline";
    span.textContent =
        days === 0 ? "🎯 today"
            : days === 1 ? "🎯 in 1 day"
                : days < 0 ? `🎯 ${Math.abs(days)} days ago`
                    : `🎯 in ${days} days`;
    return span;
}
function createDuePill(dueDate, dueTime, settings) {
    if (!dueDate)
        return null;
    const zone = safeZone(getZone(settings));
    let dt = null;
    let hasTime = false;
    if (dueTime) {
        let parsed = DateTime.fromFormat(dueTime, "h:mm a", { zone });
        if (!parsed.isValid)
            parsed = DateTime.fromFormat(dueTime, "HH:mm", { zone });
        if (parsed.isValid) {
            const hhmm = parsed.toFormat("HH:mm");
            dt = DateTime.fromISO(`${dueDate}T${hhmm}`, { zone }).setZone(zone);
            hasTime = true;
        }
    }
    if (!dt || !dt.isValid) {
        dt = DateTime.fromISO(dueDate, { zone }).startOf("day");
        hasTime = false;
    }
    const pill = activeDocument.createElement("span");
    pill.className = "due-pill";
    const day = getDayLabel(dt);
    pill.textContent = hasTime
        ? `${day} @ ${dt.toFormat(useHour12() ? "h:mm a" : "HH:mm")}`
        : day;
    return pill;
}
function getDayLabel(dt) {
    if (!dt?.isValid)
        return "";
    const zone = dt.zoneName;
    const today = DateTime.now().setZone(zone || "UTC").startOf("day");
    const target = dt.startOf("day");
    if (target.hasSame(today, "day"))
        return "Today";
    if (target.hasSame(today.plus({ days: 1 }), "day"))
        return "Tomorrow";
    if (target.hasSame(today.minus({ days: 1 }), "day"))
        return "Yesterday";
    return dt.toFormat("MMM d");
}
function createProjectPill(projectId, projectMap, projects) {
    if (!projectId)
        return null;
    const projectPill = activeDocument.createElement("span");
    projectPill.className = "pill project-pill";
    projectPill.setAttribute("data-type", "project");
    const projectName = projectMap[String(projectId)] || "Unknown Project";
    const project = Array.isArray(projects)
        ? projects.find((candidate) => String(candidate.id) === String(projectId))
        : undefined;
    let projectHex = "";
    const colorValue = project?.color;
    if (typeof colorValue === "string" && colorValue.trim()) {
        const color = colorValue.trim();
        projectHex = (color.startsWith("#") || color.startsWith("rgb")) ? color : (TODOIST_COLORS[color] || "");
    }
    if (colorValue)
        projectPill.setAttribute("data-project-color-id", String(colorValue));
    projectPill.style.removeProperty("--project-color");
    if (projectHex)
        projectPill.style.setProperty("--project-color", projectHex);
    clearEl(projectPill);
    const name = String(projectName);
    if (name.toLowerCase() === "inbox")
        projectPill.classList.add("project-pill-inbox");
    const hash = activeDocument.createElement("span");
    hash.className = "project-hash";
    hash.textContent = "#";
    if (projectHex)
        hash.style.color = projectHex;
    projectPill.appendChild(hash);
    const nameSpan = activeDocument.createElement("span");
    nameSpan.className = "project-name";
    nameSpan.textContent = name.toLowerCase() === "inbox" ? "📥 Inbox" : name;
    projectPill.appendChild(nameSpan);
    return projectPill;
}
function createLabelPill(labels, labelMap, labelColorMap, labelCache) {
    if (!Array.isArray(labels) || labels.length === 0)
        return null;
    const labelPill = activeDocument.createElement("span");
    labelPill.className = "pill label-pill";
    labelPill.setAttribute("data-type", "label");
    const resolveIdKey = (value) => {
        const input = String(value);
        if (labelMap[input] !== undefined)
            return input;
        const numericInput = Number(input);
        if (!Number.isNaN(numericInput) && labelMap[numericInput] !== undefined)
            return String(numericInput);
        for (const [id, name] of Object.entries(labelMap)) {
            if (String(name) === input)
                return id;
        }
        return null;
    };
    labels.forEach((raw, index) => {
        const input = String(raw);
        const idKey = resolveIdKey(input);
        const name = idKey ? (labelMap[idKey] ?? input) : input;
        let rawColor = idKey ? labelColorMap[idKey] : undefined;
        if (!rawColor && labelColorMap[input] !== undefined) {
            rawColor = labelColorMap[input];
        }
        if (!rawColor && Array.isArray(labelCache)) {
            const hit = labelCache.find((label) => {
                return String(label.id) === input || String(label.id) === idKey || String(label.name) === input;
            });
            rawColor = hit?.color;
        }
        let color = "";
        if (typeof rawColor === "string" && rawColor.trim()) {
            const rawHex = rawColor.trim();
            color = (rawHex.startsWith("#") || rawHex.startsWith("rgb")) ? rawHex : ((TODOIST_COLORS[rawHex]) || rawHex);
        }
        const part = activeDocument.createElement("span");
        part.className = "label-part";
        const at = activeDocument.createElement("span");
        at.className = "label-at";
        at.textContent = "@ ";
        if (color) {
            labelPill.style.setProperty("--label-color", color);
            part.style.setProperty("--label-color", color);
            at.style.setProperty("--label-color", color);
            at.classList.add("label-at");
            at.style.cssText += `; --label-color: ${color}; color: ${color} !important;`;
        }
        part.appendChild(at);
        part.appendChild(activeDocument.createTextNode(String(name)));
        labelPill.appendChild(part);
        if (index < labels.length - 1) {
            const separator = activeDocument.createElement("span");
            separator.className = "label-separator";
            separator.textContent = ",";
            labelPill.appendChild(separator);
        }
    });
    return labelPill;
}
function createMidSeparator() {
    const separator = activeDocument.createElement("span");
    separator.className = "mid-sep";
    separator.textContent = " | ";
    return separator;
}

// ======================= 🌟 Constants & Interfaces =======================
// --- Selected Filter Index State ---
let selectedFilterIndex = 0;
const TODOIST_BOARD_VIEW_TYPE = TODOIST_BOARD_VIEW_TYPE$1;
const DEFAULT_SETTINGS = DEFAULT_SETTINGS$1;
class TodoistBoardPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        // =========== Plugin ready state and ensurePluginReady ==============
        this._ready = false;
        this.currentFilter = "";
        this._mutationObservers = [];
        // --- Cancellation token for filter rendering ---
        this.currentRenderToken = "";
        this.compactMode = false;
        this._globalClickListener = (e) => {
            const t = e.target;
            // Do nothing for clicks inside the left sidebar (file explorer)
            if (t && t.closest(".workspace-split.mod-left-split"))
                return;
            const openDropdown = activeDocument.querySelector(".menu-dropdown:not(.hidden)");
            if (openDropdown)
                openDropdown.classList.add("hidden");
        };
        // --- Timezone tracking for cache invalidation ---
        this.lastKnownTimezone = null;
        this.htmlCache = {};
        this.taskStore = {}; // id → task (single source of truth)
        this.filterIndex = {}; // filterKey → [taskId]
        this.taskCache = {}; // legacy (kept for compatibility)
        this.projectCache = [];
        this.sectionCache = [];
        this.labelCache = [];
        this.taskCacheTimestamps = {};
        this.projectCacheTimestamp = 0;
        this.labelCacheTimestamp = 0;
        this.taskPageSize = 100;
        this.filterNextCursor = {};
        // --- Project Map for id lookup ---
        this.projectMap = new Map();
        // ======================= 🚀 Plugin Load Lifecycle =======================
        this.onload = async () => {
            await (async () => {
                // Register the custom view before any command registration
                this.registerView(TODOIST_BOARD_VIEW_TYPE, (leaf) => new TodoistBoardView(leaf, this));
                // Register command to open Todoist Board in right sidebar (works on mobile and desktop)
                this.addCommand({
                    id: "open-sidebar",
                    name: "Open in right sidebar",
                    callback: async () => {
                        // Only open the board if it's not already open in the right sidebar
                        const existingLeaf = this.app.workspace
                            .getLeavesOfType(TODOIST_BOARD_VIEW_TYPE)
                            .find((leaf) => leaf.getRoot()?.containerEl?.hasClass("mod-right-split"));
                        if (existingLeaf) {
                            // Already open in right sidebar; do nothing
                            return;
                        }
                        const rightLeaf = this.app.workspace.getRightLeaf(false) ||
                            this.app.workspace.getRightLeaf(true);
                        if (rightLeaf) {
                            await rightLeaf.setViewState({
                                type: TODOIST_BOARD_VIEW_TYPE,
                                active: true,
                            });
                        }
                    },
                });
                await this.loadSettings();
                const initialToken = this.settings.apiKey;
                this.ensureRefactoredRuntime(initialToken);
                const cachedMetadata = this.storage.loadMetadata();
                if (Array.isArray(cachedMetadata.projects) && cachedMetadata.projects.length) {
                    this.projectCache = cachedMetadata.projects;
                    this.projectCacheTimestamp = this.storage.getMetadataTimestamp();
                    this.projectMap.clear();
                    for (const project of this.projectCache) {
                        this.projectMap.set(String(project.id), project);
                    }
                }
                if (Array.isArray(cachedMetadata.labels) && cachedMetadata.labels.length) {
                    this.labelCache = cachedMetadata.labels;
                    this.labelCacheTimestamp = this.storage.getMetadataTimestamp();
                }
                // OAuth2 authentication setup removed.
                if (!initialToken) {
                    // console.warn("[Todoist Board] No Todoist API token found. Set one in the plugin settings.");
                    // Still register the settings tab so the user can open settings even when not authenticated
                    this.addSettingTab(new TodoistBoardSettingTab(this.app, this));
                    return;
                }
                this.addSettingTab(new TodoistBoardSettingTab(this.app, this));
                if (!this.settings.filters?.some(f => f.isDefault)) {
                    if (this.settings.filters && this.settings.filters.length > 0) {
                        this.settings.filters[0].isDefault = true;
                    }
                }
                if (this.settings.filters && !this.settings.filters.some(f => f.isDefault)) {
                    this.settings.filters.forEach((f, i) => f.isDefault = (i === 0));
                }
                // Set compactMode from settings or default to false
                this.compactMode = this.settings.compactMode ?? false;
                // --- Timezone cache invalidation logic (respects manual mode) ---
                const effectiveZone = getZone(this.settings);
                let storedTimezone = this.storage.getTimezone();
                if (!storedTimezone) {
                    this.storage.setTimezone(effectiveZone);
                    storedTimezone = effectiveZone;
                }
                this.lastKnownTimezone = storedTimezone;
                if (storedTimezone !== effectiveZone) {
                    // Invalidate all cached task data if timezone changed
                    this.storage.clearTaskAndMetadataCaches();
                    // Store updated timezone
                    this.storage.setTimezone(effectiveZone);
                    // Re-fetch metadata and update caches
                    const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                    this.projectCache = metadata.projects;
                    this.labelCache = metadata.labels;
                    this.projectCacheTimestamp = Date.now();
                    this.labelCacheTimestamp = Date.now();
                    // Force re-render of current board if any is active
                    const boardEl = activeDocument.querySelector(".todoist-board");
                    const currentFilter = boardEl?.getAttribute("data-current-filter") || "";
                    if (boardEl && currentFilter) {
                        const resp = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
                        const tasks = resp?.results ?? [];
                        this.taskCache[currentFilter] = tasks;
                        this.renderTodoistBoard(boardEl, `filter: ${currentFilter}`, {}, this.settings.apiKey, {
                            tasks,
                            projects: this.projectCache,
                            labels: this.labelCache
                        });
                    }
                }
                this.loadingOverlay = activeDocument.createElement("div");
                this.loadingOverlay.className = "loading-overlay";
                const spinner = activeDocument.createElement("div");
                spinner.className = "spinner";
                this.loadingOverlay.appendChild(spinner);
                this.registerDomEvent(this.loadingOverlay, "click", (e) => e.stopPropagation());
                this.registerMarkdownCodeBlockProcessor("todoist-board", (source, el, ctx) => {
                    // Add classes for code block container
                    el.classList.add("block-language-todoist-board", "todoist-board", "todoist-inline-board");
                    const sourcePath = ctx.sourcePath || "reading-mode-placeholder";
                    // Determine filter robustly: prefer explicit in source; else reuse prior; else default
                    const priorFilter = el.getAttribute("data-current-filter");
                    let filter = String(priorFilter || "");
                    // Parse block params for filter (supports both `Filter:` and `filter:` anywhere in block)
                    function parseBlockParams(raw) {
                        const lines = (raw || "").split("\n");
                        const params = {};
                        for (let line of lines) {
                            const m = line.match(/^\s*([a-zA-Z0-9_]+):\s*(.*)$/);
                            if (m)
                                params[m[1].trim()] = m[2].trim();
                        }
                        return params;
                    }
                    const parsed = parseBlockParams(source || "");
                    this.dbg("📦 Raw source:", source);
                    this.dbg("🧩 Parsed block params:", parsed);
                    // 1) Explicit Filter param wins
                    if (typeof parsed.Filter === "string" && parsed.Filter.trim()) {
                        filter = parsed.Filter.trim();
                    }
                    else {
                        // 2) Loose regex for `filter:` (case-insensitive)
                        const m = (source || "").match(/\bfilter\s*:\s*(.+)/i);
                        if (m && m[1] && m[1].trim()) {
                            filter = m[1].trim();
                        }
                    }
                    // 3) If still empty, fall back to user's default ONLY if there was no prior filter
                    if (!filter) {
                        const df = this.settings.filters?.find(f => f.isDefault)?.filter
                            ?? this.settings.filters?.[0]?.filter
                            ?? "today";
                        filter = String(df);
                    }
                    const parsedFilter = String(filter);
                    const filterKey = parsedFilter;
                    this.dbg("🎯 Final filter used:", filterKey);
                    // Only update the attribute if it changed or was empty
                    if (el.getAttribute("data-current-filter") !== filterKey) {
                        el.setAttribute("data-current-filter", filterKey);
                    }
                    // Offline metadata hydration (so projects/labels resolve)
                    const cachedMetadata = this.storage.loadMetadata();
                    if (!Array.isArray(this.projectCache) || this.projectCache.length === 0) {
                        const proj = cachedMetadata.projects;
                        if (Array.isArray(proj) && proj.length)
                            this.projectCache = proj;
                    }
                    if (!Array.isArray(this.labelCache) || this.labelCache.length === 0) {
                        const labs = cachedMetadata.labels;
                        if (Array.isArray(labs) && labs.length)
                            this.labelCache = labs;
                    }
                    // Helper for rendering with sort toolbar
                    const renderWithSortToolbar = (tasks) => {
                        // Per-inline-board compact mode persistence key
                        const persistedCompactKeyPath = sourcePath;
                        // Clear container
                        clearEl(el);
                        // Create a wrapper for the filter row and task list, as in createLayout
                        const filterRowWrapper = activeDocument.createElement("div");
                        filterRowWrapper.className = "filter-row-wrapper";
                        filterRowWrapper.classList.add("tb-hidden"); // Hide filter bar for inline boards
                        el.appendChild(filterRowWrapper);
                        // Insert sort toolbar immediately after filterRowWrapper
                        // --- Begin Inline Sort Toolbar ---
                        const createDiv = (opts = {}) => {
                            const div = activeDocument.createElement("div");
                            if (opts.cls)
                                div.className = opts.cls;
                            return div;
                        };
                        // Prevent duplicate toolbar if render() is called twice by parent
                        const existing = el.querySelector(".inline-toolbar");
                        if (existing)
                            existing.remove();
                        const toolbar = createDiv("inline-toolbar");
                        toolbar.classList.add("tb-flex", "tb-gap-8", "tb-mb-8");
                        const sortButton = createDiv({ cls: "clickable-icon" });
                        sortButton.classList.add("tb-fs-08");
                        obsidian.setIcon(sortButton, "arrow-up-down");
                        const sortLabel = activeDocument.createElement("span");
                        // Persist sort mode per filter key
                        let currentSortMode = this.getSortMode(filterKey);
                        el.dataset.sortMode = currentSortMode;
                        this.setSortMode(filterKey, currentSortMode);
                        sortLabel.textContent = `Sort: ${currentSortMode}`;
                        sortLabel.classList.add("tb-ml-4", "tb-fs-08");
                        sortButton.appendChild(sortLabel);
                        sortButton.setAttribute("aria-label", "Sort tasks");
                        sortButton.setAttribute("role", "button");
                        a11yButton(sortButton, "Sort tasks");
                        const render = () => {
                            // Apply per-inline persisted compact mode (isolated from sidebar setting)
                            const currentFilterKey = el.getAttribute("data-current-filter") || filterKey;
                            const compactOn = getInlineCompact(persistedCompactKeyPath, currentFilterKey);
                            el.classList.toggle("compact-mode", compactOn);
                            // Remove previous list if any
                            const prevList = el.querySelector(".list-wrapper");
                            if (prevList)
                                prevList.remove();
                            // Build fresh base from cache or fetched "tasks"
                            const base = this.getViewTasks(currentFilterKey);
                            const { mode, viewTasks, projects, labels } = this.buildRenderInput(base, el, currentFilterKey);
                            // Render tasks
                            const listWrapper = activeDocument.createElement("div");
                            listWrapper.className = "list-wrapper";
                            el.appendChild(listWrapper);
                            // Ensure the newly created list reflects the inline board's own compact mode
                            if (compactOn) {
                                listWrapper.classList.add("compact-mode");
                            }
                            else {
                                listWrapper.classList.remove("compact-mode");
                            }
                            this.projectMap.clear();
                            for (const p of (projects || []))
                                this.projectMap.set(String(p.id), p);
                            void this.renderTaskList(listWrapper, sourcePath, this.settings.apiKey, { tasks: viewTasks, projects, labels });
                            // Stamp ids on direct children in the same order as viewTasks
                            const directChildren = Array.from(listWrapper.children);
                            for (let i = 0; i < directChildren.length && i < viewTasks.length; i++) {
                                const id = String(viewTasks[i]?.id || "");
                                if (id) {
                                    directChildren[i].classList.add("todoist-card");
                                    directChildren[i].dataset.taskId = id;
                                }
                            }
                            // DOM reorder to match sorted order (no-op for Manual)
                            if (mode !== "Manual") {
                                const targetOrder = new Map(viewTasks.map((t, i) => [String(t.id), i]));
                                const nodes = Array.from(listWrapper.children);
                                // Stamp any missing ids before sorting
                                nodes.forEach((n, i) => {
                                    if (!n.dataset.taskId && viewTasks[i]?.id) {
                                        n.classList.add("todoist-card");
                                        n.dataset.taskId = String(viewTasks[i].id);
                                    }
                                });
                                nodes.sort((a, b) => {
                                    const ai = targetOrder.get(String(a.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
                                    const bi = targetOrder.get(String(b.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
                                    return ai - bi;
                                });
                                nodes.forEach((n) => listWrapper.appendChild(n));
                                // Hide metadata for child (sub) tasks AND mark parents (inline boards)
                                try {
                                    const vt = viewTasks || [];
                                    const byId = new Map(vt.map((t) => [String(t.id), t]));
                                    // Build the parent-id set from the entire store so parents still mark even if children are filtered out
                                    const childParentIds = new Set(Object.values(this.taskStore || {})
                                        .filter((t) => t && t.parentId)
                                        .map((t) => String(t.parentId)));
                                    const nodes = Array.from(listWrapper.querySelectorAll("[data-task-id]"));
                                    nodes.forEach((node) => {
                                        const id = String(node.dataset.taskId || "");
                                        const t = byId.get(id);
                                        // Child rows: hide meta
                                        if (t && t.parentId) {
                                            node.classList.add("is-child-task");
                                            const hideSel = ".due-inline, .project-pill, .project-badge, .label-pill, .labels, .task-meta, .meta, .meta-span, .metadata, .task-when, .task-meta-compact";
                                            node.querySelectorAll(hideSel).forEach((el) => el.classList.add("tb-hidden"));
                                        }
                                        // Parent rows: add inline emoji marker once
                                        if (childParentIds.has(id)) {
                                            node.classList.add("has-children", "parent-task");
                                            const titleEl = node.querySelector(".task-title, .task-title-text, .task-name, .task-content, .task-title-inner") ||
                                                node.querySelector(".task-content-wrapper") ||
                                                node;
                                            if (titleEl && !titleEl.querySelector(".parent-mark")) {
                                                const mark = activeDocument.createElement("span");
                                                mark.className = "parent-mark";
                                                mark.textContent = "🔢";
                                                mark.classList.add("tb-ml-6", "tb-opacity-80", "tb-inline");
                                                titleEl.appendChild(mark); // placed at the end of the title content
                                            }
                                        }
                                    });
                                }
                                catch { }
                            }
                            // --- Populate label pill text (inline board) ---
                            try {
                                const nodes = Array.from(listWrapper.querySelectorAll("[data-task-id]"));
                                const byId = new Map(viewTasks.map((t) => [String(t.id), t]));
                                nodes.forEach((node) => {
                                    const id = String(node.dataset.taskId || "");
                                    const task = byId.get(id);
                                    // find the existing chip on this card
                                    const pill = node.querySelector("span.pill.label-pill, .pill.label-pill, .label-pill");
                                    if (!pill)
                                        return;
                                    const labs = Array.isArray(task?.labels) ? task.labels : [];
                                    const names = labs
                                        .map((lab) => {
                                        const hit = (this.labelCache || []).find((l) => String(l.id) === String(lab) ||
                                            String(l.name) === String(lab));
                                        return String(hit?.name ?? lab);
                                    })
                                        .filter((s) => s && s.trim().length > 0);
                                    if (pill.querySelector(".label-part")) {
                                        // already built by createLabelPill → keep structure, just toggle visibility
                                        pill.classList.toggle("tb-hidden", !names.length);
                                    }
                                    else {
                                        pill.textContent = names.join(", ");
                                        pill.classList.toggle("tb-hidden", !names.length);
                                    }
                                });
                            }
                            catch { }
                            // ——— Apply persisted dimming (inline board) ———
                            try {
                                const hidden = getHiddenSet();
                                const nodes = Array.from(listWrapper.querySelectorAll("[data-task-id]"));
                                nodes.forEach((node) => {
                                    const id = String(node.dataset.taskId || "");
                                    if (!id)
                                        return;
                                    applyDimClass(node, hidden.has(id));
                                });
                            }
                            catch { }
                        };
                        render();
                        // allow external refresh without destroying toolbar/sort state
                        if (el.dataset.refreshBound !== "1") {
                            el.addEventListener("todoist-inline-refresh", () => { render(); });
                            el.dataset.refreshBound = "1";
                        }
                        // Use native Obsidian Menu instead of custom dropdown
                        sortButton.onclick = (event) => {
                            try {
                                const menu = new obsidian.Menu();
                                menu.addItem((item) => item.setTitle("Due date").setIcon("calendar").onClick(() => {
                                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Due Date");
                                    currentSortMode = "Due Date";
                                    el.dataset.sortMode = currentSortMode;
                                    this.setSortMode(filterKey, currentSortMode);
                                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                                    render();
                                }));
                                menu.addItem((item) => item.setTitle("Priority").setIcon("arrow-up").onClick(() => {
                                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Priority");
                                    currentSortMode = "Priority";
                                    el.dataset.sortMode = currentSortMode;
                                    this.setSortMode(filterKey, currentSortMode);
                                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                                    render();
                                }));
                                menu.addItem((item) => item.setTitle("Alphabetical").setIcon("list-ordered").onClick(() => {
                                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Alphabetical");
                                    currentSortMode = "Alphabetical";
                                    el.dataset.sortMode = currentSortMode;
                                    this.setSortMode(filterKey, currentSortMode);
                                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                                    render();
                                }));
                                menu.addItem((item) => item.setTitle("Manual").setIcon("grip-vertical").onClick(() => {
                                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Manual");
                                    currentSortMode = "Manual";
                                    el.dataset.sortMode = currentSortMode;
                                    this.setSortMode(filterKey, currentSortMode);
                                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                                    render();
                                }));
                                menu.addSeparator();
                                menu.addItem((item) => item.setTitle("Clear sort").setIcon("x-circle").onClick(() => {
                                    // if (this.settings?.enableLogs) console.log("[Sort Click] → Clear Sort (Manual)");
                                    currentSortMode = "Manual";
                                    el.dataset.sortMode = currentSortMode;
                                    this.setSortMode(filterKey, currentSortMode);
                                    sortLabel.textContent = `Sort: ${currentSortMode}`;
                                    // if (this.settings?.enableLogs) console.log("[Sort State] mode:", currentSortMode, "dataset:", el.dataset.sortMode);
                                    render();
                                }));
                                if (event.instanceOf(MouseEvent) && typeof menu.showAtMouseEvent === "function") {
                                    menu.showAtMouseEvent(event);
                                }
                                else {
                                    const r = sortButton.getBoundingClientRect();
                                    menu.showAtPosition({ x: r.left, y: r.bottom });
                                }
                            }
                            catch (err) {
                                this.error("[Sort Button Error]", err);
                            }
                        };
                        toolbar.appendChild(sortButton);
                        // --- Capture (+) Button for inline board ---
                        const captureBtn = activeDocument.createElement("span");
                        captureBtn.className = "clickable-icon todoist-add-task-btn";
                        captureBtn.classList.add("tb-scale-125", "tb-opacity-60", "tb-flex", "tb-ai-center", "tb-justify-center", "tb-cursor-pointer");
                        obsidian.setIcon(captureBtn, "plus-circle");
                        captureBtn.title = "Add task";
                        captureBtn.onclick = () => {
                            void this.openAddTaskModal();
                        };
                        // Match hover style
                        // Hover/focus opacity now handled in CSS via .tb-opacity-60 default and hover rule
                        a11yButton(captureBtn, "Add task");
                        toolbar.appendChild(captureBtn);
                        // --- End Capture (+) Button ---
                        // --- Copy List Button ---
                        const copyBtn = activeDocument.createElement("span");
                        copyBtn.className = "clickable-icon";
                        copyBtn.classList.add("tb-scale-110", "tb-opacity-60", "tb-flex", "tb-ai-center", "tb-justify-center", "tb-cursor-pointer");
                        obsidian.setIcon(copyBtn, "copy");
                        copyBtn.title = "Copy list";
                        copyBtn.onclick = async () => {
                            try {
                                const currentFilterKey = el.getAttribute("data-current-filter") || filterKey;
                                // Build the current view using the same sorter as the renderer
                                const base = this.getViewTasks(currentFilterKey);
                                const { viewTasks } = this.buildRenderInput(base, el, currentFilterKey);
                                const lines = viewTasks.map((t) => {
                                    const title = String(t?.content || "").trim();
                                    return `- [ ] ${title}`;
                                });
                                const text = lines.join("\n");
                                if (!text) {
                                    new obsidian.Notice("No tasks to copy");
                                    return;
                                }
                                // Try Clipboard API first
                                await navigator.clipboard.writeText(text);
                                new obsidian.Notice("Copied task list");
                            }
                            catch {
                                new obsidian.Notice("Copy failed");
                            }
                        };
                        // Hover opacity handled in CSS
                        a11yButton(copyBtn, "Copy task list");
                        toolbar.appendChild(copyBtn);
                        // --- End Copy List Button ---
                        // --- Manual Sync Button ---
                        const syncButton = activeDocument.createElement("span");
                        syncButton.className = "clickable-icon";
                        obsidian.setIcon(syncButton, "refresh-cw");
                        syncButton.title = "Manual sync";
                        syncButton.onclick = async () => {
                            const currentFilter = el.getAttribute("data-current-filter") || "today";
                            // If offline, keep cache and just re-render from it
                            if (!navigator.onLine) {
                                // if (this.settings?.enableLogs) console.warn("[Manual Sync] Offline, using cached tasks.");
                                render();
                                return;
                            }
                            // Online: refresh from server
                            this.storage.removeTaskCache(currentFilter);
                            const resp = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
                            const tasks = resp?.results ?? [];
                            this.upsertTasks(currentFilter, tasks);
                            render();
                        };
                        a11yButton(syncButton, "Manual sync");
                        toolbar.appendChild(syncButton);
                        // --- Queue Toggle Button ---
                        const queueButton = activeDocument.createElement("span");
                        queueButton.className = "clickable-icon";
                        obsidian.setIcon(queueButton, "focus");
                        queueButton.title = "Toggle queue mode";
                        let queueActive = false;
                        queueButton.onclick = () => {
                            queueActive = !queueActive;
                            this.updateQueueView(queueActive, el.querySelector(".list-wrapper"));
                        };
                        a11yButton(queueButton, "Toggle queue mode");
                        toolbar.appendChild(queueButton);
                        // --- Compact Mode Toggle Button ---
                        const compactButton = activeDocument.createElement("span");
                        compactButton.className = "clickable-icon";
                        obsidian.setIcon(compactButton, "list");
                        compactButton.title = "Toggle compact mode";
                        compactButton.onclick = () => {
                            const currentFilterKey = el.getAttribute("data-current-filter") || filterKey;
                            const next = !el.classList.contains("compact-mode");
                            el.classList.toggle("compact-mode", next);
                            const lw = el.querySelector(".list-wrapper");
                            if (lw)
                                lw.classList.toggle("compact-mode", next);
                            setInlineCompact(persistedCompactKeyPath, currentFilterKey, next);
                        };
                        a11yButton(compactButton, "Toggle compact mode");
                        toolbar.appendChild(compactButton);
                        // Place toolbar at the top; inline boards hide it via CSS when needed
                        el.prepend(toolbar);
                        // --- End Inline Sort Toolbar ---
                    };
                    // Use improved cache logic for loading and rendering tasks ---
                    const storedTasks = this.storage.loadTaskCache(filterKey);
                    let cachedTasks = [];
                    if (!storedTasks.length && !navigator.onLine) {
                        const fallback = this.getViewTasks(filterKey);
                        if (Array.isArray(fallback) && fallback.length) {
                            cachedTasks = fallback;
                            this.upsertTasks(filterKey, cachedTasks, { silentSidebar: true, preferExisting: true });
                            renderWithSortToolbar();
                        }
                    }
                    if (storedTasks.length) {
                        try {
                            cachedTasks = storedTasks;
                            this.dbg("📦 Cached tasks for", filterKey, ":", cachedTasks);
                            if (Array.isArray(cachedTasks)) {
                                this.taskCache[typeof filterKey === "string" ? filterKey : JSON.stringify(filterKey)] = cachedTasks;
                                this.upsertTasks(filterKey, cachedTasks, { silentSidebar: true, preferExisting: true });
                                if (el.classList.contains("block-language-todoist-board") ||
                                    el.classList.contains("todoist-inline-board")) {
                                    renderWithSortToolbar(cachedTasks);
                                }
                                else {
                                    this.renderTodoistBoard(el, `filter: ${filterKey}`, sourcePath, this.settings.apiKey, {
                                        tasks: cachedTasks,
                                        projects: this.projectCache || [],
                                        labels: this.labelCache || [],
                                    });
                                }
                            }
                        }
                        catch {
                        }
                    }
                    if (navigator.onLine) {
                        this.fetchFilteredTasksFromREST(this.settings.apiKey, parsedFilter)
                            .then((resp) => {
                            const tasks = resp?.results ?? [];
                            this.dbg("🛰️ Live fetch results for", filterKey, ":", tasks);
                            if (Array.isArray(tasks)) {
                                this.upsertTasks(filterKey, tasks);
                                if (el.isConnected) {
                                    // Always use renderWithSortToolbar for inline boards (block-language-todoist-board or todoist-inline-board)
                                    if (el.classList.contains("block-language-todoist-board") ||
                                        el.classList.contains("todoist-inline-board")) {
                                        renderWithSortToolbar();
                                    }
                                    else {
                                        this.renderTodoistBoard(el, `filter: ${filterKey}`, sourcePath, this.settings.apiKey, {
                                            tasks,
                                            projects: this.projectCache || [],
                                            labels: this.labelCache || [],
                                        });
                                    }
                                }
                            }
                        })
                            .catch((e) => {
                            // console.warn("Fetch failed, using cached data only", e);
                        });
                    }
                });
                // Skip preloadFilters and initial metadata fetch
                // this.setupDoubleTapPrevention();
                // Ensure onLayoutReady is called with the correct `this` context (fixes TS/Rollup warning):
                window.setTimeout(this.onLayoutReady.bind(this), 1);
                // (Removed polling-based initial render block; handled in TodoistBoardView.onOpen)
                this.registerDomEvent(activeDocument, "click", this._globalClickListener);
                // Start polling for task changes after initial rendering and setup
                this.stopTaskPolling?.();
                this.stopTaskPolling = startTaskPolling(this);
            })();
        };
        this.activeTaskModal = null;
    }
    // Debug logger helpers (gated by settings.enableLogs)
    log(...args) {
        try {
            if (this.settings?.enableLogs)
                window.console?.log(...args);
        }
        catch { }
    }
    info(...args) {
        try {
            if (this.settings?.enableLogs)
                window.console?.info(...args);
        }
        catch { }
    }
    warn(...args) {
        try {
            if (this.settings?.enableLogs)
                window.console?.warn(...args);
        }
        catch { }
    }
    error(...args) {
        try {
            if (this.settings?.enableLogs)
                window.console?.error(...args);
        }
        catch { }
    }
    // Closes any Todoist Board modal (edit/add)
    closeAnyModal() {
        try {
            const modal = activeDocument.querySelector('.todoist-modal');
            if (modal && modal.parentElement)
                modal.parentElement.removeChild(modal);
        }
        catch { }
        try {
            this.closeModal();
        }
        catch { }
    }
    // Back-compat
    dbg(...args) { this.log(...args); }
    // Centralized helper for sorting and metadata selection used by all views
    buildRenderInput(base, container, filterKey) {
        const stored = this.getSortMode(filterKey);
        if (!container.dataset.sortMode)
            container.dataset.sortMode = stored;
        const mode = container.dataset.sortMode || stored;
        const projects = (Array.isArray(this.projectCache) && this.projectCache.length)
            ? this.projectCache
            : this.storage?.loadMetadata().projects || [];
        const labels = (Array.isArray(this.labelCache) && this.labelCache.length)
            ? this.labelCache
            : this.storage?.loadMetadata().labels || [];
        return buildRenderInput({
            base: Array.isArray(base) ? base : [],
            mode,
            timezone: getZone(this.settings),
            projects,
            labels,
        });
    }
    // Sort state helpers
    getSortMode(filterKey) {
        this.ensureRefactoredRuntime();
        return this.storage.getSortMode(String(filterKey));
    }
    setSortMode(filterKey, mode) {
        this.ensureRefactoredRuntime();
        this.storage.setSortMode(String(filterKey), mode);
    }
    // --- unified sorter ---
    sortTasksLikeTodoist(arr, mode) {
        return sortTasksLikeTodoist(Array.isArray(arr) ? arr : [], mode, getZone(this.settings));
    }
    async ensurePluginReady() {
        if (this._ready)
            return;
        this.ensureRefactoredRuntime(this.settings.apiKey);
        if (!this.projectCache || this.projectCache.length === 0) {
            const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
            this.projectCache = metadata.projects;
            this.labelCache = metadata.labels;
            this.projectCacheTimestamp = Date.now();
            this.labelCacheTimestamp = Date.now();
        }
        await this.preloadFilters();
        this._ready = true;
    }
    setCurrentFilter(filter) {
        this.currentFilter = filter;
    }
    ensureRefactoredRuntime(apiKey = this.settings?.apiKey || "") {
        if (!this.storage)
            this.storage = new TodoistBoardStorage(this.app);
        if (!this.taskStoreController) {
            this.taskStoreController = new TaskStore(this.storage);
            const filters = (this.settings?.filters || DEFAULT_SETTINGS.filters || [])
                .map((filter) => String(filter.filter));
            this.taskStoreController.hydrate(filters);
            this.syncTaskStoreRefs();
        }
        if (!this.todoistService) {
            this.todoistService = new TodoistService(apiKey, {
                getCachedTasks: (filterKey) => this.getViewTasks(filterKey),
            });
            this.todoistApi = this.todoistService.getApi();
            window.todoistApi = this.todoistApi;
        }
        else {
            this.todoistService.setApiKey(apiKey);
            this.todoistApi = this.todoistService.getApi();
            window.todoistApi = this.todoistApi;
        }
    }
    syncTaskStoreRefs() {
        if (!this.taskStoreController)
            return;
        this.taskStore = this.taskStoreController.tasksById;
        this.filterIndex = this.taskStoreController.filterIndex;
        this.taskCache = this.taskStoreController.taskCache;
        this.taskCacheTimestamps = this.taskStoreController.timestamps;
    }
    async validateTodoistApiKey(apiKey) {
        this.ensureRefactoredRuntime(apiKey);
        return this.todoistService.validateApiKey(apiKey);
    }
    // ---- Single-source helpers ----
    upsertTasks(filterKey, tasks, opts) {
        this.ensureRefactoredRuntime();
        const { changed } = this.taskStoreController.upsert(String(filterKey), Array.isArray(tasks) ? tasks : [], {
            preferExisting: opts?.preferExisting,
        });
        this.syncTaskStoreRefs();
        // Re-render all visible sidebar boards immediately (event-driven, like inline)
        // Avoid echo loops when upsert is called from within render paths
        if (changed && !opts?.silentSidebar) {
            try {
                const boards = Array.from(activeDocument.querySelectorAll(".todoist-board.plugin-view"));
                boards.forEach((board) => {
                    const f = board.getAttribute("data-current-filter") || "today";
                    const tasksForView = this.getViewTasks(f);
                    this.renderTodoistBoard(board, `filter: ${f}`, {}, this.settings.apiKey, { tasks: tasksForView, projects: this.projectCache, labels: this.labelCache });
                    const badge = board.querySelector(`.filter-row[data-filter="${f}"] .filter-badge-count`);
                    if (badge)
                        badge.textContent = this.formatFilterCount(tasksForView.length, Boolean(this.filterNextCursor[f]));
                });
            }
            catch { }
        }
        this.refreshAllInlineBoards();
    }
    deleteTaskEverywhere(taskId) {
        this.ensureRefactoredRuntime();
        this.taskStoreController.removeEverywhere(String(taskId));
        this.syncTaskStoreRefs();
        this.refreshAllInlineBoards();
    }
    getViewTasks(filterKey) {
        this.ensureRefactoredRuntime();
        return this.taskStoreController.getViewTasks(String(filterKey));
    }
    async fetchFilteredTasksFromREST(apiKey, args, options = {}) {
        const filterKey = typeof args === "string" ? args : "today";
        this.ensureRefactoredRuntime(apiKey);
        const result = await this.todoistService.fetchFilteredTasks(filterKey, {
            cursor: options.cursor,
            limit: this.taskPageSize,
        });
        this.filterNextCursor[filterKey] = result.nextCursor || null;
        return {
            results: Array.isArray(result.results) ? result.results : [],
            nextCursor: result.nextCursor || null,
            hasMore: Boolean(result.nextCursor),
            source: result.source,
        };
    }
    async fetchMetadataFromSync(apiKey) {
        this.ensureRefactoredRuntime(apiKey);
        const metadata = await this.todoistService.fetchMetadata();
        if (metadata.projects.length || metadata.labels.length || metadata.sections.length) {
            this.storage.saveMetadata(metadata);
            return metadata;
        }
        return this.storage.loadMetadata();
    }
    async loadSettings() {
        const saved = await this.loadData();
        this.settings = normalizeSettings(saved);
    }
    async saveSettings() {
        await this.saveData(this.settings);
        // refresh inline boards
        activeDocument.querySelectorAll(".todoist-inline-board").forEach((el) => {
            el.dispatchEvent(new CustomEvent("todoist-inline-refresh", { bubbles: true }));
        });
        // update sidebar boards right away
        activeDocument.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
            const on = !!this.settings.compactMode;
            const list = el.querySelector(".list-wrapper");
            if (list)
                list.classList.toggle("compact-mode", on);
        });
    }
    formatFilterCount(count, hasMore = false) {
        if (hasMore || count > this.taskPageSize)
            return `${this.taskPageSize}+`;
        return String(count);
    }
    mergeTaskLists(existing, incoming) {
        const byId = new Map();
        for (const task of Array.isArray(existing) ? existing : []) {
            const id = String(task?.id ?? "");
            if (id)
                byId.set(id, task);
        }
        for (const task of Array.isArray(incoming) ? incoming : []) {
            const id = String(task?.id ?? "");
            if (id)
                byId.set(id, task);
        }
        return Array.from(byId.values());
    }
    getFilterRow(container, filterKey) {
        return Array.from(container.querySelectorAll(".filter-row"))
            .find((row) => row.getAttribute("data-filter") === String(filterKey)) || null;
    }
    updateFilterBadge(container, filterKey, count, hasMore = false) {
        const row = this.getFilterRow(container, filterKey) || activeDocument.querySelector(`.filter-row[data-filter="${filterKey}"]`);
        const badge = row?.querySelector(".filter-badge-count");
        const badgeShell = row?.querySelector(".filter-badge");
        if (badgeShell)
            badgeShell.style.display = row?.classList.contains("selected") ? "" : "none";
        if (badge)
            badge.textContent = this.formatFilterCount(count, hasMore);
    }
    updateVisibleFilterBadges(container) {
        container.querySelectorAll(".filter-row").forEach((row) => {
            const badge = row.querySelector(".filter-badge");
            if (badge)
                badge.style.display = row.classList.contains("selected") ? "" : "none";
        });
    }
    showFilterLoading(container, filterKey, visibleTaskCount = 0) {
        container.classList.add("is-loading-filter");
        const row = this.getFilterRow(container, filterKey);
        row?.classList.add("is-loading");
        const listWrapper = container.querySelector(".list-wrapper");
        if (!listWrapper)
            return;
        listWrapper.classList.add("is-loading-filter");
        const title = row?.querySelector(".filter-title")?.textContent || "tasks";
        if (visibleTaskCount <= 0) {
            clearEl(listWrapper);
            listWrapper.appendChild(this.createTaskLoadingState(`Loading ${title}...`));
            return;
        }
        if (!listWrapper.querySelector(".task-loading-inline")) {
            const inline = this.createTaskLoadingState(`Refreshing ${title}...`);
            inline.classList.add("task-loading-inline");
            listWrapper.prepend(inline);
        }
    }
    hideFilterLoading(container, filterKey) {
        container.classList.remove("is-loading-filter");
        this.getFilterRow(container, filterKey)?.classList.remove("is-loading");
        const listWrapper = container.querySelector(".list-wrapper");
        listWrapper?.classList.remove("is-loading-filter");
        listWrapper?.querySelectorAll(".task-loading-state").forEach((el) => el.remove());
    }
    createTaskLoadingState(message) {
        const state = activeDocument.createElement("div");
        state.className = "task-loading-state";
        const spinner = state.createSpan({ cls: "task-loading-spinner" });
        spinner.setAttribute("aria-hidden", "true");
        state.createSpan({ cls: "task-loading-text", text: message });
        return state;
    }
    appendLoadMoreButton(listWrapper, filterKey, apiKey) {
        const key = String(filterKey || "");
        const cursor = this.filterNextCursor[key];
        if (!key || !cursor || listWrapper.querySelector(".todoist-load-more-wrapper"))
            return;
        const wrapper = activeDocument.createElement("div");
        wrapper.className = "todoist-load-more-wrapper";
        const button = activeDocument.createElement("button");
        button.className = "todoist-load-more";
        button.textContent = "Load more";
        button.onclick = async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const nextCursor = this.filterNextCursor[key];
            if (!nextCursor)
                return;
            button.disabled = true;
            button.textContent = "Loading...";
            try {
                const response = await this.fetchFilteredTasksFromREST(apiKey, key, { cursor: nextCursor });
                const incoming = Array.isArray(response.results) ? response.results : [];
                const combined = this.mergeTaskLists(this.getViewTasks(key), incoming);
                this.upsertTasks(key, combined, { silentSidebar: true });
                this.taskCacheTimestamps[key] = Date.now();
                this.storage.saveTaskCache(key, combined, Date.now());
                this.updateFilterBadge(listWrapper.closest(".todoist-board") || activeDocument.body, key, combined.length, Boolean(response.nextCursor));
                const board = listWrapper.closest(".todoist-board");
                if (board) {
                    this.renderTodoistBoard(board, `filter: ${key}`, {}, apiKey, {
                        tasks: combined,
                        sections: [],
                        projects: this.projectCache || [],
                        labels: this.labelCache || [],
                    });
                }
            }
            catch {
                button.disabled = false;
                button.textContent = "Load more";
                new obsidian.Notice("Could not load more tasks");
            }
        };
        wrapper.appendChild(button);
        listWrapper.appendChild(wrapper);
    }
    // ======================= 🔄 Refresh All Inline Boards =======================
    refreshAllInlineBoards() {
        activeDocument.querySelectorAll(".todoist-inline-board").forEach((el) => {
            el.dispatchEvent(new CustomEvent("todoist-inline-refresh", { bubbles: true }));
        });
    }
    async preloadFilters() {
        const now = Date.now();
        const cacheTTL = 24 * 60 * 60 * 1000;
        const filters = this.settings.filters || DEFAULT_SETTINGS.filters;
        await Promise.all(filters.map(async (f) => {
            try {
                const key = f.filter;
                const localTasks = this.storage.loadTaskCache(key);
                const timestamp = this.storage.getTaskCacheTimestamp(key);
                if (localTasks.length && now - timestamp < cacheTTL) {
                    this.taskCache[key] = localTasks;
                    // Insert safety check: ensure it's always an array
                    if (!Array.isArray(this.taskCache[key])) {
                        this.taskCache[key] = [];
                    }
                    this.taskCacheTimestamps[key] = timestamp;
                    // Fully await fetchFilteredTasksFromREST and handle changes synchronously
                    const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
                    const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
                    let oldTasks = this.taskCache[key];
                    if (!Array.isArray(oldTasks))
                        oldTasks = [];
                    const oldIds = new Set(oldTasks.map((t) => t.id));
                    const newIds = new Set(Array.isArray(tasks) ? tasks.map((t) => t.id) : []);
                    const hasChanges = oldTasks.length !== (Array.isArray(tasks) ? tasks.length : 0) ||
                        (Array.isArray(tasks) && tasks.some((t) => !oldIds.has(t.id))) ||
                        oldTasks.some((t) => !newIds.has(t.id));
                    if (hasChanges) {
                        this.upsertTasks(key, Array.isArray(tasks) ? tasks : []);
                        this.taskCacheTimestamps[key] = Date.now();
                    }
                    const currentFilter = activeDocument.querySelector(".todoist-board.plugin-view")?.getAttribute("data-current-filter");
                    if (hasChanges && currentFilter === key) {
                        const container = activeDocument.querySelector(".todoist-board.plugin-view");
                        if (container) {
                            clearEl(container);
                            this.renderTodoistBoard(container, `filter: ${key}`, {}, this.settings.apiKey);
                        }
                    }
                }
                else {
                    const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
                    const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
                    this.upsertTasks(key, Array.isArray(tasks) ? tasks : []);
                    this.taskCacheTimestamps[key] = now;
                }
            }
            catch {
            }
        }));
    }
    async completeTask(taskId) {
        this.ensureRefactoredRuntime(this.settings.apiKey);
        await this.todoistService.completeTask(taskId);
        this.deleteTaskEverywhere(String(taskId));
        // Re-render all visible boards so every filter reflects the change
        const boards = Array.from(activeDocument.querySelectorAll(".todoist-board.plugin-view"));
        boards.forEach((board) => {
            const f = board.getAttribute("data-current-filter") || "today";
            const tasks = this.getViewTasks(f);
            this.renderTodoistBoard(board, `filter: ${f}`, {}, this.settings.apiKey, {
                tasks,
                projects: this.projectCache,
                labels: this.labelCache
            });
            const selected = board.querySelector(".todoist-card.selected");
            if (selected)
                selected.classList.remove("selected");
            // update badge in this toolbar
            const badge = board.querySelector(`.filter-row[data-filter="${f}"] .filter-badge-count`);
            if (badge)
                badge.textContent = this.formatFilterCount(tasks.length, Boolean(this.filterNextCursor[f]));
        });
        this.refreshAllInlineBoards();
    }
    // ======================= 🏁 Auto-render Default Filter on Startup =======================
    // This block ensures the default filter's board is rendered immediately after UI is ready.
    // Inserted at the end of onload().
    // It waits for DOM elements to be present, then triggers the default filter render.
    async onLayoutReady() {
        // Wait for DOM to be ready (filter bar and board container rendered)
        // We'll use a short interval to check for elements.
        const tryRenderDefault = () => {
            const container = activeDocument.querySelector(".todoist-board.plugin-view");
            const defaultFilterRow = container?.querySelector(".filter-row[data-filter]");
            if (defaultFilterRow && container) {
                const source = defaultFilterRow.getAttribute("data-filter") || "today";
                const prev = container.getAttribute("data-current-filter");
                if (prev !== String(source))
                    container.setAttribute("data-current-filter", String(source));
                clearEl(container);
                this.renderTodoistBoard(container, `filter: ${String(source)}`, {}, this.settings.apiKey, {
                    tasks: this.getViewTasks(String(source)),
                    sections: [],
                    projects: this.projectCache,
                    labels: this.labelCache
                });
                activeDocument.querySelectorAll(".filter-row").forEach(el => el.classList.remove("selected"));
                defaultFilterRow.classList.add("selected");
                return true;
            }
            return false;
        };
        // Try immediately, then poll for up to 1s.
        if (tryRenderDefault())
            return;
        let tries = 0;
        // (Removed recursive setTimeout to prevent runaway retries)
        const interval = window.setInterval(() => {
            if (tryRenderDefault() || ++tries > 20)
                window.clearInterval(interval);
        }, 50);
    }
    // ======================= 🧹 Persistence & Cleanup =======================
    async savePluginData() {
        await this.saveData(this.settings);
        this.refreshAllInlineBoards();
    }
    onunload() {
        this.stopTaskPolling?.();
        this.stopTaskPolling = undefined;
        // Remove global event listener
        activeDocument.removeEventListener("click", this._globalClickListener);
        // Failsafe: always clear drag/body locks
        activeDocument.body.classList.remove("drag-disable", "tb-scroll-lock");
        // Clear dropdowns
        const allDropdowns = activeDocument.querySelectorAll(".menu-dropdown-wrapper");
        allDropdowns.forEach(dropdown => dropdown.remove());
        // Clear polling intervals
        if (this._pollInterval !== undefined) {
            window.clearInterval(this._pollInterval);
            this._pollInterval = undefined;
        }
        if (this._taskChangeInterval !== undefined) {
            window.clearInterval(this._taskChangeInterval);
            this._taskChangeInterval = undefined;
        }
        // Remove any floating toolbars
        const toolbars = activeDocument.querySelectorAll("#mini-toolbar-wrapper");
        toolbars.forEach(toolbar => toolbar.remove());
        // Remove loading overlay
        if (this.loadingOverlay?.parentElement) {
            this.loadingOverlay.remove();
        }
        // Remove UI injected elements (e.g., .todoist-board, .todoist-plugin-ui if any)
        activeDocument.querySelectorAll('.todoist-plugin-ui').forEach(el => el.remove());
        // Remove menu dropdowns that might have been appended to body
        activeDocument.querySelectorAll('.menu-dropdown-wrapper').forEach(el => el.remove());
        // Disconnect mutation observers if any
        if (this._mutationObservers && this._mutationObservers.length > 0) {
            this._mutationObservers.forEach(obs => obs.disconnect());
            this._mutationObservers = [];
        }
        // Remove all .todoist-board elements from DOM
        activeDocument.querySelectorAll('.todoist-board').forEach(el => el.remove());
        this.closeModal();
    }
    // ======================= 🧱 Board Renderer =======================
    async render(...args) {
        // --- Ensure projectMap is rebuilt from projectCache at the beginning ---
        this.projectMap.clear();
        this.projectCache.forEach((p) => this.projectMap.set(p.id, p));
        // Ensure due time is included in fetched tasks by passing as_time: true
        // no-op fetch removed to avoid extra network calls per render
        this.renderTodoistBoard(...(args ?? []));
    }
    /**
     * Forces re-sorting and re-rendering of the task list according to the current sort option.
     */
    rerenderTasks() {
        const boards = Array.from(activeDocument.querySelectorAll(".todoist-board.plugin-view"));
        boards.forEach((container) => {
            const currentFilter = container.getAttribute("data-current-filter") || "";
            const tasks = this.getViewTasks(currentFilter);
            this.renderTodoistBoard(container, `filter: ${currentFilter}`, {}, this.settings.apiKey, {
                tasks,
                projects: this.projectCache,
                labels: this.labelCache,
                sections: []
            });
        });
    }
    renderTodoistBoard(...args) {
        // Extract parameters for backwards compatibility
        let [container, source, ctx, apiKey, initialData = { tasks: [], sections: [], projects: [], labels: [] }] = args;
        // If a render is in progress, queue one more pass and bail
        if (container.getAttribute("data-rendering") === "true") {
            container.setAttribute("data-render-pending", "1");
            return;
        }
        const renderToken = String(Date.now()) + ":" + Math.random().toString(36).slice(2);
        container.setAttribute("data-rendering", "true");
        container.setAttribute("data-render-token", renderToken);
        try {
            // --- Always proceed with rendering, even if same filter and task count ---
            const currentFilter = container.getAttribute("data-current-filter") || "";
            let tasks = [];
            let projects = [];
            // If initialData provided, prefer its projects; else use this.projectCache
            if (initialData && Array.isArray(initialData.projects)) {
                projects = initialData.projects;
            }
            else if (Array.isArray(this.projectCache)) {
                projects = this.projectCache;
            }
            // If projectMap is empty, try to load from cached metadata as fallback ---
            if (this.projectMap.size === 0) {
                const cachedProjects = this.storage.loadMetadata().projects;
                if (Array.isArray(cachedProjects) && cachedProjects.length) {
                    this.projectCache = cachedProjects;
                    this.projectMap.clear();
                    for (const project of cachedProjects) {
                        this.projectMap.set(String(project.id), project);
                    }
                }
            }
            // Update projectMap before rendering ---
            this.projectMap.clear();
            for (const project of projects) {
                this.projectMap.set(String(project.id), project);
            }
            // Use tasks from initialData, not from persisted cache ---
            // Do NOT sort the tasks, preserve the order as passed in
            const taskList = initialData.tasks || [];
            // Fallback to persisted task cache if needed ---
            if ((!Array.isArray(taskList) || taskList.length === 0) && currentFilter) {
                const fallback = this.storage.loadTaskCache(currentFilter);
                // merge cache non-destructively into the store
                this.upsertTasks(currentFilter, Array.isArray(fallback) ? fallback : [], { silentSidebar: true, preferExisting: true });
                // always render from the authoritative store
                tasks = this.getViewTasks(currentFilter);
            }
            else {
                tasks = [...taskList];
            }
            clearEl(container);
            const currentKey = `${currentFilter}:${tasks?.length || 0}`;
            container.setAttribute("data-prev-render-key", currentKey);
            // Sync in-memory cache with current tasks
            this.upsertTasks(currentFilter, tasks, { silentSidebar: true });
            // If no tasks or not an array, skip render and warn
            if (!tasks || !Array.isArray(tasks)) {
                return;
            }
            if (this.loadingOverlay) {
                this.loadingOverlay.classList.add("is-visible");
            }
            let cachedTasks = tasks;
            let defaultFilter = currentFilter;
            try {
                if (!container.dataset.sortMode)
                    container.dataset.sortMode = this.getSortMode(currentFilter);
                this.setupContainer(container);
                if (container.classList.contains("plugin-view")) {
                    container.classList.toggle("compact-mode", this.compactMode);
                }
                // 🧪 Log compact mode application
                // // if (this.settings?.enableLogs) console.log("🧪 Compact mode applied?", this.compactMode, "→ container:", container, "→ has class?", container.classList.contains("compact-mode"));
                const filterOptions = this.getFilterOptions();
                const rawSource = source;
                const hideToolbar = /\btoolbar:\s*false\b/i.test(rawSource);
                source = this.getSourceOrDefault(rawSource, filterOptions);
                // Insert reading mode class logic after root .todoist-board element is created
                const todoistBoardEl = container;
                // Add class to handle reading mode layout
                if (container.closest(".markdown-reading-view")) {
                    todoistBoardEl.classList.add("reading-mode");
                }
                const { toolbar, listWrapper } = this.createLayout(container);
                // Only apply compact to the sidebar's list wrapper
                {
                    const isSidebar = container.classList.contains("plugin-view");
                    if (isSidebar)
                        listWrapper.classList.toggle("compact-mode", this.compactMode);
                }
                // Hide the entire toolbar for inline boards (markdown blocks / reading mode)
                const inlineBoard = container.classList.contains("block-language-todoist-board") || !!container.closest(".markdown-reading-view");
                if (inlineBoard) {
                    window.requestAnimationFrame(() => {
                        toolbar.classList.add("tb-hidden");
                    });
                }
                const skipToolbar = hideToolbar || inlineBoard;
                if (skipToolbar) {
                    toolbar.classList.add("hide-toolbar", "tb-hidden");
                }
                else {
                    this.renderToolbar(toolbar, filterOptions, source, container, ctx, apiKey, listWrapper);
                }
                // --- sort for plugin view and render via centralized helper ---
                const filterKey = currentFilter;
                if (!container.dataset.sortMode) {
                    container.dataset.sortMode = this.getSortMode(filterKey);
                }
                const baseForView = Array.isArray(tasks) ? tasks.slice() : [];
                const { mode, viewTasks, projects: projectsForRender, labels: labelsForRender } = this.buildRenderInput(baseForView, container, filterKey);
                void this.renderTaskList(listWrapper, source, apiKey, { tasks: viewTasks, projects: projectsForRender, labels: labelsForRender });
                // Keep DOM order in sync with viewTasks (plugin view)
                try {
                    if (mode !== "Manual") {
                        const targetOrder = new Map(viewTasks.map((t, i) => [String(t.id), i]));
                        const children = Array.from(listWrapper.children);
                        // Stamp ids if missing
                        children.forEach((n, i) => {
                            const id = String(viewTasks[i]?.id || n.dataset.taskId || "");
                            if (id) {
                                n.classList.add("todoist-card");
                                n.dataset.taskId = id;
                            }
                        });
                        children.sort((a, b) => {
                            const ai = targetOrder.get(String(a.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
                            const bi = targetOrder.get(String(b.dataset.taskId || "")) ?? Number.MAX_SAFE_INTEGER;
                            return ai - bi;
                        });
                        children.forEach((n) => listWrapper.appendChild(n));
                        // Hide child metadata AND mark parents (sidebar/plugin board)
                        try {
                            const byId = new Map(viewTasks.map((t) => [String(t.id), t]));
                            const childParentIds = new Set(Object.values(this.taskStore || {})
                                .filter((t) => t && t.parentId)
                                .map((t) => String(t.parentId)));
                            const nodes = Array.from(listWrapper.querySelectorAll("[data-task-id]"));
                            nodes.forEach((node) => {
                                const id = String(node.dataset.taskId || "");
                                const t = byId.get(id);
                                // Hide meta for child rows
                                if (t && t.parentId) {
                                    node.classList.add("is-child-task");
                                    const hideSel = ".due-inline, .project-pill, .project-badge, .label-pill, .labels, .task-meta, .meta, .meta-span, .metadata, .task-when, .task-meta-compact";
                                    node.querySelectorAll(hideSel).forEach((el) => el.classList.add("tb-hidden"));
                                }
                                // Mark parent rows
                                if (childParentIds.has(id)) {
                                    node.classList.add("has-children", "parent-task");
                                    const titleEl = node.querySelector(".task-title, .task-title-text, .task-name, .task-content, .task-title-inner") ||
                                        node.querySelector(".task-content-wrapper") ||
                                        node;
                                    if (titleEl && !titleEl.querySelector(".parent-mark")) {
                                        const mark = activeDocument.createElement("span");
                                        mark.className = "parent-mark";
                                        mark.textContent = "🔢";
                                        mark.classList.add("tb-ml-6", "tb-opacity-80", "tb-inline");
                                        titleEl.appendChild(mark); // placed at the end of the title content
                                    }
                                }
                            });
                        }
                        catch { }
                    }
                    // --- Populate label pill text (sidebar/plugin board) ---
                    try {
                        const nodes2 = Array.from(listWrapper.querySelectorAll("[data-task-id]"));
                        const byId2 = new Map(viewTasks.map((t) => [String(t.id), t]));
                        nodes2.forEach((node) => {
                            const id = String(node.dataset.taskId || "");
                            const task = byId2.get(id);
                            const pill = node.querySelector("span.pill.label-pill");
                            if (!pill)
                                return;
                            const labs = Array.isArray(task?.labels) ? task.labels : [];
                            const names = labs.map((lab) => {
                                const hit = (this.labelCache || []).find((l) => String(l.id) === String(lab) || String(l.name) === String(lab));
                                return String(hit?.name ?? lab);
                            }).filter((s) => s && s.trim().length > 0);
                            if (pill.querySelector(".label-part")) {
                                pill.classList.toggle("tb-hidden", !names.length);
                            }
                            else {
                                pill.textContent = names.join(", ");
                                pill.classList.toggle("tb-hidden", !names.length);
                            }
                        });
                    }
                    catch { }
                    // ——— Apply persisted dimming (sidebar/plugin board) ———
                    try {
                        const hidden = getHiddenSet();
                        const nodes2 = Array.from(listWrapper.querySelectorAll("[data-task-id]"));
                        nodes2.forEach((node) => {
                            const id = String(node.dataset.taskId || "");
                            if (!id)
                                return;
                            applyDimClass(node, hidden.has(id));
                        });
                    }
                    catch { }
                }
                catch { }
                // Fetch metadata in background if stale, then re-render
                const now = Date.now();
                const metadataCacheTTL = 5 * 60 * 1000;
                const metadataFresh = this.projectCache && (now - this.projectCacheTimestamp < metadataCacheTTL);
                if (!metadataFresh) {
                    void this.fetchMetadataFromSync(apiKey).then(metadata => {
                        this.projectCache = metadata.projects;
                        this.labelCache = metadata.labels;
                        this.projectCacheTimestamp = now;
                        this.labelCacheTimestamp = now;
                        // Inline boards keep their own sort & render
                        if (container.classList.contains("todoist-inline-board")) {
                            container.dispatchEvent(new CustomEvent("todoist-inline-refresh", { bubbles: true }));
                        }
                        else {
                            this.renderTodoistBoard(container, source, ctx, apiKey);
                        }
                    });
                }
                this.setupGlobalEventListeners();
                this.setupMutationObserver(container);
                // Save the rendered tasks to the persisted task cache after successful render ---
                if (Array.isArray(cachedTasks)) {
                    try {
                        this.storage.saveTaskCache(defaultFilter, cachedTasks);
                    }
                    catch {
                    }
                }
            }
            finally {
                if (this.loadingOverlay) {
                    this.loadingOverlay.classList.remove("is-visible");
                }
            }
        }
        finally {
            const still = container.getAttribute("data-render-token");
            if (still === renderToken) {
                container.removeAttribute("data-rendering");
                container.removeAttribute("data-render-token");
                // If a rerender was requested while we were busy, run it now
                if (container.getAttribute("data-render-pending") === "1") {
                    container.removeAttribute("data-render-pending");
                    queueMicrotask(() => this.renderTodoistBoard(container, source, ctx, apiKey));
                }
            }
        }
    }
    setupContainer(container) {
        container.classList.add("todoist-board");
        container.onpointerup = () => {
            window.getSelection()?.removeAllRanges();
        };
        if (this.loadingOverlay && !container.contains(this.loadingOverlay)) {
            container.appendChild(this.loadingOverlay);
        }
        // Ensure compact mode class is toggled according to this.compactMode
        container.classList.toggle("compact-mode", this.compactMode);
    }
    createLayout(container) {
        container.empty();
        const listToolbar = activeDocument.createElement("div");
        listToolbar.className = "list-toolbar";
        container.appendChild(listToolbar);
        if (container.classList.contains("block-language-todoist-board") || container.closest(".markdown-reading-view")) {
            listToolbar.classList.add("tb-hidden");
        }
        const listView = activeDocument.createElement("div");
        listView.classList.add("list-view");
        const listWrapper = activeDocument.createElement("div");
        listWrapper.className = "list-wrapper";
        listWrapper.classList.toggle("compact-mode", this.compactMode);
        listView.appendChild(listWrapper);
        container.appendChild(listView);
        return { toolbar: listToolbar, listWrapper };
    }
    getFilterOptions() {
        // If you want to use the dynamically generated default filters, insert logic here.
        // However, this method is for returning the filter *list* for the toolbar, which is from settings.
        return (this.settings.filters && this.settings.filters.length > 0)
            ? this.settings.filters
            : DEFAULT_SETTINGS.filters;
    }
    getSourceOrDefault(source, filterOptions) {
        if (!source || !source.trim()) {
            const defaultFilterObj = filterOptions.find(f => f.isDefault) || filterOptions[0];
            return `filter: ${defaultFilterObj?.filter}`;
        }
        // Remove any 'toolbar:' line from the source
        return source
            .split("\n")
            .filter(line => !line.trim().toLowerCase().startsWith("toolbar:"))
            .join("\n");
    }
    // ======================= 🛠️ Toolbar Rendering =======================
    renderToolbar(toolbar, filterOptions, source, container, ctx, apiKey, listWrapper) {
        // Utility for div creation
        const createDiv = (opts = {}) => {
            const el = activeDocument.createElement("div");
            if (opts.cls)
                el.className = opts.cls;
            return el;
        };
        // Outer wrapper for the filter row
        const filterWrapper = createDiv({ cls: "filter-row-wrapper" });
        // Ensure filterBar is created with the proper class
        const filterBar = createDiv({ cls: "filter-bar" });
        // Find the current selected filter index (from state or from source)
        let initialIndex = 0;
        const matchIdx = filterOptions.findIndex(opt => source.trim() === `filter: ${opt.filter}`);
        if (matchIdx !== -1) {
            initialIndex = matchIdx;
        }
        else {
            const defaultIdx = filterOptions.findIndex((f) => f.isDefault);
            if (defaultIdx !== -1)
                initialIndex = defaultIdx;
        }
        selectedFilterIndex = initialIndex;
        // Render all .filter-row elements (buttons)
        filterOptions.forEach((opt, idx) => {
            const filterRow = activeDocument.createElement("div");
            filterRow.className = "filter-row";
            clearEl(filterRow);
            const iconSpan = filterRow.createSpan({ cls: "filter-icon" });
            // If you have an icon name on the option, use it; else fall back.
            try {
                obsidian.setIcon(iconSpan, String(opt?.icon ?? "filter"));
            }
            catch { }
            filterRow.createSpan({ cls: "filter-title", text: String(opt?.title ?? "") });
            filterRow.setAttribute("data-filter", opt.filter);
            const iconEl = filterRow.querySelector(".filter-icon");
            obsidian.setIcon(iconEl, opt.icon || "star");
            // --- Begin updated badge code with background and count layering ---
            const badge = activeDocument.createElement("span");
            badge.className = "filter-badge";
            const badgeBg = activeDocument.createElement("span");
            badgeBg.className = "filter-badge-bg";
            const badgeCount = activeDocument.createElement("span");
            badgeCount.className = "filter-badge-count";
            // Use persisted cache to get the latest count for this filter
            const filterCount = this.storage.getCountForFilter(String(opt.filter), this.taskCache);
            badgeCount.textContent = this.formatFilterCount(filterCount, Boolean(this.filterNextCursor[String(opt.filter)]));
            badge.appendChild(badgeBg);
            badge.appendChild(badgeCount);
            // Assign the background color to the icon container instead
            if (opt.color) {
                filterRow?.setCssProps({ "--badge-bg": opt.color });
                badge.setCssProps({ "--badge-color": "white" });
            }
            if (iconEl)
                iconEl.appendChild(badge);
            // --- End badge code ---
            badge.style.display = idx === selectedFilterIndex ? "" : "none";
            if (idx === selectedFilterIndex) {
                filterRow.classList.add("selected");
            }
            // Use addEventListener for click, with event handling for reading/live preview ---
            filterRow.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Clear selected class from all
                container.querySelectorAll(".filter-row").forEach(el => el.classList.remove("selected"));
                // Mark this one selected
                filterRow.classList.add("selected");
                this.updateVisibleFilterBadges(container);
                // Update data-current-filter attribute and always force a re-render, even if the same filter is clicked again
                const todoistBoardEl = container.closest(".todoist-board.plugin-view");
                if (todoistBoardEl) {
                    todoistBoardEl.setAttribute("data-current-filter", String(opt.filter));
                    this.showFilterLoading(todoistBoardEl, String(opt.filter), this.storage.getCountForFilter(String(opt.filter), this.taskCache));
                    void this.handleFilterClick(opt, todoistBoardEl, ctx, this.settings.apiKey);
                }
            });
            filterBar.appendChild(filterRow);
        });
        // Add queue and settings/refresh buttons
        const queueWrapper = this.createQueueButton(listWrapper);
        const settingsRefreshWrapper = this.createSettingsRefreshButtons(container, source, ctx, apiKey);
        // filterBar.appendChild(queueWrapper); // Move queueWrapper out of filterBar
        // --- Wrap the filterBar with filterWrapper ---
        filterWrapper.appendChild(filterBar);
        // --- Begin: Add Capture (+) Button before settings/refresh buttons ---
        // Create Capture (+) Button using Obsidian icon
        const captureBtn = activeDocument.createElement("span");
        captureBtn.className = "add-task-btn clickable-icon";
        obsidian.setIcon(captureBtn, "plus-circle");
        captureBtn.title = "Add task";
        captureBtn.addClass("capture-btn");
        captureBtn.onclick = () => {
            void this.openAddTaskModal();
        };
        // --- End: Add Capture (+) Button ---
        // Set queue icon color to black
        queueWrapper.querySelector(".queue-btn");
        toolbar.appendChild(filterWrapper);
        toolbar.appendChild(queueWrapper);
        toolbar.appendChild(captureBtn);
        toolbar.appendChild(settingsRefreshWrapper);
    }
    // ======================= ✏️ Async Edit Modal (instant open, lazy hydrate) =======================
    /**
     * Move a task to a new project/section/parent using the official REST endpoint.
     * Used as a fallback if SDK moveTasks is unavailable or fails.
     */
    async moveTaskREST(taskId, payload) {
        this.ensureRefactoredRuntime(this.settings.apiKey);
        return this.todoistService.moveTaskREST(taskId, payload);
    }
    closeModal() {
        if (this.activeTaskModal) {
            this.activeTaskModal.close();
            this.activeTaskModal = null;
        }
    }
    confirmDeleteTask() {
        return new Promise((resolve) => {
            const modal = new obsidian.Modal(this.app);
            let settled = false;
            const closeWith = (value) => {
                settled = true;
                resolve(value);
                modal.close();
            };
            modal.containerEl.classList.add("todoist-confirm-modal");
            modal.setTitle("Delete task?");
            modal.contentEl.createEl("p", {
                text: "This action cannot be undone.",
                cls: "todoist-confirm-message",
            });
            const actions = modal.contentEl.createDiv({ cls: "todoist-confirm-actions" });
            const cancelButton = actions.createEl("button", { text: "Cancel", cls: "todoist-confirm-cancel" });
            const deleteButton = actions.createEl("button", { text: "Delete", cls: "todoist-confirm-delete" });
            cancelButton.onclick = () => closeWith(false);
            deleteButton.onclick = () => closeWith(true);
            modal.onClose = () => {
                clearEl(modal.contentEl);
                if (!settled)
                    resolve(false);
            };
            modal.open();
        });
    }
    async openEditTaskModalAsync(taskOrId, row, filters) {
        this.ensureRefactoredRuntime(this.settings.apiKey);
        const taskId = typeof taskOrId === "string" ? taskOrId : String(taskOrId?.id);
        const modal = new TaskSheetModal(this.app, {
            title: "Edit task",
            fields: {},
            submitLabel: "Save",
            projects: [],
            labels: [],
            onSubmit: async () => { },
        });
        this.activeTaskModal = modal;
        modal.open();
        modal.setLoading("Edit task");
        // Phase 2: hydrate without blocking first paint
        queueMicrotask(async () => {
            let task = this.taskStore[String(taskId)];
            // background refresh (don’t await)
            const refresh = (async () => {
                try {
                    const live = await this.todoistService.getTask(taskId);
                    if (live && live.id) {
                        // Use live copy for modal fields, but do not overwrite store here to avoid clobbering edits
                        task = live;
                    }
                }
                catch { }
            })();
            const fields = {
                title: String(task?.content ?? ""),
                description: String(task?.description ?? ""),
                due: (() => {
                    const d = task?.due;
                    if (!d)
                        return "";
                    // Prefer date; if only datetime exists, use YYYY-MM-DD for the <input type="date">
                    if (d?.date)
                        return String(d.date);
                    if (d?.datetime)
                        return String(d.datetime).slice(0, 10);
                    return "";
                })(),
                projectId: String(task?.projectId ?? ""),
                // Normalize labels to names; SDK expects array of label NAMES (not ids)
                labels: (() => {
                    const raw = task?.labels;
                    if (!Array.isArray(raw))
                        return [];
                    return raw.map((lab) => {
                        if (typeof lab === "string")
                            return lab; // already a name
                        const hit = (this.labelCache || []).find((l) => String(l.id) === String(lab) || String(l.name) === String(lab));
                        return String(hit?.name ?? lab);
                    });
                })()
            };
            modal.setForm({
                fields,
                submitLabel: "Save",
                projects: this.projectCache,
                labels: this.labelCache,
                onSubmit: async (data) => {
                    const id = String(taskId);
                    const prevProjectId = String((this.taskStore[id] ?? task)?.projectId || "");
                    const targetProjectId = String(data.projectId || "");
                    try {
                        // 1) Move first if project changed (server truth)
                        const prevProjectIdStr = String((prevProjectId ?? task?.projectId ?? "")).trim();
                        const targetProjectIdStr = String((targetProjectId ?? "")).trim();
                        if (targetProjectIdStr && targetProjectIdStr !== prevProjectIdStr) {
                            if (this.settings?.enableLogs) {
                                this.info("[Todoist Board] moving task", String(id), "from", prevProjectIdStr, "to", targetProjectIdStr);
                            }
                            let moved = null;
                            moved = await this.todoistService.moveTask(String(id), targetProjectIdStr);
                            // Keep local store consistent immediately (preserve camelCase shape expected by renderer)
                            {
                                const local = (this.taskStore[String(id)] ?? task) || {};
                                const movedProjectId = (moved && (moved.projectId ?? moved.project_id)) ?? targetProjectIdStr;
                                const movedParentId = moved ? (moved.parentId ?? moved.parent_id ?? undefined) : undefined;
                                const movedSectionId = moved ? (moved.sectionId ?? moved.section_id ?? undefined) : undefined;
                                local.projectId = String(movedProjectId || "");
                                if (movedParentId !== undefined)
                                    local.parentId = movedParentId ? String(movedParentId) : null;
                                if (movedSectionId !== undefined)
                                    local.sectionId = movedSectionId ? String(movedSectionId) : null;
                                this.taskStore[String(id)] = local;
                            }
                            if (this.settings?.enableLogs) {
                                this.info("[Todoist Board] moved task locally → projectId:", this.taskStore[String(id)]?.projectId);
                            }
                            // Make sure the destination project exists in caches (prevents blank project pill)
                            if (!this.projectMap.has(targetProjectIdStr)) {
                                try {
                                    const dest = await this.todoistService.getProject(targetProjectIdStr);
                                    if (dest) {
                                        if (!Array.isArray(this.projectCache))
                                            this.projectCache = [];
                                        const idx = this.projectCache.findIndex((p) => String(p.id) === String(dest.id));
                                        if (idx >= 0)
                                            this.projectCache[idx] = dest;
                                        else
                                            this.projectCache.push(dest);
                                        this.projectMap.set(String(dest.id), dest);
                                    }
                                }
                                catch {
                                }
                            }
                            // Make sure the destination project exists in caches (prevents blank project pill)
                            if (!this.projectMap.has(targetProjectId)) {
                                try {
                                    const dest = await this.todoistService.getProject(targetProjectId);
                                    if (dest) {
                                        if (!Array.isArray(this.projectCache))
                                            this.projectCache = [];
                                        const idx = this.projectCache.findIndex((p) => String(p.id) === String(dest.id));
                                        if (idx >= 0)
                                            this.projectCache[idx] = dest;
                                        else
                                            this.projectCache.push(dest);
                                        this.projectMap.set(String(dest.id), dest);
                                    }
                                }
                                catch {
                                }
                            }
                        }
                        // 2) Update other editable fields
                        await this.todoistService.updateTask(id, {
                            content: data.title,
                            description: data.description,
                            ...(data.due ? { dueDate: data.due } : { dueString: "no date" }),
                            // SDK expects label NAMES
                            labels: Array.isArray(data.labels) ? data.labels : []
                        });
                        // 3) Re-fetch fresh server copy, then update UI
                        const fresh = await this.todoistService.getTask(id);
                        if (fresh) {
                            this.taskStore[id] = fresh;
                        }
                        // Re-render boards
                        this.refreshAllInlineBoards();
                        activeDocument.querySelectorAll(".todoist-board.plugin-view").forEach((el) => {
                            const f = el.getAttribute("data-current-filter") || "today";
                            const tasks = this.getViewTasks(f);
                            this.renderTodoistBoard(el, `filter: ${f}`, {}, this.settings.apiKey, {
                                tasks,
                                projects: this.projectCache,
                                labels: this.labelCache
                            });
                        });
                    }
                    catch {
                        try {
                            new obsidian.Notice("Update failed");
                        }
                        catch { }
                    }
                },
            });
            window.requestAnimationFrame(() => modal.focusTitle(true));
            await refresh;
        });
    }
    // --- Add Task Modal ---
    async openAddTaskModal() {
        this.ensureRefactoredRuntime(this.settings.apiKey);
        const inboxId = this.projectCache?.find((p) => p.name === "Inbox")?.id;
        const modal = new TaskSheetModal(this.app, {
            title: "Add task",
            fields: {
                title: "",
                description: "",
                due: "",
                projectId: inboxId || undefined,
                labels: [],
            },
            submitLabel: "Add task",
            projects: this.projectCache,
            labels: this.labelCache,
            onSubmit: async ({ title, description, due, projectId, labels }) => {
                try {
                    await this.todoistService.addTask({
                        content: title,
                        description,
                        projectId: projectId || inboxId,
                        ...(due ? { dueString: due } : {}),
                        ...(labels && labels.length > 0 ? { labels } : {})
                    });
                    await this.preloadFilters();
                    this.app.workspace.trigger("markdown-preview-rendered");
                }
                catch {
                    try {
                        new obsidian.Notice("Could not add task");
                    }
                    catch { }
                }
            },
        });
        this.activeTaskModal = modal;
        modal.open();
        window.setTimeout(() => modal.focusTitle(), 10);
        // Defer dropdown/label population for async data after modal is visible
        if (!Array.isArray(this.projectCache) || !this.projectCache.length || !Array.isArray(this.labelCache) || !this.labelCache.length) {
            window.setTimeout(() => {
                void this.fetchMetadataFromSync(this.settings.apiKey).then(metadata => {
                    const rawProjects = metadata.projects;
                    this.projectCache = Array.isArray(rawProjects)
                        ? rawProjects
                        : Array.isArray(rawProjects?.results)
                            ? rawProjects.results
                            : [];
                    if (!Array.isArray(this.projectCache))
                        this.projectCache = [];
                    const rawLabels = metadata.labels;
                    if (Array.isArray(rawLabels)) {
                        this.labelCache = rawLabels;
                    }
                    else if (rawLabels && Array.isArray(rawLabels.results)) {
                        this.labelCache = rawLabels.results;
                    }
                    else {
                        this.labelCache = [];
                    }
                    this.projectCacheTimestamp = Date.now();
                    this.labelCacheTimestamp = Date.now();
                    modal.setForm({
                        projects: this.projectCache,
                        labels: this.labelCache,
                        fields: {
                            title: "",
                            description: "",
                            due: "",
                            projectId: this.projectCache?.find((p) => p.name === "Inbox")?.id || inboxId || undefined,
                            labels: [],
                        },
                    });
                });
            }, 10);
        }
    }
    // The createFilterGroup function is now unused in the new filter bar implementation.
    // ======================= 👀 Mutation Observer Setup =======================
    setupMutationObserver(container) {
        const observer = new MutationObserver((mutations) => {
            // You can handle DOM changes if needed
        });
        observer.observe(container, { childList: true, subtree: true });
        // Track observer so it is disconnected on unload
        this._mutationObservers.push(observer);
    }
    // ======================= 🔄 Filter Click Handling =======================
    async handleFilterClick(opt, container, ctx, apiKey) {
        const now = Date.now();
        // --- Render token logic to ensure only latest filter click is processed ---
        const renderToken = Date.now().toString();
        this.currentRenderToken = renderToken;
        const confirmedFilter = String(opt.filter);
        container.setAttribute("data-current-filter", confirmedFilter);
        // --- Always trigger a full re-render, even if filter unchanged and task count same ---
        let localTasks = this.storage.loadTaskCache(confirmedFilter);
        // Render from persisted storage first (if available) for instant feedback
        this.taskCache[confirmedFilter] = localTasks;
        // Fallback: if no localTasks, keep previous cache
        if (!localTasks || localTasks.length === 0) {
            localTasks = this.taskCache[confirmedFilter] || [];
        }
        if (Array.isArray(localTasks) && localTasks.length > 0) {
            this.renderTodoistBoard(container, `filter: ${confirmedFilter}`, ctx, apiKey, {
                tasks: localTasks,
                sections: [],
                projects: this.projectCache || [],
                labels: this.labelCache || []
            });
            this.showFilterLoading(container, confirmedFilter, localTasks.length);
        }
        else {
            this.showFilterLoading(container, confirmedFilter, 0);
        }
        // Immediately call the manual sync logic (force refresh)
        // --- Use parser for string filters, with timezone support ---
        const tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, confirmedFilter);
        const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
        // --- Guarded block: check for stale render or filter switch ---
        if (this.currentRenderToken !== renderToken ||
            container.getAttribute("data-current-filter") !== confirmedFilter) {
            return;
        }
        this.taskCache[confirmedFilter] = Array.isArray(tasks) ? tasks : [];
        this.updateFilterBadge(container, confirmedFilter, Array.isArray(tasks) ? tasks.length : 0, Boolean(tasksResponse?.nextCursor));
        this.taskCacheTimestamps[confirmedFilter] = now;
        this.storage.saveTaskCache(confirmedFilter, Array.isArray(tasks) ? tasks : [], now);
        this.renderTodoistBoard(container, `filter: ${confirmedFilter}`, ctx, apiKey, {
            tasks: Array.isArray(tasks) && tasks.length > 0 ? tasks : (this.taskCache[confirmedFilter] || []),
            sections: [],
            projects: this.projectCache || [],
            labels: this.labelCache || []
        });
        this.hideFilterLoading(container, confirmedFilter);
        const metadata = await this.fetchMetadataFromSync(apiKey);
        this.projectCache = metadata.projects;
        this.labelCache = metadata.labels;
        this.projectCacheTimestamp = now;
        this.labelCacheTimestamp = now;
    }
    createQueueButton(listWrapper) {
        let queueActive = false;
        // Use Obsidian's icon system for the queue button (use "list" as example)
        const queueBtn = createSpan({ cls: "queue-btn clickable-icon" });
        obsidian.setIcon(queueBtn, "focus");
        queueBtn.title = "Queue tasks";
        queueBtn.onclick = () => {
            queueActive = !queueActive;
            this.updateQueueView(queueActive, listWrapper);
        };
        const queueWrapper = activeDocument.createElement("div");
        queueWrapper.className = "queue-wrapper";
        queueWrapper.appendChild(queueBtn);
        return queueWrapper;
    }
    createSettingsRefreshButtons(container, source, ctx, apiKey) {
        // Create a hamburger menu button
        const menuBtn = activeDocument.createElement("button");
        obsidian.setIcon(menuBtn, "menu");
        menuBtn.title = "Menu";
        menuBtn.classList.add("icon-button");
        // Create dropdown
        const menuDropdown = activeDocument.createElement("div");
        menuDropdown.className = "menu-dropdown hidden";
        // Settings option
        const settingsOption = activeDocument.createElement("div");
        // Insert icon span before text
        const settingsIcon = activeDocument.createElement("span");
        obsidian.setIcon(settingsIcon, "settings");
        settingsIcon.addClass("toolbar-icon");
        settingsOption.appendChild(settingsIcon);
        settingsOption.className = "menu-dropdown-item";
        settingsOption.onclick = () => {
            menuDropdown.classList.add("hidden");
            this.openSettingsModal();
        };
        // Use append() instead of textContent to avoid overwriting icon
        settingsOption.append("Settings");
        // Manual Sync option
        const syncOption = activeDocument.createElement("div");
        // Insert icon span before text
        const syncIcon = activeDocument.createElement("span");
        obsidian.setIcon(syncIcon, "refresh-cw");
        syncIcon.addClass("toolbar-icon");
        syncOption.appendChild(syncIcon);
        syncOption.className = "menu-dropdown-item";
        syncOption.onclick = async () => {
            menuDropdown.classList.add("hidden");
            // Manual Sync: Clear cache for the current filter, clear list view, trigger fresh render from API
            const currentFilter = container.getAttribute("data-current-filter") || "";
            // Remove cached tasks and timestamp for current filter
            this.storage.removeTaskCache(currentFilter);
            // Find the list wrapper inside the container
            const listWrapper = container.querySelector(".list-wrapper");
            if (listWrapper) {
                clearEl(listWrapper);
                const tasksResponse = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
                const tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
                // --- Fetch and update project/label metadata as part of manual sync ---
                const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                this.projectCache = metadata.projects;
                this.labelCache = metadata.labels;
                this.projectCacheTimestamp = Date.now();
                this.labelCacheTimestamp = Date.now();
                // ---
                this.taskCache[currentFilter] = Array.isArray(tasks) ? tasks : [];
                const badge = activeDocument.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
                if (badge) {
                    badge.textContent = this.formatFilterCount(Array.isArray(tasks) ? tasks.length : 0, Boolean(tasksResponse?.nextCursor));
                }
                const cacheTimestamp = Date.now();
                this.taskCacheTimestamps[currentFilter] = cacheTimestamp;
                this.storage.saveTaskCache(currentFilter, Array.isArray(tasks) ? tasks : [], cacheTimestamp);
                const projects = this.projectCache || [];
                const labels = this.labelCache || [];
                void this.renderTaskList(listWrapper, `filter: ${currentFilter}`, this.settings.apiKey, {
                    tasks: Array.isArray(tasks) ? tasks : [],
                    projects,
                    labels
                });
            }
            else {
                // Also refresh metadata if not using a listWrapper
                const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                this.projectCache = metadata.projects;
                this.labelCache = metadata.labels;
                this.projectCacheTimestamp = Date.now();
                this.labelCacheTimestamp = Date.now();
                const currentFilterStr = `filter: ${currentFilter}`;
                this.renderTodoistBoard(container, currentFilterStr, currentFilterStr, this.settings.apiKey);
            }
        };
        // Use append() instead of textContent to avoid overwriting icon
        syncOption.append("Manual sync");
        menuDropdown.appendChild(settingsOption);
        menuDropdown.appendChild(syncOption);
        const divider = activeDocument.createElement("div");
        divider.className = "menu-divider";
        menuDropdown.appendChild(divider);
        const compactOption = activeDocument.createElement("div");
        compactOption.className = "menu-dropdown-item";
        const compactIcon = activeDocument.createElement("span");
        obsidian.setIcon(compactIcon, "align-justify");
        compactIcon.addClass("toolbar-icon");
        compactOption.appendChild(compactIcon);
        // Set the initial label based on this.compactMode
        compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
        compactOption.prepend(compactIcon);
        compactOption.onclick = () => {
            this.compactMode = !this.compactMode;
            this.settings.compactMode = this.compactMode;
            void this.savePluginData();
            // Update DOM class for compact mode in real-time ---
            const block = activeDocument.querySelector(".block-language-todoist-board");
            if (block) {
                if (this.settings.compactMode) {
                    block.classList.add("compact-mode");
                }
                else {
                    block.classList.remove("compact-mode");
                }
            }
            // Updated logic: choose correct board instance for compact mode toggle
            const isSidebarBoard = container.id === "todoist-main-board";
            const currentBoard = isSidebarBoard
                ? activeDocument.getElementById("todoist-main-board")?.querySelector(".list-wrapper")
                : container.querySelector(".list-wrapper");
            if (currentBoard) {
                currentBoard.classList.toggle("compact-mode", this.compactMode);
                // Find the correct board container for getting the filter
                const boardContainer = isSidebarBoard
                    ? activeDocument.getElementById("todoist-main-board")
                    : container;
                const currentFilter = boardContainer?.getAttribute("data-current-filter") || "";
                const cachedTasks = this.storage.loadTaskCache(currentFilter);
                const board = boardContainer;
                if (board) {
                    clearEl(board);
                    const currentFilterStr = `filter: ${currentFilter}`;
                    this.storage.saveTaskCache(currentFilter, cachedTasks);
                    this.renderTodoistBoard(board, currentFilterStr, {}, this.settings.apiKey, {
                        tasks: cachedTasks,
                        projects: this.projectCache,
                        labels: this.labelCache,
                        sections: []
                    });
                }
            }
            compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
            compactOption.prepend(compactIcon);
            // Hide the menu after toggling compact mode
            // @ts-ignore
            const menu = {
                hideAtMouseEvent: (evt) => {
                    menuDropdown.classList.add("hidden");
                }
            };
            menu.hideAtMouseEvent(new MouseEvent("click"));
        };
        menuDropdown.appendChild(compactOption);
        // Wrap menuDropdown in a menu-dropdown-wrapper to prevent clipping ---
        const menuDropdownWrapper = activeDocument.createElement("div");
        menuDropdownWrapper.className = "menu-dropdown-wrapper";
        menuDropdownWrapper.appendChild(menuDropdown);
        // --- Move menuDropdownWrapper outside settingsRefreshWrapper and append to body ---
        // We'll store a reference for event handling.
        activeDocument.body.appendChild(menuDropdownWrapper);
        // --- By default, hide the dropdown ---
        menuDropdown.classList.add("hidden");
        // Toggle dropdown on menu button click, position absolutely below the button
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            const rect = menuBtn.getBoundingClientRect();
            menuDropdownWrapper.addClass("menu-dropdown-wrapper");
            menuDropdownWrapper.style.top = `${rect.bottom + window.scrollY}px`;
            menuDropdownWrapper.style.left = `${rect.left + window.scrollX}px`;
            menuDropdown.classList.toggle("hidden");
        };
        // Hide dropdown on outside click
        // This event listener is global and should be cleaned up if needed
        // (Consider registering and removing if you want to be extra clean)
        this.registerDomEvent(activeDocument, "click", (e) => {
            const t = e.target;
            // Ignore clicks in the file explorer area
            if (t && t.closest(".workspace-split.mod-left-split"))
                return;
            if (!menuDropdown.classList.contains("hidden")) {
                menuDropdown.classList.add("hidden");
            }
        });
        // Prevent click inside dropdown from closing it
        menuDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        // --- Only the menuBtn is inside the wrapper now ---
        const settingsRefreshWrapper = activeDocument.createElement("div");
        settingsRefreshWrapper.className = "settings-refresh-wrapper";
        settingsRefreshWrapper.appendChild(menuBtn);
        // menuDropdownWrapper is now outside, not appended here
        // Use the container argument instead of querying for .todoist-board
        // Find and replace:
        // const board = activeDocument.querySelector(".todoist-board") as HTMLElement;
        // with:
        // const board = container;
        // (This block is in compactOption.onclick)
        // Find the currentBoard and update as before, but use container directly for re-render
        // (No changes needed to the rest of the logic, as container is already passed and used)
        return settingsRefreshWrapper;
    }
    createRefreshButton(container, source, ctx, apiKey) {
        const refreshBtn = activeDocument.createElement("button");
        refreshBtn.type = "button";
        obsidian.setIcon(refreshBtn, "refresh-cw");
        refreshBtn.title = "Force refresh cache";
        refreshBtn.classList.add("icon-button", "refresh-btn");
        refreshBtn.onclick = () => {
            window.requestAnimationFrame(() => {
                refreshBtn.classList.add("syncing");
                const selectedRow = activeDocument.querySelector(".filter-row.selected");
                selectedRow?.classList.add("syncing");
                window.requestAnimationFrame(async () => {
                    await this.preloadFilters();
                    window.setTimeout(() => {
                        refreshBtn.classList.remove("syncing");
                        selectedRow?.classList.remove("syncing");
                        this.renderTodoistBoard(container, source, ctx, apiKey);
                    }, 4000); // Delay to allow animation to register
                });
            });
        };
        return refreshBtn;
    }
    createSettingsButton() {
        const settingsBtn = activeDocument.createElement("span");
        obsidian.setIcon(settingsBtn, "settings");
        settingsBtn.title = "Edit toolbar filters";
        settingsBtn.className = "icon-button";
        settingsBtn.onclick = () => this.openSettingsModal();
        return settingsBtn;
    }
    openSettingsModal() {
        openFilterSettingsModal({
            app: this.app,
            settings: this.settings,
            onSave: () => this.savePluginData(),
            onResetFilterIndex: () => {
                selectedFilterIndex = 0;
            },
            onClearCache: () => {
                this.ensureRefactoredRuntime(this.settings.apiKey);
                this.storage.clearTaskAndMetadataCaches();
                this.taskStoreController.hydrate((this.settings.filters || []).map((filter) => String(filter.filter)));
                this.syncTaskStoreRefs();
            },
            onRerenderBoards: () => {
                activeDocument.querySelectorAll(".todoist-board.plugin-view").forEach((element) => {
                    const container = element;
                    const source = container.getAttribute("data-current-filter") || "";
                    clearEl(container);
                    this.renderTodoistBoard(container, source, {}, this.settings.apiKey || "");
                });
            },
            onRerenderCodeBlocks: () => {
                const markdownElements = activeDocument.querySelectorAll("pre > code.language-todoist-board");
                markdownElements.forEach((element) => {
                    const pre = element.parentElement;
                    if (!pre)
                        return;
                    const container = activeDocument.createElement("div");
                    pre.replaceWith(container);
                    const source = element.textContent?.trim() || "";
                    this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
                });
            },
        });
    }
    // ======================= 📋 Task List Rendering =======================
    async renderTaskList(listWrapper, source, apiKey, preloadData) {
        const match = source.match(/filter:\s*(.*)/);
        const filters = match
            ? match[1].split(",").map(f => f.trim())
            : ["today", "overdue", "next 7 days", "inbox"];
        // preloadData block ---
        if (preloadData) {
            const { tasks, projects, labels } = preloadData;
            // Ensure tasks is an array before sorting
            if (!Array.isArray(tasks)) {
                console.error("cachedTasks is not an array", tasks);
                return;
            }
            // Ensure projects and labels are arrays
            const projectList = Array.isArray(projects) ? projects : [];
            const labelList = Array.isArray(labels) ? labels : [];
            const projectMap = Object.fromEntries(projectList.map((p) => [p.id, p.name]));
            const labelMap = Object.fromEntries((labelList ?? []).map((l) => [l.id, l.name]));
            const labelColorMap = Object.fromEntries((labelList ?? []).map((l) => [l.id, l.color]));
            this.ensureRefactoredRuntime(this.settings.apiKey);
            const orderKey = filters.join(",");
            const savedOrder = this.storage.getManualOrder(orderKey);
            tasks.sort((a, b) => {
                const idxA = savedOrder.indexOf(a.id);
                const idxB = savedOrder.indexOf(b.id);
                return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
                    (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
            });
            // --- Group subtasks by parentId ---
            const taskList = Array.isArray(tasks) ? tasks : [];
            const subtasksByParentId = {};
            taskList.forEach((task) => {
                if (task.parentId) {
                    if (!subtasksByParentId[task.parentId])
                        subtasksByParentId[task.parentId] = [];
                    subtasksByParentId[task.parentId].push(task);
                }
            });
            // --- Only render parent tasks and their subtasks ---
            taskList.map((task) => {
                if (task.parentId)
                    return; // skip subtasks in top-level loop
                // --- Get project info using projectMap (by id) ---
                const project = this.projectMap.get(String(task.projectId));
                // Debug logs for mapping task to project
                // // if (this.settings?.enableLogs) console.log(`🔍 Task ${task.id} → Project ID: ${task.projectId}`);
                // // if (this.settings?.enableLogs) console.log("📘 Mapped project:", project);
                const projectName = project ? project.name : "Unknown Project";
                // Use string key for color mapping
                let projectColor = "#808080";
                if (project && typeof project.color !== "undefined") {
                    projectColor = TODOIST_COLORS[project.color] || "#808080";
                }
                if (task.content?.trim().startsWith("* ")) {
                    const clonedTask = { ...task, content: task.content.trim().substring(2) };
                    const row = this.createTaskRow(clonedTask, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters);
                    // Set project name/color in rendering logic (if used in createTaskRow)
                    row.classList.add("non-task-note");
                    this.setupTaskDragAndDrop(row, listWrapper, filters);
                    listWrapper.appendChild(row);
                    return;
                }
                const row = this.createTaskRow(task, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters);
                // Set project name and color as data attributes for use in createTaskRow or CSS ---
                row.setAttribute("data-project-name", projectName);
                row.setAttribute("data-project-color", projectColor);
                // Only setup drag-and-drop for parent tasks
                this.setupTaskDragAndDrop(row, listWrapper, filters);
                listWrapper.appendChild(row);
                // fallback to global subtask lookup if not found in subtasksByParentId ---
                let allSubtasks = [];
                try {
                    allSubtasks = Object.values(this.taskCache).flat().filter((t) => t.parentId === task.id);
                }
                catch (err) {
                    console.error("Error flattening taskCache for subtasks", err);
                }
                const subtasks = allSubtasks.length > 0 ? allSubtasks : (subtasksByParentId[task.id] || []);
                // --- Render subtasks directly nested inside parent row, INSIDE task-content-wrapper ---
                if (Array.isArray(subtasks) && subtasks.length > 0) {
                    const subtaskWrapper = activeDocument.createElement("div");
                    subtaskWrapper.className = "subtask-wrapper";
                    for (const sub of subtasks) {
                        const subProject = this.projectMap.get(String(sub.projectId || ""));
                        const subProjectName = subProject ? subProject.name : "Unknown Project";
                        let subProjectColor = "#808080";
                        if (subProject && typeof subProject.color !== "undefined") {
                            subProjectColor = TODOIST_COLORS[subProject.color] || "#808080";
                        }
                        const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projectList, apiKey, listWrapper, filters);
                        subRow.classList.add("subtask-row");
                        subRow.setAttribute("data-project-name", subProjectName);
                        subRow.setAttribute("data-project-color", subProjectColor);
                        // Clean up subtask UI (remove metadata, chin, description)
                        const meta = subRow.querySelector(".task-metadata");
                        if (meta)
                            meta.remove();
                        const desc = subRow.querySelector(".task-description");
                        if (desc)
                            desc.remove();
                        const chin = subRow.querySelector(".fixed-chin");
                        if (chin)
                            chin.remove();
                        subtaskWrapper.appendChild(subRow);
                    }
                    // Insert into task-content-wrapper if exists, else fallback to row
                    const contentWrapper = row.querySelector('.task-content-wrapper');
                    if (contentWrapper) {
                        contentWrapper.appendChild(subtaskWrapper);
                    }
                    else {
                        row.appendChild(subtaskWrapper);
                    }
                }
            });
            // ——— Apply persisted dimming (preload path) ———
            try {
                const hidden = getHiddenSet();
                const nodes = Array.from(listWrapper.querySelectorAll("[data-task-id]"));
                nodes.forEach((node) => {
                    const id = String(node.dataset.taskId || "");
                    if (!id)
                        return;
                    applyDimClass(node, hidden.has(id));
                });
            }
            catch { }
            // --- Insert empty quote if no tasks ---
            if (taskList.length === 0) {
                const quoteDiv = activeDocument.createElement("div");
                quoteDiv.className = "empty-filter";
                quoteDiv.textContent = "No tasks found for this filter.";
                listWrapper.appendChild(quoteDiv);
            }
            this.appendLoadMoreButton(listWrapper, filters[0], apiKey);
            return;
        }
        const now = Date.now();
        const cacheTTL = 24 * 60 * 60 * 1000;
        let projects = [];
        let labels = [];
        let metadata;
        const metadataCacheTTL = 24 * 60 * 60 * 1000;
        const metadataTimestamp = this.projectCacheTimestamp;
        const metadataFresh = this.projectCache && (now - metadataTimestamp < metadataCacheTTL);
        if (metadataFresh) {
            projects = Array.isArray(this.projectCache) ? this.projectCache : [];
            labels = Array.isArray(this.labelCache) ? this.labelCache : [];
            metadata = { projects, sections: [], labels };
        }
        else {
            metadata = await this.fetchMetadataFromSync(apiKey);
            projects = metadata.projects;
            labels = metadata.labels;
            this.projectCache = projects;
            this.labelCache = labels;
            this.projectCacheTimestamp = now;
            this.labelCacheTimestamp = now;
        }
        let tasks = [];
        const filter = filters[0];
        const taskTimestamp = this.taskCacheTimestamps[filter] || 0;
        const useCache = this.taskCache[filter] && (now - taskTimestamp < cacheTTL);
        if (useCache) {
            tasks = this.taskCache[filter];
        }
        else {
            // check if filter is empty or invalid, fallback to all tasks if so
            const query = filter?.trim();
            let tasksResponse;
            if (query) {
                tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, query);
            }
            else {
                // fallback to all tasks
                tasksResponse = await this.fetchFilteredTasksFromREST(apiKey, {});
            }
            tasks = tasksResponse && tasksResponse.results ? tasksResponse.results : tasksResponse;
            this.taskCache[filter] = Array.isArray(tasks) ? tasks : [];
            this.taskCacheTimestamps[filter] = now;
        }
        const projectMap = Array.isArray(projects)
            ? Object.fromEntries(projects.map((p) => [p.id, p.name]))
            : {};
        const labelMap = Array.isArray(labels)
            ? Object.fromEntries((labels ?? []).map((l) => [l.id, l.name]))
            : {};
        const labelColorMap = Array.isArray(labels)
            ? Object.fromEntries((labels ?? []).map((l) => [l.id, l.color]))
            : {};
        this.ensureRefactoredRuntime(this.settings.apiKey);
        const orderKey = filters.join(",");
        const savedOrder = this.storage.getManualOrder(orderKey);
        const taskList = Array.isArray(tasks) ? tasks : [];
        taskList.sort((a, b) => {
            const idxA = savedOrder.indexOf(a.id);
            const idxB = savedOrder.indexOf(b.id);
            return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
                (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
        });
        // --- Group subtasks by parentId for non-preloadData path ---
        const subtasksByParentId = {};
        taskList.map((task) => {
            if (task.parentId) {
                if (!subtasksByParentId[task.parentId])
                    subtasksByParentId[task.parentId] = [];
                subtasksByParentId[task.parentId].push(task);
            }
        });
        // Removed local date comparison due to timezone mismatch issues (see GitHub issue #timezone-bug)
        // If any previous logic filtered tasks based on local date (e.g., new Date(task.due.date)), it is now removed.
        // --- Only render parent tasks and their subtasks, do not filter by local date ---
        taskList.map((task) => {
            // Do not skip tasks based on local date comparison
            if (task.parentId)
                return; // skip subtasks in top-level loop
            if (task.content?.trim().startsWith("* ")) {
                const clonedTask = { ...task, content: task.content.trim().substring(2) };
                const row = this.createTaskRow(clonedTask, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                row.classList.add("non-task-note");
                this.setupTaskDragAndDrop(row, listWrapper, filters);
                listWrapper.appendChild(row);
                return;
            }
            const row = this.createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
            // Only setup drag-and-drop for parent tasks
            this.setupTaskDragAndDrop(row, listWrapper, filters);
            listWrapper.appendChild(row);
            // fallback to global subtask lookup if not found in subtasksByParentId ---
            let allSubtasks = [];
            try {
                allSubtasks = Object.values(this.taskCache).flat().filter((t) => t.parentId === task.id);
            }
            catch (err) {
                console.error("Error flattening taskCache for subtasks", err);
            }
            const subtasks = allSubtasks.length > 0 ? allSubtasks : (subtasksByParentId[task.id] || []);
            // --- Render subtasks directly nested inside parent row ---
            if (Array.isArray(subtasks) && subtasks.length > 0) {
                const subtaskWrapper = activeDocument.createElement("div");
                subtaskWrapper.className = "subtask-wrapper";
                for (const sub of subtasks) {
                    const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                    subRow.classList.add("subtask-row");
                    // Clean up subtask UI (remove metadata, chin, description)
                    const meta = subRow.querySelector(".task-metadata");
                    if (meta)
                        meta.remove();
                    const desc = subRow.querySelector(".task-description");
                    if (desc)
                        desc.remove();
                    const chin = subRow.querySelector(".fixed-chin");
                    if (chin)
                        chin.remove();
                    subtaskWrapper.appendChild(subRow);
                }
                row.appendChild(subtaskWrapper);
            }
        });
        // ——— Apply persisted dimming (non-preload path) ———
        try {
            const hidden = getHiddenSet();
            const nodes2 = Array.from(listWrapper.querySelectorAll("[data-task-id]"));
            nodes2.forEach((node) => {
                const id = String(node.dataset.taskId || "");
                if (!id)
                    return;
                applyDimClass(node, hidden.has(id));
            });
        }
        catch { }
        // --- Insert empty quote if no tasks ---
        if (taskList.length === 0) {
            const quoteDiv = activeDocument.createElement("div");
            quoteDiv.className = "empty-filter";
            quoteDiv.textContent = "No tasks found for this filter.";
            listWrapper.appendChild(quoteDiv);
        }
        this.appendLoadMoreButton(listWrapper, filter, apiKey);
        try {
            if (source && source.trim().startsWith("filter:")) {
                this.storage.setLastFilter(source.trim());
            }
        }
        catch { }
    }
    // ======================= 🧩 Task Row Creation =======================
    createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters) {
        const row = activeDocument.createElement("div");
        // Apply .non-task-note class if original content starts with "* " ---
        if (task.content?.trim().startsWith("* ")) {
            row.classList.add("non-task-note");
        }
        row.classList.add("task");
        row.dataset.id = task.id;
        // Set the row id to the task id for later DOM removal
        row.id = task.id;
        row.setAttribute("data-task-id", String(task.id));
        // Set project color CSS variable
        row.style.setProperty("--project-color", getProjectHexColor(task, projects));
        // Add "parent-task" class if task has children (by parentId) ---
        const hasChildren = Object.values(this.taskCache).flat().some((t) => t.parentId === task.id);
        if (hasChildren) {
            row.classList.add("parent-task");
        }
        // Add repeating task icon if task is recurring ---
        const isRepeating = !!task.due?.is_recurring;
        if (isRepeating) {
            const repeatIcon = activeDocument.createElement("span");
            repeatIcon.classList.add("repeat-icon");
            obsidian.setIcon(repeatIcon, "repeat");
            row.appendChild(repeatIcon);
        }
        // Context Menu ---
        row.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            const menu = new obsidian.Menu();
            const actions = this.settings.contextMenuActions;
            if (actions?.scheduleToday) {
                menu.addItem((item) => item
                    .setTitle("Schedule today")
                    .setIcon("calendar")
                    .onClick(async () => {
                    this.ensureRefactoredRuntime(apiKey);
                    await this.todoistService.scheduleTask(task.id, { due_string: "today" });
                    // Optimistic update
                    const dueSpan = row.querySelector(".due-inline");
                    if (dueSpan)
                        dueSpan.textContent = "Today";
                }));
            }
            if (actions?.scheduleTomorrow) {
                menu.addItem((item) => item
                    .setTitle("Schedule tomorrow")
                    .setIcon("calendar-clock")
                    .onClick(async () => {
                    this.ensureRefactoredRuntime(apiKey);
                    await this.todoistService.scheduleTask(task.id, { due_string: "tomorrow" });
                    // Optimistic update
                    const dueSpan = row.querySelector(".due-inline");
                    if (dueSpan)
                        dueSpan.textContent = "Tomorrow";
                }));
            }
            if (actions?.setPriority) {
                menu.addItem((item) => item
                    .setTitle("Set priority")
                    .setIcon("flag")
                    .onClick((e) => {
                    // No submenu support in this API version, show a new menu or just cycle?
                    // Let's just show a Notice for now or maybe use a flat list if possible?
                    // Actually, let's just add the items directly to the main menu for now if submenu fails,
                    // OR better: Create a new Menu for priority selection
                    const pMenu = new obsidian.Menu();
                    pMenu.addItem((sub) => sub.setTitle("P1 (high)").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 4, apiKey)));
                    pMenu.addItem((sub) => sub.setTitle("P2").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 3, apiKey)));
                    pMenu.addItem((sub) => sub.setTitle("P3").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 2, apiKey)));
                    pMenu.addItem((sub) => sub.setTitle("P4 (low)").setIcon("flag").onClick(async () => this.updateTaskPriority(task.id, 1, apiKey)));
                    pMenu.showAtPosition({ x: e.pageX, y: e.pageY });
                }));
            }
            if (actions?.editTask) {
                menu.addItem((item) => item
                    .setTitle("Edit task")
                    .setIcon("pencil")
                    .onClick(() => {
                    this.openEditTaskModal(task, row, filters);
                }));
            }
            if (actions?.deleteTask) {
                menu.addItem((item) => item
                    .setTitle("Delete task")
                    .setIcon("trash")
                    // .setDestructive(true) // Not available in all API versions
                    .onClick(async () => {
                    // Use existing delete logic if available or direct API
                    await this.deleteTask(task.id, apiKey, row);
                }));
            }
            if (actions?.openInTodoist) {
                menu.addItem((item) => item
                    .setTitle("Open in Todoist")
                    .setIcon("external-link")
                    .onClick(() => {
                    window.open(task.url, "_blank");
                }));
            }
            menu.showAtPosition({ x: event.pageX, y: event.pageY });
        });
        // Replace task-inner with scroll wrapper and fixed chin ---
        const scrollWrapper = activeDocument.createElement("div");
        scrollWrapper.className = "task-scroll-wrapper";
        const taskInner = activeDocument.createElement("div");
        taskInner.className = "task-inner";
        const fixedChin = activeDocument.createElement("div");
        fixedChin.className = "fixed-chin";
        scrollWrapper.appendChild(taskInner);
        scrollWrapper.appendChild(fixedChin);
        // Determine if this is a non-task note (content starts with '* ')
        const isNote = task.content?.trim().startsWith("* ");
        if (isNote) {
            const noteContent = activeDocument.createElement("div");
            noteContent.className = "task-content";
            const titleSpan = activeDocument.createElement("span");
            titleSpan.className = "task-title";
            titleSpan.textContent = task.content.trim().substring(2);
            noteContent.appendChild(titleSpan);
            taskInner.appendChild(noteContent);
            row.appendChild(scrollWrapper);
        }
        else {
            this.setupTaskInteractions(row, task, taskInner, apiKey, listWrapper, filters);
            const rowCheckbox = this.createPriorityCheckbox(task.priority, async () => {
                if (rowCheckbox.checked) {
                    await this.completeTask(task.id);
                    const taskRow = activeDocument.getElementById(task.id);
                    if (taskRow)
                        taskRow.remove();
                    await this.savePluginData();
                    this.handleQueueCompletion(listWrapper);
                }
            });
            rowCheckbox.classList.add(`priority-${task.priority}`);
            // Move checkbox out of .task-inner and into .task before scrollWrapper
            row.appendChild(rowCheckbox);
            row.appendChild(scrollWrapper);
            const left = createTaskContent({
                task,
                projectMap,
                labelMap,
                labelColorMap,
                projects,
                labels: this.labelCache,
                settings: this.settings,
                app: this.app,
                owner: this,
            });
            taskInner.appendChild(left);
            // const deadline = this.createTaskDeadline(task);
            // row.appendChild(deadline);
            // this used to be the old right-hand side deadline, now will in the WHEN row
        }
        return row;
    }
    setupTaskInteractions(row, task, taskInner, apiKey, listWrapper, filters) {
        let tapStartX = 0;
        let tapStartY = 0;
        row.addEventListener("pointerdown", (e) => {
            if (row.classList.contains("subtask-row"))
                return;
            tapStartX = e.clientX;
            tapStartY = e.clientY;
        });
        row.addEventListener("pointerup", (e) => {
            const isCheckbox = e.target.closest('input[type="checkbox"]');
            if (isCheckbox)
                return;
            const dx = Math.abs(e.clientX - tapStartX);
            const dy = Math.abs(e.clientY - tapStartY);
            if (dx > 5 || dy > 5)
                return;
            e.stopPropagation();
            // Prevent deselection on right-click (context menu) ---
            // If right-click (button 2) and already selected, ignore to keep selection & show menu.
            // If unselected, we allow it to proceed so it gets selected (user preference).
            if (e.button === 2 && row.classList.contains("selected-task")) {
                return;
            }
            // --- Subtask expand/collapse logic ---
            if (row.classList.contains("subtask-row")) {
                const alreadyExpanded = row.classList.contains("expanded-subtask");
                activeDocument.querySelectorAll(".subtask-row.expanded-subtask").forEach(el => {
                    el.classList.remove("expanded-subtask");
                });
                if (!alreadyExpanded) {
                    row.classList.add("expanded-subtask");
                }
                return;
            }
            // Instead of handling subtask-row here, let handleTaskSelection handle it with event
            this.handleTaskSelection(row, task, apiKey, e);
        });
        this.setupTaskDragAndDrop(row, listWrapper, filters);
    }
    handleTaskSelection(row, task, apiKey, event) {
        // If the event originated from within a subtask-row, skip parent selection/deselection
        if (event) {
            const target = event.target;
            if (target.closest(".subtask-row"))
                return;
        }
        // If already selected, deselect on second click
        if (row.classList.contains("selected-task")) {
            this.deselectTask(row);
            return;
        }
        const titleSpan = row.querySelector(".task-title");
        const rowCheckbox = row.querySelector("input[type='checkbox']");
        const metaSpan = row.querySelector(".task-metadata");
        // Add no-transition and freeze-transition classes as per new logic
        activeDocument.querySelectorAll('.task').forEach(t => {
            t.classList.add('no-transition');
            if (!t.classList.contains('selected-task')) {
                t.classList.add('freeze-transition');
            }
        });
        // Updated deselection logic to allow simultaneous deselect and select transitions
        activeDocument.querySelectorAll(".selected-task").forEach(el => {
            if (el !== row) {
                el.classList.add("task-deselecting");
                el.classList.remove("selected-task");
                window.setTimeout(() => {
                    el.classList.remove("task-deselecting");
                    const titleSpan = el.querySelector(".task-title");
                    const rowCheckbox = el.querySelector("input[type='checkbox']");
                    const metaSpan = el.querySelector(".task-metadata");
                    const desc = el.querySelector(".task-description");
                    if (titleSpan)
                        titleSpan.classList.remove("task-title-selected");
                    if (rowCheckbox)
                        rowCheckbox.classList.remove("task-checkbox-selected");
                    if (metaSpan)
                        metaSpan.classList.remove("task-meta-selected");
                    if (desc)
                        desc.classList.remove("show-description");
                    const toolbar = activeDocument.getElementById("mini-toolbar");
                    if (toolbar)
                        toolbar.remove();
                }, 300);
            }
        });
        // Apply new selection immediately
        row.classList.add("selected-task");
        if (row.classList.contains("selected-task")) {
            this.selectTask(row, task, titleSpan, rowCheckbox, metaSpan, apiKey);
            // Remove transition classes after selecting the new task
            window.requestAnimationFrame(() => {
                activeDocument.querySelectorAll('.task').forEach(t => {
                    t.classList.remove('no-transition');
                    t.classList.remove('freeze-transition');
                });
            });
        }
        else {
            this.deselectTask(row);
            // Remove transition classes after frame if deselecting
            window.requestAnimationFrame(() => {
                activeDocument.querySelectorAll('.task').forEach(t => {
                    t.classList.remove('no-transition');
                    t.classList.remove('freeze-transition');
                });
            });
        }
    }
    // ======================= ✴️ Task Selection Logic =======================
    selectTask(row, task, titleSpan, rowCheckbox, metaSpan, apiKey) {
        titleSpan.classList.add("task-title-selected");
        rowCheckbox.classList.add("task-checkbox-selected");
        metaSpan.classList.add("task-meta-selected");
        row.classList.add("selected-task");
        // Removed code that adds .show-description to .task-description
        this.createMiniToolbar(row, task, apiKey);
        // No dynamic transform here; handled by CSS.
    }
    deselectTask(row) {
        // row.classList.add("task-deselecting"); // Removed as per instructions
        const toolbar = activeDocument.getElementById("mini-toolbar");
        if (toolbar)
            toolbar.remove();
        window.setTimeout(() => {
            row.classList.remove("selected-task", "task-deselecting");
            const titleSpan = row.querySelector(".task-title");
            const rowCheckbox = row.querySelector("input[type='checkbox']");
            const metaSpan = row.querySelector(".task-metadata");
            const desc = row.querySelector(".task-description");
            if (titleSpan)
                titleSpan.classList.remove("task-title-selected");
            if (rowCheckbox)
                rowCheckbox.classList.remove("task-checkbox-selected");
            if (metaSpan) {
                metaSpan.classList.remove("task-meta-selected");
                // Remove transform reset; handled by CSS now.
            }
            if (desc)
                desc.classList.remove("show-description");
        }, 200);
    }
    // ======================= 🧰 Mini Toolbar =======================
    createMiniToolbar(row, task, apiKey) {
        const oldWrapper = activeDocument.getElementById("mini-toolbar-wrapper");
        if (oldWrapper)
            oldWrapper.remove();
        const wrapper = activeDocument.createElement("div");
        wrapper.id = "mini-toolbar-wrapper";
        wrapper.className = "mini-toolbar-wrapper fixed-chin";
        const chinContainer = activeDocument.createElement("div");
        chinContainer.className = "chin-inner";
        // Today button
        const todayBtn = activeDocument.createElement("button");
        todayBtn.className = "chin-btn today-btn";
        obsidian.setIcon(todayBtn, "calendar");
        todayBtn.append("Today");
        todayBtn.setAttribute("data-index", "0");
        todayBtn.onclick = () => this.setTaskToToday(task.id, apiKey, chinContainer, todayBtn);
        // Add date subtitle after SVG icon
        const subtitle = activeDocument.createElement("p");
        subtitle.className = "date-subtitle";
        // Show today's date as just the day of the month
        subtitle.textContent = String(new Date().getDate());
        todayBtn.appendChild(subtitle);
        chinContainer.appendChild(todayBtn);
        // Tomorrow button
        const tmrwBtn = activeDocument.createElement("button");
        tmrwBtn.className = "chin-btn tomorrow-btn";
        obsidian.setIcon(tmrwBtn, "sunrise");
        tmrwBtn.append("Tmrw");
        tmrwBtn.setAttribute("data-index", "1");
        tmrwBtn.onclick = () => this.deferTask(task.id, apiKey, chinContainer);
        chinContainer.appendChild(tmrwBtn);
        // Edit button
        const editBtn = activeDocument.createElement("button");
        editBtn.className = "chin-btn edit-btn";
        obsidian.setIcon(editBtn, "pencil");
        editBtn.append("Edit");
        editBtn.setAttribute("data-index", "2");
        editBtn.onclick = () => {
            let filters = [];
            const board = row.closest(".todoist-board");
            if (board && board.hasAttribute("data-current-filter")) {
                filters = [board.getAttribute("data-current-filter")];
            }
            if (!filters.length)
                filters = ["today"];
            void this.openEditTaskModalAsync(task, row, filters);
        };
        chinContainer.appendChild(editBtn);
        // --- Hide/Unhide (Dim) toggle ---
        (() => {
            try {
                const id = String(task.id);
                const hidden = getHiddenSet();
                const hideBtn = activeDocument.createElement("button");
                hideBtn.className = "chin-btn task-hide-btn";
                obsidian.setIcon(hideBtn, hidden.has(id) ? "eye-off" : "eye");
                hideBtn.title = hidden.has(id) ? "Unhide (undim)" : "Hide (dim)";
                a11yButton(hideBtn, hideBtn.title);
                hideBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const node = e.currentTarget?.closest('[data-task-id], [data-id]');
                    const set = getHiddenSet();
                    if (set.has(id)) {
                        set.delete(id);
                        saveHiddenSet(set);
                        if (node)
                            applyDimClass(node, false);
                        obsidian.setIcon(hideBtn, "eye");
                        hideBtn.title = "Hide (dim)";
                    }
                    else {
                        set.add(id);
                        saveHiddenSet(set);
                        if (node)
                            applyDimClass(node, true);
                        obsidian.setIcon(hideBtn, "eye-off");
                        hideBtn.title = "Unhide (undim)";
                    }
                };
                chinContainer.appendChild(hideBtn);
            }
            catch { }
        })();
        // --- End Hide/Unhide toggle ---
        // Delete button
        const deleteBtn = activeDocument.createElement("button");
        deleteBtn.className = "chin-btn delete-btn";
        obsidian.setIcon(deleteBtn, "trash");
        deleteBtn.setAttribute("data-index", "3");
        deleteBtn.onclick = () => this.deleteTask(task.id, apiKey, chinContainer);
        chinContainer.appendChild(deleteBtn);
        wrapper.appendChild(chinContainer);
        row.appendChild(wrapper);
        wrapper.addEventListener("click", (e) => e.stopPropagation());
    }
    // ======================= Edit Task Modal =======================
    openEditTaskModal(task, row, filters) {
        void this.openEditTaskModalAsync(task, row, filters);
    }
    // ======================= 📆 Quick Actions (Today, Tmrw, Delete) =======================
    async setTaskToToday(taskId, apiKey, toolbar, btn) {
        if (btn?._busy)
            return;
        btn._busy = true;
        const oldText = btn.innerText;
        btn.innerText = "⏳";
        try {
            const today = new Date();
            const iso = today.toISOString().split("T")[0];
            this.ensureRefactoredRuntime(apiKey);
            const resp = await this.todoistService.scheduleTask(taskId, { due_date: iso });
            if (resp.status >= 200 && resp.status < 300) {
                btn.innerText = "🎉";
                window.setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    const taskRow = activeDocument.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                }, 900);
            }
            else {
                btn.innerText = "❌";
                new obsidian.Notice("Failed to update task");
            }
        }
        catch {
            btn.innerText = "❌";
            new obsidian.Notice("Could not update task");
        }
        finally {
            window.setTimeout(() => {
                btn._busy = false;
                btn.innerText = oldText;
            }, 900);
        }
    }
    async deferTask(taskId, apiKey, toolbar) {
        const btn = toolbar.querySelector('.chin-btn[data-index="1"]');
        if (btn._busy)
            return;
        btn._busy = true;
        const oldText = btn.innerText;
        btn.innerText = "⏳";
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const iso = tomorrow.toISOString().split("T")[0];
            this.ensureRefactoredRuntime(apiKey);
            const resp = await this.todoistService.scheduleTask(taskId, { due_date: iso });
            if (resp.status >= 200 && resp.status < 300) {
                btn.innerText = "🎉";
                window.setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    // Remove the task element from the DOM manually
                    const taskRow = activeDocument.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                    // Will trigger re-render on next filter click
                }, 900);
            }
            else {
                btn.innerText = "❌";
                new obsidian.Notice("Failed to update task");
            }
        }
        catch {
            btn.innerText = "❌";
            new obsidian.Notice("Could not update task");
        }
        finally {
            window.setTimeout(() => {
                btn._busy = false;
                btn.innerText = oldText;
            }, 900);
        }
    }
    async updateTaskPriority(taskId, priority, apiKey) {
        try {
            this.ensureRefactoredRuntime(apiKey);
            await this.todoistService.updatePriority(taskId, priority);
            // Optimistic update
            const checkbox = activeDocument.querySelector(`.task[data-id="${taskId}"] input.todoist-checkbox`);
            if (checkbox) {
                checkbox.className = `todoist-checkbox priority-${priority}`;
            }
            new obsidian.Notice(`Priority updated to P${5 - priority}`); // Todoist API P4=1, P1=4. UI P1=High.
        }
        catch (e) {
            console.error("Failed to update priority", e);
            new obsidian.Notice("Failed to update priority");
        }
    }
    async deleteTask(taskId, apiKey, toolbar) {
        if (!(await this.confirmDeleteTask()))
            return;
        const btn = toolbar.querySelector('.chin-btn[data-index="3"]');
        if (btn._busy)
            return;
        btn._busy = true;
        btn.innerText = "⏳";
        try {
            this.ensureRefactoredRuntime(apiKey);
            const resp = await this.todoistService.deleteTask(taskId);
            if (resp.status >= 200 && resp.status < 300) {
                btn.innerText = "✅";
                window.setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    // Remove the task element from the DOM manually
                    const taskRow = activeDocument.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                    // Will trigger re-render on next filter click
                }, 900);
            }
            else {
                btn.innerText = "❌";
                new obsidian.Notice("Failed to delete task");
            }
        }
        catch {
            btn.innerText = "❌";
            new obsidian.Notice("Could not delete task");
        }
        finally {
            window.setTimeout(() => {
                btn._busy = false;
                btn.innerText = "🗑";
            }, 900);
        }
    }
    handleQueueCompletion(listWrapper) {
        const tasks = Array.from(listWrapper.querySelectorAll(".task"))
            .filter(el => {
            const elHtml = el;
            return !elHtml.classList.contains("completed") && elHtml.offsetParent !== null;
        });
        const next = tasks[0];
        if (next) {
            // Remove queue-dimmed
            next.classList.remove("queue-dimmed");
            // Select the task as if clicked
            window.requestAnimationFrame(() => {
                next.scrollIntoView({ behavior: "smooth", block: "center" });
                window.requestAnimationFrame(() => {
                    next.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
                });
            });
        }
    }
    createTaskDeadline(task) {
        const right = activeDocument.createElement("div");
        right.className = "task-deadline";
        const deadline = task.deadline?.date;
        if (!deadline)
            return right;
        const deadlineWrapper = activeDocument.createElement("div");
        deadlineWrapper.className = "deadline-wrapper";
        const deadlineLabel = activeDocument.createElement("div");
        deadlineLabel.textContent = "🎯 Deadline";
        deadlineLabel.className = "deadline-label";
        const deadlinePill = activeDocument.createElement("div");
        deadlinePill.className = "pill deadline-date";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        let deadlineText = "";
        if (diffDays === 0) {
            deadlineText = "Today";
        }
        else if (diffDays === 1) {
            deadlineText = "Tomorrow";
        }
        else if (diffDays > 1 && diffDays <= 5) {
            deadlineText = `In ${diffDays} days`;
        }
        else {
            const options = { month: "short", day: "numeric" };
            deadlineText = deadlineDate.toLocaleDateString("en-US", options);
        }
        deadlinePill.textContent = deadlineText;
        deadlineWrapper.appendChild(deadlineLabel);
        deadlineWrapper.appendChild(deadlinePill);
        right.appendChild(deadlineWrapper);
        return right;
    }
    getDragLockTargets(listWrapper) {
        const selectors = [
            ".workspace-leaf-content",
            ".markdown-preview-view",
            ".cm-editor",
            ".view-content",
        ];
        const doc = listWrapper.ownerDocument;
        const targets = selectors
            .map((selector) => doc.querySelector(selector))
            .filter((element) => Boolean(element));
        const listView = listWrapper.closest(".list-view");
        if (listView)
            targets.push(listView);
        return Array.from(new Set(targets));
    }
    setTaskDragLock(row, listWrapper, locked) {
        const body = listWrapper.ownerDocument.body;
        const targets = this.getDragLockTargets(listWrapper);
        body.classList.toggle("drag-disable", locked);
        body.classList.toggle("tb-scroll-lock", locked);
        row.classList.toggle("tb-touch-none", locked);
        row.classList.toggle("dragging-row", locked);
        listWrapper.classList.toggle("tb-touch-none", locked);
        listWrapper.classList.toggle("drag-scroll-block", locked);
        if (locked)
            listWrapper.ownerDocument.getSelection()?.removeAllRanges();
        targets.forEach((target) => {
            target.classList.toggle("tb-touch-none", locked);
            target.classList.toggle("tb-overflow-hidden", locked);
            target.classList.toggle("drag-scroll-block", locked && target.classList.contains("list-view"));
        });
    }
    // ======================= 🖱️ Drag & Drop =======================
    setupTaskDragAndDrop(row, listWrapper, filters) {
        let lastTap = 0;
        row.onpointerdown = (ev) => {
            // Ignore pointerdown if it's on the mini-toolbar/fixed-chin
            if (ev.target?.closest(".fixed-chin"))
                return;
            // // if (this.settings?.enableLogs) console.log("🔽 pointerdown", ev.pointerType, ev.clientX, ev.clientY);
            const tapNow = Date.now();
            if (tapNow - lastTap < 300)
                return;
            if (ev.target.closest('input[type="checkbox"]')) {
                return;
            }
            const isTouch = ev.pointerType === "touch" || ev.pointerType === "pen";
            const startX = ev.clientX;
            const startY = ev.clientY;
            let longPressTimer = null;
            let dragging = false;
            let pid = ev.pointerId;
            const beginDrag = (e) => {
                if (dragging)
                    return;
                dragging = true;
                if (e && e.cancelable) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                this.setTaskDragLock(row, listWrapper, true);
                if (navigator.vibrate) {
                    navigator.vibrate([30, 20, 30]);
                }
                const placeholder = row.cloneNode(true);
                placeholder.id = "todoist-placeholder";
                placeholder.className = "task-placeholder";
                listWrapper.insertBefore(placeholder, row);
                const moveWhileDragging = (e) => {
                    // // if (this.settings?.enableLogs) console.log("📍 pointermove during drag", e.clientY);
                    if (e.pointerId !== pid)
                        return;
                    e.preventDefault();
                    e.stopPropagation();
                    const rows = Array.from(listWrapper.children).filter(c => c !== row && c !== placeholder);
                    for (let i = 0; i < rows.length; i++) {
                        const other = rows[i];
                        const otherRect = other.getBoundingClientRect();
                        if (e.clientY < otherRect.top + otherRect.height / 2) {
                            listWrapper.insertBefore(placeholder, other);
                            break;
                        }
                        if (i === rows.length - 1) {
                            listWrapper.appendChild(placeholder);
                        }
                    }
                };
                const finishDrag = (e) => {
                    // // if (this.settings?.enableLogs) console.log("✅ finishDrag");
                    if (e.pointerId !== pid)
                        return;
                    row.releasePointerCapture(pid);
                    row.removeEventListener("pointermove", moveWhileDragging);
                    row.removeEventListener("pointerup", finishDrag);
                    row.removeEventListener("pointercancel", finishDrag);
                    row.removeEventListener("lostpointercapture", finishDrag);
                    this.setTaskDragLock(row, listWrapper, false);
                    listWrapper.insertBefore(row, placeholder);
                    placeholder.remove();
                    const newOrder = Array.from(listWrapper.children)
                        .map(c => c.getAttribute("data-id"))
                        .filter(id => id);
                    this.ensureRefactoredRuntime(this.settings.apiKey);
                    this.storage.setManualOrder(filters.join(","), newOrder);
                    void this.savePluginData();
                };
                row.setPointerCapture(pid);
                row.addEventListener("pointermove", moveWhileDragging);
                row.addEventListener("pointerup", finishDrag);
                row.addEventListener("pointercancel", finishDrag);
                row.addEventListener("lostpointercapture", finishDrag);
            };
            if (isTouch) {
                let moved = false;
                const moveThreshold = 25;
                const onTouchMove = (e) => {
                    // // if (this.settings?.enableLogs) console.log("👣 onTouchMove", e.clientX, e.clientY);
                    const dx = Math.abs(e.clientX - startX);
                    const dy = Math.abs(e.clientY - startY);
                    if (dx > moveThreshold || dy > moveThreshold) {
                        moved = true;
                        cleanup();
                    }
                };
                const cleanup = () => {
                    // // if (this.settings?.enableLogs) console.log("🧹 Cleanup triggered");
                    if (longPressTimer !== null)
                        window.clearTimeout(longPressTimer);
                    row.removeEventListener('pointermove', onTouchMove);
                    row.removeEventListener('pointerup', cleanup);
                    row.removeEventListener('pointercancel', cleanup);
                    this.setTaskDragLock(row, listWrapper, false);
                };
                // passive: false for pointermove
                row.addEventListener('pointermove', onTouchMove, { passive: true });
                row.addEventListener('pointerup', cleanup, { passive: true });
                row.addEventListener('pointercancel', cleanup, { passive: true });
                longPressTimer = window.setTimeout(() => {
                    // // if (this.settings?.enableLogs) console.log("⏳ Long press timer fired");
                    if (!moved) {
                        if (ev.cancelable)
                            ev.preventDefault();
                        beginDrag(ev);
                    }
                }, 150);
            }
            else if (ev.pointerType === "mouse") {
                const moveCheck = (e) => {
                    const dx = Math.abs(e.clientX - startX);
                    const dy = Math.abs(e.clientY - startY);
                    if (dx > 5 || dy > 5) {
                        row.removeEventListener("pointermove", moveCheck);
                        beginDrag(e);
                    }
                };
                row.addEventListener("pointermove", moveCheck);
                row.addEventListener("pointerup", () => {
                    row.removeEventListener("pointermove", moveCheck);
                });
            }
        };
        row.addEventListener("pointercancel", () => {
            // // if (this.settings?.enableLogs) console.log("⚠️ pointercancel triggered");
            window.getSelection()?.removeAllRanges();
        });
    }
    setupGlobalEventListeners() {
        this.registerDomEvent(this.app.workspace.containerEl, "click", (e) => {
            const target = e.target;
            if (!target)
                return;
            // Don’t react to clicks in the file explorer
            if (target.closest(".workspace-split.mod-left-split"))
                return;
            if (target.closest(".fixed-chin"))
                return;
            if (!target.closest(".task-inner")) {
                this.clearSelectedTaskHighlight();
            }
        });
        // Cancel click inside modal
        activeDocument.addEventListener('click', (ev) => {
            const t = ev.target;
            if (!t)
                return;
            // Common selectors
            const bySelector = t.closest('.todoist-modal .btn-cancel, .todoist-modal [data-action="cancel"], .todoist-modal [data-cancel], .todoist-modal .cancel, .todoist-modal button[aria-label="Cancel"]');
            // Fallback: any button whose text is “Cancel” inside the modal
            const btn = t.closest('button');
            const inModal = t.closest('.todoist-modal');
            const textLooksLikeCancel = btn && /\bcancel\b/i.test((btn.textContent || '').trim());
            if (bySelector || (inModal && textLooksLikeCancel)) {
                ev.preventDefault();
                ev.stopPropagation();
                this.closeAnyModal();
            }
        }, { capture: true });
        // Escape closes modal
        activeDocument.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape' && activeDocument.querySelector('.todoist-modal')) {
                ev.preventDefault();
                this.closeAnyModal();
            }
        });
    }
    clearSelectedTaskHighlight() {
        activeDocument.querySelectorAll(".selected-task").forEach((el) => {
            el.classList.remove("selected-task");
            void el.offsetWidth; // force reflow
            window.setTimeout(() => {
                const toolbar = el.querySelector("#mini-toolbar-wrapper");
                if (toolbar)
                    toolbar.remove();
            }, 0); // delay toolbar removal until next frame
        });
    }
    createPriorityCheckbox(priority, onChange) {
        const priorityColors = {
            4: "#d1453b", // P1 - red
            3: "#eb8909", // P2 - orange
            2: "#246fe0", // P3 - blue
            1: "#808080", // P4 - grey
        };
        const checkbox = activeDocument.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todoist-checkbox";
        const rowPrioColor = priorityColors[priority] || "#999";
        const rowEl = checkbox.closest(".todoist-card") ||
            checkbox.closest(".task") ||
            checkbox.closest(".task-row") ||
            checkbox.parentElement;
        if (rowEl)
            rowEl.style.setProperty("--prio-color", rowPrioColor);
        // Prevent task selection when clicking checkbox
        checkbox.addEventListener("click", async (e) => {
            e.stopPropagation(); // Prevents selecting the task when checking
        });
        checkbox.addEventListener("change", async () => {
            // Find the row (task container)
            const row = checkbox.closest('.task');
            await onChange();
            // Animation and haptic feedback when marking complete
            if (checkbox.checked && row) {
                if (navigator.vibrate)
                    navigator.vibrate([20]);
                row.classList.add("task-checked-anim");
                // Add completed class and fade out
                row.classList.add("completed");
                // TypeScript fix: cast row to HTMLElement for .style
                const rowEl = row;
                rowEl.classList.add("tb-dimming");
                window.setTimeout(() => {
                    // Optionally remove from DOM after 300ms
                    if (rowEl.parentElement)
                        rowEl.parentElement.removeChild(rowEl);
                }, 300);
                window.setTimeout(() => rowEl.classList.remove("task-checked-anim"), 200);
            }
        });
        return checkbox;
    }
    updateQueueView(active, listWrapper) {
        const rows = Array.from(listWrapper.children);
        rows.forEach((r, i) => {
            const titleSpan = r.querySelector(".task-title");
            if (!titleSpan)
                return;
            if (active) {
                if (i === 0) {
                    r.classList.remove("queue-dimmed");
                    r.classList.add("queue-focused");
                    titleSpan.classList.add("queue-focused-title");
                    r.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
                }
                else {
                    r.classList.add("queue-dimmed");
                    r.classList.remove("queue-focused");
                    titleSpan.classList.remove("queue-focused-title");
                }
            }
            else {
                r.classList.remove("queue-dimmed", "queue-focused");
                titleSpan.classList.remove("queue-focused-title");
            }
        });
    }
}
TodoistBoardPlugin.commonTimezones = COMMON_TIMEZONES;

exports.default = TodoistBoardPlugin;
//# sourceMappingURL=main.js.map
