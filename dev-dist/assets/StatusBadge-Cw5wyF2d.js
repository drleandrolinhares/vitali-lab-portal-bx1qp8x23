import { t as CircleCheck } from "./circle-check-BbXs9TFW.js";
import { t as Clock } from "./clock-C6MMj7sx.js";
import { St as require_jsx_runtime, at as createLucideIcon, tt as cn, zt as __toESM } from "./index-DQXy234v.js";
import { t as Badge } from "./badge-DpojsJIH.js";
var PackageCheck = createLucideIcon("package-check", [
	["path", {
		d: "m16 16 2 2 4-4",
		key: "gfu2re"
	}],
	["path", {
		d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
		key: "e7tb2h"
	}],
	["path", {
		d: "m7.5 4.27 9 5.15",
		key: "1c824w"
	}],
	["polyline", {
		points: "3.29 7 12 12 20.71 7",
		key: "ousv84"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "22",
		y2: "12",
		key: "a4e8g8"
	}]
]);
var Wrench = createLucideIcon("wrench", [["path", {
	d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
	key: "1ngwbx"
}]]);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var config = {
	pending: {
		label: "Pendente",
		icon: Clock,
		className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20"
	},
	in_production: {
		label: "Em Produção",
		icon: Wrench,
		className: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
	},
	completed: {
		label: "Finalizado",
		icon: CircleCheck,
		className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
	},
	delivered: {
		label: "Entregue",
		icon: PackageCheck,
		className: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-500/20"
	}
};
function StatusBadge({ status, className }) {
	const { label, icon: Icon, className: variantClass } = config[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "outline",
		className: cn("gap-1 font-medium", variantClass, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5" }), label]
	});
}
export { StatusBadge as t };

//# sourceMappingURL=StatusBadge-Cw5wyF2d.js.map