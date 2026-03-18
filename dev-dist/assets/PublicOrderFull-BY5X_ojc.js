import { t as Activity } from "./activity-DMTuRZrA.js";
import { t as ArrowLeft } from "./arrow-left-BKsxj5Id.js";
import { t as ArrowRight } from "./arrow-right-DdNMFkSn.js";
import { t as Circle } from "./circle-CvwzqRB4.js";
import { t as Clock } from "./clock-CqtZm64c.js";
import { t as DollarSign } from "./dollar-sign-cSqSYim2.js";
import { t as FileText } from "./file-text-C-HEHrN6.js";
import { t as LoaderCircle } from "./loader-circle-DEb34VsC.js";
import { t as StatusBadge } from "./StatusBadge-pYY_pbL-.js";
import { B as supabase, It as require_react, Nt as useParams, Ot as Link, St as require_jsx_runtime, h as format, l as formatBRL, p as ptBR, rt as processOrderHistory, tt as cn, zt as __toESM } from "./index-DV4m2exc.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-DxRwVnHC.js";
import "./badge-AD_VTyfd.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function PublicOrderFull() {
	const { id } = useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const fetchFullDetails = async () => {
			if (!id) return;
			try {
				const { data: result, error: rpcError } = await supabase.rpc("get_public_order_full_details", { target_order_id: id });
				if (rpcError) throw rpcError;
				if (result) setData(result);
				else setError(true);
			} catch (err) {
				console.error(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		fetchFullDetails();
	}, [id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-slate-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" })
	});
	if (error || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-slate-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center p-6 bg-white border rounded-xl shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold text-slate-800",
				children: "Pedido não encontrado"
			})
		})
	});
	const quantity = data.quantity || 1;
	const basePrice = data.base_price || 0;
	const discount = data.discount || 0;
	const unitPrice = quantity > 0 && discount < 100 ? basePrice / (1 - discount / 100) / quantity : 0;
	const processedHistory = processOrderHistory(data.history || [], data.kanban_stages || [], data.kanban_stage);
	const teeth = data.tooth_or_arch?.teeth || [];
	const arches = data.tooth_or_arch?.arches || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50/50 pb-12 font-sans text-slate-900",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6 shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-sm font-semibold text-slate-500 uppercase tracking-widest",
					children: ["PORTAL DIGITAL • ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-800",
						children: "Vitali Lab"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase border border-emerald-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex h-2 w-2 mr-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })]
					}), "Laboratório Online"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-slate-400 hover:text-slate-600 transition-colors shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-6 h-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-3xl font-extrabold tracking-tight text-slate-900",
						children: ["Pedido ", data.friendly_id]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-slate-500 font-medium mt-1 text-sm sm:text-base",
						children: [
							"Criado em",
							" ",
							format(new Date(data.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
					status: data.status,
					className: "px-4 py-1.5 text-sm rounded-full bg-amber-50 text-amber-700 border-amber-200 shrink-0"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-4 border-b border-slate-100 px-6 pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-xl font-bold flex items-center gap-2 text-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-6 h-6 text-pink-600" }), " Detalhes Clínicos"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 select-none opacity-80 mix-blend-multiply",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `https://bwipjs-api.metafloor.com/?bcid=code128&text=${data.friendly_id}&scale=2&height=12&includetext=false`,
									alt: "Barcode",
									className: "h-10 object-contain",
									draggable: false
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "px-6 py-6 space-y-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
											children: "Paciente"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-800 text-lg uppercase",
											children: data.patient_name
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
											children: "Dentista Responsável"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-800 text-base uppercase",
											children: data.dentist_name
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
											children: "Trabalho"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-800 text-base uppercase",
											children: data.work_type
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
											children: "Material"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-800 text-base uppercase",
											children: data.material
										})] }),
										data.implant_brand && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
											children: "Marca do Implante"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-800 text-base uppercase",
											children: data.implant_brand
										})] }),
										data.implant_type && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
											children: "Tipo do Componente"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-800 text-base uppercase",
											children: data.implant_type
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
											children: "Cor"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-800 text-base uppercase",
											children: data.color_and_considerations || "N/A"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
											children: "Origem do Pedido"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-bold text-slate-800 text-base uppercase",
											children: ["Registrado por: ", data.creator_name || data.dentist_name]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1",
												children: "Logística de Envio"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-slate-800 text-base",
												children: data.shipping_method === "lab_pickup" ? "Motoboy Laboratório" : "Responsabilidade do Dentista"
											})]
										})
									]
								}),
								(teeth.length > 0 || arches.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50/50 p-4 rounded-xl border border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3",
										children: "Elementos Envolvidos"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [arches.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-pink-100 text-pink-700 px-3 py-1 rounded-md font-bold text-sm border border-pink-200/50",
											children: a
										}, a)), teeth.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-pink-100 text-pink-700 px-3 py-1 rounded-md font-bold text-sm border border-pink-200/50",
											children: t
										}, t))]
									})]
								}),
								data.observations && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",
									children: "Observações"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-slate-50/80 p-4 rounded-r-xl rounded-l-sm border border-slate-100 border-l-[4px] border-l-pink-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm italic font-medium text-slate-700 whitespace-pre-wrap leading-relaxed",
										children: data.observations
									})
								})] })
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white border-l-[6px] border-l-pink-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-4 px-6 pt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-lg font-bold flex items-center gap-2 text-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-5 h-5 text-pink-600" }), " Financeiro"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "px-6 pb-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium",
										children: "Valor Unitário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										children: formatBRL(unitPrice)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium",
										children: "Quantidade (Elementos)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										children: quantity
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center pt-4 border-t border-slate-100 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 text-base",
										children: "Total do Pedido"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-black text-pink-600 text-lg",
										children: formatBRL(basePrice)
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-4 border-b border-slate-50 px-6 pt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-lg font-bold flex items-center gap-2 text-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-pink-600" }), " Histórico de Etapas"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "px-6 py-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-6 relative before:absolute before:inset-0 before:ml-[35px] before:h-full before:w-px before:bg-slate-200",
								children: processedHistory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("absolute left-0 mt-0.5 w-6 h-6 rounded-full ring-4 ring-white z-10 flex items-center justify-center border", item.isCurrent ? "bg-pink-600 text-white border-pink-600 shadow-sm" : "bg-slate-100 text-slate-400 border-slate-200"),
										children: item.direction === "backward" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3.5 h-3.5" }) : item.direction === "forward" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "w-2 h-2 fill-current" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ml-10 w-full space-y-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: cn("text-sm font-bold uppercase", item.isCurrent ? "text-slate-900" : "text-slate-600"),
												children: item.stageName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), format(new Date(item.date), "dd/MM 'às' HH:mm")]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500 whitespace-nowrap",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), item.durationStr]
											})]
										})
									})]
								}, item.id))
							})
						})]
					})]
				})]
			})]
		})]
	});
}
export { PublicOrderFull as default };

//# sourceMappingURL=PublicOrderFull-BY5X_ojc.js.map