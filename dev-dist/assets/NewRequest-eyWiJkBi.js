import { t as Check } from "./check-dUcWZTMk.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DEVFwjNT.js";
import { t as Circle } from "./circle-Dxkz6Chq.js";
import { t as RefreshCw } from "./refresh-cw-DmXJRU5q.js";
import { $ as useSize, B as supabase, Et as toast, It as require_react, Mt as useNavigate, Pt as useSearchParams, St as require_jsx_runtime, Tt as composeEventHandlers, a as useAppStore, at as createLucideIcon, ht as Primitive, it as X, lt as useControllableState, t as Button, tt as cn, ut as Presence, wt as useComposedRefs, xt as createContextScope, zt as __toESM } from "./index-DQXy234v.js";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-0CSPNzov.js";
import { t as Input } from "./input-CU5mGn_a.js";
import { t as Label } from "./label-TA1G2SYQ.js";
import { a as CommandInput, i as CommandGroup, o as CommandItem, r as CommandEmpty, s as CommandList, t as Command } from "./command-D3cTfbpS.js";
import "./es2015-DczLHeSc.js";
import "./dialog-DctOmr7p.js";
import { t as useDirection } from "./dist-1mweXEie.js";
import { t as usePrevious } from "./dist-BafnxAam.js";
import { n as Root, r as createRovingFocusGroupScope, t as Item } from "./dist-BRKorDj-.js";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-BTYnHqc2.js";
import { t as Textarea } from "./textarea-DwR_JF4y.js";
var ChevronsUpDown = createLucideIcon("chevrons-up-down", [["path", {
	d: "m7 15 5 5 5-5",
	key: "1hf1tw"
}], ["path", {
	d: "m7 9 5-5 5 5",
	key: "sgt6xg"
}]]);
var CloudUpload = createLucideIcon("cloud-upload", [
	["path", {
		d: "M12 13v8",
		key: "1l5pq0"
	}],
	["path", {
		d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
		key: "1pljnt"
	}],
	["path", {
		d: "m8 17 4-4 4 4",
		key: "1quai1"
	}]
]);
var File = createLucideIcon("file", [["path", {
	d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
	key: "1oefj6"
}], ["path", {
	d: "M14 2v5a1 1 0 0 0 1 1h5",
	key: "wfsgrz"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRadio, name, checked = false, required, disabled, value = "on", onCheck, form, ...radioProps } = props;
	const [button, setButton] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
	const hasConsumerStoppedPropagationRef = import_react.useRef(false);
	const isFormControl = button ? form || !!button.closest("form") : true;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioProvider, {
		scope: __scopeRadio,
		checked,
		disabled,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			role: "radio",
			"aria-checked": checked,
			"data-state": getState(checked),
			"data-disabled": disabled ? "" : void 0,
			disabled,
			value,
			...radioProps,
			ref: composedRefs,
			onClick: composeEventHandlers(props.onClick, (event) => {
				if (!checked) onCheck?.();
				if (isFormControl) {
					hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
					if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
				}
			})
		}), isFormControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioBubbleInput, {
			control: button,
			bubbles: !hasConsumerStoppedPropagationRef.current,
			name,
			value,
			checked,
			required,
			disabled,
			form,
			style: { transform: "translateX(-100%)" }
		})]
	});
});
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRadio, forceMount, ...indicatorProps } = props;
	const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.checked,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
			"data-state": getState(context.checked),
			"data-disabled": context.disabled ? "" : void 0,
			...indicatorProps,
			ref: forwardedRef
		})
	});
});
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = import_react.forwardRef(({ __scopeRadio, control, checked, bubbles = true, ...props }, forwardedRef) => {
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(ref, forwardedRef);
	const prevChecked = usePrevious(checked);
	const controlSize = useSize(control);
	import_react.useEffect(() => {
		const input = ref.current;
		if (!input) return;
		const inputProto = window.HTMLInputElement.prototype;
		const setChecked = Object.getOwnPropertyDescriptor(inputProto, "checked").set;
		if (prevChecked !== checked && setChecked) {
			const event = new Event("click", { bubbles });
			setChecked.call(input, checked);
			input.dispatchEvent(event);
		}
	}, [
		prevChecked,
		checked,
		bubbles
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.input, {
		type: "radio",
		"aria-hidden": true,
		defaultChecked: checked,
		...props,
		tabIndex: -1,
		ref: composedRefs,
		style: {
			...props.style,
			...controlSize,
			position: "absolute",
			pointerEvents: "none",
			opacity: 0,
			margin: 0
		}
	});
});
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
	return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = [
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext, createRadioGroupScope] = createContextScope(RADIO_GROUP_NAME, [createRovingFocusGroupScope, createRadioScope]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRadioGroup, name, defaultValue, value: valueProp, required = false, disabled = false, orientation, dir, loop = true, onValueChange, ...groupProps } = props;
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
	const direction = useDirection(dir);
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? null,
		onChange: onValueChange,
		caller: RADIO_GROUP_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupProvider, {
		scope: __scopeRadioGroup,
		name,
		required,
		disabled,
		value,
		onValueChange: setValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
			asChild: true,
			...rovingFocusGroupScope,
			orientation,
			dir: direction,
			loop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				role: "radiogroup",
				"aria-required": required,
				"aria-orientation": orientation,
				"data-disabled": disabled ? "" : void 0,
				dir: direction,
				...groupProps,
				ref: forwardedRef
			})
		})
	});
});
RadioGroup$1.displayName = RADIO_GROUP_NAME;
var ITEM_NAME = "RadioGroupItem";
var RadioGroupItem$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRadioGroup, disabled, ...itemProps } = props;
	const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
	const isDisabled = context.disabled || disabled;
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
	const radioScope = useRadioScope(__scopeRadioGroup);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const checked = context.value === itemProps.value;
	const isArrowKeyPressedRef = import_react.useRef(false);
	import_react.useEffect(() => {
		const handleKeyDown = (event) => {
			if (ARROW_KEYS.includes(event.key)) isArrowKeyPressedRef.current = true;
		};
		const handleKeyUp = () => isArrowKeyPressedRef.current = false;
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: !isDisabled,
		active: checked,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, {
			disabled: isDisabled,
			required: context.required,
			checked,
			...radioScope,
			...itemProps,
			name: context.name,
			ref: composedRefs,
			onCheck: () => context.onValueChange(itemProps.value),
			onKeyDown: composeEventHandlers((event) => {
				if (event.key === "Enter") event.preventDefault();
			}),
			onFocus: composeEventHandlers(itemProps.onFocus, () => {
				if (isArrowKeyPressedRef.current) ref.current?.click();
			})
		})
	});
});
RadioGroupItem$1.displayName = ITEM_NAME;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRadioGroup, ...indicatorProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioIndicator, {
		...useRadioScope(__scopeRadioGroup),
		...indicatorProps,
		ref: forwardedRef
	});
});
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup$1;
var Item2 = RadioGroupItem$1;
var Indicator = RadioGroupIndicator;
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = Root2.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2.5 w-2.5 fill-current text-current" })
		})
	});
});
RadioGroupItem.displayName = Item2.displayName;
var quadrants = [
	{
		id: 1,
		teeth: [
			18,
			17,
			16,
			15,
			14,
			13,
			12,
			11
		]
	},
	{
		id: 2,
		teeth: [
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28
		]
	},
	{
		id: 4,
		teeth: [
			48,
			47,
			46,
			45,
			44,
			43,
			42,
			41
		]
	},
	{
		id: 3,
		teeth: [
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38
		]
	}
];
function TeethSelector({ value, onChange, arches = [], onArchesChange }) {
	const toggleTooth = (tooth) => {
		if (value.includes(tooth)) onChange(value.filter((t) => t !== tooth));
		else onChange([...value, tooth].sort());
	};
	const toggleArch = (arch) => {
		if (!onArchesChange) return;
		if (arches.includes(arch)) onArchesChange(arches.filter((a) => a !== arch));
		else onArchesChange([...arches, arch]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 items-center bg-background p-4 rounded-lg border w-full overflow-x-auto",
		children: [
			onArchesChange && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-4 mb-2 w-full justify-center items-center pb-4 border-b border-primary/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-muted-foreground mr-2",
						children: "Arco Total:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: arches.includes("MAXILA") ? "default" : "outline",
						onClick: () => toggleArch("MAXILA"),
						size: "sm",
						className: "w-32",
						children: "MAXILA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: arches.includes("MANDIBULA") ? "default" : "outline",
						onClick: () => toggleArch("MANDIBULA"),
						size: "sm",
						className: "w-32",
						children: "MANDÍBULA"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 min-w-max",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-6 border-b-2 border-primary/20 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 border-r-2 border-primary/20 pr-4",
						children: quadrants[0].teeth.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToothBtn, {
							t,
							selected: value.includes(t),
							onClick: () => toggleTooth(t)
						}, t))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 pl-2",
						children: quadrants[1].teeth.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToothBtn, {
							t,
							selected: value.includes(t),
							onClick: () => toggleTooth(t)
						}, t))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-6 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 border-r-2 border-primary/20 pr-4",
						children: quadrants[2].teeth.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToothBtn, {
							t,
							selected: value.includes(t),
							onClick: () => toggleTooth(t)
						}, t))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 pl-2",
						children: quadrants[3].teeth.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToothBtn, {
							t,
							selected: value.includes(t),
							onClick: () => toggleTooth(t)
						}, t))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-2",
				children: "Clique nos elementos para selecionar (Odontograma FDI)"
			})
		]
	});
}
function ToothBtn({ t, selected, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("w-8 h-10 flex flex-col items-center justify-center rounded text-xs font-medium transition-all shadow-sm border", selected ? "bg-primary text-primary-foreground border-primary scale-105 shadow-md" : "bg-muted/50 text-foreground hover:bg-muted"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "opacity-50 text-[10px] mb-0.5",
			children: Math.floor(t / 10)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t % 10 })]
	});
}
function NewRequest() {
	const { addOrder, currentUser, priceList, appSettings, effectiveRole, Visualizando_Como_ID } = useAppStore();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const isAdjustment = searchParams.get("type") === "adjustment";
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [availableWorkTypes, setAvailableWorkTypes] = (0, import_react.useState)([]);
	const [dentistsList, setDentistsList] = (0, import_react.useState)([]);
	const [scaleOpen, setScaleOpen] = (0, import_react.useState)(false);
	const [patientSearch, setPatientSearch] = (0, import_react.useState)("");
	const [patientList, setPatientList] = (0, import_react.useState)([]);
	const [patientOpen, setPatientOpen] = (0, import_react.useState)(false);
	const [selectedFiles, setSelectedFiles] = (0, import_react.useState)([]);
	const [partnerPrices, setPartnerPrices] = (0, import_react.useState)({});
	const [hasCustomPrices, setHasCustomPrices] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)({
		dentistId: "",
		patientName: "",
		patientCpf: "",
		patientBirthDate: "",
		sector: "",
		workType: "",
		material: "",
		shade: "",
		shadeScale: "",
		shippingMethod: "lab_pickup",
		stlDeliveryMethod: "",
		observations: "",
		implantBrand: "",
		implantType: "",
		estruturaFixacao: "SOBRE DENTE"
	});
	const [selectedTeeth, setSelectedTeeth] = (0, import_react.useState)([]);
	const [selectedArches, setSelectedArches] = (0, import_react.useState)([]);
	const isInternalUser = effectiveRole === "admin" || effectiveRole === "master" || effectiveRole === "receptionist" || effectiveRole === "technical_assistant" || effectiveRole === "financial" || effectiveRole === "relationship_manager";
	const availableScales = (0, import_react.useMemo)(() => {
		if (appSettings["shade_scales"]) try {
			return JSON.parse(appSettings["shade_scales"]).sort((a, b) => a.localeCompare(b, "pt-BR"));
		} catch (e) {
			console.error("Failed to parse shade_scales", e);
		}
		return [];
	}, [appSettings]);
	const availableImplantBrands = (0, import_react.useMemo)(() => {
		if (appSettings["implant_brands"]) try {
			return JSON.parse(appSettings["implant_brands"]).sort((a, b) => a.localeCompare(b, "pt-BR"));
		} catch (e) {
			console.error("Failed to parse implant_brands", e);
		}
		return [];
	}, [appSettings]);
	(0, import_react.useEffect)(() => {
		if (isInternalUser) {
			const fetchDentists = async () => {
				const { data } = await supabase.from("profiles").select("id, name").in("role", ["dentist", "laboratory"]).eq("is_active", true);
				if (data) setDentistsList(data.map((d) => ({
					id: d.id,
					name: d.name
				})).sort((a, b) => a.name.localeCompare(b.name, "pt-BR")));
			};
			fetchDentists();
		}
	}, [isInternalUser]);
	(0, import_react.useEffect)(() => {
		if (isAdjustment && patientSearch.length >= 3) {
			const dentistIdToUse = isInternalUser ? formData.dentistId : Visualizando_Como_ID || currentUser?.id;
			if (!dentistIdToUse) return;
			const fetchP = async () => {
				const { data } = await supabase.from("orders").select("patient_name").eq("dentist_id", dentistIdToUse).ilike("patient_name", `%${patientSearch}%`).order("created_at", { ascending: false }).limit(50);
				if (data) setPatientList(Array.from(new Set(data.map((d) => d.patient_name))));
			};
			const timeout = setTimeout(() => {
				fetchP();
			}, 300);
			return () => clearTimeout(timeout);
		} else setPatientList([]);
	}, [
		isAdjustment,
		patientSearch,
		isInternalUser,
		formData.dentistId,
		currentUser?.id,
		Visualizando_Como_ID
	]);
	(0, import_react.useEffect)(() => {
		const fetchPartnerPrices = async () => {
			const id = isInternalUser ? formData.dentistId : Visualizando_Como_ID || currentUser?.id;
			if (!id) {
				setPartnerPrices({});
				setHasCustomPrices(false);
				return;
			}
			const { data } = await supabase.from("partner_prices").select("*").eq("partner_id", id);
			if (data && data.length > 0) {
				const pricesMap = {};
				data.forEach((p) => {
					pricesMap[p.price_list_id] = p;
				});
				setPartnerPrices(pricesMap);
				setHasCustomPrices(true);
			} else {
				setPartnerPrices({});
				setHasCustomPrices(false);
			}
		};
		fetchPartnerPrices();
	}, [
		isInternalUser,
		formData.dentistId,
		currentUser?.id,
		Visualizando_Como_ID
	]);
	(0, import_react.useEffect)(() => {
		if (formData.sector) {
			const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
			const normalizedFormSector = normalize(formData.sector);
			let filteredList = priceList.filter((p) => {
				const catMatch = p.category && normalize(p.category) === normalizedFormSector;
				const secMatch = p.sector && normalize(p.sector) === normalizedFormSector;
				return catMatch || secMatch;
			});
			if (hasCustomPrices) filteredList = filteredList.filter((p) => {
				const pp = partnerPrices[p.id];
				return pp && pp.is_enabled;
			});
			const filtered = Array.from(new Set(filteredList.map((p) => p.work_type).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR"));
			setAvailableWorkTypes(filtered);
			if (formData.workType && !filtered.includes(formData.workType)) setFormData((prev) => ({
				...prev,
				workType: ""
			}));
		} else setAvailableWorkTypes([]);
	}, [
		formData.sector,
		priceList,
		hasCustomPrices,
		partnerPrices
	]);
	(0, import_react.useEffect)(() => {
		if (formData.workType && formData.sector && !isAdjustment) {
			let possibleItems = priceList.filter((p) => p.work_type === formData.workType && p.sector === formData.sector);
			if (possibleItems.length === 0) possibleItems = priceList.filter((p) => p.work_type === formData.workType);
			if (hasCustomPrices) possibleItems = possibleItems.filter((p) => partnerPrices[p.id] && partnerPrices[p.id].is_enabled);
			const priceItem = possibleItems[0];
			if (priceItem && priceItem.material) setFormData((prev) => ({
				...prev,
				material: priceItem.material
			}));
			else setFormData((prev) => ({
				...prev,
				material: ""
			}));
		}
	}, [
		formData.workType,
		formData.sector,
		priceList,
		isAdjustment,
		hasCustomPrices,
		partnerPrices
	]);
	const isSobreImplante = formData.estruturaFixacao === "SOBRE IMPLANTE";
	(0, import_react.useEffect)(() => {
		if (!isSobreImplante) setFormData((prev) => ({
			...prev,
			implantBrand: "",
			implantType: ""
		}));
	}, [isSobreImplante]);
	const handleFileChange = (e) => {
		if (e.target.files) {
			const filesArr = Array.from(e.target.files);
			setSelectedFiles((prev) => [...prev, ...filesArr]);
		}
	};
	const removeFile = (index) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.patientName) return;
		if (isInternalUser && !formData.dentistId) {
			toast({
				title: "Atenção",
				description: "Selecione um dentista para este pedido.",
				variant: "destructive"
			});
			return;
		}
		if (!isAdjustment) {
			if (!formData.workType || !formData.sector) return;
			if (!formData.material) {
				toast({
					title: "Atenção",
					description: "O material não foi definido automaticamente. Verifique o tipo de trabalho selecionado.",
					variant: "destructive"
				});
				return;
			}
			if (isSobreImplante) {
				if (!formData.implantBrand) {
					toast({
						title: "Atenção",
						description: "A Marca do Componente é obrigatória para este procedimento.",
						variant: "destructive"
					});
					return;
				}
				if (!formData.implantType) {
					toast({
						title: "Atenção",
						description: "O Tipo do Componente é obrigatório para este procedimento.",
						variant: "destructive"
					});
					return;
				}
			}
		} else if (!formData.observations) {
			toast({
				title: "Atenção",
				description: "Por favor, descreva qual o ajuste necessário.",
				variant: "destructive"
			});
			return;
		}
		setSubmitting(true);
		let fileUrls = [];
		if (selectedFiles.length > 0) for (const file of selectedFiles) {
			const fileExt = file.name.split(".").pop();
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
			const filePath = `${currentUser?.id}/${fileName}`;
			const { error: uploadError } = await supabase.storage.from("order_files").upload(filePath, file);
			if (!uploadError) {
				const { data } = supabase.storage.from("order_files").getPublicUrl(filePath);
				fileUrls.push(data.publicUrl);
			} else toast({
				title: "Erro de upload",
				description: `Falha ao enviar arquivo ${file.name}`,
				variant: "destructive"
			});
		}
		const success = await addOrder({
			...formData,
			isAdjustmentReturn: isAdjustment,
			workType: isAdjustment ? "AJUSTE" : formData.workType,
			sector: isAdjustment ? "SOLUÇÕES CERÂMICAS" : formData.sector,
			material: isAdjustment ? "N/A" : formData.material,
			stlDeliveryMethod: formData.shippingMethod === "dentist_send" ? formData.stlDeliveryMethod : "",
			teeth: isAdjustment ? [] : selectedTeeth,
			arches: isAdjustment ? [] : selectedArches,
			fileUrls
		});
		setSubmitting(false);
		if (success) navigate("/app");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-4xl mx-auto py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-elevation border-muted/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "bg-muted/30 border-b pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: cn("text-2xl uppercase tracking-tight font-bold", isAdjustment ? "text-yellow-600 dark:text-yellow-500" : "text-primary"),
					children: isAdjustment ? "NOVO PEDIDO DE AJUSTE" : "NOVO PEDIDO VITALI LAB"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: isAdjustment ? "Solicitação de retorno para ajustes ou correções (Sem custo)." : "Preencha os detalhes clínicos do paciente e especificações." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-8 pt-8",
					children: [
						isAdjustment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-xl flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-yellow-800 dark:text-yellow-400 font-semibold text-sm",
								children: "Retorno para Ajustes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-yellow-700 dark:text-yellow-500/80 text-xs mt-1",
								children: "Este pedido será processado com custo R$ 0,00 e receberá prioridade na produção."
							})] })]
						}),
						isInternalUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-5 border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "uppercase font-bold text-xs text-emerald-800 dark:text-emerald-300",
								children: "Dentistas *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.dentistId,
								onValueChange: (v) => {
									setFormData({
										...formData,
										dentistId: v,
										patientName: ""
									});
									setPatientSearch("");
								},
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11 bg-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um dentista..." })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: dentistsList.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: d.id,
									children: d.name
								}, d.id)) })]
							})]
						}),
						isAdjustment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "uppercase font-semibold text-xs text-yellow-700 dark:text-yellow-500",
									children: "NOME DO PACIENTE *"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
									open: patientOpen,
									onOpenChange: setPatientOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											role: "combobox",
											"aria-expanded": patientOpen,
											className: cn("w-full justify-between h-12 text-lg font-medium border-yellow-400 focus-visible:ring-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/10 hover:bg-yellow-50 dark:hover:bg-yellow-900/20", !formData.patientName && "text-muted-foreground"),
											disabled: isInternalUser && !formData.dentistId,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: formData.patientName || "Selecione o paciente do histórico..."
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
										className: "w-[--radix-popover-trigger-width] p-0",
										align: "start",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command, {
											shouldFilter: false,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
												placeholder: "Buscar paciente (digite 3 ou mais letras)...",
												value: patientSearch,
												onValueChange: setPatientSearch
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: patientSearch.length < 3 ? "Digite pelo menos 3 caracteres para buscar." : "Nenhum paciente encontrado." }), patientSearch.length >= 3 && patientList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, { children: patientList.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
												value: p,
												onSelect: () => {
													setFormData((prev) => ({
														...prev,
														patientName: p
													}));
													setPatientOpen(false);
													setPatientSearch("");
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("mr-2 h-4 w-4", formData.patientName === p ? "opacity-100" : "opacity-0") }), p]
											}, p)) })] })]
										})
									})]
								}),
								isInternalUser && !formData.dentistId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-yellow-600 font-medium mt-1",
									children: "Selecione um dentista primeiro para buscar os pacientes."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "uppercase font-semibold text-xs text-muted-foreground",
								children: "NOME COMPLETO DO PACIENTE *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								placeholder: "Ex: João da Silva",
								value: formData.patientName,
								onChange: (e) => setFormData({
									...formData,
									patientName: e.target.value
								}),
								className: "h-12 text-lg font-medium"
							})]
						}),
						!isAdjustment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "uppercase font-semibold text-xs text-muted-foreground",
										children: "CPF do Paciente (Opcional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "000.000.000-00",
										value: formData.patientCpf,
										onChange: (e) => setFormData({
											...formData,
											patientCpf: e.target.value
										}),
										className: "h-11"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "uppercase font-semibold text-xs text-muted-foreground",
										children: "Data de Nascimento (Opcional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: formData.patientBirthDate,
										onChange: (e) => setFormData({
											...formData,
											patientBirthDate: e.target.value
										}),
										className: "h-11"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "uppercase font-semibold text-xs",
										children: "Setor do Laboratório *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: formData.sector,
										onValueChange: (v) => setFormData({
											...formData,
											sector: v
										}),
										required: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-11",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione..." })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "SOLUÇÕES CERÂMICAS",
											children: "Soluções Cerâmicas"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "STÚDIO ACRÍLICO",
											children: "Stúdio Acrílico"
										})] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "uppercase font-semibold text-xs",
										children: "Tipo de Trabalho *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: formData.workType,
										onValueChange: (v) => setFormData({
											...formData,
											workType: v
										}),
										required: true,
										disabled: !formData.sector || availableWorkTypes.length === 0,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-11",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: !formData.sector ? "Selecione o setor..." : availableWorkTypes.length === 0 ? "Nenhum trabalho cadastrado" : "Selecione..." })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availableWorkTypes.map((wt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: wt,
											children: wt
										}, wt)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 bg-muted/10 p-5 rounded-xl border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "uppercase font-semibold text-xs text-muted-foreground",
									children: "Seleção de Elementos (Odontograma)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeethSelector, {
									value: selectedTeeth,
									onChange: setSelectedTeeth,
									arches: selectedArches,
									onArchesChange: setSelectedArches
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 bg-muted/10 p-5 rounded-xl border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase font-semibold text-xs",
												children: "Estrutura de Fixação *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: formData.estruturaFixacao,
												onValueChange: (v) => setFormData({
													...formData,
													estruturaFixacao: v
												}),
												required: true,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-11 bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione..." })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "SOBRE DENTE",
													children: "SOBRE DENTE"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "SOBRE IMPLANTE",
													children: "SOBRE IMPLANTE"
												})] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase font-semibold text-xs",
												children: "Material *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: formData.material,
												readOnly: true,
												className: "h-11 bg-muted cursor-not-allowed font-medium text-muted-foreground",
												placeholder: "Auto-preenchido..."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase font-semibold text-xs",
												children: "COR BASE"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Ex: A2, BL1...",
												value: formData.shade,
												onChange: (e) => setFormData({
													...formData,
													shade: e.target.value
												}),
												className: "h-11 bg-background"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase font-semibold text-xs",
												children: "Escala Usada"
											}), availableScales.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
												open: scaleOpen,
												onOpenChange: setScaleOpen,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														role: "combobox",
														"aria-expanded": scaleOpen,
														className: "w-full justify-between h-11 font-normal bg-background",
														children: [formData.shadeScale ? availableScales.find((s) => s === formData.shadeScale) || formData.shadeScale : "Selecione a escala...", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })]
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
													className: "w-[--radix-popover-trigger-width] p-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, { placeholder: "Buscar escala..." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "Nenhuma escala encontrada." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, { children: availableScales.map((scale) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
														value: scale,
														onSelect: (currentValue) => {
															setFormData((prev) => ({
																...prev,
																shadeScale: currentValue === formData.shadeScale ? "" : currentValue
															}));
															setScaleOpen(false);
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("mr-2 h-4 w-4", formData.shadeScale === scale ? "opacity-100" : "opacity-0") }), scale]
													}, scale)) })] })] })
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Ex: VITA...",
												value: formData.shadeScale,
												onChange: (e) => setFormData({
													...formData,
													shadeScale: e.target.value
												}),
												className: "h-11 bg-background"
											})]
										})
									]
								}), isSobreImplante && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-6 sm:grid-cols-2 pt-4 border-t border-border/60 animate-fade-in-down",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase font-semibold text-xs text-primary",
											children: "Marca do Componente *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: formData.implantBrand,
											onValueChange: (v) => setFormData({
												...formData,
												implantBrand: v
											}),
											required: isSobreImplante,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-11 bg-background border-primary/30 focus:border-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: availableImplantBrands.length === 0 ? "Nenhuma marca cadastrada" : "Selecione a marca..." })
											}), availableImplantBrands.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availableImplantBrands.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: b,
												children: b
											}, b)) })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase font-semibold text-xs text-primary",
											children: "Tipo do Componente *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: Munhão Universal, Ucla...",
											value: formData.implantType,
											onChange: (e) => setFormData({
												...formData,
												implantType: e.target.value
											}),
											className: "h-11 bg-background border-primary/30 focus:border-primary",
											required: isSobreImplante
										})]
									})]
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: cn("uppercase font-semibold", isAdjustment ? "text-sm text-yellow-700 dark:text-yellow-500" : "text-xs"),
								children: isAdjustment ? "QUAL O AJUSTE NECESSÁRIO? *" : "Observações Adicionais"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								placeholder: isAdjustment ? "Descreva detalhadamente o ajuste que precisa ser feito..." : "Instruções sobre textura, formato...",
								className: cn("min-h-[100px]", isAdjustment && "border-yellow-400 focus-visible:ring-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/10"),
								value: formData.observations,
								onChange: (e) => setFormData({
									...formData,
									observations: e.target.value
								}),
								required: isAdjustment
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 bg-muted/20 p-5 rounded-xl border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-base font-semibold",
									children: "Método de Envio do Molde/Escaneamento"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
									value: formData.shippingMethod,
									onValueChange: (v) => setFormData({
										...formData,
										shippingMethod: v
									}),
									className: "flex flex-col space-y-3 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center space-x-3 bg-background p-3 rounded-lg border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
											value: "lab_pickup",
											id: "r1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "r1",
											className: "cursor-pointer flex-1",
											children: "Solicitar motoboy do laboratório"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center space-x-3 bg-background p-3 rounded-lg border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
											value: "dentist_send",
											id: "r2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "r2",
											className: "font-bold cursor-pointer flex-1",
											children: "VOU ENVIAR ARQUIVO STL / LINK"
										})]
									})]
								}),
								formData.shippingMethod === "dentist_send" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-4 border-t space-y-6 animate-fade-in-down",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "uppercase font-semibold text-xs text-primary",
												children: "ANEXAR ARQUIVOS STL/DIGITAIS"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center justify-center w-full",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "dropzone-file",
													className: "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 border-primary/20 hover:border-primary/50 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-col items-center justify-center pt-5 pb-6",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-8 h-8 mb-2 text-primary/60" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "mb-1 text-sm text-muted-foreground font-medium",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "font-semibold text-primary",
																		children: "Clique para anexar"
																	}),
																	" ",
																	"ou arraste e solte"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-muted-foreground opacity-70",
																children: ".STL, .PLY, .OBJ, .ZIP (Max 50MB)"
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														id: "dropzone-file",
														type: "file",
														className: "hidden",
														multiple: true,
														accept: ".stl,.obj,.ply,.zip,.rar",
														onChange: handleFileChange
													})]
												})
											}),
											selectedFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid gap-2 grid-cols-1 sm:grid-cols-2 mt-3",
												children: selectedFiles.map((file, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between p-2 text-sm bg-background border rounded-md",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 overflow-hidden",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "w-4 h-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate max-w-[200px]",
															children: file.name
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "ghost",
														size: "icon",
														className: "w-6 h-6 text-destructive shrink-0",
														onClick: () => removeFile(idx),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
													})]
												}, idx))
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase font-semibold text-xs text-primary",
											children: "OU FORNEÇA UM LINK DE ENVIO (WeTransfer, Drive, etc)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Cole o link aqui...",
											value: formData.stlDeliveryMethod,
											onChange: (e) => setFormData({
												...formData,
												stlDeliveryMethod: e.target.value
											}),
											className: "h-11 bg-background"
										})]
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardFooter, {
					className: "bg-muted/20 border-t px-6 py-5 flex justify-end gap-3 rounded-b-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => navigate(-1),
						className: "h-11 px-6 bg-background",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: cn("h-11 px-8 text-base", isAdjustment && "bg-yellow-500 hover:bg-yellow-600 text-yellow-950 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-yellow-50"),
						disabled: submitting,
						children: submitting ? "Enviando..." : isAdjustment ? "Enviar Retorno" : "Enviar Pedido"
					})]
				})]
			})]
		})
	});
}
export { NewRequest as default };

//# sourceMappingURL=NewRequest-eyWiJkBi.js.map