import { t as Activity } from "./activity-AJTSRuh5.js";
import { t as ArrowLeft } from "./arrow-left-B497R7MW.js";
import { t as ArrowRight } from "./arrow-right-BDZynLUB.js";
import { t as Calendar } from "./calendar-BDF07wg1.js";
import { t as Circle } from "./circle-BumXtOwr.js";
import { t as Clock } from "./clock-DEk5AQiU.js";
import { t as DollarSign } from "./dollar-sign-DWD5ZkxP.js";
import { t as FileText } from "./file-text-C9arR2Dx.js";
import { t as StatusBadge } from "./StatusBadge-B57yAeDO.js";
import { B as supabase, It as require_react, Mt as useNavigate, Nt as useParams, St as require_jsx_runtime, a as useAppStore, h as format, l as formatBRL, p as ptBR, rt as processOrderHistory, t as Button, tt as cn, zt as __toESM } from "./index-C2ICZTGx.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-BSWFzLpS.js";
import "./badge-C9O18kE5.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function OrderDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { orders, kanbanStages } = useAppStore();
	const order = orders.find((o) => o.id === id);
	const [historyItems, setHistoryItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (order?.id) {
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
		}
	}, [order?.id, order?.history]);
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center",
		children: "Pedido não encontrado."
	});
	const processedHistory = processOrderHistory(historyItems.length > 0 ? historyItems : order.history, kanbanStages, order.kanbanStage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-5xl mx-auto space-y-6 pb-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: () => navigate(-1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold tracking-tight",
					children: ["Pedido ", order.friendlyId]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground flex items-center gap-2",
					children: ["Criado em ", format(new Date(order.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: order.status,
						className: "text-sm px-3 py-1"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:col-span-2 space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-subtle h-fit overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-4 border-b bg-muted/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-lg flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-5 h-5 text-primary" }), " Detalhes Clínicos"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-white p-1.5 rounded-md shadow-sm border border-slate-200 shrink-0 select-none",
							title: "Código de Barras do Pedido",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: `https://bwipjs-api.metafloor.com/?bcid=code128&text=${order.friendlyId}&scale=2&height=10&includetext=false`,
								alt: `Barcode ${order.friendlyId}`,
								className: "h-9 object-contain dark:invert mix-blend-multiply",
								draggable: false
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-6 pt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Paciente"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-lg",
										children: order.patientName
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Dentista Responsável"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.dentistName
									})] }),
									order.patientCpf && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "CPF do Paciente"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.patientCpf
									})] }),
									order.patientBirthDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Data de Nascimento"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: format(/* @__PURE__ */ new Date(order.patientBirthDate + "T00:00:00"), "dd/MM/yyyy")
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Trabalho"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.workType
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Material"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.material
									})] }),
									order.implantBrand && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground text-blue-600 dark:text-blue-400 font-semibold",
										children: "Marca do Implante"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.implantBrand
									})] }),
									order.implantType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground text-blue-600 dark:text-blue-400 font-semibold",
										children: "Tipo do Componente"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.implantType
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Cor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.shade || "Não especificada"
									})] }),
									order.shadeScale && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Escala"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.shadeScale
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Origem do Pedido"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.createdBy && [
											"admin",
											"master",
											"receptionist"
										].includes(order.createdBy.role) ? `Registrado por: ${order.createdBy.name}` : `Enviado por: ${order.createdBy?.name || order.dentistName}`
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Logística de Envio"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.shippingMethod === "lab_pickup" ? "Motoboy Laboratório" : "Responsabilidade do Dentista"
									})] }),
									order.stlDeliveryMethod && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Detalhes do Envio"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: order.stlDeliveryMethod
										})]
									})
								]
							}),
							(order.teeth.length > 0 || order.arches && order.arches.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-muted/30 p-4 rounded-md border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mb-2",
									children: "Elementos Envolvidos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [order.arches?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-primary/10 text-primary px-2 py-1 rounded font-semibold text-sm border border-primary/20",
										children: a
									}, a)), order.teeth.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm border border-primary/20",
										children: t
									}, t))]
								})]
							}),
							order.observations && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mb-1",
								children: "Observações"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm bg-muted/50 p-3 rounded-md italic border-l-4 border-l-primary whitespace-pre-wrap",
								children: order.observations
							})] })
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-subtle h-fit border-l-4 border-l-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-lg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-5 h-5 text-primary" }), " Financeiro"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-subtle h-fit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-lg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-primary" }), " Histórico de Etapas"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
					}) })]
				})]
			})]
		})]
	});
}
export { OrderDetails as default };

//# sourceMappingURL=OrderDetails-MoI7y1vx.js.map