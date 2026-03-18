import { t as Activity } from "./activity-CKha9tQx.js";
import { t as ChartColumn } from "./chart-column-Bsu5YLPv.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Cr66VoU_.js";
import { t as CircleCheck } from "./circle-check-mf4rjI6W.js";
import { t as Download } from "./download-CDymS2BG.js";
import { t as LoaderCircle } from "./loader-circle-Wl0dWx0A.js";
import { t as Printer } from "./printer-BlX3vydO.js";
import { t as TriangleAlert } from "./triangle-alert-BW-aw_Gz.js";
import { t as Wallet } from "./wallet-ufYPQvB1.js";
import { B as supabase, Et as toast, It as require_react, St as require_jsx_runtime, a as useAppStore, c as filterOrdersForFinancials, f as getOrderFinancials, h as format, nt as formatCurrency, t as Button, zt as __toESM } from "./index-pmBkMrzL.js";
import { n as CardContent, t as Card } from "./card-C1itUhEE.js";
import "./es2015-CuyAf7gs.js";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-Dc_OHWq5.js";
import { t as Checkbox } from "./checkbox-70ZhO_sr.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-B5aj7q7b.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DWSa-D5N.js";
import { t as ScrollArea } from "./scroll-area-BwR0T5Mo.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function InvoicePreviewDialog({ open, onOpenChange, dentistName, clinicName, orders, totalAmount }) {
	const { appSettings } = useAppStore();
	const labRazao = appSettings["lab_razao_social"] || "";
	const labCnpj = appSettings["lab_cnpj"] || "";
	const labEndereco = appSettings["lab_address"] || "";
	const labTelefone = appSettings["lab_phone"] || "";
	const labEmail = appSettings["lab_email"] || "";
	const labSite = appSettings["lab_website"] || "";
	const labInstagram = appSettings["lab_instagram"] || "";
	const labPix = appSettings["lab_pix_key"] || "";
	const formatCurrency$1 = (val) => new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL"
	}).format(val);
	const handlePrint = () => {
		setTimeout(() => {
			window.print();
		}, 100);
	};
	const reactCompanyInfo = [labRazao ? `${labRazao}` : "", labCnpj ? `CNPJ: ${labCnpj}` : ""].filter(Boolean).join(" | ");
	const reactContacts = [
		labTelefone,
		labEmail,
		labSite,
		labInstagram
	].filter(Boolean).join(" | ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-4xl p-0 overflow-hidden bg-slate-100/60 border-none shadow-2xl backdrop-blur-sm print:bg-white print:shadow-none print:border-none print:backdrop-blur-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "sr-only",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Prévia de Faturamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Documento de prévia para conferência de faturamento do dentista." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-4 right-14 z-50 print:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handlePrint,
						className: "gap-2 shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), "Imprimir / Salvar PDF"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "max-h-[90vh] w-full print:max-h-none print:overflow-visible",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 md:py-8 md:px-12 flex justify-center min-h-full print:p-0 print:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full max-w-[800px] bg-white print:shadow-none print:border-none shadow-sm border border-slate-200 px-8 md:px-12 pb-12 pt-[2cm] print:pt-[2cm] print:px-[2cm] print:pb-[2cm] flex flex-col font-sans text-slate-900 mx-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-[80px] bg-transparent mb-[1cm] print:mb-[1cm]",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center mb-12 print:mb-12",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-lg font-bold tracking-[0.1em] uppercase text-slate-900 m-0 print:text-black print:text-lg",
										children: "RECIBO DE PRESTAÇÃO DE SERVIÇOS"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-row justify-between mb-8 print:mb-8 border-b border-slate-200 print:border-slate-800 pb-6 print:pb-6 gap-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col text-left flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-slate-600 mb-1.5",
											children: "Cliente"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-bold text-slate-900 uppercase print:text-black",
											children: dentistName
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col text-right flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-slate-600 mb-1.5",
											children: "Clínica"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-bold text-slate-900 uppercase print:text-black",
											children: clinicName || "NÃO INFORMADA"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 relative",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-[13px] text-left border-collapse",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b-2 border-slate-900 print:border-black",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px]",
													children: "Data"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px]",
													children: "Pedido"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px]",
													children: "Paciente"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px]",
													children: "Serviço"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px] text-right",
													children: "Valor"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
											className: "divide-y border-slate-100 print:divide-slate-300",
											children: [orders.map((order, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-slate-50/50 transition-colors border-b border-dashed border-slate-200 print:border-slate-300 print:border-dashed",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-4 px-2 whitespace-nowrap text-slate-700 print:text-black font-medium",
														children: order.created_at || order.createdAt ? format(new Date(order.created_at || order.createdAt), "dd/MM/yyyy") : "-"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-4 px-2 whitespace-nowrap text-slate-700 print:text-black font-medium",
														children: order.friendly_id || order.friendlyId || order.id?.substring(0, 8) || "-"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-4 px-2 uppercase text-slate-700 print:text-black font-medium",
														children: order.patient_name || order.patientName || "-"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-4 px-2 uppercase text-slate-700 print:text-black font-medium",
														children: order.work_type || order.workType || order.service || "-"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-4 px-2 text-right whitespace-nowrap text-slate-900 font-bold print:text-black",
														children: formatCurrency$1(order.base_price ?? order.basePrice ?? order.price ?? 0)
													})
												]
											}, order.id || i)), orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												colSpan: 5,
												className: "py-12 text-center text-slate-500 print:text-black",
												children: "Nenhum pedido selecionado."
											}) })]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-end pt-6 mt-6 space-y-1 border-t border-slate-200 print:border-slate-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-bold text-slate-500 uppercase tracking-widest print:text-slate-600",
										children: "Total Selecionado"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-bold text-slate-900 print:text-black",
										children: formatCurrency$1(totalAmount)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-20 pt-8 border-t border-slate-200 print:border-slate-300 text-center text-xs text-slate-600 print:text-black space-y-1.5 leading-relaxed flex flex-col items-center",
									children: [
										reactCompanyInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-900 print:text-black text-sm",
											children: reactCompanyInfo
										}),
										labEndereco && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-[13px]",
											children: labEndereco
										}),
										reactContacts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 font-medium text-[13px]",
											children: reactContacts
										}),
										labPix && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-8 border border-slate-300 print:border-slate-500 bg-slate-50/50 print:bg-transparent py-4 px-8 inline-flex flex-col items-center rounded-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-slate-600 mb-1.5",
												children: "Pagamento via PIX"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-slate-900 font-extrabold text-base tracking-widest uppercase print:text-black",
												children: ["CHAVE: ", labPix]
											})]
										})
									]
								})
							]
						})
					})
				})
			]
		})
	});
}
var MONTHS = [
	{
		value: "0",
		label: "Janeiro"
	},
	{
		value: "1",
		label: "Fevereiro"
	},
	{
		value: "2",
		label: "Março"
	},
	{
		value: "3",
		label: "Abril"
	},
	{
		value: "4",
		label: "Maio"
	},
	{
		value: "5",
		label: "Junho"
	},
	{
		value: "6",
		label: "Julho"
	},
	{
		value: "7",
		label: "Agosto"
	},
	{
		value: "8",
		label: "Setembro"
	},
	{
		value: "9",
		label: "Outubro"
	},
	{
		value: "10",
		label: "Novembro"
	},
	{
		value: "11",
		label: "Dezembro"
	}
];
var YEARS = Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ ((/* @__PURE__ */ new Date()).getFullYear() - i).toString());
function AdminFinancial() {
	const { orders: storeOrders, priceList, kanbanStages, loading: storeLoading, refreshOrders } = useAppStore();
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth().toString());
	const [selectedYear, setSelectedYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear().toString());
	const [selectedDentist, setSelectedDentist] = (0, import_react.useState)("all");
	const [loadingSettlements, setLoadingSettlements] = (0, import_react.useState)(true);
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [settlements, setSettlements] = (0, import_react.useState)([]);
	const [manualInvoiceDentist, setManualInvoiceDentist] = (0, import_react.useState)(null);
	const [selectedOrderIds, setSelectedOrderIds] = (0, import_react.useState)([]);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [previewOpen, setPreviewOpen] = (0, import_react.useState)(false);
	const fetchData = async () => {
		setLoadingSettlements(true);
		try {
			const { data: { session }, error: sessionError } = await supabase.auth.getSession();
			if (sessionError || !session) return;
			const [profilesRes, settlementsRes] = await Promise.all([supabase.from("profiles").select("id, name, clinic, closing_date, payment_due_date").eq("role", "dentist").order("name"), supabase.from("settlements").select("id, amount, created_at, dentist_id")]);
			if (profilesRes.error) throw profilesRes.error;
			if (settlementsRes.error) throw settlementsRes.error;
			if (profilesRes.data) setProfiles(profilesRes.data);
			if (settlementsRes.data) setSettlements(settlementsRes.data);
		} catch (error) {
			console.error("Error fetching financial data:", error);
			if (error?.message?.toLowerCase().includes("refresh token") || error?.message?.includes("session_not_found") || error?.message?.includes("refresh_token_not_found") || error?.code === "PGRST301" || error?.code === "401") console.warn("Session expired during AdminFinancial fetch");
			else toast({
				title: "Erro ao buscar dados financeiros",
				variant: "destructive"
			});
		} finally {
			setLoadingSettlements(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const formattedSelectedMonthYear = `${selectedYear}-${(parseInt(selectedMonth) + 1).toString().padStart(2, "0")}`;
	const { summary, tableData } = (0, import_react.useMemo)(() => {
		let faturar = 0;
		let pipeline = 0;
		let recebido = 0;
		const inadimplencia = 0;
		const map = /* @__PURE__ */ new Map();
		profiles.forEach((p) => {
			if (selectedDentist !== "all" && p.id !== selectedDentist) return;
			map.set(p.id, {
				id: p.id,
				name: p.name,
				clinic: p.clinic,
				closing_date: p.closing_date,
				payment_due_date: p.payment_due_date,
				finalizadosMes: 0,
				emProducao: 0,
				readyToInvoiceCount: 0,
				unsettledOrders: []
			});
		});
		const safeOrders = Array.isArray(storeOrders) ? storeOrders : [];
		const safePriceList = Array.isArray(priceList) ? priceList : [];
		const safeKanbanStages = Array.isArray(kanbanStages) ? kanbanStages : [];
		filterOrdersForFinancials(safeOrders, formattedSelectedMonthYear).map((o) => getOrderFinancials(o, safePriceList, safeKanbanStages)).map((order) => {
			const discount = order.dentistDiscount || 0;
			const expectedTotal = order.unitPrice * order.quantity * (1 - discount / 100);
			const finalBasePrice = Math.abs((order.basePrice || 0) - expectedTotal) < .01 ? order.basePrice : expectedTotal;
			return {
				...order,
				basePrice: finalBasePrice
			};
		}).forEach((o) => {
			if (selectedDentist !== "all" && o.dentistId !== selectedDentist) return;
			const isCompleted = o.status === "completed" || o.status === "delivered";
			const isCancelled = o.status === "cancelled";
			if (isCompleted && !o.settlementId) faturar += o.basePrice || 0;
			if (!isCompleted && !isCancelled) pipeline += o.basePrice || 0;
			if (!o.dentistId || !map.has(o.dentistId)) return;
			const dentistData = map.get(o.dentistId);
			if (isCompleted && !o.settlementId) {
				dentistData.finalizadosMes += o.basePrice || 0;
				dentistData.readyToInvoiceCount += 1;
				dentistData.unsettledOrders.push(o);
			}
			if (!isCompleted && !isCancelled) dentistData.emProducao += o.basePrice || 0;
		});
		const isSamePeriod = (dateVal) => {
			if (!dateVal) return false;
			const d = new Date(dateVal);
			return d.getMonth().toString() === selectedMonth && d.getFullYear().toString() === selectedYear;
		};
		settlements.forEach((s) => {
			if (selectedDentist !== "all" && s.dentist_id !== selectedDentist) return;
			if (isSamePeriod(s.created_at)) recebido += Number(s.amount || 0);
		});
		const activeTableData = Array.from(map.values()).filter((d) => d.finalizadosMes > 0 || d.emProducao > 0 || d.readyToInvoiceCount > 0).sort((a, b) => b.finalizadosMes - a.finalizadosMes);
		return {
			summary: {
				faturar,
				pipeline,
				recebido,
				inadimplencia
			},
			tableData: activeTableData
		};
	}, [
		profiles,
		storeOrders,
		settlements,
		selectedMonth,
		selectedYear,
		selectedDentist,
		priceList,
		kanbanStages,
		formattedSelectedMonthYear
	]);
	const modalOrders = (0, import_react.useMemo)(() => {
		if (!manualInvoiceDentist) return [];
		const dentistData = tableData.find((d) => d.id === manualInvoiceDentist);
		if (!dentistData) return [];
		return dentistData.unsettledOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
	}, [manualInvoiceDentist, tableData]);
	(0, import_react.useEffect)(() => {
		if (manualInvoiceDentist) setSelectedOrderIds(modalOrders.map((o) => o.id));
		else setSelectedOrderIds([]);
	}, [manualInvoiceDentist, modalOrders]);
	const handleExport = () => {
		let csv = "Dentista / Clínica,Data de Fechamento,Data de Pagamento,Finalizados no Mês (R$),Em Produção (Pipeline) (R$)\n";
		tableData.forEach((d) => {
			csv += `"${d.name} ${d.clinic ? `/ ${d.clinic}` : ""}",${d.closing_date || ""},${d.payment_due_date || ""},${d.finalizadosMes},${d.emProducao}\n`;
		});
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `Producao_${MONTHS.find((m) => m.value === selectedMonth)?.label}_${selectedYear}.csv`;
		link.click();
	};
	const handleToggleAllOrders = (checked) => {
		if (checked) setSelectedOrderIds(modalOrders.map((o) => o.id));
		else setSelectedOrderIds([]);
	};
	const handleToggleOrder = (id, checked) => {
		if (checked) setSelectedOrderIds((prev) => [...prev, id]);
		else setSelectedOrderIds((prev) => prev.filter((x) => x !== id));
	};
	const handleConfirmInvoice = async () => {
		if (selectedOrderIds.length === 0) return;
		setIsSubmitting(true);
		try {
			const ordersToSettle = modalOrders.filter((o) => selectedOrderIds.includes(o.id));
			const totalAmount = ordersToSettle.reduce((sum, o) => sum + (o.basePrice || 0), 0);
			const snapshot = ordersToSettle.map((o) => ({
				id: o.id,
				friendlyId: o.friendlyId,
				patientName: o.patientName,
				workType: o.workType,
				clearedAmount: o.basePrice
			}));
			const { data, error } = await supabase.from("settlements").insert({
				dentist_id: manualInvoiceDentist,
				amount: totalAmount,
				orders_snapshot: snapshot
			}).select("id").single();
			if (error) throw error;
			const { error: updateError } = await supabase.from("orders").update({ settlement_id: data.id }).in("id", selectedOrderIds);
			if (updateError) throw updateError;
			toast({ title: "Fatura fechada com sucesso!" });
			fetchData();
			refreshOrders();
			setManualInvoiceDentist(null);
		} catch (err) {
			console.error(err);
			toast({
				title: "Erro ao fechar fatura",
				description: err.message,
				variant: "destructive"
			});
		} finally {
			setIsSubmitting(false);
		}
	};
	if (storeLoading || loadingSettlements) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center min-h-[calc(100vh-10rem)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mx-auto p-4 md:p-6 max-w-[1600px] flex flex-col gap-6 animate-in fade-in duration-500 lg:h-[calc(100vh-6rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 bg-primary/10 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-6 h-6 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight text-primary uppercase",
						children: "PAINEL GERENCIAL GLOBAL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm",
						children: "Visão financeira e acompanhamento de faturamento do laboratório."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-sm p-1 min-w-[200px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedDentist,
								onValueChange: setSelectedDentist,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "border-none shadow-none focus:ring-0 h-8 font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Todos os Dentistas" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Todos os Dentistas"
								}), profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p.id,
									children: p.name
								}, p.id))] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: handleExport,
							className: "gap-2 bg-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), " Exportar"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-sm p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedMonth,
									onValueChange: setSelectedMonth,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[140px] border-none shadow-none focus:ring-0 h-8 font-medium",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: m.value,
										children: m.label
									}, m.value)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px h-4 bg-slate-200" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedYear,
									onValueChange: setSelectedYear,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[100px] border-none shadow-none focus:ring-0 h-8 font-medium",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: YEARS.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: y,
										children: y
									}, y)) })]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "receber",
				className: "flex-1 flex flex-col min-h-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-fit flex-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "receber",
							children: "Contas a Receber"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "faturamento",
							children: "Faturamento"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "receber",
						className: "flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden mt-4 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "shadow-sm border-l-4 border-l-blue-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 pr-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 line-clamp-2 min-h-[32px] flex items-center",
												title: "Trabalhos Concluídos a Faturar",
												children: "Trabalhos Concluídos a Faturar"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-2xl font-bold text-blue-600",
												children: formatCurrency(summary.faturar)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-3 bg-blue-50 rounded-full flex-none",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-5 h-5 text-blue-500" })
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "shadow-sm border-l-4 border-l-amber-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 pr-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 line-clamp-2 min-h-[32px] flex items-center",
												title: "Trabalhos em Pipeline de Produção",
												children: "Trabalhos em Pipeline de Produção"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-2xl font-bold text-amber-600",
												children: formatCurrency(summary.pipeline)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-3 bg-amber-50 rounded-full flex-none",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-5 h-5 text-amber-500" })
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "shadow-sm border-l-4 border-l-emerald-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 pr-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 min-h-[32px] flex items-center",
												children: "Recebido"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-2xl font-bold text-emerald-600",
												children: formatCurrency(summary.recebido)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-3 bg-emerald-50 rounded-full flex-none",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-emerald-500" })
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "shadow-sm border-l-4 border-l-red-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 pr-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 min-h-[32px] flex items-center",
												children: "Inadimplência"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-2xl font-bold text-red-600",
												children: formatCurrency(summary.inadimplencia)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-3 bg-red-50 rounded-full flex-none",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-red-500" })
										})]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "producao",
							className: "flex-1 flex flex-col min-h-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "w-fit flex-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "producao",
										className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
										children: "Produção em R$"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "faturas",
										className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
										children: "Faturas Fechadas"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "producao",
									className: "flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "flex-1 flex flex-col min-h-0 shadow-sm border-slate-200 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "overflow-auto flex-1 bg-white",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
												className: "bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "font-semibold text-slate-700 pl-6",
														children: "Dentista / Clínica"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "font-semibold text-slate-700 text-center",
														children: "Data de Fechamento"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "font-semibold text-slate-700 text-center",
														children: "Data de Pagamento"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "font-semibold text-slate-700 text-right",
														children: "Finalizados no Mês (R$)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "font-semibold text-slate-700 text-right",
														children: "Em Produção (Pipeline) (R$)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "font-semibold text-slate-700 text-right pr-6",
														children: "Ações"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: tableData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												colSpan: 6,
												className: "text-center py-12 text-muted-foreground",
												children: "Nenhum dado encontrado para o período e filtros selecionados."
											}) }) : tableData.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
												className: "hover:bg-slate-50/50",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
														className: "pl-6",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-semibold text-slate-900",
															children: row.name
														}), row.clinic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs text-muted-foreground",
															children: row.clinic
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
														className: "text-center font-medium text-slate-600",
														children: row.closing_date ? `Dia ${row.closing_date}` : "-"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
														className: "text-center font-medium text-slate-600",
														children: row.payment_due_date ? `Dia ${row.payment_due_date}` : "-"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
														className: "text-right font-medium text-blue-600",
														children: formatCurrency(row.finalizadosMes)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
														className: "text-right font-medium text-amber-600",
														children: formatCurrency(row.emProducao)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
														className: "text-right pr-6",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "outline",
															size: "sm",
															onClick: () => setManualInvoiceDentist(row.id),
															disabled: row.readyToInvoiceCount === 0,
															className: "text-xs font-semibold",
															children: "FECHAR FATURA MANUAL"
														})
													})
												]
											}, row.id)) })] })
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "faturas",
									className: "flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "flex-1 flex items-center justify-center text-muted-foreground bg-slate-50/50 border-dashed",
										children: "Nenhuma fatura fechada no período."
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "faturamento",
						className: "flex-1 m-0 data-[state=inactive]:hidden mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "h-full min-h-[400px] flex items-center justify-center text-muted-foreground border-dashed",
							children: "Módulo de Faturamento"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!manualInvoiceDentist,
				onOpenChange: (open) => !open && setManualInvoiceDentist(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
							className: "px-6 py-4 border-b",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Fechar Fatura Manual" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 overflow-auto p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-600 font-medium",
									children: "Pedidos concluídos e pendentes de faturamento:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										id: "select-all",
										checked: selectedOrderIds.length === modalOrders.length && modalOrders.length > 0,
										onCheckedChange: (c) => handleToggleAllOrders(!!c)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "select-all",
										className: "text-sm font-semibold cursor-pointer select-none",
										children: "Marcar Todos"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border rounded-md",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
									className: "bg-slate-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-12 text-center" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Pedido" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data de Entrada" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Valor"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [modalOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: selectedOrderIds.includes(o.id),
											onCheckedChange: (c) => handleToggleOrder(o.id, !!c)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "font-medium whitespace-nowrap",
										children: [o.friendlyId || o.id.substring(0, 8), o.patientName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground font-normal ml-2",
											children: ["- ", o.patientName]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: new Date(o.createdAt).toLocaleDateString("pt-BR") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-medium",
										children: formatCurrency(o.basePrice || 0)
									})
								] }, o.id)), modalOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 4,
									className: "text-center py-8 text-muted-foreground",
									children: "Nenhum pedido pendente para este dentista."
								}) })] })] })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 py-4 bg-slate-50 border-t flex justify-between items-center shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-500 uppercase tracking-widest",
									children: "Total Selecionado"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-bold text-slate-900",
									children: formatCurrency(modalOrders.filter((o) => selectedOrderIds.includes(o.id)).reduce((sum, o) => sum + (o.basePrice || 0), 0))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "default",
										onClick: () => setPreviewOpen(true),
										disabled: selectedOrderIds.length === 0,
										className: "gap-2",
										children: "PRÉVIA DA FATURA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => setManualInvoiceDentist(null),
										children: "Cancelar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleConfirmInvoice,
										disabled: selectedOrderIds.length === 0 || isSubmitting,
										className: "gap-2",
										children: [isSubmitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), "Confirmar Fechamento"]
									})
								]
							})]
						})
					]
				})
			}),
			manualInvoiceDentist && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoicePreviewDialog, {
				open: previewOpen,
				onOpenChange: setPreviewOpen,
				dentistName: profiles.find((p) => p.id === manualInvoiceDentist)?.name || "",
				clinicName: profiles.find((p) => p.id === manualInvoiceDentist)?.clinic || "",
				orders: modalOrders.filter((o) => selectedOrderIds.includes(o.id)),
				totalAmount: modalOrders.filter((o) => selectedOrderIds.includes(o.id)).reduce((sum, o) => sum + (o.basePrice || 0), 0)
			})
		]
	});
}
export { AdminFinancial as default };

//# sourceMappingURL=AdminFinancial-DGK5QSYI.js.map