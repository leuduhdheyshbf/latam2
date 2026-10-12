import { i as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { R as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as TiltCard, g as displayValue, i as GUILD_NAME, r as FUNCOES } from "./recruitment-DF6yoLIM.mjs";
import { n as Input, r as formatWhatsAppUrl, t as Button } from "./masks-RRqYtDs_.mjs";
import { E as ExternalLink, M as CircleCheck, _ as MessageCircle, c as Trash2, j as CircleX, k as Copy, m as Search, r as Users, v as LogOut, y as Lock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-rkp3NbQk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_DEMO_CANDIDATES = [
	{
		id: "cand-101",
		nome: "Lucas Souza",
		idade: "19",
		nick: "LUK4S_FF",
		idConta: "189420392",
		cidadeEstado: "São Paulo - SP",
		whatsapp: "(11) 98844-2211",
		funcao: "rush",
		patenteAtual: "diamente_mestre",
		experienciaCompetitiva: "sim",
		experienciaDescricao: "Joguei camps diários pela guilda Black Dragons, foco em invasão rápida e 2v1.",
		tempoDisponivel: "4+h",
		horarioDisponivel: "19h às 00h",
		submittedAt: "Hoje, 19:42",
		status: "aprovado"
	},
	{
		id: "cand-102",
		nome: "Gabriel Ferreira",
		idade: "17",
		nick: "GABRIELzx",
		idConta: "273819402",
		cidadeEstado: "Rio de Janeiro - RJ",
		whatsapp: "(21) 97722-3344",
		funcao: "granadeiro",
		patenteAtual: "elite",
		experienciaCompetitiva: "sim",
		experienciaDescricao: "Granadeiro com boa leitura de mapa e controle de gel. Participei da Copa FF amadora.",
		tempoDisponivel: "2-4h",
		horarioDisponivel: "20h às 23h30",
		submittedAt: "Hoje, 18:15",
		status: "pendente"
	},
	{
		id: "cand-103",
		nome: "Matheus Silva",
		idade: "21",
		nick: "M4THEUS_SNIPER",
		idConta: "392019482",
		cidadeEstado: "Belo Horizonte - MG",
		whatsapp: "(31) 99123-4567",
		funcao: "fuzileiro",
		patenteAtual: "platina_diamente",
		experienciaCompetitiva: "nao",
		experienciaDescricao: "",
		tempoDisponivel: "2-4h",
		horarioDisponivel: "18h às 22h",
		submittedAt: "Hoje, 15:30",
		status: "pendente"
	}
];
function AdminPage() {
	const [isAuthenticated, setIsAuthenticated] = (0, import_react.useState)(false);
	const [passwordInput, setPasswordInput] = (0, import_react.useState)("");
	const [candidates, setCandidates] = (0, import_react.useState)([]);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("todos");
	const [filterFuncao, setFilterFuncao] = (0, import_react.useState)("todos");
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem("latam-admin-auth") === "true") setIsAuthenticated(true);
		try {
			const stored = localStorage.getItem("latam-admin-candidates");
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					setCandidates(parsed);
					return;
				}
			}
			setCandidates(INITIAL_DEMO_CANDIDATES);
			localStorage.setItem("latam-admin-candidates", JSON.stringify(INITIAL_DEMO_CANDIDATES));
		} catch {
			setCandidates(INITIAL_DEMO_CANDIDATES);
		}
	}, []);
	function handleLogin(e) {
		e.preventDefault();
		const pass = passwordInput.trim().toLowerCase();
		if (pass === "admin" || pass === "souza" || pass === "latam" || pass === "123456" || pass === "") {
			sessionStorage.setItem("latam-admin-auth", "true");
			setIsAuthenticated(true);
			toast.success("Acesso da liderança autorizado!");
		} else toast.error("Senha incorreta. (Dica: digite 'admin' ou 'souza')");
	}
	function handleLogout() {
		sessionStorage.removeItem("latam-admin-auth");
		setIsAuthenticated(false);
		toast.info("Sessão da liderança encerrada.");
	}
	function updateStatus(id, newStatus) {
		const updated = candidates.map((cand) => cand.id === id ? {
			...cand,
			status: newStatus
		} : cand);
		setCandidates(updated);
		try {
			localStorage.setItem("latam-admin-candidates", JSON.stringify(updated));
		} catch {}
		toast.success(`Candidato marcado como ${newStatus.toUpperCase()}`);
	}
	function deleteCandidate(id) {
		const updated = candidates.filter((c) => c.id !== id);
		setCandidates(updated);
		try {
			localStorage.setItem("latam-admin-candidates", JSON.stringify(updated));
		} catch {}
		toast.info("Candidatura removida do painel.");
	}
	function copyCandidateDossier(c) {
		const text = [
			`*${GUILD_NAME} 友 — Dossiê de Recrutamento*`,
			`Nick: ${c.nick} (ID: ${c.idConta})`,
			`Nome: ${c.nome} (${c.idade} anos) - ${c.cidadeEstado}`,
			`Função: ${displayValue("funcao", c)}`,
			`Patente: ${displayValue("patenteAtual", c)}`,
			`Disponibilidade: ${c.horarioDisponivel} (${displayValue("tempoDisponivel", c)})`,
			c.experienciaDescricao ? `Experiência: ${c.experienciaDescricao}` : "",
			`WhatsApp: ${c.whatsapp}`
		].filter(Boolean).join("\n");
		navigator.clipboard.writeText(text);
		toast.success("Dossiê do jogador copiado!");
	}
	const filtered = candidates.filter((c) => {
		const matchesSearch = c.nick.toLowerCase().includes(searchTerm.toLowerCase()) || c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.idConta.includes(searchTerm);
		const matchesStatus = filterStatus === "todos" ? true : (c.status || "pendente") === filterStatus;
		const matchesFuncao = filterFuncao === "todos" ? true : c.funcao === filterFuncao;
		return matchesSearch && matchesStatus && matchesFuncao;
	});
	const countPendente = candidates.filter((c) => (c.status || "pendente") === "pendente").length;
	const countAprovado = candidates.filter((c) => c.status === "aprovado").length;
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-bg min-h-screen flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "site-header backdrop-blur-md bg-background/85",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-5xl items-center justify-between px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5 no-underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/latam-mark.webp",
							alt: "",
							width: "32",
							height: "32",
							className: "size-8"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-xl tracking-[0.14em] text-silver",
							children: [
								GUILD_NAME,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tracking-normal text-accent",
									children: "友"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-xs font-semibold text-muted-foreground hover:text-white uppercase tracking-wider",
						children: "Voltar ao Site"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-md px-5 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-card border border-accent/25 p-8 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-[0_0_20px_rgba(0,180,255,0.3)] mb-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.2em] text-accent",
							children: "Área Restrita"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display mt-2 text-3xl tracking-wide text-silver",
							children: "Painel da Liderança"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: [
								"Acesso exclusivo para líderes e recrutadores da guilda ",
								GUILD_NAME,
								" ",
								"友",
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleLogin,
							className: "mt-6 flex flex-col gap-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									placeholder: "Digite sua senha de ADM (ex: admin)",
									value: passwordInput,
									onChange: (e) => setPasswordInput(e.target.value),
									autoFocus: true,
									className: "text-center font-mono tracking-widest text-base"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "lg",
									className: "w-full",
									children: "Entrar no Painel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-subtle mt-1",
									children: [
										"Dica de acesso rápido: digite ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "admin" }),
										" ou ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "souza" })
									]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "px-5 pb-8 pt-4 text-center text-xs text-subtle",
				children: [GUILD_NAME, " · Painel Administrativo de Recrutamento"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page-bg min-h-screen pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "site-header backdrop-blur-md bg-background/85 sticky top-0 z-30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-5xl items-center justify-between px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 no-underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/latam-mark.webp",
						alt: "",
						width: "32",
						height: "32",
						className: "size-8"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-xl tracking-[0.14em] text-silver",
						children: [
							GUILD_NAME,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tracking-normal text-accent",
								children: "友"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-1 rounded-full border border-accent/30 shadow-[0_0_8px_rgba(0,180,255,0.2)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-accent animate-pulse" }), "Liderança Conectada"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "default",
						onClick: handleLogout,
						className: "text-xs text-muted-foreground hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), "Sair"]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-5 pt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-[0.18em] text-accent uppercase",
								children: "Gestão da Staff"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display mt-1 text-4xl tracking-wide text-silver sm:text-5xl",
							children: "Candidaturas Recebidas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Analise os perfis dos jogadores e chame direto no WhatsApp para os testes de line-up."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/candidatura",
						className: "inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg border border-white/10 bg-white/4 hover:bg-white/8 text-silver transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), "Abrir Formulário Público"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-card p-4 border border-white/8 bg-card/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-subtle",
								children: "Total Inscritos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl text-white mt-1",
								children: candidates.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-card p-4 border border-amber-500/20 bg-card/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-amber-400",
								children: "Em Análise"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl text-amber-300 mt-1",
								children: countPendente
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-card p-4 border border-emerald-500/20 bg-card/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-emerald-400",
								children: "Aprovados p/ Teste"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl text-emerald-300 mt-1",
								children: countAprovado
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-card p-4 border border-accent/20 bg-card/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-accent",
								children: "Vagas da Line"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl text-accent mt-1",
								children: "4 / 12"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Buscar por Nick, Nome ou ID...",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value),
							className: "w-full pl-10 pr-4 py-2.5 rounded-lg bg-card-2 border border-white/8 text-sm text-foreground focus:outline-none focus:border-accent"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-lg border border-white/8 bg-card-2 p-1 text-xs font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFilterStatus("todos"),
									className: `px-3 py-1 rounded-md transition-colors ${filterStatus === "todos" ? "bg-accent text-neutral-950 font-bold" : "text-muted-foreground hover:text-silver"}`,
									children: "Todos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFilterStatus("pendente"),
									className: `px-3 py-1 rounded-md transition-colors ${filterStatus === "pendente" ? "bg-amber-500 text-neutral-950 font-bold" : "text-muted-foreground hover:text-silver"}`,
									children: "Pendentes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFilterStatus("aprovado"),
									className: `px-3 py-1 rounded-md transition-colors ${filterStatus === "aprovado" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-muted-foreground hover:text-silver"}`,
									children: "Aprovados"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: filterFuncao,
							onChange: (e) => setFilterFuncao(e.target.value),
							className: "rounded-lg bg-card-2 border border-white/8 px-3 py-2 text-xs font-semibold text-silver focus:outline-none focus:border-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "todos",
								children: "Todas as Funções"
							}), FUNCOES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: f.value,
								children: f.label
							}, f.value))]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-col gap-4",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-card py-16 text-center text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-10 mx-auto text-subtle mb-3 opacity-60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-base text-silver",
								children: "Nenhum candidato encontrado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs mt-1",
								children: "Tente ajustar seus termos de busca ou filtros."
							})
						]
					}) : filtered.map((cand) => {
						const whatsMessage = `Fala ${cand.nick}, aqui é a liderança da guilda LATAM 友! Vimos sua candidatura de ${displayValue("funcao", cand)} e queremos agendar seu teste com a equipe.`;
						const whatsUrl = formatWhatsAppUrl(cand.whatsapp, whatsMessage);
						const status = cand.status || "pendente";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiltCard, {
							maxTilt: 4,
							glareOpacity: .12,
							className: "section-card p-5 border border-white/8 bg-gradient-to-br from-[#121824] via-[#0d121b] to-[#090d14] rounded-2xl relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/25 shadow-[0_0_14px_rgba(0,180,255,0.2)]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-display text-2xl tracking-wide text-white leading-tight",
													children: cand.nick
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground",
													children: [
														"(",
														cand.nome,
														", ",
														cand.idade,
														" anos)"
													]
												}),
												status === "aprovado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
													children: "Aprovado p/ Teste"
												}) : status === "recusado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30",
													children: "Recusado"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30",
													children: "Em Análise"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-subtle mt-0.5",
											children: [
												cand.cidadeEstado,
												" • Cadastrado: ",
												cand.submittedAt || "Recente"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex flex-wrap gap-2 items-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-silver",
													children: ["🎯 Função: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-accent",
														children: displayValue("funcao", cand)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-silver",
													children: ["🏆 Patente: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-white",
														children: displayValue("patenteAtual", cand)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-silver",
													children: ["🆔 ID: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-mono text-accent",
														children: cand.idConta
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-silver",
													children: [
														"⏱️ ",
														cand.horarioDisponivel,
														" (",
														displayValue("tempoDisponivel", cand),
														")"
													]
												})
											]
										}),
										cand.experienciaDescricao ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 p-3 rounded-lg bg-black/30 border border-white/5 text-xs text-silver/90 leading-relaxed",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-accent font-semibold",
													children: "Histórico Competitivo:"
												}),
												" ",
												cand.experienciaDescricao
											]
										}) : null
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-row sm:flex-col gap-2 shrink-0 sm:min-w-[160px] justify-end",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: whatsUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all active:scale-95",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "Chamar no Zap"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => copyCandidateDossier(cand),
											className: "inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/8 bg-white/4 hover:bg-white/8 text-silver transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copiar Ficha"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 justify-end pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Aprovar para Teste",
													onClick: () => updateStatus(cand.id, "aprovado"),
													className: "p-1.5 rounded-md hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 transition-colors",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Recusar Candidatura",
													onClick: () => updateStatus(cand.id, "recusado"),
													className: "p-1.5 rounded-md hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Excluir do Painel",
													onClick: () => deleteCandidate(cand.id),
													className: "p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
												})
											]
										})
									]
								})]
							})
						}, cand.id);
					})
				})
			]
		})]
	});
}
//#endregion
export { AdminPage as component };
