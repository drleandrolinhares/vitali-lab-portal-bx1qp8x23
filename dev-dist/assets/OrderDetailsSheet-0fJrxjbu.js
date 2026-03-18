import { t as Activity } from "./activity-DQj3D-Sd.js";
import { t as ArrowLeft } from "./arrow-left-ByIRHUMm.js";
import { t as ArrowRight } from "./arrow-right-CZ-PAQuW.js";
import { t as Calendar } from "./calendar-9IsBZfI-.js";
import { t as Circle } from "./circle-CJqbt021.js";
import { t as Clock } from "./clock-Cq0l841z.js";
import { t as DollarSign } from "./dollar-sign-BvgJ_7a1.js";
import { t as Download } from "./download-CEmm96Xb.js";
import { t as FileText } from "./file-text-DwN3A6Iy.js";
import { t as Trash2 } from "./trash-2-DTyAVHVE.js";
import { B as supabase, It as require_react, St as require_jsx_runtime, a as useAppStore, at as createLucideIcon, h as format, l as formatBRL, rt as processOrderHistory, t as Button, tt as cn, zt as __toESM } from "./index-SUJJ9Lwf.js";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-D62iLJUU.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BqWYIEQy.js";
import { t as Textarea } from "./textarea-0ovA29CH.js";
var Paperclip = createLucideIcon("paperclip", [["path", {
	d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
	key: "1miecu"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function OrderDetailsSheet({ order, isOpen, onClose, obsText, setObsText, onSaveObs }) {
	const { kanbanStages, currentUser, deleteOrder } = useAppStore();
	const [historyItems, setHistoryItems] = (0, import_react.useState)([]);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isOpen && order?.id) {
			const fetchHistory = async () => {
				const { data, error } = await supabase.from("order_history").select("*").eq("order_id", order.id).order("created_at", { ascending: true });
				if (data && !error) setHistoryItems(data.map((h) => ({
					id: h.id,
					status: h.status,
					date: h.created_at,
					note: h.note
				})));
				else setHistoryItems(order.history || []);
			};
			fetchHistory();
		} else {
			setHistoryItems([]);
			setIsDeleteDialogOpen(false);
		}
	}, [
		isOpen,
		order?.id,
		order?.history
	]);
	const handleDelete = async () => {
		if (!order) return;
		await deleteOrder(order.id, "Excluído via Kanban");
		setIsDeleteDialogOpen(false);
		onClose();
	};
	if (!order) return null;
	const processedHistory = processOrderHistory(historyItems.length > 0 ? historyItems : order.history, kanbanStages, order.kanbanStage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: isOpen,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full sm:w-[540px] flex flex-col h-full bg-white dark:bg-background z-[100] border-l",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 pr-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
						className: "text-xl text-slate-900 dark:text-slate-100",
						children: ["Pedido ", order.friendlyId]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
						className: "text-sm text-slate-500",
						children: [
							order.patientName,
							" - ",
							order.dentistName
						]
					})]
				}), (currentUser?.role === "admin" || currentUser?.role === "master") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 mt-0.5",
					onClick: () => setIsDeleteDialogOpen(true),
					title: "Excluir pedido",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
				})]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto mt-6 space-y-8 pr-2 pb-6",
				children: [
					order.fileUrls && order.fileUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-4 h-4 text-primary" }), " Arquivos Anexados"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
							children: order.fileUrls.map((url, i) => {
								const filename = url.split("/").pop() || `Arquivo ${i + 1}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: url,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center gap-2 text-sm p-2 rounded-md bg-background border hover:border-primary/50 transition-colors group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 text-primary group-hover:scale-110 transition-transform shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-foreground group-hover:text-primary transition-colors",
										children: filename
									})]
								}, i);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-primary" }), " Financeiro"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-muted/30 p-4 rounded-xl border border-border/50 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Valor Unitário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: formatBRL(order.unitPrice || 0)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Quantidade (Elementos)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: order.quantity || 1
									})]
								}),
								(order.dentistDiscount || 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-sm text-emerald-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Desconto Acordo Comercial" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: [
											"-",
											order.dentistDiscount,
											"%"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center pt-2 border-t font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total do Pedido" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: formatBRL(order.basePrice)
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-primary" }), " Observações Administrativas"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: obsText,
								onChange: (e) => setObsText(e.target.value),
								placeholder: "Adicione notas ou comentários...",
								className: "min-h-[120px] resize-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: onSaveObs,
								size: "sm",
								className: "w-full sm:w-auto",
								children: "Salvar Observações"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-primary" }), " Histórico de Etapas"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-px before:bg-border",
							children: processedHistory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("absolute left-0 mt-0.5 w-6 h-6 rounded-full ring-4 ring-background z-10 flex items-center justify-center border", item.isCurrent ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"),
									children: item.direction === "backward" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3.5 h-3.5" }) : item.direction === "forward" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "w-2.5 h-2.5 fill-current" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-10 w-full space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium leading-none",
											children: item.stageName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground mt-1 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3 h-3" }), format(new Date(item.date), "dd/MM 'às' HH:mm")]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs font-medium bg-muted/40 px-2 py-1 rounded-md text-muted-foreground whitespace-nowrap border border-border/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), item.durationStr]
										})]
									}), item.note && !item.note.startsWith("Movido para") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md border border-border/40",
										children: item.note
									})]
								})]
							}, item.id))
						})]
					})
				]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: isDeleteDialogOpen,
		onOpenChange: setIsDeleteDialogOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Excluir pedido?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Tem certeza que deseja excluir este caso? Esta ação não pode ser desfeita." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			onClick: handleDelete,
			className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			children: "Sim, excluir"
		})] })] })
	})] });
}
export { Paperclip as n, OrderDetailsSheet as t };

//# sourceMappingURL=OrderDetailsSheet-0fJrxjbu.js.map