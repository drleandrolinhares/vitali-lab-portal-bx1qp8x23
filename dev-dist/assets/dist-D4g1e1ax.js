import { It as require_react, St as require_jsx_runtime, zt as __toESM } from "./index-DV4m2exc.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
require_jsx_runtime();
var DirectionContext = import_react.createContext(void 0);
function useDirection(localDir) {
	const globalDir = import_react.useContext(DirectionContext);
	return localDir || globalDir || "ltr";
}
export { useDirection as t };

//# sourceMappingURL=dist-D4g1e1ax.js.map