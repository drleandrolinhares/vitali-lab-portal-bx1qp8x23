import { t as ChartColumn } from "./chart-column-Nyie2lrS.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-E1jAkS4v.js";
import { t as FileDown } from "./file-down-ByGo2OH7.js";
import { t as Info } from "./info-C3sf8NFt.js";
import { t as Settings } from "./settings-hmQbEdhT.js";
import { n as getMonth, t as getYear } from "./getYear-CqogZpGO.js";
import { t as parseISO } from "./parseISO-CQ9qrCle.js";
import { B as supabase, G as TooltipContent, It as require_react, Ot as Link, St as require_jsx_runtime, W as Tooltip, a as useAppStore, f as getOrderFinancials, kt as Navigate, l as formatBRL, q as TooltipTrigger, t as Button, zt as __toESM } from "./index-BQqMl_rO.js";
import { n as CardContent, t as Card } from "./card-DorPhryw.js";
import "./es2015-CgSSirzl.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-Es2JmDDa.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function DREPage() {
	const [year, setYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear().toString());
	const [basis, setBasis] = (0, import_react.useState)("accrual");
	const { orders, kanbanStages, priceList, currentUser, dreCategories, checkPermission } = useAppStore();
	const [settlements, setSettlements] = (0, import_react.useState)([]);
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const currentY = (/* @__PURE__ */ new Date()).getFullYear();
	const years = Array.from({ length: 5 }, (_, i) => (currentY - i).toString());
	const months = [
		"Jan",
		"Fev",
		"Mar",
		"Abr",
		"Mai",
		"Jun",
		"Jul",
		"Ago",
		"Set",
		"Out",
		"Nov",
		"Dez"
	];
	(0, import_react.useEffect)(() => {
		setLoading(true);
		Promise.all([supabase.from("settlements").select("*").gte("created_at", `${year}-01-01`).lte("created_at", `${year}-12-31T23:59:59`), supabase.from("expenses").select("*").gte("due_date", `${year}-01-01`).lte("due_date", `${year}-12-31`)]).then(([settlementsRes, expensesRes]) => {
			if (settlementsRes.data) setSettlements(settlementsRes.data);
			if (expensesRes.data) setExpenses(expensesRes.data);
			setLoading(false);
		});
	}, [year]);
	const revenueCats = (0, import_react.useMemo)(() => dreCategories.filter((c) => c.category_type === "revenue"), [dreCategories]);
	const variableCats = (0, import_react.useMemo)(() => dreCategories.filter((c) => c.category_type === "variable"), [dreCategories]);
	const fixedCats = (0, import_react.useMemo)(() => dreCategories.filter((c) => c.category_type === "fixed"), [dreCategories]);
	const defaultRevCat = revenueCats[0]?.name || "Receita";
	const { report, totals } = (0, import_react.useMemo)(() => {
		const dreCatMap = new Map(dreCategories.map((c) => [c.name, c.category_type]));
		const rep = months.map(() => {
			const data = {
				revenue: {},
				variable: {},
				fixed: {},
				totalRevenue: 0,
				totalVariable: 0,
				totalFixed: 0,
				grossProfit: 0,
				netResult: 0
			};
			dreCategories.forEach((c) => {
				if (c.category_type === "revenue") data.revenue[c.name] = 0;
				if (c.category_type === "variable") data.variable[c.name] = 0;
				if (c.category_type === "fixed") data.fixed[c.name] = 0;
			});
			return data;
		});
		const tot = {
			revenue: {},
			variable: {},
			fixed: {},
			totalRevenue: 0,
			totalVariable: 0,
			totalFixed: 0,
			grossProfit: 0,
			netResult: 0
		};
		dreCategories.forEach((c) => {
			if (c.category_type === "revenue") tot.revenue[c.name] = 0;
			if (c.category_type === "variable") tot.variable[c.name] = 0;
			if (c.category_type === "fixed") tot.fixed[c.name] = 0;
		});
		if (basis === "cash") settlements.forEach((s) => {
			const m = getMonth(parseISO(s.created_at));
			const val = Number(s.amount);
			if (rep[m].revenue[defaultRevCat] !== void 0) {
				rep[m].revenue[defaultRevCat] += val;
				rep[m].totalRevenue += val;
			}
		});
		else orders.forEach((o) => {
			if (o.status === "completed" || o.status === "delivered") {
				const completionHist = o.history.find((h) => h.status === "completed" || h.status === "delivered");
				const dateStr = completionHist ? completionHist.date : o.createdAt;
				const m = getMonth(parseISO(dateStr));
				if (getYear(parseISO(dateStr)).toString() === year) {
					const fin = getOrderFinancials(o, priceList, kanbanStages);
					const cat = o.dre_category || defaultRevCat;
					if (dreCatMap.get(cat) === "revenue" && rep[m].revenue[cat] !== void 0) {
						rep[m].revenue[cat] += fin.totalCost;
						rep[m].totalRevenue += fin.totalCost;
					}
				}
			}
		});
		expenses.forEach((e) => {
			if (basis === "cash" && e.status !== "paid") return;
			const m = getMonth(parseISO(e.due_date));
			const val = Number(e.amount);
			const cat = e.dre_category || "Outros";
			const type = dreCatMap.get(cat);
			if (type === "variable" && rep[m].variable[cat] !== void 0) {
				rep[m].variable[cat] += val;
				rep[m].totalVariable += val;
			} else if (type === "fixed" && rep[m].fixed[cat] !== void 0) {
				rep[m].fixed[cat] += val;
				rep[m].totalFixed += val;
			} else if (type === "revenue" && rep[m].revenue[cat] !== void 0) {
				rep[m].revenue[cat] += val;
				rep[m].totalRevenue += val;
			}
		});
		rep.forEach((m) => {
			m.grossProfit = m.totalRevenue - m.totalVariable;
			m.netResult = m.grossProfit - m.totalFixed;
			dreCategories.forEach((c) => {
				if (c.category_type === "revenue") tot.revenue[c.name] += m.revenue[c.name];
				if (c.category_type === "variable") tot.variable[c.name] += m.variable[c.name];
				if (c.category_type === "fixed") tot.fixed[c.name] += m.fixed[c.name];
			});
			tot.totalRevenue += m.totalRevenue;
			tot.totalVariable += m.totalVariable;
			tot.totalFixed += m.totalFixed;
			tot.grossProfit += m.grossProfit;
			tot.netResult += m.netResult;
		});
		return {
			report: rep,
			totals: tot
		};
	}, [
		basis,
		year,
		settlements,
		expenses,
		orders,
		priceList,
		kanbanStages,
		dreCategories,
		defaultRevCat
	]);
	const handleExportCSV = () => {
		let csv = "Demonstrativo," + months.join(",") + ",Total\n";
		revenueCats.forEach((cat) => {
			csv += `"${cat.name}",` + report.map((d) => d.revenue[cat.name]).join(",") + "," + totals.revenue[cat.name] + "\n";
		});
		csv += `"(=) Total Receita Bruta",` + report.map((d) => d.totalRevenue).join(",") + "," + totals.totalRevenue + "\n";
		variableCats.forEach((cat) => {
			csv += `"(-) ${cat.name}",` + report.map((d) => d.variable[cat.name]).join(",") + "," + totals.variable[cat.name] + "\n";
		});
		csv += `"(=) Lucro Bruto",` + report.map((d) => d.grossProfit).join(",") + "," + totals.grossProfit + "\n";
		fixedCats.forEach((cat) => {
			csv += `"(-) ${cat.name}",` + report.map((d) => d.fixed[cat.name]).join(",") + "," + totals.fixed[cat.name] + "\n";
		});
		csv += `"(=) Resultado Líquido",` + report.map((d) => d.netResult).join(",") + "," + totals.netResult + "\n";
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `DRE_${year}_${basis}.csv`;
		a.click();
	};
	if (!(currentUser?.role === "admin" || currentUser?.role === "master" || checkPermission("dashboards", "view_financial"))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-[1400px] mx-auto animate-fade-in print:max-w-none print:m-0 print:p-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 bg-primary/10 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-6 h-6 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-primary uppercase",
						children: "Dashboard Financeiro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Demonstrativo de Resultados do Exercício."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: year,
							onValueChange: setYear,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[120px] bg-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: y,
								children: y
							}, y)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: basis,
								onValueChange: (v) => setBasis(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[240px] bg-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "accrual",
									children: "Regime de Competência"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "cash",
									children: "Regime de Caixa"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 text-muted-foreground ml-2 cursor-pointer" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipContent, {
								className: "max-w-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Competência:" }), " Considera a data de finalização dos trabalhos e vencimento das contas."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Caixa:" }), " Considera apenas valores efetivamente pagos e recebidos."]
								})]
							})] })]
						}),
						currentUser?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "hidden md:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dre-categories",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-4 h-4 mr-2" }), " Categorias"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: handleExportCSV,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "w-4 h-4 mr-2" }), " Exportar CSV"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden print:block mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold",
					children: ["Relatório DRE - ", year]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground",
					children: [
						"Regime: ",
						basis === "cash" ? "Caixa" : "Competência",
						" | Emissão:",
						" ",
						(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
							className: "min-w-[1000px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
								className: "bg-muted/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[280px] font-bold text-foreground print:text-black",
										children: "Demonstrativo"
									}),
									months.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right min-w-[100px] print:text-black",
										children: m
									}, m)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right min-w-[120px] font-bold bg-muted/50 print:bg-transparent print:text-black",
										children: "Total"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
								revenueCats.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "pl-8 text-muted-foreground print:text-black",
										children: ["(+) ", cat.name]
									}),
									report.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right print:text-black",
										children: formatBRL(d.revenue[cat.name])
									}, i)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-medium bg-muted/30 print:bg-transparent print:text-black",
										children: formatBRL(totals.revenue[cat.name])
									})
								] }, cat.name)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "bg-emerald-50/30 print:bg-transparent",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-semibold text-emerald-700 print:text-black",
											children: "(=) Receita Bruta"
										}),
										report.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right text-emerald-600 print:text-black",
											children: formatBRL(d.totalRevenue)
										}, i)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right font-bold text-emerald-700 bg-emerald-50/50 print:bg-transparent print:text-black",
											children: formatBRL(totals.totalRevenue)
										})
									]
								}),
								variableCats.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "pl-8 text-muted-foreground print:text-black",
										children: ["(-) ", cat.name]
									}),
									report.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right text-red-500 print:text-black",
										children: formatBRL(d.variable[cat.name])
									}, i)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-bold text-red-600 bg-muted/30 print:bg-transparent print:text-black",
										children: formatBRL(totals.variable[cat.name])
									})
								] }, cat.name)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "border-t-2 border-t-muted bg-blue-50/20 print:bg-transparent print:border-black",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-semibold text-blue-700 print:text-black",
											children: "(=) Lucro Bruto"
										}),
										report.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right font-medium text-blue-600 print:text-black",
											children: formatBRL(d.grossProfit)
										}, i)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right font-bold text-blue-700 bg-blue-50/40 print:bg-transparent print:text-black",
											children: formatBRL(totals.grossProfit)
										})
									]
								}),
								fixedCats.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "pl-8 text-muted-foreground print:text-black",
										children: ["(-) ", cat.name]
									}),
									report.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right print:text-black",
										children: formatBRL(d.fixed[cat.name])
									}, i)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-medium bg-muted/30 print:bg-transparent print:text-black",
										children: formatBRL(totals.fixed[cat.name])
									})
								] }, cat.name)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "border-t-2 border-t-muted bg-slate-50 dark:bg-slate-900 print:bg-transparent print:border-black",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-bold text-base print:text-black",
											children: "(=) Resultado Líquido"
										}),
										report.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: `text-right font-bold ${d.netResult >= 0 ? "text-emerald-600" : "text-red-600"} print:text-black`,
											children: formatBRL(d.netResult)
										}, i)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: `text-right font-bold text-base bg-slate-100 dark:bg-slate-800 print:bg-transparent print:text-black ${totals.netResult >= 0 ? "text-emerald-700" : "text-red-700"}`,
											children: formatBRL(totals.netResult)
										})
									]
								})
							] })]
						})
					})
				})
			})
		]
	});
}
export { DREPage as default };

//# sourceMappingURL=DRE-1ZRufh6G.js.map