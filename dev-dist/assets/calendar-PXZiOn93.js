import { s as ChevronDown } from "./select-CoyssZ7i.js";
import { t as ChevronRight } from "./chevron-right-BdSmmFgO.js";
import { n as getMonth, t as getYear } from "./getYear-Btus7Vwh.js";
import { A as startOfISOWeek, C as enUS$1, D as startOfDay, E as differenceInCalendarDays, F as constructFrom, It as require_react, M as getDefaultOptions, N as addMonths, O as normalizeDates, P as toDate, Rt as __export, S as getISOWeek, St as require_jsx_runtime, T as isDate, at as createLucideIcon, b as getWeek, h as format, j as startOfWeek, n as buttonVariants, t as Button, tt as cn, w as startOfYear, zt as __toESM } from "./index-C2ICZTGx.js";
var ChevronLeft = createLucideIcon("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]);
function addDays(date, amount, options) {
	const _date = toDate(date, options?.in);
	if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
	if (!amount) return _date;
	_date.setDate(_date.getDate() + amount);
	return _date;
}
function addWeeks(date, amount, options) {
	return addDays(date, amount * 7, options);
}
function addYears(date, amount, options) {
	return addMonths(date, amount * 12, options);
}
function max(dates, options) {
	let result;
	let context = options?.in;
	dates.forEach((date) => {
		if (!context && typeof date === "object") context = constructFrom.bind(null, date);
		const date_ = toDate(date, context);
		if (!result || result < date_ || isNaN(+date_)) result = date_;
	});
	return constructFrom(context, result || NaN);
}
function min(dates, options) {
	let result;
	let context = options?.in;
	dates.forEach((date) => {
		if (!context && typeof date === "object") context = constructFrom.bind(null, date);
		const date_ = toDate(date, context);
		if (!result || result > date_ || isNaN(+date_)) result = date_;
	});
	return constructFrom(context, result || NaN);
}
function isSameDay(laterDate, earlierDate, options) {
	const [dateLeft_, dateRight_] = normalizeDates(options?.in, laterDate, earlierDate);
	return +startOfDay(dateLeft_) === +startOfDay(dateRight_);
}
function differenceInCalendarMonths(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
	const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();
	return yearsDiff * 12 + monthsDiff;
}
function endOfMonth(date, options) {
	const _date = toDate(date, options?.in);
	const month = _date.getMonth();
	_date.setFullYear(_date.getFullYear(), month + 1, 0);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
function normalizeInterval(context, interval) {
	const [start, end] = normalizeDates(context, interval.start, interval.end);
	return {
		start,
		end
	};
}
function eachMonthOfInterval(interval, options) {
	const { start, end } = normalizeInterval(options?.in, interval);
	let reversed = +start > +end;
	const endTime = reversed ? +start : +end;
	const date = reversed ? end : start;
	date.setHours(0, 0, 0, 0);
	date.setDate(1);
	let step = options?.step ?? 1;
	if (!step) return [];
	if (step < 0) {
		step = -step;
		reversed = !reversed;
	}
	const dates = [];
	while (+date <= endTime) {
		dates.push(constructFrom(start, date));
		date.setMonth(date.getMonth() + step);
	}
	return reversed ? dates.reverse() : dates;
}
function startOfMonth(date, options) {
	const _date = toDate(date, options?.in);
	_date.setDate(1);
	_date.setHours(0, 0, 0, 0);
	return _date;
}
function endOfYear(date, options) {
	const _date = toDate(date, options?.in);
	const year = _date.getFullYear();
	_date.setFullYear(year + 1, 0, 0);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
function eachYearOfInterval(interval, options) {
	const { start, end } = normalizeInterval(options?.in, interval);
	let reversed = +start > +end;
	const endTime = reversed ? +start : +end;
	const date = reversed ? end : start;
	date.setHours(0, 0, 0, 0);
	date.setMonth(0, 1);
	let step = options?.step ?? 1;
	if (!step) return [];
	if (step < 0) {
		step = -step;
		reversed = !reversed;
	}
	const dates = [];
	while (+date <= endTime) {
		dates.push(constructFrom(start, date));
		date.setFullYear(date.getFullYear() + step);
	}
	return reversed ? dates.reverse() : dates;
}
function endOfWeek(date, options) {
	const defaultOptions = getDefaultOptions();
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const _date = toDate(date, options?.in);
	const day = _date.getDay();
	const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
	_date.setDate(_date.getDate() + diff);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
function endOfISOWeek(date, options) {
	return endOfWeek(date, {
		...options,
		weekStartsOn: 1
	});
}
function getDaysInMonth(date, options) {
	const _date = toDate(date, options?.in);
	const year = _date.getFullYear();
	const monthIndex = _date.getMonth();
	const lastDayOfMonth = constructFrom(_date, 0);
	lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
	lastDayOfMonth.setHours(0, 0, 0, 0);
	return lastDayOfMonth.getDate();
}
function isAfter(date, dateToCompare) {
	return +toDate(date) > +toDate(dateToCompare);
}
function isBefore(date, dateToCompare) {
	return +toDate(date) < +toDate(dateToCompare);
}
function isSameMonth(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	return laterDate_.getFullYear() === earlierDate_.getFullYear() && laterDate_.getMonth() === earlierDate_.getMonth();
}
function isSameYear(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	return laterDate_.getFullYear() === earlierDate_.getFullYear();
}
function setMonth(date, month, options) {
	const _date = toDate(date, options?.in);
	const year = _date.getFullYear();
	const day = _date.getDate();
	const midMonth = constructFrom(options?.in || date, 0);
	midMonth.setFullYear(year, month, 15);
	midMonth.setHours(0, 0, 0, 0);
	const daysInMonth = getDaysInMonth(midMonth);
	_date.setMonth(month, Math.min(day, daysInMonth));
	return _date;
}
function setYear(date, year, options) {
	const date_ = toDate(date, options?.in);
	if (isNaN(+date_)) return constructFrom(options?.in || date, NaN);
	date_.setFullYear(year);
	return date_;
}
function tzName(timeZone, date, format$1 = "long") {
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		timeZone,
		timeZoneName: format$1
	}).format(date).split(/\s/g).slice(2).join(" ");
}
var offsetFormatCache = {};
var offsetCache = {};
function tzOffset(timeZone, date) {
	try {
		const offsetStr = (offsetFormatCache[timeZone] ||= new Intl.DateTimeFormat("en-US", {
			timeZone,
			timeZoneName: "longOffset"
		}).format)(date).split("GMT")[1];
		if (offsetStr in offsetCache) return offsetCache[offsetStr];
		return calcOffset(offsetStr, offsetStr.split(":"));
	} catch {
		if (timeZone in offsetCache) return offsetCache[timeZone];
		const captures = timeZone?.match(offsetRe);
		if (captures) return calcOffset(timeZone, captures.slice(1));
		return NaN;
	}
}
var offsetRe = /([+-]\d\d):?(\d\d)?/;
function calcOffset(cacheStr, values) {
	const hours = +(values[0] || 0);
	const minutes = +(values[1] || 0);
	const seconds = +(values[2] || 0) / 60;
	return offsetCache[cacheStr] = hours * 60 + minutes > 0 ? hours * 60 + minutes + seconds : hours * 60 - minutes - seconds;
}
var TZDateMini = class TZDateMini extends Date {
	constructor(...args) {
		super();
		if (args.length > 1 && typeof args[args.length - 1] === "string") this.timeZone = args.pop();
		this.internal = /* @__PURE__ */ new Date();
		if (isNaN(tzOffset(this.timeZone, this))) this.setTime(NaN);
		else if (!args.length) this.setTime(Date.now());
		else if (typeof args[0] === "number" && (args.length === 1 || args.length === 2 && typeof args[1] !== "number")) this.setTime(args[0]);
		else if (typeof args[0] === "string") this.setTime(+new Date(args[0]));
		else if (args[0] instanceof Date) this.setTime(+args[0]);
		else {
			this.setTime(+new Date(...args));
			adjustToSystemTZ(this, NaN);
			syncToInternal(this);
		}
	}
	static tz(tz, ...args) {
		return args.length ? new TZDateMini(...args, tz) : new TZDateMini(Date.now(), tz);
	}
	withTimeZone(timeZone) {
		return new TZDateMini(+this, timeZone);
	}
	getTimezoneOffset() {
		const offset = -tzOffset(this.timeZone, this);
		return offset > 0 ? Math.floor(offset) : Math.ceil(offset);
	}
	setTime(time) {
		Date.prototype.setTime.apply(this, arguments);
		syncToInternal(this);
		return +this;
	}
	[Symbol.for("constructDateFrom")](date) {
		return new TZDateMini(+new Date(date), this.timeZone);
	}
};
var re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
	if (!re.test(method)) return;
	const utcMethod = method.replace(re, "$1UTC");
	if (!TZDateMini.prototype[utcMethod]) return;
	if (method.startsWith("get")) TZDateMini.prototype[method] = function() {
		return this.internal[utcMethod]();
	};
	else {
		TZDateMini.prototype[method] = function() {
			Date.prototype[utcMethod].apply(this.internal, arguments);
			syncFromInternal(this);
			return +this;
		};
		TZDateMini.prototype[utcMethod] = function() {
			Date.prototype[utcMethod].apply(this, arguments);
			syncToInternal(this);
			return +this;
		};
	}
});
function syncToInternal(date) {
	date.internal.setTime(+date);
	date.internal.setUTCSeconds(date.internal.getUTCSeconds() - Math.round(-tzOffset(date.timeZone, date) * 60));
}
function syncFromInternal(date) {
	Date.prototype.setFullYear.call(date, date.internal.getUTCFullYear(), date.internal.getUTCMonth(), date.internal.getUTCDate());
	Date.prototype.setHours.call(date, date.internal.getUTCHours(), date.internal.getUTCMinutes(), date.internal.getUTCSeconds(), date.internal.getUTCMilliseconds());
	adjustToSystemTZ(date);
}
function adjustToSystemTZ(date) {
	const baseOffset = tzOffset(date.timeZone, date);
	const offset = baseOffset > 0 ? Math.floor(baseOffset) : Math.ceil(baseOffset);
	const prevHour = /* @__PURE__ */ new Date(+date);
	prevHour.setUTCHours(prevHour.getUTCHours() - 1);
	const systemOffset = -(/* @__PURE__ */ new Date(+date)).getTimezoneOffset();
	const systemDSTChange = systemOffset - -(/* @__PURE__ */ new Date(+prevHour)).getTimezoneOffset();
	const dstShift = Date.prototype.getHours.apply(date) !== date.internal.getUTCHours();
	if (systemDSTChange && dstShift) date.internal.setUTCMinutes(date.internal.getUTCMinutes() + systemDSTChange);
	const offsetDiff = systemOffset - offset;
	if (offsetDiff) Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + offsetDiff);
	const systemDate = /* @__PURE__ */ new Date(+date);
	systemDate.setUTCSeconds(0);
	const systemSecondsOffset = systemOffset > 0 ? systemDate.getSeconds() : (systemDate.getSeconds() - 60) % 60;
	const secondsOffset = Math.round(-(tzOffset(date.timeZone, date) * 60)) % 60;
	if (secondsOffset || systemSecondsOffset) {
		date.internal.setUTCSeconds(date.internal.getUTCSeconds() + secondsOffset);
		Date.prototype.setUTCSeconds.call(date, Date.prototype.getUTCSeconds.call(date) + secondsOffset + systemSecondsOffset);
	}
	const postBaseOffset = tzOffset(date.timeZone, date);
	const postOffset = postBaseOffset > 0 ? Math.floor(postBaseOffset) : Math.ceil(postBaseOffset);
	const postOffsetDiff = -(/* @__PURE__ */ new Date(+date)).getTimezoneOffset() - postOffset;
	const offsetChanged = postOffset !== offset;
	const postDiff = postOffsetDiff - offsetDiff;
	if (offsetChanged && postDiff) {
		Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + postDiff);
		const newBaseOffset = tzOffset(date.timeZone, date);
		const offsetChange = postOffset - (newBaseOffset > 0 ? Math.floor(newBaseOffset) : Math.ceil(newBaseOffset));
		if (offsetChange) {
			date.internal.setUTCMinutes(date.internal.getUTCMinutes() + offsetChange);
			Date.prototype.setUTCMinutes.call(date, Date.prototype.getUTCMinutes.call(date) + offsetChange);
		}
	}
}
var TZDate = class TZDate extends TZDateMini {
	static tz(tz, ...args) {
		return args.length ? new TZDate(...args, tz) : new TZDate(Date.now(), tz);
	}
	toISOString() {
		const [sign, hours, minutes] = this.tzComponents();
		const tz = `${sign}${hours}:${minutes}`;
		return this.internal.toISOString().slice(0, -1) + tz;
	}
	toString() {
		return `${this.toDateString()} ${this.toTimeString()}`;
	}
	toDateString() {
		const [day, date, month, year] = this.internal.toUTCString().split(" ");
		return `${day?.slice(0, -1)} ${month} ${date} ${year}`;
	}
	toTimeString() {
		const time = this.internal.toUTCString().split(" ")[4];
		const [sign, hours, minutes] = this.tzComponents();
		return `${time} GMT${sign}${hours}${minutes} (${tzName(this.timeZone, this)})`;
	}
	toLocaleString(locales, options) {
		return Date.prototype.toLocaleString.call(this, locales, {
			...options,
			timeZone: options?.timeZone || this.timeZone
		});
	}
	toLocaleDateString(locales, options) {
		return Date.prototype.toLocaleDateString.call(this, locales, {
			...options,
			timeZone: options?.timeZone || this.timeZone
		});
	}
	toLocaleTimeString(locales, options) {
		return Date.prototype.toLocaleTimeString.call(this, locales, {
			...options,
			timeZone: options?.timeZone || this.timeZone
		});
	}
	tzComponents() {
		const offset = this.getTimezoneOffset();
		return [
			offset > 0 ? "-" : "+",
			String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0"),
			String(Math.abs(offset) % 60).padStart(2, "0")
		];
	}
	withTimeZone(timeZone) {
		return new TZDate(+this, timeZone);
	}
	[Symbol.for("constructDateFrom")](date) {
		return new TZDate(+new Date(date), this.timeZone);
	}
};
var FIVE_WEEKS = 5;
var FOUR_WEEKS = 4;
function getBroadcastWeeksInMonth(month, dateLib) {
	const firstDayOfMonth = dateLib.startOfMonth(month);
	const firstDayOfWeek = firstDayOfMonth.getDay() > 0 ? firstDayOfMonth.getDay() : 7;
	const broadcastStartDate = dateLib.addDays(month, -firstDayOfWeek + 1);
	const lastDateOfLastWeek = dateLib.addDays(broadcastStartDate, FIVE_WEEKS * 7 - 1);
	return dateLib.getMonth(month) === dateLib.getMonth(lastDateOfLastWeek) ? FIVE_WEEKS : FOUR_WEEKS;
}
function startOfBroadcastWeek(date, dateLib) {
	const firstOfMonth = dateLib.startOfMonth(date);
	const dayOfWeek = firstOfMonth.getDay();
	if (dayOfWeek === 1) return firstOfMonth;
	else if (dayOfWeek === 0) return dateLib.addDays(firstOfMonth, -6);
	else return dateLib.addDays(firstOfMonth, -1 * (dayOfWeek - 1));
}
function endOfBroadcastWeek(date, dateLib) {
	const startDate = startOfBroadcastWeek(date, dateLib);
	const numberOfWeeks = getBroadcastWeeksInMonth(date, dateLib);
	return dateLib.addDays(startDate, numberOfWeeks * 7 - 1);
}
const enUS = {
	...enUS$1,
	labels: {
		labelDayButton: (date, modifiers, options, dateLib) => {
			let formatDate;
			if (dateLib && typeof dateLib.format === "function") formatDate = dateLib.format.bind(dateLib);
			else formatDate = (d, pattern) => format(d, pattern, {
				locale: enUS$1,
				...options
			});
			let label = formatDate(date, "PPPP");
			if (modifiers.today) label = `Today, ${label}`;
			if (modifiers.selected) label = `${label}, selected`;
			return label;
		},
		labelMonthDropdown: "Choose the Month",
		labelNext: "Go to the Next Month",
		labelPrevious: "Go to the Previous Month",
		labelWeekNumber: (weekNumber) => `Week ${weekNumber}`,
		labelYearDropdown: "Choose the Year",
		labelGrid: (date, options, dateLib) => {
			let formatDate;
			if (dateLib && typeof dateLib.format === "function") formatDate = dateLib.format.bind(dateLib);
			else formatDate = (d, pattern) => format(d, pattern, {
				locale: enUS$1,
				...options
			});
			return formatDate(date, "LLLL yyyy");
		},
		labelGridcell: (date, modifiers, options, dateLib) => {
			let formatDate;
			if (dateLib && typeof dateLib.format === "function") formatDate = dateLib.format.bind(dateLib);
			else formatDate = (d, pattern) => format(d, pattern, {
				locale: enUS$1,
				...options
			});
			let label = formatDate(date, "PPPP");
			if (modifiers?.today) label = `Today, ${label}`;
			return label;
		},
		labelNav: "Navigation bar",
		labelWeekNumberHeader: "Week Number",
		labelWeekday: (date, options, dateLib) => {
			let formatDate;
			if (dateLib && typeof dateLib.format === "function") formatDate = dateLib.format.bind(dateLib);
			else formatDate = (d, pattern) => format(d, pattern, {
				locale: enUS$1,
				...options
			});
			return formatDate(date, "cccc");
		}
	}
};
var DateLib = class DateLib {
	constructor(options, overrides) {
		this.Date = Date;
		this.today = () => {
			if (this.overrides?.today) return this.overrides.today();
			if (this.options.timeZone) return TZDate.tz(this.options.timeZone);
			return new this.Date();
		};
		this.newDate = (year, monthIndex, date) => {
			if (this.overrides?.newDate) return this.overrides.newDate(year, monthIndex, date);
			if (this.options.timeZone) return new TZDate(year, monthIndex, date, this.options.timeZone);
			return new Date(year, monthIndex, date);
		};
		this.addDays = (date, amount) => {
			return this.overrides?.addDays ? this.overrides.addDays(date, amount) : addDays(date, amount);
		};
		this.addMonths = (date, amount) => {
			return this.overrides?.addMonths ? this.overrides.addMonths(date, amount) : addMonths(date, amount);
		};
		this.addWeeks = (date, amount) => {
			return this.overrides?.addWeeks ? this.overrides.addWeeks(date, amount) : addWeeks(date, amount);
		};
		this.addYears = (date, amount) => {
			return this.overrides?.addYears ? this.overrides.addYears(date, amount) : addYears(date, amount);
		};
		this.differenceInCalendarDays = (dateLeft, dateRight) => {
			return this.overrides?.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(dateLeft, dateRight) : differenceInCalendarDays(dateLeft, dateRight);
		};
		this.differenceInCalendarMonths = (dateLeft, dateRight) => {
			return this.overrides?.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(dateLeft, dateRight) : differenceInCalendarMonths(dateLeft, dateRight);
		};
		this.eachMonthOfInterval = (interval) => {
			return this.overrides?.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(interval) : eachMonthOfInterval(interval);
		};
		this.eachYearOfInterval = (interval) => {
			const years = this.overrides?.eachYearOfInterval ? this.overrides.eachYearOfInterval(interval) : eachYearOfInterval(interval);
			const uniqueYears = new Set(years.map((d) => this.getYear(d)));
			if (uniqueYears.size === years.length) return years;
			const yearsArray = [];
			uniqueYears.forEach((y) => {
				yearsArray.push(new Date(y, 0, 1));
			});
			return yearsArray;
		};
		this.endOfBroadcastWeek = (date) => {
			return this.overrides?.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(date) : endOfBroadcastWeek(date, this);
		};
		this.endOfISOWeek = (date) => {
			return this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(date) : endOfISOWeek(date);
		};
		this.endOfMonth = (date) => {
			return this.overrides?.endOfMonth ? this.overrides.endOfMonth(date) : endOfMonth(date);
		};
		this.endOfWeek = (date, options$1) => {
			return this.overrides?.endOfWeek ? this.overrides.endOfWeek(date, options$1) : endOfWeek(date, this.options);
		};
		this.endOfYear = (date) => {
			return this.overrides?.endOfYear ? this.overrides.endOfYear(date) : endOfYear(date);
		};
		this.format = (date, formatStr, _options) => {
			const formatted = this.overrides?.format ? this.overrides.format(date, formatStr, this.options) : format(date, formatStr, this.options);
			if (this.options.numerals && this.options.numerals !== "latn") return this.replaceDigits(formatted);
			return formatted;
		};
		this.getISOWeek = (date) => {
			return this.overrides?.getISOWeek ? this.overrides.getISOWeek(date) : getISOWeek(date);
		};
		this.getMonth = (date, _options) => {
			return this.overrides?.getMonth ? this.overrides.getMonth(date, this.options) : getMonth(date, this.options);
		};
		this.getYear = (date, _options) => {
			return this.overrides?.getYear ? this.overrides.getYear(date, this.options) : getYear(date, this.options);
		};
		this.getWeek = (date, _options) => {
			return this.overrides?.getWeek ? this.overrides.getWeek(date, this.options) : getWeek(date, this.options);
		};
		this.isAfter = (date, dateToCompare) => {
			return this.overrides?.isAfter ? this.overrides.isAfter(date, dateToCompare) : isAfter(date, dateToCompare);
		};
		this.isBefore = (date, dateToCompare) => {
			return this.overrides?.isBefore ? this.overrides.isBefore(date, dateToCompare) : isBefore(date, dateToCompare);
		};
		this.isDate = (value) => {
			return this.overrides?.isDate ? this.overrides.isDate(value) : isDate(value);
		};
		this.isSameDay = (dateLeft, dateRight) => {
			return this.overrides?.isSameDay ? this.overrides.isSameDay(dateLeft, dateRight) : isSameDay(dateLeft, dateRight);
		};
		this.isSameMonth = (dateLeft, dateRight) => {
			return this.overrides?.isSameMonth ? this.overrides.isSameMonth(dateLeft, dateRight) : isSameMonth(dateLeft, dateRight);
		};
		this.isSameYear = (dateLeft, dateRight) => {
			return this.overrides?.isSameYear ? this.overrides.isSameYear(dateLeft, dateRight) : isSameYear(dateLeft, dateRight);
		};
		this.max = (dates) => {
			return this.overrides?.max ? this.overrides.max(dates) : max(dates);
		};
		this.min = (dates) => {
			return this.overrides?.min ? this.overrides.min(dates) : min(dates);
		};
		this.setMonth = (date, month) => {
			return this.overrides?.setMonth ? this.overrides.setMonth(date, month) : setMonth(date, month);
		};
		this.setYear = (date, year) => {
			return this.overrides?.setYear ? this.overrides.setYear(date, year) : setYear(date, year);
		};
		this.startOfBroadcastWeek = (date, _dateLib) => {
			return this.overrides?.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(date, this) : startOfBroadcastWeek(date, this);
		};
		this.startOfDay = (date) => {
			return this.overrides?.startOfDay ? this.overrides.startOfDay(date) : startOfDay(date);
		};
		this.startOfISOWeek = (date) => {
			return this.overrides?.startOfISOWeek ? this.overrides.startOfISOWeek(date) : startOfISOWeek(date);
		};
		this.startOfMonth = (date) => {
			return this.overrides?.startOfMonth ? this.overrides.startOfMonth(date) : startOfMonth(date);
		};
		this.startOfWeek = (date, _options) => {
			return this.overrides?.startOfWeek ? this.overrides.startOfWeek(date, this.options) : startOfWeek(date, this.options);
		};
		this.startOfYear = (date) => {
			return this.overrides?.startOfYear ? this.overrides.startOfYear(date) : startOfYear(date);
		};
		this.options = {
			locale: enUS,
			...options
		};
		this.overrides = overrides;
	}
	getDigitMap() {
		const { numerals = "latn" } = this.options;
		const formatter = new Intl.NumberFormat("en-US", { numberingSystem: numerals });
		const digitMap = {};
		for (let i = 0; i < 10; i++) digitMap[i.toString()] = formatter.format(i);
		return digitMap;
	}
	replaceDigits(input) {
		const digitMap = this.getDigitMap();
		return input.replace(/\d/g, (digit) => digitMap[digit] || digit);
	}
	formatNumber(value) {
		return this.replaceDigits(value.toString());
	}
	getMonthYearOrder() {
		const code = this.options.locale?.code;
		if (!code) return "month-first";
		return DateLib.yearFirstLocales.has(code) ? "year-first" : "month-first";
	}
	formatMonthYear(date) {
		const { locale, timeZone, numerals } = this.options;
		const localeCode = locale?.code;
		if (localeCode && DateLib.yearFirstLocales.has(localeCode)) try {
			return new Intl.DateTimeFormat(localeCode, {
				month: "long",
				year: "numeric",
				timeZone,
				numberingSystem: numerals
			}).format(date);
		} catch {}
		const pattern = this.getMonthYearOrder() === "year-first" ? "y LLLL" : "LLLL y";
		return this.format(date, pattern);
	}
};
DateLib.yearFirstLocales = new Set([
	"eu",
	"hu",
	"ja",
	"ja-Hira",
	"ja-JP",
	"ko",
	"ko-KR",
	"lt",
	"lt-LT",
	"lv",
	"lv-LV",
	"mn",
	"mn-MN",
	"zh",
	"zh-CN",
	"zh-HK",
	"zh-TW"
]);
const defaultDateLib = new DateLib();
var CalendarDay = class {
	constructor(date, displayMonth, dateLib = defaultDateLib) {
		this.date = date;
		this.displayMonth = displayMonth;
		this.outside = Boolean(displayMonth && !dateLib.isSameMonth(date, displayMonth));
		this.dateLib = dateLib;
		this.isoDate = dateLib.format(date, "yyyy-MM-dd");
		this.displayMonthId = dateLib.format(displayMonth, "yyyy-MM");
		this.dateMonthId = dateLib.format(date, "yyyy-MM");
	}
	isEqualTo(day) {
		return this.dateLib.isSameDay(day.date, this.date) && this.dateLib.isSameMonth(day.displayMonth, this.displayMonth);
	}
};
var CalendarMonth = class {
	constructor(month, weeks) {
		this.date = month;
		this.weeks = weeks;
	}
};
var CalendarWeek = class {
	constructor(weekNumber, days) {
		this.days = days;
		this.weekNumber = weekNumber;
	}
};
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function Button$1(props) {
	return import_react.createElement("button", { ...props });
}
function CaptionLabel(props) {
	return import_react.createElement("span", { ...props });
}
function Chevron(props) {
	const { size = 24, orientation = "left", className } = props;
	return import_react.createElement("svg", {
		className,
		width: size,
		height: size,
		viewBox: "0 0 24 24"
	}, orientation === "up" && import_react.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }), orientation === "down" && import_react.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }), orientation === "left" && import_react.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }), orientation === "right" && import_react.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" }));
}
function Day(props) {
	const { day, modifiers, ...tdProps } = props;
	return import_react.createElement("td", { ...tdProps });
}
function DayButton(props) {
	const { day, modifiers, ...buttonProps } = props;
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);
	return import_react.createElement("button", {
		ref,
		...buttonProps
	});
}
var UI;
(function(UI$1) {
	UI$1["Root"] = "root";
	UI$1["Chevron"] = "chevron";
	UI$1["Day"] = "day";
	UI$1["DayButton"] = "day_button";
	UI$1["CaptionLabel"] = "caption_label";
	UI$1["Dropdowns"] = "dropdowns";
	UI$1["Dropdown"] = "dropdown";
	UI$1["DropdownRoot"] = "dropdown_root";
	UI$1["Footer"] = "footer";
	UI$1["MonthGrid"] = "month_grid";
	UI$1["MonthCaption"] = "month_caption";
	UI$1["MonthsDropdown"] = "months_dropdown";
	UI$1["Month"] = "month";
	UI$1["Months"] = "months";
	UI$1["Nav"] = "nav";
	UI$1["NextMonthButton"] = "button_next";
	UI$1["PreviousMonthButton"] = "button_previous";
	UI$1["Week"] = "week";
	UI$1["Weeks"] = "weeks";
	UI$1["Weekday"] = "weekday";
	UI$1["Weekdays"] = "weekdays";
	UI$1["WeekNumber"] = "week_number";
	UI$1["WeekNumberHeader"] = "week_number_header";
	UI$1["YearsDropdown"] = "years_dropdown";
})(UI || (UI = {}));
var DayFlag;
(function(DayFlag$1) {
	DayFlag$1["disabled"] = "disabled";
	DayFlag$1["hidden"] = "hidden";
	DayFlag$1["outside"] = "outside";
	DayFlag$1["focused"] = "focused";
	DayFlag$1["today"] = "today";
})(DayFlag || (DayFlag = {}));
var SelectionState;
(function(SelectionState$1) {
	SelectionState$1["range_end"] = "range_end";
	SelectionState$1["range_middle"] = "range_middle";
	SelectionState$1["range_start"] = "range_start";
	SelectionState$1["selected"] = "selected";
})(SelectionState || (SelectionState = {}));
var Animation;
(function(Animation$1) {
	Animation$1["weeks_before_enter"] = "weeks_before_enter";
	Animation$1["weeks_before_exit"] = "weeks_before_exit";
	Animation$1["weeks_after_enter"] = "weeks_after_enter";
	Animation$1["weeks_after_exit"] = "weeks_after_exit";
	Animation$1["caption_after_enter"] = "caption_after_enter";
	Animation$1["caption_after_exit"] = "caption_after_exit";
	Animation$1["caption_before_enter"] = "caption_before_enter";
	Animation$1["caption_before_exit"] = "caption_before_exit";
})(Animation || (Animation = {}));
function Dropdown(props) {
	const { options, className, components, classNames, ...selectProps } = props;
	const cssClassSelect = [classNames[UI.Dropdown], className].join(" ");
	const selectedOption = options?.find(({ value }) => value === selectProps.value);
	return import_react.createElement("span", {
		"data-disabled": selectProps.disabled,
		className: classNames[UI.DropdownRoot]
	}, import_react.createElement(components.Select, {
		className: cssClassSelect,
		...selectProps
	}, options?.map(({ value, label, disabled }) => import_react.createElement(components.Option, {
		key: value,
		value,
		disabled
	}, label))), import_react.createElement("span", {
		className: classNames[UI.CaptionLabel],
		"aria-hidden": true
	}, selectedOption?.label, import_react.createElement(components.Chevron, {
		orientation: "down",
		size: 18,
		className: classNames[UI.Chevron]
	})));
}
function DropdownNav(props) {
	return import_react.createElement("div", { ...props });
}
function Footer(props) {
	return import_react.createElement("div", { ...props });
}
function Month(props) {
	const { calendarMonth, displayIndex, ...divProps } = props;
	return import_react.createElement("div", { ...divProps }, props.children);
}
function MonthCaption(props) {
	const { calendarMonth, displayIndex, ...divProps } = props;
	return import_react.createElement("div", { ...divProps });
}
function MonthGrid(props) {
	return import_react.createElement("table", { ...props });
}
function Months(props) {
	return import_react.createElement("div", { ...props });
}
const dayPickerContext = (0, import_react.createContext)(void 0);
function useDayPicker() {
	const context = (0, import_react.useContext)(dayPickerContext);
	if (context === void 0) throw new Error("useDayPicker() must be used within a custom component.");
	return context;
}
function MonthsDropdown(props) {
	const { components } = useDayPicker();
	return import_react.createElement(components.Dropdown, { ...props });
}
function Nav(props) {
	const { onPreviousClick, onNextClick, previousMonth, nextMonth, ...navProps } = props;
	const { components, classNames, labels: { labelPrevious: labelPrevious$1, labelNext: labelNext$1 } } = useDayPicker();
	const handleNextClick = (0, import_react.useCallback)((e) => {
		if (nextMonth) onNextClick?.(e);
	}, [nextMonth, onNextClick]);
	const handlePreviousClick = (0, import_react.useCallback)((e) => {
		if (previousMonth) onPreviousClick?.(e);
	}, [previousMonth, onPreviousClick]);
	return import_react.createElement("nav", { ...navProps }, import_react.createElement(components.PreviousMonthButton, {
		type: "button",
		className: classNames[UI.PreviousMonthButton],
		tabIndex: previousMonth ? void 0 : -1,
		"aria-disabled": previousMonth ? void 0 : true,
		"aria-label": labelPrevious$1(previousMonth),
		onClick: handlePreviousClick
	}, import_react.createElement(components.Chevron, {
		disabled: previousMonth ? void 0 : true,
		className: classNames[UI.Chevron],
		orientation: "left"
	})), import_react.createElement(components.NextMonthButton, {
		type: "button",
		className: classNames[UI.NextMonthButton],
		tabIndex: nextMonth ? void 0 : -1,
		"aria-disabled": nextMonth ? void 0 : true,
		"aria-label": labelNext$1(nextMonth),
		onClick: handleNextClick
	}, import_react.createElement(components.Chevron, {
		disabled: nextMonth ? void 0 : true,
		orientation: "right",
		className: classNames[UI.Chevron]
	})));
}
function NextMonthButton(props) {
	const { components } = useDayPicker();
	return import_react.createElement(components.Button, { ...props });
}
function Option(props) {
	return import_react.createElement("option", { ...props });
}
function PreviousMonthButton(props) {
	const { components } = useDayPicker();
	return import_react.createElement(components.Button, { ...props });
}
function Root(props) {
	const { rootRef, ...rest } = props;
	return import_react.createElement("div", {
		...rest,
		ref: rootRef
	});
}
function Select(props) {
	return import_react.createElement("select", { ...props });
}
function Week(props) {
	const { week, ...trProps } = props;
	return import_react.createElement("tr", { ...trProps });
}
function Weekday(props) {
	return import_react.createElement("th", { ...props });
}
function Weekdays(props) {
	return import_react.createElement("thead", { "aria-hidden": true }, import_react.createElement("tr", { ...props }));
}
function WeekNumber(props) {
	const { week, ...thProps } = props;
	return import_react.createElement("th", { ...thProps });
}
function WeekNumberHeader(props) {
	return import_react.createElement("th", { ...props });
}
function Weeks(props) {
	return import_react.createElement("tbody", { ...props });
}
function YearsDropdown(props) {
	const { components } = useDayPicker();
	return import_react.createElement(components.Dropdown, { ...props });
}
var custom_components_exports = /* @__PURE__ */ __export({
	Button: () => Button$1,
	CaptionLabel: () => CaptionLabel,
	Chevron: () => Chevron,
	Day: () => Day,
	DayButton: () => DayButton,
	Dropdown: () => Dropdown,
	DropdownNav: () => DropdownNav,
	Footer: () => Footer,
	Month: () => Month,
	MonthCaption: () => MonthCaption,
	MonthGrid: () => MonthGrid,
	Months: () => Months,
	MonthsDropdown: () => MonthsDropdown,
	Nav: () => Nav,
	NextMonthButton: () => NextMonthButton,
	Option: () => Option,
	PreviousMonthButton: () => PreviousMonthButton,
	Root: () => Root,
	Select: () => Select,
	Week: () => Week,
	WeekNumber: () => WeekNumber,
	WeekNumberHeader: () => WeekNumberHeader,
	Weekday: () => Weekday,
	Weekdays: () => Weekdays,
	Weeks: () => Weeks,
	YearsDropdown: () => YearsDropdown
}, 1);
function rangeIncludesDate(range, date, excludeEnds = false, dateLib = defaultDateLib) {
	let { from, to } = range;
	const { differenceInCalendarDays: differenceInCalendarDays$1, isSameDay: isSameDay$1 } = dateLib;
	if (from && to) {
		if (differenceInCalendarDays$1(to, from) < 0) [from, to] = [to, from];
		return differenceInCalendarDays$1(date, from) >= (excludeEnds ? 1 : 0) && differenceInCalendarDays$1(to, date) >= (excludeEnds ? 1 : 0);
	}
	if (!excludeEnds && to) return isSameDay$1(to, date);
	if (!excludeEnds && from) return isSameDay$1(from, date);
	return false;
}
function isDateInterval(matcher) {
	return Boolean(matcher && typeof matcher === "object" && "before" in matcher && "after" in matcher);
}
function isDateRange(value) {
	return Boolean(value && typeof value === "object" && "from" in value);
}
function isDateAfterType(value) {
	return Boolean(value && typeof value === "object" && "after" in value);
}
function isDateBeforeType(value) {
	return Boolean(value && typeof value === "object" && "before" in value);
}
function isDayOfWeekType(value) {
	return Boolean(value && typeof value === "object" && "dayOfWeek" in value);
}
function isDatesArray(value, dateLib) {
	return Array.isArray(value) && value.every(dateLib.isDate);
}
function dateMatchModifiers(date, matchers, dateLib = defaultDateLib) {
	const matchersArr = !Array.isArray(matchers) ? [matchers] : matchers;
	const { isSameDay: isSameDay$1, differenceInCalendarDays: differenceInCalendarDays$1, isAfter: isAfter$1 } = dateLib;
	return matchersArr.some((matcher) => {
		if (typeof matcher === "boolean") return matcher;
		if (dateLib.isDate(matcher)) return isSameDay$1(date, matcher);
		if (isDatesArray(matcher, dateLib)) return matcher.some((matcherDate) => isSameDay$1(date, matcherDate));
		if (isDateRange(matcher)) return rangeIncludesDate(matcher, date, false, dateLib);
		if (isDayOfWeekType(matcher)) {
			if (!Array.isArray(matcher.dayOfWeek)) return matcher.dayOfWeek === date.getDay();
			return matcher.dayOfWeek.includes(date.getDay());
		}
		if (isDateInterval(matcher)) {
			const diffBefore = differenceInCalendarDays$1(matcher.before, date);
			const diffAfter = differenceInCalendarDays$1(matcher.after, date);
			const isDayBefore = diffBefore > 0;
			const isDayAfter = diffAfter < 0;
			if (isAfter$1(matcher.before, matcher.after)) return isDayAfter && isDayBefore;
			else return isDayBefore || isDayAfter;
		}
		if (isDateAfterType(matcher)) return differenceInCalendarDays$1(date, matcher.after) > 0;
		if (isDateBeforeType(matcher)) return differenceInCalendarDays$1(matcher.before, date) > 0;
		if (typeof matcher === "function") return matcher(date);
		return false;
	});
}
function createGetModifiers(days, props, navStart, navEnd, dateLib) {
	const { disabled, hidden, modifiers, showOutsideDays, broadcastCalendar, today = dateLib.today() } = props;
	const { isSameDay: isSameDay$1, isSameMonth: isSameMonth$1, startOfMonth: startOfMonth$1, isBefore: isBefore$1, endOfMonth: endOfMonth$1, isAfter: isAfter$1 } = dateLib;
	const computedNavStart = navStart && startOfMonth$1(navStart);
	const computedNavEnd = navEnd && endOfMonth$1(navEnd);
	const internalModifiersMap = {
		[DayFlag.focused]: [],
		[DayFlag.outside]: [],
		[DayFlag.disabled]: [],
		[DayFlag.hidden]: [],
		[DayFlag.today]: []
	};
	const customModifiersMap = {};
	for (const day of days) {
		const { date, displayMonth } = day;
		const isOutside = Boolean(displayMonth && !isSameMonth$1(date, displayMonth));
		const isBeforeNavStart = Boolean(computedNavStart && isBefore$1(date, computedNavStart));
		const isAfterNavEnd = Boolean(computedNavEnd && isAfter$1(date, computedNavEnd));
		const isDisabled = Boolean(disabled && dateMatchModifiers(date, disabled, dateLib));
		const isHidden = Boolean(hidden && dateMatchModifiers(date, hidden, dateLib)) || isBeforeNavStart || isAfterNavEnd || !broadcastCalendar && !showOutsideDays && isOutside || broadcastCalendar && showOutsideDays === false && isOutside;
		const isToday = isSameDay$1(date, today);
		if (isOutside) internalModifiersMap.outside.push(day);
		if (isDisabled) internalModifiersMap.disabled.push(day);
		if (isHidden) internalModifiersMap.hidden.push(day);
		if (isToday) internalModifiersMap.today.push(day);
		if (modifiers) Object.keys(modifiers).forEach((name) => {
			const modifierValue = modifiers?.[name];
			if (!(modifierValue ? dateMatchModifiers(date, modifierValue, dateLib) : false)) return;
			if (customModifiersMap[name]) customModifiersMap[name].push(day);
			else customModifiersMap[name] = [day];
		});
	}
	return (day) => {
		const dayFlags = {
			[DayFlag.focused]: false,
			[DayFlag.disabled]: false,
			[DayFlag.hidden]: false,
			[DayFlag.outside]: false,
			[DayFlag.today]: false
		};
		const customModifiers = {};
		for (const name in internalModifiersMap) dayFlags[name] = internalModifiersMap[name].some((d) => d === day);
		for (const name in customModifiersMap) customModifiers[name] = customModifiersMap[name].some((d) => d === day);
		return {
			...dayFlags,
			...customModifiers
		};
	};
}
function getClassNamesForModifiers(modifiers, classNames, modifiersClassNames = {}) {
	return Object.entries(modifiers).filter(([, active]) => active === true).reduce((previousValue, [key]) => {
		if (modifiersClassNames[key]) previousValue.push(modifiersClassNames[key]);
		else if (classNames[DayFlag[key]]) previousValue.push(classNames[DayFlag[key]]);
		else if (classNames[SelectionState[key]]) previousValue.push(classNames[SelectionState[key]]);
		return previousValue;
	}, [classNames[UI.Day]]);
}
function getComponents(customComponents) {
	return {
		...custom_components_exports,
		...customComponents
	};
}
function getDataAttributes(props) {
	const dataAttributes = {
		"data-mode": props.mode ?? void 0,
		"data-required": "required" in props ? props.required : void 0,
		"data-multiple-months": props.numberOfMonths && props.numberOfMonths > 1 || void 0,
		"data-week-numbers": props.showWeekNumber || void 0,
		"data-broadcast-calendar": props.broadcastCalendar || void 0,
		"data-nav-layout": props.navLayout || void 0
	};
	Object.entries(props).forEach(([key, val]) => {
		if (key.startsWith("data-")) dataAttributes[key] = val;
	});
	return dataAttributes;
}
function getDefaultClassNames() {
	const classNames = {};
	for (const key in UI) classNames[UI[key]] = `rdp-${UI[key]}`;
	for (const key in DayFlag) classNames[DayFlag[key]] = `rdp-${DayFlag[key]}`;
	for (const key in SelectionState) classNames[SelectionState[key]] = `rdp-${SelectionState[key]}`;
	for (const key in Animation) classNames[Animation[key]] = `rdp-${Animation[key]}`;
	return classNames;
}
function formatCaption(month, options, dateLib) {
	return (dateLib ?? new DateLib(options)).formatMonthYear(month);
}
const formatMonthCaption = formatCaption;
function formatDay(date, options, dateLib) {
	return (dateLib ?? new DateLib(options)).format(date, "d");
}
function formatMonthDropdown(month, dateLib = defaultDateLib) {
	return dateLib.format(month, "LLLL");
}
function formatWeekdayName(weekday, options, dateLib) {
	return (dateLib ?? new DateLib(options)).format(weekday, "cccccc");
}
function formatWeekNumber(weekNumber, dateLib = defaultDateLib) {
	if (weekNumber < 10) return dateLib.formatNumber(`0${weekNumber.toLocaleString()}`);
	return dateLib.formatNumber(`${weekNumber.toLocaleString()}`);
}
function formatWeekNumberHeader() {
	return ``;
}
function formatYearDropdown(year, dateLib = defaultDateLib) {
	return dateLib.format(year, "yyyy");
}
const formatYearCaption = formatYearDropdown;
var formatters_exports = /* @__PURE__ */ __export({
	formatCaption: () => formatCaption,
	formatDay: () => formatDay,
	formatMonthCaption: () => formatMonthCaption,
	formatMonthDropdown: () => formatMonthDropdown,
	formatWeekNumber: () => formatWeekNumber,
	formatWeekNumberHeader: () => formatWeekNumberHeader,
	formatWeekdayName: () => formatWeekdayName,
	formatYearCaption: () => formatYearCaption,
	formatYearDropdown: () => formatYearDropdown
}, 1);
function getFormatters(customFormatters) {
	if (customFormatters?.formatMonthCaption && !customFormatters.formatCaption) customFormatters.formatCaption = customFormatters.formatMonthCaption;
	if (customFormatters?.formatYearCaption && !customFormatters.formatYearDropdown) customFormatters.formatYearDropdown = customFormatters.formatYearCaption;
	return {
		...formatters_exports,
		...customFormatters
	};
}
function labelDayButton(date, modifiers, options, dateLib) {
	let label = (dateLib ?? new DateLib(options)).format(date, "PPPP");
	if (modifiers.today) label = `Today, ${label}`;
	if (modifiers.selected) label = `${label}, selected`;
	return label;
}
const labelDay = labelDayButton;
function labelGrid(date, options, dateLib) {
	return (dateLib ?? new DateLib(options)).formatMonthYear(date);
}
const labelCaption = labelGrid;
function labelGridcell(date, modifiers, options, dateLib) {
	let label = (dateLib ?? new DateLib(options)).format(date, "PPPP");
	if (modifiers?.today) label = `Today, ${label}`;
	return label;
}
function labelMonthDropdown(_options) {
	return "Choose the Month";
}
function labelNav() {
	return "";
}
var defaultLabel = "Go to the Next Month";
function labelNext(_month, _options) {
	return defaultLabel;
}
function labelPrevious(_month) {
	return "Go to the Previous Month";
}
function labelWeekday(date, options, dateLib) {
	return (dateLib ?? new DateLib(options)).format(date, "cccc");
}
function labelWeekNumber(weekNumber, _options) {
	return `Week ${weekNumber}`;
}
function labelWeekNumberHeader(_options) {
	return "Week Number";
}
function labelYearDropdown(_options) {
	return "Choose the Year";
}
var labels_exports = /* @__PURE__ */ __export({
	labelCaption: () => labelCaption,
	labelDay: () => labelDay,
	labelDayButton: () => labelDayButton,
	labelGrid: () => labelGrid,
	labelGridcell: () => labelGridcell,
	labelMonthDropdown: () => labelMonthDropdown,
	labelNav: () => labelNav,
	labelNext: () => labelNext,
	labelPrevious: () => labelPrevious,
	labelWeekNumber: () => labelWeekNumber,
	labelWeekNumberHeader: () => labelWeekNumberHeader,
	labelWeekday: () => labelWeekday,
	labelYearDropdown: () => labelYearDropdown
}, 1);
var resolveLabel = (defaultLabel$1, customLabel, localeLabel) => {
	if (customLabel) return customLabel;
	if (localeLabel) return typeof localeLabel === "function" ? localeLabel : (..._args) => localeLabel;
	return defaultLabel$1;
};
function getLabels(customLabels, options) {
	const localeLabels = options.locale?.labels ?? {};
	return {
		...labels_exports,
		...customLabels ?? {},
		labelDayButton: resolveLabel(labelDayButton, customLabels?.labelDayButton, localeLabels.labelDayButton),
		labelMonthDropdown: resolveLabel(labelMonthDropdown, customLabels?.labelMonthDropdown, localeLabels.labelMonthDropdown),
		labelNext: resolveLabel(labelNext, customLabels?.labelNext, localeLabels.labelNext),
		labelPrevious: resolveLabel(labelPrevious, customLabels?.labelPrevious, localeLabels.labelPrevious),
		labelWeekNumber: resolveLabel(labelWeekNumber, customLabels?.labelWeekNumber, localeLabels.labelWeekNumber),
		labelYearDropdown: resolveLabel(labelYearDropdown, customLabels?.labelYearDropdown, localeLabels.labelYearDropdown),
		labelGrid: resolveLabel(labelGrid, customLabels?.labelGrid, localeLabels.labelGrid),
		labelGridcell: resolveLabel(labelGridcell, customLabels?.labelGridcell, localeLabels.labelGridcell),
		labelNav: resolveLabel(labelNav, customLabels?.labelNav, localeLabels.labelNav),
		labelWeekNumberHeader: resolveLabel(labelWeekNumberHeader, customLabels?.labelWeekNumberHeader, localeLabels.labelWeekNumberHeader),
		labelWeekday: resolveLabel(labelWeekday, customLabels?.labelWeekday, localeLabels.labelWeekday)
	};
}
function getMonthOptions(displayMonth, navStart, navEnd, formatters, dateLib) {
	const { startOfMonth: startOfMonth$1, startOfYear: startOfYear$1, endOfYear: endOfYear$1, eachMonthOfInterval: eachMonthOfInterval$1, getMonth: getMonth$1 } = dateLib;
	return eachMonthOfInterval$1({
		start: startOfYear$1(displayMonth),
		end: endOfYear$1(displayMonth)
	}).map((month) => {
		const label = formatters.formatMonthDropdown(month, dateLib);
		return {
			value: getMonth$1(month),
			label,
			disabled: navStart && month < startOfMonth$1(navStart) || navEnd && month > startOfMonth$1(navEnd) || false
		};
	});
}
function getStyleForModifiers(dayModifiers, styles = {}, modifiersStyles = {}) {
	let style = { ...styles?.[UI.Day] };
	Object.entries(dayModifiers).filter(([, active]) => active === true).forEach(([modifier]) => {
		style = {
			...style,
			...modifiersStyles?.[modifier]
		};
	});
	return style;
}
function getWeekdays(dateLib, ISOWeek, broadcastCalendar, today) {
	const referenceToday = today ?? dateLib.today();
	const start = broadcastCalendar ? dateLib.startOfBroadcastWeek(referenceToday, dateLib) : ISOWeek ? dateLib.startOfISOWeek(referenceToday) : dateLib.startOfWeek(referenceToday);
	const days = [];
	for (let i = 0; i < 7; i++) {
		const day = dateLib.addDays(start, i);
		days.push(day);
	}
	return days;
}
function getYearOptions(navStart, navEnd, formatters, dateLib, reverse = false) {
	if (!navStart) return void 0;
	if (!navEnd) return void 0;
	const { startOfYear: startOfYear$1, endOfYear: endOfYear$1, eachYearOfInterval: eachYearOfInterval$1, getYear: getYear$1 } = dateLib;
	const years = eachYearOfInterval$1({
		start: startOfYear$1(navStart),
		end: endOfYear$1(navEnd)
	});
	if (reverse) years.reverse();
	return years.map((year) => {
		const label = formatters.formatYearDropdown(year, dateLib);
		return {
			value: getYear$1(year),
			label,
			disabled: false
		};
	});
}
function createNoonOverrides(timeZone, options = {}) {
	const { weekStartsOn, locale } = options;
	const fallbackWeekStartsOn = weekStartsOn ?? locale?.options?.weekStartsOn ?? 0;
	const toNoonTZDate = (date) => {
		const normalizedDate = typeof date === "number" || typeof date === "string" ? new Date(date) : date;
		return new TZDate(normalizedDate.getFullYear(), normalizedDate.getMonth(), normalizedDate.getDate(), 12, 0, 0, timeZone);
	};
	const toCalendarDate = (date) => {
		const zoned = toNoonTZDate(date);
		return new Date(zoned.getFullYear(), zoned.getMonth(), zoned.getDate(), 0, 0, 0, 0);
	};
	return {
		today: () => {
			return toNoonTZDate(TZDate.tz(timeZone));
		},
		newDate: (year, monthIndex, date) => {
			return new TZDate(year, monthIndex, date, 12, 0, 0, timeZone);
		},
		startOfDay: (date) => {
			return toNoonTZDate(date);
		},
		startOfWeek: (date, options$1) => {
			const base = toNoonTZDate(date);
			const weekStartsOnValue = options$1?.weekStartsOn ?? fallbackWeekStartsOn;
			const diff = (base.getDay() - weekStartsOnValue + 7) % 7;
			base.setDate(base.getDate() - diff);
			return base;
		},
		startOfISOWeek: (date) => {
			const base = toNoonTZDate(date);
			const diff = (base.getDay() - 1 + 7) % 7;
			base.setDate(base.getDate() - diff);
			return base;
		},
		startOfMonth: (date) => {
			const base = toNoonTZDate(date);
			base.setDate(1);
			return base;
		},
		startOfYear: (date) => {
			const base = toNoonTZDate(date);
			base.setMonth(0, 1);
			return base;
		},
		endOfWeek: (date, options$1) => {
			const base = toNoonTZDate(date);
			const diff = (((options$1?.weekStartsOn ?? fallbackWeekStartsOn) + 6) % 7 - base.getDay() + 7) % 7;
			base.setDate(base.getDate() + diff);
			return base;
		},
		endOfISOWeek: (date) => {
			const base = toNoonTZDate(date);
			const diff = (7 - base.getDay()) % 7;
			base.setDate(base.getDate() + diff);
			return base;
		},
		endOfMonth: (date) => {
			const base = toNoonTZDate(date);
			base.setMonth(base.getMonth() + 1, 0);
			return base;
		},
		endOfYear: (date) => {
			const base = toNoonTZDate(date);
			base.setMonth(11, 31);
			return base;
		},
		eachMonthOfInterval: (interval) => {
			const start = toNoonTZDate(interval.start);
			const end = toNoonTZDate(interval.end);
			const result = [];
			const cursor = new TZDate(start.getFullYear(), start.getMonth(), 1, 12, 0, 0, timeZone);
			const endKey = end.getFullYear() * 12 + end.getMonth();
			while (cursor.getFullYear() * 12 + cursor.getMonth() <= endKey) {
				result.push(new TZDate(cursor, timeZone));
				cursor.setMonth(cursor.getMonth() + 1, 1);
			}
			return result;
		},
		addDays: (date, amount) => {
			const base = toNoonTZDate(date);
			base.setDate(base.getDate() + amount);
			return base;
		},
		addWeeks: (date, amount) => {
			const base = toNoonTZDate(date);
			base.setDate(base.getDate() + amount * 7);
			return base;
		},
		addMonths: (date, amount) => {
			const base = toNoonTZDate(date);
			base.setMonth(base.getMonth() + amount);
			return base;
		},
		addYears: (date, amount) => {
			const base = toNoonTZDate(date);
			base.setFullYear(base.getFullYear() + amount);
			return base;
		},
		eachYearOfInterval: (interval) => {
			const start = toNoonTZDate(interval.start);
			const end = toNoonTZDate(interval.end);
			const years = [];
			const cursor = new TZDate(start.getFullYear(), 0, 1, 12, 0, 0, timeZone);
			while (cursor.getFullYear() <= end.getFullYear()) {
				years.push(new TZDate(cursor, timeZone));
				cursor.setFullYear(cursor.getFullYear() + 1, 0, 1);
			}
			return years;
		},
		getWeek: (date, options$1) => {
			return getWeek(toCalendarDate(date), {
				weekStartsOn: options$1?.weekStartsOn ?? fallbackWeekStartsOn,
				firstWeekContainsDate: options$1?.firstWeekContainsDate ?? locale?.options?.firstWeekContainsDate ?? 1
			});
		},
		getISOWeek: (date) => {
			return getISOWeek(toCalendarDate(date));
		},
		differenceInCalendarDays: (dateLeft, dateRight) => {
			return differenceInCalendarDays(toCalendarDate(dateLeft), toCalendarDate(dateRight));
		},
		differenceInCalendarMonths: (dateLeft, dateRight) => {
			return differenceInCalendarMonths(toCalendarDate(dateLeft), toCalendarDate(dateRight));
		}
	};
}
var asHtmlElement = (element) => {
	if (element instanceof HTMLElement) return element;
	return null;
};
var queryMonthEls = (element) => [...element.querySelectorAll("[data-animated-month]") ?? []];
var queryMonthEl = (element) => asHtmlElement(element.querySelector("[data-animated-month]"));
var queryCaptionEl = (element) => asHtmlElement(element.querySelector("[data-animated-caption]"));
var queryWeeksEl = (element) => asHtmlElement(element.querySelector("[data-animated-weeks]"));
var queryNavEl = (element) => asHtmlElement(element.querySelector("[data-animated-nav]"));
var queryWeekdaysEl = (element) => asHtmlElement(element.querySelector("[data-animated-weekdays]"));
function useAnimation(rootElRef, enabled, { classNames, months, focused, dateLib }) {
	const previousRootElSnapshotRef = (0, import_react.useRef)(null);
	const previousMonthsRef = (0, import_react.useRef)(months);
	const animatingRef = (0, import_react.useRef)(false);
	(0, import_react.useLayoutEffect)(() => {
		const previousMonths = previousMonthsRef.current;
		previousMonthsRef.current = months;
		if (!enabled || !rootElRef.current || !(rootElRef.current instanceof HTMLElement) || months.length === 0 || previousMonths.length === 0 || months.length !== previousMonths.length) return;
		const isSameMonth$1 = dateLib.isSameMonth(months[0].date, previousMonths[0].date);
		const isAfterPreviousMonth = dateLib.isAfter(months[0].date, previousMonths[0].date);
		const captionAnimationClass = isAfterPreviousMonth ? classNames[Animation.caption_after_enter] : classNames[Animation.caption_before_enter];
		const weeksAnimationClass = isAfterPreviousMonth ? classNames[Animation.weeks_after_enter] : classNames[Animation.weeks_before_enter];
		const previousRootElSnapshot = previousRootElSnapshotRef.current;
		const rootElSnapshot = rootElRef.current.cloneNode(true);
		if (rootElSnapshot instanceof HTMLElement) {
			queryMonthEls(rootElSnapshot).forEach((currentMonthElSnapshot) => {
				if (!(currentMonthElSnapshot instanceof HTMLElement)) return;
				const previousMonthElSnapshot = queryMonthEl(currentMonthElSnapshot);
				if (previousMonthElSnapshot && currentMonthElSnapshot.contains(previousMonthElSnapshot)) currentMonthElSnapshot.removeChild(previousMonthElSnapshot);
				const captionEl = queryCaptionEl(currentMonthElSnapshot);
				if (captionEl) captionEl.classList.remove(captionAnimationClass);
				const weeksEl = queryWeeksEl(currentMonthElSnapshot);
				if (weeksEl) weeksEl.classList.remove(weeksAnimationClass);
			});
			previousRootElSnapshotRef.current = rootElSnapshot;
		} else previousRootElSnapshotRef.current = null;
		if (animatingRef.current || isSameMonth$1 || focused) return;
		const previousMonthEls = previousRootElSnapshot instanceof HTMLElement ? queryMonthEls(previousRootElSnapshot) : [];
		const currentMonthEls = queryMonthEls(rootElRef.current);
		if (currentMonthEls?.every((el) => el instanceof HTMLElement) && previousMonthEls && previousMonthEls.every((el) => el instanceof HTMLElement)) {
			animatingRef.current = true;
			const cleanUpFunctions = [];
			rootElRef.current.style.isolation = "isolate";
			const navEl = queryNavEl(rootElRef.current);
			if (navEl) navEl.style.zIndex = "1";
			currentMonthEls.forEach((currentMonthEl, index) => {
				const previousMonthEl = previousMonthEls[index];
				if (!previousMonthEl) return;
				currentMonthEl.style.position = "relative";
				currentMonthEl.style.overflow = "hidden";
				const captionEl = queryCaptionEl(currentMonthEl);
				if (captionEl) captionEl.classList.add(captionAnimationClass);
				const weeksEl = queryWeeksEl(currentMonthEl);
				if (weeksEl) weeksEl.classList.add(weeksAnimationClass);
				const cleanUp = () => {
					animatingRef.current = false;
					if (rootElRef.current) rootElRef.current.style.isolation = "";
					if (navEl) navEl.style.zIndex = "";
					if (captionEl) captionEl.classList.remove(captionAnimationClass);
					if (weeksEl) weeksEl.classList.remove(weeksAnimationClass);
					currentMonthEl.style.position = "";
					currentMonthEl.style.overflow = "";
					if (currentMonthEl.contains(previousMonthEl)) currentMonthEl.removeChild(previousMonthEl);
				};
				cleanUpFunctions.push(cleanUp);
				previousMonthEl.style.pointerEvents = "none";
				previousMonthEl.style.position = "absolute";
				previousMonthEl.style.overflow = "hidden";
				previousMonthEl.setAttribute("aria-hidden", "true");
				const previousWeekdaysEl = queryWeekdaysEl(previousMonthEl);
				if (previousWeekdaysEl) previousWeekdaysEl.style.opacity = "0";
				const previousCaptionEl = queryCaptionEl(previousMonthEl);
				if (previousCaptionEl) {
					previousCaptionEl.classList.add(isAfterPreviousMonth ? classNames[Animation.caption_before_exit] : classNames[Animation.caption_after_exit]);
					previousCaptionEl.addEventListener("animationend", cleanUp);
				}
				const previousWeeksEl = queryWeeksEl(previousMonthEl);
				if (previousWeeksEl) previousWeeksEl.classList.add(isAfterPreviousMonth ? classNames[Animation.weeks_before_exit] : classNames[Animation.weeks_after_exit]);
				currentMonthEl.insertBefore(previousMonthEl, currentMonthEl.firstChild);
			});
		}
	});
}
function getDates(displayMonths, maxDate, props, dateLib) {
	const firstMonth = displayMonths[0];
	const lastMonth = displayMonths[displayMonths.length - 1];
	const { ISOWeek, fixedWeeks, broadcastCalendar } = props ?? {};
	const { addDays: addDays$1, differenceInCalendarDays: differenceInCalendarDays$1, differenceInCalendarMonths: differenceInCalendarMonths$1, endOfBroadcastWeek: endOfBroadcastWeek$1, endOfISOWeek: endOfISOWeek$1, endOfMonth: endOfMonth$1, endOfWeek: endOfWeek$1, isAfter: isAfter$1, startOfBroadcastWeek: startOfBroadcastWeek$1, startOfISOWeek: startOfISOWeek$1, startOfWeek: startOfWeek$1 } = dateLib;
	const startWeekFirstDate = broadcastCalendar ? startOfBroadcastWeek$1(firstMonth, dateLib) : ISOWeek ? startOfISOWeek$1(firstMonth) : startOfWeek$1(firstMonth);
	const displayMonthsWeekEnd = broadcastCalendar ? endOfBroadcastWeek$1(lastMonth) : ISOWeek ? endOfISOWeek$1(endOfMonth$1(lastMonth)) : endOfWeek$1(endOfMonth$1(lastMonth));
	const constraintWeekEnd = maxDate && (broadcastCalendar ? endOfBroadcastWeek$1(maxDate) : ISOWeek ? endOfISOWeek$1(maxDate) : endOfWeek$1(maxDate));
	const nOfDays = differenceInCalendarDays$1(constraintWeekEnd && isAfter$1(displayMonthsWeekEnd, constraintWeekEnd) ? constraintWeekEnd : displayMonthsWeekEnd, startWeekFirstDate);
	const nOfMonths = differenceInCalendarMonths$1(lastMonth, firstMonth) + 1;
	const dates = [];
	for (let i = 0; i <= nOfDays; i++) {
		const date = addDays$1(startWeekFirstDate, i);
		dates.push(date);
	}
	const extraDates = (broadcastCalendar ? 35 : 42) * nOfMonths;
	if (fixedWeeks && dates.length < extraDates) {
		const daysToAdd = extraDates - dates.length;
		for (let i = 0; i < daysToAdd; i++) {
			const date = addDays$1(dates[dates.length - 1], 1);
			dates.push(date);
		}
	}
	return dates;
}
function getDays(calendarMonths) {
	const initialDays = [];
	return calendarMonths.reduce((days, month) => {
		const weekDays = month.weeks.reduce((weekDays$1, week) => {
			return weekDays$1.concat(week.days.slice());
		}, initialDays.slice());
		return days.concat(weekDays.slice());
	}, initialDays.slice());
}
function getDisplayMonths(firstDisplayedMonth, calendarEndMonth, props, dateLib) {
	const { numberOfMonths = 1 } = props;
	const months = [];
	for (let i = 0; i < numberOfMonths; i++) {
		const month = dateLib.addMonths(firstDisplayedMonth, i);
		if (calendarEndMonth && month > calendarEndMonth) break;
		months.push(month);
	}
	return months;
}
function getInitialMonth(props, navStart, navEnd, dateLib) {
	const { month, defaultMonth, today = dateLib.today(), numberOfMonths = 1 } = props;
	let initialMonth = month || defaultMonth || today;
	const { differenceInCalendarMonths: differenceInCalendarMonths$1, addMonths: addMonths$1, startOfMonth: startOfMonth$1 } = dateLib;
	if (navEnd && differenceInCalendarMonths$1(navEnd, initialMonth) < numberOfMonths - 1) initialMonth = addMonths$1(navEnd, -1 * (numberOfMonths - 1));
	if (navStart && differenceInCalendarMonths$1(initialMonth, navStart) < 0) initialMonth = navStart;
	return startOfMonth$1(initialMonth);
}
function getMonths(displayMonths, dates, props, dateLib) {
	const { addDays: addDays$1, endOfBroadcastWeek: endOfBroadcastWeek$1, endOfISOWeek: endOfISOWeek$1, endOfMonth: endOfMonth$1, endOfWeek: endOfWeek$1, getISOWeek: getISOWeek$1, getWeek: getWeek$1, startOfBroadcastWeek: startOfBroadcastWeek$1, startOfISOWeek: startOfISOWeek$1, startOfWeek: startOfWeek$1 } = dateLib;
	const dayPickerMonths = displayMonths.reduce((months, month) => {
		const firstDateOfFirstWeek = props.broadcastCalendar ? startOfBroadcastWeek$1(month, dateLib) : props.ISOWeek ? startOfISOWeek$1(month) : startOfWeek$1(month);
		const lastDateOfLastWeek = props.broadcastCalendar ? endOfBroadcastWeek$1(month) : props.ISOWeek ? endOfISOWeek$1(endOfMonth$1(month)) : endOfWeek$1(endOfMonth$1(month));
		const monthDates = dates.filter((date) => {
			return date >= firstDateOfFirstWeek && date <= lastDateOfLastWeek;
		});
		const nrOfDaysWithFixedWeeks = props.broadcastCalendar ? 35 : 42;
		if (props.fixedWeeks && monthDates.length < nrOfDaysWithFixedWeeks) {
			const extraDates = dates.filter((date) => {
				const daysToAdd = nrOfDaysWithFixedWeeks - monthDates.length;
				return date > lastDateOfLastWeek && date <= addDays$1(lastDateOfLastWeek, daysToAdd);
			});
			monthDates.push(...extraDates);
		}
		const dayPickerMonth = new CalendarMonth(month, monthDates.reduce((weeks, date) => {
			const weekNumber = props.ISOWeek ? getISOWeek$1(date) : getWeek$1(date);
			const week = weeks.find((week$1) => week$1.weekNumber === weekNumber);
			const day = new CalendarDay(date, month, dateLib);
			if (!week) weeks.push(new CalendarWeek(weekNumber, [day]));
			else week.days.push(day);
			return weeks;
		}, []));
		months.push(dayPickerMonth);
		return months;
	}, []);
	if (!props.reverseMonths) return dayPickerMonths;
	else return dayPickerMonths.reverse();
}
function getNavMonths(props, dateLib) {
	let { startMonth, endMonth } = props;
	const { startOfYear: startOfYear$1, startOfDay: startOfDay$1, startOfMonth: startOfMonth$1, endOfMonth: endOfMonth$1, addYears: addYears$1, endOfYear: endOfYear$1, newDate, today } = dateLib;
	const { fromYear, toYear, fromMonth, toMonth } = props;
	if (!startMonth && fromMonth) startMonth = fromMonth;
	if (!startMonth && fromYear) startMonth = dateLib.newDate(fromYear, 0, 1);
	if (!endMonth && toMonth) endMonth = toMonth;
	if (!endMonth && toYear) endMonth = newDate(toYear, 11, 31);
	const hasYearDropdown = props.captionLayout === "dropdown" || props.captionLayout === "dropdown-years";
	if (startMonth) startMonth = startOfMonth$1(startMonth);
	else if (fromYear) startMonth = newDate(fromYear, 0, 1);
	else if (!startMonth && hasYearDropdown) startMonth = startOfYear$1(addYears$1(props.today ?? today(), -100));
	if (endMonth) endMonth = endOfMonth$1(endMonth);
	else if (toYear) endMonth = newDate(toYear, 11, 31);
	else if (!endMonth && hasYearDropdown) endMonth = endOfYear$1(props.today ?? today());
	return [startMonth ? startOfDay$1(startMonth) : startMonth, endMonth ? startOfDay$1(endMonth) : endMonth];
}
function getNextMonth(firstDisplayedMonth, calendarEndMonth, options, dateLib) {
	if (options.disableNavigation) return;
	const { pagedNavigation, numberOfMonths = 1 } = options;
	const { startOfMonth: startOfMonth$1, addMonths: addMonths$1, differenceInCalendarMonths: differenceInCalendarMonths$1 } = dateLib;
	const offset = pagedNavigation ? numberOfMonths : 1;
	const month = startOfMonth$1(firstDisplayedMonth);
	if (!calendarEndMonth) return addMonths$1(month, offset);
	if (differenceInCalendarMonths$1(calendarEndMonth, firstDisplayedMonth) < numberOfMonths) return;
	return addMonths$1(month, offset);
}
function getPreviousMonth(firstDisplayedMonth, calendarStartMonth, options, dateLib) {
	if (options.disableNavigation) return;
	const { pagedNavigation, numberOfMonths } = options;
	const { startOfMonth: startOfMonth$1, addMonths: addMonths$1, differenceInCalendarMonths: differenceInCalendarMonths$1 } = dateLib;
	const offset = pagedNavigation ? numberOfMonths ?? 1 : 1;
	const month = startOfMonth$1(firstDisplayedMonth);
	if (!calendarStartMonth) return addMonths$1(month, -offset);
	if (differenceInCalendarMonths$1(month, calendarStartMonth) <= 0) return;
	return addMonths$1(month, -offset);
}
function getWeeks(months) {
	return months.reduce((weeks, month) => {
		return weeks.concat(month.weeks.slice());
	}, [].slice());
}
function useControlledValue(defaultValue, controlledValue) {
	const [uncontrolledValue, setValue] = (0, import_react.useState)(defaultValue);
	return [controlledValue === void 0 ? uncontrolledValue : controlledValue, setValue];
}
function useCalendar(props, dateLib) {
	const [navStart, navEnd] = getNavMonths(props, dateLib);
	const { startOfMonth: startOfMonth$1, endOfMonth: endOfMonth$1 } = dateLib;
	const initialMonth = getInitialMonth(props, navStart, navEnd, dateLib);
	const [firstMonth, setFirstMonth] = useControlledValue(initialMonth, props.month ? initialMonth : void 0);
	(0, import_react.useEffect)(() => {
		setFirstMonth(getInitialMonth(props, navStart, navEnd, dateLib));
	}, [props.timeZone]);
	const { months, weeks, days, previousMonth, nextMonth } = (0, import_react.useMemo)(() => {
		const displayMonths = getDisplayMonths(firstMonth, navEnd, { numberOfMonths: props.numberOfMonths }, dateLib);
		const months$1 = getMonths(displayMonths, getDates(displayMonths, props.endMonth ? endOfMonth$1(props.endMonth) : void 0, {
			ISOWeek: props.ISOWeek,
			fixedWeeks: props.fixedWeeks,
			broadcastCalendar: props.broadcastCalendar
		}, dateLib), {
			broadcastCalendar: props.broadcastCalendar,
			fixedWeeks: props.fixedWeeks,
			ISOWeek: props.ISOWeek,
			reverseMonths: props.reverseMonths
		}, dateLib);
		return {
			months: months$1,
			weeks: getWeeks(months$1),
			days: getDays(months$1),
			previousMonth: getPreviousMonth(firstMonth, navStart, props, dateLib),
			nextMonth: getNextMonth(firstMonth, navEnd, props, dateLib)
		};
	}, [
		dateLib,
		firstMonth.getTime(),
		navEnd?.getTime(),
		navStart?.getTime(),
		props.disableNavigation,
		props.broadcastCalendar,
		props.endMonth?.getTime(),
		props.fixedWeeks,
		props.ISOWeek,
		props.numberOfMonths,
		props.pagedNavigation,
		props.reverseMonths
	]);
	const { disableNavigation, onMonthChange } = props;
	const isDayInCalendar = (day) => weeks.some((week) => week.days.some((d) => d.isEqualTo(day)));
	const goToMonth = (date) => {
		if (disableNavigation) return;
		let newMonth = startOfMonth$1(date);
		if (navStart && newMonth < startOfMonth$1(navStart)) newMonth = startOfMonth$1(navStart);
		if (navEnd && newMonth > startOfMonth$1(navEnd)) newMonth = startOfMonth$1(navEnd);
		setFirstMonth(newMonth);
		onMonthChange?.(newMonth);
	};
	const goToDay = (day) => {
		if (isDayInCalendar(day)) return;
		goToMonth(day.date);
	};
	return {
		months,
		weeks,
		days,
		navStart,
		navEnd,
		previousMonth,
		nextMonth,
		goToMonth,
		goToDay
	};
}
var FocusTargetPriority;
(function(FocusTargetPriority$1) {
	FocusTargetPriority$1[FocusTargetPriority$1["Today"] = 0] = "Today";
	FocusTargetPriority$1[FocusTargetPriority$1["Selected"] = 1] = "Selected";
	FocusTargetPriority$1[FocusTargetPriority$1["LastFocused"] = 2] = "LastFocused";
	FocusTargetPriority$1[FocusTargetPriority$1["FocusedModifier"] = 3] = "FocusedModifier";
})(FocusTargetPriority || (FocusTargetPriority = {}));
function isFocusableDay(modifiers) {
	return !modifiers[DayFlag.disabled] && !modifiers[DayFlag.hidden] && !modifiers[DayFlag.outside];
}
function calculateFocusTarget(days, getModifiers, isSelected, lastFocused) {
	let focusTarget;
	let foundFocusTargetPriority = -1;
	for (const day of days) {
		const modifiers = getModifiers(day);
		if (isFocusableDay(modifiers)) {
			if (modifiers[DayFlag.focused] && foundFocusTargetPriority < FocusTargetPriority.FocusedModifier) {
				focusTarget = day;
				foundFocusTargetPriority = FocusTargetPriority.FocusedModifier;
			} else if (lastFocused?.isEqualTo(day) && foundFocusTargetPriority < FocusTargetPriority.LastFocused) {
				focusTarget = day;
				foundFocusTargetPriority = FocusTargetPriority.LastFocused;
			} else if (isSelected(day.date) && foundFocusTargetPriority < FocusTargetPriority.Selected) {
				focusTarget = day;
				foundFocusTargetPriority = FocusTargetPriority.Selected;
			} else if (modifiers[DayFlag.today] && foundFocusTargetPriority < FocusTargetPriority.Today) {
				focusTarget = day;
				foundFocusTargetPriority = FocusTargetPriority.Today;
			}
		}
	}
	if (!focusTarget) focusTarget = days.find((day) => isFocusableDay(getModifiers(day)));
	return focusTarget;
}
function getFocusableDate(moveBy, moveDir, refDate, navStart, navEnd, props, dateLib) {
	const { ISOWeek, broadcastCalendar } = props;
	const { addDays: addDays$1, addMonths: addMonths$1, addWeeks: addWeeks$1, addYears: addYears$1, endOfBroadcastWeek: endOfBroadcastWeek$1, endOfISOWeek: endOfISOWeek$1, endOfWeek: endOfWeek$1, max: max$1, min: min$1, startOfBroadcastWeek: startOfBroadcastWeek$1, startOfISOWeek: startOfISOWeek$1, startOfWeek: startOfWeek$1 } = dateLib;
	let focusableDate = {
		day: addDays$1,
		week: addWeeks$1,
		month: addMonths$1,
		year: addYears$1,
		startOfWeek: (date) => broadcastCalendar ? startOfBroadcastWeek$1(date, dateLib) : ISOWeek ? startOfISOWeek$1(date) : startOfWeek$1(date),
		endOfWeek: (date) => broadcastCalendar ? endOfBroadcastWeek$1(date) : ISOWeek ? endOfISOWeek$1(date) : endOfWeek$1(date)
	}[moveBy](refDate, moveDir === "after" ? 1 : -1);
	if (moveDir === "before" && navStart) focusableDate = max$1([navStart, focusableDate]);
	else if (moveDir === "after" && navEnd) focusableDate = min$1([navEnd, focusableDate]);
	return focusableDate;
}
function getNextFocus(moveBy, moveDir, refDay, calendarStartMonth, calendarEndMonth, props, dateLib, attempt = 0) {
	if (attempt > 365) return;
	const focusableDate = getFocusableDate(moveBy, moveDir, refDay.date, calendarStartMonth, calendarEndMonth, props, dateLib);
	const isDisabled = Boolean(props.disabled && dateMatchModifiers(focusableDate, props.disabled, dateLib));
	const isHidden = Boolean(props.hidden && dateMatchModifiers(focusableDate, props.hidden, dateLib));
	const focusDay = new CalendarDay(focusableDate, focusableDate, dateLib);
	if (!isDisabled && !isHidden) return focusDay;
	return getNextFocus(moveBy, moveDir, focusDay, calendarStartMonth, calendarEndMonth, props, dateLib, attempt + 1);
}
function useFocus(props, calendar, getModifiers, isSelected, dateLib) {
	const { autoFocus } = props;
	const [lastFocused, setLastFocused] = (0, import_react.useState)();
	const focusTarget = calculateFocusTarget(calendar.days, getModifiers, isSelected || (() => false), lastFocused);
	const [focusedDay, setFocused] = (0, import_react.useState)(autoFocus ? focusTarget : void 0);
	const blur = () => {
		setLastFocused(focusedDay);
		setFocused(void 0);
	};
	const moveFocus = (moveBy, moveDir) => {
		if (!focusedDay) return;
		const nextFocus = getNextFocus(moveBy, moveDir, focusedDay, calendar.navStart, calendar.navEnd, props, dateLib);
		if (!nextFocus) return;
		if (props.disableNavigation) {
			if (!calendar.days.some((day) => day.isEqualTo(nextFocus))) return;
		}
		calendar.goToDay(nextFocus);
		setFocused(nextFocus);
	};
	const isFocusTarget = (day) => {
		return Boolean(focusTarget?.isEqualTo(day));
	};
	return {
		isFocusTarget,
		setFocused,
		focused: focusedDay,
		blur,
		moveFocus
	};
}
function useMulti(props, dateLib) {
	const { selected: initiallySelected, required, onSelect } = props;
	const [internallySelected, setSelected] = useControlledValue(initiallySelected, onSelect ? initiallySelected : void 0);
	const selected = !onSelect ? internallySelected : initiallySelected;
	const { isSameDay: isSameDay$1 } = dateLib;
	const isSelected = (date) => {
		return selected?.some((d) => isSameDay$1(d, date)) ?? false;
	};
	const { min: min$1, max: max$1 } = props;
	const select = (triggerDate, modifiers, e) => {
		let newDates = [...selected ?? []];
		if (isSelected(triggerDate)) {
			if (selected?.length === min$1) return;
			if (required && selected?.length === 1) return;
			newDates = selected?.filter((d) => !isSameDay$1(d, triggerDate));
		} else if (selected?.length === max$1) newDates = [triggerDate];
		else newDates = [...newDates, triggerDate];
		if (!onSelect) setSelected(newDates);
		onSelect?.(newDates, triggerDate, modifiers, e);
		return newDates;
	};
	return {
		selected,
		select,
		isSelected
	};
}
function addToRange(date, initialRange, min$1 = 0, max$1 = 0, required = false, dateLib = defaultDateLib) {
	const { from, to } = initialRange || {};
	const { isSameDay: isSameDay$1, isAfter: isAfter$1, isBefore: isBefore$1 } = dateLib;
	let range;
	if (!from && !to) range = {
		from: date,
		to: min$1 > 0 ? void 0 : date
	};
	else if (from && !to) if (isSameDay$1(from, date)) if (min$1 === 0) range = {
		from,
		to: date
	};
	else if (required) range = {
		from,
		to: void 0
	};
	else range = void 0;
	else if (isBefore$1(date, from)) range = {
		from: date,
		to: from
	};
	else range = {
		from,
		to: date
	};
	else if (from && to) if (isSameDay$1(from, date) && isSameDay$1(to, date)) if (required) range = {
		from,
		to
	};
	else range = void 0;
	else if (isSameDay$1(from, date)) range = {
		from,
		to: min$1 > 0 ? void 0 : date
	};
	else if (isSameDay$1(to, date)) range = {
		from: date,
		to: min$1 > 0 ? void 0 : date
	};
	else if (isBefore$1(date, from)) range = {
		from: date,
		to
	};
	else if (isAfter$1(date, from)) range = {
		from,
		to: date
	};
	else if (isAfter$1(date, to)) range = {
		from,
		to: date
	};
	else throw new Error("Invalid range");
	if (range?.from && range?.to) {
		const diff = dateLib.differenceInCalendarDays(range.to, range.from);
		if (max$1 > 0 && diff > max$1) range = {
			from: date,
			to: void 0
		};
		else if (min$1 > 1 && diff < min$1) range = {
			from: date,
			to: void 0
		};
	}
	return range;
}
function rangeContainsDayOfWeek(range, dayOfWeek, dateLib = defaultDateLib) {
	const dayOfWeekArr = !Array.isArray(dayOfWeek) ? [dayOfWeek] : dayOfWeek;
	let date = range.from;
	const totalDays = dateLib.differenceInCalendarDays(range.to, range.from);
	const totalDaysLimit = Math.min(totalDays, 6);
	for (let i = 0; i <= totalDaysLimit; i++) {
		if (dayOfWeekArr.includes(date.getDay())) return true;
		date = dateLib.addDays(date, 1);
	}
	return false;
}
function rangeOverlaps(rangeLeft, rangeRight, dateLib = defaultDateLib) {
	return rangeIncludesDate(rangeLeft, rangeRight.from, false, dateLib) || rangeIncludesDate(rangeLeft, rangeRight.to, false, dateLib) || rangeIncludesDate(rangeRight, rangeLeft.from, false, dateLib) || rangeIncludesDate(rangeRight, rangeLeft.to, false, dateLib);
}
function rangeContainsModifiers(range, modifiers, dateLib = defaultDateLib) {
	const matchers = Array.isArray(modifiers) ? modifiers : [modifiers];
	if (matchers.filter((matcher) => typeof matcher !== "function").some((matcher) => {
		if (typeof matcher === "boolean") return matcher;
		if (dateLib.isDate(matcher)) return rangeIncludesDate(range, matcher, false, dateLib);
		if (isDatesArray(matcher, dateLib)) return matcher.some((date) => rangeIncludesDate(range, date, false, dateLib));
		if (isDateRange(matcher)) {
			if (matcher.from && matcher.to) return rangeOverlaps(range, {
				from: matcher.from,
				to: matcher.to
			}, dateLib);
			return false;
		}
		if (isDayOfWeekType(matcher)) return rangeContainsDayOfWeek(range, matcher.dayOfWeek, dateLib);
		if (isDateInterval(matcher)) {
			if (dateLib.isAfter(matcher.before, matcher.after)) return rangeOverlaps(range, {
				from: dateLib.addDays(matcher.after, 1),
				to: dateLib.addDays(matcher.before, -1)
			}, dateLib);
			return dateMatchModifiers(range.from, matcher, dateLib) || dateMatchModifiers(range.to, matcher, dateLib);
		}
		if (isDateAfterType(matcher) || isDateBeforeType(matcher)) return dateMatchModifiers(range.from, matcher, dateLib) || dateMatchModifiers(range.to, matcher, dateLib);
		return false;
	})) return true;
	const functionMatchers = matchers.filter((matcher) => typeof matcher === "function");
	if (functionMatchers.length) {
		let date = range.from;
		const totalDays = dateLib.differenceInCalendarDays(range.to, range.from);
		for (let i = 0; i <= totalDays; i++) {
			if (functionMatchers.some((matcher) => matcher(date))) return true;
			date = dateLib.addDays(date, 1);
		}
	}
	return false;
}
function useRange(props, dateLib) {
	const { disabled, excludeDisabled, resetOnSelect, selected: initiallySelected, required, onSelect } = props;
	const [internallySelected, setSelected] = useControlledValue(initiallySelected, onSelect ? initiallySelected : void 0);
	const selected = !onSelect ? internallySelected : initiallySelected;
	const isSelected = (date) => selected && rangeIncludesDate(selected, date, false, dateLib);
	const select = (triggerDate, modifiers, e) => {
		const { min: min$1, max: max$1 } = props;
		let newRange;
		if (triggerDate) {
			const selectedFrom = selected?.from;
			const selectedTo = selected?.to;
			const hasFullRange = !!selectedFrom && !!selectedTo;
			const isClickingSingleDayRange = !!selectedFrom && !!selectedTo && dateLib.isSameDay(selectedFrom, selectedTo) && dateLib.isSameDay(triggerDate, selectedFrom);
			if (resetOnSelect && (hasFullRange || !selected?.from)) if (!required && isClickingSingleDayRange) newRange = void 0;
			else newRange = {
				from: triggerDate,
				to: void 0
			};
			else newRange = addToRange(triggerDate, selected, min$1, max$1, required, dateLib);
		}
		if (excludeDisabled && disabled && newRange?.from && newRange.to) {
			if (rangeContainsModifiers({
				from: newRange.from,
				to: newRange.to
			}, disabled, dateLib)) {
				newRange.from = triggerDate;
				newRange.to = void 0;
			}
		}
		if (!onSelect) setSelected(newRange);
		onSelect?.(newRange, triggerDate, modifiers, e);
		return newRange;
	};
	return {
		selected,
		select,
		isSelected
	};
}
function useSingle(props, dateLib) {
	const { selected: initiallySelected, required, onSelect } = props;
	const [internallySelected, setSelected] = useControlledValue(initiallySelected, onSelect ? initiallySelected : void 0);
	const selected = !onSelect ? internallySelected : initiallySelected;
	const { isSameDay: isSameDay$1 } = dateLib;
	const isSelected = (compareDate) => {
		return selected ? isSameDay$1(selected, compareDate) : false;
	};
	const select = (triggerDate, modifiers, e) => {
		let newDate = triggerDate;
		if (!required && selected && selected && isSameDay$1(triggerDate, selected)) newDate = void 0;
		if (!onSelect) setSelected(newDate);
		if (required) onSelect?.(newDate, triggerDate, modifiers, e);
		else onSelect?.(newDate, triggerDate, modifiers, e);
		return newDate;
	};
	return {
		selected,
		select,
		isSelected
	};
}
function useSelection(props, dateLib) {
	const single = useSingle(props, dateLib);
	const multi = useMulti(props, dateLib);
	const range = useRange(props, dateLib);
	switch (props.mode) {
		case "single": return single;
		case "multiple": return multi;
		case "range": return range;
		default: return;
	}
}
function toTimeZone(date, timeZone) {
	if (date instanceof TZDate && date.timeZone === timeZone) return date;
	return new TZDate(date, timeZone);
}
function toZoneNoon(date, timeZone, noonSafe) {
	if (!noonSafe) return toTimeZone(date, timeZone);
	const zoned = toTimeZone(date, timeZone);
	const noonZoned = new TZDate(zoned.getFullYear(), zoned.getMonth(), zoned.getDate(), 12, 0, 0, timeZone);
	return new Date(noonZoned.getTime());
}
function convertMatcher(matcher, timeZone, noonSafe) {
	if (typeof matcher === "boolean" || typeof matcher === "function") return matcher;
	if (matcher instanceof Date) return toZoneNoon(matcher, timeZone, noonSafe);
	if (Array.isArray(matcher)) return matcher.map((value) => value instanceof Date ? toZoneNoon(value, timeZone, noonSafe) : value);
	if (isDateRange(matcher)) return {
		...matcher,
		from: matcher.from ? toTimeZone(matcher.from, timeZone) : matcher.from,
		to: matcher.to ? toTimeZone(matcher.to, timeZone) : matcher.to
	};
	if (isDateInterval(matcher)) return {
		before: toZoneNoon(matcher.before, timeZone, noonSafe),
		after: toZoneNoon(matcher.after, timeZone, noonSafe)
	};
	if (isDateAfterType(matcher)) return { after: toZoneNoon(matcher.after, timeZone, noonSafe) };
	if (isDateBeforeType(matcher)) return { before: toZoneNoon(matcher.before, timeZone, noonSafe) };
	return matcher;
}
function convertMatchersToTimeZone(matchers, timeZone, noonSafe) {
	if (!matchers) return matchers;
	if (Array.isArray(matchers)) return matchers.map((matcher) => convertMatcher(matcher, timeZone, noonSafe));
	return convertMatcher(matchers, timeZone, noonSafe);
}
function DayPicker(initialProps) {
	let props = initialProps;
	const timeZone = props.timeZone;
	if (timeZone) {
		props = {
			...initialProps,
			timeZone
		};
		if (props.today) props.today = toTimeZone(props.today, timeZone);
		if (props.month) props.month = toTimeZone(props.month, timeZone);
		if (props.defaultMonth) props.defaultMonth = toTimeZone(props.defaultMonth, timeZone);
		if (props.startMonth) props.startMonth = toTimeZone(props.startMonth, timeZone);
		if (props.endMonth) props.endMonth = toTimeZone(props.endMonth, timeZone);
		if (props.mode === "single" && props.selected) props.selected = toTimeZone(props.selected, timeZone);
		else if (props.mode === "multiple" && props.selected) props.selected = props.selected?.map((date) => toTimeZone(date, timeZone));
		else if (props.mode === "range" && props.selected) props.selected = {
			from: props.selected.from ? toTimeZone(props.selected.from, timeZone) : props.selected.from,
			to: props.selected.to ? toTimeZone(props.selected.to, timeZone) : props.selected.to
		};
		if (props.disabled !== void 0) props.disabled = convertMatchersToTimeZone(props.disabled, timeZone);
		if (props.hidden !== void 0) props.hidden = convertMatchersToTimeZone(props.hidden, timeZone);
		if (props.modifiers) {
			const nextModifiers = {};
			Object.keys(props.modifiers).forEach((key) => {
				nextModifiers[key] = convertMatchersToTimeZone(props.modifiers?.[key], timeZone);
			});
			props.modifiers = nextModifiers;
		}
	}
	const { components, formatters, labels, dateLib, locale, classNames } = (0, import_react.useMemo)(() => {
		const locale$1 = {
			...enUS,
			...props.locale
		};
		const weekStartsOn = props.broadcastCalendar ? 1 : props.weekStartsOn;
		const noonOverrides = props.noonSafe && props.timeZone ? createNoonOverrides(props.timeZone, {
			weekStartsOn,
			locale: locale$1
		}) : void 0;
		const overrides = props.dateLib && noonOverrides ? {
			...noonOverrides,
			...props.dateLib
		} : props.dateLib ?? noonOverrides;
		const dateLib$1 = new DateLib({
			locale: locale$1,
			weekStartsOn,
			firstWeekContainsDate: props.firstWeekContainsDate,
			useAdditionalWeekYearTokens: props.useAdditionalWeekYearTokens,
			useAdditionalDayOfYearTokens: props.useAdditionalDayOfYearTokens,
			timeZone: props.timeZone,
			numerals: props.numerals
		}, overrides);
		return {
			dateLib: dateLib$1,
			components: getComponents(props.components),
			formatters: getFormatters(props.formatters),
			labels: getLabels(props.labels, dateLib$1.options),
			locale: locale$1,
			classNames: {
				...getDefaultClassNames(),
				...props.classNames
			}
		};
	}, [
		props.locale,
		props.broadcastCalendar,
		props.weekStartsOn,
		props.firstWeekContainsDate,
		props.useAdditionalWeekYearTokens,
		props.useAdditionalDayOfYearTokens,
		props.timeZone,
		props.numerals,
		props.dateLib,
		props.noonSafe,
		props.components,
		props.formatters,
		props.labels,
		props.classNames
	]);
	if (!props.today) props = {
		...props,
		today: dateLib.today()
	};
	const { captionLayout, mode, navLayout, numberOfMonths = 1, onDayBlur, onDayClick, onDayFocus, onDayKeyDown, onDayMouseEnter, onDayMouseLeave, onNextClick, onPrevClick, showWeekNumber, styles } = props;
	const { formatCaption: formatCaption$1, formatDay: formatDay$1, formatMonthDropdown: formatMonthDropdown$1, formatWeekNumber: formatWeekNumber$1, formatWeekNumberHeader: formatWeekNumberHeader$1, formatWeekdayName: formatWeekdayName$1, formatYearDropdown: formatYearDropdown$1 } = formatters;
	const calendar = useCalendar(props, dateLib);
	const { days, months, navStart, navEnd, previousMonth, nextMonth, goToMonth } = calendar;
	const getModifiers = createGetModifiers(days, props, navStart, navEnd, dateLib);
	const { isSelected, select, selected: selectedValue } = useSelection(props, dateLib) ?? {};
	const { blur, focused, isFocusTarget, moveFocus, setFocused } = useFocus(props, calendar, getModifiers, isSelected ?? (() => false), dateLib);
	const { labelDayButton: labelDayButton$1, labelGridcell: labelGridcell$1, labelGrid: labelGrid$1, labelMonthDropdown: labelMonthDropdown$1, labelNav: labelNav$1, labelPrevious: labelPrevious$1, labelNext: labelNext$1, labelWeekday: labelWeekday$1, labelWeekNumber: labelWeekNumber$1, labelWeekNumberHeader: labelWeekNumberHeader$1, labelYearDropdown: labelYearDropdown$1 } = labels;
	const weekdays = (0, import_react.useMemo)(() => getWeekdays(dateLib, props.ISOWeek, props.broadcastCalendar, props.today), [
		dateLib,
		props.ISOWeek,
		props.broadcastCalendar,
		props.today
	]);
	const isInteractive = mode !== void 0 || onDayClick !== void 0;
	const handlePreviousClick = (0, import_react.useCallback)(() => {
		if (!previousMonth) return;
		goToMonth(previousMonth);
		onPrevClick?.(previousMonth);
	}, [
		previousMonth,
		goToMonth,
		onPrevClick
	]);
	const handleNextClick = (0, import_react.useCallback)(() => {
		if (!nextMonth) return;
		goToMonth(nextMonth);
		onNextClick?.(nextMonth);
	}, [
		goToMonth,
		nextMonth,
		onNextClick
	]);
	const handleDayClick = (0, import_react.useCallback)((day, m) => (e) => {
		e.preventDefault();
		e.stopPropagation();
		setFocused(day);
		if (m.disabled) return;
		select?.(day.date, m, e);
		onDayClick?.(day.date, m, e);
	}, [
		select,
		onDayClick,
		setFocused
	]);
	const handleDayFocus = (0, import_react.useCallback)((day, m) => (e) => {
		setFocused(day);
		onDayFocus?.(day.date, m, e);
	}, [onDayFocus, setFocused]);
	const handleDayBlur = (0, import_react.useCallback)((day, m) => (e) => {
		blur();
		onDayBlur?.(day.date, m, e);
	}, [blur, onDayBlur]);
	const handleDayKeyDown = (0, import_react.useCallback)((day, modifiers) => (e) => {
		const keyMap = {
			ArrowLeft: [e.shiftKey ? "month" : "day", props.dir === "rtl" ? "after" : "before"],
			ArrowRight: [e.shiftKey ? "month" : "day", props.dir === "rtl" ? "before" : "after"],
			ArrowDown: [e.shiftKey ? "year" : "week", "after"],
			ArrowUp: [e.shiftKey ? "year" : "week", "before"],
			PageUp: [e.shiftKey ? "year" : "month", "before"],
			PageDown: [e.shiftKey ? "year" : "month", "after"],
			Home: ["startOfWeek", "before"],
			End: ["endOfWeek", "after"]
		};
		if (keyMap[e.key]) {
			e.preventDefault();
			e.stopPropagation();
			const [moveBy, moveDir] = keyMap[e.key];
			moveFocus(moveBy, moveDir);
		}
		onDayKeyDown?.(day.date, modifiers, e);
	}, [
		moveFocus,
		onDayKeyDown,
		props.dir
	]);
	const handleDayMouseEnter = (0, import_react.useCallback)((day, modifiers) => (e) => {
		onDayMouseEnter?.(day.date, modifiers, e);
	}, [onDayMouseEnter]);
	const handleDayMouseLeave = (0, import_react.useCallback)((day, modifiers) => (e) => {
		onDayMouseLeave?.(day.date, modifiers, e);
	}, [onDayMouseLeave]);
	const handleMonthChange = (0, import_react.useCallback)((date) => (e) => {
		const selectedMonth = Number(e.target.value);
		goToMonth(dateLib.setMonth(dateLib.startOfMonth(date), selectedMonth));
	}, [dateLib, goToMonth]);
	const handleYearChange = (0, import_react.useCallback)((date) => (e) => {
		const selectedYear = Number(e.target.value);
		goToMonth(dateLib.setYear(dateLib.startOfMonth(date), selectedYear));
	}, [dateLib, goToMonth]);
	const { className, style } = (0, import_react.useMemo)(() => ({
		className: [classNames[UI.Root], props.className].filter(Boolean).join(" "),
		style: {
			...styles?.[UI.Root],
			...props.style
		}
	}), [
		classNames,
		props.className,
		props.style,
		styles
	]);
	const dataAttributes = getDataAttributes(props);
	const rootElRef = (0, import_react.useRef)(null);
	useAnimation(rootElRef, Boolean(props.animate), {
		classNames,
		months,
		focused,
		dateLib
	});
	const contextValue = {
		dayPickerProps: props,
		selected: selectedValue,
		select,
		isSelected,
		months,
		nextMonth,
		previousMonth,
		goToMonth,
		getModifiers,
		components,
		classNames,
		styles,
		labels,
		formatters
	};
	return import_react.createElement(dayPickerContext.Provider, { value: contextValue }, import_react.createElement(components.Root, {
		rootRef: props.animate ? rootElRef : void 0,
		className,
		style,
		dir: props.dir,
		id: props.id,
		lang: props.lang ?? locale.code,
		nonce: props.nonce,
		title: props.title,
		role: props.role,
		"aria-label": props["aria-label"],
		"aria-labelledby": props["aria-labelledby"],
		...dataAttributes
	}, import_react.createElement(components.Months, {
		className: classNames[UI.Months],
		style: styles?.[UI.Months]
	}, !props.hideNavigation && !navLayout && import_react.createElement(components.Nav, {
		"data-animated-nav": props.animate ? "true" : void 0,
		className: classNames[UI.Nav],
		style: styles?.[UI.Nav],
		"aria-label": labelNav$1(),
		onPreviousClick: handlePreviousClick,
		onNextClick: handleNextClick,
		previousMonth,
		nextMonth
	}), months.map((calendarMonth, displayIndex) => {
		return import_react.createElement(components.Month, {
			"data-animated-month": props.animate ? "true" : void 0,
			className: classNames[UI.Month],
			style: styles?.[UI.Month],
			key: displayIndex,
			displayIndex,
			calendarMonth
		}, navLayout === "around" && !props.hideNavigation && displayIndex === 0 && import_react.createElement(components.PreviousMonthButton, {
			type: "button",
			className: classNames[UI.PreviousMonthButton],
			tabIndex: previousMonth ? void 0 : -1,
			"aria-disabled": previousMonth ? void 0 : true,
			"aria-label": labelPrevious$1(previousMonth),
			onClick: handlePreviousClick,
			"data-animated-button": props.animate ? "true" : void 0
		}, import_react.createElement(components.Chevron, {
			disabled: previousMonth ? void 0 : true,
			className: classNames[UI.Chevron],
			orientation: props.dir === "rtl" ? "right" : "left"
		})), import_react.createElement(components.MonthCaption, {
			"data-animated-caption": props.animate ? "true" : void 0,
			className: classNames[UI.MonthCaption],
			style: styles?.[UI.MonthCaption],
			calendarMonth,
			displayIndex
		}, captionLayout?.startsWith("dropdown") ? import_react.createElement(components.DropdownNav, {
			className: classNames[UI.Dropdowns],
			style: styles?.[UI.Dropdowns]
		}, (() => {
			const monthControl = captionLayout === "dropdown" || captionLayout === "dropdown-months" ? import_react.createElement(components.MonthsDropdown, {
				key: "month",
				className: classNames[UI.MonthsDropdown],
				"aria-label": labelMonthDropdown$1(),
				classNames,
				components,
				disabled: Boolean(props.disableNavigation),
				onChange: handleMonthChange(calendarMonth.date),
				options: getMonthOptions(calendarMonth.date, navStart, navEnd, formatters, dateLib),
				style: styles?.[UI.Dropdown],
				value: dateLib.getMonth(calendarMonth.date)
			}) : import_react.createElement("span", { key: "month" }, formatMonthDropdown$1(calendarMonth.date, dateLib));
			const yearControl = captionLayout === "dropdown" || captionLayout === "dropdown-years" ? import_react.createElement(components.YearsDropdown, {
				key: "year",
				className: classNames[UI.YearsDropdown],
				"aria-label": labelYearDropdown$1(dateLib.options),
				classNames,
				components,
				disabled: Boolean(props.disableNavigation),
				onChange: handleYearChange(calendarMonth.date),
				options: getYearOptions(navStart, navEnd, formatters, dateLib, Boolean(props.reverseYears)),
				style: styles?.[UI.Dropdown],
				value: dateLib.getYear(calendarMonth.date)
			}) : import_react.createElement("span", { key: "year" }, formatYearDropdown$1(calendarMonth.date, dateLib));
			return dateLib.getMonthYearOrder() === "year-first" ? [yearControl, monthControl] : [monthControl, yearControl];
		})(), import_react.createElement("span", {
			role: "status",
			"aria-live": "polite",
			style: {
				border: 0,
				clip: "rect(0 0 0 0)",
				height: "1px",
				margin: "-1px",
				overflow: "hidden",
				padding: 0,
				position: "absolute",
				width: "1px",
				whiteSpace: "nowrap",
				wordWrap: "normal"
			}
		}, formatCaption$1(calendarMonth.date, dateLib.options, dateLib))) : import_react.createElement(components.CaptionLabel, {
			className: classNames[UI.CaptionLabel],
			role: "status",
			"aria-live": "polite"
		}, formatCaption$1(calendarMonth.date, dateLib.options, dateLib))), navLayout === "around" && !props.hideNavigation && displayIndex === numberOfMonths - 1 && import_react.createElement(components.NextMonthButton, {
			type: "button",
			className: classNames[UI.NextMonthButton],
			tabIndex: nextMonth ? void 0 : -1,
			"aria-disabled": nextMonth ? void 0 : true,
			"aria-label": labelNext$1(nextMonth),
			onClick: handleNextClick,
			"data-animated-button": props.animate ? "true" : void 0
		}, import_react.createElement(components.Chevron, {
			disabled: nextMonth ? void 0 : true,
			className: classNames[UI.Chevron],
			orientation: props.dir === "rtl" ? "left" : "right"
		})), displayIndex === numberOfMonths - 1 && navLayout === "after" && !props.hideNavigation && import_react.createElement(components.Nav, {
			"data-animated-nav": props.animate ? "true" : void 0,
			className: classNames[UI.Nav],
			style: styles?.[UI.Nav],
			"aria-label": labelNav$1(),
			onPreviousClick: handlePreviousClick,
			onNextClick: handleNextClick,
			previousMonth,
			nextMonth
		}), import_react.createElement(components.MonthGrid, {
			role: "grid",
			"aria-multiselectable": mode === "multiple" || mode === "range",
			"aria-label": labelGrid$1(calendarMonth.date, dateLib.options, dateLib) || void 0,
			className: classNames[UI.MonthGrid],
			style: styles?.[UI.MonthGrid]
		}, !props.hideWeekdays && import_react.createElement(components.Weekdays, {
			"data-animated-weekdays": props.animate ? "true" : void 0,
			className: classNames[UI.Weekdays],
			style: styles?.[UI.Weekdays]
		}, showWeekNumber && import_react.createElement(components.WeekNumberHeader, {
			"aria-label": labelWeekNumberHeader$1(dateLib.options),
			className: classNames[UI.WeekNumberHeader],
			style: styles?.[UI.WeekNumberHeader],
			scope: "col"
		}, formatWeekNumberHeader$1()), weekdays.map((weekday) => import_react.createElement(components.Weekday, {
			"aria-label": labelWeekday$1(weekday, dateLib.options, dateLib),
			className: classNames[UI.Weekday],
			key: String(weekday),
			style: styles?.[UI.Weekday],
			scope: "col"
		}, formatWeekdayName$1(weekday, dateLib.options, dateLib)))), import_react.createElement(components.Weeks, {
			"data-animated-weeks": props.animate ? "true" : void 0,
			className: classNames[UI.Weeks],
			style: styles?.[UI.Weeks]
		}, calendarMonth.weeks.map((week) => {
			return import_react.createElement(components.Week, {
				className: classNames[UI.Week],
				key: week.weekNumber,
				style: styles?.[UI.Week],
				week
			}, showWeekNumber && import_react.createElement(components.WeekNumber, {
				week,
				style: styles?.[UI.WeekNumber],
				"aria-label": labelWeekNumber$1(week.weekNumber, { locale }),
				className: classNames[UI.WeekNumber],
				scope: "row",
				role: "rowheader"
			}, formatWeekNumber$1(week.weekNumber, dateLib)), week.days.map((day) => {
				const { date } = day;
				const modifiers = getModifiers(day);
				modifiers[DayFlag.focused] = !modifiers.hidden && Boolean(focused?.isEqualTo(day));
				modifiers[SelectionState.selected] = isSelected?.(date) || modifiers.selected;
				if (isDateRange(selectedValue)) {
					const { from, to } = selectedValue;
					modifiers[SelectionState.range_start] = Boolean(from && to && dateLib.isSameDay(date, from));
					modifiers[SelectionState.range_end] = Boolean(from && to && dateLib.isSameDay(date, to));
					modifiers[SelectionState.range_middle] = rangeIncludesDate(selectedValue, date, true, dateLib);
				}
				const style$1 = getStyleForModifiers(modifiers, styles, props.modifiersStyles);
				const className$1 = getClassNamesForModifiers(modifiers, classNames, props.modifiersClassNames);
				const ariaLabel = !isInteractive && !modifiers.hidden ? labelGridcell$1(date, modifiers, dateLib.options, dateLib) : void 0;
				return import_react.createElement(components.Day, {
					key: `${day.isoDate}_${day.displayMonthId}`,
					day,
					modifiers,
					className: className$1.join(" "),
					style: style$1,
					role: "gridcell",
					"aria-selected": modifiers.selected || void 0,
					"aria-label": ariaLabel,
					"data-day": day.isoDate,
					"data-month": day.outside ? day.dateMonthId : void 0,
					"data-selected": modifiers.selected || void 0,
					"data-disabled": modifiers.disabled || void 0,
					"data-hidden": modifiers.hidden || void 0,
					"data-outside": day.outside || void 0,
					"data-focused": modifiers.focused || void 0,
					"data-today": modifiers.today || void 0
				}, !modifiers.hidden && isInteractive ? import_react.createElement(components.DayButton, {
					className: classNames[UI.DayButton],
					style: styles?.[UI.DayButton],
					type: "button",
					day,
					modifiers,
					disabled: !modifiers.focused && modifiers.disabled || void 0,
					"aria-disabled": modifiers.focused && modifiers.disabled || void 0,
					tabIndex: isFocusTarget(day) ? 0 : -1,
					"aria-label": labelDayButton$1(date, modifiers, dateLib.options, dateLib),
					onClick: handleDayClick(day, modifiers),
					onBlur: handleDayBlur(day, modifiers),
					onFocus: handleDayFocus(day, modifiers),
					onKeyDown: handleDayKeyDown(day, modifiers),
					onMouseEnter: handleDayMouseEnter(day, modifiers),
					onMouseLeave: handleDayMouseLeave(day, modifiers)
				}, formatDay$1(date, dateLib.options, dateLib)) : !modifiers.hidden && formatDay$1(day.date, dateLib.options, dateLib));
			}));
		}))));
	})), props.footer && import_react.createElement(components.Footer, {
		className: classNames[UI.Footer],
		style: styles?.[UI.Footer],
		role: "status",
		"aria-live": "polite"
	}, props.footer)));
}
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Calendar({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
		showOutsideDays,
		className: cn("bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-fit", defaultClassNames.root),
			months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
			month_caption: cn("flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]", defaultClassNames.month_caption),
			dropdowns: cn("flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
			dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border", defaultClassNames.dropdown_root),
			dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
			caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
			table: "w-full border-collapse",
			weekdays: cn("flex", defaultClassNames.weekdays),
			weekday: cn("text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal", defaultClassNames.weekday),
			week: cn("mt-2 flex w-full", defaultClassNames.week),
			week_number_header: cn("w-[--cell-size] select-none", defaultClassNames.week_number_header),
			week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
			day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md", defaultClassNames.day),
			range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
			range_middle: cn("rounded-none", defaultClassNames.range_middle),
			range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
			today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),
			outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
			disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: ({ className: className$1, rootRef, ...props$1 }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot": "calendar",
					ref: rootRef,
					className: cn(className$1),
					...props$1
				});
			},
			Chevron: ({ className: className$1, orientation, ...props$1 }) => {
				if (orientation === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: cn("size-4", className$1),
					...props$1
				});
				if (orientation === "right") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: cn("size-4", className$1),
					...props$1
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", className$1),
					...props$1
				});
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props$1 }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					...props$1,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-[--cell-size] items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props
	});
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(),
		"data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
		"data-range-start": modifiers.range_start,
		"data-range-end": modifiers.range_end,
		"data-range-middle": modifiers.range_middle,
		className: cn("data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className),
		...props
	});
}
export { isAfter as a, endOfMonth as c, addDays as d, isBefore as i, isSameDay as l, CalendarDayButton as n, endOfWeek as o, isSameMonth as r, startOfMonth as s, Calendar as t, addWeeks as u };

//# sourceMappingURL=calendar-PXZiOn93.js.map