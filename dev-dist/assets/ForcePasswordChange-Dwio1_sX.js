import { t as EyeOff } from "./eye-off-DP97NgCj.js";
import { t as Eye } from "./eye-ChLkWl4j.js";
import { B as supabase, Et as toast, It as require_react, St as require_jsx_runtime, a as useAppStore, t as Button, z as useAuth, zt as __toESM } from "./index-BbgqK6tC.js";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-DrM1Cr9T.js";
import { t as Input } from "./input-Bnvl1qb8.js";
import { t as Label } from "./label-ldh12fQ4.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function ForcePasswordChange() {
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showNewPassword, setShowNewPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [loggingOut, setLoggingOut] = (0, import_react.useState)(false);
	const { updateProfile } = useAppStore();
	const { signOut } = useAuth();
	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			await signOut();
			window.location.href = "/login";
		} catch (error) {
			console.error("Logout error:", error);
			setLoggingOut(false);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast({
				title: "As senhas não coincidem",
				variant: "destructive"
			});
			return;
		}
		if (newPassword.length < 6) {
			toast({
				title: "A senha deve ter pelo menos 6 caracteres",
				variant: "destructive"
			});
			return;
		}
		setLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({ password: newPassword });
			if (error) {
				if (error.code === "same_password" || error.message?.toLowerCase().includes("different from the old") || error.message?.toLowerCase().includes("same password")) {
					toast({
						title: "Aviso",
						description: "A nova senha deve ser diferente da senha atual.",
						variant: "destructive"
					});
					return;
				}
				if (error.message?.includes("Session from session_id claim in JWT does not exist") || error.message?.includes("session_not_found") || error.code === "session_not_found" || error.status === 403) {
					await supabase.auth.signOut();
					toast({
						title: "Sessão Expirada",
						description: "Sua sessão expirou. Por favor, realize o login novamente para alterar sua senha.",
						variant: "destructive"
					});
					window.location.href = "/";
					return;
				}
				toast({
					title: "Erro ao atualizar senha",
					description: error.message,
					variant: "destructive"
				});
			} else {
				await updateProfile({ requires_password_change: false });
				toast({ title: "Senha atualizada com sucesso!" });
			}
		} catch (err) {
			if (err?.code === "same_password" || err?.message?.toLowerCase().includes("different from the old") || err?.message?.toLowerCase().includes("same password")) {
				toast({
					title: "Aviso",
					description: "A nova senha deve ser diferente da senha atual.",
					variant: "destructive"
				});
				return;
			}
			if (err?.message?.includes("Session from session_id claim in JWT does not exist") || err?.message?.includes("session_not_found") || err?.code === "session_not_found" || err?.status === 403) {
				await supabase.auth.signOut();
				toast({
					title: "Sessão Expirada",
					description: "Sua sessão expirou. Por favor, realize o login novamente para alterar sua senha.",
					variant: "destructive"
				});
				window.location.href = "/";
				return;
			}
			toast({
				title: "Erro ao atualizar senha",
				description: err.message || "Ocorreu um erro inesperado.",
				variant: "destructive"
			});
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-muted/30 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md shadow-elevation border-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "space-y-2 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-xl font-bold",
					children: "Atualização de Senha Obrigatória"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Como este é seu primeiro acesso com uma senha temporária, você precisa definir uma nova senha para continuar." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nova Senha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: showNewPassword ? "text" : "password",
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								required: true,
								className: "pr-10 normal-case",
								disabled: loading || loggingOut
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								className: "absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent",
								onClick: () => setShowNewPassword(!showNewPassword),
								disabled: loading || loggingOut,
								children: showNewPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Confirmar Nova Senha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: showConfirmPassword ? "text" : "password",
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								required: true,
								className: "pr-10 normal-case",
								disabled: loading || loggingOut
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								className: "absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent",
								onClick: () => setShowConfirmPassword(!showConfirmPassword),
								disabled: loading || loggingOut,
								children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: loading || loggingOut,
							children: loading ? "Atualizando..." : "Atualizar Senha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full",
							onClick: handleLogout,
							disabled: loading || loggingOut,
							children: loggingOut ? "Saindo..." : "Sair da Conta"
						})]
					})
				]
			}) })]
		})
	});
}
export { ForcePasswordChange as default };

//# sourceMappingURL=ForcePasswordChange-Dwio1_sX.js.map