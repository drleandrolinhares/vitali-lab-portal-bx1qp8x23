import { t as EyeOff } from "./eye-off-BdWDQvsZ.js";
import { t as Eye } from "./eye-ClejEReL.js";
import { t as ShieldAlert } from "./shield-alert-Dmx-8Orc.js";
import { Dt as useToast, It as require_react, Mt as useNavigate, St as require_jsx_runtime, a as useAppStore, jt as useLocation, t as Button, z as useAuth, zt as __toESM } from "./index-B36margM.js";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-DHa3Ekeu.js";
import { t as Input } from "./input-DXaEaBh2.js";
import { t as Label } from "./label-0oNdCLFk.js";
import { t as Checkbox } from "./checkbox-DebFnKEm.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var PasswordInput = ({ id, value, onChange, showPassword, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "relative",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		id,
		type: showPassword ? "text" : "password",
		value,
		onChange,
		required: true,
		minLength: 6,
		className: "normal-case pr-10"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "ghost",
		size: "icon",
		className: "absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground",
		onClick: onToggle,
		children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
	})]
});
function AuthPage() {
	const { signIn, resetPassword, session } = useAuth();
	const { currentUser } = useAppStore();
	const { toast: toast$1 } = useToast();
	const location = useLocation();
	const navigate = useNavigate();
	const isAdminView = location.pathname === "/dashboard";
	(0, import_react.useEffect)(() => {
		if (session && currentUser) if (currentUser.role === "admin" || currentUser.role === "master") navigate("/dashboard", { replace: true });
		else navigate("/app", { replace: true });
	}, [
		session,
		currentUser,
		navigate
	]);
	const [view, setView] = (0, import_react.useState)("login");
	const [loginId, setLoginId] = (0, import_react.useState)("");
	const [forgotId, setForgotId] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [rememberMe, setRememberMe] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const handleAction = async (e, action) => {
		e.preventDefault();
		setError("");
		setMessage("");
		setLoading(true);
		sessionStorage.setItem("vitali_just_logged_in", "true");
		try {
			const { error: actionError } = await action();
			if (actionError) {
				sessionStorage.removeItem("vitali_just_logged_in");
				let errorMessage = actionError.message;
				if (errorMessage === "Invalid login credentials" || errorMessage.includes("invalid_credentials")) errorMessage = "Credenciais de login inválidas. E-mail ou senha incorretos.";
				setError(errorMessage);
				toast$1({
					variant: "destructive",
					title: "Atenção",
					description: errorMessage
				});
				setLoading(false);
			} else setMessage("Acesso autorizado. Redirecionando...");
		} catch (err) {
			sessionStorage.removeItem("vitali_just_logged_in");
			const errorMessage = err?.message || "Ocorreu um erro inesperado ao tentar acessar.";
			setError(errorMessage);
			toast$1({
				variant: "destructive",
				title: "Erro de Sistema",
				description: errorMessage
			});
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-muted/30 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md shadow-elevation border-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "space-y-4 items-center text-center pb-8 bg-white pt-10 rounded-t-lg",
				children: [isAdminView ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center mb-2 bg-slate-900 text-white p-4 rounded-full shadow-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-8 h-8" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2 font-display tracking-tight text-4xl md:text-5xl mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-extrabold text-primary",
						children: "VITALI"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-light text-primary",
						children: "LAB"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-xl md:text-2xl font-bold tracking-tight text-primary",
						children: isAdminView ? "PAINEL ADMINISTRATIVO" : "REQUISIÇÃO DIGITAL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-base",
						children: isAdminView ? "Acesso restrito" : "Acesse o portal do laboratório"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-6 bg-card rounded-b-lg border-t border-border",
				children: [view === "forgot_password" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: async (e) => {
						e.preventDefault();
						setError("");
						setMessage("");
						setLoading(true);
						if (!forgotId.includes("@")) {
							setError("Formato de email inválido.");
							toast$1({
								variant: "destructive",
								title: "Atenção",
								description: "Formato de email inválido."
							});
							setLoading(false);
							return;
						}
						try {
							const { error: resetError } = await resetPassword(forgotId);
							if (resetError) {
								setError(resetError.message);
								toast$1({
									variant: "destructive",
									title: "Erro",
									description: resetError.message
								});
							} else {
								setMessage("E-mail de recuperação enviado com sucesso.");
								toast$1({
									title: "Sucesso",
									description: "E-mail de recuperação enviado com sucesso."
								});
							}
						} catch (err) {
							setError(err.message || "Erro ao enviar recuperação");
							toast$1({
								variant: "destructive",
								title: "Erro",
								description: err.message || "Erro ao enviar recuperação"
							});
						} finally {
							setLoading(false);
						}
					},
					className: "space-y-4 animate-fade-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "reset-id",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "reset-id",
								type: "email",
								placeholder: "Ex: joao@email.com",
								value: forgotId,
								onChange: (e) => setForgotId(e.target.value),
								required: true,
								className: "normal-case"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-red-500 font-medium",
							children: error
						}),
						message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-green-600 font-medium",
							children: message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: loading,
							className: "w-full",
							children: "Enviar Recuperação"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							className: "w-full",
							onClick: () => setView("login"),
							children: "Voltar para Login"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => handleAction(e, async () => {
						if (!loginId.includes("@")) return { error: /* @__PURE__ */ new Error("Formato de email inválido.") };
						return await signIn(loginId, password, rememberMe);
					}),
					className: "space-y-4 animate-fade-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								placeholder: "Ex: joao@email.com",
								value: loginId,
								onChange: (e) => setLoginId(e.target.value),
								required: true,
								className: "normal-case"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Senha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "link",
									className: "p-0 h-auto text-xs",
									onClick: () => setView("forgot_password"),
									children: "Esqueci minha senha"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
								id: "login-password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								showPassword,
								onToggle: () => setShowPassword(!showPassword)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center space-x-2 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								id: "remember",
								checked: rememberMe,
								onCheckedChange: (c) => setRememberMe(c)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "remember",
								className: "text-sm font-normal cursor-pointer text-muted-foreground",
								children: "Permanecer conectado"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-red-500 font-medium",
							children: error
						}),
						message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-green-600 font-medium",
							children: message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: loading,
							children: loading ? "Entrando..." : "Entrar"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 border-t pt-6 flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						className: "text-xs text-muted-foreground hover:text-primary",
						onClick: () => navigate(isAdminView ? "/app" : "/dashboard"),
						children: isAdminView ? "Voltar para Portal" : "Acesso Administrativo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "link",
						size: "sm",
						className: "text-xs text-muted-foreground",
						onClick: () => navigate("/"),
						children: "← Voltar para o Site Institucional"
					})]
				})]
			})]
		})
	});
}
export { AuthPage as default };

//# sourceMappingURL=Auth-BM1M196d.js.map