import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CyQzQ-HX.js";
import { t as Pen } from "./pen-D1orQF0y.js";
import { t as Plus } from "./plus-qAyNbAd-.js";
import { t as Settings } from "./settings-CJ4WjgJN.js";
import { It as require_react, St as require_jsx_runtime, a as useAppStore, kt as Navigate, t as Button, zt as __toESM } from "./index-DV4m2exc.js";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-DxRwVnHC.js";
import { t as Input } from "./input-DKAt8a9g.js";
import { t as Label } from "./label-DyrX6rpW.js";
import "./es2015-D2dCARkv.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-bFacqo0M.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-D5cgkkMc.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function DRECategories() {
	const { dreCategories, currentUser, addDRECategory, updateDRECategory } = useAppStore();
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [editingCategory, setEditingCategory] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		type: "fixed"
	});
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	if (currentUser?.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	const getTypeLabel = (type) => {
		if (type === "revenue") return "Receita";
		if (type === "variable") return "Custo Variável";
		if (type === "fixed") return "Despesa Operacional";
		return type;
	};
	const handleOpenNew = () => {
		setEditingCategory(null);
		setFormData({
			name: "",
			type: "fixed"
		});
		setModalOpen(true);
	};
	const handleOpenEdit = (cat) => {
		setEditingCategory(cat);
		setFormData({
			name: cat.name,
			type: cat.category_type
		});
		setModalOpen(true);
	};
	const handleSave = async () => {
		if (!formData.name.trim()) return;
		setIsSaving(true);
		let success = false;
		if (editingCategory) {
			if (editingCategory.name === formData.name && editingCategory.category_type === formData.type) {
				setModalOpen(false);
				setIsSaving(false);
				return;
			}
			success = await updateDRECategory(editingCategory.name, formData.name.trim(), formData.type);
		} else success = await addDRECategory(formData.name.trim(), formData.type);
		setIsSaving(false);
		if (success) setModalOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-5xl mx-auto animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 bg-primary/10 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-6 h-6 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight text-primary",
						children: "Categorias DRE"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Gerencie a estrutura do seu Demonstrativo de Resultados."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleOpenNew,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " Nova Categoria"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estrutura Cadastrada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Todas as categorias que estruturam seu fluxo de caixa e relatórios." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
						className: "bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome da Categoria" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Classificação DRE" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "w-[100px] text-right",
								children: "Ações"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: dreCategories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: cat.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground",
							children: getTypeLabel(cat.category_type)
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-blue-500 hover:bg-blue-50",
								onClick: () => handleOpenEdit(cat),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-4 h-4" })
							})
						})
					] }, cat.name)) })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: modalOpen,
				onOpenChange: setModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingCategory ? "Editar Categoria" : "Nova Categoria DRE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: editingCategory ? "Ao renomear esta categoria, todos os registros históricos vinculados serão atualizados automaticamente para manter a integridade." : "Crie uma nova classificação para organizar seus relatórios e contas a pagar." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Nome da Categoria ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Ex: Marketing, Logística...",
								value: formData.name,
								onChange: (e) => setFormData({
									...formData,
									name: e.target.value
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Classificação Estrutural ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.type,
								onValueChange: (v) => setFormData({
									...formData,
									type: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "revenue",
										children: "Receita Bruta"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "variable",
										children: "Custo Variável (Dedução direta)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "fixed",
										children: "Despesa Operacional (Fixa)"
									})
								] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setModalOpen(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleSave,
						disabled: isSaving || !formData.name.trim(),
						children: isSaving ? "Salvando..." : "Salvar Categoria"
					})] })
				] })
			})
		]
	});
}
export { DRECategories as default };

//# sourceMappingURL=DRECategories-DBIWcTjg.js.map