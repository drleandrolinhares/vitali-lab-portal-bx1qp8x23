import { St as require_jsx_runtime, tt as cn, zt as __toESM } from "./index-SUJJ9Lwf.js";
var vitalli_03_4bb8e_default = "/assets/vitalli-03-4bb8e-DxldsgJG.png";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Logo({ className, variant = "default", size = "lg" }) {
	if (variant === "square") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col items-center justify-center bg-primary shrink-0 shadow-md overflow-hidden border border-primary/20", size === "sm" ? "w-20 h-20 rounded-xl" : size === "xl" ? "w-40 h-40 rounded-3xl" : "w-28 h-28 rounded-2xl", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: vitalli_03_4bb8e_default,
			alt: "Vitali Lab Logo",
			className: "w-full h-full object-contain scale-[1.85]"
		})
	});
	const sizes = {
		sm: {
			wrapper: "text-lg gap-1.5",
			icon: "w-6 h-6 rounded",
			textGap: "gap-0.5"
		},
		lg: {
			wrapper: "text-xl gap-2",
			icon: "w-8 h-8 rounded-md",
			textGap: "gap-1"
		},
		xl: {
			wrapper: "text-4xl gap-3",
			icon: "w-14 h-14 rounded-xl",
			textGap: "gap-1.5"
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center font-display tracking-tight", sizes[size].wrapper, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex flex-col items-center justify-center bg-primary shrink-0 shadow-sm overflow-hidden border border-primary/20", sizes[size].icon),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: vitalli_03_4bb8e_default,
				alt: "Vitali Lab Logo",
				className: "w-full h-full object-contain scale-[1.85]"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-center", sizes[size].textGap),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-extrabold text-foreground uppercase",
				children: "Vitali"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-light text-foreground/80 lowercase",
				children: "lab."
			})]
		})]
	});
}
export { Logo as t };

//# sourceMappingURL=Logo-CBQQUDDw.js.map