import { t as ChevronRight } from "./chevron-right-BWn8SFw6.js";
import { t as MessageCircle } from "./message-circle-BsbaFSiX.js";
import { t as ShieldCheck } from "./shield-check-BMChpV64.js";
import { Ot as Link, St as require_jsx_runtime, a as useAppStore, at as createLucideIcon, kt as Navigate, t as Button, z as useAuth, zt as __toESM } from "./index-n4619bSt.js";
import { t as Logo } from "./Logo-CuTDq-V7.js";
var Diamond = createLucideIcon("diamond", [["path", {
	d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
	key: "1f1r0c"
}]]);
var HeartHandshake = createLucideIcon("heart-handshake", [["path", {
	d: "M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762",
	key: "17lmqv"
}]]);
var Instagram = createLucideIcon("instagram", [
	["rect", {
		width: "20",
		height: "20",
		x: "2",
		y: "2",
		rx: "5",
		ry: "5",
		key: "2e1cvw"
	}],
	["path", {
		d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
		key: "9exkf1"
	}],
	["line", {
		x1: "17.5",
		x2: "17.51",
		y1: "6.5",
		y2: "6.5",
		key: "r4j83e"
	}]
]);
var Star = createLucideIcon("star", [["path", {
	d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
	key: "r04s7s"
}]]);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function LandingHeader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 max-w-7xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "cursor-pointer transition-opacity hover:opacity-80 active:opacity-70",
					title: "Início",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
						variant: "default",
						size: "lg",
						className: "scale-90 sm:scale-100 origin-left"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#solucoes",
							className: "hover:text-foreground transition-colors",
							children: "Especialidades"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#diferenciais",
							className: "hover:text-foreground transition-colors",
							children: "Propósito"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#depoimentos",
							className: "hover:text-foreground transition-colors",
							children: "Depoimentos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#contatos",
							className: "hover:text-foreground transition-colors",
							children: "Contatos"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "rounded-full px-4 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app",
						children: ["Acessar Portal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 ml-1 hidden sm:inline-block" })]
					})
				})
			]
		})
	});
}
var allan_queiroz_17_bb76a_default = "/assets/allan-queiroz-17-bb76a-BUIGgsuO.jpeg";
function LandingHero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 z-0 opacity-[0.45]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: allan_queiroz_17_bb76a_default,
					alt: "Premium dental laboratory",
					className: "w-full h-full object-cover object-center"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container relative z-10 mx-auto px-4 sm:px-6 text-center lg:text-left max-w-7xl flex flex-col items-center lg:items-start",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-foreground leading-tight max-w-4xl",
					children: ["Excelência técnica com ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary italic",
						children: "toque humano."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed",
					children: "O Vitali Lab redefine a prótese odontológica integrando dois segmentos especializados, unidos por um atendimento próximo e focado na experiência do dentista."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "rounded-full px-8 h-14 text-base w-full sm:w-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app",
							children: "Acessar Portal do Dentista"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						className: "rounded-full px-8 h-14 text-base w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-muted text-foreground border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#solucoes",
							children: "Conhecer Segmentos"
						})
					})]
				})
			]
		})]
	});
}
var allan_queiroz_25_13390_default = "/assets/allan-queiroz-25-13390-h9Kz6b_N.jpeg";
var allan_queiroz_52_abae6_default = "/assets/allan-queiroz-52-abae6-mlZjTpvc.jpeg";
function LandingSpecialties() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "solucoes",
		className: "py-24 bg-muted/20 border-y border-border/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4 sm:px-6 max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-5xl font-display font-bold text-foreground mb-4",
					children: "Nossas Especialidades"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground max-w-2xl mx-auto text-lg",
					children: "Dois laboratórios em um só propósito: entregar a solução ideal para cada caso clínico com o mais alto padrão de qualidade."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-8 lg:gap-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative overflow-hidden rounded-3xl bg-card border border-border transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/3] overflow-hidden bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: allan_queiroz_25_13390_default,
							alt: "Soluções Cerâmicas",
							className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 md:p-10 flex-1 flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Diamond, { className: "w-6 h-6 text-blue-400" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-2xl font-display font-bold text-foreground mb-3",
								children: "Vitali Lab Soluções Cerâmicas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground leading-relaxed flex-1",
								children: "Focado na alta estética e precisão. Produzimos facetas, lentes de contato, coroas e próteses sobre implante utilizando os materiais mais nobres do mercado, como dissilicato de lítio e zircônia."
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative overflow-hidden rounded-3xl bg-card border border-border transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/3] overflow-hidden bg-black",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: allan_queiroz_52_abae6_default,
							alt: "Studio Acrílico Protocolo",
							className: "w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 md:p-10 flex-1 flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-6 h-6 text-purple-400" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-2xl font-display font-bold text-foreground mb-3",
								children: "Vitali Lab Studio Acrílico"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground leading-relaxed flex-1",
								children: "Especializado em reabilitações extensas e funcionais. Próteses totais, protocolos acrílicos e placas oclusais desenvolvidas com máximo conforto e durabilidade para o seu paciente."
							})
						]
					})]
				})]
			})]
		})
	});
}
var design_sem_nome_7bcf6_default = "/assets/design-sem-nome-7bcf6-BvwBj4mI.jpg";
function LandingPurpose() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "diferenciais",
		className: "py-24 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container mx-auto px-4 sm:px-6 max-w-7xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-16 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-8 order-2 lg:order-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium text-foreground shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartHandshake, { className: "w-4 h-4 text-primary" }), " Nosso Propósito"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl md:text-5xl font-display font-bold text-foreground leading-tight",
							children: "Parceria muito além da bancada"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-muted-foreground leading-relaxed",
							children: "Acreditamos que a comunicação falha é o maior gargalo na prótese atual. Por isso, no Vitali Lab, o relacionamento vem em primeiro lugar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-6 mt-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 shadow-inner",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-primary shadow-sm" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-foreground text-lg font-bold mb-1",
										children: "Gestão Humanizada"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: "Atendimento próximo via WhatsApp com um gerente dedicado para entender suas preferências clínicas."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 shadow-inner",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-primary shadow-sm" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-foreground text-lg font-bold mb-1",
										children: "Portal Digital Exclusivo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: "Acompanhe seus pedidos em tempo real, gerencie cobranças e acesse o histórico de pacientes de forma simples."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 shadow-inner",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-primary shadow-sm" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-foreground text-lg font-bold mb-1",
										children: "Consultoria de Casos"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: "Discussão prévia de planejamentos estéticos e reabilitações complexas diretamente com nossos técnicos."
									})] })]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative order-1 lg:order-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-10 rounded-3xl overflow-hidden border border-border aspect-square lg:aspect-auto bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: design_sem_nome_7bcf6_default,
							alt: "Atendimento Humanizado",
							className: "w-full h-full object-cover transition-transform duration-500 hover:scale-105"
						})
					})
				})]
			})
		})
	});
}
var testimonials = [
	{ content: "O Vitali Lab transformou a previsibilidade dos meus casos. A qualidade das peças em zircônia e o atendimento próximo da equipe fazem toda a diferença na minha prática clínica diária." },
	{ content: "As lentes de contato dental produzidas por eles são verdadeiras obras de arte. A adaptação é sempre perfeita e a naturalidade impressiona meus pacientes." },
	{ content: "Ter um laboratório que entende não só da técnica, mas também da comunicação com o dentista é essencial. O portal digital facilitou muito a gestão dos meus pedidos." }
];
function LandingTestimonials() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "depoimentos",
		className: "py-24 bg-muted/20 border-t border-border/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4 sm:px-6 max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-5xl font-display font-bold text-foreground mb-4",
					children: "O que dizem nossos parceiros"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground max-w-2xl mx-auto text-lg",
					children: "A satisfação dos nossos dentistas parceiros é o reflexo do nosso compromisso com a excelência."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-3 gap-8",
				children: testimonials.map((testimonial, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center gap-1 text-yellow-500 mb-6",
						children: [...Array(5)].map((_, i$1) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-5 h-5 fill-current" }, i$1))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground text-center leading-relaxed flex-1 italic text-lg",
						children: [
							"\"",
							testimonial.content,
							"\""
						]
					})]
				}, i))
			})]
		})
	});
}
function LandingContact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contatos",
		className: "py-24 bg-muted/30 border-t border-border/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4 sm:px-6 max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-5xl font-display font-bold text-foreground mb-4",
					children: "Fale Conosco"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground max-w-2xl mx-auto text-lg",
					children: "Estamos prontos para atender você e transformar seus planejamentos em realidade. Entre em contato pelos nossos canais oficiais."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-8 max-w-4xl mx-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://wa.me/5527999466655",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "group relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10 transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-8 h-8 text-emerald-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-display font-bold text-foreground mb-2",
							children: "WhatsApp"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mb-4",
							children: "Envie uma mensagem ou ligue para nós"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-medium text-emerald-500 group-hover:text-emerald-400 transition-colors mt-auto",
							children: "27 99946-6655"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://www.instagram.com/vitali_lab/",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "group relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10 transition-all hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20 shadow-inner group-hover:scale-110 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "w-8 h-8 text-pink-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-display font-bold text-foreground mb-2",
							children: "Instagram"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mb-4",
							children: "Acompanhe nosso dia a dia e casos reais"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-medium text-pink-500 group-hover:text-pink-400 transition-colors mt-auto",
							children: "@vitali_lab"
						})
					]
				})]
			})]
		})
	});
}
function LandingFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-background py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4 sm:px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center md:items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
					variant: "default",
					size: "sm",
					className: "opacity-80 hover:opacity-100 transition-opacity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground text-sm text-center md:text-left",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Vitali Lab. Todos os direitos reservados."
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#",
					className: "text-muted-foreground hover:text-foreground transition-colors text-sm font-medium",
					children: "Termos de Uso"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#",
					className: "text-muted-foreground hover:text-foreground transition-colors text-sm font-medium",
					children: "Política de Privacidade"
				})]
			})]
		})
	});
}
function FloatingWhatsApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: "https://wa.me/5527999466655",
		target: "_blank",
		rel: "noopener noreferrer",
		className: "fixed bottom-6 right-6 z-[99] flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 dark:focus:ring-offset-background animate-in slide-in-from-bottom-8 fade-in zoom-in-90 fill-mode-both duration-700 delay-500",
		"aria-label": "Fale conosco no WhatsApp",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			fill: "currentColor",
			className: "w-8 h-8 sm:w-9 sm:h-9",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" })
		})
	});
}
function LandingPage() {
	const { session } = useAuth();
	const { currentUser } = useAppStore();
	if (session) {
		if (currentUser) {
			if (currentUser.role === "admin" || currentUser.role === "master") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
				to: "/dashboard",
				replace: true
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
				to: "/app",
				replace: true
			});
		}
		return null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "dark min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingHero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingSpecialties, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingPurpose, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingTestimonials, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingContact, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingWhatsApp, {})
		]
	});
}
export { LandingPage as default };

//# sourceMappingURL=LandingPage-BtvK-d9N.js.map