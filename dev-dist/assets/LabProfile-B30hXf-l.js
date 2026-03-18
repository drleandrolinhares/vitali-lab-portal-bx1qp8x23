import { i as Building, n as AvatarFallback, r as AvatarImage, t as Avatar } from "./avatar-C2MtnlTf.js";
import { t as Camera } from "./camera-BJ9-v8z_.js";
import { t as LoaderCircle } from "./loader-circle-D-KN62lS.js";
import { t as Save } from "./save-DLURWxLM.js";
import { B as supabase, Et as toast, It as require_react, St as require_jsx_runtime, a as useAppStore, kt as Navigate, t as Button, zt as __toESM } from "./index-CnyIMDQs.js";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-CEXI0gaQ.js";
import { t as Input } from "./input-C8fagdeG.js";
import { t as Label } from "./label-B0GIpEr2.js";
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function LabProfile() {
	const { currentUser, appSettings, updateSettings } = useAppStore();
	const [formData, setFormData] = (0, import_react.useState)({
		lab_razao_social: "",
		lab_cnpj: "",
		lab_address: "",
		lab_phone: "",
		lab_email: "",
		lab_website: "",
		lab_instagram: "",
		lab_pix_key: ""
	});
	const [logoUrl, setLogoUrl] = (0, import_react.useState)("");
	const [uploadingLogo, setUploadingLogo] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setFormData({
			lab_razao_social: appSettings["lab_razao_social"] || "",
			lab_cnpj: appSettings["lab_cnpj"] || "",
			lab_address: appSettings["lab_address"] || "",
			lab_phone: appSettings["lab_phone"] || "",
			lab_email: appSettings["lab_email"] || "",
			lab_website: appSettings["lab_website"] || "",
			lab_instagram: appSettings["lab_instagram"] || "",
			lab_pix_key: appSettings["lab_pix_key"] || ""
		});
		setLogoUrl(appSettings["lab_logo_url"] || "");
	}, [appSettings]);
	if (currentUser?.role !== "master") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	const handleChange = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};
	const handleSave = async () => {
		setSaving(true);
		try {
			await updateSettings(formData);
			toast({ title: "Perfil do Laboratório atualizado com sucesso!" });
		} catch (e) {
			toast({
				title: "Erro ao salvar",
				description: e.message,
				variant: "destructive"
			});
		} finally {
			setSaving(false);
		}
	};
	const handleLogoUpload = async (event) => {
		try {
			setUploadingLogo(true);
			const file = event.target.files?.[0];
			if (!file) return;
			const fileExt = file.name.split(".").pop();
			const filePath = `lab-logo-${Date.now()}.${fileExt}`;
			const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
			if (uploadError) throw uploadError;
			const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
			setLogoUrl(data.publicUrl);
			await updateSettings({ lab_logo_url: data.publicUrl });
			toast({ title: "Logotipo atualizado com sucesso!" });
		} catch (error) {
			toast({
				title: "Erro no Upload",
				description: "Não foi possível fazer upload do logotipo.",
				variant: "destructive"
			});
		} finally {
			setUploadingLogo(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl mx-auto py-6 animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-3 bg-primary/10 rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "w-6 h-6 text-primary" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold tracking-tight text-primary uppercase",
				children: "Perfil Vitali Lab"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm uppercase font-semibold",
				children: "Informações institucionais para impressão de faturas e recibos."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-subtle",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "bg-muted/10 border-b pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "uppercase text-lg",
						children: "Dados Cadastrais do Laboratório"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "uppercase text-xs font-semibold",
						children: "ESTES DADOS SERÃO EXIBIDOS NOS CABEÇALHOS E RODAPÉS DOS DOCUMENTOS IMPRESSOS."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-8 pt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-8 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "uppercase text-xs font-bold text-muted-foreground",
								children: "Logotipo Oficial"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "w-32 h-32 border border-border shadow-sm rounded-xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
											src: logoUrl,
											className: "object-contain p-2 bg-white"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "text-3xl bg-muted text-muted-foreground rounded-xl",
											children: "VL"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "logo-upload",
										className: "absolute inset-0 flex flex-col gap-1 items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer",
										children: uploadingLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-6 h-6 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-6 h-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold uppercase",
											children: "Trocar"
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "logo-upload",
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handleLogoUpload,
										disabled: uploadingLogo
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 w-full space-y-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase text-xs font-bold",
											children: "Razão Social / Nome Fantasia"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "lab_razao_social",
											value: formData.lab_razao_social,
											onChange: handleChange,
											placeholder: "Ex: Vitali Lab Prótese Dentária",
											className: "font-medium"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase text-xs font-bold",
											children: "CNPJ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "lab_cnpj",
											value: formData.lab_cnpj,
											onChange: handleChange,
											placeholder: "00.000.000/0000-00"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase text-xs font-bold",
											children: "Telefone (Contato Recibos)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "lab_phone",
											value: formData.lab_phone,
											onChange: handleChange,
											placeholder: "(00) 0000-0000"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase text-xs font-bold",
											children: "E-mail Institucional"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "lab_email",
											type: "email",
											value: formData.lab_email,
											onChange: handleChange,
											placeholder: "contato@vitalilab.com.br",
											className: "normal-case"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase text-xs font-bold",
											children: "Site / Website"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "lab_website",
											value: formData.lab_website,
											onChange: handleChange,
											placeholder: "www.vitalilab.com.br",
											className: "normal-case"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase text-xs font-bold",
											children: "Instagram"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "lab_instagram",
											value: formData.lab_instagram,
											onChange: handleChange,
											placeholder: "@vitalilab",
											className: "normal-case"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase text-xs font-bold",
											children: "Endereço Completo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "lab_address",
											value: formData.lab_address,
											onChange: handleChange,
											placeholder: "Rua Exemplo, 123 - Bairro - Cidade/UF - CEP"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 sm:col-span-2 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "uppercase text-xs font-bold text-emerald-600",
											children: "Chave PIX (Para Pagamento)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "lab_pix_key",
											value: formData.lab_pix_key,
											onChange: handleChange,
											placeholder: "CNPJ, Celular, E-mail ou Aleatória",
											className: "border-emerald-200 focus-visible:ring-emerald-500 normal-case"
										})]
									})
								]
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
					className: "bg-muted/10 border-t px-6 py-4 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleSave,
						disabled: saving,
						className: "uppercase text-xs font-bold tracking-wide min-w-[150px]",
						children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }), " Salvando..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }), " Salvar Perfil"] })
					})
				})
			]
		})]
	});
}
export { LabProfile as default };

//# sourceMappingURL=LabProfile-B30hXf-l.js.map