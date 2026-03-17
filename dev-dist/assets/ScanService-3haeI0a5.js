import { t as Calendar$1 } from "./calendar-CPMvUPBC.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-E1jAkS4v.js";
import { c as addDays, l as ChevronLeft, n as isBefore, o as isSameDay, s as addWeeks, t as Calendar } from "./calendar-_2aIQu62.js";
import { t as ChevronRight } from "./chevron-right-DimR98uc.js";
import { t as Clock } from "./clock-BPy4iyyd.js";
import { t as LoaderCircle } from "./loader-circle-DJxRpB2j.js";
import { t as Plus } from "./plus-BNc8WgSW.js";
import { t as RefreshCw } from "./refresh-cw-6Za83O2M.js";
import { t as ScanLine } from "./scan-line-Bz1wMLoE.js";
import { t as Trash2 } from "./trash-2-DnpB_Ow3.js";
import { A as startOfISOWeek, B as supabase, C as enUS, Et as toast, F as constructFrom, I as millisecondsInHour, It as require_react, L as millisecondsInMinute, M as getDefaultOptions$1, Ot as Link, P as toDate, R as millisecondsInSecond, S as getISOWeek, St as require_jsx_runtime, _ as isProtectedWeekYearToken, a as useAppStore, b as getWeek, g as isProtectedDayOfYearToken, h as format, j as startOfWeek, k as getTimezoneOffsetInMilliseconds, kt as Navigate, p as ptBR, t as Button, tt as cn, v as warnOrThrowProtectedError, x as getWeekYear, y as longFormatters, zt as __toESM } from "./index-BQqMl_rO.js";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-DorPhryw.js";
import { t as Input } from "./input-G5C5PVB0.js";
import { t as Label } from "./label-BsyUqq9S.js";
import "./es2015-CgSSirzl.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-0jUvLQbc.js";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-CILmIXbF.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-YxPXtsFd.js";
import { t as Switch } from "./switch-BPzhFEFC.js";
import { t as Textarea } from "./textarea-BQTLB0if.js";
function addMinutes(date, amount, options) {
	const _date = toDate(date, options?.in);
	_date.setTime(_date.getTime() + amount * millisecondsInMinute);
	return _date;
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
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function ScanService() {
	const { currentUser, appSettings } = useAppStore();
	const [currentDate, setCurrentDate] = (0, import_react.useState)(/* @__PURE__ */ new Date());
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
	const [configSettings, setConfigSettings] = (0, import_react.useState)([]);
	const [savingConfig, setSavingConfig] = (0, import_react.useState)(false);
	const [blockForm, setBlockForm] = (0, import_react.useState)({
		block_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
		start_time: "08:00",
		end_time: "12:00",
		recurrence: "unique"
	});
	const [savingBlock, setSavingBlock] = (0, import_react.useState)(false);
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
	const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
	const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
	const fetchAgenda = async () => {
		setLoading(true);
		const start = format(days[0], "yyyy-MM-dd");
		const end = format(days[6], "yyyy-MM-dd");
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
		if (setRes.data) setSettings(setRes.data);
		if (dentRes.data) setDentists(dentRes.data);
		if (blockRes.data) setBlocks(blockRes.data);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		if (!isAdmin && !scanServiceEnabled) return;
		fetchAgenda();
	}, [
		currentDate,
		isStaff,
		isAdmin,
		scanServiceEnabled
	]);
	(0, import_react.useEffect)(() => {
		if (settings.length > 0) setConfigSettings([...settings]);
	}, [settings]);
	if (!isAdmin && !scanServiceEnabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/app",
		replace: true
	});
	const checkBlockOverlap = (slotStart, slotEnd, dateStr) => {
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
	const handleOpenModal = (slot, booking) => {
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
		} else if (slot) {
			setFormData({
				dentist_id: isStaff ? "" : currentUser?.id || "",
				patient_name: "",
				booking_date: slot.date,
				start_time: slot.start,
				end_time: slot.end,
				notes: ""
			});
			setModal({
				open: true,
				mode: "create",
				booking: null
			});
		} else {
			setFormData({
				dentist_id: isStaff ? "" : currentUser?.id || "",
				patient_name: "",
				booking_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
				start_time: "08:00",
				end_time: "09:00",
				notes: ""
			});
			setModal({
				open: true,
				mode: "create",
				booking: null
			});
		}
	};
	const checkOverlap = (start, end, date, excludeId) => {
		return bookings.filter((b) => b.booking_date === date && b.id !== excludeId).some((b) => b.start_time.substring(0, 5) < end && b.end_time.substring(0, 5) > start);
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
		if (checkOverlap(formData.start_time, formData.end_time, formData.booking_date, modal.booking?.id)) return toast({
			title: "Horário Indisponível",
			description: "Já existe um agendamento neste horário.",
			variant: "destructive"
		});
		if (checkBlockOverlap(formData.start_time, formData.end_time, formData.booking_date)) return toast({
			title: "Horário Indisponível",
			description: "O serviço está bloqueado administrativamente neste horário.",
			variant: "destructive"
		});
		setSaving(true);
		const payload = {
			dentist_id: formData.dentist_id,
			patient_name: formData.patient_name,
			booking_date: formData.booking_date,
			start_time: formData.start_time,
			end_time: formData.end_time,
			notes: formData.notes
		};
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
	const generateTimeSlots = (setting) => {
		const slots = [];
		if (!setting || !setting.is_available) return slots;
		let current = parse(setting.start_time, "HH:mm:ss", /* @__PURE__ */ new Date());
		const end = parse(setting.end_time, "HH:mm:ss", /* @__PURE__ */ new Date());
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
	const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
	const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
	const handleSaveConfig = async () => {
		setSavingConfig(true);
		for (const s of configSettings) await supabase.from("scan_service_settings").update({
			is_available: s.is_available,
			start_time: s.start_time,
			end_time: s.end_time,
			slot_duration_minutes: s.slot_duration_minutes
		}).eq("id", s.id);
		toast({ title: "Configurações salvas!" });
		setSavingConfig(false);
		fetchAgenda();
	};
	const handleAddBlock = async () => {
		if (!blockForm.block_date && blockForm.recurrence !== "daily") return toast({
			title: "Selecione a data de referência.",
			variant: "destructive"
		});
		if (blockForm.start_time >= blockForm.end_time) return toast({
			title: "O horário de fim deve ser após o início.",
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
			toast({ title: "Bloqueio criado com sucesso!" });
			fetchAgenda();
		}
	};
	const handleDeleteBlock = async (id) => {
		if (!confirm("Deseja remover este bloqueio?")) return;
		await supabase.from("scan_service_blocks").delete().eq("id", id);
		fetchAgenda();
		toast({ title: "Bloqueio removido com sucesso!" });
	};
	const recurrenceLabels = {
		unique: "Único",
		daily: "Diário",
		weekly: "Semanal",
		monthly: "Mensal"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-7xl mx-auto animate-fade-in pb-12 print:max-w-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 bg-primary/10 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "w-6 h-6 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-primary uppercase",
						children: "Scan Service"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Agende e gerencie o serviço de escaneamento intraoral."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2 w-full sm:w-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/new-request?type=adjustment",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }),
								"Retorno ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden md:inline",
									children: "para Ajustes"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => handleOpenModal(),
						className: "gap-2 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " Nova Reserva"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden print:block mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold",
					children: "Agenda Scan Service"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground",
					children: [
						"Semana: ",
						format(days[0], "dd/MM/yyyy"),
						" a ",
						format(days[6], "dd/MM/yyyy")
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "agenda",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "mb-4 print:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "agenda",
							className: "uppercase text-xs font-bold tracking-wider",
							children: "Agenda Semanal"
						}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "config",
							className: "uppercase text-xs font-bold tracking-wider",
							children: "Configurações"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "agenda",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-subtle border-muted/60 overflow-hidden print:shadow-none print:border-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "bg-muted/30 border-b pb-4 flex flex-row items-center justify-between print:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "icon",
											onClick: prevWeek,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center min-w-[150px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-lg uppercase",
												children: format(weekStart, "MMMM yyyy", { locale: ptBR })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													format(days[0], "dd/MM"),
													" - ",
													format(days[6], "dd/MM")
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "icon",
											onClick: nextWeek,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setCurrentDate(/* @__PURE__ */ new Date()),
									className: "text-xs uppercase font-bold",
									children: "Hoje"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-0 overflow-x-auto print:overflow-visible",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-64 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-w-[900px] grid grid-cols-7 divide-x divide-border print:min-w-full",
									children: days.map((day, idx) => {
										const isToday = isSameDay(day, /* @__PURE__ */ new Date());
										const dateStr = format(day, "yyyy-MM-dd");
										const dayBookings = bookings.filter((b) => b.booking_date === dateStr);
										const setting = settings.find((s) => s.day_of_week === day.getDay());
										const slots = setting ? generateTimeSlots(setting) : [];
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: cn("flex flex-col print:border-r", isToday && "bg-primary/5"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: cn("p-3 text-center border-b border-border", isToday && "border-primary/20 bg-primary/10"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: cn("text-xs font-bold uppercase", isToday ? "text-primary" : "text-muted-foreground print:text-black"),
													children: format(day, "EEEE", { locale: ptBR })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: cn("text-xl font-black mt-1", isToday ? "text-primary" : "text-foreground print:text-black"),
													children: format(day, "dd")
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "p-2 space-y-2 flex-1 min-h-[400px]",
												children: !setting?.is_available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full flex items-center justify-center text-xs text-muted-foreground uppercase text-center opacity-50 p-4 font-bold border-2 border-dashed border-border rounded-lg bg-muted/20 print:border-none",
													children: "Fechado"
												}) : slots.map((slot, sIdx) => {
													if (checkBlockOverlap(slot.start, slot.end, dateStr)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														title: "Bloqueio Administrativo",
														className: "text-[10px] p-2 rounded-md shadow-sm bg-slate-800 text-white flex items-center justify-center text-center font-bold uppercase leading-tight cursor-not-allowed opacity-90 print:hidden",
														children: [
															"Indisponível",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
															"Neste Horário"
														]
													}, sIdx);
													const overlappingBooking = dayBookings.find((b) => b.start_time.substring(0, 5) < slot.end && b.end_time.substring(0, 5) > slot.start);
													if (overlappingBooking) {
														const isMine = overlappingBooking.dentist_id === currentUser?.id;
														const canViewDetails = isStaff || isMine;
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															onClick: () => {
																if (canViewDetails) handleOpenModal(null, overlappingBooking);
															},
															className: cn("text-xs p-2 rounded-md border shadow-sm select-none transition-colors relative group print:shadow-none print:border-black", canViewDetails ? "bg-primary/10 text-primary-foreground border-primary/20 cursor-pointer hover:bg-primary/20" : "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-80"),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-md", canViewDetails ? "bg-primary" : "bg-slate-400") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "pl-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																		className: "font-bold text-foreground flex items-center gap-1 mb-0.5",
																		children: [
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 opacity-70" }),
																			slot.start,
																			" - ",
																			slot.end
																		]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																		className: "font-semibold text-slate-800 truncate",
																		children: canViewDetails ? overlappingBooking.patient_name : "OCUPADO"
																	}),
																	canViewDetails && isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																		className: "truncate text-slate-500 text-[10px] mt-0.5 font-medium uppercase",
																		children: overlappingBooking.profiles?.name
																	})
																]
															})]
														}, sIdx);
													}
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														onClick: () => handleOpenModal({
															date: dateStr,
															start: slot.start,
															end: slot.end
														}),
														className: "text-xs p-2 rounded-md border border-dashed border-border bg-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/30 hover:text-primary cursor-pointer transition-colors text-center font-medium print:hidden",
														children: [
															slot.start,
															" - ",
															slot.end
														]
													}, sIdx);
												})
											})]
										}, idx);
									})
								})
							})]
						})
					}),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "config",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-subtle max-w-4xl mx-auto mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "uppercase",
									children: "Horários de Atendimento"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Configure os dias e horários em que o serviço de Scan está disponível." })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "space-y-4",
									children: configSettings.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "w-full sm:w-32 flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												checked: s.is_available,
												onCheckedChange: (v) => {
													const newArr = [...configSettings];
													newArr[idx].is_available = v;
													setConfigSettings(newArr);
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
															const newArr = [...configSettings];
															newArr[idx].start_time = e.target.value + ":00";
															setConfigSettings(newArr);
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
															const newArr = [...configSettings];
															newArr[idx].end_time = e.target.value + ":00";
															setConfigSettings(newArr);
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
														placeholder: "Minutos",
														value: s.slot_duration_minutes,
														onChange: (e) => {
															const newArr = [...configSettings];
															newArr[idx].slot_duration_minutes = parseInt(e.target.value) || 60;
															setConfigSettings(newArr);
														}
													})]
												})
											]
										})]
									}, s.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
									className: "bg-muted/20 border-t py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveConfig,
										disabled: savingConfig,
										className: "ml-auto",
										children: [savingConfig ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null, "Salvar Configurações"]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-subtle max-w-4xl mx-auto border-slate-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "bg-slate-50/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "uppercase text-slate-800",
									children: "Bloquear Agendamentos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Defina horários indisponíveis para o serviço de Scan (ex: Almoço, Manutenções, Feriados)." })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-5 gap-4 items-end mb-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 sm:col-span-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase text-[10px] font-bold text-slate-500",
												children: "Recorrência"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: blockForm.recurrence,
												onValueChange: (v) => setBlockForm({
													...blockForm,
													recurrence: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "unique",
														children: "Data Única"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "daily",
														children: "Diário (Todos os dias)"
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
											className: "space-y-2 sm:col-span-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase text-[10px] font-bold text-slate-500",
												children: "Data Base"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "outline",
													className: cn("w-full justify-start text-left font-normal bg-background px-3", !blockForm.block_date && "text-muted-foreground"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, { className: "mr-2 h-4 w-4 opacity-50" }), blockForm.block_date ? format(/* @__PURE__ */ new Date(blockForm.block_date + "T00:00:00"), "dd/MM/yyyy") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Selecione" })]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
												className: "w-auto p-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
													mode: "single",
													selected: blockForm.block_date ? /* @__PURE__ */ new Date(blockForm.block_date + "T00:00:00") : void 0,
													onSelect: (d) => d && setBlockForm({
														...blockForm,
														block_date: format(d, "yyyy-MM-dd")
													}),
													initialFocus: true
												})
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 sm:col-span-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase text-[10px] font-bold text-slate-500",
												children: "Hora Início"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "time",
												value: blockForm.start_time,
												onChange: (e) => setBlockForm({
													...blockForm,
													start_time: e.target.value
												}),
												className: "bg-background"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 sm:col-span-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase text-[10px] font-bold text-slate-500",
												children: "Hora Fim"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "time",
												value: blockForm.end_time,
												onChange: (e) => setBlockForm({
													...blockForm,
													end_time: e.target.value
												}),
												className: "bg-background"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "sm:col-span-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: handleAddBlock,
												disabled: savingBlock,
												className: "w-full",
												children: [savingBlock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Adicionar"]
											})
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-bold uppercase text-slate-600 mb-2",
										children: "Bloqueios Ativos"
									}), blocks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-6 text-center text-sm text-slate-400 bg-slate-50 rounded-lg border border-dashed",
										children: "Nenhum bloqueio cadastrado."
									}) : blocks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center bg-white border border-slate-200 p-3 sm:p-4 rounded-lg shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-bold text-slate-800 text-sm flex items-center gap-2",
											children: [
												recurrenceLabels[b.recurrence],
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground font-normal",
													children: "•"
												}),
												b.start_time.substring(0, 5),
												" às ",
												b.end_time.substring(0, 5)
											]
										}), b.recurrence === "daily" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 mt-0.5",
											children: "Todos os dias"
										}) : b.block_date ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-500 mt-0.5 capitalize",
											children: [
												b.recurrence === "unique" && format(/* @__PURE__ */ new Date(b.block_date + "T00:00:00"), "dd/MM/yyyy"),
												b.recurrence === "weekly" && `Toda ${format(/* @__PURE__ */ new Date(b.block_date + "T00:00:00"), "EEEE", { locale: ptBR })}`,
												b.recurrence === "monthly" && `Todo dia ${format(/* @__PURE__ */ new Date(b.block_date + "T00:00:00"), "dd")}`
											]
										}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "text-destructive hover:bg-destructive/10",
											onClick: () => handleDeleteBlock(b.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
										})]
									}, b.id))]
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: modal.open,
				onOpenChange: (o) => !o && setModal({
					...modal,
					open: false
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "uppercase",
							children: modal.mode === "create" ? "Nova Reserva de Scan" : "Detalhes da Reserva"
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
								modal.mode === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "destructive",
									onClick: handleDeleteBooking,
									disabled: saving,
									className: "mr-auto w-full sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 mr-2" }), " Excluir"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setModal({
										...modal,
										open: false
									}),
									className: "w-full sm:w-auto",
									children: "Cancelar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleSaveBooking,
									disabled: saving,
									className: "w-full sm:w-auto",
									children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null, modal.mode === "create" ? "Confirmar Reserva" : "Salvar Alterações"]
								})
							]
						})
					]
				})
			})
		]
	});
}
export { ScanService as default };

//# sourceMappingURL=ScanService-3haeI0a5.js.map