import { P as toDate } from "./index-DBUHfinl.js";
function getMonth(date, options) {
	return toDate(date, options?.in).getMonth();
}
function getYear(date, options) {
	return toDate(date, options?.in).getFullYear();
}
export { getMonth as n, getYear as t };

//# sourceMappingURL=getYear-Do1zQS8c.js.map