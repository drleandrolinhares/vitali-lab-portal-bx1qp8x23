import { t as ArrowLeft } from "./arrow-left-BfgShGI9.js";
import { t as Calculator } from "./calculator-yHfsRtsj.js";
import { t as Clock } from "./clock-DBtwbOwe.js";
import { t as DollarSign } from "./dollar-sign-h1tqpPya.js";
import { t as Plus } from "./plus-CUni54x6.js";
import { t as Save } from "./save-4T5LeNsN.js";
import { t as Trash2 } from "./trash-2-C-zQywoD.js";
import { B as supabase, Et as toast, It as require_react, Ot as Link, St as require_jsx_runtime, a as useAppStore, kt as Navigate, t as Button, zt as __toESM } from "./index-Cm144OmE.js";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-DsazUj-d.js";
import { t as Input } from "./input-DS5QoKNy.js";
import { a as TableHead, i as TableFooter, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-CHdbiezU.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var formatCurrency = (val) => new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL"
}).format(val);
var INITIAL_COSTS = [
	["Pró-labore", 2e3],
	["Salários Funcionários", 17e3],
	["Exames Admissional", 50],
	["Provisionamento férias", 500],
	["Rescisões", 400],
	["GPS", 1e3],
	["FGTS", 1200],
	["Contabilidade", 1e3],
	["Taxas", 100],
	["Uniforme", 250],
	["Aluguel/IPTU", 2200],
	["Telefonia/Internet", 200],
	["Material Higiene", 100],
	["Dedetização", 50],
	["Manutenções", 100],
	["Software", 500],
	["Brindes", 250],
	["Café e açúcar", 100],
	["Gráfica", 100],
	["Marketing", 1e3],
	["Material escritório", 100],
	["Fundo de reserva", 500],
	["Fundo de melhorias", 500],
	["Dental", 3500]
].map(([desc, val]) => ({
	id: crypto.randomUUID(),
	description: desc,
	value: val
}));
function HourlyCost() {
	const { currentUser, updateSettings } = useAppStore();
	const [fixedCosts, setFixedCosts] = (0, import_react.useState)([]);
	const [monthlyHours, setMonthlyHours] = (0, import_react.useState)(176);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const loadData = async () => {
			setLoading(true);
			const { data } = await supabase.from("app_settings").select("*").in("key", ["hourly_cost_fixed_items", "hourly_cost_monthly_hours"]);
			if (data) {
				const items = data.find((d) => d.key === "hourly_cost_fixed_items");
				const hours = data.find((d) => d.key === "hourly_cost_monthly_hours");
				if (items?.value) try {
					setFixedCosts(JSON.parse(items.value));
				} catch (e) {
					console.error(e);
					setFixedCosts(INITIAL_COSTS);
				}
				else setFixedCosts(INITIAL_COSTS);
				if (hours?.value) setMonthlyHours(Number(hours.value));
			}
			setLoading(false);
		};
		loadData();
	}, []);
	const totalFixedCosts = (0, import_react.useMemo)(() => fixedCosts.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0), [fixedCosts]);
	const totalHourlyCost = monthlyHours > 0 ? totalFixedCosts / monthlyHours : 0;
	const costPerMinute = totalHourlyCost / 60;
	if (currentUser?.role !== "admin" && currentUser?.role !== "receptionist" && currentUser?.role !== "master") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	const handleSave = async () => {
		setSaving(true);
		try {
			await updateSettings({
				hourly_cost_fixed_items: JSON.stringify(fixedCosts),
				hourly_cost_monthly_hours: monthlyHours.toString()
			});
			toast({ title: "Configurações salvas com sucesso!" });
		} catch (error) {
			toast({
				title: "Erro ao salvar",
				description: error.message,
				variant: "destructive"
			});
		} finally {
			setSaving(false);
		}
	};
	const updateCost = (id, field, value) => {
		setFixedCosts((prev) => prev.map((c) => c.id === id ? {
			...c,
			[field]: value
		} : c));
	};
	const addCost = () => {
		setFixedCosts((prev) => [...prev, {
			id: crypto.randomUUID(),
			description: "",
			value: 0
		}]);
	};
	const removeCost = (id) => {
		setFixedCosts((prev) => prev.filter((c) => c.id !== id));
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center min-h-[50vh]",
		children: "Carregando..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-7xl mx-auto animate-fade-in pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							asChild: true,
							className: "-ml-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/prices",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2.5 bg-primary/10 rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-6 h-6 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold tracking-tight text-primary",
							children: "Custo Hora Clínica"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm",
							children: "Gerencie a precificação e os custos operacionais por minuto."
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleSave,
					disabled: saving,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }), saving ? "Salvando..." : "Salvar Alterações"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3 mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-subtle border-l-4 border-l-slate-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-2 flex flex-row items-center justify-between space-y-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs text-muted-foreground uppercase font-bold tracking-wider",
								children: "Total de Custos Fixos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-slate-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold text-slate-700",
							children: formatCurrency(totalFixedCosts)
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-subtle border-l-4 border-l-blue-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-2 flex flex-row items-center justify-between space-y-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs text-muted-foreground uppercase font-bold tracking-wider",
								children: "Total Custo Hora"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-blue-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold text-blue-600",
							children: formatCurrency(totalHourlyCost)
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-subtle border-l-4 border-l-emerald-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-2 flex flex-row items-center justify-between space-y-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs text-muted-foreground uppercase font-bold tracking-wider",
								children: "Total Custo por Minuto"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-4 h-4 text-emerald-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold text-emerald-600",
							children: formatCurrency(costPerMinute)
						}) })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Custos e Despesas Fixas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Adicione e atualize os itens de custo fixo da clínica." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: addCost,
								size: "sm",
								variant: "outline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " Adicionar Item"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[200px] text-right",
										children: "Valor (R$)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[80px] text-center",
										children: "Ações"
									})
								] }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [fixedCosts.map((cost) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: cost.description,
										onChange: (e) => updateCost(cost.id, "description", e.target.value),
										placeholder: "Descrição do custo...",
										className: "border-transparent hover:border-input focus:border-input bg-transparent"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										step: "0.01",
										value: cost.value || "",
										onChange: (e) => updateCost(cost.id, "value", parseFloat(e.target.value)),
										className: "text-right border-transparent hover:border-input focus:border-input bg-transparent"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "text-muted-foreground hover:text-red-600",
											onClick: () => removeCost(cost.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
										})
									})
								] }, cost.id)), fixedCosts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 3,
									className: "text-center text-muted-foreground py-8",
									children: "Nenhum custo fixo registrado. Clique em \"Adicionar Item\"."
								}) })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-bold",
										children: "Total de Custos Fixos"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-bold text-slate-700",
										children: formatCurrency(totalFixedCosts)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {})
								] }) })
							] })
						}) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "PARÂMETROS DE CÁLCULO" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "DEFINA AS HORAS DE TRABALHADAS NO MÊS" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium text-slate-700 block",
									children: "TOTAL DE HORAS TRABALHADAS POR MÊS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: monthlyHours || "",
									onChange: (e) => setMonthlyHours(parseFloat(e.target.value)),
									placeholder: "Ex: 176"
								})]
							})
						})]
					})
				})]
			})
		]
	});
}
export { HourlyCost as default };

//# sourceMappingURL=HourlyCost-yllOClmT.js.map