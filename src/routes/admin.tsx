import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Lock,
  LogOut,
  MessageCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiltCard } from "@/components/ui/tilt-card";
import { formatWhatsAppUrl } from "@/lib/masks";
import {
  displayValue,
  FUNCOES,
  GUILD_MARK,
  GUILD_NAME,
  PATENTES_LATAM,
  type RecruitmentValues,
} from "@/lib/recruitment";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type StoredCandidate = RecruitmentValues & {
  id: string;
  submittedAt?: string;
  status?: "pendente" | "aprovado" | "recusado";
};

// Candidatos iniciais realistas caso a lista esteja vazia
const INITIAL_DEMO_CANDIDATES: StoredCandidate[] = [
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
    status: "aprovado",
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
    status: "pendente",
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
    status: "pendente",
  },
];

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [candidates, setCandidates] = useState<StoredCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendente" | "aprovado" | "recusado">("todos");
  const [filterFuncao, setFilterFuncao] = useState<string>("todos");

  useEffect(() => {
    // Checa autenticação de sessão
    if (sessionStorage.getItem("latam-admin-auth") === "true") {
      setIsAuthenticated(true);
    }

    // Carrega candidatos do localStorage ou insere os de demonstração
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

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const pass = passwordInput.trim().toLowerCase();
    // Aceita senhas simples para a liderança ou qualquer uma das comuns
    if (pass === "admin" || pass === "souza" || pass === "latam" || pass === "123456" || pass === "") {
      sessionStorage.setItem("latam-admin-auth", "true");
      setIsAuthenticated(true);
      toast.success("Acesso da liderança autorizado!");
    } else {
      toast.error("Senha incorreta. (Dica: digite 'admin' ou 'souza')");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("latam-admin-auth");
    setIsAuthenticated(false);
    toast.info("Sessão da liderança encerrada.");
  }

  function updateStatus(id: string, newStatus: "pendente" | "aprovado" | "recusado") {
    const updated = candidates.map((cand) =>
      cand.id === id ? { ...cand, status: newStatus } : cand,
    );
    setCandidates(updated);
    try {
      localStorage.setItem("latam-admin-candidates", JSON.stringify(updated));
    } catch {
      /* ignore */
    }
    toast.success(`Candidato marcado como ${newStatus.toUpperCase()}`);
  }

  function deleteCandidate(id: string) {
    const updated = candidates.filter((c) => c.id !== id);
    setCandidates(updated);
    try {
      localStorage.setItem("latam-admin-candidates", JSON.stringify(updated));
    } catch {
      /* ignore */
    }
    toast.info("Candidatura removida do painel.");
  }

  function copyCandidateDossier(c: StoredCandidate) {
    const text = [
      `*${GUILD_NAME} ${GUILD_MARK} — Dossiê de Recrutamento*`,
      `Nick: ${c.nick} (ID: ${c.idConta})`,
      `Nome: ${c.nome} (${c.idade} anos) - ${c.cidadeEstado}`,
      `Função: ${displayValue("funcao", c)}`,
      `Patente: ${displayValue("patenteAtual", c)}`,
      `Disponibilidade: ${c.horarioDisponivel} (${displayValue("tempoDisponivel", c)})`,
      c.experienciaDescricao ? `Experiência: ${c.experienciaDescricao}` : "",
      `WhatsApp: ${c.whatsapp}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text);
    toast.success("Dossiê do jogador copiado!");
  }

  // Filtragem
  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.nick.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.idConta.includes(searchTerm);

    const matchesStatus =
      filterStatus === "todos" ? true : (c.status || "pendente") === filterStatus;

    const matchesFuncao =
      filterFuncao === "todos" ? true : c.funcao === filterFuncao;

    return matchesSearch && matchesStatus && matchesFuncao;
  });

  const countPendente = candidates.filter((c) => (c.status || "pendente") === "pendente").length;
  const countAprovado = candidates.filter((c) => c.status === "aprovado").length;

  // Tela de Login da Liderança
  if (!isAuthenticated) {
    return (
      <main className="page-bg min-h-screen flex flex-col justify-between">
        <header className="site-header backdrop-blur-md bg-background/85">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <img src="/latam-mark.webp" alt="" width="32" height="32" className="size-8" />
              <span className="font-display text-xl tracking-[0.14em] text-silver">
                {GUILD_NAME} <span className="tracking-normal text-accent">{GUILD_MARK}</span>
              </span>
            </Link>
            <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-white uppercase tracking-wider">
              Voltar ao Site
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-md px-5 py-16">
          <div className="section-card border border-accent/25 p-8 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-[0_0_20px_rgba(0,180,255,0.3)] mb-5">
              <Lock className="size-7" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Área Restrita</p>
            <h1 className="font-display mt-2 text-3xl tracking-wide text-silver">Painel da Liderança</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Acesso exclusivo para líderes e recrutadores da guilda {GUILD_NAME} {GUILD_MARK}.
            </p>

            <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-3.5">
              <Input
                type="password"
                placeholder="Digite sua senha de ADM (ex: admin)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="text-center font-mono tracking-widest text-base"
              />
              <Button type="submit" size="lg" className="w-full">
                Entrar no Painel
              </Button>
              <p className="text-[11px] text-subtle mt-1">
                Dica de acesso rápido: digite <strong>admin</strong> ou <strong>souza</strong>
              </p>
            </form>
          </div>
        </div>

        <footer className="px-5 pb-8 pt-4 text-center text-xs text-subtle">
          {GUILD_NAME} · Painel Administrativo de Recrutamento
        </footer>
      </main>
    );
  }

  // Dashboard de Administração da Liderança
  return (
    <main className="page-bg min-h-screen pb-20">
      {/* Topo do Painel */}
      <header className="site-header backdrop-blur-md bg-background/85 sticky top-0 z-30">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <img src="/latam-mark.webp" alt="" width="32" height="32" className="size-8" />
            <span className="font-display text-xl tracking-[0.14em] text-silver">
              {GUILD_NAME} <span className="tracking-normal text-accent">{GUILD_MARK}</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-1 rounded-full border border-accent/30 shadow-[0_0_8px_rgba(0,180,255,0.2)]">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              Liderança Conectada
            </span>

            <Button variant="ghost" size="default" onClick={handleLogout} className="text-xs text-muted-foreground hover:text-white">
              <LogOut className="size-3.5" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 pt-8">
        {/* Título & Boas-Vindas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Gestão da Staff
              </p>
            </div>
            <h1 className="font-display mt-1 text-4xl tracking-wide text-silver sm:text-5xl">
              Candidaturas Recebidas
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Analise os perfis dos jogadores e chame direto no WhatsApp para os testes de line-up.
            </p>
          </div>

          <Link
            to="/candidatura"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg border border-white/10 bg-white/4 hover:bg-white/8 text-silver transition-all"
          >
            <ExternalLink className="size-3.5" />
            Abrir Formulário Público
          </Link>
        </div>

        {/* Métricas Rápidas */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="section-card p-4 border border-white/8 bg-card/90">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">Total Inscritos</p>
            <p className="font-display text-3xl text-white mt-1">{candidates.length}</p>
          </div>

          <div className="section-card p-4 border border-amber-500/20 bg-card/90">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">Em Análise</p>
            <p className="font-display text-3xl text-amber-300 mt-1">{countPendente}</p>
          </div>

          <div className="section-card p-4 border border-emerald-500/20 bg-card/90">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Aprovados p/ Teste</p>
            <p className="font-display text-3xl text-emerald-300 mt-1">{countAprovado}</p>
          </div>

          <div className="section-card p-4 border border-accent/20 bg-card/90">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Vagas da Line</p>
            <p className="font-display text-3xl text-accent mt-1">4 / 12</p>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por Nick, Nome ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card-2 border border-white/8 text-sm text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Filtro Status */}
            <div className="flex rounded-lg border border-white/8 bg-card-2 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterStatus("todos")}
                className={`px-3 py-1 rounded-md transition-colors ${filterStatus === "todos" ? "bg-accent text-neutral-950 font-bold" : "text-muted-foreground hover:text-silver"}`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("pendente")}
                className={`px-3 py-1 rounded-md transition-colors ${filterStatus === "pendente" ? "bg-amber-500 text-neutral-950 font-bold" : "text-muted-foreground hover:text-silver"}`}
              >
                Pendentes
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("aprovado")}
                className={`px-3 py-1 rounded-md transition-colors ${filterStatus === "aprovado" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-muted-foreground hover:text-silver"}`}
              >
                Aprovados
              </button>
            </div>

            {/* Filtro Função */}
            <select
              value={filterFuncao}
              onChange={(e) => setFilterFuncao(e.target.value)}
              className="rounded-lg bg-card-2 border border-white/8 px-3 py-2 text-xs font-semibold text-silver focus:outline-none focus:border-accent"
            >
              <option value="todos">Todas as Funções</option>
              {FUNCOES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Cards de Candidatos */}
        <div className="mt-6 flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="section-card py-16 text-center text-muted-foreground">
              <Users className="size-10 mx-auto text-subtle mb-3 opacity-60" />
              <p className="font-semibold text-base text-silver">Nenhum candidato encontrado</p>
              <p className="text-xs mt-1">Tente ajustar seus termos de busca ou filtros.</p>
            </div>
          ) : (
            filtered.map((cand) => {
              const whatsMessage = `Fala ${cand.nick}, aqui é a liderança da guilda LATAM 友! Vimos sua candidatura de ${displayValue("funcao", cand)} e queremos agendar seu teste com a equipe.`;
              const whatsUrl = formatWhatsAppUrl(cand.whatsapp, whatsMessage);
              const status = cand.status || "pendente";

              return (
                <TiltCard
                  key={cand.id}
                  maxTilt={4}
                  glareOpacity={0.12}
                  className="section-card p-5 border border-white/8 bg-gradient-to-br from-[#121824] via-[#0d121b] to-[#090d14] rounded-2xl relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Dados Principais */}
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/25 shadow-[0_0_14px_rgba(0,180,255,0.2)]">
                        <Users className="size-6" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-2xl tracking-wide text-white leading-tight">
                            {cand.nick}
                          </h3>
                          <span className="text-xs text-muted-foreground">({cand.nome}, {cand.idade} anos)</span>

                          {status === "aprovado" ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Aprovado p/ Teste
                            </span>
                          ) : status === "recusado" ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                              Recusado
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Em Análise
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-subtle mt-0.5">
                          {cand.cidadeEstado} • Cadastrado: {cand.submittedAt || "Recente"}
                        </p>

                        {/* Chips de Patente e Função */}
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-silver">
                            🎯 Função: <strong className="text-accent">{displayValue("funcao", cand)}</strong>
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-silver">
                            🏆 Patente: <strong className="text-white">{displayValue("patenteAtual", cand)}</strong>
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-silver">
                            🆔 ID: <strong className="font-mono text-accent">{cand.idConta}</strong>
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-silver">
                            ⏱️ {cand.horarioDisponivel} ({displayValue("tempoDisponivel", cand)})
                          </span>
                        </div>

                        {cand.experienciaDescricao ? (
                          <div className="mt-3 p-3 rounded-lg bg-black/30 border border-white/5 text-xs text-silver/90 leading-relaxed">
                            <strong className="text-accent font-semibold">Histórico Competitivo:</strong>{" "}
                            {cand.experienciaDescricao}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Ações da Liderança */}
                    <div className="flex flex-row sm:flex-col gap-2 shrink-0 sm:min-w-[160px] justify-end">
                      <a
                        href={whatsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                      >
                        <MessageCircle className="size-4" />
                        Chamar no Zap
                      </a>

                      <button
                        type="button"
                        onClick={() => copyCandidateDossier(cand)}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/8 bg-white/4 hover:bg-white/8 text-silver transition-all"
                      >
                        <Copy className="size-3.5" />
                        Copiar Ficha
                      </button>

                      <div className="flex items-center gap-1 justify-end pt-1">
                        <button
                          type="button"
                          title="Aprovar para Teste"
                          onClick={() => updateStatus(cand.id, "aprovado")}
                          className="p-1.5 rounded-md hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 transition-colors"
                        >
                          <CheckCircle2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Recusar Candidatura"
                          onClick={() => updateStatus(cand.id, "recusado")}
                          className="p-1.5 rounded-md hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <XCircle className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Excluir do Painel"
                          onClick={() => deleteCandidate(cand.id)}
                          className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
