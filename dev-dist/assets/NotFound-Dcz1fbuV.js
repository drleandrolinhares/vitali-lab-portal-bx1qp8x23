import { It as require_react, St as require_jsx_runtime, jt as useLocation, zt as __toESM } from "./index-BQqMl_rO.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var NotFound = () => {
	const location = useLocation();
	(0, import_react.useEffect)(() => {
		console.error("404 Error: User attempted to access non-existent route:", location.pathname);
	}, [location.pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-gray-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-bold mb-4",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xl text-gray-600 mb-4",
					children: "Oops! Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "text-blue-500 hover:text-blue-700 underline",
					children: "Return to Home"
				})
			]
		})
	});
};
var NotFound_default = NotFound;
export { NotFound_default as default };

//# sourceMappingURL=NotFound-Dcz1fbuV.js.map