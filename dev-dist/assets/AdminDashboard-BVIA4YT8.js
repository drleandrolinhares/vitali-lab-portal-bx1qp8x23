import { t as Activity } from "./activity-DR4T-iGW.js";
import { t as ArrowRight } from "./arrow-right-DoYXnZSE.js";
import { t as CircleCheck } from "./circle-check-DTkTHG6Y.js";
import { n as CirclePlus, t as Skeleton } from "./skeleton-3AbBzfJ8.js";
import { t as Clock } from "./clock-MwvMSUmz.js";
import { t as FileText } from "./file-text-CEY4Ytd0.js";
import { t as Inbox } from "./inbox-BvksDGQe.js";
import { t as StatusBadge } from "./StatusBadge-CmHdFDNQ.js";
import { t as RefreshCw } from "./refresh-cw-N5jIp9Tx.js";
import { t as Users } from "./users-CccMrEhc.js";
import { It as require_react, Ot as Link, St as require_jsx_runtime, a as useAppStore, h as format, t as Button, tt as cn, zt as __toESM } from "./index-CnyIMDQs.js";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-CEXI0gaQ.js";
import "./badge-ClTssKJa.js";
import { L as ResponsiveContainer, R as Tooltip, _ as Bar, a as ChartTooltipContent, c as YAxis, l as XAxis, o as BarChart, t as ChartContainer } from "./chart-B7AkFI7f.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function AdminDashboard() {
	const { orders, currentUser, pendingUsers, loading } = useAppStore();
	const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "completed" && o.status !== "cancelled");
	const recentOrders = (0, import_react.useMemo)(() => {
		return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
	}, [orders]);
	const stats = [
		{
			label: "Casos Ativos",
			value: activeOrders.length,
			icon: Activity,
			color: "text-primary"
		},
		{
			label: "Pendentes de Ciente",
			value: orders.filter((o) => !o.isAcknowledged).length,
			icon: Clock,
			color: "text-amber-500"
		},
		{
			label: "Concluídos (Mês)",
			value: orders.filter((o) => (o.status === "completed" || o.status === "delivered") && new Date(o.createdAt).getMonth() === (/* @__PURE__ */ new Date()).getMonth()).length,
			icon: CircleCheck,
			color: "text-emerald-500"
		},
		{
			label: "Aprovações Pendentes",
			value: pendingUsers.length,
			icon: Users,
			color: "text-blue-500"
		}
	];
	const chartData = (0, import_react.useMemo)(() => {
		const last7Days = Array.from({ length: 7 }).map((_, i) => {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - (6 - i));
			return {
				date: format(d, "yyyy-MM-dd"),
				label: format(d, "dd/MM"),
				count: 0
			};
		});
		orders.forEach((o) => {
			const oDate = format(new Date(o.createdAt), "yyyy-MM-dd");
			const day = last7Days.find((d) => d.date === oDate);
			if (day) day.count++;
		});
		return last7Days;
	}, [orders]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 max-w-6xl mx-auto py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-border/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-bold tracking-tight",
					children: "Painel Administrativo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-1 text-lg",
					children: "Visão geral do laboratório e métricas rápidas."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-3 w-full xl:w-auto h-11",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "flex-1 sm:flex-none h-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/new-request?type=adjustment",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-5 h-5" }),
								" Retorno",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline",
									children: "para Ajustes"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "flex-1 sm:flex-none h-full gap-2 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/new-request",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-5 h-5" }), " Novo Pedido"]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-subtle hover:shadow-md transition-shadow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground uppercase tracking-wider",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: `h-5 w-5 ${s.color}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-16" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-4xl font-bold",
						children: s.value
					}) })]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-subtle lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Entrada de Pedidos (Últimos 7 dias)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[250px] w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { count: { color: "hsl(var(--primary))" } },
						className: "h-[250px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chartData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										fontSize: 12,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										fontSize: 12,
										tickLine: false,
										axisLine: false,
										allowDecimals: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										fill: "var(--color-count)",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-subtle flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ações Rápidas" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "w-full justify-start h-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/kanban",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "mr-3 h-5 w-5 text-primary" }), " Kanban de Produção"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "w-full justify-start h-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/app",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "mr-3 h-5 w-5 text-primary" }), " Caixa de Entrada"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "w-full justify-start h-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/financial",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-3 h-5 w-5 text-primary" }), " Faturamento"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "w-full justify-start h-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/users",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-3 h-5 w-5 text-primary" }), " Gerenciar Clientes"]
								})
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "bg-muted/10 border-b",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Últimos Pedidos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Os pedidos mais recentes que entraram no laboratório." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "link",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/history",
								children: "Ver todos"
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full" })
						]
					}) : recentOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center py-12 text-muted-foreground",
						children: "Nenhum pedido encontrado."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y",
						children: recentOrders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-4", order.isAdjustmentReturn ? "bg-yellow-50/50 dark:bg-yellow-950/20" : ""),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0",
									children: order.isAdjustmentReturn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-5 h-5 text-yellow-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-5 h-5 text-primary" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("font-semibold", order.isAdjustmentReturn ? "text-yellow-950 dark:text-yellow-50" : ""),
											children: order.patientName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-[10px] font-mono px-2 py-0.5 rounded", order.isAdjustmentReturn ? "bg-yellow-200 text-yellow-900" : "bg-muted text-muted-foreground"),
											children: order.friendlyId
										}),
										order.isAdjustmentReturn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-yellow-800 bg-yellow-100 border border-yellow-200 px-1.5 py-0.5 rounded uppercase tracking-wider",
											children: "Ajuste"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground/70",
											children: order.dentistName
										}),
										" ",
										"• ",
										order.workType,
										" • ",
										format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: order.status,
									className: "px-3 py-1 shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									asChild: true,
									className: "rounded-full shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: `/order/${order.id}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-5 h-5" })
									})
								})]
							})]
						}, order.id))
					})
				})]
			})
		]
	});
}
export { AdminDashboard as default };

//# sourceMappingURL=AdminDashboard-BVIA4YT8.js.map