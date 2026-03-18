import { i as Building, n as AvatarFallback, r as AvatarImage, t as Avatar } from "./avatar-Cl_K7Zb9.js";
import { t as Camera } from "./camera-CWZZA-qu.js";
import { t as EyeOff } from "./eye-off-BZ7ahMsv.js";
import { t as Eye } from "./eye-8MhLfGX8.js";
import { t as LoaderCircle } from "./loader-circle-C4OPbPAE.js";
import { t as Phone } from "./phone-1Z5vpscG.js";
import { t as Save } from "./save-BbieaJrk.js";
import { t as ScanLine } from "./scan-line-CUyEhX5l.js";
import { t as Trash2 } from "./trash-2-VD_rxPz2.js";
import { t as User } from "./user-N_JBJZlE.js";
import { B as supabase, Et as toast, It as require_react, Pt as useSearchParams, St as require_jsx_runtime, a as useAppStore, at as createLucideIcon, t as Button, zt as __toESM } from "./index-C2ICZTGx.js";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BSWFzLpS.js";
import { t as Input } from "./input-BAEKRk1K.js";
import { t as Label } from "./label-MTDCTxj5.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-UedgwfLZ.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CZ2uKzgf.js";
import { t as Switch } from "./switch--fXWaEKt.js";
var Link = createLucideIcon("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function WorkSchedule() {
	const [staff, setStaff] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const fetchStaff = async () => {
		setLoading(true);
		const { data } = await supabase.from("profiles").select("*").neq("role", "dentist").eq("is_active", true).order("name", { ascending: true });
		if (data) setStaff(data);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchStaff();
	}, []);
	const handleUpdate = (id, field, value) => {
		setStaff((prev) => prev.map((s) => s.id === id ? {
			...s,
			[field]: value
		} : s));
	};
	const saveSchedule = async (user) => {
		setSaving(user.id);
		const { error } = await supabase.from("profiles").update({
			work_start: user.work_start || null,
			lunch_start: user.lunch_start || null,
			lunch_end: user.lunch_end || null,
			work_end: user.work_end || null
		}).eq("id", user.id);
		if (error) toast({
			title: "ERRO AO SALVAR ESCALA",
			variant: "destructive"
		});
		else toast({ title: "ESCALA SALVA COM SUCESSO" });
		setSaving(null);
	};
	const calculateHours = (u) => {
		if (!u.work_start || !u.lunch_start || !u.lunch_end || !u.work_end) return "--";
		const toMins = (t) => {
			const [h, m] = t.split(":").map(Number);
			return h * 60 + (m || 0);
		};
		const wStart = toMins(u.work_start);
		const lStart = toMins(u.lunch_start);
		const lEnd = toMins(u.lunch_end);
		const total = toMins(u.work_end) - wStart - (lEnd - lStart);
		if (total <= 0 || isNaN(total)) return "--";
		return `${Math.floor(total / 60)}H ${(total % 60).toString().padStart(2, "0")}M`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-between items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground uppercase font-semibold",
				children: "GERENCIE A JORNADA DE TRABALHO DA EQUIPE DO LABORATÓRIO (EXCLUI DENTISTAS E USUÁRIOS INATIVOS)."
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border rounded-xl bg-card overflow-hidden overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
				className: "min-w-[800px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "uppercase text-xs font-bold",
						children: "COLABORADOR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "uppercase text-xs font-bold",
						children: "ENTRADA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "uppercase text-xs font-bold",
						children: "IDA ALMOÇO"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "uppercase text-xs font-bold",
						children: "VOLTA ALMOÇO"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "uppercase text-xs font-bold",
						children: "SAÍDA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-center uppercase text-xs font-bold",
						children: "TOTAL DIÁRIO"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right uppercase text-xs font-bold",
						children: "AÇÕES"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					colSpan: 7,
					className: "h-32 text-center text-muted-foreground uppercase text-xs font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-6 h-6 animate-spin mx-auto mb-2" }), "CARREGANDO EQUIPE..."]
				}) }) : staff.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "h-32 text-center text-muted-foreground uppercase text-xs font-bold",
					children: "NENHUM COLABORADOR ENCONTRADO."
				}) }) : staff.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium whitespace-nowrap uppercase text-sm",
							children: user.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground uppercase font-semibold",
							children: user.job_function || user.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground uppercase font-semibold",
							children: user.personal_phone || (user.email?.includes("@vitalilab.local") ? "SEM EMAIL" : user.email)
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "time",
						value: user.work_start || "",
						onChange: (e) => handleUpdate(user.id, "work_start", e.target.value),
						className: "w-[110px]"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "time",
						value: user.lunch_start || "",
						onChange: (e) => handleUpdate(user.id, "lunch_start", e.target.value),
						className: "w-[110px]"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "time",
						value: user.lunch_end || "",
						onChange: (e) => handleUpdate(user.id, "lunch_end", e.target.value),
						className: "w-[110px]"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "time",
						value: user.work_end || "",
						onChange: (e) => handleUpdate(user.id, "work_end", e.target.value),
						className: "w-[110px]"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-center font-semibold text-primary whitespace-nowrap uppercase text-sm",
						children: calculateHours(user)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => saveSchedule(user),
							disabled: saving === user.id,
							children: saving === user.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 text-emerald-600" })
						})
					})
				] }, user.id)) })]
			})
		})]
	});
}
function ResetPasswordTab() {
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showNewPassword, setShowNewPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast({
				title: "AS SENHAS NÃO COINCIDEM",
				variant: "destructive"
			});
			return;
		}
		if (newPassword.length < 6) {
			toast({
				title: "A SENHA DEVE TER PELO MENOS 6 CARACTERES",
				variant: "destructive"
			});
			return;
		}
		setLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({ password: newPassword });
			if (error) {
				if (error.code === "same_password" || error.message?.toLowerCase().includes("different from the old") || error.message?.toLowerCase().includes("same password")) {
					toast({
						title: "SENHA INVÁLIDA",
						description: "A nova senha deve ser diferente da senha atual.",
						variant: "destructive"
					});
					return;
				}
				if (error.message?.includes("Session from session_id claim in JWT does not exist") || error.message?.includes("session_not_found") || error.code === "session_not_found" || error.status === 403) {
					await supabase.auth.signOut();
					toast({
						title: "SESSÃO EXPIRADA",
						description: "Sua sessão expirou. Por favor, realize o login novamente para alterar sua senha.",
						variant: "destructive"
					});
					window.location.href = "/";
					return;
				}
				toast({
					title: "ERRO AO ATUALIZAR SENHA",
					description: error.message,
					variant: "destructive"
				});
			} else {
				toast({ title: "SENHA ATUALIZADA COM SUCESSO!" });
				setNewPassword("");
				setConfirmPassword("");
			}
		} catch (err) {
			if (err?.code === "same_password" || err?.message?.toLowerCase().includes("different from the old") || err?.message?.toLowerCase().includes("same password")) {
				toast({
					title: "SENHA INVÁLIDA",
					description: "A nova senha deve ser diferente da senha atual.",
					variant: "destructive"
				});
				return;
			}
			if (err?.message?.includes("Session from session_id claim in JWT does not exist") || err?.message?.includes("session_not_found") || err?.code === "session_not_found" || err?.status === 403) {
				await supabase.auth.signOut();
				toast({
					title: "SESSÃO EXPIRADA",
					description: "Sua sessão expirou. Por favor, realize o login novamente para alterar sua senha.",
					variant: "destructive"
				});
				window.location.href = "/";
				return;
			}
			toast({
				title: "ERRO AO ATUALIZAR SENHA",
				description: err.message || "Ocorreu um erro inesperado.",
				variant: "destructive"
			});
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-subtle max-w-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "uppercase",
			children: "REDEFINIR SENHA"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
			className: "uppercase text-xs font-semibold",
			children: "ATUALIZE SUA SENHA DE ACESSO AO SISTEMA."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "uppercase text-xs font-bold",
						children: "NOVA SENHA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: showNewPassword ? "text" : "password",
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value),
							required: true,
							className: "pr-10 normal-case"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							className: "absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent",
							onClick: () => setShowNewPassword(!showNewPassword),
							children: showNewPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "uppercase text-xs font-bold",
						children: "CONFIRMAR NOVA SENHA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: showConfirmPassword ? "text" : "password",
							value: confirmPassword,
							onChange: (e) => setConfirmPassword(e.target.value),
							required: true,
							className: "pr-10 normal-case"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							className: "absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent",
							onClick: () => setShowConfirmPassword(!showConfirmPassword),
							children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: loading,
					className: "w-full uppercase text-xs font-bold",
					children: loading ? "ATUALIZANDO..." : "ATUALIZAR SENHA"
				})
			]
		}) })]
	});
}
function SettingsPage() {
	const { currentUser, appSettings, updateSetting, updateProfile } = useAppStore();
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") || "profile";
	const [labLink, setLabLink] = (0, import_react.useState)("");
	const [scanServiceEnabled, setScanServiceEnabled] = (0, import_react.useState)(false);
	const [savingSystem, setSavingSystem] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [clinic, setClinic] = (0, import_react.useState)("");
	const [jobFunction, setJobFunction] = (0, import_react.useState)("");
	const [whatsappGroupLink, setWhatsappGroupLink] = (0, import_react.useState)("");
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)("");
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const [uploadingAvatar, setUploadingAvatar] = (0, import_react.useState)(false);
	const [scales, setScales] = (0, import_react.useState)([]);
	const [newScale, setNewScale] = (0, import_react.useState)("");
	const [implantBrands, setImplantBrands] = (0, import_react.useState)([]);
	const [newBrand, setNewBrand] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setLabLink(appSettings?.whatsapp_lab_link || "");
		setScanServiceEnabled(appSettings?.scan_service_enabled === "true");
		try {
			if (appSettings?.shade_scales) setScales(JSON.parse(appSettings.shade_scales).sort((a, b) => a.localeCompare(b, "pt-BR")));
			if (appSettings?.implant_brands) setImplantBrands(JSON.parse(appSettings.implant_brands).sort((a, b) => a.localeCompare(b, "pt-BR")));
		} catch (e) {
			console.error("Failed to parse settings JSON", e);
		}
	}, [appSettings]);
	(0, import_react.useEffect)(() => {
		if (currentUser) {
			setName(currentUser.name || "");
			setClinic(currentUser.clinic || "");
			setJobFunction(currentUser.job_function || "");
			setWhatsappGroupLink(currentUser.whatsapp_group_link || "");
			setAvatarUrl(currentUser.avatar_url || "");
		}
	}, [currentUser]);
	const handleSaveSystem = async () => {
		setSavingSystem(true);
		let finalLink = labLink.trim();
		if (finalLink && !finalLink.startsWith("http://") && !finalLink.startsWith("https://")) finalLink = `https://${finalLink}`;
		await updateSetting("whatsapp_lab_link", finalLink);
		setLabLink(finalLink);
		setSavingSystem(false);
		toast({ title: "CONFIGURAÇÕES SALVAS COM SUCESSO" });
	};
	const handleSaveProfile = async () => {
		setSavingProfile(true);
		let finalGroupLink = whatsappGroupLink.trim();
		if (finalGroupLink && !finalGroupLink.startsWith("http://") && !finalGroupLink.startsWith("https://")) finalGroupLink = `https://${finalGroupLink}`;
		await updateProfile({
			name,
			clinic,
			job_function: jobFunction,
			avatar_url: avatarUrl,
			whatsapp_group_link: finalGroupLink
		});
		setWhatsappGroupLink(finalGroupLink);
		setSavingProfile(false);
	};
	const handleAvatarUpload = async (event) => {
		try {
			if (!currentUser) return;
			setUploadingAvatar(true);
			const file = event.target.files?.[0];
			if (!file) return;
			const fileExt = file.name.split(".").pop();
			const filePath = `${currentUser.id}-${Math.random()}.${fileExt}`;
			const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
			if (uploadError) throw uploadError;
			const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
			setAvatarUrl(data.publicUrl);
			await updateProfile({ avatar_url: data.publicUrl });
		} catch (error) {
			toast({
				title: "ERRO NO UPLOAD",
				description: "NÃO FOI POSSÍVEL FAZER UPLOAD DA IMAGEM.",
				variant: "destructive"
			});
		} finally {
			setUploadingAvatar(false);
		}
	};
	const handleAddScale = async () => {
		const trimmed = newScale.trim();
		if (!trimmed || scales.includes(trimmed)) return;
		const updated = [...scales, trimmed].sort((a, b) => a.localeCompare(b, "pt-BR"));
		await updateSetting("shade_scales", JSON.stringify(updated));
		setNewScale("");
	};
	const handleRemoveScale = async (scale) => {
		const updated = scales.filter((s) => s !== scale);
		await updateSetting("shade_scales", JSON.stringify(updated));
	};
	const handleAddBrand = async () => {
		const trimmed = newBrand.trim();
		if (!trimmed || implantBrands.includes(trimmed)) return;
		const updated = [...implantBrands, trimmed].sort((a, b) => a.localeCompare(b, "pt-BR"));
		await updateSetting("implant_brands", JSON.stringify(updated));
		setNewBrand("");
	};
	const handleRemoveBrand = async (brand) => {
		const updated = implantBrands.filter((b) => b !== brand);
		await updateSetting("implant_brands", JSON.stringify(updated));
	};
	if (!currentUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center min-h-[400px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" })
	});
	const isAdmin = currentUser.role === "admin" || currentUser.role === "master";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-5xl mx-auto py-6 space-y-6 animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-1 mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold tracking-tight text-primary uppercase",
				children: "CONFIGURAÇÕES GERAIS"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: activeTab,
			onValueChange: (v) => setSearchParams({ tab: v }),
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "mb-6 flex w-full max-w-full overflow-x-auto bg-transparent gap-2 h-auto p-0 pb-2 justify-start scrollbar-hide",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "profile",
							className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold",
							children: "MEU PERFIL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "reset-password",
							className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold",
							children: "REDEFINIR SENHA"
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "system",
							className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold",
							children: "SISTEMA & COMUNICAÇÃO"
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "work-schedule",
							className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold",
							children: "ESCALA DE TRABALHO"
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "scales",
							className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold",
							children: "ESCALAS DE COR"
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "brands",
							className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 whitespace-nowrap uppercase text-xs font-bold",
							children: "MARCAS DE IMPLANTES"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "profile",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "uppercase",
								children: "DADOS PESSOAIS"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "uppercase text-xs font-semibold",
								children: "ATUALIZE SUAS INFORMAÇÕES E FOTO DE PERFIL."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "space-y-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-6 items-start sm:items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
												className: "w-24 h-24 border-2 border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
													src: avatarUrl,
													className: "object-cover"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
													className: "text-2xl bg-primary/10 text-primary uppercase",
													children: name.charAt(0)?.toUpperCase()
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "avatar-upload",
												className: "absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer",
												children: uploadingAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-6 h-6 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-6 h-6" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "avatar-upload",
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: handleAvatarUpload,
												disabled: uploadingAvatar
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 space-y-4 w-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														className: "flex items-center gap-2 uppercase text-xs font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-primary/70" }), "NOME COMPLETO"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: name,
														onChange: (e) => setName(e.target.value),
														placeholder: "SEU NOME"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														className: "flex items-center gap-2 uppercase text-xs font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "w-4 h-4 text-primary/70" }), "CLÍNICA (OPCIONAL)"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: clinic,
														onChange: (e) => setClinic(e.target.value),
														placeholder: "NOME DA SUA CLÍNICA"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														className: "flex items-center gap-2 uppercase text-xs font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-primary/70" }), "FUNÇÃO NA EMPRESA"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: jobFunction,
														onChange: (e) => setJobFunction(e.target.value),
														placeholder: "EX: CERAMISTA, RECEPÇÃO"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2 sm:col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														className: "flex items-center gap-2 uppercase text-xs font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "w-4 h-4 text-primary/70" }), "LINK DO GRUPO DA CLÍNICA (WHATSAPP)"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: whatsappGroupLink,
														onChange: (e) => setWhatsappGroupLink(e.target.value),
														placeholder: "EX: HTTPS://CHAT.WHATSAPP.COM/..."
													})]
												})
											]
										})
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
								className: "bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleSaveProfile,
									disabled: savingProfile || uploadingAvatar,
									className: "w-full sm:w-auto min-w-[150px] uppercase text-xs font-bold",
									children: savingProfile ? "SALVANDO..." : "SALVAR PERFIL"
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "reset-password",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResetPasswordTab, {})
				}),
				isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "system",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "uppercase",
									children: "SISTEMA & CANAIS DE COMUNICAÇÃO"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
									className: "uppercase text-xs font-semibold",
									children: "GERENCIE AS FUNCIONALIDADES GLOBAIS E LINKS DO SISTEMA."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "space-y-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "flex items-center gap-2 font-bold uppercase text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4 text-emerald-500" }), "WHATSAPP VITALI LAB (CONTATO LABORATÓRIO)"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: labLink,
												onChange: (e) => setLabLink(e.target.value),
												placeholder: "EX: HTTPS://WA.ME/5511999999999",
												className: "font-mono text-sm"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground uppercase font-semibold",
												children: "LINK GLOBAL DE CONTATO DIRETO PARA O NÚMERO DO LABORATÓRIO."
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 pt-6 border-t mt-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "flex items-center gap-2 font-bold uppercase text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "w-4 h-4 text-emerald-500" }), "Habilitar Scan Service para não-administradores"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center space-x-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
													checked: scanServiceEnabled,
													onCheckedChange: async (checked) => {
														setScanServiceEnabled(checked);
														await updateSetting("scan_service_enabled", checked ? "true" : "false");
														toast({ title: "Configuração atualizada com sucesso!" });
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-medium",
													children: scanServiceEnabled ? "Ativado" : "Desativado"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground uppercase font-semibold mt-1",
												children: "QUANDO DESATIVADO, APENAS ADMINISTRADORES PODERÃO VER E ACESSAR O MÓDULO SCAN SERVICE."
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
									className: "bg-muted/20 border-t px-6 py-4 flex justify-end rounded-b-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: handleSaveSystem,
										disabled: savingSystem,
										className: "w-full sm:w-auto min-w-[150px] uppercase text-xs font-bold",
										children: savingSystem ? "SALVANDO..." : "SALVAR CONFIGURAÇÕES"
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "work-schedule",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkSchedule, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "scales",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "uppercase",
								children: "ESCALAS DE COR"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "uppercase text-xs font-semibold",
								children: "GERENCIE AS OPÇÕES DE ESCALAS DE COR DISPONÍVEIS PARA OS DENTISTAS AO CRIAR NOVOS PEDIDOS."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "NOVA ESCALA (EX: VITA CLÁSSICA, BL, 3D MASTER)",
										value: newScale,
										onChange: (e) => setNewScale(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") handleAddScale();
										},
										className: "max-w-xs uppercase"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: handleAddScale,
										className: "uppercase text-xs font-bold",
										children: "ADICIONAR"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 mt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-bold text-muted-foreground mb-3 uppercase",
										children: "ESCALAS CADASTRADAS"
									}), scales.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground uppercase font-semibold p-4 bg-muted/20 rounded border border-dashed text-center",
										children: "NENHUMA ESCALA CADASTRADA."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
										children: scales.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 bg-muted/10 hover:bg-muted/30 transition-colors rounded-lg border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-sm uppercase",
												children: s
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive",
												onClick: () => handleRemoveScale(s),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
											})]
										}, i))
									})]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "brands",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "uppercase",
								children: "MARCAS DE COMPONENTES (IMPLANTES)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "uppercase text-xs font-semibold",
								children: "GERENCIE AS OPÇÕES DE MARCAS DISPONÍVEIS PARA SELEÇÃO EM TRABALHOS SOBRE IMPLANTE."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "NOVA MARCA (EX: NEODENT, STRAUMANN)",
										value: newBrand,
										onChange: (e) => setNewBrand(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") handleAddBrand();
										},
										className: "max-w-xs uppercase"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: handleAddBrand,
										className: "uppercase text-xs font-bold",
										children: "ADICIONAR"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 mt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-bold text-muted-foreground mb-3 uppercase",
										children: "MARCAS CADASTRADAS"
									}), implantBrands.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground uppercase font-semibold p-4 bg-muted/20 rounded border border-dashed text-center",
										children: "NENHUMA MARCA CADASTRADA."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
										children: implantBrands.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 bg-muted/10 hover:bg-muted/30 transition-colors rounded-lg border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-sm uppercase",
												children: b
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive",
												onClick: () => handleRemoveBrand(b),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
											})]
										}, i))
									})]
								})]
							})]
						})
					})
				] })
			]
		})]
	});
}
export { SettingsPage as default };

//# sourceMappingURL=Settings-CfSRa-LU.js.map