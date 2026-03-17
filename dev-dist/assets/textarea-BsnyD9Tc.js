import { It as require_react, St as require_jsx_runtime, tt as cn, zt as __toESM } from "./index-DBUHfinl.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var Textarea = import_react.forwardRef(({ className, onChange, ...props }, ref) => {
	const handleChange = (e) => {
		const start = e.target.selectionStart;
		const end = e.target.selectionEnd;
		const val = e.target.value;
		const upper = val.toUpperCase();
		if (val !== upper) {
			e.target.value = upper;
			if (start !== null && end !== null) try {
				e.target.setSelectionRange(start, end);
			} catch (err) {}
		}
		if (onChange) onChange(e);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm uppercase", className),
		ref,
		onChange: handleChange,
		...props
	});
});
Textarea.displayName = "Textarea";
export { Textarea as t };

//# sourceMappingURL=textarea-BsnyD9Tc.js.map