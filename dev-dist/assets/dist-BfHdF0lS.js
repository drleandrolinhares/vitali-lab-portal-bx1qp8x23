import { Ft as require_react_dom, It as require_react, St as require_jsx_runtime, i as createSlot, zt as __toESM } from "./index-DQXy234v.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
require_react_dom();
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var Primitive = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((primitive, node) => {
	const Slot = createSlot(`Primitive.${node}`);
	const Node = import_react.forwardRef((props, forwardedRef) => {
		const { asChild, ...primitiveProps } = props;
		const Comp = asChild ? Slot : node;
		if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
			...primitiveProps,
			ref: forwardedRef
		});
	});
	Node.displayName = `Primitive.${node}`;
	return {
		...primitive,
		[node]: Node
	};
}, {});
export { Primitive as t };

//# sourceMappingURL=dist-BfHdF0lS.js.map