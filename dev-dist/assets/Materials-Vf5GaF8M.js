import { t as ArrowLeft } from "./arrow-left-DvxpmrQC.js";
import { t as Plus } from "./plus-C5jNq9QM.js";
import { t as Trash2 } from "./trash-2-yfKenX3G.js";
import { Et as toast, It as require_react, Ot as Link, St as require_jsx_runtime, a as useAppStore, t as Button, zt as __toESM } from "./index-pmBkMrzL.js";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-C1itUhEE.js";
import { t as Input } from "./input-BG8tf8sQ.js";
import { t as Label } from "./label-BBdFLU37.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-B5aj7q7b.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function MaterialsPage() {
	const { appSettings, updateSetting, currentUser } = useAppStore();
	const [materials, setMaterials] = (0, import_react.useState)([]);
	const [newMaterial, setNewMaterial] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		try {
			if (appSettings["materials_list"]) setMaterials(JSON.parse(appSettings["materials_list"]));
		} catch (e) {
			console.error("Failed to parse materials_list", e);
		}
	}, [appSettings]);
	const saveMaterials = async (list) => {
		await updateSetting("materials_list", JSON.stringify(list));
		setMaterials(list);
	};
	const handleAdd = async () => {
		if (!newMaterial.trim()) return;
		const formatted = newMaterial.trim();
		if (materials.find((m) => m.toLowerCase() === formatted.toLowerCase())) {
			toast({
				title: "Atenção",
				description: "Este material já existe.",
				variant: "destructive"
			});
			return;
		}
		await saveMaterials([...materials, formatted].sort());
		setNewMaterial("");
		toast({
			title: "Sucesso",
			description: "Material adicionado com sucesso!"
		});
	};
	const handleDelete = async (mat) => {
		if (!confirm(`Deseja remover o material "${mat}" da lista global?`)) return;
		await saveMaterials(materials.filter((m) => m !== mat));
		toast({
			title: "Sucesso",
			description: "Material removido com sucesso!"
		});
	};
	if (currentUser?.role !== "admin" && currentUser?.role !== "receptionist" && currentUser?.role !== "master") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Acesso restrito. Você não tem permissão para acessar esta página."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto py-6 space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/prices",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-tight text-primary",
					children: "Gerenciamento de Materiais"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm",
					children: "Configure a lista de materiais disponíveis para os pedidos dos dentistas."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "bg-muted/20 border-b pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-lg",
						children: "Novo Material"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Adicione um novo material à lista global do laboratório." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-4 items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 w-full space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome do Material" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Ex: Zircônia Premium, Resina Impressa...",
								value: newMaterial,
								onChange: (e) => setNewMaterial(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && handleAdd()
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleAdd,
							className: "w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " Adicionar Material"]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "pl-6 h-12",
						children: "Material Cadastrado"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[100px] text-right pr-6",
						children: "Ações"
					})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: materials.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: 2,
						className: "h-32 text-center text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nenhum material configurado." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs mt-1",
							children: "A lista será mesclada com os materiais da tabela de preços."
						})]
					}) }) : materials.map((mat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "pl-6 font-medium",
						children: mat
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right pr-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => handleDelete(mat),
							title: "Remover Material",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-destructive hover:text-red-600" })
						})
					})] }, mat)) })] })
				})
			})
		]
	});
}
export { MaterialsPage as default };

//# sourceMappingURL=Materials-Vf5GaF8M.js.map