import { t as CalendarDays } from "./calendar-days-C04AMKkO.js";
import { n as TrendingDown, r as ChartPie, t as TrendingUp } from "./trending-up-B2ZVvEpn.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CHfCOgzS.js";
import { t as DollarSign } from "./dollar-sign-h1tqpPya.js";
import { t as Wallet } from "./wallet-CsqoUTbn.js";
import { B as supabase, It as require_react, St as require_jsx_runtime, a as useAppStore, d as getOrderCompletionDate, f as getOrderFinancials, h as format, kt as Navigate, l as formatBRL, u as generateMonthOptions, zt as __toESM } from "./index-Cm144OmE.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-DsazUj-d.js";
import "./es2015-CuA1jgg4.js";
import { L as ResponsiveContainer, _ as Bar, a as ChartTooltipContent, c as YAxis, i as ChartTooltip, l as XAxis, n as ChartLegend, o as BarChart, r as ChartLegendContent, t as ChartContainer } from "./chart-DgtZsjDD.js";
import { t as CartesianGrid } from "./CartesianGrid-CQhvfTO3.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function ComparativeDashboard() {
	const { currentUser, orders, kanbanStages, dreCategories, checkPermission } = useAppStore();
	const [priceList, setPriceList] = (0, import_react.useState)([]);
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const monthOptions = (0, import_react.useMemo)(() => generateMonthOptions(), []);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM"));
	(0, import_react.useEffect)(() => {
		supabase.from("price_list").select("id, work_type, sector, price_stages(*)").then(({ data }) => {
			if (data) setPriceList(data);
		});
		supabase.from("expenses").select("*").then(({ data }) => {
			if (data) setExpenses(data);
		});
	}, []);
	const revenueCategories = (0, import_react.useMemo)(() => {
		return dreCategories.filter((c) => c.category_type === "revenue").map((c) => c.name);
	}, [dreCategories]);
	const getSectorStats = (sectorName) => {
		const sectorOrders = orders.filter((o) => (o.sector || "").toUpperCase() === sectorName.toUpperCase());
		const sectorExpenses = expenses.filter((e) => (e.sector || "").toUpperCase() === sectorName.toUpperCase());
		const revenue = sectorOrders.reduce((acc, o) => {
			if (!(o.status === "completed" || o.status === "delivered")) return acc;
			const compDate = getOrderCompletionDate(o);
			if (compDate && format(compDate, "yyyy-MM") === selectedMonth) return acc + getOrderFinancials(o, priceList, kanbanStages).completedCost;
			return acc;
		}, 0);
		const expensesTotal = sectorExpenses.reduce((acc, e) => {
			if (e.due_date && e.due_date.startsWith(selectedMonth)) {
				if (!(revenueCategories.includes(e.dre_category) || e.dre_category === "Receita" || e.category === "Serviços Realizados")) return acc + Number(e.amount);
			}
			return acc;
		}, 0);
		const profit = revenue - expensesTotal;
		return {
			revenue,
			expenses: expensesTotal,
			profit,
			margin: revenue > 0 ? profit / revenue * 100 : 0
		};
	};
	const statsSC = (0, import_react.useMemo)(() => getSectorStats("Soluções Cerâmicas"), [
		orders,
		expenses,
		priceList,
		kanbanStages,
		selectedMonth,
		revenueCategories
	]);
	const statsSA = (0, import_react.useMemo)(() => getSectorStats("Studio Acrílico"), [
		orders,
		expenses,
		priceList,
		kanbanStages,
		selectedMonth,
		revenueCategories
	]);
	const chartData = [{
		name: "Soluções Cerâmicas",
		Receitas: statsSC.revenue,
		Despesas: statsSC.expenses
	}, {
		name: "Studio Acrílico",
		Receitas: statsSA.revenue,
		Despesas: statsSA.expenses
	}];
	const chartConfig = {
		Receitas: {
			label: "Receitas (R$)",
			color: "hsl(var(--emerald-500))"
		},
		Despesas: {
			label: "Despesas (R$)",
			color: "hsl(var(--red-500))"
		}
	};
	if (!(currentUser?.role === "admin" || currentUser?.role === "master" || checkPermission("dashboards", "view_operational"))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	const selectedMonthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label;
	const renderKPIs = (title, stats) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-semibold text-lg text-primary/80 border-b pb-2",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-sm border-l-2 border-l-emerald-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs text-muted-foreground uppercase flex items-center justify-between",
							children: ["Receitas ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5 text-emerald-500" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-bold text-emerald-600",
							children: formatBRL(stats.revenue)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-sm border-l-2 border-l-red-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs text-muted-foreground uppercase flex items-center justify-between",
							children: ["Despesas ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5 text-red-500" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-bold text-red-600",
							children: formatBRL(stats.expenses)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-sm border-l-2 border-l-blue-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs text-muted-foreground uppercase flex items-center justify-between",
							children: ["Lucro Líquido ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-3.5 h-3.5 text-blue-500" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-bold text-blue-600",
							children: formatBRL(stats.profit)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-sm border-l-2 border-l-purple-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs text-muted-foreground uppercase flex items-center justify-between",
							children: ["Rentabilidade ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5 text-purple-500" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-lg font-bold text-purple-600",
							children: [stats.margin.toFixed(1), "%"]
						})
					})]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-7xl mx-auto animate-fade-in pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 bg-primary/10 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-6 h-6 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-primary uppercase",
						children: "Dashboard Comparativo Interno"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Desempenho financeiro por laboratório no período selecionado."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "w-4 h-4 text-muted-foreground ml-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: selectedMonth,
						onValueChange: setSelectedMonth,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-full sm:w-[200px] border-0 bg-transparent shadow-none focus:ring-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o Mês" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: opt.value,
							children: opt.label
						}, opt.value)) })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800",
					children: renderKPIs("Soluções Cerâmicas", statsSC)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800",
					children: renderKPIs("Studio Acrílico", statsSA)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
					"Comparativo de Receitas vs Despesas (",
					selectedMonthLabel,
					")"
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[350px] w-full mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: chartConfig,
						className: "h-full w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chartData,
								margin: {
									top: 20,
									right: 30,
									left: 20,
									bottom: 5
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tickFormatter: (val) => `R$ ${val}`,
										axisLine: false,
										tickLine: false,
										width: 80
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
										content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { indicator: "dot" }),
										cursor: { fill: "transparent" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegendContent, {}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "Receitas",
										fill: "var(--color-Receitas)",
										radius: [
											4,
											4,
											0,
											0
										],
										maxBarSize: 60
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "Despesas",
										fill: "var(--color-Despesas)",
										radius: [
											4,
											4,
											0,
											0
										],
										maxBarSize: 60
									})
								]
							})
						})
					})
				}) })]
			})
		]
	});
}
export { ComparativeDashboard as default };

//# sourceMappingURL=ComparativeDashboard-C_524cim.js.map