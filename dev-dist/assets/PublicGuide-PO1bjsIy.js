import { t as LoaderCircle } from "./loader-circle-DJk1CNkA.js";
import { B as supabase, It as require_react, Nt as useParams, St as require_jsx_runtime, zt as __toESM } from "./index-RFqS_88P.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function PublicGuide() {
	const { id } = useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const fetchGuide = async () => {
			if (!id) return;
			try {
				const { data: result, error: rpcError } = await supabase.rpc("get_public_order_guide", { target_order_id: id });
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
		fetchGuide();
	}, [id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-slate-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground font-medium",
			children: "Carregando guia..."
		})]
	});
	if (error || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-slate-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center p-6 max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold text-slate-800",
				children: "Guia não encontrada"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-500 mt-2 text-sm",
				children: "O pedido solicitado não existe ou foi removido do sistema."
			})]
		})
	});
	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-50 flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[340px] bg-white border border-slate-200 rounded-2xl shadow-sm p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-6 border-b border-slate-100 pb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-extrabold text-2xl uppercase leading-tight tracking-tight text-slate-800",
						children: "VITALI LAB"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mt-1",
						children: data.friendly_id
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: qrUrl,
						alt: "QR Code",
						className: "w-40 h-40 object-contain mix-blend-multiply",
						crossOrigin: "anonymous"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-slate-50/80 p-4 rounded-xl border border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold uppercase text-[10px] text-slate-400 block mb-1 tracking-wider",
							children: "Paciente"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-base block text-slate-800 uppercase break-words leading-tight",
							children: data.patient_name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-slate-50/80 p-4 rounded-xl border border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold uppercase text-[10px] text-slate-400 block mb-1 tracking-wider",
							children: "Dentista"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-base block text-slate-800 uppercase break-words leading-tight",
							children: data.dentist_name
						})]
					})]
				})
			]
		})
	});
}
export { PublicGuide as default };

//# sourceMappingURL=PublicGuide-PO1bjsIy.js.map