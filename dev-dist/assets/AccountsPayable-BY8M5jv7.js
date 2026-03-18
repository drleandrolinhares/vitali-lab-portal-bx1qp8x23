import { t as Calendar } from "./calendar-BDF07wg1.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CoyssZ7i.js";
import { a as isAfter, c as endOfMonth, d as addDays, i as isBefore, s as startOfMonth, t as Calendar$1 } from "./calendar-PXZiOn93.js";
import { t as CircleCheckBig } from "./circle-check-big-BWl1NJyn.js";
import { t as Pen } from "./pen-DC_IOf8q.js";
import { t as Plus } from "./plus-C4MsyI1J.js";
import { t as Trash2 } from "./trash-2-VD_rxPz2.js";
import { t as parseISO } from "./parseISO-Dae1WGjR.js";
import { B as supabase, D as startOfDay, Et as toast, It as require_react, N as addMonths, P as toDate, St as require_jsx_runtime, a as useAppStore, at as createLucideIcon, h as format, l as formatBRL, m as subMonths, p as ptBR, t as Button, tt as cn, zt as __toESM } from "./index-C2ICZTGx.js";
import { n as CardContent, t as Card } from "./card-BSWFzLpS.js";
import { t as Input } from "./input-BAEKRk1K.js";
import { t as Label } from "./label-MTDCTxj5.js";
import "./es2015-DvV4uhWF.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DEqXN4Lp.js";
import { t as Badge } from "./badge-C9O18kE5.js";
import { t as Checkbox } from "./checkbox-fdS1jIwD.js";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-C0Xaeg5Y.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-u3xqusiB.js";
var CircleX = createLucideIcon("circle-x", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "m15 9-6 6",
		key: "1uzhvr"
	}],
	["path", {
		d: "m9 9 6 6",
		key: "z0biqf"
	}]
]);
function endOfDay(date, options) {
	const _date = toDate(date, options?.in);
	_date.setHours(23, 59, 59, 999);
	return _date;
}
function subDays(date, amount, options) {
	return addDays(date, -amount, options);
}
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function DatePickerWithRange({ className, date, setDate }) {
	const handlePresetSelect = (value) => {
		const today = endOfDay(/* @__PURE__ */ new Date());
		let start = startOfDay(/* @__PURE__ */ new Date());
		switch (value) {
			case "7":
				start = subDays(today, 7);
				break;
			case "30":
				start = subDays(today, 30);
				break;
			case "90":
				start = subDays(today, 90);
				break;
			case "180":
				start = subMonths(today, 6);
				break;
			case "365":
				start = subMonths(today, 12);
				break;
			case "all":
				start = subMonths(today, 120);
				break;
		}
		setDate({
			from: start,
			to: today
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col sm:flex-row items-start sm:items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			onValueChange: handlePresetSelect,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "w-[140px] bg-white h-9",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Período" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "7",
					children: "Últimos 7 dias"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "30",
					children: "Últimos 30 dias"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "90",
					children: "Últimos 90 dias"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "180",
					children: "Últimos 6 meses"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "365",
					children: "Últimos 12 meses"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "Todo o período"
				})
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				id: "date",
				variant: "outline",
				className: cn("w-full sm:w-[260px] justify-start text-left font-normal bg-white h-9", !date && "text-muted-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-4 w-4" }), date?.from ? date.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					format(date.from, "dd/MM/yyyy"),
					" - ",
					format(date.to, "dd/MM/yyyy")
				] }) : format(date.from, "dd/MM/yyyy") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Selecione a data customizada" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
			className: "w-auto p-0",
			align: "end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
				initialFocus: true,
				mode: "range",
				defaultMonth: date?.from,
				selected: date,
				onSelect: setDate,
				numberOfMonths: 2,
				locale: ptBR
			})
		})] })]
	});
}
function ExpenseFormModal({ open, onOpenChange, onSave, expenseToEdit }) {
	const { dreCategories } = useAppStore();
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [installments, setInstallments] = (0, import_react.useState)([]);
	const [showConflictDialog, setShowConflictDialog] = (0, import_react.useState)(false);
	const [conflictData, setConflictData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		description: "",
		classification: "Custo Fixo",
		category: "",
		dre_category: "",
		purchase_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
		due_date: "",
		payment_method: "Boleto",
		amount: "",
		type: "unica",
		installments_count: 2
	});
	(0, import_react.useEffect)(() => {
		if (open) if (expenseToEdit) {
			setFormData({
				description: expenseToEdit.description || "",
				classification: expenseToEdit.classification || "Custo Fixo",
				category: expenseToEdit.category || "",
				dre_category: expenseToEdit.dre_category || "",
				purchase_date: expenseToEdit.purchase_date || "",
				due_date: expenseToEdit.due_date || "",
				payment_method: expenseToEdit.payment_method || "",
				amount: expenseToEdit.amount ? Number(expenseToEdit.amount).toFixed(2).replace(".", ",") : "",
				type: "unica",
				installments_count: 2
			});
			setInstallments([]);
		} else {
			setFormData({
				description: "",
				classification: "Custo Fixo",
				category: "",
				dre_category: dreCategories.find((c) => c.category_type === "fixed")?.name || dreCategories[0]?.name || "",
				purchase_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
				due_date: "",
				payment_method: "Boleto",
				amount: "",
				type: "unica",
				installments_count: 2
			});
			setInstallments([]);
		}
	}, [
		open,
		expenseToEdit,
		dreCategories
	]);
	(0, import_react.useEffect)(() => {
		if (!expenseToEdit && formData.type === "parcelada" && formData.amount && formData.installments_count && formData.due_date) {
			const total = Number(formData.amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
			if (!isNaN(total) && total > 0) {
				const perInst = total / formData.installments_count;
				setInstallments(Array.from({ length: formData.installments_count }).map((_, i) => ({
					id: `temp-${i}`,
					installment_current: i + 1,
					due_date: format(addMonths(parseISO(formData.due_date), i), "yyyy-MM-dd"),
					amount: perInst.toFixed(2).replace(".", ",")
				})));
			}
		}
	}, [
		formData.type,
		formData.amount,
		formData.installments_count,
		formData.due_date,
		expenseToEdit
	]);
	const proceedWithSave = async (entriesToSave) => {
		setSaving(true);
		await onSave(entriesToSave, !!expenseToEdit);
		setSaving(false);
		if (open) onOpenChange(false);
	};
	const handleSave = async () => {
		if (!formData.description || !formData.dre_category) return;
		setSaving(true);
		const baseAmount = Number(formData.amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
		let entries = [];
		const base = {
			description: formData.description,
			classification: formData.classification,
			category: formData.category || "Geral",
			dre_category: formData.dre_category,
			purchase_date: formData.purchase_date || null,
			payment_method: formData.payment_method,
			cost_center: formData.classification,
			status: expenseToEdit ? expenseToEdit.status : "pending"
		};
		if (formData.type === "unica" || expenseToEdit) entries.push({
			...base,
			due_date: formData.due_date,
			amount: baseAmount,
			is_recurring: expenseToEdit ? expenseToEdit.is_recurring : false
		});
		else if (formData.type === "parcelada") entries = installments.map((i) => ({
			...base,
			due_date: i.due_date,
			amount: Number(i.amount.replace(/[^0-9,-]+/g, "").replace(",", ".")),
			installment_current: i.installment_current,
			installment_total: formData.installments_count
		}));
		else {
			const dMonth = parseInt(formData.due_date.split("-")[2], 10);
			for (let i = 0; i < 12; i++) {
				const d = addMonths(parseISO(formData.due_date), i);
				d.setDate(Math.min(dMonth, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
				entries.push({
					...base,
					due_date: format(d, "yyyy-MM-dd"),
					amount: baseAmount,
					is_recurring: true,
					recurring_day: dMonth
				});
			}
		}
		try {
			let query = supabase.from("expenses").select("dre_category").ilike("description", formData.description);
			if (expenseToEdit) query = query.neq("id", expenseToEdit.id);
			const { data: existing } = await query.limit(1).maybeSingle();
			if (existing && existing.dre_category !== formData.dre_category) {
				setConflictData({
					entries,
					existingCategory: existing.dre_category
				});
				setShowConflictDialog(true);
				setSaving(false);
				return;
			}
		} catch (e) {
			console.error("Validation error", e);
		}
		await proceedWithSave(entries);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: expenseToEdit ? "Editar Conta a Pagar" : "Nova Conta a Pagar" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 col-span-1 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Ex: Aluguel, Resina...",
								value: formData.description,
								onChange: (e) => setFormData({
									...formData,
									description: e.target.value
								})
							})]
						}),
						!expenseToEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo de Conta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.type,
								onValueChange: (v) => setFormData({
									...formData,
									type: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "unica",
										children: "Conta Única"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "parcelada",
										children: "Parcelada"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "recorrente",
										children: "Recorrente"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Classificação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.classification,
								onValueChange: (v) => setFormData({
									...formData,
									classification: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Custo Fixo",
										children: "Custo Fixo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Custo Variável",
										children: "Custo Variável"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Investimento",
										children: "Investimento"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Outros",
										children: "Outros"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Categoria DRE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: formData.dre_category,
									onValueChange: (v) => setFormData({
										...formData,
										dre_category: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: dreCategories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: cat.name,
										children: [
											cat.name,
											" (",
											cat.category_type === "variable" ? "Custo Variável" : cat.category_type === "fixed" ? "Despesa Operacional" : "Receita",
											")"
										]
									}, cat.name)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground mt-1",
									children: "Define a linha correspondente no relatório DRE."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria Interna (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Ex: Laboratório Externo, Materiais...",
								value: formData.category,
								onChange: (e) => setFormData({
									...formData,
									category: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Método de Pagamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Ex: Boleto, PIX...",
								value: formData.payment_method,
								onChange: (e) => setFormData({
									...formData,
									payment_method: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data da Compra" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: formData.purchase_date,
								onChange: (e) => setFormData({
									...formData,
									purchase_date: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: formData.type === "unica" || expenseToEdit ? "Vencimento" : "1º Vencimento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: formData.due_date,
								onChange: (e) => setFormData({
									...formData,
									due_date: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: formData.type === "parcelada" && !expenseToEdit ? "Valor Total (R$)" : "Valor (R$)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "0,00",
								value: formData.amount,
								onChange: (e) => setFormData({
									...formData,
									amount: e.target.value
								})
							})]
						}),
						formData.type === "parcelada" && !expenseToEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nº de Parcelas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "2",
								max: "60",
								value: formData.installments_count,
								onChange: (e) => setFormData({
									...formData,
									installments_count: parseInt(e.target.value) || 2
								})
							})]
						}),
						formData.type === "parcelada" && !expenseToEdit && installments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-1 md:col-span-2 space-y-3 mt-2 border rounded-md p-4 bg-muted/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-medium text-sm",
								children: "Parcelas Geradas"
							}), installments.map((inst, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-4 items-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Parcela"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "h-9 px-3 border rounded-md bg-background flex items-center text-sm",
											children: [
												inst.installment_current,
												" / ",
												formData.installments_count
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Vencimento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: inst.due_date,
											onChange: (e) => {
												const n = [...installments];
												n[idx].due_date = e.target.value;
												setInstallments(n);
											}
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Valor (R$)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: inst.amount,
											onChange: (e) => {
												const n = [...installments];
												n[idx].amount = e.target.value;
												setInstallments(n);
											}
										})]
									})
								]
							}, inst.id))]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: handleSave,
					disabled: saving,
					children: saving ? "Salvando..." : expenseToEdit ? "Salvar Alterações" : "Salvar Despesa"
				})] })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: showConflictDialog,
		onOpenChange: setShowConflictDialog,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Aviso de Consistência DRE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
			className: "text-base",
			children: [
				"Atenção: Esta descrição de conta (",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: formData.description
				}),
				") já está vinculada a uma categoria DRE diferente (",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: conflictData?.existingCategory
				}),
				") em outros registros.",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				"Deseja manter a alteração e salvar como \"",
				formData.dre_category,
				"\"?"
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
			onClick: () => setShowConflictDialog(false),
			children: "Corrigir Categoria"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			onClick: () => {
				setShowConflictDialog(false);
				if (conflictData) proceedWithSave(conflictData.entries);
			},
			children: "Sim, Manter Alteração"
		})] })] })
	})] });
}
var getStatusDetails = (item) => {
	if (item.status === "paid") return {
		label: "Paga",
		color: "text-emerald-600 bg-emerald-50 border-emerald-200"
	};
	if (isBefore(parseISO(item.due_date), startOfDay(/* @__PURE__ */ new Date()))) return {
		label: "Vencida",
		color: "text-red-600 bg-red-50 border-red-200"
	};
	return {
		label: "A Vencer",
		color: "text-blue-600 bg-blue-50 border-blue-200"
	};
};
function AccountsPayable() {
	const { selectedLab } = useAppStore();
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [editingExpense, setEditingExpense] = (0, import_react.useState)(null);
	const [filterStatus, setFilterStatus] = (0, import_react.useState)({
		pending: true,
		paid: true
	});
	const [dateRange, setDateRange] = (0, import_react.useState)({
		from: startOfMonth(/* @__PURE__ */ new Date()),
		to: endOfMonth(/* @__PURE__ */ new Date())
	});
	const fetchExpenses = async () => {
		const { data } = await supabase.from("expenses").select("*").is("order_id", null).order("due_date", { ascending: true });
		if (data) setExpenses(data);
	};
	(0, import_react.useEffect)(() => {
		fetchExpenses();
	}, []);
	const filteredExpenses = (0, import_react.useMemo)(() => {
		return expenses.filter((e) => {
			if (e.status === "paid" && !filterStatus.paid) return false;
			if (e.status === "pending" && !filterStatus.pending) return false;
			if (selectedLab !== "Todos" && e.sector !== selectedLab) return false;
			if (e.order_id !== null) return false;
			const date = parseISO(e.due_date);
			if (dateRange?.from && isBefore(date, startOfDay(dateRange.from))) return false;
			if (dateRange?.to && isAfter(date, endOfDay(dateRange.to))) return false;
			return true;
		});
	}, [
		expenses,
		selectedLab,
		filterStatus,
		dateRange
	]);
	const totals = (0, import_react.useMemo)(() => {
		const t = {
			fixo: 0,
			variavel: 0,
			investimento: 0,
			outros: 0,
			total: 0
		};
		filteredExpenses.forEach((e) => {
			const val = Number(e.amount);
			if (e.classification === "Custo Fixo") t.fixo += val;
			else if (e.classification === "Custo Variável") t.variavel += val;
			else if (e.classification === "Investimento") t.investimento += val;
			else t.outros += val;
			t.total += val;
		});
		return t;
	}, [filteredExpenses]);
	const groups = (0, import_react.useMemo)(() => {
		const g = {};
		filteredExpenses.forEach((e) => {
			if (!g[e.due_date]) g[e.due_date] = [];
			g[e.due_date].push(e);
		});
		return Object.entries(g).sort((a, b) => a[0].localeCompare(b[0]));
	}, [filteredExpenses]);
	const handleSaveModal = async (entries, isEdit) => {
		if (isEdit && editingExpense) {
			const updateData = {
				...entries[0],
				sector: selectedLab === "Todos" ? "Soluções Cerâmicas" : selectedLab
			};
			delete updateData.id;
			const { error } = await supabase.from("expenses").update(updateData).eq("id", editingExpense.id);
			if (error) toast({
				title: "Erro ao atualizar",
				description: error.message,
				variant: "destructive"
			});
			else {
				toast({ title: "Atualizado com sucesso!" });
				fetchExpenses();
			}
		} else {
			const { error } = await supabase.from("expenses").insert(entries.map((e) => ({
				...e,
				sector: selectedLab === "Todos" ? "Soluções Cerâmicas" : selectedLab
			})));
			if (error) toast({
				title: "Erro ao salvar",
				description: error.message,
				variant: "destructive"
			});
			else {
				toast({ title: "Salvo com sucesso!" });
				fetchExpenses();
			}
		}
		setEditingExpense(null);
	};
	const markAsPaid = async (id) => {
		await supabase.from("expenses").update({ status: "paid" }).eq("id", id);
		fetchExpenses();
	};
	const cancelPayment = async (exp) => {
		await supabase.from("expenses").update({ status: "pending" }).eq("id", exp.id);
		fetchExpenses();
	};
	const deleteExpense = async (id) => {
		if (!confirm("Excluir esta despesa?")) return;
		await supabase.from("expenses").delete().eq("id", id);
		fetchExpenses();
	};
	const handleNewAccount = () => {
		setEditingExpense(null);
		setModalOpen(true);
	};
	const handleEditAccount = (item) => {
		setEditingExpense(item);
		setModalOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-[1400px] mx-auto animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-tight text-primary",
					children: "Contas a Pagar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm",
					children: "Gerencie despesas, parcelamentos e contas recorrentes."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleNewAccount,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " Nova Conta"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 border-r pr-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-muted-foreground",
							children: "Mostrar:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								id: "pending",
								checked: filterStatus.pending,
								onCheckedChange: (v) => setFilterStatus((s) => ({
									...s,
									pending: !!v
								}))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "pending",
								className: "text-sm cursor-pointer",
								children: "A Pagar"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								id: "paid",
								checked: filterStatus.paid,
								onCheckedChange: (v) => setFilterStatus((s) => ({
									...s,
									paid: !!v
								}))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "paid",
								className: "text-sm cursor-pointer",
								children: "Pagas"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePickerWithRange, {
					date: dateRange,
					setDate: setDateRange
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-4",
				children: [
					{
						label: "Custo Fixo",
						val: totals.fixo
					},
					{
						label: "Custo Variável",
						val: totals.variavel
					},
					{
						label: "Investimento",
						val: totals.investimento
					},
					{
						label: "Outros",
						val: totals.outros
					},
					{
						label: "Valor Total",
						val: totals.total,
						primary: true
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: cn("shadow-none border-0", t.primary ? "bg-primary/10" : "bg-muted/20"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-xs font-semibold uppercase", t.primary ? "text-primary" : "text-muted-foreground"),
							children: t.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-xl font-bold", t.primary ? "text-primary" : "text-foreground"),
							children: formatBRL(t.val)
						})]
					})
				}, t.label))
			}),
			groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center p-12 border rounded-lg bg-muted/10 text-muted-foreground",
				children: "Nenhuma conta encontrada neste período."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rounded-lg bg-background shadow-subtle overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b text-sm font-medium text-muted-foreground bg-muted/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "col-span-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-1",
							children: "Ações"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2",
							children: "Classificação"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2",
							children: "Categoria DRE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-3",
							children: "Descrição"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-1 text-right",
							children: "Valor"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y",
					children: groups.map(([dateStr, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full md:w-20 md:border-r bg-muted/10 flex md:flex-col items-center justify-center md:justify-start pt-2 md:pt-4 px-2 border-b md:border-b-0 py-2 md:py-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg md:text-2xl font-bold",
								children: format(parseISO(dateStr), "dd")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs md:text-sm uppercase text-muted-foreground ml-2 md:ml-0",
								children: format(parseISO(dateStr), "MMM", { locale: ptBR })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 flex flex-col divide-y",
							children: items.map((item) => {
								const { label, color } = getStatusDetails(item);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-11 gap-4 px-4 py-3 items-center hover:bg-muted/5 group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-span-1 md:col-span-2 flex items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: cn("font-semibold border", color),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mr-1.5 font-normal",
														children: "$"
													}),
													" ",
													label
												]
											}), item.is_recurring && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "ml-2 text-[10px]",
												children: "Recorrente"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-span-1 md:col-span-1 flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity",
											children: [
												item.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 text-emerald-600 hover:bg-emerald-50",
													onClick: () => markAsPaid(item.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-4 h-4" })
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 text-amber-500 hover:bg-amber-50",
													onClick: () => cancelPayment(item),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 text-blue-500 hover:bg-blue-50",
													onClick: () => handleEditAccount(item),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-4 h-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 text-red-500 hover:bg-red-50",
													onClick: () => deleteExpense(item.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col-span-1 md:col-span-2 text-sm text-muted-foreground truncate",
											title: item.classification,
											children: item.classification
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col-span-1 md:col-span-2 text-sm truncate font-medium text-blue-600",
											title: item.dre_category,
											children: item.dre_category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-span-1 md:col-span-3 text-sm truncate font-medium",
											children: [item.description, item.installment_total > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "ml-1.5 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded",
												children: [
													item.installment_current,
													"/",
													item.installment_total
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("col-span-1 md:col-span-1 text-right font-semibold", label === "Vencida" ? "text-red-600" : "text-foreground"),
											children: formatBRL(Number(item.amount))
										})
									]
								}, item.id);
							})
						})]
					}, dateStr))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseFormModal, {
				open: modalOpen,
				onOpenChange: setModalOpen,
				onSave: handleSaveModal,
				expenseToEdit: editingExpense
			})
		]
	});
}
export { AccountsPayable as default };

//# sourceMappingURL=AccountsPayable-BY8M5jv7.js.map