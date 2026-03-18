import { t as Activity } from "./activity-DR4T-iGW.js";
import { t as Calendar } from "./calendar-DAW7qrlM.js";
import { t as Info } from "./info-CQ2JUd5K.js";
import { t as ShieldCheck } from "./shield-check-B9klf85K.js";
import { t as User } from "./user-ohMPVr1B.js";
import { B as supabase, It as require_react, St as require_jsx_runtime, a as useAppStore, h as format, kt as Navigate, p as ptBR, zt as __toESM } from "./index-CnyIMDQs.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-CEXI0gaQ.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-C3-s0jX2.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function AuditTrail() {
	const { currentUser } = useAppStore();
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (currentUser?.role !== "admin") return;
		const fetchLogs = async () => {
			const { data, error } = await supabase.from("audit_logs").select(`
          *,
          profiles (name)
        `).order("created_at", { ascending: false }).limit(200);
			if (!error && data) setLogs(data);
			setLoading(false);
		};
		fetchLogs();
	}, [currentUser]);
	if (currentUser?.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	const formatAction = (action) => {
		return {
			CREATE: "Criação",
			DELETE: "Exclusão",
			UPDATE_STATUS: "Mudança de Status",
			MOVE_STAGE: "Movimentação Kanban",
			CREATE_STAGE: "Criação de Coluna",
			RENAME_STAGE: "Renomear Coluna",
			DELETE_STAGE: "Exclusão de Coluna",
			UPDATE_OBSERVATIONS: "Observações Atualizadas",
			UPDATE_SETTING: "Configuração Atualizada",
			UPDATE_PROFILE: "Perfil Atualizado"
		}[action] || action;
	};
	const renderDetails = (details) => {
		if (!details || Object.keys(details).length === 0) return "-";
		const items = [];
		if (details.friendlyId) items.push(`Pedido: ${details.friendlyId}`);
		if (details.reason) items.push(`Motivo: ${details.reason}`);
		if (details.status) items.push(`Novo Status: ${details.status}`);
		if (details.to) items.push(`Destino: ${details.to}`);
		if (items.length > 0) return items.join(" | ");
		return JSON.stringify(details).substring(0, 60) + (JSON.stringify(details).length > 60 ? "..." : "");
	};
	const getActionColor = (action) => {
		if (action.includes("DELETE")) return "text-destructive bg-destructive/10";
		if (action.includes("CREATE")) return "text-emerald-600 bg-emerald-500/10";
		return "text-blue-600 bg-blue-500/10";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto animate-fade-in pb-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-2xl font-bold tracking-tight text-primary flex items-center gap-2 uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-6 h-6" }), " Log de Auditoria"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-1",
				children: "Registro de segurança com histórico de ações sistêmicas."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-subtle",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "bg-muted/10 pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-primary" }), " Histórico Recente (últimos 200 eventos)"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center h-48 text-muted-foreground animate-pulse",
					children: "Carregando auditoria..."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[180px]",
						children: "Data / Hora"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[200px]",
						children: "Usuário"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[180px]",
						children: "Ação"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Detalhes" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-xs text-muted-foreground whitespace-nowrap flex flex-col gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 font-medium text-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3 h-3" }), format(new Date(log.created_at), "dd MMM yyyy", { locale: ptBR })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pl-4.5",
								children: format(new Date(log.created_at), "HH:mm:ss")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-slate-400" }), log.profiles?.name || "Desconhecido"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getActionColor(log.action)}`,
							children: formatAction(log.action)
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm text-slate-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 mt-0.5 text-slate-400 shrink-0 hidden sm:block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "break-words line-clamp-2",
									title: renderDetails(log.details),
									children: renderDetails(log.details)
								})]
							})
						})
					]
				}, log.id)), logs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 4,
					className: "h-32 text-center text-muted-foreground",
					children: "Nenhum registro encontrado."
				}) })] })] })
			})]
		})]
	});
}
export { AuditTrail as default };

//# sourceMappingURL=AuditTrail-Bfnv99d0.js.map