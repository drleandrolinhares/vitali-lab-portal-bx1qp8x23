import { t as Activity } from "./activity-g4kWcqY5.js";
import { t as CalendarDays } from "./calendar-days-BpUQoQ24.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BBjsNDJt.js";
import { t as CircleCheck } from "./circle-check-CoWo9LRD.js";
import { t as DollarSign } from "./dollar-sign-B-XoVpZY.js";
import { t as FileDown } from "./file-down-Dzt6RcJU.js";
import { t as History } from "./history-B77U0RBf.js";
import { t as LoaderCircle } from "./loader-circle-D8D54ogS.js";
import { B as supabase, It as require_react, St as require_jsx_runtime, a as useAppStore, at as createLucideIcon, c as filterOrdersForFinancials, f as getOrderFinancials, h as format, kt as Navigate, l as formatBRL, p as ptBR, t as Button, u as generateMonthOptions, zt as __toESM } from "./index-BbgqK6tC.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-DrM1Cr9T.js";
import "./es2015-SCva2bbs.js";
import { t as Badge } from "./badge-D4PqyHdo.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-CBo3RBDL.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DnO5FuVi.js";
var CircleAlert = createLucideIcon("circle-alert", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "8",
		y2: "12",
		key: "1pkeuh"
	}],
	["line", {
		x1: "12",
		x2: "12.01",
		y1: "16",
		y2: "16",
		key: "4dfq90"
	}]
]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function FinancialPage() {
	const { orders, kanbanStages, currentUser, priceList, loading, effectiveRole, Visualizando_Como_ID } = useAppStore();
	const [settlements, setSettlements] = (0, import_react.useState)([]);
	const [fetchError, setFetchError] = (0, import_react.useState)(null);
	const monthOptions = (0, import_react.useMemo)(() => generateMonthOptions(), []);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM"));
	const safeOrders = Array.isArray(orders) ? orders : [];
	const safePriceList = Array.isArray(priceList) ? priceList : [];
	const safeKanbanStages = Array.isArray(kanbanStages) ? kanbanStages : [];
	const monthFilteredOrders = (0, import_react.useMemo)(() => filterOrdersForFinancials(safeOrders, selectedMonth), [safeOrders, selectedMonth]);
	const displayOrders = (0, import_react.useMemo)(() => monthFilteredOrders.map((o) => getOrderFinancials(o, safePriceList, safeKanbanStages)), [
		monthFilteredOrders,
		safePriceList,
		safeKanbanStages
	]);
	const verifiedDisplayOrders = (0, import_react.useMemo)(() => {
		return displayOrders.map((order) => {
			const discount = order.dentistDiscount || 0;
			const expectedTotal = order.unitPrice * order.quantity * (1 - discount / 100);
			const isCorrect = Math.abs((order.basePrice || 0) - expectedTotal) < .01;
			if (!isCorrect) console.warn(`[QA Validation] Order ${order.friendlyId} base price mismatch. Expected ${expectedTotal}, got ${order.basePrice}. Recalculating for display integrity.`);
			const finalBasePrice = isCorrect ? order.basePrice : expectedTotal;
			const outstandingCost = order.status === "completed" || order.status === "delivered" ? Math.max(0, finalBasePrice - (order.clearedBalance || 0)) : 0;
			const pipelineCost = order.status !== "completed" && order.status !== "delivered" && order.status !== "cancelled" ? finalBasePrice : 0;
			return {
				...order,
				basePrice: finalBasePrice,
				outstandingCost,
				pipelineCost,
				pendingCost: pipelineCost,
				totalCost: finalBasePrice
			};
		});
	}, [displayOrders]);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		const fetchSettlements = async () => {
			const targetId = Visualizando_Como_ID || currentUser?.id;
			if (!targetId) return;
			try {
				setFetchError(null);
				let query = supabase.from("settlements").select("*").order("created_at", { ascending: false });
				if (effectiveRole === "dentist" || effectiveRole === "laboratory") query = query.eq("dentist_id", targetId);
				const { data, error } = await query;
				if (!isMounted) return;
				if (error) {
					console.error("Database error fetching settlements:", error);
					setFetchError("Não foi possível carregar o histórico no momento.");
					return;
				}
				if (data) setSettlements(data);
			} catch (err) {
				if (!isMounted) return;
				console.error("Network or unexpected error fetching settlements:", err);
				setFetchError("Problema de conexão ao tentar carregar os dados.");
			}
		};
		fetchSettlements();
		return () => {
			isMounted = false;
		};
	}, [
		currentUser?.id,
		effectiveRole,
		Visualizando_Como_ID
	]);
	if (effectiveRole !== "dentist" && effectiveRole !== "laboratory") {
		if ([
			"admin",
			"master",
			"receptionist"
		].includes(currentUser?.role || "")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: "/admin-financial",
			replace: true
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: "/app",
			replace: true
		});
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in duration-500",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 text-primary animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm font-medium",
			children: "Sincronizando seus dados financeiros..."
		})]
	});
	const concludedOrders = verifiedDisplayOrders.filter((o) => o.status === "completed" || o.status === "delivered");
	const pipelineOrders = verifiedDisplayOrders.filter((o) => o.status === "pending" || o.status === "in_production");
	const totalConcluded = concludedOrders.reduce((acc, o) => acc + (o.basePrice || 0), 0);
	const totalPipeline = pipelineOrders.reduce((acc, o) => acc + (o.basePrice || 0), 0);
	const handleExportCSV = (settlement) => {
		try {
			const snapshot = settlement.orders_snapshot || [];
			let csv = "Data da Liquidação,Paciente,Trabalho,Valor Cobrado\n";
			const date = new Date(settlement.created_at).toLocaleDateString("pt-BR");
			snapshot.forEach((s) => {
				csv += `"${date}","${s.patientName || ""}","${s.workType || ""}",${s.clearedAmount || 0}\n`;
			});
			const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `Historico_Pagamento_${date}.csv`;
			a.click();
		} catch (err) {
			console.error("Error exporting CSV:", err);
		}
	};
	const handlePrintPDF = () => {
		try {
			window.print();
		} catch (err) {
			console.error("Error printing PDF:", err);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto animate-fade-in print:max-w-none print:m-0 print:p-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between print:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-2.5 bg-primary/10 rounded-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-6 h-6 text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-tight text-primary",
					children: "Dash Financeiro"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm",
					children: "Acompanhe seus custos pendentes, pipeline de produção e histórico de pagamentos."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "w-4 h-4 text-muted-foreground ml-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: selectedMonth,
					onValueChange: setSelectedMonth,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-[180px] border-0 bg-transparent shadow-none focus:ring-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o Mês" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: opt.value,
						children: opt.label
					}, opt.value)) })]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "overview",
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "mb-6 print:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "overview",
						children: "Visão Geral do Mês"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "history",
						children: "Histórico de Pagamentos"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "overview",
					className: "space-y-6 print:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 md:grid-cols-2 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-subtle border-l-4 border-l-emerald-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "pb-2 flex flex-row items-center justify-between space-y-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
									children: [
										"Trabalhos Finalizados (",
										monthOptions.find((m) => m.value === selectedMonth)?.label,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-500" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-bold text-emerald-600",
								children: formatBRL(totalConcluded)
							}) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-subtle border-l-4 border-l-amber-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "pb-2 flex flex-row items-center justify-between space-y-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
									children: "Trabalhos em Produção (Pipeline)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-amber-500" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-bold text-foreground",
								children: formatBRL(totalPipeline)
							}) })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "concluded",
						className: "w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "concluded",
									className: "gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-500" }),
										" Finalizados (",
										concludedOrders.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "pipeline",
									className: "gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-amber-500" }),
										" Em Produção (",
										pipelineOrders.length,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "concluded",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "shadow-subtle",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "p-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "pl-6",
												children: "Pedido"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paciente" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Trabalho" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data de Criação" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "text-right pr-6",
												children: "Valor Faturado"
											})
										] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: concludedOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											colSpan: 5,
											className: "text-center py-12 text-muted-foreground",
											children: "Nenhum pedido finalizado neste período."
										}) }) : concludedOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: "hover:bg-muted/30",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "pl-6 font-medium text-primary",
													children: o.friendlyId
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "font-semibold",
													children: o.patientName
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-muted-foreground",
													children: o.workType
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-muted-foreground",
													children: format(new Date(o.createdAt), "dd/MM/yyyy", { locale: ptBR })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-right pr-6 font-bold text-emerald-600",
													children: formatBRL(o.basePrice)
												})
											]
										}, o.id)) })] })
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "pipeline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "shadow-subtle",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "p-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "pl-6",
												children: "Pedido"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paciente" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status (Laboratório)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Trabalho" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
												className: "text-right pr-6",
												children: "Valor Estimado"
											})
										] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: pipelineOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											colSpan: 5,
											className: "text-center py-12 text-muted-foreground",
											children: "Nenhum pedido em produção neste período."
										}) }) : pipelineOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: "hover:bg-muted/30",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "pl-6 font-medium text-primary",
													children: o.friendlyId
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "font-semibold",
													children: o.patientName
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "secondary",
													className: "font-medium bg-muted",
													children: o.kanbanStage
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-muted-foreground",
													children: o.workType
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-right pr-6 font-bold text-amber-600",
													children: formatBRL(o.basePrice)
												})
											]
										}, o.id)) })] })
									})
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "history",
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center print:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-lg font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-5 h-5 text-muted-foreground" }), " Arquivo de Liquidações"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handlePrintPDF,
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "w-4 h-4" }), " Imprimir Relatório"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden print:block mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold",
									children: "Relatório de Histórico de Pagamentos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: ["Clínica: ", currentUser?.clinic || currentUser?.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: ["Data da emissão: ", (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")]
								})
							]
						}),
						fetchError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-destructive/50 bg-destructive/5 mb-4 print:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "py-4 flex items-center gap-3 text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: fetchError
								})]
							})
						}),
						!fetchError && settlements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "print:hidden border-dashed bg-muted/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "py-12 flex flex-col items-center justify-center text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-12 h-12 mb-4 opacity-20" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-lg",
										children: "Nenhuma liquidação no histórico"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm mt-1 text-center",
										children: "Os pagamentos concluídos junto ao laboratório aparecerão arquivados nesta seção."
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: settlements.map((settlement) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "overflow-hidden print:border-none print:shadow-none print:mb-8 print:break-inside-avoid",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "bg-muted/30 border-b pb-4 flex flex-row items-center justify-between print:bg-transparent print:border-b-2 print:border-black print:px-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
										className: "text-base font-semibold",
										children: ["Liquidação de ", new Date(settlement.created_at).toLocaleDateString("pt-BR")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: ["Ref: ", settlement.id.split("-")[0]]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl font-bold text-emerald-600 print:text-black",
											children: formatBRL(settlement.amount || 0)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => handleExportCSV(settlement),
											className: "print:hidden h-8 px-2 text-primary hover:bg-primary/10",
											children: "CSV"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "p-0 print:pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
										className: "bg-muted/10 print:bg-transparent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: "border-b print:border-gray-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
													className: "py-3 px-4 font-medium text-muted-foreground print:text-black print:px-0",
													children: "Paciente / OS"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
													className: "py-3 px-4 font-medium text-muted-foreground print:text-black print:px-0",
													children: "Trabalho"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
													className: "py-3 px-4 text-right font-medium text-muted-foreground print:text-black print:px-0",
													children: "Valor Cobrado"
												})
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (settlement.orders_snapshot || []).map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "border-b last:border-0 hover:bg-muted/5 print:border-b print:border-gray-200",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
												className: "py-3 px-4 print:px-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground block",
													children: s.patientName || "N/A"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: s.friendlyId || "-"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "py-3 px-4 text-muted-foreground print:px-0",
												children: s.workType || "N/A"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "py-3 px-4 text-right font-medium print:px-0",
												children: formatBRL(s.clearedAmount || 0)
											})
										]
									}, idx)) })] })
								})]
							}, settlement.id))
						})
					]
				})
			]
		})]
	});
}
export { FinancialPage as default };

//# sourceMappingURL=Financial-DtGqMYkb.js.map