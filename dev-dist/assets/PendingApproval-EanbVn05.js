import { t as ShieldAlert } from "./shield-alert-8P8BOFCu.js";
import { St as require_jsx_runtime, t as Button, z as useAuth, zt as __toESM } from "./index-BbgqK6tC.js";
import { t as Logo } from "./Logo-Ct-0atJV.js";
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function PendingApproval() {
	const { signOut } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md w-full bg-background dark:bg-card p-8 rounded-xl shadow-lg border text-center space-y-8 animate-in fade-in zoom-in-95 duration-500",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: "xl" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-10 h-10" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight",
						children: "Cadastro em Análise"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm leading-relaxed",
						children: "Seu cadastro foi recebido com sucesso e está aguardando aprovação por um administrador do laboratório. Assim que seu acesso for liberado, esta tela será atualizada automaticamente."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => signOut(),
					variant: "outline",
					size: "lg",
					className: "w-full mt-4",
					children: "Sair"
				})
			]
		})
	});
}
export { PendingApproval as default };

//# sourceMappingURL=PendingApproval-EanbVn05.js.map