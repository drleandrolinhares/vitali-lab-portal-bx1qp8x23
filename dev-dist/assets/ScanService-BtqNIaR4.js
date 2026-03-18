import { t as Calendar$1 } from "./calendar-DAW7qrlM.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-eMXwbF4o.js";
import { c as endOfMonth, d as addDays, i as isBefore, l as isSameDay, n as CalendarDayButton, o as endOfWeek, r as isSameMonth, s as startOfMonth, t as Calendar, u as addWeeks } from "./calendar-Cqs9C3mu.js";
import { t as Clock } from "./clock-MwvMSUmz.js";
import { t as Funnel } from "./funnel-CRH8ikG1.js";
import { t as LoaderCircle } from "./loader-circle-D-KN62lS.js";
import { t as Plus } from "./plus-Dft-SVnw.js";
import { t as Settings } from "./settings-CEPOUPju.js";
import { t as Trash2 } from "./trash-2-D538NMvb.js";
import { t as User } from "./user-ohMPVr1B.js";
import { t as parseISO } from "./parseISO-BvmakjXM.js";
import { A as startOfISOWeek, B as supabase, C as enUS, Et as toast, F as constructFrom, I as millisecondsInHour, It as require_react, L as millisecondsInMinute, M as getDefaultOptions$1, P as toDate, R as millisecondsInSecond, S as getISOWeek, St as require_jsx_runtime, _ as isProtectedWeekYearToken, a as useAppStore, at as createLucideIcon, b as getWeek, g as isProtectedDayOfYearToken, h as format, j as startOfWeek, k as getTimezoneOffsetInMilliseconds, kt as Navigate, p as ptBR, t as Button, tt as cn, v as warnOrThrowProtectedError, x as getWeekYear, y as longFormatters, zt as __toESM } from "./index-CnyIMDQs.js";
import { n as CardContent, t as Card } from "./card-CEXI0gaQ.js";
import { t as Input } from "./input-C8fagdeG.js";
import { t as Label } from "./label-B0GIpEr2.js";
import "./es2015-CUtX7kA4.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvGfX0P3.js";
import { n as DropdownMenuCheckboxItem, r as DropdownMenuContent, s as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-C76nNdEd.js";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-ChM0Y7ld.js";
import { t as Switch } from "./switch-B5O3AKkh.js";
import { t as Textarea } from "./textarea-C_VDGKnL.js";
var CalendarX2 = createLucideIcon("calendar-x-2", [
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["path", {
		d: "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",
		key: "3spt84"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}],
	["path", {
		d: "m17 22 5-5",
		key: "1k6ppv"
	}],
	["path", {
		d: "m17 17 5 5",
		key: "p7ous7"
	}]
]);
var UserMinus = createLucideIcon("user-minus", [
	["path", {
		d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
		key: "1yyitq"
	}],
	["circle", {
		cx: "9",
		cy: "7",
		r: "4",
		key: "nufk8"
	}],
	["line", {
		x1: "22",
		x2: "16",
		y1: "11",
		y2: "11",
		key: "1shjgl"
	}]
]);
function addMinutes(date, amount, options) {
	const _date = toDate(date, options?.in);
	_date.setTime(_date.getTime() + amount * millisecondsInMinute);
	return _date;
}
function getDay(date, options) {
	return toDate(date, options?.in).getDay();
}
function getDefaultOptions() {
	return Object.assign({}, getDefaultOptions$1());
}
function getISODay(date, options) {
	const day = toDate(date, options?.in).getDay();
	return day === 0 ? 7 : day;
}
function transpose(date, constructor) {
	const date_ = isConstructor(constructor) ? new constructor(0) : constructFrom(constructor, 0);
	date_.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
	date_.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
	return date_;
}
function isConstructor(constructor) {
	return typeof constructor === "function" && constructor.prototype?.constructor === constructor;
}
var TIMEZONE_UNIT_PRIORITY = 10;
var Setter = class {
	subPriority = 0;
	validate(_utcDate, _options) {
		return true;
	}
};
var ValueSetter = class extends Setter {
	constructor(value, validateValue, setValue, priority, subPriority) {
		super();
		this.value = value;
		this.validateValue = validateValue;
		this.setValue = setValue;
		this.priority = priority;
		if (subPriority) this.subPriority = subPriority;
	}
	validate(date, options) {
		return this.validateValue(date, this.value, options);
	}
	set(date, flags, options) {
		return this.setValue(date, flags, this.value, options);
	}
};
var DateTimezoneSetter = class extends Setter {
	priority = TIMEZONE_UNIT_PRIORITY;
	subPriority = -1;
	constructor(context, reference) {
		super();
		this.context = context || ((date) => constructFrom(reference, date));
	}
	set(date, flags) {
		if (flags.timestampIsSet) return date;
		return constructFrom(date, transpose(date, this.context));
	}
};
var Parser = class {
	run(dateString, token, match, options) {
		const result = this.parse(dateString, token, match, options);
		if (!result) return null;
		return {
			setter: new ValueSetter(result.value, this.validate, this.set, this.priority, this.subPriority),
			rest: result.rest
		};
	}
	validate(_utcDate, _value, _options) {
		return true;
	}
};
var EraParser = class extends Parser {
	priority = 140;
	parse(dateString, token, match) {
		switch (token) {
			case "G":
			case "GG":
			case "GGG": return match.era(dateString, { width: "abbreviated" }) || match.era(dateString, { width: "narrow" });
			case "GGGGG": return match.era(dateString, { width: "narrow" });
			case "GGGG":
			default: return match.era(dateString, { width: "wide" }) || match.era(dateString, { width: "abbreviated" }) || match.era(dateString, { width: "narrow" });
		}
	}
	set(date, flags, value) {
		flags.era = value;
		date.setFullYear(value, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"R",
		"u",
		"t",
		"T"
	];
};
const numericPatterns = {
	month: /^(1[0-2]|0?\d)/,
	date: /^(3[0-1]|[0-2]?\d)/,
	dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
	week: /^(5[0-3]|[0-4]?\d)/,
	hour23h: /^(2[0-3]|[0-1]?\d)/,
	hour24h: /^(2[0-4]|[0-1]?\d)/,
	hour11h: /^(1[0-1]|0?\d)/,
	hour12h: /^(1[0-2]|0?\d)/,
	minute: /^[0-5]?\d/,
	second: /^[0-5]?\d/,
	singleDigit: /^\d/,
	twoDigits: /^\d{1,2}/,
	threeDigits: /^\d{1,3}/,
	fourDigits: /^\d{1,4}/,
	anyDigitsSigned: /^-?\d+/,
	singleDigitSigned: /^-?\d/,
	twoDigitsSigned: /^-?\d{1,2}/,
	threeDigitsSigned: /^-?\d{1,3}/,
	fourDigitsSigned: /^-?\d{1,4}/
};
const timezonePatterns = {
	basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
	basic: /^([+-])(\d{2})(\d{2})|Z/,
	basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
	extended: /^([+-])(\d{2}):(\d{2})|Z/,
	extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
function mapValue(parseFnResult, mapFn) {
	if (!parseFnResult) return parseFnResult;
	return {
		value: mapFn(parseFnResult.value),
		rest: parseFnResult.rest
	};
}
function parseNumericPattern(pattern, dateString) {
	const matchResult = dateString.match(pattern);
	if (!matchResult) return null;
	return {
		value: parseInt(matchResult[0], 10),
		rest: dateString.slice(matchResult[0].length)
	};
}
function parseTimezonePattern(pattern, dateString) {
	const matchResult = dateString.match(pattern);
	if (!matchResult) return null;
	if (matchResult[0] === "Z") return {
		value: 0,
		rest: dateString.slice(1)
	};
	const sign = matchResult[1] === "+" ? 1 : -1;
	const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
	const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
	const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
	return {
		value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
		rest: dateString.slice(matchResult[0].length)
	};
}
function parseAnyDigitsSigned(dateString) {
	return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
	switch (n) {
		case 1: return parseNumericPattern(numericPatterns.singleDigit, dateString);
		case 2: return parseNumericPattern(numericPatterns.twoDigits, dateString);
		case 3: return parseNumericPattern(numericPatterns.threeDigits, dateString);
		case 4: return parseNumericPattern(numericPatterns.fourDigits, dateString);
		default: return parseNumericPattern(/* @__PURE__ */ new RegExp("^\\d{1," + n + "}"), dateString);
	}
}
function parseNDigitsSigned(n, dateString) {
	switch (n) {
		case 1: return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
		case 2: return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
		case 3: return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
		case 4: return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
		default: return parseNumericPattern(/* @__PURE__ */ new RegExp("^-?\\d{1," + n + "}"), dateString);
	}
}
function dayPeriodEnumToHours(dayPeriod) {
	switch (dayPeriod) {
		case "morning": return 4;
		case "evening": return 17;
		case "pm":
		case "noon":
		case "afternoon": return 12;
		case "am":
		case "midnight":
		case "night":
		default: return 0;
	}
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
	const isCommonEra = currentYear > 0;
	const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
	let result;
	if (absCurrentYear <= 50) result = twoDigitYear || 100;
	else {
		const rangeEnd = absCurrentYear + 50;
		const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
		const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
		result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
	}
	return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex(year) {
	return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
var YearParser = class extends Parser {
	priority = 130;
	incompatibleTokens = [
		"Y",
		"R",
		"u",
		"w",
		"I",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
	parse(dateString, token, match) {
		const valueCallback = (year) => ({
			year,
			isTwoDigitYear: token === "yy"
		});
		switch (token) {
			case "y": return mapValue(parseNDigits(4, dateString), valueCallback);
			case "yo": return mapValue(match.ordinalNumber(dateString, { unit: "year" }), valueCallback);
			default: return mapValue(parseNDigits(token.length, dateString), valueCallback);
		}
	}
	validate(_date, value) {
		return value.isTwoDigitYear || value.year > 0;
	}
	set(date, flags, value) {
		const currentYear = date.getFullYear();
		if (value.isTwoDigitYear) {
			const normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
			date.setFullYear(normalizedTwoDigitYear, 0, 1);
			date.setHours(0, 0, 0, 0);
			return date;
		}
		const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
		date.setFullYear(year, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
};
var LocalWeekYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token, match) {
		const valueCallback = (year) => ({
			year,
			isTwoDigitYear: token === "YY"
		});
		switch (token) {
			case "Y": return mapValue(parseNDigits(4, dateString), valueCallback);
			case "Yo": return mapValue(match.ordinalNumber(dateString, { unit: "year" }), valueCallback);
			default: return mapValue(parseNDigits(token.length, dateString), valueCallback);
		}
	}
	validate(_date, value) {
		return value.isTwoDigitYear || value.year > 0;
	}
	set(date, flags, value, options) {
		const currentYear = getWeekYear(date, options);
		if (value.isTwoDigitYear) {
			const normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
			date.setFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
			date.setHours(0, 0, 0, 0);
			return startOfWeek(date, options);
		}
		const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
		date.setFullYear(year, 0, options.firstWeekContainsDate);
		date.setHours(0, 0, 0, 0);
		return startOfWeek(date, options);
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"Q",
		"q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"i",
		"t",
		"T"
	];
};
var ISOWeekYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token) {
		if (token === "R") return parseNDigitsSigned(4, dateString);
		return parseNDigitsSigned(token.length, dateString);
	}
	set(date, _flags, value) {
		const firstWeekOfYear = constructFrom(date, 0);
		firstWeekOfYear.setFullYear(value, 0, 4);
		firstWeekOfYear.setHours(0, 0, 0, 0);
		return startOfISOWeek(firstWeekOfYear);
	}
	incompatibleTokens = [
		"G",
		"y",
		"Y",
		"u",
		"Q",
		"q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"e",
		"c",
		"t",
		"T"
	];
};
var ExtendedYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token) {
		if (token === "u") return parseNDigitsSigned(4, dateString);
		return parseNDigitsSigned(token.length, dateString);
	}
	set(date, _flags, value) {
		date.setFullYear(value, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"G",
		"y",
		"Y",
		"R",
		"w",
		"I",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var QuarterParser = class extends Parser {
	priority = 120;
	parse(dateString, token, match) {
		switch (token) {
			case "Q":
			case "QQ": return parseNDigits(token.length, dateString);
			case "Qo": return match.ordinalNumber(dateString, { unit: "quarter" });
			case "QQQ": return match.quarter(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "QQQQQ": return match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "QQQQ":
			default: return match.quarter(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 4;
	}
	set(date, _flags, value) {
		date.setMonth((value - 1) * 3, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var StandAloneQuarterParser = class extends Parser {
	priority = 120;
	parse(dateString, token, match) {
		switch (token) {
			case "q":
			case "qq": return parseNDigits(token.length, dateString);
			case "qo": return match.ordinalNumber(dateString, { unit: "quarter" });
			case "qqq": return match.quarter(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "qqqqq": return match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "qqqq":
			default: return match.quarter(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 4;
	}
	set(date, _flags, value) {
		date.setMonth((value - 1) * 3, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"Q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var MonthParser = class extends Parser {
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"L",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
	priority = 110;
	parse(dateString, token, match) {
		const valueCallback = (value) => value - 1;
		switch (token) {
			case "M": return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback);
			case "MM": return mapValue(parseNDigits(2, dateString), valueCallback);
			case "Mo": return mapValue(match.ordinalNumber(dateString, { unit: "month" }), valueCallback);
			case "MMM": return match.month(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "MMMMM": return match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "MMMM":
			default: return match.month(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.month(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		date.setMonth(value, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
};
var StandAloneMonthParser = class extends Parser {
	priority = 110;
	parse(dateString, token, match) {
		const valueCallback = (value) => value - 1;
		switch (token) {
			case "L": return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback);
			case "LL": return mapValue(parseNDigits(2, dateString), valueCallback);
			case "Lo": return mapValue(match.ordinalNumber(dateString, { unit: "month" }), valueCallback);
			case "LLL": return match.month(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "LLLLL": return match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "LLLL":
			default: return match.month(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.month(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		date.setMonth(value, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"M",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
function setWeek(date, week, options) {
	const date_ = toDate(date, options?.in);
	const diff = getWeek(date_, options) - week;
	date_.setDate(date_.getDate() - diff * 7);
	return toDate(date_, options?.in);
}
var LocalWeekParser = class extends Parser {
	priority = 100;
	parse(dateString, token, match) {
		switch (token) {
			case "w": return parseNumericPattern(numericPatterns.week, dateString);
			case "wo": return match.ordinalNumber(dateString, { unit: "week" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 53;
	}
	set(date, _flags, value, options) {
		return startOfWeek(setWeek(date, value, options), options);
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"i",
		"t",
		"T"
	];
};
function setISOWeek(date, week, options) {
	const _date = toDate(date, options?.in);
	const diff = getISOWeek(_date, options) - week;
	_date.setDate(_date.getDate() - diff * 7);
	return _date;
}
var ISOWeekParser = class extends Parser {
	priority = 100;
	parse(dateString, token, match) {
		switch (token) {
			case "I": return parseNumericPattern(numericPatterns.week, dateString);
			case "Io": return match.ordinalNumber(dateString, { unit: "week" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 53;
	}
	set(date, _flags, value) {
		return startOfISOWeek(setISOWeek(date, value));
	}
	incompatibleTokens = [
		"y",
		"Y",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"e",
		"c",
		"t",
		"T"
	];
};
var DAYS_IN_MONTH = [
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
var DAYS_IN_MONTH_LEAP_YEAR = [
	31,
	29,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
var DateParser = class extends Parser {
	priority = 90;
	subPriority = 1;
	parse(dateString, token, match) {
		switch (token) {
			case "d": return parseNumericPattern(numericPatterns.date, dateString);
			case "do": return match.ordinalNumber(dateString, { unit: "date" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(date, value) {
		const isLeapYear = isLeapYearIndex(date.getFullYear());
		const month = date.getMonth();
		if (isLeapYear) return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
		else return value >= 1 && value <= DAYS_IN_MONTH[month];
	}
	set(date, _flags, value) {
		date.setDate(value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var DayOfYearParser = class extends Parser {
	priority = 90;
	subpriority = 1;
	parse(dateString, token, match) {
		switch (token) {
			case "D":
			case "DD": return parseNumericPattern(numericPatterns.dayOfYear, dateString);
			case "Do": return match.ordinalNumber(dateString, { unit: "date" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(date, value) {
		if (isLeapYearIndex(date.getFullYear())) return value >= 1 && value <= 366;
		else return value >= 1 && value <= 365;
	}
	set(date, _flags, value) {
		date.setMonth(0, value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"E",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
function setDay(date, day, options) {
	const defaultOptions = getDefaultOptions$1();
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const date_ = toDate(date, options?.in);
	const currentDay = date_.getDay();
	const dayIndex = (day % 7 + 7) % 7;
	const delta = 7 - weekStartsOn;
	return addDays(date_, day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7, options);
}
var DayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match) {
		switch (token) {
			case "E":
			case "EE":
			case "EEE": return match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEE": return match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEE":
			default: return match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var LocalDayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match, options) {
		const valueCallback = (value) => {
			const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
			return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
		};
		switch (token) {
			case "e":
			case "ee": return mapValue(parseNDigits(token.length, dateString), valueCallback);
			case "eo": return mapValue(match.ordinalNumber(dateString, { unit: "day" }), valueCallback);
			case "eee": return match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeee": return match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "eeee":
			default: return match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"E",
		"i",
		"c",
		"t",
		"T"
	];
};
var StandAloneLocalDayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match, options) {
		const valueCallback = (value) => {
			const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
			return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
		};
		switch (token) {
			case "c":
			case "cc": return mapValue(parseNDigits(token.length, dateString), valueCallback);
			case "co": return mapValue(match.ordinalNumber(dateString, { unit: "day" }), valueCallback);
			case "ccc": return match.day(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "ccccc": return match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "cccc":
			default: return match.day(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"E",
		"i",
		"e",
		"t",
		"T"
	];
};
function setISODay(date, day, options) {
	const date_ = toDate(date, options?.in);
	return addDays(date_, day - getISODay(date_, options), options);
}
var ISODayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match) {
		const valueCallback = (value) => {
			if (value === 0) return 7;
			return value;
		};
		switch (token) {
			case "i":
			case "ii": return parseNDigits(token.length, dateString);
			case "io": return match.ordinalNumber(dateString, { unit: "day" });
			case "iii": return mapValue(match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			case "iiiii": return mapValue(match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			case "iiiiii": return mapValue(match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			case "iiii":
			default: return mapValue(match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 7;
	}
	set(date, _flags, value) {
		date = setISODay(date, value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"Y",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"E",
		"e",
		"c",
		"t",
		"T"
	];
};
var AMPMParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "a":
			case "aa":
			case "aaa": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "aaaaa": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "aaaa":
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"b",
		"B",
		"H",
		"k",
		"t",
		"T"
	];
};
var AMPMMidnightParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "b":
			case "bb":
			case "bbb": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "bbbbb": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "bbbb":
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"B",
		"H",
		"k",
		"t",
		"T"
	];
};
var DayPeriodParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "B":
			case "BB":
			case "BBB": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "BBBBB": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "BBBB":
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"t",
		"T"
	];
};
var Hour1to12Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "h": return parseNumericPattern(numericPatterns.hour12h, dateString);
			case "ho": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 12;
	}
	set(date, _flags, value) {
		const isPM = date.getHours() >= 12;
		if (isPM && value < 12) date.setHours(value + 12, 0, 0, 0);
		else if (!isPM && value === 12) date.setHours(0, 0, 0, 0);
		else date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"H",
		"K",
		"k",
		"t",
		"T"
	];
};
var Hour0to23Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "H": return parseNumericPattern(numericPatterns.hour23h, dateString);
			case "Ho": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 23;
	}
	set(date, _flags, value) {
		date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"h",
		"K",
		"k",
		"t",
		"T"
	];
};
var Hour0To11Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "K": return parseNumericPattern(numericPatterns.hour11h, dateString);
			case "Ko": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		if (date.getHours() >= 12 && value < 12) date.setHours(value + 12, 0, 0, 0);
		else date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"h",
		"H",
		"k",
		"t",
		"T"
	];
};
var Hour1To24Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "k": return parseNumericPattern(numericPatterns.hour24h, dateString);
			case "ko": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 24;
	}
	set(date, _flags, value) {
		const hours = value <= 24 ? value % 24 : value;
		date.setHours(hours, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"h",
		"H",
		"K",
		"t",
		"T"
	];
};
var MinuteParser = class extends Parser {
	priority = 60;
	parse(dateString, token, match) {
		switch (token) {
			case "m": return parseNumericPattern(numericPatterns.minute, dateString);
			case "mo": return match.ordinalNumber(dateString, { unit: "minute" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 59;
	}
	set(date, _flags, value) {
		date.setMinutes(value, 0, 0);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
var SecondParser = class extends Parser {
	priority = 50;
	parse(dateString, token, match) {
		switch (token) {
			case "s": return parseNumericPattern(numericPatterns.second, dateString);
			case "so": return match.ordinalNumber(dateString, { unit: "second" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 59;
	}
	set(date, _flags, value) {
		date.setSeconds(value, 0);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
var FractionOfSecondParser = class extends Parser {
	priority = 30;
	parse(dateString, token) {
		const valueCallback = (value) => Math.trunc(value * Math.pow(10, -token.length + 3));
		return mapValue(parseNDigits(token.length, dateString), valueCallback);
	}
	set(date, _flags, value) {
		date.setMilliseconds(value);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
var ISOTimezoneWithZParser = class extends Parser {
	priority = 10;
	parse(dateString, token) {
		switch (token) {
			case "X": return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
			case "XX": return parseTimezonePattern(timezonePatterns.basic, dateString);
			case "XXXX": return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
			case "XXXXX": return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
			case "XXX":
			default: return parseTimezonePattern(timezonePatterns.extended, dateString);
		}
	}
	set(date, flags, value) {
		if (flags.timestampIsSet) return date;
		return constructFrom(date, date.getTime() - getTimezoneOffsetInMilliseconds(date) - value);
	}
	incompatibleTokens = [
		"t",
		"T",
		"x"
	];
};
var ISOTimezoneParser = class extends Parser {
	priority = 10;
	parse(dateString, token) {
		switch (token) {
			case "x": return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
			case "xx": return parseTimezonePattern(timezonePatterns.basic, dateString);
			case "xxxx": return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
			case "xxxxx": return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
			case "xxx":
			default: return parseTimezonePattern(timezonePatterns.extended, dateString);
		}
	}
	set(date, flags, value) {
		if (flags.timestampIsSet) return date;
		return constructFrom(date, date.getTime() - getTimezoneOffsetInMilliseconds(date) - value);
	}
	incompatibleTokens = [
		"t",
		"T",
		"X"
	];
};
var TimestampSecondsParser = class extends Parser {
	priority = 40;
	parse(dateString) {
		return parseAnyDigitsSigned(dateString);
	}
	set(date, _flags, value) {
		return [constructFrom(date, value * 1e3), { timestampIsSet: true }];
	}
	incompatibleTokens = "*";
};
var TimestampMillisecondsParser = class extends Parser {
	priority = 20;
	parse(dateString) {
		return parseAnyDigitsSigned(dateString);
	}
	set(date, _flags, value) {
		return [constructFrom(date, value), { timestampIsSet: true }];
	}
	incompatibleTokens = "*";
};
const parsers = {
	G: new EraParser(),
	y: new YearParser(),
	Y: new LocalWeekYearParser(),
	R: new ISOWeekYearParser(),
	u: new ExtendedYearParser(),
	Q: new QuarterParser(),
	q: new StandAloneQuarterParser(),
	M: new MonthParser(),
	L: new StandAloneMonthParser(),
	w: new LocalWeekParser(),
	I: new ISOWeekParser(),
	d: new DateParser(),
	D: new DayOfYearParser(),
	E: new DayParser(),
	e: new LocalDayParser(),
	c: new StandAloneLocalDayParser(),
	i: new ISODayParser(),
	a: new AMPMParser(),
	b: new AMPMMidnightParser(),
	B: new DayPeriodParser(),
	h: new Hour1to12Parser(),
	H: new Hour0to23Parser(),
	K: new Hour0To11Parser(),
	k: new Hour1To24Parser(),
	m: new MinuteParser(),
	s: new SecondParser(),
	S: new FractionOfSecondParser(),
	X: new ISOTimezoneWithZParser(),
	x: new ISOTimezoneParser(),
	t: new TimestampSecondsParser(),
	T: new TimestampMillisecondsParser()
};
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var notWhitespaceRegExp = /\S/;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function parse(dateStr, formatStr, referenceDate, options) {
	const invalidDate = () => constructFrom(options?.in || referenceDate, NaN);
	const defaultOptions = getDefaultOptions();
	const locale = options?.locale ?? defaultOptions.locale ?? enUS;
	const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	if (!formatStr) return dateStr ? invalidDate() : toDate(referenceDate, options?.in);
	const subFnOptions = {
		firstWeekContainsDate,
		weekStartsOn,
		locale
	};
	const setters = [new DateTimezoneSetter(options?.in, referenceDate)];
	const tokens = formatStr.match(longFormattingTokensRegExp).map((substring) => {
		const firstCharacter = substring[0];
		if (firstCharacter in longFormatters) {
			const longFormatter = longFormatters[firstCharacter];
			return longFormatter(substring, locale.formatLong);
		}
		return substring;
	}).join("").match(formattingTokensRegExp);
	const usedTokens = [];
	for (let token of tokens) {
		if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token)) warnOrThrowProtectedError(token, formatStr, dateStr);
		if (!options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) warnOrThrowProtectedError(token, formatStr, dateStr);
		const firstCharacter = token[0];
		const parser = parsers[firstCharacter];
		if (parser) {
			const { incompatibleTokens } = parser;
			if (Array.isArray(incompatibleTokens)) {
				const incompatibleToken = usedTokens.find((usedToken) => incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter);
				if (incompatibleToken) throw new RangeError(`The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`);
			} else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) throw new RangeError(`The format string mustn't contain \`${token}\` and any other token at the same time`);
			usedTokens.push({
				token: firstCharacter,
				fullToken: token
			});
			const parseResult = parser.run(dateStr, token, locale.match, subFnOptions);
			if (!parseResult) return invalidDate();
			setters.push(parseResult.setter);
			dateStr = parseResult.rest;
		} else {
			if (firstCharacter.match(unescapedLatinCharacterRegExp)) throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
			if (token === "''") token = "'";
			else if (firstCharacter === "'") token = cleanEscapedString(token);
			if (dateStr.indexOf(token) === 0) dateStr = dateStr.slice(token.length);
			else return invalidDate();
		}
	}
	if (dateStr.length > 0 && notWhitespaceRegExp.test(dateStr)) return invalidDate();
	const uniquePrioritySetters = setters.map((setter) => setter.priority).sort((a, b) => b - a).filter((priority, index, array) => array.indexOf(priority) === index).map((priority) => setters.filter((setter) => setter.priority === priority).sort((a, b) => b.subPriority - a.subPriority)).map((setterArray) => setterArray[0]);
	let date = toDate(referenceDate, options?.in);
	if (isNaN(+date)) return invalidDate();
	const flags = {};
	for (const setter of uniquePrioritySetters) {
		if (!setter.validate(date, subFnOptions)) return invalidDate();
		const result = setter.set(date, flags, subFnOptions);
		if (Array.isArray(result)) {
			date = result[0];
			Object.assign(flags, result[1]);
		} else date = result;
	}
	return date;
}
function cleanEscapedString(input) {
	return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}
function subWeeks(date, amount, options) {
	return addWeeks(date, -amount, options);
}
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
const checkBlockOverlap = (slotStart, slotEnd, dateStr, blocks) => {
	return blocks.find((b) => {
		const bStart = b.start_time.substring(0, 5);
		const bEnd = b.end_time.substring(0, 5);
		if (!(bStart < slotEnd && bEnd > slotStart)) return false;
		if (b.recurrence === "daily") return true;
		if (b.recurrence === "unique" && b.block_date === dateStr) return true;
		if (b.block_date) {
			const targetDate = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
			const blockDate = /* @__PURE__ */ new Date(b.block_date + "T00:00:00");
			if (b.recurrence === "weekly" && targetDate.getDay() === blockDate.getDay()) return true;
			if (b.recurrence === "monthly" && targetDate.getDate() === blockDate.getDate()) return true;
		}
		return false;
	});
};
const checkBookingOverlap = (start, end, date, bookings, excludeId) => {
	return bookings.filter((b) => b.booking_date === date && b.id !== excludeId).some((b) => b.start_time.substring(0, 5) < end && b.end_time.substring(0, 5) > start);
};
const generateTimeSlots = (setting) => {
	const slots = [];
	if (!setting || !setting.is_available) return slots;
	const startStr = setting.start_time.length === 5 ? setting.start_time + ":00" : setting.start_time;
	const endStr = setting.end_time.length === 5 ? setting.end_time + ":00" : setting.end_time;
	let current = parse(startStr, "HH:mm:ss", /* @__PURE__ */ new Date());
	const end = parse(endStr, "HH:mm:ss", /* @__PURE__ */ new Date());
	while (isBefore(current, end)) {
		const next = addMinutes(current, setting.slot_duration_minutes);
		slots.push({
			start: format(current, "HH:mm"),
			end: format(next, "HH:mm")
		});
		current = next;
	}
	return slots;
};
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function ScanSidebar({ currentDate, setCurrentDate, bookings, isStaff, currentUserId, filters }) {
	const visibleBookings = (0, import_react.useMemo)(() => {
		return bookings.filter((b) => {
			if (!isStaff && b.dentist_id !== currentUserId) return false;
			if (isStaff && filters.dentistId && filters.dentistId !== "all") {
				if (b.dentist_id !== filters.dentistId) return false;
			}
			return true;
		});
	}, [
		bookings,
		isStaff,
		currentUserId,
		filters.dentistId
	]);
	const CustomDayButton = (0, import_react.useMemo)(() => {
		const Component = import_react.forwardRef((props, ref) => {
			const { day, modifiers, className, ...rest } = props;
			const dateStr = day.date ? format(day.date, "yyyy-MM-dd") : "";
			const dayBookings = dateStr ? visibleBookings.filter((b) => b.booking_date === dateStr).sort((a, b) => a.start_time.localeCompare(b.start_time)) : [];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CalendarDayButton, {
				ref,
				day,
				modifiers,
				className: cn(className, "relative overflow-hidden"),
				...rest,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "relative z-10",
					children: props.children
				}), dayBookings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-1 left-0 right-0 flex flex-col gap-[2px] w-full px-1.5 z-0",
					children: [dayBookings.slice(0, 3).map((b) => {
						const colors = [
							"bg-blue-400",
							"bg-pink-400",
							"bg-emerald-400",
							"bg-amber-400",
							"bg-purple-400"
						];
						const colorClass = colors[(b.id.charCodeAt(0) || 0) % colors.length];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-[3px] w-full rounded-full opacity-90", colorClass) }, b.id);
					}), dayBookings.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[3px] w-full rounded-full bg-slate-300 opacity-90 flex items-center justify-center text-[5px] leading-none text-slate-600 font-bold" })]
				})]
			});
		});
		Component.displayName = "CustomDayButton";
		return Component;
	}, [visibleBookings]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "w-full lg:w-[320px] shrink-0 h-max shadow-sm border-slate-200 rounded-xl overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between p-5 border-b border-slate-100 bg-white",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs font-black text-slate-500 uppercase tracking-widest",
				children: "Navegação"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => setCurrentDate(/* @__PURE__ */ new Date()),
				className: "h-7 px-3 text-[10px] font-bold uppercase border-slate-200 text-slate-600 hover:bg-slate-50",
				children: "Hoje"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-4 flex justify-center bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
				mode: "single",
				selected: currentDate,
				month: currentDate,
				onMonthChange: setCurrentDate,
				onSelect: (d) => d && setCurrentDate(d),
				components: { DayButton: CustomDayButton },
				className: "w-full flex justify-center [&_.rdp]:w-full [&_.rdp-month]:w-full [&_table]:w-full [&_td]:w-10 [&_td]:h-10 [&_.rdp-caption_label]:text-sm [&_.rdp-caption_label]:font-black [&_.rdp-caption_label]:uppercase [&_.rdp-caption_label]:tracking-wider [&_.rdp-head_cell]:text-[10px] [&_.rdp-head_cell]:font-bold [&_.rdp-head_cell]:text-slate-400 [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:w-8 [&_.rdp-day_selected]:bg-[#1A233A] [&_.rdp-day_selected]:text-white [&_.rdp-day_today]:font-black [&_.rdp-day_today]:border-b-2 [&_.rdp-day_today]:border-[#1A233A]"
			})
		})]
	});
}
function ScanHeader({ view, setView, activeTab, setActiveTab, filters, setFilters, dentists, isStaff }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-slate-100",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-slate-100/80 p-1 rounded-lg flex items-center h-11 border border-slate-200 shrink-0",
				children: [
					"day",
					"week",
					"month"
				].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setView(v);
						setActiveTab("VISÃO GERAL");
					},
					className: cn("px-5 sm:px-6 h-full text-[11px] font-black uppercase rounded-md transition-all duration-200 tracking-wider", view === v ? "bg-white shadow-sm text-[#1A233A]" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"),
					children: v === "day" ? "Dia" : v === "week" ? "Semana" : "Mês"
				}, v))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-row items-center gap-2 w-full sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "h-11 text-xs font-bold uppercase text-[#8A6D3B] gap-2 border-[#E5D5B5] bg-[#FDFBF7] hover:bg-[#F8F1E3] flex-1 sm:flex-none transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4" }), " Visibilidade"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					className: "w-56",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuCheckboxItem, {
						checked: filters.showBookings,
						onCheckedChange: (c) => setFilters({
							...filters,
							showBookings: !!c
						}),
						children: "Reservas Confirmadas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuCheckboxItem, {
						checked: filters.showBlocks,
						onCheckedChange: (c) => setFilters({
							...filters,
							showBlocks: !!c
						}),
						children: "Bloqueios Administrativos"
					})]
				})] }), isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: filters.dentistId || "all",
					onValueChange: (v) => setFilters({
						...filters,
						dentistId: v
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
						className: "flex-1 sm:flex-none sm:w-[220px] h-11 text-xs font-bold uppercase border-slate-200 bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 mr-2 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "DENTISTAS" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "Dentistas"
					}), dentists.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: d.id,
						children: d.name
					}, d.id))] })]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
			children: ["AGENDAMENTOS MARCADOS", "VISÃO GERAL"].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActiveTab(tab),
				className: cn("px-6 py-2.5 text-[11px] whitespace-nowrap font-black uppercase rounded-lg transition-all duration-200 tracking-wider shadow-sm border", activeTab === tab ? "bg-[#1A233A] border-[#1A233A] text-white shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-[#1A233A] hover:bg-slate-50"),
				children: tab
			}, tab))
		})]
	});
}
function ScanCalendarViews({ view, currentDate, bookings, blocks, settings, filters, isStaff, currentUserId, activeTab, onSlotClick, onBookingClick }) {
	const visibleBookings = bookings.filter((b) => {
		if (!isStaff && b.dentist_id !== currentUserId) return false;
		if (isStaff && filters.dentistId && filters.dentistId !== "all") {
			if (b.dentist_id !== filters.dentistId) return false;
		}
		return true;
	});
	if (activeTab === "AGENDAMENTOS MARCADOS") {
		const selectedDateStr = format(currentDate, "yyyy-MM-dd");
		const dayBookings = visibleBookings.filter((b) => b.booking_date === selectedDateStr).sort((a, b) => a.start_time.localeCompare(b.start_time));
		if (dayBookings.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-full w-full min-h-[400px] flex flex-col items-center justify-center border border-slate-200 shadow-sm bg-white rounded-xl text-slate-400 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarX2, { className: "w-10 h-10 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-black uppercase tracking-widest text-center px-4",
				children: "NENHUM AGENDAMENTO ENCONTRADO PARA ESTA DATA."
			})]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-black uppercase tracking-wider text-[#1A233A] mb-2 px-2",
				children: format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })
			}), dayBookings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => onBookingClick(b),
				className: "bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-pink-300 hover:shadow-md transition-all group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/20 w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-[#E11D48] group-hover:text-white transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-black uppercase",
							children: format(parseISO(b.booking_date), "MMM", { locale: ptBR })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-black leading-none",
							children: format(parseISO(b.booking_date), "dd")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-black text-[#1A233A] text-lg leading-tight",
						children: b.patient_name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-bold text-slate-500 mt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }),
							" ",
							b.start_time.substring(0, 5),
							" -",
							" ",
							b.end_time.substring(0, 5)
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-start sm:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-black uppercase tracking-widest text-slate-400",
						children: "Dentista Solicitante"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-sm text-[#1A233A]",
						children: b.profiles?.name || "Não informado"
					})]
				})]
			}, b.id))]
		});
	}
	if (view === "month" && activeTab === "VISÃO GERAL") {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
		let currentDay = startDate;
		const calendarDays = [];
		while (currentDay <= endDate) {
			calendarDays.push(currentDay);
			currentDay = addDays(currentDay, 1);
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full min-h-[500px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0",
				children: [
					"Dom",
					"Seg",
					"Ter",
					"Qua",
					"Qui",
					"Sex",
					"Sáb"
				].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-2 sm:p-3 text-center text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-widest",
					children: d
				}, d))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 auto-rows-[minmax(80px,1fr)] bg-slate-200 gap-px flex-1",
				children: calendarDays.map((d) => {
					const dateStr = format(d, "yyyy-MM-dd");
					const dayBookings = visibleBookings.filter((b) => b.booking_date === dateStr).sort((a, b) => a.start_time.localeCompare(b.start_time));
					const isCurrentMonth = isSameMonth(d, currentDate);
					const isToday = isSameDay(d, /* @__PURE__ */ new Date());
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("bg-white p-1 sm:p-1.5 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-slate-50 group", !isCurrentMonth && "bg-slate-50/50 opacity-70"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between px-1 pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full", isToday ? "bg-[#E11D48] text-white" : "text-slate-700"),
								children: format(d, "d")
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-1 px-0.5 sm:px-1 overflow-y-auto no-scrollbar pb-1",
							children: dayBookings.map((b) => {
								const colors = [
									"bg-blue-100 text-blue-700 hover:bg-blue-200",
									"bg-pink-100 text-pink-700 hover:bg-pink-200",
									"bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
									"bg-amber-100 text-amber-700 hover:bg-amber-200",
									"bg-purple-100 text-purple-700 hover:bg-purple-200"
								];
								const colorClass = colors[(b.id.charCodeAt(0) || 0) % colors.length];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: (e) => {
										e.stopPropagation();
										onBookingClick(b);
									},
									className: cn("text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer truncate transition-colors shadow-sm", colorClass),
									title: `${b.start_time.substring(0, 5)} - ${b.patient_name}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "opacity-75 mr-1 font-semibold",
										children: b.start_time.substring(0, 5)
									}), b.patient_name]
								}, b.id);
							})
						})]
					}, dateStr);
				})
			})]
		});
	}
	const days = [];
	if (view === "day") days.push(currentDate);
	else if (view === "week") {
		const start = startOfWeek(currentDate, { weekStartsOn: 0 });
		for (let i = 0; i < 7; i++) days.push(addDays(start, i));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-6",
		children: days.map((d) => {
			const dateStr = format(d, "yyyy-MM-dd");
			const dayBookings = visibleBookings.filter((b) => b.booking_date === dateStr);
			const setting = settings.find((s) => s.day_of_week === getDay(d));
			const slots = generateTimeSlots(setting);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center", isSameDay(d, /* @__PURE__ */ new Date()) && "bg-pink-50 border-pink-100"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: cn("font-black uppercase tracking-wider text-sm", isSameDay(d, /* @__PURE__ */ new Date()) ? "text-[#E11D48]" : "text-[#1A233A]"),
						children: [
							format(d, "EEEE, dd 'de' MMMM", { locale: ptBR }),
							" ",
							isSameDay(d, /* @__PURE__ */ new Date()) && "(Hoje)"
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col divide-y divide-slate-100",
					children: !setting?.is_available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 text-center text-slate-400 font-bold uppercase text-xs tracking-widest bg-slate-50/50",
						children: "Dia Fechado"
					}) : slots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 text-center text-slate-400 font-bold uppercase text-xs tracking-widest bg-slate-50/50",
						children: "Sem horários configurados"
					}) : slots.map((slot) => {
						const overlapBlock = checkBlockOverlap(slot.start, slot.end, dateStr, blocks);
						const overlapBooking = dayBookings.find((b) => b.start_time.substring(0, 5) < slot.end && b.end_time.substring(0, 5) > slot.start);
						if (overlapBlock && !filters.showBlocks) return null;
						if (overlapBooking && !filters.showBookings) return null;
						const isMine = overlapBooking?.dentist_id === currentUserId;
						const canViewDetails = isStaff || isMine;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center p-2.5 hover:bg-slate-50 transition-colors gap-3 min-h-[64px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full sm:w-36 shrink-0 flex items-center gap-2 text-xs font-black text-slate-500 tracking-wider",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-slate-400" }),
									" ",
									slot.start,
									" - ",
									slot.end
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1",
								children: overlapBlock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-slate-100 border border-slate-200 text-slate-500 h-10 px-4 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-widest cursor-not-allowed",
									children: "Bloqueio Administrativo"
								}) : overlapBooking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => canViewDetails && onBookingClick(overlapBooking),
									className: cn("h-auto min-h-[40px] py-2 px-4 rounded-lg border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 transition-colors", canViewDetails ? "bg-[#E11D48]/5 border-[#E11D48]/20 cursor-pointer hover:bg-[#E11D48]/10" : "bg-slate-100 border-slate-200 opacity-80 cursor-not-allowed"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("font-bold text-sm truncate", canViewDetails ? "text-[#E11D48]" : "text-slate-600"),
										children: canViewDetails ? overlapBooking.patient_name : "Horário Ocupado"
									}), canViewDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-[#E11D48]/70 font-bold truncate",
										children: overlapBooking.profiles?.name
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									onClick: () => onSlotClick(dateStr, slot.start, slot.end),
									className: "h-10 border border-dashed border-slate-200 bg-white rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 hover:border-[#E11D48]/50 hover:bg-[#E11D48]/5 hover:text-[#E11D48] cursor-pointer uppercase tracking-widest transition-all",
									children: "+ Novo Agendamento"
								})
							})]
						}, slot.start);
					})
				})]
			}, dateStr);
		})
	});
}
function BookingModal({ open, mode, formData, setFormData, saving, onClose, onSave, onDelete, dentists, isStaff }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "uppercase",
					children: mode === "create" ? "Nova Reserva de Scan" : "Detalhes da Reserva"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Preencha os dados abaixo para agendar o serviço de escaneamento." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-4",
					children: [
						isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "uppercase text-xs font-bold",
								children: ["Dentista / Clínica ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.dentist_id,
								onValueChange: (v) => setFormData({
									...formData,
									dentist_id: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o dentista" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: dentists.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: d.id,
									children: d.name
								}, d.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "uppercase text-xs font-bold",
								children: ["Nome do Paciente ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: formData.patient_name,
								onChange: (e) => setFormData({
									...formData,
									patient_name: e.target.value
								}),
								placeholder: "Ex: João Silva"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 col-span-2 sm:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "uppercase text-xs font-bold",
									children: ["Data ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: formData.booking_date,
									onChange: (e) => setFormData({
										...formData,
										booking_date: e.target.value
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 col-span-2 sm:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "uppercase text-xs font-bold",
										children: ["Início ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: formData.start_time,
										onChange: (e) => setFormData({
											...formData,
											start_time: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "uppercase text-xs font-bold",
										children: ["Fim ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: formData.end_time,
										onChange: (e) => setFormData({
											...formData,
											end_time: e.target.value
										})
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "uppercase text-xs font-bold",
								children: "Observações"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: formData.notes,
								onChange: (e) => setFormData({
									...formData,
									notes: e.target.value
								}),
								placeholder: "Instruções adicionais...",
								className: "min-h-[80px]"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex-col sm:flex-row gap-2",
					children: [
						mode === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							onClick: onDelete,
							disabled: saving,
							className: "mr-auto w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 mr-2" }), " Excluir"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: onClose,
							className: "w-full sm:w-auto",
							children: "Cancelar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: onSave,
							disabled: saving,
							className: "w-full sm:w-auto",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }), mode === "create" ? "Confirmar" : "Salvar Alterações"]
						})
					]
				})
			]
		})
	});
}
function BlockModal({ open, form, setForm, saving, onClose, onSave, blocks, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "uppercase",
					children: "Gerenciar Bloqueios"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Defina horários indisponíveis para o serviço de Scan." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-4 border-b border-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 col-span-2 sm:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "uppercase text-[10px] font-bold",
									children: "Recorrência"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.recurrence,
									onValueChange: (v) => setForm({
										...form,
										recurrence: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "unique",
											children: "Data Única"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "daily",
											children: "Diário"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "weekly",
											children: "Semanal"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "monthly",
											children: "Mensal"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 col-span-2 sm:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "uppercase text-[10px] font-bold",
									children: "Data Base"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: cn("w-full justify-start text-left font-normal px-3", !form.block_date && "text-muted-foreground"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, { className: "mr-2 h-4 w-4 opacity-50" }), form.block_date ? format(/* @__PURE__ */ new Date(form.block_date + "T00:00:00"), "dd/MM/yyyy") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Selecione" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
									className: "w-auto p-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
										mode: "single",
										selected: form.block_date ? /* @__PURE__ */ new Date(form.block_date + "T00:00:00") : void 0,
										onSelect: (d) => d && setForm({
											...form,
											block_date: format(d, "yyyy-MM-dd")
										}),
										initialFocus: true
									})
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "uppercase text-[10px] font-bold",
									children: "Início"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: form.start_time,
									onChange: (e) => setForm({
										...form,
										start_time: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "uppercase text-[10px] font-bold",
									children: "Fim"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: form.end_time,
									onChange: (e) => setForm({
										...form,
										end_time: e.target.value
									})
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onSave,
						disabled: saving,
						className: "w-full mt-2",
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null, " Adicionar Bloqueio"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 max-h-40 overflow-y-auto pr-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs font-bold uppercase text-muted-foreground",
						children: "Bloqueios Ativos"
					}), blocks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-xs text-muted-foreground py-2",
						children: "Nenhum bloqueio."
					}) : blocks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center bg-muted/30 border border-border/50 p-2 rounded-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-bold",
							children: [
								b.start_time.substring(0, 5),
								" às ",
								b.end_time.substring(0, 5)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground capitalize",
							children: [
								b.recurrence,
								" ",
								b.block_date ? format(/* @__PURE__ */ new Date(b.block_date + "T00:00:00"), "dd/MM/yyyy") : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "text-destructive h-7 w-7",
							onClick: () => onDelete(b.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})]
					}, b.id))]
				})
			]
		})
	});
}
function ScanSettingsModal({ open, settings, setSettings, saving, onClose, onSave }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "uppercase",
					children: "Horários de Atendimento"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Configure os dias e horários em que o serviço de Scan está disponível." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2",
					children: settings.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full sm:w-32 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: s.is_available,
								onCheckedChange: (v) => {
									const n = [...settings];
									n[idx].is_available = v;
									setSettings(n);
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "font-bold uppercase text-sm",
								children: [
									"Dom",
									"Seg",
									"Ter",
									"Qua",
									"Qui",
									"Sex",
									"Sáb"
								][s.day_of_week]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] uppercase text-muted-foreground font-bold",
										children: "Início"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										disabled: !s.is_available,
										value: s.start_time.substring(0, 5),
										onChange: (e) => {
											const n = [...settings];
											n[idx].start_time = e.target.value + ":00";
											setSettings(n);
										}
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] uppercase text-muted-foreground font-bold",
										children: "Fim"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										disabled: !s.is_available,
										value: s.end_time.substring(0, 5),
										onChange: (e) => {
											const n = [...settings];
											n[idx].end_time = e.target.value + ":00";
											setSettings(n);
										}
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] uppercase text-muted-foreground font-bold",
										children: "Duração (Min)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										disabled: !s.is_available,
										value: s.slot_duration_minutes,
										onChange: (e) => {
											const n = [...settings];
											n[idx].slot_duration_minutes = parseInt(e.target.value) || 60;
											setSettings(n);
										}
									})]
								})
							]
						})]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onSave,
					disabled: saving,
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null, " Salvar Configurações"]
				})] })
			]
		})
	});
}
function ScanService() {
	const { currentUser, appSettings } = useAppStore();
	const [currentDate, setCurrentDate] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [view, setView] = (0, import_react.useState)("week");
	const [activeTab, setActiveTab] = (0, import_react.useState)("AGENDAMENTOS MARCADOS");
	const [filters, setFilters] = (0, import_react.useState)({
		showBookings: true,
		showBlocks: true,
		dentistId: "all"
	});
	const [bookings, setBookings] = (0, import_react.useState)([]);
	const [settings, setSettings] = (0, import_react.useState)([]);
	const [blocks, setBlocks] = (0, import_react.useState)([]);
	const [dentists, setDentists] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [modal, setModal] = (0, import_react.useState)({
		open: false,
		mode: "create",
		booking: null
	});
	const [formData, setFormData] = (0, import_react.useState)({
		dentist_id: currentUser?.id || "",
		patient_name: "",
		booking_date: "",
		start_time: "",
		end_time: "",
		notes: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [blockModal, setBlockModal] = (0, import_react.useState)({ open: false });
	const [blockForm, setBlockForm] = (0, import_react.useState)({
		block_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
		start_time: "08:00",
		end_time: "12:00",
		recurrence: "unique"
	});
	const [savingBlock, setSavingBlock] = (0, import_react.useState)(false);
	const [settingsModalOpen, setSettingsModalOpen] = (0, import_react.useState)(false);
	const [configSettings, setConfigSettings] = (0, import_react.useState)([]);
	const [savingSettings, setSavingSettings] = (0, import_react.useState)(false);
	const isStaff = [
		"admin",
		"master",
		"receptionist",
		"technical_assistant",
		"financial",
		"relationship_manager"
	].includes(currentUser?.role || "");
	const isAdmin = currentUser?.role === "admin" || currentUser?.role === "master";
	const scanServiceEnabled = appSettings["scan_service_enabled"] === "true";
	const fetchAgenda = async () => {
		setLoading(true);
		const start = format(subWeeks(startOfMonth(currentDate), 1), "yyyy-MM-dd");
		const end = format(addWeeks(endOfMonth(currentDate), 1), "yyyy-MM-dd");
		const [bookRes, setRes, dentRes, blockRes] = await Promise.all([
			supabase.from("vw_secure_scan_bookings").select("*").gte("booking_date", start).lte("booking_date", end),
			supabase.from("scan_service_settings").select("*").order("day_of_week"),
			isStaff ? supabase.from("profiles").select("id, name").in("role", ["dentist", "laboratory"]).eq("is_active", true).order("name") : Promise.resolve({ data: [] }),
			supabase.from("scan_service_blocks").select("*")
		]);
		if (bookRes.data) setBookings(bookRes.data.map((b) => ({
			...b,
			profiles: { name: b.dentist_name }
		})));
		if (setRes.data) {
			setSettings(setRes.data);
			setConfigSettings(JSON.parse(JSON.stringify(setRes.data)));
		}
		if (dentRes.data) setDentists(dentRes.data);
		if (blockRes.data) setBlocks(blockRes.data);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		if (!isAdmin && !scanServiceEnabled) return;
		fetchAgenda();
	}, [
		format(startOfMonth(currentDate), "yyyy-MM"),
		isStaff,
		isAdmin,
		scanServiceEnabled
	]);
	if (!isAdmin && !scanServiceEnabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/app",
		replace: true
	});
	const handleOpenBooking = (slot, booking) => {
		if (booking) {
			if (!isStaff && booking.dentist_id !== currentUser?.id) return;
			setFormData({
				dentist_id: booking.dentist_id,
				patient_name: booking.patient_name,
				booking_date: booking.booking_date,
				start_time: booking.start_time.substring(0, 5),
				end_time: booking.end_time.substring(0, 5),
				notes: booking.notes || ""
			});
			setModal({
				open: true,
				mode: "edit",
				booking
			});
		} else {
			setFormData({
				dentist_id: isStaff ? "" : currentUser?.id || "",
				patient_name: "",
				booking_date: slot ? slot.date : format(currentDate, "yyyy-MM-dd"),
				start_time: slot ? slot.start : "08:00",
				end_time: slot ? slot.end : "09:00",
				notes: ""
			});
			setModal({
				open: true,
				mode: "create",
				booking: null
			});
		}
	};
	const handleSaveBooking = async () => {
		if (!formData.patient_name || !formData.booking_date || !formData.start_time || !formData.end_time || !formData.dentist_id) return toast({
			title: "Preencha os campos obrigatórios",
			variant: "destructive"
		});
		if (formData.start_time >= formData.end_time) return toast({
			title: "O horário de fim deve ser após o início",
			variant: "destructive"
		});
		if (checkBookingOverlap(formData.start_time, formData.end_time, formData.booking_date, bookings, modal.booking?.id)) return toast({
			title: "Horário Indisponível",
			description: "Já existe um agendamento neste horário.",
			variant: "destructive"
		});
		if (checkBlockOverlap(formData.start_time, formData.end_time, formData.booking_date, blocks)) return toast({
			title: "Horário Indisponível",
			description: "O serviço está bloqueado administrativamente.",
			variant: "destructive"
		});
		setSaving(true);
		const payload = { ...formData };
		if (modal.mode === "edit") {
			await supabase.from("scan_service_bookings").update(payload).eq("id", modal.booking.id);
			toast({ title: "Agendamento atualizado!" });
		} else {
			await supabase.from("scan_service_bookings").insert(payload);
			toast({ title: "Agendamento confirmado!" });
		}
		setSaving(false);
		setModal({
			open: false,
			mode: "create",
			booking: null
		});
		fetchAgenda();
	};
	const handleDeleteBooking = async () => {
		if (!confirm("Deseja excluir este agendamento?")) return;
		setSaving(true);
		await supabase.from("scan_service_bookings").delete().eq("id", modal.booking.id);
		toast({ title: "Agendamento excluído!" });
		setSaving(false);
		setModal({
			open: false,
			mode: "create",
			booking: null
		});
		fetchAgenda();
	};
	const handleAddBlock = async () => {
		if (!blockForm.block_date && blockForm.recurrence !== "daily") return toast({
			title: "Selecione a data",
			variant: "destructive"
		});
		if (blockForm.start_time >= blockForm.end_time) return toast({
			title: "Horários inválidos",
			variant: "destructive"
		});
		setSavingBlock(true);
		const { error } = await supabase.from("scan_service_blocks").insert({
			start_time: blockForm.start_time + ":00",
			end_time: blockForm.end_time + ":00",
			block_date: blockForm.block_date || null,
			recurrence: blockForm.recurrence
		});
		setSavingBlock(false);
		if (error) toast({
			title: "Erro ao criar bloqueio",
			description: error.message,
			variant: "destructive"
		});
		else {
			toast({ title: "Bloqueio criado!" });
			fetchAgenda();
		}
	};
	const handleDeleteBlock = async (id) => {
		if (!confirm("Deseja remover este bloqueio?")) return;
		await supabase.from("scan_service_blocks").delete().eq("id", id);
		toast({ title: "Bloqueio removido!" });
		fetchAgenda();
	};
	const handleSaveSettings = async () => {
		setSavingSettings(true);
		for (const s of configSettings) await supabase.from("scan_service_settings").update({
			is_available: s.is_available,
			start_time: s.start_time,
			end_time: s.end_time,
			slot_duration_minutes: s.slot_duration_minutes
		}).eq("id", s.id);
		toast({ title: "Configurações salvas!" });
		setSavingSettings(false);
		setSettingsModalOpen(false);
		fetchAgenda();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-[1600px] mx-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl md:text-4xl font-black text-[#1A233A] tracking-tighter uppercase",
					children: "Agenda e Pedidos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs md:text-sm font-bold text-slate-500 uppercase mt-1 tracking-wide",
					children: "Gerencie compromissos e acompanhe pedidos delegados."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setSettingsModalOpen(true),
						className: "text-slate-600 font-bold uppercase text-xs h-11 px-4 gap-2 bg-white border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors",
						title: "Configurações",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-4 h-4" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Configs"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setBlockModal({ open: true }),
						className: "text-[#E11D48] border-[#E11D48]/20 hover:bg-[#E11D48]/10 font-bold uppercase text-xs h-11 px-5 gap-2 bg-white shadow-sm transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "w-4 h-4" }), " Bloqueio de Agendamentos"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => handleOpenBooking(),
						className: "bg-[#E11D48] text-white hover:bg-[#BE123C] font-bold uppercase text-xs h-11 px-6 gap-2 shadow-sm transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " Novo Registro"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full flex-1 min-h-0 pb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSidebar, {
					currentDate,
					setCurrentDate,
					bookings,
					isStaff,
					currentUserId: currentUser?.id,
					filters
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanHeader, {
						view,
						setView,
						activeTab,
						setActiveTab,
						filters,
						setFilters,
						dentists,
						isStaff
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 bg-slate-50/30 p-4 md:p-6 flex flex-col min-h-[400px]",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-[#1A233A]" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanCalendarViews, {
							view,
							currentDate,
							bookings,
							blocks,
							settings,
							filters,
							isStaff,
							currentUserId: currentUser?.id,
							activeTab,
							onSlotClick: (date, start, end) => handleOpenBooking({
								date,
								start,
								end
							}),
							onBookingClick: (b) => handleOpenBooking(null, b),
							setCurrentDate,
							setView
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingModal, {
				open: modal.open,
				mode: modal.mode,
				formData,
				setFormData,
				saving,
				onClose: () => setModal({
					...modal,
					open: false
				}),
				onSave: handleSaveBooking,
				onDelete: handleDeleteBooking,
				dentists,
				isStaff
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockModal, {
				open: blockModal.open,
				form: blockForm,
				setForm: setBlockForm,
				saving: savingBlock,
				onClose: () => setBlockModal({ open: false }),
				onSave: handleAddBlock,
				blocks,
				onDelete: handleDeleteBlock
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSettingsModal, {
				open: settingsModalOpen,
				settings: configSettings,
				setSettings: setConfigSettings,
				saving: savingSettings,
				onClose: () => setSettingsModalOpen(false),
				onSave: handleSaveSettings
			})
		]
	});
}
export { ScanService as default };

//# sourceMappingURL=ScanService-BtqNIaR4.js.map