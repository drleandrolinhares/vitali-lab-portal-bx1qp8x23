import { t as Activity } from "./activity-CKha9tQx.js";
import { t as Contact } from "./contact-CjyjnwWc.js";
import { t as StatusBadge } from "./StatusBadge-CFfVZkC4.js";
import { t as Search } from "./search-Dpk7n4Q3.js";
import { It as require_react, St as require_jsx_runtime, a as useAppStore, at as createLucideIcon, h as format, zt as __toESM } from "./index-pmBkMrzL.js";
import { t as Card } from "./card-C1itUhEE.js";
import { t as Input } from "./input-BG8tf8sQ.js";
import "./es2015-CuyAf7gs.js";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-C3DCHtRN.js";
import { t as Badge } from "./badge-C38H72ml.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-B5aj7q7b.js";
var Stethoscope = createLucideIcon("stethoscope", [
	["path", {
		d: "M11 2v2",
		key: "1539x4"
	}],
	["path", {
		d: "M5 2v2",
		key: "1yf1q8"
	}],
	["path", {
		d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",
		key: "rb5t3r"
	}],
	["path", {
		d: "M8 15a6 6 0 0 0 12 0v-3",
		key: "x18d4x"
	}],
	["circle", {
		cx: "20",
		cy: "10",
		r: "2",
		key: "ts1r5v"
	}]
]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Patients() {
	const { orders } = useAppStore();
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedPatientId, setSelectedPatientId] = (0, import_react.useState)(null);
	const patients = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		orders.forEach((o) => {
			const key = o.patientCpf ? `cpf_${o.patientCpf}` : `name_${o.patientName.toLowerCase().trim()}`;
			if (!map.has(key)) map.set(key, {
				id: key,
				name: o.patientName,
				cpf: o.patientCpf,
				birthDate: o.patientBirthDate,
				dentists: /* @__PURE__ */ new Map(),
				orders: []
			});
			const p = map.get(key);
			if (o.patientName.length > p.name.length) p.name = o.patientName;
			if (o.patientCpf) p.cpf = o.patientCpf;
			if (o.patientBirthDate) p.birthDate = o.patientBirthDate;
			if (!p.dentists.has(o.dentistId)) p.dentists.set(o.dentistId, {
				id: o.dentistId,
				name: o.dentistName
			});
			p.orders.push(o);
		});
		return Array.from(map.values()).map((p) => ({
			...p,
			dentists: Array.from(p.dentists.values())
		})).sort((a, b) => a.name.localeCompare(b.name));
	}, [orders]);
	const filteredPatients = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.cpf?.includes(search));
	const selectedPatient = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold tracking-tight text-primary flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, { className: "w-6 h-6" }), " Gestão de Pacientes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Listagem centralizada e histórico de pacientes."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-72",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Buscar por nome ou CPF...",
						className: "pl-9 bg-background",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-subtle border-muted/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paciente" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "CPF" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nascimento" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center",
							children: "Dentistas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center",
							children: "Total Pedidos"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredPatients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "h-24 text-center text-muted-foreground",
					children: "Nenhum paciente encontrado."
				}) }) : filteredPatients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "cursor-pointer hover:bg-muted/50",
					onClick: () => setSelectedPatientId(p.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium text-primary",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.cpf || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground/50",
							children: "-"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.birthDate ? format(/* @__PURE__ */ new Date(p.birthDate + "T00:00:00"), "dd/MM/yyyy") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground/50",
							children: "-"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "bg-muted/50",
								children: p.dentists.length
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: p.orders.length
							})
						})
					]
				}, p.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!selectedPatientId,
				onOpenChange: (open) => !open && setSelectedPatientId(null),
				children: selectedPatient && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					className: "w-full sm:max-w-xl overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
							className: "text-2xl",
							children: selectedPatient.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Detalhes e histórico consolidado deste paciente." })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4 p-4 bg-muted/30 rounded-lg border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground font-semibold uppercase",
											children: "CPF"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-base",
											children: selectedPatient.cpf || "Não informado"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground font-semibold uppercase",
											children: "Data de Nascimento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-base",
											children: selectedPatient.birthDate ? format(/* @__PURE__ */ new Date(selectedPatient.birthDate + "T00:00:00"), "dd/MM/yyyy") : "Não informada"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "w-4 h-4" }), " Dentistas Vinculados"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2",
								children: selectedPatient.dentists.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between p-3 border rounded-md bg-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-sm",
										children: d.name
									})
								}, d.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4" }),
									" Histórico de Pedidos (",
									selectedPatient.orders.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: selectedPatient.orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 border rounded-lg bg-background space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: o.friendlyId
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: format(new Date(o.createdAt), "dd/MM/yyyy 'às' HH:mm")
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
											status: o.status,
											className: "text-[10px] px-2 py-0.5"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 mt-2 pt-2 border-t",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block mb-0.5",
												children: "Trabalho"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: o.workType
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block mb-0.5",
												children: "Dentista"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: o.dentistName
											})]
										})]
									})]
								}, o.id))
							})] })
						]
					})]
				})
			})
		]
	});
}
export { Patients as default };

//# sourceMappingURL=Patients-C1beflrt.js.map