import { t as Calculator } from "./calculator-CwX082UI.js";
import { n as TrendingDown, r as ChartPie, t as TrendingUp } from "./trending-up-DS6O8UMW.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BAciz0p1.js";
import { t as Clock } from "./clock-DVgb-U12.js";
import { t as DollarSign } from "./dollar-sign-BdEmtUw1.js";
import { t as Funnel } from "./funnel-DufuPV6x.js";
import { t as Pen } from "./pen-CfoHTnST.js";
import { t as Plus } from "./plus-Dh-hqshg.js";
import { t as Settings } from "./settings-C2GUeE70.js";
import { t as Trash2 } from "./trash-2-Bq-SnuNR.js";
import { t as TriangleAlert } from "./triangle-alert-Bwh3ubb4.js";
import { B as supabase, Et as toast, It as require_react, Ot as Link, St as require_jsx_runtime, Tt as composeEventHandlers, a as useAppStore, ht as Primitive, lt as useControllableState, nt as formatCurrency, o as calculateProcedureProfitability, ot as cva, s as computeHourlyCosts, t as Button, tt as cn, xt as createContextScope, zt as __toESM } from "./index-B36margM.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-DHa3Ekeu.js";
import { t as Input } from "./input-DXaEaBh2.js";
import { t as Label } from "./label-0oNdCLFk.js";
import "./es2015-CrFdN-AJ.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BaahT-l7.js";
import { t as useDirection } from "./dist-CwDZN4Fp.js";
import { n as Root$1, r as createRovingFocusGroupScope, t as Item } from "./dist-BpijPyDm.js";
import { t as Badge } from "./badge-DuicXZec.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-C_2KIvTu.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var NAME = "Toggle";
var Toggle$1 = import_react.forwardRef((props, forwardedRef) => {
	const { pressed: pressedProp, defaultPressed, onPressedChange, ...buttonProps } = props;
	const [pressed, setPressed] = useControllableState({
		prop: pressedProp,
		onChange: onPressedChange,
		defaultProp: defaultPressed ?? false,
		caller: NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		"aria-pressed": pressed,
		"data-state": pressed ? "on" : "off",
		"data-disabled": props.disabled ? "" : void 0,
		...buttonProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => {
			if (!props.disabled) setPressed(!pressed);
		})
	});
});
Toggle$1.displayName = NAME;
var Root = Toggle$1;
var TOGGLE_GROUP_NAME = "ToggleGroup";
var [createToggleGroupContext, createToggleGroupScope] = createContextScope(TOGGLE_GROUP_NAME, [createRovingFocusGroupScope]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var ToggleGroup$1 = import_react.forwardRef((props, forwardedRef) => {
	const { type, ...toggleGroupProps } = props;
	if (type === "single") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImplSingle, {
		...toggleGroupProps,
		ref: forwardedRef
	});
	if (type === "multiple") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImplMultiple, {
		...toggleGroupProps,
		ref: forwardedRef
	});
	throw new Error(`Missing prop \`type\` expected on \`${TOGGLE_GROUP_NAME}\``);
});
ToggleGroup$1.displayName = TOGGLE_GROUP_NAME;
var [ToggleGroupValueProvider, useToggleGroupValueContext] = createToggleGroupContext(TOGGLE_GROUP_NAME);
var ToggleGroupImplSingle = import_react.forwardRef((props, forwardedRef) => {
	const { value: valueProp, defaultValue, onValueChange = () => {}, ...toggleGroupSingleProps } = props;
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? "",
		onChange: onValueChange,
		caller: TOGGLE_GROUP_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupValueProvider, {
		scope: props.__scopeToggleGroup,
		type: "single",
		value: import_react.useMemo(() => value ? [value] : [], [value]),
		onItemActivate: setValue,
		onItemDeactivate: import_react.useCallback(() => setValue(""), [setValue]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImpl, {
			...toggleGroupSingleProps,
			ref: forwardedRef
		})
	});
});
var ToggleGroupImplMultiple = import_react.forwardRef((props, forwardedRef) => {
	const { value: valueProp, defaultValue, onValueChange = () => {}, ...toggleGroupMultipleProps } = props;
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? [],
		onChange: onValueChange,
		caller: TOGGLE_GROUP_NAME
	});
	const handleButtonActivate = import_react.useCallback((itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]), [setValue]);
	const handleButtonDeactivate = import_react.useCallback((itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)), [setValue]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupValueProvider, {
		scope: props.__scopeToggleGroup,
		type: "multiple",
		value,
		onItemActivate: handleButtonActivate,
		onItemDeactivate: handleButtonDeactivate,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImpl, {
			...toggleGroupMultipleProps,
			ref: forwardedRef
		})
	});
});
ToggleGroup$1.displayName = TOGGLE_GROUP_NAME;
var [ToggleGroupContext$1, useToggleGroupContext] = createToggleGroupContext(TOGGLE_GROUP_NAME);
var ToggleGroupImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToggleGroup, disabled = false, rovingFocus = true, orientation, dir, loop = true, ...toggleGroupProps } = props;
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToggleGroup);
	const direction = useDirection(dir);
	const commonProps = {
		role: "group",
		dir: direction,
		...toggleGroupProps
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupContext$1, {
		scope: __scopeToggleGroup,
		rovingFocus,
		disabled,
		children: rovingFocus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
			asChild: true,
			...rovingFocusGroupScope,
			orientation,
			dir: direction,
			loop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				...commonProps,
				ref: forwardedRef
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			...commonProps,
			ref: forwardedRef
		})
	});
});
var ITEM_NAME = "ToggleGroupItem";
var ToggleGroupItem$1 = import_react.forwardRef((props, forwardedRef) => {
	const valueContext = useToggleGroupValueContext(ITEM_NAME, props.__scopeToggleGroup);
	const context = useToggleGroupContext(ITEM_NAME, props.__scopeToggleGroup);
	const rovingFocusGroupScope = useRovingFocusGroupScope(props.__scopeToggleGroup);
	const pressed = valueContext.value.includes(props.value);
	const disabled = context.disabled || props.disabled;
	const commonProps = {
		...props,
		pressed,
		disabled
	};
	const ref = import_react.useRef(null);
	return context.rovingFocus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: !disabled,
		active: pressed,
		ref,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItemImpl, {
			...commonProps,
			ref: forwardedRef
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItemImpl, {
		...commonProps,
		ref: forwardedRef
	});
});
ToggleGroupItem$1.displayName = ITEM_NAME;
var ToggleGroupItemImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToggleGroup, value, ...itemProps } = props;
	const valueContext = useToggleGroupValueContext(ITEM_NAME, __scopeToggleGroup);
	const singleProps = {
		role: "radio",
		"aria-checked": props.pressed,
		"aria-pressed": void 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle$1, {
		...valueContext.type === "single" ? singleProps : void 0,
		...itemProps,
		ref: forwardedRef,
		onPressedChange: (pressed) => {
			if (pressed) valueContext.onItemActivate(value);
			else valueContext.onItemDeactivate(value);
		}
	});
});
var Root2 = ToggleGroup$1;
var Item2 = ToggleGroupItem$1;
var toggleVariants = cva("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2", {
	variants: {
		variant: {
			default: "bg-transparent",
			outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
		},
		size: {
			default: "h-10 px-3 min-w-10",
			sm: "h-9 px-2.5 min-w-9",
			lg: "h-11 px-5 min-w-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Toggle = import_react.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(toggleVariants({
		variant,
		size,
		className
	})),
	...props
}));
Toggle.displayName = Root.displayName;
var ToggleGroupContext = import_react.createContext({
	size: "default",
	variant: "default"
});
var ToggleGroup = import_react.forwardRef(({ className, variant, size, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
	ref,
	className: cn("flex items-center justify-center gap-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupContext.Provider, {
		value: {
			variant,
			size
		},
		children
	})
}));
ToggleGroup.displayName = Root2.displayName;
var ToggleGroupItem = import_react.forwardRef(({ className, children, variant, size, ...props }, ref) => {
	const context = import_react.useContext(ToggleGroupContext);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		ref,
		className: cn(toggleVariants({
			variant: context.variant || variant,
			size: context.size || size
		}), className),
		...props,
		children
	});
});
ToggleGroupItem.displayName = Item2.displayName;
function HourlyCostDashboard() {
	const { appSettings } = useAppStore();
	const costs = computeHourlyCosts(appSettings);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-3 mb-4 px-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-sm border-l-4 border-l-slate-500 bg-slate-50/50 dark:bg-slate-900/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "p-3 pb-0 flex flex-row items-center justify-between space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider",
						children: "Total de Custos Fixos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-slate-500" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-3 pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300",
						children: formatCurrency(costs.totalFixedCosts)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-sm border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "p-3 pb-0 flex flex-row items-center justify-between space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider",
						children: "Total Custo Hora"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-blue-500" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-3 pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400",
						children: formatCurrency(costs.totalHourlyCost)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-sm border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "p-3 pb-0 flex flex-row items-center justify-between space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider",
						children: "Total Custo por Minuto"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-4 h-4 text-emerald-500" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-3 pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400",
						children: formatCurrency(costs.costPerMinute)
					})
				})]
			})
		]
	});
}
var formatBRL = (val) => new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL"
}).format(val);
var parseLocalNum = (val) => {
	const parsed = parseFloat(String(val ?? "").replace(",", "."));
	return !isNaN(parsed) ? parsed : 0;
};
var isInvalidNumber = (val) => {
	const str = String(val ?? "").trim();
	if (str === "") return true;
	const parsed = parseFloat(str.replace(",", "."));
	return isNaN(parsed) || parsed < 0;
};
function PriceList() {
	const { selectedLab, kanbanStages, appSettings, updateSettings } = useAppStore();
	const [prices, setPrices] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [globalConfigOpen, setGlobalConfigOpen] = (0, import_react.useState)(false);
	const [profitFilter, setProfitFilter] = (0, import_react.useState)([]);
	const [formErrors, setFormErrors] = (0, import_react.useState)({});
	const [hasAttemptedSubmit, setHasAttemptedSubmit] = (0, import_react.useState)(false);
	const [globalErrors, setGlobalErrors] = (0, import_react.useState)({});
	const [globalAttempted, setGlobalAttempted] = (0, import_react.useState)(false);
	const sharedCosts = (0, import_react.useMemo)(() => computeHourlyCosts(appSettings), [appSettings]);
	const getSetting = (0, import_react.useCallback)((key) => {
		return appSettings[key] || "";
	}, [appSettings]);
	const [configForm, setConfigForm] = (0, import_react.useState)({
		cardFee: "0",
		commission: "0",
		inadimplency: "0",
		taxes: "0"
	});
	const [formData, setFormData] = (0, import_react.useState)({
		id: "",
		work_type: "",
		category: "PROTESE FIXA",
		material: "",
		price: "",
		sector: "Soluções Cerâmicas",
		execution_time: "",
		cadista_cost: "",
		material_cost: "",
		stages: []
	});
	const fetchPrices = async () => {
		setLoading(true);
		const { data } = await supabase.from("price_list").select("id, work_type, category, material, price, sector, execution_time, cadista_cost, material_cost, fixed_cost, price_stages(*)").order("work_type", { ascending: true });
		if (data) setPrices(data.sort((a, b) => (a.work_type || "").localeCompare(b.work_type || "", "pt-BR")));
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchPrices();
	}, []);
	const getMargin = (0, import_react.useCallback)((item) => {
		const pNum = parseLocalNum(item.price);
		const eTime = parseLocalNum(item.execution_time);
		const cVal = parseLocalNum(item.cadista_cost);
		const mVal = parseLocalNum(item.material_cost);
		const globalCardFee$1 = parseLocalNum(getSetting("global_card_fee"));
		const globalCommission$1 = parseLocalNum(getSetting("global_commission"));
		const globalInadimplency$1 = parseLocalNum(getSetting("global_inadimplency"));
		const globalTaxes$1 = parseLocalNum(getSetting("global_taxes"));
		const { profitMargin: profitMargin$1 } = calculateProcedureProfitability({
			price: pNum,
			executionTime: eTime,
			cadistaCost: cVal,
			materialCost: mVal,
			costPerMinute: sharedCosts.costPerMinute,
			globalCardFee: globalCardFee$1,
			globalCommission: globalCommission$1,
			globalInadimplency: globalInadimplency$1,
			globalTaxes: globalTaxes$1
		});
		return profitMargin$1;
	}, [getSetting, sharedCosts.costPerMinute]);
	const filteredPrices = (0, import_react.useMemo)(() => {
		return prices.filter((p) => {
			if (selectedLab !== "Todos" && p.sector !== selectedLab) return false;
			if (profitFilter.length > 0) {
				const margin = getMargin(p);
				let category = "low";
				if (margin > 20) category = "high";
				else if (margin >= 10) category = "medium";
				if (!profitFilter.includes(category)) return false;
			}
			return true;
		}).sort((a, b) => (a.work_type || "").localeCompare(b.work_type || "", "pt-BR"));
	}, [
		prices,
		selectedLab,
		profitFilter,
		getMargin
	]);
	const availableMaterials = (0, import_react.useMemo)(() => {
		let list = [];
		try {
			if (appSettings["materials_list"]) list = JSON.parse(appSettings["materials_list"]);
		} catch (e) {
			console.error("Failed to parse materials_list", e);
		}
		const fromPriceList = prices.map((p) => p.material).filter(Boolean);
		return Array.from(new Set([...list, ...fromPriceList])).sort((a, b) => a.localeCompare(b, "pt-BR"));
	}, [appSettings, prices]);
	const handleOpenGlobalConfig = () => {
		setGlobalErrors({});
		setGlobalAttempted(false);
		setConfigForm({
			cardFee: getSetting("global_card_fee") || "0",
			commission: getSetting("global_commission") || "0",
			inadimplency: getSetting("global_inadimplency") || "0",
			taxes: getSetting("global_taxes") || "0"
		});
		setGlobalConfigOpen(true);
	};
	const handleSaveGlobalConfig = async () => {
		setGlobalAttempted(true);
		const newErrors = {};
		if (isInvalidNumber(configForm.cardFee)) newErrors.cardFee = true;
		if (isInvalidNumber(configForm.commission)) newErrors.commission = true;
		if (isInvalidNumber(configForm.inadimplency)) newErrors.inadimplency = true;
		if (isInvalidNumber(configForm.taxes)) newErrors.taxes = true;
		setGlobalErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return toast({
			title: "Preencha os campos obrigatórios.",
			variant: "destructive"
		});
		await updateSettings({
			global_card_fee: configForm.cardFee || "0",
			global_commission: configForm.commission || "0",
			global_inadimplency: configForm.inadimplency || "0",
			global_taxes: configForm.taxes || "0"
		});
		toast({ title: "Taxas globais salvas com sucesso!" });
		setGlobalConfigOpen(false);
	};
	const handleGlobalChange = (field, value) => {
		setConfigForm((prev) => ({
			...prev,
			[field]: value
		}));
		if (globalAttempted || globalErrors[field]) setGlobalErrors((prev) => ({
			...prev,
			[field]: isInvalidNumber(value)
		}));
	};
	const handleGlobalBlur = (field) => {
		setGlobalErrors((prev) => ({
			...prev,
			[field]: isInvalidNumber(configForm[field])
		}));
	};
	const handleNew = () => {
		setFormErrors({});
		setHasAttemptedSubmit(false);
		setFormData({
			id: "",
			work_type: "",
			category: "PROTESE FIXA",
			material: "",
			price: "",
			sector: selectedLab === "Todos" ? "Soluções Cerâmicas" : selectedLab,
			execution_time: "",
			cadista_cost: "",
			material_cost: "",
			stages: []
		});
		setModalOpen(true);
	};
	const handleEdit = (item) => {
		setFormErrors({});
		setHasAttemptedSubmit(false);
		setFormData({
			id: item.id,
			work_type: item.work_type,
			category: item.category,
			material: item.material || "",
			price: item.price,
			sector: item.sector || "Soluções Cerâmicas",
			execution_time: item.execution_time ? String(item.execution_time) : "",
			cadista_cost: item.cadista_cost ? String(item.cadista_cost) : "",
			material_cost: item.material_cost ? String(item.material_cost) : "",
			stages: (item.price_stages || []).map((s) => ({
				name: s.name,
				price: String(s.price),
				kanban_stage: s.kanban_stage
			}))
		});
		setModalOpen(true);
	};
	const handleFormChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
		if (hasAttemptedSubmit || formErrors[field]) if (field === "price") setFormErrors((prev) => ({
			...prev,
			[field]: isInvalidNumber(value)
		}));
		else setFormErrors((prev) => ({
			...prev,
			[field]: !value.toString().trim()
		}));
	};
	const handleFormBlur = (field) => {
		if (field === "price") setFormErrors((prev) => ({
			...prev,
			[field]: isInvalidNumber(formData[field])
		}));
		else setFormErrors((prev) => ({
			...prev,
			[field]: !formData[field]?.toString().trim()
		}));
	};
	const handleSave = async () => {
		setHasAttemptedSubmit(true);
		const newErrors = {};
		if (!formData.work_type?.trim()) newErrors.work_type = true;
		if (isInvalidNumber(formData.price)) newErrors.price = true;
		formData.stages.forEach((stage, idx) => {
			if (!stage.name?.trim()) newErrors[`stage_${idx}_name`] = true;
			if (isInvalidNumber(stage.price)) newErrors[`stage_${idx}_price`] = true;
		});
		setFormErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return toast({
			title: "Preencha os campos obrigatórios.",
			variant: "destructive"
		});
		const execTimeForSave = parseLocalNum(formData.execution_time);
		const calculatedFixedCost = execTimeForSave * sharedCosts.costPerMinute;
		const payload = {
			work_type: formData.work_type,
			category: formData.category,
			material: formData.material,
			price: formData.price,
			sector: formData.sector,
			execution_time: execTimeForSave,
			cadista_cost: parseLocalNum(formData.cadista_cost),
			material_cost: parseLocalNum(formData.material_cost),
			fixed_cost: calculatedFixedCost
		};
		let priceListId = formData.id;
		if (priceListId) {
			const { error } = await supabase.from("price_list").update(payload).eq("id", priceListId);
			if (error) return toast({
				title: "Erro ao atualizar",
				variant: "destructive"
			});
			await supabase.from("price_stages").delete().eq("price_list_id", priceListId);
		} else {
			const { data, error } = await supabase.from("price_list").insert(payload).select().single();
			if (error) return toast({
				title: "Erro ao criar",
				variant: "destructive"
			});
			priceListId = data.id;
		}
		if (formData.stages.length > 0) {
			const stagesToInsert = formData.stages.map((s) => ({
				price_list_id: priceListId,
				name: s.name,
				price: parseLocalNum(s.price),
				kanban_stage: s.kanban_stage || kanbanStages[0]?.name || "TRIAGEM"
			}));
			await supabase.from("price_stages").insert(stagesToInsert);
		}
		toast({ title: "Procedimento salvo com sucesso!" });
		setModalOpen(false);
		fetchPrices();
	};
	const handleDelete = async (id) => {
		if (!confirm("Deseja excluir este procedimento?")) return;
		const { error } = await supabase.from("price_list").delete().eq("id", id);
		if (!error) {
			toast({ title: "Procedimento excluído" });
			fetchPrices();
		}
	};
	const updateStage = (index, key, value) => {
		const newStages = [...formData.stages];
		newStages[index][key] = value;
		setFormData({
			...formData,
			stages: newStages
		});
		if (hasAttemptedSubmit || formErrors[`stage_${index}_${key}`]) if (key === "price") setFormErrors((prev) => ({
			...prev,
			[`stage_${index}_${key}`]: isInvalidNumber(value)
		}));
		else setFormErrors((prev) => ({
			...prev,
			[`stage_${index}_${key}`]: !value.trim()
		}));
	};
	const handleStageBlur = (index, key) => {
		if (key === "price") setFormErrors((prev) => ({
			...prev,
			[`stage_${index}_${key}`]: isInvalidNumber(formData.stages[index][key])
		}));
		else setFormErrors((prev) => ({
			...prev,
			[`stage_${index}_${key}`]: !formData.stages[index][key]?.trim()
		}));
	};
	const priceNum = parseLocalNum(formData.price);
	const execTime = parseLocalNum(formData.execution_time);
	const cadistaVal = parseLocalNum(formData.cadista_cost);
	const materialVal = parseLocalNum(formData.material_cost);
	const globalCardFee = parseLocalNum(getSetting("global_card_fee"));
	const globalCommission = parseLocalNum(getSetting("global_commission"));
	const globalInadimplency = parseLocalNum(getSetting("global_inadimplency"));
	const globalTaxes = parseLocalNum(getSetting("global_taxes"));
	const { fixedCost, cardFeeVal, commissionVal, inadimplencyVal, taxesVal, totalCosts, profitVal, profitMargin } = calculateProcedureProfitability({
		price: priceNum,
		executionTime: execTime,
		cadistaCost: cadistaVal,
		materialCost: materialVal,
		costPerMinute: sharedCosts.costPerMinute,
		globalCardFee,
		globalCommission,
		globalInadimplency,
		globalTaxes
	});
	const fixedCostPerc = priceNum > 0 ? fixedCost / priceNum * 100 : 0;
	const materialCostPerc = priceNum > 0 ? materialVal / priceNum * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 bg-emerald-100 rounded-xl dark:bg-emerald-900/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-6 h-6 text-emerald-600 dark:text-emerald-400" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-primary",
						children: "Tabela de Preços"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Gerencie os valores cobrados por procedimento e analise margens."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 sm:gap-3 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/materials",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-4 h-4 mr-2" }), " Materiais"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: handleOpenGlobalConfig,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-4 h-4 mr-2" }), " Taxas Globais"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "hidden sm:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/hourly-cost",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-4 h-4 mr-2" }), " Custo Hora"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleNew,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " Novo Procedimento"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 bg-muted/30 p-3 rounded-lg border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm font-medium text-foreground flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4 text-muted-foreground" }), "Filtrar por Margem:"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroup, {
					type: "multiple",
					value: profitFilter,
					onValueChange: setProfitFilter,
					className: "justify-start flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroupItem, {
							value: "high",
							"aria-label": "Alta Margem",
							variant: "outline",
							className: "h-8 px-3 text-xs data-[state=on]:bg-emerald-100 data-[state=on]:border-emerald-300 data-[state=on]:text-emerald-900 dark:data-[state=on]:bg-emerald-900/40 dark:data-[state=on]:border-emerald-800 dark:data-[state=on]:text-emerald-300 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-sm" }), "Alta (> 20%)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroupItem, {
							value: "medium",
							"aria-label": "Margem Média",
							variant: "outline",
							className: "h-8 px-3 text-xs data-[state=on]:bg-amber-100 data-[state=on]:border-amber-300 data-[state=on]:text-amber-900 dark:data-[state=on]:bg-amber-900/40 dark:data-[state=on]:border-amber-800 dark:data-[state=on]:text-amber-300 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 shadow-sm" }), "Média (10% a 20%)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroupItem, {
							value: "low",
							"aria-label": "Baixa Margem",
							variant: "outline",
							className: "h-8 px-3 text-xs data-[state=on]:bg-red-100 data-[state=on]:border-red-300 data-[state=on]:text-red-900 dark:data-[state=on]:bg-red-900/40 dark:data-[state=on]:border-red-800 dark:data-[state=on]:text-red-300 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-red-500 mr-2 shadow-sm" }), "Baixa (< 10%)"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "pl-6 h-10 py-2",
							children: "Procedimento"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "h-10 py-2",
							children: "Setor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right h-10 py-2",
							children: "Valor Venda Final"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right h-10 py-2",
							children: "Tempo Exec."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right h-10 py-2",
							children: "Custo / Min"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right h-10 py-2",
							children: "Custo Fixo Est."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right pr-6 h-10 py-2",
							children: "Ações"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 7,
						className: "h-32 text-center text-muted-foreground",
						children: "Carregando procedimentos..."
					}) }) : filteredPrices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 7,
						className: "h-32 text-center text-muted-foreground",
						children: prices.length > 0 && profitFilter.length > 0 ? "Nenhum procedimento encontrado para o filtro de rentabilidade selecionado." : "Nenhum procedimento encontrado."
					}) }) : filteredPrices.map((item) => {
						const margin = getMargin(item);
						let containerClass = "flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-colors text-white ";
						let badgeClass = "px-1.5 py-0.5 rounded text-[11px] font-bold shadow-sm ";
						if (margin > 20) {
							containerClass += "bg-emerald-500 border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700";
							badgeClass += "bg-emerald-600/50 border border-emerald-400/50";
						} else if (margin >= 10) {
							containerClass += "bg-amber-500 border-amber-600 dark:bg-amber-600 dark:border-amber-700";
							badgeClass += "bg-amber-600/50 border border-amber-400/50";
						} else {
							containerClass += "bg-red-500 border-red-600 dark:bg-red-600 dark:border-red-700";
							badgeClass += "bg-red-600/50 border border-red-400/50";
						}
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "group hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "pl-6 py-1.5 min-w-[320px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: containerClass,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold tracking-tight leading-tight text-[13px]",
												children: item.work_type
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-medium text-white/80 mt-0 uppercase tracking-wider",
												children: item.category
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: badgeClass,
											children: [margin.toFixed(1), "%"]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "py-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "bg-muted/50 text-[10px] py-0 h-5",
										children: item.sector || "Geral"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-semibold py-1.5 text-[13px]",
									children: formatBRL(parseLocalNum(item.price))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right text-muted-foreground py-1.5 text-xs",
									children: item.execution_time ? `${item.execution_time} min` : "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right text-muted-foreground font-medium py-1.5 text-xs",
									children: formatBRL(sharedCosts.costPerMinute)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right text-muted-foreground py-1.5 text-xs",
									children: formatBRL((item.execution_time || 0) * sharedCosts.costPerMinute)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "text-right pr-6 py-1.5 space-x-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-7 w-7",
										onClick: () => handleEdit(item),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5 text-muted-foreground" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-7 w-7",
										onClick: () => handleDelete(item.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-red-500 hover:text-red-600" })
									})]
								})
							]
						}, item.id);
					}) })] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: globalConfigOpen,
				onOpenChange: setGlobalConfigOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Configurações Globais de Precificação" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mb-4",
								children: "Estas taxas em % serão aplicadas automaticamente na análise de rentabilidade de todos os procedimentos sobre o Valor de Venda Final."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Taxa de Cartão (%) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "text",
											inputMode: "decimal",
											value: configForm.cardFee,
											onChange: (e) => handleGlobalChange("cardFee", e.target.value),
											onBlur: () => handleGlobalBlur("cardFee"),
											className: cn(globalErrors.cardFee && "border-destructive focus-visible:ring-destructive")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Comissões (%) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "text",
											inputMode: "decimal",
											value: configForm.commission,
											onChange: (e) => handleGlobalChange("commission", e.target.value),
											onBlur: () => handleGlobalBlur("commission"),
											className: cn(globalErrors.commission && "border-destructive focus-visible:ring-destructive")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Inadimplência (%) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "text",
											inputMode: "decimal",
											value: configForm.inadimplency,
											onChange: (e) => handleGlobalChange("inadimplency", e.target.value),
											onBlur: () => handleGlobalBlur("inadimplency"),
											className: cn(globalErrors.inadimplency && "border-destructive focus-visible:ring-destructive")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Impostos (%) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "text",
											inputMode: "decimal",
											value: configForm.taxes,
											onChange: (e) => handleGlobalChange("taxes", e.target.value),
											onBlur: () => handleGlobalBlur("taxes"),
											className: cn(globalErrors.taxes && "border-destructive focus-visible:ring-destructive")
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setGlobalConfigOpen(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleSaveGlobalConfig,
							children: "Salvar Taxas"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: modalOpen,
				onOpenChange: setModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-5xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: formData.id ? "Editar Procedimento" : "Novo Procedimento" }) }),
						modalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HourlyCostDashboard, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-6 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-7 space-y-4 max-h-[55vh] overflow-y-auto px-1 pr-3 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Nome do Procedimento ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: formData.work_type,
												onChange: (e) => handleFormChange("work_type", e.target.value),
												onBlur: () => handleFormBlur("work_type"),
												className: cn(formErrors.work_type && "border-destructive focus-visible:ring-destructive")
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Categoria ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: formData.category,
												onValueChange: (v) => handleFormChange("category", v),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "PROTESE FIXA",
													children: "PROTESE FIXA"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "PRÓTESE MÓVEL",
													children: "PRÓTESE MÓVEL"
												})] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Setor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: formData.sector,
												onValueChange: (v) => handleFormChange("sector", v),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Soluções Cerâmicas",
													children: "Soluções Cerâmicas"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Studio Acrílico",
													children: "Studio Acrílico"
												})] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 col-span-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Material" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													list: "materials-list",
													placeholder: "Selecione ou digite um material...",
													value: formData.material,
													onChange: (e) => handleFormChange("material", e.target.value)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
													id: "materials-list",
													children: availableMaterials.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: m }, m))
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Valor de Venda Final (R$) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "text",
												inputMode: "decimal",
												placeholder: "150,00",
												value: formData.price,
												className: cn("font-semibold", formErrors.price && "border-destructive focus-visible:ring-destructive"),
												onChange: (e) => handleFormChange("price", e.target.value),
												onBlur: () => handleFormBlur("price")
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tempo de Execução (minutos)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "text",
												inputMode: "decimal",
												placeholder: "Ex: 45",
												value: formData.execution_time,
												onChange: (e) => handleFormChange("execution_time", e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-bold text-muted-foreground tracking-wider uppercase",
												children: "CUSTO FIXO ESPECÍFICO DESTE PROCEDIMENTO (Tempo × Custo/Min)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: formatBRL(fixedCost),
												readOnly: true,
												disabled: true,
												className: "bg-muted font-semibold text-primary cursor-not-allowed"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Custo Cadista / Terceiro (R$)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "text",
												inputMode: "decimal",
												placeholder: "0,00",
												value: formData.cadista_cost,
												onChange: (e) => handleFormChange("cadista_cost", e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Custo de Material (R$)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "text",
												inputMode: "decimal",
												placeholder: "0,00",
												value: formData.material_cost,
												onChange: (e) => handleFormChange("material_cost", e.target.value)
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 mt-6 border-t pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-base font-semibold",
											children: "Etapas de Faturamento (Opcional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: "Divida o valor por etapas do Kanban (não interfere no cálculo de lucro)."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => setFormData((p) => ({
												...p,
												stages: [...p.stages, {
													name: "",
													price: "",
													kanban_stage: kanbanStages[0]?.name || ""
												}]
											})),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-1" }), " Add Etapa"]
										})]
									}), formData.stages.map((stage, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 items-end bg-muted/40 p-3 rounded-md border border-border/50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
													className: "text-xs",
													children: ["Descrição ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													size: "sm",
													value: stage.name,
													onChange: (e) => updateStage(idx, "name", e.target.value),
													onBlur: () => handleStageBlur(idx, "name"),
													className: cn(formErrors[`stage_${idx}_name`] && "border-destructive focus-visible:ring-destructive")
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-24 space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
													className: "text-xs",
													children: ["Valor (R$) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													size: "sm",
													type: "text",
													inputMode: "decimal",
													value: stage.price,
													onChange: (e) => updateStage(idx, "price", e.target.value),
													onBlur: () => handleStageBlur(idx, "price"),
													className: cn(formErrors[`stage_${idx}_price`] && "border-destructive focus-visible:ring-destructive")
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-48 space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Gatilho (Kanban)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: stage.kanban_stage,
													onValueChange: (v) => updateStage(idx, "kanban_stage", v),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-9",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: kanbanStages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: s.name,
														children: s.name
													}, s.id)) })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "ghost",
												size: "icon",
												onClick: () => setFormData((p) => ({
													...p,
													stages: p.stages.filter((_, i) => i !== idx)
												})),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-destructive" })
											})
										]
									}, idx))]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg:col-span-5 flex flex-col",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border flex flex-col h-full sticky top-0 shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-semibold flex items-center gap-2 mb-4 text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-5 h-5" }), " Análise de Rentabilidade"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3 flex-1 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between font-medium",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preço de Venda Final" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg",
														children: formatBRL(priceNum)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border my-2" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Custo Fixo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															"- ",
															formatBRL(fixedCost),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "w-12 text-right text-[10px]",
																children: [
																	"(",
																	fixedCostPerc.toFixed(1),
																	"%)"
																]
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Custo Cadista / Terceiros" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															"- ",
															formatBRL(cadistaVal),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "w-12 text-right text-[10px]",
																children: [
																	"(",
																	priceNum > 0 ? (cadistaVal / priceNum * 100).toFixed(1) : 0,
																	"%)"
																]
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Custo de Material" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															"- ",
															formatBRL(materialVal),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "w-12 text-right text-[10px]",
																children: [
																	"(",
																	materialCostPerc.toFixed(1),
																	"%)"
																]
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border/50 my-2" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Taxa de Cartão ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px]",
														children: [
															"(",
															globalCardFee,
															"%)"
														]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															"- ",
															formatBRL(cardFeeVal),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-12" })
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Comissões ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px]",
														children: [
															"(",
															globalCommission,
															"%)"
														]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															"- ",
															formatBRL(commissionVal),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-12" })
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Impostos ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px]",
														children: [
															"(",
															globalTaxes,
															"%)"
														]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															"- ",
															formatBRL(taxesVal),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-12" })
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Inadimplência ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px]",
														children: [
															"(",
															globalInadimplency,
															"%)"
														]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															"- ",
															formatBRL(inadimplencyVal),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-12" })
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border my-2" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between font-medium text-destructive",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Custo Total Estimado" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatBRL(totalCosts) })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: cn("mt-6 p-4 rounded-lg border transition-colors", profitMargin >= 20 ? "bg-emerald-600 border-emerald-700 text-white dark:bg-emerald-900 dark:border-emerald-950" : profitMargin >= 10 ? "bg-amber-500 border-amber-600 text-white dark:bg-amber-600 dark:border-amber-700" : "bg-red-600 border-red-700 text-white dark:bg-red-900 dark:border-red-950"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] uppercase font-bold tracking-wider opacity-90 mb-0.5",
													children: "Lucro Líquido Estimado"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-2xl font-bold",
													children: formatBRL(profitVal)
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-right",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] uppercase font-bold tracking-wider opacity-90 mb-0.5",
														children: "Margem"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xl font-bold flex items-center justify-end gap-1",
														children: [
															profitMargin >= 20 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4" }),
															profitMargin.toFixed(1),
															"%"
														]
													})]
												})]
											}), profitMargin < 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 pt-3 border-t border-white/20",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] font-bold tracking-wide flex items-center gap-1.5 uppercase",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4" }), "ALERTA: PERIGO DE LUCRATIVIDADE BAIXA"]
												})
											})]
										})
									]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "mt-4 pt-4 border-t",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setModalOpen(false),
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleSave,
								children: "Salvar Procedimento"
							})]
						})
					]
				})
			})
		]
	});
}
export { PriceList as default };

//# sourceMappingURL=PriceList-Fk3DH-IU.js.map