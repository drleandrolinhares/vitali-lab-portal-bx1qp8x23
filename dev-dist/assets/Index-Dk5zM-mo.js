import { t as Activity } from "./activity-g4kWcqY5.js";
import { t as ArrowRight } from "./arrow-right-DhuQOCi-.js";
import { t as Check } from "./check-CgRENTlY.js";
import { t as CircleCheck } from "./circle-check-CoWo9LRD.js";
import { n as CirclePlus, t as Skeleton } from "./skeleton-6TwcGxOb.js";
import { t as Clock } from "./clock-BlroDpHI.js";
import { t as FileText } from "./file-text-J1uD9qNh.js";
import { t as Inbox } from "./inbox-oNMBL3MX.js";
import { t as StatusBadge } from "./StatusBadge-BE0FF3K2.js";
import { t as OrderDetailsSheet } from "./OrderDetailsSheet-xBwgTdj6.js";
import { t as RefreshCw } from "./refresh-cw-Bf_x6TOt.js";
import { It as require_react, Ot as Link, St as require_jsx_runtime, a as useAppStore, f as getOrderFinancials, h as format, l as formatBRL, p as ptBR, t as Button, tt as cn, zt as __toESM } from "./index-BbgqK6tC.js";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-DrM1Cr9T.js";
import { t as Logo } from "./Logo-Ct-0atJV.js";
import "./es2015-SCva2bbs.js";
import "./sheet-ZowX5HOC.js";
import "./badge-D4PqyHdo.js";
import "./alert-dialog-DWYV-y8O.js";
import "./textarea-CzFTpR6T.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var WhatsAppIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 24 24",
	fill: "currentColor",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })
});
function DentistDashboard() {
	const { orders, currentUser, appSettings, loading, checkPermission, Visualizando_Como_ID, Visualizando_Como_Name } = useAppStore();
	const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "completed" && o.status !== "cancelled");
	const hasIndividualDash = checkPermission("individual_financial_dash");
	const displayName = (currentUser?.role === "admin" || currentUser?.role === "master") && !!Visualizando_Como_ID ? Visualizando_Como_Name : currentUser?.name;
	const financialData = (0, import_react.useMemo)(() => orders.map((o) => getOrderFinancials(o)), [orders]);
	const pipelineTotal = financialData.reduce((acc, o) => acc + o.pipelineCost, 0);
	const completedTotal = financialData.reduce((acc, o) => acc + o.completedCost, 0);
	const rawWhatsappLink = currentUser.whatsapp_group_link || appSettings?.whatsapp_group_link || appSettings?.whatsapp_lab_link;
	let validWhatsappLink = "";
	if (rawWhatsappLink && rawWhatsappLink.trim() !== "") {
		validWhatsappLink = rawWhatsappLink.trim();
		if (!validWhatsappLink.startsWith("http://") && !validWhatsappLink.startsWith("https://")) validWhatsappLink = `https://${validWhatsappLink}`;
	}
	const isWhatsappConfigured = validWhatsappLink !== "";
	const stats = [
		{
			label: "Pendentes",
			value: orders.filter((o) => o.status === "pending").length,
			icon: Clock,
			color: "text-amber-500"
		},
		{
			label: "Em Produção",
			value: orders.filter((o) => o.status === "in_production").length,
			icon: Activity,
			color: "text-blue-500"
		},
		{
			label: "Concluídos",
			value: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
			icon: CircleCheck,
			color: "text-emerald-500"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 max-w-5xl mx-auto py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-border/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
						variant: "square",
						size: "lg",
						className: "hidden sm:flex"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
							variant: "square",
							size: "sm",
							className: "sm:hidden mb-4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-3xl font-bold tracking-tight",
							children: ["Olá, ", displayName]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mt-1 text-lg",
							children: "Aqui está o resumo dos seus casos protéticos."
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-3 w-full xl:w-auto",
					children: [
						isWhatsappConfigured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							className: "gap-2 shadow-sm text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: validWhatsappLink,
								target: "_blank",
								rel: "noopener noreferrer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "w-5 h-5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden lg:inline",
										children: "Contato"
									}),
									" Laboratório"
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: true,
							variant: "outline",
							size: "lg",
							className: "gap-2 shadow-sm w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "w-5 h-5 opacity-50" }), "Indisponível"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "gap-2 shadow-sm whitespace-nowrap w-full sm:w-auto border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/new-request?type=adjustment",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-5 h-5" }),
									" RETORNO",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden lg:inline",
										children: "AJUSTES"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "gap-2 shadow-sm whitespace-nowrap w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/new-request",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-5 h-5" }), " NOVO PEDIDO"]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-3",
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
			hasIndividualDash && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center gap-3 mb-6 animate-fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-2xl font-bold tracking-tight uppercase",
					children: "DASH FINANCEIRO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border/50 ml-4" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 md:grid-cols-2 animate-fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-subtle border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2 flex flex-row items-center justify-between space-y-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground uppercase tracking-wider",
							children: "Financeiro Finalizado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-emerald-500" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-32" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-bold text-emerald-600",
						children: formatBRL(completedTotal)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Soma de valores de trabalhos concluídos/entregues"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-subtle border-l-4 border-l-amber-500 hover:shadow-md transition-shadow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2 flex flex-row items-center justify-between space-y-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground uppercase tracking-wider",
							children: "Valores a Faturar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-amber-500" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-32" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-bold text-amber-600",
						children: formatBRL(pipelineTotal)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Soma de valores em produção (pipeline)"
					})] })]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: cn("shadow-subtle border-muted/60", !hasIndividualDash ? "mt-8" : "mt-8"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "bg-muted/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Casos Ativos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Acompanhe o status dos trabalhos em andamento no laboratório." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" })
						]
					}) : activeOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-16 text-muted-foreground flex flex-col items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-8 h-8 opacity-50" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-medium",
								children: "Nenhum caso ativo no momento."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "link",
								asChild: true,
								className: "mt-2 uppercase tracking-wider font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/new-request",
									children: "INICIAR UM NOVO PEDIDO"
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y",
						children: activeOrders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-4", order.isAdjustmentReturn ? "bg-yellow-50/50 dark:bg-yellow-950/20" : ""),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("font-semibold text-lg", order.isAdjustmentReturn ? "text-yellow-950 dark:text-yellow-50" : ""),
											children: order.patientName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-xs font-mono px-2 py-0.5 rounded", order.isAdjustmentReturn ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" : "bg-muted text-muted-foreground"),
											children: order.friendlyId
										}),
										order.isAdjustmentReturn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-yellow-800 bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50 px-1.5 py-0.5 rounded uppercase tracking-wider",
											children: "Ajuste"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("text-sm flex items-center gap-2", order.isAdjustmentReturn ? "text-yellow-800 dark:text-yellow-200/80" : "text-muted-foreground"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground/80",
											children: order.workType
										}),
										" •",
										" ",
										order.material,
										" • Criado em",
										" ",
										format(new Date(order.createdAt), "dd MMM, HH:mm", { locale: ptBR })
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right flex flex-col justify-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-[10px] uppercase tracking-wider font-semibold", order.isAdjustmentReturn ? "text-yellow-700 dark:text-yellow-500/70" : "text-muted-foreground"),
											children: "Estimativa"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("font-bold", order.isAdjustmentReturn ? "text-yellow-900 dark:text-yellow-400" : "text-foreground"),
											children: formatBRL(order.basePrice || 0)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
										status: order.status,
										className: "px-3 py-1 shrink-0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										asChild: true,
										className: cn("rounded-full shrink-0", order.isAdjustmentReturn ? "hover:bg-yellow-200/50 text-yellow-900 hover:text-yellow-950 dark:hover:bg-yellow-900/50 dark:text-yellow-500 dark:hover:text-yellow-400" : ""),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: `/order/${order.id}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-5 h-5" })
										})
									})
								]
							})]
						}, order.id))
					})
				})]
			})
		]
	}) });
}
function Index() {
	const { currentUser, orders, acknowledgeOrder, updateOrderObservations, checkPermission, effectiveRole, effectiveUserId } = useAppStore();
	const showGlobalInbox = checkPermission("inbox", "view_all");
	const canCreateOrder = checkPermission("inbox", "create_order") || effectiveRole === "dentist";
	const [selectedOrderId, setSelectedOrderId] = (0, import_react.useState)(null);
	const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;
	const [obsText, setObsText] = (0, import_react.useState)("");
	const handleSaveObs = () => {
		if (selectedOrder) updateOrderObservations(selectedOrder.id, obsText);
	};
	if (!showGlobalInbox) {
		if (effectiveRole === "dentist" || effectiveRole === "laboratory") {
			if (currentUser?.role === effectiveRole && !checkPermission("my_panel")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center h-[calc(100vh-6rem)] animate-fade-in px-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-8 h-8 opacity-50" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-muted-foreground",
						children: "Acesso Restrito"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-2 max-w-md",
						children: "Você não possui permissão para visualizar o painel inicial. Entre em contato com o laboratório para mais informações."
					})
				]
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DentistDashboard, {});
		}
		const myOrders = orders.filter((o) => o.dentistId === effectiveUserId);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 max-w-5xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight",
						children: "Meu Painel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: [
							"Bem-vindo(a), ",
							currentUser?.name,
							"!"
						]
					})] }), canCreateOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 w-full sm:w-auto h-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "flex-1 sm:flex-none h-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/new-request?type=adjustment",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 hidden sm:block" }),
									"Retorno ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "para Ajustes"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "flex-1 sm:flex-none h-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/new-request",
								children: "Novo Pedido"
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "md:col-span-2 shadow-sm border-slate-200 dark:border-border h-fit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-3 border-b",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-lg flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-primary" }), " Meus Trabalhos"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-0",
							children: myOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-8 text-center text-muted-foreground flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-6 h-6 opacity-50" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "Nenhum trabalho encontrado."
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y max-h-[800px] overflow-y-auto",
								children: myOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("p-4 hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group", o.isAdjustmentReturn ? "bg-yellow-50/30 dark:bg-yellow-950/10" : ""),
									onClick: () => {
										setSelectedOrderId(o.id);
										setObsText(o.observations || "");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 mb-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: cn("text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider", o.isAdjustmentReturn ? "text-yellow-800 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300" : "text-primary bg-primary/10"),
														children: o.friendlyId
													}),
													o.isAdjustmentReturn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-bold text-yellow-800 bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50 px-1.5 py-0.5 rounded uppercase tracking-wider",
														children: "Ajuste"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted-foreground font-medium flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), format(new Date(o.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: cn("font-semibold text-lg transition-colors", o.isAdjustmentReturn ? "text-yellow-950 dark:text-yellow-50" : "text-slate-800 dark:text-slate-100 group-hover:text-primary"),
												children: o.patientName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: cn("text-sm mt-0.5 flex items-center flex-wrap gap-x-1.5", o.isAdjustmentReturn ? "text-yellow-800 dark:text-yellow-200/80" : "text-slate-600 dark:text-slate-400"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium text-foreground/80",
														children: o.workType
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-300",
														children: "•"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: o.material })
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
											status: o.status,
											className: "scale-90 sm:scale-100 origin-left"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "shrink-0 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })
										})]
									})]
								}, o.id))
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-sm border-slate-200 dark:border-border h-fit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-3 border-b",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-lg flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-5 h-5 text-primary" }), " Ações Rápidas"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 space-y-3",
							children: [canCreateOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "w-full justify-start text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-900/30 dark:text-yellow-500 dark:hover:bg-yellow-900/30",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/new-request?type=adjustment",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 mr-2" }), " Retorno para Ajustes"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "w-full justify-start",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/new-request",
									children: "Novo Pedido"
								})
							})] }), checkPermission("kanban") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "w-full justify-start",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/kanban",
									children: "Evolução dos Trabalhos"
								})
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetailsSheet, {
					order: selectedOrder,
					isOpen: !!selectedOrderId,
					onClose: () => setSelectedOrderId(null),
					obsText,
					setObsText,
					onSaveObs: handleSaveObs
				})
			]
		});
	}
	const displayOrders = orders.filter((o) => !o.isAcknowledged);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold tracking-tight text-primary flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "w-6 h-6" }), " Caixa de Entrada"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-500 dark:text-muted-foreground",
					children: "Gerencie os novos pedidos recebidos no laboratório."
				})] }), canCreateOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 w-full sm:w-auto h-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "flex-1 sm:flex-none h-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/new-request?type=adjustment",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 hidden sm:block" }),
								"Retorno ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "para Ajustes"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "flex-1 sm:flex-none h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/new-request",
							children: "Novo Pedido"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: displayOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "bg-slate-50/50 dark:bg-muted/20 border-dashed",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col items-center justify-center h-40 text-slate-400 dark:text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-6 h-6 text-emerald-500" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Nenhum novo pedido na caixa de entrada."
						})]
					})
				}) : displayOrders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: cn("group transition-all shadow-sm cursor-pointer", order.isAdjustmentReturn ? "bg-yellow-50/50 border-yellow-300 hover:border-yellow-500 dark:bg-yellow-950/20 dark:border-yellow-900/50 dark:hover:border-yellow-700" : "hover:border-primary/40"),
					onClick: () => {
						setSelectedOrderId(order.id);
						setObsText(order.observations || "");
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider", order.isAdjustmentReturn ? "text-yellow-800 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300" : "text-primary bg-primary/10"),
											children: order.friendlyId
										}),
										order.isAdjustmentReturn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-white bg-yellow-500 dark:bg-yellow-600 px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm",
											children: "Ajuste"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
											status: order.status,
											className: "scale-[0.8] origin-left"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: cn("font-semibold text-lg", order.isAdjustmentReturn ? "text-yellow-950 dark:text-yellow-50" : "text-slate-800 dark:text-slate-100"),
									children: order.patientName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: cn("text-sm flex items-center gap-1.5 mt-0.5", order.isAdjustmentReturn ? "text-yellow-800 dark:text-yellow-200/80" : "text-slate-600 dark:text-slate-400"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: order.dentistName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-300 dark:text-slate-600",
											children: "•"
										}),
										order.workType,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "opacity-75",
											children: [
												"(",
												order.material,
												")"
											]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-medium text-slate-400 flex items-center gap-1.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }), format(new Date(order.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: (e) => {
									e.stopPropagation();
									acknowledgeOrder(order.id);
								},
								className: "ml-auto sm:ml-0 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm",
								size: "sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), " Ciente"]
							})]
						})]
					})
				}, order.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetailsSheet, {
				order: selectedOrder,
				isOpen: !!selectedOrderId,
				onClose: () => setSelectedOrderId(null),
				obsText,
				setObsText,
				onSaveObs: handleSaveObs
			})
		]
	});
}
export { Index as default };

//# sourceMappingURL=Index-Dk5zM-mo.js.map