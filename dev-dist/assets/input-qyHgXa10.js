import { It as require_react, St as require_jsx_runtime, tt as cn, zt as __toESM } from "./index-y3_FFPhO.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var Input = import_react.forwardRef(({ className, type, onChange, ...props }, ref) => {
	const handleChange = (e) => {
		if (!(className?.includes("normal-case") || false) && type !== "password" && type !== "email" && type !== "url") {
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;
			const val = e.target.value;
			const upper = val.toUpperCase();
			if (val !== upper) {
				e.target.value = upper;
				if (start !== null && end !== null && (type === "text" || type === void 0 || type === "search" || type === "tel")) try {
					e.target.setSelectionRange(start, end);
				} catch (err) {}
			}
		}
		if (onChange) onChange(e);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", !className?.includes("normal-case") && type !== "password" && type !== "email" && type !== "url" && "uppercase", className),
		ref,
		onChange: handleChange,
		...props
	});
});
Input.displayName = "Input";
export { Input as t };

//# sourceMappingURL=input-qyHgXa10.js.map