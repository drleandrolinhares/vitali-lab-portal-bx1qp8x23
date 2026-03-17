import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DBq69sob.js";
import { t as Package } from "./package-E8xjKY_b.js";
import { t as Plus } from "./plus-CMkdONN1.js";
import { t as Trash2 } from "./trash-2-CS-S_Akx.js";
import { B as supabase, Et as toast, It as require_react, St as require_jsx_runtime, a as useAppStore, at as createLucideIcon, it as X, l as formatBRL, t as Button, tt as cn, zt as __toESM } from "./index-DBUHfinl.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-CjvKKKma.js";
import { t as Input } from "./input-xY-rEKVk.js";
import { t as Label } from "./label-D0FFln-E.js";
import "./es2015-BarI0QaR.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DWNkZieX.js";
import { t as Badge } from "./badge-fO5BZ5zc.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-D5E1lVRu.js";
import { t as Textarea } from "./textarea-BsnyD9Tc.js";
var ArrowDownRight = createLucideIcon("arrow-down-right", [["path", {
	d: "m7 7 10 10",
	key: "1fmybs"
}], ["path", {
	d: "M17 7v10H7",
	key: "6fjiku"
}]]);
var ArrowUpRight = createLucideIcon("arrow-up-right", [["path", {
	d: "M7 7h10v10",
	key: "1tivn9"
}], ["path", {
	d: "M7 17 17 7",
	key: "1vkiza"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var formatQty = (q) => {
	const num = Number(q);
	if (isNaN(num)) return "0";
	return num % 1 === 0 ? num.toString() : num.toFixed(2);
};
function Inventory() {
	const { selectedLab, currentUser, logAudit } = useAppStore();
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [productModal, setProductModal] = (0, import_react.useState)({
		open: false,
		mode: "create",
		item: null
	});
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		purchase_cost: "",
		packagingTypes: [""],
		items_per_box: "1",
		usage_factor: "1",
		minimum_stock_level: "0",
		storage_location: "",
		initial_quantity: "",
		last_purchase_brand: "",
		last_purchase_value: "",
		observations: ""
	});
	const [baixaModal, setBaixaModal] = (0, import_react.useState)({
		open: false,
		item: null
	});
	const [baixaData, setBaixaData] = (0, import_react.useState)({
		qty: "",
		type: "box"
	});
	const fetchItems = async () => {
		setLoading(true);
		const { data } = await supabase.from("inventory_items").select("*, inventory_transactions(*)").order("name");
		if (data) setItems(data.map((item) => {
			const calculatedQty = (item.inventory_transactions || []).reduce((acc, t) => {
				if (t.type === "in") return acc + Number(t.quantity);
				if (t.type === "out") return acc - Number(t.quantity);
				return acc;
			}, 0);
			return {
				...item,
				quantity: calculatedQty
			};
		}));
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchItems();
	}, []);
	const filteredItems = (0, import_react.useMemo)(() => {
		return items.filter((i) => selectedLab === "Todos" || i.sector === selectedLab);
	}, [items, selectedLab]);
	const openModal = (mode, item) => {
		if (item) {
			let initialPackaging = [];
			if (item.packaging_types && item.packaging_types.length > 0) initialPackaging = [...item.packaging_types];
			else if (item.packaging_type) initialPackaging = [item.packaging_type];
			if (mode !== "view") initialPackaging.push("");
			else if (initialPackaging.length === 0) initialPackaging = ["-"];
			setFormData({
				name: item.name,
				purchase_cost: String(item.purchase_cost || ""),
				packagingTypes: initialPackaging,
				items_per_box: String(item.items_per_box || "1"),
				usage_factor: String(item.usage_factor || "1"),
				minimum_stock_level: String(item.minimum_stock_level || "0"),
				storage_location: item.storage_location || "",
				initial_quantity: "",
				last_purchase_brand: item.last_purchase_brand || "",
				last_purchase_value: String(item.last_purchase_value || ""),
				observations: item.observations || ""
			});
		} else setFormData({
			name: "",
			purchase_cost: "",
			packagingTypes: [""],
			items_per_box: "1",
			usage_factor: "1",
			minimum_stock_level: "0",
			storage_location: "",
			initial_quantity: "",
			last_purchase_brand: "",
			last_purchase_value: "",
			observations: ""
		});
		setProductModal({
			open: true,
			mode,
			item: item || null
		});
	};
	const handlePackagingChange = (index, value) => {
		if (productModal.mode === "view") return;
		const newTypes = [...formData.packagingTypes];
		newTypes[index] = value;
		if (index === newTypes.length - 1 && value.trim() !== "") newTypes.push("");
		setFormData({
			...formData,
			packagingTypes: newTypes
		});
	};
	const removePackaging = (index) => {
		if (productModal.mode === "view") return;
		const newTypes = formData.packagingTypes.filter((_, i) => i !== index);
		if (newTypes.length === 0) newTypes.push("");
		setFormData({
			...formData,
			packagingTypes: newTypes
		});
	};
	const costVal = Number(formData.purchase_cost.replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0;
	const yieldProd = Number(formData.usage_factor) || 1;
	const unitProdCost = yieldProd > 0 ? costVal / yieldProd : 0;
	const qtyBought = Number(formData.initial_quantity) || 0;
	const totalCost = costVal * qtyBought;
	const handleSaveProduct = async () => {
		if (productModal.mode === "view") return;
		if (!formData.name || !formData.purchase_cost || !formData.usage_factor) return toast({
			title: "Preencha os campos obrigatórios",
			variant: "destructive"
		});
		if (productModal.mode === "in" && qtyBought <= 0) return toast({
			title: "Quantidade Inválida",
			description: "Informe a quantidade comprada para registrar a entrada.",
			variant: "destructive"
		});
		const packTypes = formData.packagingTypes.filter((t) => t.trim() !== "" && t !== "-");
		const payload = {
			name: formData.name,
			purchase_cost: costVal,
			unit_price: unitProdCost,
			packaging_types: packTypes,
			items_per_box: Number(formData.items_per_box) || 1,
			usage_factor: yieldProd,
			minimum_stock_level: Number(formData.minimum_stock_level) || 0,
			storage_location: formData.storage_location,
			last_purchase_brand: formData.last_purchase_brand,
			last_purchase_value: Number(formData.last_purchase_value.replace(/[^0-9,-]+/g, "").replace(",", ".")) || null,
			observations: formData.observations,
			sector: selectedLab === "Todos" ? "Soluções Cerâmicas" : selectedLab
		};
		if (productModal.mode === "create") {
			const { data: insertedItem, error } = await supabase.from("inventory_items").insert({
				...payload,
				quantity: 0
			}).select().single();
			if (error) return toast({
				title: "Erro ao criar",
				description: error.message,
				variant: "destructive"
			});
			if (qtyBought > 0 && insertedItem) await supabase.from("inventory_transactions").insert({
				item_id: insertedItem.id,
				type: "in",
				quantity: qtyBought
			});
			toast({ title: "Produto cadastrado!" });
		} else if (productModal.mode === "in") {
			const { error } = await supabase.from("inventory_items").update(payload).eq("id", productModal.item.id);
			if (error) return toast({
				title: "Erro ao atualizar",
				description: error.message,
				variant: "destructive"
			});
			if (qtyBought > 0) await supabase.from("inventory_transactions").insert({
				item_id: productModal.item.id,
				type: "in",
				quantity: qtyBought
			});
			toast({ title: "Entrada registrada e produto atualizado!" });
		}
		setProductModal({
			open: false,
			mode: "create",
			item: null
		});
		fetchItems();
	};
	const handleDelete = async (item) => {
		if (!window.confirm(`Tem certeza que deseja excluir o produto "${item.name}" definitivamente?`)) return;
		const { error } = await supabase.from("inventory_items").delete().eq("id", item.id);
		if (error) toast({
			title: "Erro ao excluir",
			description: "Não foi possível excluir o item. Verifique se possui transações.",
			variant: "destructive"
		});
		else {
			await logAudit("DELETE_INVENTORY_ITEM", "inventory_items", item.id, { name: item.name });
			toast({ title: "Produto excluído com sucesso" });
			fetchItems();
		}
	};
	const handleBaixa = async () => {
		if (!baixaData.qty || !baixaModal.item) return;
		let qty = Number(baixaData.qty);
		if (qty <= 0) return toast({ title: "Quantidade inválida" });
		let effectiveQty = qty;
		if (baixaData.type === "item") effectiveQty = qty / (Number(baixaModal.item.items_per_box) || 1);
		if (effectiveQty > baixaModal.item.quantity) return toast({
			title: "Estoque insuficiente",
			variant: "destructive"
		});
		const { error } = await supabase.from("inventory_transactions").insert({
			item_id: baixaModal.item.id,
			type: "out",
			quantity: effectiveQty
		});
		if (error) toast({
			title: "Erro ao registrar",
			variant: "destructive"
		});
		else {
			toast({ title: "Baixa registrada com sucesso" });
			setBaixaModal({
				open: false,
				item: null
			});
			setBaixaData({
				qty: "",
				type: "box"
			});
			fetchItems();
		}
	};
	const totalCapital = (0, import_react.useMemo)(() => filteredItems.reduce((acc, item) => acc + Number(item.purchase_cost || 0) * Number(item.quantity), 0), [filteredItems]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-7xl mx-auto animate-fade-in pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 bg-blue-100 rounded-xl dark:bg-blue-900/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-primary",
						children: "Controle de Estoque"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Gerencie embalagens, custos e rendimentos detalhados."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => openModal("create"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " Novo Produto"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-subtle border-l-4 border-l-blue-500 w-full md:w-1/3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
						children: "Capital Investido (Ocioso)"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-3xl font-bold text-blue-600",
					children: formatBRL(totalCapital)
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "pl-6",
							children: "Produto / Local"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Embalagem & Itens" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Custo Emb. Fechada" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Custo Unit. Prod." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center",
							children: "Qtd. Atual"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Capital Retido"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right pr-6",
							children: "Ações Rápidas"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 7,
						className: "h-32 text-center text-muted-foreground",
						children: "Nenhum produto cadastrado."
					}) }) : filteredItems.map((item) => {
						const pTypes = item.packaging_types && item.packaging_types.length > 0 ? item.packaging_types : item.packaging_type ? [item.packaging_type] : [];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "cursor-pointer hover:bg-muted/50 transition-colors group",
							onClick: (e) => {
								if (e.target.closest(".actions-col")) return;
								openModal("view", item);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "pl-6 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-primary",
										children: item.name
									}), item.storage_location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground mt-0.5 flex items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-3 h-3 mr-1 inline opacity-60" }),
											" ",
											item.storage_location
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1 mb-1",
										children: pTypes.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] py-0 h-4 px-1.5",
											children: t
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground mt-1 font-medium",
										children: [item.items_per_box, " item(s) / caixa"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: [
											"Rende: ",
											item.usage_factor,
											" un"
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-muted-foreground",
									children: formatBRL(Number(item.purchase_cost || 0))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-semibold text-emerald-600 dark:text-emerald-400",
									children: formatBRL(Number(item.unit_price))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-bold px-2 py-1 rounded-md ${Number(item.quantity) < Number(item.minimum_stock_level || 0) ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-muted"}`,
										children: formatQty(item.quantity)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-semibold text-muted-foreground",
									children: formatBRL(Number(item.purchase_cost || 0) * Number(item.quantity))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right pr-6 actions-col",
									onClick: (e) => e.stopPropagation(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
										children: [
											currentUser?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20",
												onClick: (e) => {
													e.stopPropagation();
													handleDelete(item);
												},
												title: "Excluir produto",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/30",
												onClick: (e) => {
													e.stopPropagation();
													openModal("in", item);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3 mr-1" }), " Entrada"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "h-8 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-900/30",
												onClick: (e) => {
													e.stopPropagation();
													setBaixaModal({
														open: true,
														item
													});
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3 h-3 mr-1" }), " Baixa"]
											})
										]
									})
								})
							]
						}, item.id);
					}) })] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: productModal.open,
				onOpenChange: (o) => !o && setProductModal({
					...productModal,
					open: false
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: productModal.mode === "create" ? "Novo Produto no Estoque" : productModal.mode === "in" ? "Registrar Nova Entrada" : "Detalhes do Produto" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto px-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome do Material" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Ex: Resina A2",
										value: formData.name,
										readOnly: productModal.mode !== "create",
										className: cn(productModal.mode !== "create" && "bg-muted opacity-80"),
										onChange: (e) => setFormData({
											...formData,
											name: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Custo da Embalagem Fechada (R$)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "0,00",
										value: formData.purchase_cost,
										readOnly: productModal.mode === "view",
										className: cn(productModal.mode === "view" && "bg-muted opacity-80"),
										onChange: (e) => setFormData({
											...formData,
											purchase_cost: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Local de Armazenamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Ex: Sala 1 - Armário A",
										value: formData.storage_location,
										readOnly: productModal.mode === "view",
										className: cn(productModal.mode === "view" && "bg-muted opacity-80"),
										onChange: (e) => setFormData({
											...formData,
											storage_location: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 mt-2 p-4 bg-muted/30 rounded-lg border border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-3 col-span-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipos de Embalagem" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex flex-wrap gap-2 items-center",
														children: formData.packagingTypes.map((type, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: cn("w-36", productModal.mode === "view" && "bg-muted opacity-80"),
																placeholder: idx === formData.packagingTypes.length - 1 && productModal.mode !== "view" ? "Nova embalagem..." : "Ex: Frasco",
																value: type,
																readOnly: productModal.mode === "view",
																onChange: (e) => handlePackagingChange(idx, e.target.value)
															}), idx < formData.packagingTypes.length - 1 && productModal.mode !== "view" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																variant: "ghost",
																size: "icon",
																className: "h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100",
																onClick: () => removePackaging(idx),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
															})]
														}, idx))
													}),
													productModal.mode !== "view" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground",
														children: "Preencha o último campo para adicionar um novo tipo automaticamente."
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantidade de Itens na Caixa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: "1",
													step: "0.01",
													placeholder: "Ex: 5",
													value: formData.items_per_box,
													readOnly: productModal.mode === "view",
													className: cn(productModal.mode === "view" && "bg-muted opacity-80"),
													onChange: (e) => setFormData({
														...formData,
														items_per_box: e.target.value
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rendimento de Produção" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: "1",
													step: "0.01",
													placeholder: "Ex: 50 coroas",
													value: formData.usage_factor,
													readOnly: productModal.mode === "view",
													className: cn(productModal.mode === "view" && "bg-muted opacity-80"),
													onChange: (e) => setFormData({
														...formData,
														usage_factor: e.target.value
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estoque Mínimo (Aviso)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: "0",
													step: "0.01",
													placeholder: "Ex: 5",
													value: formData.minimum_stock_level,
													readOnly: productModal.mode === "view",
													className: cn(productModal.mode === "view" && "bg-muted opacity-80"),
													onChange: (e) => setFormData({
														...formData,
														minimum_stock_level: e.target.value
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Custo Unitário de Produção" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													readOnly: true,
													className: "bg-emerald-50 dark:bg-emerald-900/10 font-semibold text-emerald-700 dark:text-emerald-400",
													value: formatBRL(unitProdCost)
												})]
											})
										]
									})
								}),
								productModal.mode !== "view" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "col-span-2 mt-2 pt-2 border-t border-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-blue-600 dark:text-blue-400",
											children: productModal.mode === "create" ? "Qtd. Comprada (Inicial em Caixas)" : "Qtd. Comprada (Nova Entrada)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: "0",
											step: "0.01",
											placeholder: "Ex: 10",
											value: formData.initial_quantity,
											onChange: (e) => setFormData({
												...formData,
												initial_quantity: e.target.value
											}),
											className: "border-blue-200 dark:border-blue-900/50"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Custo Total da Compra Atual" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											readOnly: true,
											className: "bg-muted font-semibold",
											value: formatBRL(totalCost)
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 mt-4 pt-4 border-t border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-sm font-semibold text-muted-foreground mb-3 block",
										children: "Detalhes da Compra & Histórico (Opcional)"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Marca da última compra" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Ex: 3M, Ivoclar...",
										value: formData.last_purchase_brand,
										readOnly: productModal.mode === "view",
										className: cn(productModal.mode === "view" && "bg-muted opacity-80"),
										onChange: (e) => setFormData({
											...formData,
											last_purchase_brand: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valor da última compra (R$)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "0,00",
										value: formData.last_purchase_value,
										readOnly: productModal.mode === "view",
										className: cn(productModal.mode === "view" && "bg-muted opacity-80"),
										onChange: (e) => setFormData({
											...formData,
											last_purchase_value: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Adicione notas, links de fornecedores ou detalhes...",
										className: cn("min-h-[80px]", productModal.mode === "view" && "bg-muted opacity-80"),
										value: formData.observations,
										readOnly: productModal.mode === "view",
										onChange: (e) => setFormData({
											...formData,
											observations: e.target.value
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: productModal.mode === "view" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setProductModal({
								...productModal,
								open: false
							}),
							children: "Fechar Detalhes"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setProductModal({
								...productModal,
								open: false
							}),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleSaveProduct,
							children: productModal.mode === "create" ? "Cadastrar Produto" : "Salvar Entrada"
						})] }) })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: baixaModal.open,
				onOpenChange: (o) => !o && setBaixaModal({
					...baixaModal,
					open: false
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar Baixa (Consumo)" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted rounded-md mb-4 flex justify-between items-center border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: baixaModal.item?.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["Itens por caixa: ", baixaModal.item?.items_per_box]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Estoque Atual"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-bold text-primary",
										children: [formatQty(baixaModal.item?.quantity), " embalagens"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantidade a Baixar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "0.01",
										step: "0.01",
										placeholder: "Ex: 1",
										value: baixaData.qty,
										onChange: (e) => setBaixaData({
											...baixaData,
											qty: e.target.value
										}),
										autoFocus: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Unidade de Medida" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: baixaData.type,
										onValueChange: (v) => setBaixaData({
											...baixaData,
											type: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "box",
											children: "Embalagem Fechada"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "item",
											children: "Unidade/Item (Avulso)"
										})] })]
									})]
								})]
							}),
							baixaData.type === "item" && Number(baixaData.qty) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-900/50 mt-4",
								children: [
									"Será deduzido",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-bold",
										children: (Number(baixaData.qty) / (Number(baixaModal.item?.items_per_box) || 1)).toFixed(2)
									}),
									" ",
									"embalagem(s) do estoque atual."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setBaixaModal({
							open: false,
							item: null
						}),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleBaixa,
						variant: "destructive",
						children: "Confirmar Baixa"
					})] })
				] })
			})
		]
	});
}
export { Inventory as default };

//# sourceMappingURL=Inventory-DnAg7Ail.js.map