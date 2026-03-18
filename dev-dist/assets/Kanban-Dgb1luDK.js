import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CyQzQ-HX.js";
import { t as CircleCheck } from "./circle-check-BfIfJR4s.js";
import { t as Clock } from "./clock-CqtZm64c.js";
import { t as Info } from "./info-AXG7ypqx.js";
import { t as StatusBadge } from "./StatusBadge-pYY_pbL-.js";
import { n as Paperclip, t as OrderDetailsSheet } from "./OrderDetailsSheet-DwKWtNK9.js";
import { t as Pen } from "./pen-D1orQF0y.js";
import { t as Plus } from "./plus-qAyNbAd-.js";
import { t as Printer } from "./printer-Cu0sz_2e.js";
import { t as RefreshCw } from "./refresh-cw-CLtZmoyv.js";
import { t as Trash2 } from "./trash-2-B-d3rvv9.js";
import { t as Users } from "./users-Fz88GbBZ.js";
import { B as supabase, Et as toast, G as TooltipContent, It as require_react, L as millisecondsInMinute, Mt as useNavigate, Ot as Link, P as toDate, Pt as useSearchParams, St as require_jsx_runtime, W as Tooltip, a as useAppStore, at as createLucideIcon, q as TooltipTrigger, t as Button, tt as cn, zt as __toESM } from "./index-DV4m2exc.js";
import { t as Input } from "./input-DKAt8a9g.js";
import { t as Label } from "./label-DyrX6rpW.js";
import "./es2015-D2dCARkv.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-bFacqo0M.js";
import "./sheet-3sGG8XU2.js";
import "./badge-AD_VTyfd.js";
import "./alert-dialog-C-xhcPy-.js";
import { t as Textarea } from "./textarea-CizsiFER.js";
var ExternalLink = createLucideIcon("external-link", [
	["path", {
		d: "M15 3h6v6",
		key: "1q9fwt"
	}],
	["path", {
		d: "M10 14 21 3",
		key: "gplh6r"
	}],
	["path", {
		d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
		key: "a6xqqp"
	}]
]);
var GripHorizontal = createLucideIcon("grip-horizontal", [
	["circle", {
		cx: "12",
		cy: "9",
		r: "1",
		key: "124mty"
	}],
	["circle", {
		cx: "19",
		cy: "9",
		r: "1",
		key: "1ruzo2"
	}],
	["circle", {
		cx: "5",
		cy: "9",
		r: "1",
		key: "1a8b28"
	}],
	["circle", {
		cx: "12",
		cy: "15",
		r: "1",
		key: "1e56xg"
	}],
	["circle", {
		cx: "19",
		cy: "15",
		r: "1",
		key: "1a92ep"
	}],
	["circle", {
		cx: "5",
		cy: "15",
		r: "1",
		key: "5r1jwy"
	}]
]);
var QrCode = createLucideIcon("qr-code", [
	["rect", {
		width: "5",
		height: "5",
		x: "3",
		y: "3",
		rx: "1",
		key: "1tu5fj"
	}],
	["rect", {
		width: "5",
		height: "5",
		x: "16",
		y: "3",
		rx: "1",
		key: "1v8r4q"
	}],
	["rect", {
		width: "5",
		height: "5",
		x: "3",
		y: "16",
		rx: "1",
		key: "1x03jg"
	}],
	["path", {
		d: "M21 16h-3a2 2 0 0 0-2 2v3",
		key: "177gqh"
	}],
	["path", {
		d: "M21 21v.01",
		key: "ents32"
	}],
	["path", {
		d: "M12 7v3a2 2 0 0 1-2 2H7",
		key: "8crl2c"
	}],
	["path", {
		d: "M3 12h.01",
		key: "nlz23k"
	}],
	["path", {
		d: "M12 3h.01",
		key: "n36tog"
	}],
	["path", {
		d: "M12 16v.01",
		key: "133mhm"
	}],
	["path", {
		d: "M16 12h1",
		key: "1slzba"
	}],
	["path", {
		d: "M21 12v.01",
		key: "1lwtk9"
	}],
	["path", {
		d: "M12 21v-1",
		key: "1880an"
	}]
]);
function getRoundingMethod(method) {
	return (number) => {
		const result = (method ? Math[method] : Math.trunc)(number);
		return result === 0 ? 0 : result;
	};
}
function differenceInMilliseconds(laterDate, earlierDate) {
	return +toDate(laterDate) - +toDate(earlierDate);
}
function differenceInMinutes(dateLeft, dateRight, options) {
	const diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute;
	return getRoundingMethod(options?.roundingMethod)(diff);
}
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function KanbanCardTimer({ order, currentStage }) {
	const [elapsed, setElapsed] = (0, import_react.useState)("");
	const startTime = (0, import_react.useMemo)(() => {
		const stageHistory = order.history.find((h) => h.note && h.note.toUpperCase().includes(`PARA ${currentStage.toUpperCase()}`));
		if (stageHistory) return new Date(stageHistory.date);
		return new Date(order.createdAt);
	}, [
		order.history,
		order.createdAt,
		currentStage
	]);
	(0, import_react.useEffect)(() => {
		const updateTimer = () => {
			const now$1 = /* @__PURE__ */ new Date();
			const mins = Math.max(0, differenceInMinutes(now$1, startTime));
			if (mins < 60) setElapsed(`${mins}m`);
			else if (mins < 1440) setElapsed(`${Math.floor(mins / 60)}h ${mins % 60}m`);
			else setElapsed(`${Math.floor(mins / 1440)}d ${Math.floor(mins % 1440 / 60)}h`);
		};
		updateTimer();
		const now = /* @__PURE__ */ new Date();
		const msUntilNextMinute = 6e4 - (now.getSeconds() * 1e3 + now.getMilliseconds());
		let interval;
		const timeout = setTimeout(() => {
			updateTimer();
			interval = setInterval(updateTimer, 6e4);
		}, msUntilNextMinute);
		return () => {
			clearTimeout(timeout);
			if (interval) clearInterval(interval);
		};
	}, [startTime]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium shrink-0",
		title: "Tempo na coluna atual",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), elapsed]
	});
}
function MiniGuideDialog({ order, isOpen, onClose, type = "print" }) {
	if (!order) return null;
	const orderUrl = type === "full" ? `${window.location.origin}/public/order/${order.id}/full` : `${window.location.origin}/public/guide/${order.id}`;
	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderUrl)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isOpen,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[400px] print:shadow-none print:border-none print:p-0 print:bg-transparent",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #print-area, #print-area * {
              visibility: visible !important;
            }
            #print-area {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              margin: 0 !important;
              padding: 16px !important;
              width: 7.5cm !important;
              background: white !important;
              border: 1px dashed #ccc !important;
              box-shadow: none !important;
            }
            @page {
              margin: 0;
              size: auto;
            }
          }
        ` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "print:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-xl font-bold text-slate-800",
						children: type === "full" ? "QR Code do Pedido Completo" : "Mini Guia de Trabalho"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-slate-500 mt-1",
						children: type === "full" ? "Escaneie para visualizar todos os detalhes clínicos e financeiros do pedido." : "Imprima esta guia para colar ou acompanhar a caixa física do trabalho na bancada."
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col items-center justify-center py-2 print:py-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "print-area",
						className: "w-full border border-slate-200 p-6 rounded-xl bg-white text-slate-900 shadow-sm print:max-w-[300px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-5 border-b border-slate-100 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-extrabold text-2xl uppercase leading-tight tracking-tight text-slate-800",
									children: "VITALI LAB"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mt-1",
									children: order.friendlyId
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center mb-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: qrUrl,
									alt: "QR Code",
									className: "w-40 h-40 object-contain mix-blend-multiply",
									crossOrigin: "anonymous"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 p-3 rounded-lg border border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold uppercase text-[10px] text-slate-400 block mb-1 tracking-wider",
										children: "Paciente"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-sm block text-slate-800 uppercase break-words leading-tight",
										children: order.patientName
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 p-3 rounded-lg border border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold uppercase text-[10px] text-slate-400 block mb-1 tracking-wider",
										children: "Dentista"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-sm block text-slate-800 uppercase break-words leading-tight",
										children: order.dentistName
									})]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-3 print:hidden mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: onClose,
						className: "w-full",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => window.print(),
						className: "w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), "Imprimir Guia"]
					})]
				})
			]
		})
	});
}
var SECTORS = ["SOLUÇÕES CERÂMICAS", "STÚDIO ACRÍLICO"];
function KanbanPage() {
	const { orders, currentUser, effectiveRole, updateOrderKanbanStage, updateOrderObservations, kanbanStages, addKanbanStage, updateKanbanStage, updateKanbanStageDescription, deleteKanbanStage, reorderKanbanStages, checkPermission, fetchError: storeFetchError, selectedLab, setSelectedLab } = useAppStore();
	const navigate = useNavigate();
	const isAdmin = effectiveRole === "admin" || effectiveRole === "master";
	const isDentist = effectiveRole === "dentist" || effectiveRole === "laboratory";
	const activeLab = SECTORS.includes((selectedLab || "").toUpperCase()) ? (selectedLab || "").toUpperCase() : SECTORS[0];
	const canDragCards = !isDentist && ([
		"admin",
		"master",
		"receptionist",
		"technical_assistant",
		"financial",
		"relationship_manager"
	].includes(effectiveRole || "") || checkPermission("kanban", "move_cards"));
	const canFilterDentist = checkPermission("kanban", "filter_dentist");
	const showDentistFilter = !isDentist && canFilterDentist;
	const canCreateOrder = checkPermission("inbox", "create_order") || isDentist;
	const [searchParams, setSearchParams] = useSearchParams();
	const selectedDentistId = searchParams.get("dentist") || "all";
	const setSelectedDentistId = (val) => {
		if (val === "all") searchParams.delete("dentist");
		else searchParams.set("dentist", val);
		setSearchParams(searchParams, { replace: true });
	};
	const [dentistsList, setDentistsList] = (0, import_react.useState)([]);
	const [isLoadingDentists, setIsLoadingDentists] = (0, import_react.useState)(false);
	const [dentistFetchError, setDentistFetchError] = (0, import_react.useState)(null);
	const [selectedOrderId, setSelectedOrderId] = (0, import_react.useState)(null);
	const selectedOrder = (0, import_react.useMemo)(() => orders.find((o) => o.id === selectedOrderId) || null, [orders, selectedOrderId]);
	const [obsText, setObsText] = (0, import_react.useState)("");
	const [editingStageId, setEditingStageId] = (0, import_react.useState)(null);
	const [editStageName, setEditStageName] = (0, import_react.useState)("");
	const [editingDescStage, setEditingDescStage] = (0, import_react.useState)(null);
	const [editDescText, setEditDescText] = (0, import_react.useState)("");
	const [isAddColumnOpen, setIsAddColumnOpen] = (0, import_react.useState)(false);
	const [newColumnName, setNewColumnName] = (0, import_react.useState)("");
	const [deleteStageData, setDeleteStageData] = (0, import_react.useState)(null);
	const [fallbackStageName, setFallbackStageName] = (0, import_react.useState)("");
	const [draggedStageId, setDraggedStageId] = (0, import_react.useState)(null);
	const [dragOverStageId, setDragOverStageId] = (0, import_react.useState)(null);
	const [draggedCardId, setDraggedCardId] = (0, import_react.useState)(null);
	const [draggedCardSector, setDraggedCardSector] = (0, import_react.useState)(null);
	const [finishingOrderId, setFinishingOrderId] = (0, import_react.useState)(null);
	const [expandedCols, setExpandedCols] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [selectedPrintQrOrder, setSelectedPrintQrOrder] = (0, import_react.useState)(null);
	const [selectedFullQrOrder, setSelectedFullQrOrder] = (0, import_react.useState)(null);
	const savingRef = (0, import_react.useRef)(false);
	const fetchDentists = async () => {
		setIsLoadingDentists(true);
		setDentistFetchError(null);
		try {
			const { data, error } = await supabase.from("profiles").select("id, name").in("role", ["dentist", "laboratory"]).eq("is_active", true).eq("is_approved", true).order("name");
			if (error) throw error;
			if (data) setDentistsList(data);
		} catch (err) {
			console.error("Error fetching dentists:", err);
			setDentistFetchError("Erro ao carregar dentistas.");
		} finally {
			setIsLoadingDentists(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (showDentistFilter && currentUser) fetchDentists();
	}, [showDentistFilter, currentUser]);
	(0, import_react.useEffect)(() => {
		if (selectedOrder) setObsText(selectedOrder.observations || "");
	}, [selectedOrder]);
	const visibleOrders = (0, import_react.useMemo)(() => {
		if (isDentist) return orders;
		if (canFilterDentist && selectedDentistId !== "all") return orders.filter((o) => o.dentistId === selectedDentistId);
		return orders;
	}, [
		orders,
		isDentist,
		selectedDentistId,
		canFilterDentist
	]);
	const hasOrders = (0, import_react.useMemo)(() => deleteStageData ? orders.some((o) => o.kanbanStage === deleteStageData.name) : false, [deleteStageData, orders]);
	const handleColumnDrop = (e, targetStageId) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isAdmin) return;
		const dragId = e.dataTransfer.getData("column-id");
		if (dragId && dragId !== targetStageId) {
			const oldIndex = kanbanStages.findIndex((s) => s.id === dragId);
			const newIndex = kanbanStages.findIndex((s) => s.id === targetStageId);
			if (oldIndex !== -1 && newIndex !== -1) {
				const newStages = [...kanbanStages];
				const [moved] = newStages.splice(oldIndex, 1);
				newStages.splice(newIndex, 0, moved);
				reorderKanbanStages(newStages.map((s, idx) => ({
					...s,
					orderIndex: idx + 1
				})));
			}
		}
	};
	const handleDrop = (e, stage, sector) => {
		e.preventDefault();
		if (!canDragCards) return;
		const cardId = e.dataTransfer.getData("card-id") || e.dataTransfer.getData("text/plain");
		if (cardId) {
			const o = orders.find((x) => x.id === cardId);
			if (o && (o.sector || "").toUpperCase() === sector.toUpperCase() && o.kanbanStage !== stage) updateOrderKanbanStage(cardId, stage);
		}
		setDraggedCardId(null);
		setDraggedCardSector(null);
		setDragOverStageId(null);
	};
	const handleSaveStageName = async (id, oldName) => {
		if (savingRef.current) return;
		const trimmed = editStageName.trim();
		if (!trimmed || trimmed.toUpperCase() === oldName.toUpperCase()) return setEditingStageId(null);
		savingRef.current = true;
		try {
			await updateKanbanStage(id, oldName, trimmed);
		} catch (e) {
			console.error(e);
		} finally {
			setEditingStageId(null);
			savingRef.current = false;
		}
	};
	const handleSaveDesc = async () => {
		if (editingDescStage) {
			await updateKanbanStageDescription(editingDescStage.id, editDescText.trim());
			setEditingDescStage(null);
		}
	};
	const handleSaveObs = () => {
		if (selectedOrder) updateOrderObservations(selectedOrder.id, obsText);
	};
	const handleQuickFinish = async (orderId) => {
		setFinishingOrderId(orderId);
		try {
			let targetStageName = "FINALIZADOS E ENTREGUES";
			if (!kanbanStages.find((s) => s.name.toUpperCase() === targetStageName)) {
				const fallback = kanbanStages.find((s) => s.name.toUpperCase().includes("FINALIZADO") || s.name.toUpperCase().includes("ENTREGUE"));
				if (fallback) targetStageName = fallback.name;
				else await addKanbanStage(targetStageName);
			}
			await updateOrderKanbanStage(orderId, targetStageName);
			toast({
				title: "Pedido Finalizado!",
				description: `Trabalho movido para ${targetStageName}`
			});
		} finally {
			setFinishingOrderId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-full overflow-hidden flex flex-col h-[calc(100vh-6rem)] bg-white dark:bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col xl:flex-row items-start xl:items-center justify-between shrink-0 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-tight text-pink-600 uppercase",
					children: "Evolução dos Trabalhos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-500 dark:text-muted-foreground",
					children: "Acompanhe o progresso do fluxo de produção."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-end",
					children: [showDentistFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 w-full sm:w-[280px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-slate-400 dark:text-muted-foreground hidden sm:block shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedDentistId === "all" ? void 0 : selectedDentistId,
								onValueChange: (val) => setSelectedDentistId(val || "all"),
								disabled: isLoadingDentists,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-white border-slate-200 dark:border-border dark:bg-background uppercase text-xs font-bold h-9 focus:ring-primary/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: isLoadingDentists ? "CARREGANDO..." : dentistFetchError ? "ERRO AO CARREGAR" : "SELECIONE O CLIENTE" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [dentistsList.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: d.id,
									className: "uppercase text-xs font-bold",
									children: d.name
								}, d.id)), dentistFetchError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: (e) => {
											e.stopPropagation();
											fetchDentists();
										},
										className: "h-8 text-xs",
										children: "Tentar Novamente"
									})
								})] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: cn("w-full sm:ml-6 sm:w-[calc(100%-24px)] text-xs font-bold uppercase h-8 transition-colors", selectedDentistId === "all" ? "bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:hover:bg-pink-900/50 border border-pink-100 dark:border-pink-900/30" : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-800"),
							onClick: () => setSelectedDentistId("all"),
							children: "TODOS OS CLIENTES"
						})]
					}), canCreateOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 w-full sm:w-auto h-9",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "flex-1 sm:flex-none h-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/new-request?type=adjustment",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }),
									"Retorno ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "para Ajustes"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "flex-1 sm:flex-none h-full gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/new-request",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 hidden sm:block" }), " Novo Pedido"]
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-slate-50 dark:bg-muted/30 p-4 rounded-xl border border-slate-200 dark:border-border/50 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block tracking-wider uppercase",
					children: "ESCOLHA O LABORATÓRIO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-3",
					children: SECTORS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: activeLab === s ? "default" : "outline",
						onClick: () => setSelectedLab(s),
						className: cn("h-10 px-6 text-xs font-bold transition-all uppercase tracking-wide", activeLab === s ? "bg-pink-600 text-white hover:bg-pink-700 shadow-md border-pink-600" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200 dark:bg-background dark:text-muted-foreground dark:hover:bg-muted"),
						children: s
					}, s))
				})]
			}),
			storeFetchError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center justify-between text-sm shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Ocorreu um erro ao carregar todos os dados. Algumas informações podem estar desatualizadas."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto space-y-10 pb-6 pr-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-lg font-bold text-slate-800 dark:text-foreground flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-6 bg-pink-600 rounded-full" }),
							" ",
							activeLab
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 overflow-x-auto pb-4 snap-x items-start",
						children: [kanbanStages.map((stage) => {
							const cols = visibleOrders.filter((o) => (o.sector || "").toUpperCase() === activeLab && o.kanbanStage === stage.name);
							const isExpanded = expandedCols.has(`${activeLab}-${stage.id}`);
							const displayCols = isExpanded ? cols : cols.slice(0, 4);
							const hasMore = cols.length > 4;
							const isPendingCard = stage.name.trim().toUpperCase() === "PENDÊNCIAS";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								draggable: isAdmin && !editingStageId,
								onDragStart: (e) => {
									if (!isAdmin) return;
									e.dataTransfer.setData("column-id", stage.id);
									setTimeout(() => setDraggedStageId(stage.id), 0);
								},
								onDragEnd: () => {
									setDraggedStageId(null);
									setDragOverStageId(null);
								},
								onDragOver: (e) => {
									if (draggedStageId && draggedStageId !== stage.id) {
										e.preventDefault();
										setDragOverStageId(`${activeLab}-${stage.id}`);
									} else if (draggedCardId && draggedCardSector?.toUpperCase() === activeLab) {
										e.preventDefault();
										setDragOverStageId(`${activeLab}-${stage.id}`);
									}
								},
								onDragLeave: () => {
									if (dragOverStageId === `${activeLab}-${stage.id}`) setDragOverStageId(null);
								},
								onDrop: (e) => {
									e.preventDefault();
									setDragOverStageId(null);
									if (e.dataTransfer.getData("column-id")) {
										if (isAdmin) handleColumnDrop(e, stage.id);
									} else handleDrop(e, stage.name, activeLab);
								},
								className: cn("w-[300px] shrink-0 rounded-xl p-3 flex flex-col gap-3 border snap-start transition-all duration-200", "bg-slate-50/60 dark:bg-muted/40 border-slate-200 dark:border-border/50", draggedStageId === stage.id && "opacity-40 scale-[0.98] border-dashed border-slate-400 shadow-none", dragOverStageId === `${activeLab}-${stage.id}` && (draggedStageId || draggedCardId) && "border-primary shadow-sm bg-primary/5 ring-1 ring-primary scale-[1.02]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between px-1 mb-1 group",
									children: [editingStageId === stage.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										autoFocus: true,
										value: editStageName,
										onChange: (e) => setEditStageName(e.target.value),
										onBlur: () => handleSaveStageName(stage.id, stage.name),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleSaveStageName(stage.id, stage.name);
											}
											if (e.key === "Escape") setEditingStageId(null);
										},
										className: "h-7 text-xs font-semibold uppercase px-2 py-1 flex-1 min-w-0 bg-white dark:bg-background shadow-sm border-primary/50 focus-visible:ring-primary/30"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 flex-1 min-w-0 pr-2",
										children: [
											isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripHorizontal, {
												className: "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 cursor-grab shrink-0",
												title: "Arraste para reordenar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
												onClick: () => {
													if (isAdmin) {
														setEditingStageId(stage.id);
														setEditStageName(stage.name);
													}
												},
												className: cn("font-semibold text-xs tracking-wide uppercase truncate flex items-center gap-1.5", "text-slate-600 dark:text-muted-foreground", isAdmin && "cursor-pointer", isAdmin && "hover:text-primary transition-colors"),
												title: isAdmin ? "Clique para renomear" : "",
												children: [stage.name, isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" })]
											}),
											(stage.description || isAdmin) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: cn("h-5 w-5 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-800", !stage.description && "opacity-30 hover:opacity-100"),
													onClick: (e) => {
														e.stopPropagation();
														if (isAdmin) {
															setEditingDescStage(stage);
															setEditDescText(stage.description || "");
														}
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5" })
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
												side: "top",
												className: "bg-primary text-primary-foreground border-primary shadow-xl max-w-xs text-center z-50",
												children: stage.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium leading-relaxed",
													children: stage.description
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm italic opacity-80",
													children: "Sem descrição. Clique para adicionar."
												})
											})] }),
											isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive shrink-0 ml-auto",
												onClick: () => {
													setDeleteStageData(stage);
													setFallbackStageName(kanbanStages.find((s) => s.id !== stage.id)?.name || "");
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("px-2 py-0.5 rounded text-xs font-bold border shrink-0", "bg-white dark:bg-background border-slate-200 dark:border-border text-primary"),
										children: cols.length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 flex flex-col gap-2 min-h-[150px]",
									children: [displayCols.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, {
										delayDuration: 300,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												draggable: canDragCards,
												onDragStart: (e) => {
													if (!canDragCards) return;
													e.stopPropagation();
													e.dataTransfer.setData("card-id", o.id);
													e.dataTransfer.setData("card-sector", o.sector);
													e.dataTransfer.setData("text/plain", o.id);
													setTimeout(() => {
														setDraggedCardId(o.id);
														setDraggedCardSector(o.sector);
													}, 0);
												},
												onDragEnd: () => {
													setDraggedCardId(null);
													setDraggedCardSector(null);
													setDragOverStageId(null);
												},
												onClick: () => setSelectedOrderId(o.id),
												className: cn("p-3.5 rounded-lg border shadow-sm transition-all relative overflow-hidden cursor-pointer", o.isAdjustmentReturn ? "bg-yellow-400 border-yellow-500 hover:border-yellow-600 shadow-md dark:bg-yellow-500/90 dark:border-yellow-600" : "bg-white dark:bg-background border-slate-200 dark:border-border", canDragCards && !o.isAdjustmentReturn && "active:cursor-grabbing hover:border-primary/50 hover:shadow-md", draggedCardId === o.id && "opacity-50 scale-[0.98] border-dashed shadow-none"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute left-0 top-0 bottom-0 w-1", isPendingCard ? "bg-red-500/80 dark:bg-red-600/80" : o.isAdjustmentReturn ? "bg-yellow-600/50" : "bg-primary/20 dark:bg-primary/40") }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-start mb-2 pl-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: cn("text-xs font-bold", o.isAdjustmentReturn ? "text-yellow-900" : "text-slate-500"),
																children: o.friendlyId
															}), o.fileUrls && o.fileUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: cn("w-3 h-3 opacity-70", o.isAdjustmentReturn ? "text-yellow-900" : "text-primary") })]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
															status: o.status,
															className: "scale-[0.8] origin-top-right -mt-1.5 -mr-1.5"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: cn("font-medium text-sm truncate pl-1", o.isAdjustmentReturn ? "text-yellow-950 font-bold" : ""),
														children: o.patientName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: cn("text-xs mt-1 truncate pl-1", o.isAdjustmentReturn ? "text-yellow-900" : "text-slate-500"),
														children: o.workType
													}),
													isPendingCard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-2.5 mb-0.5 bg-red-600 dark:bg-red-700 text-white text-[10px] font-bold px-2 py-1.5 rounded text-center uppercase tracking-wider shadow-sm w-full leading-tight",
														children: "Aguardando Retorno do Dentista"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: cn("flex justify-between items-center mt-3 pt-2 border-t gap-1", o.isAdjustmentReturn ? "border-yellow-500/30" : ""),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: cn("text-[10px] font-medium truncate flex-1 pl-1", o.isAdjustmentReturn ? "text-yellow-800" : "text-slate-400"),
															children: !isDentist && o.dentistName
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 shrink-0",
															children: [!isDentist && !stage.name.toUpperCase().includes("FINALIZADO") && !stage.name.toUpperCase().includes("ENTREGUE") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
																variant: "outline",
																size: "sm",
																disabled: finishingOrderId === o.id,
																className: cn("h-[22px] px-2 py-0 text-[10px] font-bold", o.isAdjustmentReturn ? "border-yellow-600 text-yellow-800 hover:bg-yellow-500 hover:text-yellow-950 bg-yellow-500/50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-500 dark:hover:bg-emerald-900/50"),
																onClick: (e) => {
																	e.stopPropagation();
																	handleQuickFinish(o.id);
																},
																title: "Mover para Finalizados e Entregues",
																children: [finishingOrderId === o.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("w-3 h-3 mr-1 border-[1.5px] border-t-transparent rounded-full animate-spin", o.isAdjustmentReturn ? "border-yellow-900" : "border-emerald-600") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 mr-1" }), "Finalizar"]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanCardTimer, {
																order: o,
																currentStage: stage.name
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-col gap-1.5 mt-3 w-full",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															variant: "secondary",
															size: "sm",
															className: cn("w-full text-[10px] font-bold uppercase h-7 transition-colors px-1", o.isAdjustmentReturn ? "bg-yellow-500 text-yellow-950 hover:bg-yellow-600 border border-yellow-600" : "bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10"),
															onClick: (e) => {
																e.stopPropagation();
																navigate(`/order/${o.id}`);
															},
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3 h-3 mr-1 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "truncate",
																children: "ABRIR REQUISIÇÃO"
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex gap-1.5 w-full",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
																variant: "outline",
																size: "sm",
																className: cn("flex-1 text-[9px] font-bold uppercase h-7 transition-colors px-1", o.isAdjustmentReturn ? "border-yellow-600 text-yellow-900 hover:bg-yellow-500" : "border-primary/20 text-primary hover:bg-primary/10"),
																onClick: (e) => {
																	e.stopPropagation();
																	setSelectedFullQrOrder(o);
																},
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-2.5 h-2.5 mr-1 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "truncate",
																	children: "QR PEDIDO"
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
																variant: "outline",
																size: "sm",
																className: cn("flex-1 text-[9px] font-bold uppercase h-7 transition-colors px-1", o.isAdjustmentReturn ? "border-yellow-600 text-yellow-900 hover:bg-yellow-500" : "border-primary/20 text-primary hover:bg-primary/10"),
																onClick: (e) => {
																	e.stopPropagation();
																	setSelectedPrintQrOrder(o);
																},
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-2.5 h-2.5 mr-1 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "truncate",
																	children: "QR IMPRESSÃO"
																})]
															})]
														})]
													})
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
											side: "right",
											sideOffset: 8,
											className: cn("text-primary-foreground border-primary shadow-xl z-[100] w-64 p-3 animate-in fade-in-0 zoom-in-95", o.isAdjustmentReturn ? "bg-yellow-500 text-yellow-950 border-yellow-600" : "bg-primary"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-sm leading-tight",
														children: o.patientName
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] font-medium opacity-80 uppercase tracking-wider mt-0.5",
														children: [
															o.friendlyId,
															" ",
															o.isAdjustmentReturn ? " (AJUSTE)" : ""
														]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs space-y-1 opacity-90",
														children: [
															!isDentist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold opacity-100",
																	children: "Dr(a):"
																}),
																" ",
																o.dentistName
															] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold opacity-100",
																	children: "Trabalho:"
																}),
																" ",
																o.workType
															] }),
															o.material && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold opacity-100",
																	children: "Material:"
																}),
																" ",
																o.material
															] }),
															o.fileUrls && o.fileUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "flex items-center gap-1 mt-1 text-inherit",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-3 h-3" }),
																	" ",
																	o.fileUrls.length,
																	" arquivo(s) anexo(s)"
																]
															})
														]
													}),
													o.observations && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: cn("mt-2 pt-2 border-t text-xs", o.isAdjustmentReturn ? "border-yellow-700/30" : "border-primary-foreground/20"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-semibold mb-1",
															children: "Observações:"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "opacity-90 line-clamp-4 leading-relaxed",
															children: o.observations
														})]
													})
												]
											})
										})]
									}, o.id)), hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "w-full text-xs font-bold mt-1 text-pink-600 hover:text-pink-700 hover:bg-pink-50 border border-transparent hover:border-pink-200 uppercase tracking-wide transition-colors dark:hover:bg-pink-950/30",
										onClick: () => {
											const newSet = new Set(expandedCols);
											if (isExpanded) newSet.delete(`${activeLab}-${stage.id}`);
											else newSet.add(`${activeLab}-${stage.id}`);
											setExpandedCols(newSet);
										},
										children: isExpanded ? "Ver Menos" : `Ver Mais (+${cols.length - 4})`
									})]
								})]
							}, stage.id);
						}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "w-[300px] shrink-0 h-[100px] border-dashed border-2 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors bg-slate-50/30",
							onClick: () => setIsAddColumnOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-6 h-6 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-sm",
								children: "Adicionar Coluna"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetailsSheet, {
				order: selectedOrder,
				isOpen: !!selectedOrderId,
				onClose: () => setSelectedOrderId(null),
				obsText,
				setObsText,
				onSaveObs: handleSaveObs
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editingDescStage,
				onOpenChange: (open) => !open && setEditingDescStage(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Descrição da Coluna" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Explique o propósito ou requisitos para a etapa",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: editingDescStage?.name
						}),
						"."
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: editDescText,
						onChange: (e) => setEditDescText(e.target.value),
						placeholder: "Ex: Todos os pedidos nesta coluna devem ter modelos validados.",
						className: "min-h-[120px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setEditingDescStage(null),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleSaveDesc,
						children: "Salvar Descrição"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAddColumnOpen,
				onOpenChange: (open) => {
					setIsAddColumnOpen(open);
					if (!open) setNewColumnName("");
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova Coluna" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: newColumnName,
						onChange: (e) => setNewColumnName(e.target.value),
						onKeyDown: async (e) => {
							if (e.key === "Enter" && newColumnName.trim()) {
								e.preventDefault();
								if (await addKanbanStage(newColumnName.trim())) {
									setNewColumnName("");
									setIsAddColumnOpen(false);
								}
							}
						},
						placeholder: "Ex: CONTROLE DE QUALIDADE",
						autoFocus: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							setNewColumnName("");
							setIsAddColumnOpen(false);
						},
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: async () => {
							if (newColumnName.trim()) {
								if (await addKanbanStage(newColumnName.trim())) {
									setNewColumnName("");
									setIsAddColumnOpen(false);
								}
							}
						},
						children: "Adicionar"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!deleteStageData,
				onOpenChange: (o) => !o && setDeleteStageData(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Excluir ", deleteStageData?.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Confirma a exclusão desta coluna?", hasOrders && " Selecione para qual coluna deseja mover os pedidos."] })] }),
					hasOrders && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-2 block text-sm",
							children: "Mover pedidos para:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: fallbackStageName,
							onValueChange: setFallbackStageName,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: kanbanStages.filter((s) => s.id !== deleteStageData?.id).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s.name,
								children: s.name
							}, s.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setDeleteStageData(null),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						disabled: hasOrders && !fallbackStageName,
						onClick: () => {
							if (deleteStageData) {
								deleteKanbanStage(deleteStageData.id, deleteStageData.name, hasOrders ? fallbackStageName : void 0);
								setDeleteStageData(null);
							}
						},
						children: "Excluir"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniGuideDialog, {
				order: selectedPrintQrOrder,
				isOpen: !!selectedPrintQrOrder,
				onClose: () => setSelectedPrintQrOrder(null),
				type: "print"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniGuideDialog, {
				order: selectedFullQrOrder,
				isOpen: !!selectedFullQrOrder,
				onClose: () => setSelectedFullQrOrder(null),
				type: "full"
			})
		]
	});
}
export { KanbanPage as default };

//# sourceMappingURL=Kanban-Dgb1luDK.js.map