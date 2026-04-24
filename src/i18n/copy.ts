import { useTweaks, Lang } from "../tweaks/TweaksContext";
import { Chamber } from "../spine/types";

// Signal copy. Only fields that are actually rendered today are kept;
// the VisionLanding / RitualEntry / TweaksPanel / timeline-kanban
// residue is gone. Tone intentionally calm — institutional register
// stays only where Core itself is (schoolTagline, severityCritical,
// errorBoundaryKicker). Other chambers read operational, not forensic.

export interface ChamberCopy {
  label: string;
  sub: string;
  lead: string;
}

export interface Copy {
  chambers: Record<Chamber, ChamberCopy>;
  switchMission: string;
  missions: string;

  // Insight — reasoning chamber
  labKicker: string;
  labTagline: string;
  labInputVoice: string;
  labErrorTitle: string;
  labPlaceholder: string;
  labPlaceholderNoMission: string;
  labPlaceholderPending: string;
  labPlaceholderRefused: string;
  labTurnAsk: string;       // user turn label (calm)
  labTurnAnswer: string;    // AI turn label
  labTurnWarn: string;      // AI warning turn
  labTurnRefuse: string;    // AI refusal turn

  // Insight thread empty — non-hero, operational. Compact strip at the
  // top of the thread region, no glyph, no italic serif, no centering.
  labThreadEmptyKicker: string;
  labThreadEmptyIdleBody: string;        // no mission yet
  labThreadEmptyActiveBody: string;      // mission active, no exchanges

  // Insight right rail — mission · chamber status · principles · trail.
  // Every string the rail can render lives here so language stays one
  // coherent voice across the chamber.
  labRailMissionKicker: string;
  labRailNoMission: string;              // calm one-liner inside mission card
  labRailMetaOpened: string;
  labRailMetaTurns: string;
  labRailMetaDoctrine: string;
  labRailPrincipleSingular: string;
  labRailPrinciplePlural: string;

  labRailStatusKicker: string;
  labRailStatusRoute: string;
  labRailStatusStage: string;
  labRailStatusConfidence: string;
  labRailStatusIter: string;
  labRailStatusTools: string;
  labRailStatusLast: string;
  labRailStatusIdle: string;
  labRailStatusRunning: string;
  labRailStatusStop: string;
  labRailStatusNone: string;             // "—"
  labRailStatusAwaiting: string;         // rendered when no activity yet
  labRailStatusRouteTriad: string;
  labRailStatusRouteAgent: string;

  labRailPrinciplesKicker: string;
  labRailPrinciplesEmpty: string;
  labRailPrinciplesMore: (n: number) => string;

  labRailTrailKicker: string;
  labRailTrailEmpty: string;
  labRailTrailRefused: string;

  labRailTimeNow: string;
  labRailTimeMinutes: (n: number) => string;
  labRailTimeHours: (n: number) => string;
  labRailTimeDays: (n: number) => string;

  // Terminal — execution chamber
  creationKicker: string;
  creationTagline: string;
  creationInputVoice: string;
  creationErrorTitle: string;
  creationPlaceholder: string;
  creationRunning: string;

  // Shared workbench / task queue copy (used by Terminal)
  workbench: string;
  recentArtifacts: string;
  nextStep: string;
  noActiveTask: string;
  resumeHint: string;
  actionNextTask: string;
  actionRefine: string;
  actionBlock: string;
  actionUnblock: string;
  actionAllDone: string;
  taskStateOpen: string;
  taskStateRunning: string;
  taskStateDone: string;
  taskStateBlocked: string;
  onBench: string;
  blockedSection: string;
  doneSection: string;
  taskSourceManual: string;
  taskSourceLab: string;
  taskSourceCrew: string;
  taskSourceOther: string;
  artifactEmpty: string;
  acceptArtifact: string;
  acceptHint: string;
  artifactSealed: string;
  artifactChip: string;
  artifactTooltip: string;
  refinePrefix: string;

  // Terminal editorial surface (workbench strip + output canvas)
  termStripLabel: string;              // "WORKBENCH" / "BANCADA"
  termStripMissionLabel: string;       // "mission" / "missão"
  termStripMissionNull: string;        // "no mission" / "sem missão"
  termStripContext: string;            // "context" / "contexto"
  termStripDocs: string;               // "docs" / "docs"
  termStripStatusRunning: string;
  termStripStatusBlocked: string;
  termStripStatusDone: string;
  termReadyTitle: string;              // "Ready."
  termReadyLead: string;               // "Declara uma tarefa abaixo..."
  termReadyTipDeclare: string;
  termReadyTipMission: string;
  termReadyTipDoctrine: string;
  termBriefKicker: string;             // "Mission brief:" / "Resumo da missão:"
  termBriefLead: string;
  termBriefTasks: (done: number, pending: number, total: number) => string;
  termPendingTitleFallback: string;    // "Executing"
  termDoneTitleFallback: string;       // "Task complete"
  termLivePill: string;
  termPartialPill: string;
  termErrorPill: string;
  termErrorTitleFallback: string;
  termErrorLead: string;
  termSectionPlan: string;
  termSectionExecLog: string;
  termSectionStreaming: string;
  termSectionNotes: string;
  termSectionResult: string;
  termSectionMessage: string;
  termSectionRecent: string;
  termResultPartial: (reason: string | null) => string;
  termResultSealed: string;
  termResultReady: string;
  termRunSummary: (iter: number, tools: number, ms: number) => string;
  termArtifactPartial: string;
  termArtifactSealedShort: string;

  // Archive
  memoryLoading: string;
  memoryErrorTitle: string;
  memoryErrorPrefix: string;

  // Dormant / unreachable panels (shared)
  dormantKicker: string;
  dormantLab: string;
  dormantMemory: string;
  dormantCreation: string;

  // Spine sync indicator
  spineSyncLabel: (state: "synced" | "syncing" | "unsynced") => string;
  spineSyncTitle: (state: "synced" | "syncing" | "unsynced") => string;

  // Severity / error-panel labels (shared)
  severityCritical: string;
  severityWarn: string;
  severityInfo: string;
  dismiss: string;

  // Core / Policies (keeps institutional register)
  schoolTagline: string;
  schoolSubtitle: string;
  schoolInputVoice: string;
  schoolEmpty: string;
  schoolEmptyKicker: string;
  schoolEmptyHint: string;
  schoolPlaceholder: string;
  schoolInscribe: string;
  schoolComposerHint: string;
  schoolIntroSub: string;

  // Core tab subs
  coreTabPolicies: string;
  coreTabRouting: string;
  coreTabPermissions: string;
  coreTabOrchestration: string;
  coreTabSystem: string;

  // Critical error boundary
  errorBoundaryKicker: string;
  errorBoundaryRetry: string;

  // Mission-pill telemetry
  missionLastArtifact: (time: string) => string;
  missionNoArtifacts: string;
}

const PT: Copy = {
  chambers: {
    insight:  { label: "Insight",  sub: "Análise · evidência · direção",     lead: "Insight · evidência · direção" },
    surface:  { label: "Surface",  sub: "Design · estrutura · fidelidade",   lead: "Surface · workstation de design" },
    terminal: { label: "Terminal", sub: "Código · execução · ferramentas",   lead: "Terminal · execução" },
    archive:  { label: "Archive",  sub: "Retenção · proveniência · continuidade", lead: "Archive · runs · proveniência" },
    // Core retains institutional register by design.
    core:     { label: "Core",     sub: "Políticas · roteamento · orquestração", lead: "Core · governance" },
  },
  switchMission: "Trocar missão",
  missions: "Missões",

  labKicker: "— INSIGHT",
  labTagline: "Análise · evidência · direção",
  labInputVoice: "— pergunta",
  labErrorTitle: "erro",
  labPlaceholder: "Pergunta…",
  labPlaceholderNoMission: "Pergunta para começar…",
  labPlaceholderPending: "A processar…",
  labPlaceholderRefused: "Reformula com mais contexto.",
  labTurnAsk: "pergunta",
  labTurnAnswer: "resposta",
  labTurnWarn: "aviso",
  labTurnRefuse: "recusa",

  labThreadEmptyKicker: "— pronto",
  labThreadEmptyIdleBody: "primeira pergunta abre a missão.",
  labThreadEmptyActiveBody: "próxima pergunta continua a missão.",

  labRailMissionKicker: "— missão",
  labRailNoMission: "sem missão · aguarda primeira pergunta",
  labRailMetaOpened: "aberta",
  labRailMetaTurns: "turnos",
  labRailMetaDoctrine: "doutrina",
  labRailPrincipleSingular: "princípio",
  labRailPrinciplePlural: "princípios",

  labRailStatusKicker: "— estado",
  labRailStatusRoute: "rota",
  labRailStatusStage: "fase",
  labRailStatusConfidence: "confiança",
  labRailStatusIter: "iter",
  labRailStatusTools: "tools",
  labRailStatusLast: "última",
  labRailStatusIdle: "em repouso",
  labRailStatusRunning: "a correr",
  labRailStatusStop: "parar esc",
  labRailStatusNone: "—",
  labRailStatusAwaiting: "a aguardar pergunta",
  labRailStatusRouteTriad: "triad",
  labRailStatusRouteAgent: "agent",

  labRailPrinciplesKicker: "— em vigor",
  labRailPrinciplesEmpty: "sem princípios activos neste domínio",
  labRailPrinciplesMore: (n) => `+ ${n} mais`,

  labRailTrailKicker: "— trilha",
  labRailTrailEmpty: "trilha vazia · primeiro veredicto ainda por chegar",
  labRailTrailRefused: "recusado",

  labRailTimeNow: "agora",
  labRailTimeMinutes: (n) => `há ${n}m`,
  labRailTimeHours: (n) => `há ${n}h`,
  labRailTimeDays: (n) => `há ${n}d`,

  creationKicker: "— TERMINAL",
  creationTagline: "Código · execução · ferramentas",
  creationInputVoice: "— comando",
  creationErrorTitle: "erro",
  creationPlaceholder: "declarar próxima tarefa…",
  creationRunning: "a executar…",

  workbench: "bancada",
  recentArtifacts: "arquivo da missão",
  nextStep: "próximo",
  noActiveTask: "Sem tarefa activa. Declara a próxima.",
  resumeHint: "retomar aqui",
  actionNextTask: "→ próxima",
  actionRefine: "↻ refinar",
  actionBlock: "✕ bloquear",
  actionUnblock: "↺ reabrir",
  actionAllDone: "✓ fila limpa",
  taskStateOpen: "aberta",
  taskStateRunning: "a correr",
  taskStateDone: "concluída",
  taskStateBlocked: "bloqueada",
  onBench: "em bancada",
  blockedSection: "bloqueadas",
  doneSection: "concluídas",
  taskSourceManual: "manual",
  taskSourceLab: "insight",
  taskSourceCrew: "crew",
  taskSourceOther: "outro",
  artifactEmpty: "arquivo vazio · nenhum resultado selado",
  acceptArtifact: "✓ selar artefacto",
  acceptHint: "→ fecha a tarefa · entra no arquivo",
  artifactSealed: "✓ selado · registado na missão",
  artifactChip: "◆ selado",
  artifactTooltip: "selado",
  refinePrefix: "refinar: ",

  termStripLabel: "Bancada",
  termStripMissionLabel: "missão",
  termStripMissionNull: "sem missão",
  termStripContext: "contexto",
  termStripDocs: "docs",
  termStripStatusRunning: "Tarefa em execução — a transmitir.",
  termStripStatusBlocked: "Tarefa bloqueada — reabre ou avança.",
  termStripStatusDone: "Tarefa concluída — resultado selado.",
  termReadyTitle: "Pronto.",
  termReadyLead: "Declara uma tarefa abaixo. Ela vira comando. O comando tem consequência.",
  termReadyTipDeclare: "declarar tarefa · enter",
  termReadyTipMission: "abrir missão · topo da barra",
  termReadyTipDoctrine: "doutrina · Core › Policies",
  termBriefKicker: "Resumo da missão",
  termBriefLead: "Workspace pronto. Declara uma tarefa para começar. Cada tarefa executada aqui é persistida como artefacto desta missão.",
  termBriefTasks: (done, pending, total) =>
    `${done} concluídas · ${pending} pendentes · ${total} no total`,
  termPendingTitleFallback: "Em execução",
  termDoneTitleFallback: "Tarefa concluída",
  termLivePill: "em directo",
  termPartialPill: "parcial",
  termErrorPill: "erro",
  termErrorTitleFallback: "Erro",
  termErrorLead: "A execução não concluiu. A câmara está pronta para repetir.",
  termSectionPlan: "plano",
  termSectionExecLog: "log de execução",
  termSectionStreaming: "transmissão",
  termSectionNotes: "notas",
  termSectionResult: "resultado",
  termSectionMessage: "mensagem",
  termSectionRecent: "artefactos recentes",
  termResultPartial: (reason) =>
    reason
      ? `Resultado parcial — execução terminada cedo: ${reason}.`
      : "Resultado parcial — execução terminada cedo.",
  termResultSealed: "Resultado selado. Artefacto persistido na missão.",
  termResultReady: "Resultado pronto. Sela para persistir como artefacto da missão.",
  termRunSummary: (iter, tools, ms) =>
    `exit 0 · ${iter} iter · ${tools} tools · ${ms}ms`,
  termArtifactPartial: "parcial",
  termArtifactSealedShort: "selado",

  memoryLoading: "— a carregar —",
  memoryErrorTitle: "backend",
  memoryErrorPrefix: "falha do backend:",

  dormantKicker: "— dormente",
  dormantLab: "insight em silêncio — nada é perdido; volta quando o backend regressar.",
  dormantMemory: "telemetria em pausa — o arquivo permanece; só o pulso em directo está dormente.",
  dormantCreation: "execução em pausa — a plataforma segue pronta; a ponte para o backend está silenciosa.",

  spineSyncLabel: (s) =>
    s === "synced" ? "sincronizado" : s === "syncing" ? "a sincronizar" : "local",
  spineSyncTitle: (s) =>
    s === "synced" ? "missão sincronizada com o backend" :
    s === "syncing" ? "a enviar alterações para o backend" :
    "backend indisponível — alterações guardadas localmente, por sincronizar",

  severityCritical: "— crítico",
  severityWarn: "— aviso",
  severityInfo: "— info",
  dismiss: "dispensar",

  // Core / Policies — institutional register preserved.
  schoolTagline: "— POLICIES",
  schoolSubtitle: "princípios que vinculam cada chamber",
  schoolInputVoice: "nova lei",
  schoolEmpty: "Este sistema ainda não tem memória constitucional.",
  schoolEmptyKicker: "Sem doutrina ratificada",
  schoolEmptyHint: "Ratifica a primeira lei operativa.",
  schoolPlaceholder: "Redigir a próxima lei…",
  schoolInscribe: "Ratificar",
  schoolComposerHint: "enter ratifica · shift+enter nova linha",
  schoolIntroSub: "Princípios constitucionais que vinculam cada invocação em qualquer chamber. Inscrição explícita, sem revogação silenciosa.",

  coreTabPolicies: "Princípios constitucionais",
  coreTabRouting: "Perfis de chamber",
  coreTabPermissions: "Allowlist de tools",
  coreTabOrchestration: "Budgets · crew · triad",
  coreTabSystem: "Tema · densidade · idioma · diagnóstico",

  errorBoundaryKicker: "— crítico · erro interno",
  errorBoundaryRetry: "tentar novamente",

  missionLastArtifact: (time) => `último artefacto há ${time}`,
  missionNoArtifacts: "ainda sem artefactos",
};

const EN: Copy = {
  chambers: {
    insight:  { label: "Insight",  sub: "Analysis · evidence · direction",      lead: "Insight · evidence · direction" },
    surface:  { label: "Surface",  sub: "Design · structure · fidelity",        lead: "Surface · design workstation" },
    terminal: { label: "Terminal", sub: "Code · execution · tools",             lead: "Terminal · execution" },
    archive:  { label: "Archive",  sub: "Retention · provenance · continuity",  lead: "Archive · runs · provenance" },
    core:     { label: "Core",     sub: "Policies · routing · orchestration",   lead: "Core · governance" },
  },
  switchMission: "Switch mission",
  missions: "Missions",

  labKicker: "— INSIGHT",
  labTagline: "Analysis · evidence · direction",
  labInputVoice: "— question",
  labErrorTitle: "error",
  labPlaceholder: "Question…",
  labPlaceholderNoMission: "Question to begin…",
  labPlaceholderPending: "Processing…",
  labPlaceholderRefused: "Reformulate with more context.",
  labTurnAsk: "question",
  labTurnAnswer: "answer",
  labTurnWarn: "warning",
  labTurnRefuse: "refusal",

  labThreadEmptyKicker: "— ready",
  labThreadEmptyIdleBody: "first question opens the mission.",
  labThreadEmptyActiveBody: "next question continues the mission.",

  labRailMissionKicker: "— mission",
  labRailNoMission: "no mission · awaiting first question",
  labRailMetaOpened: "opened",
  labRailMetaTurns: "turns",
  labRailMetaDoctrine: "doctrine",
  labRailPrincipleSingular: "principle",
  labRailPrinciplePlural: "principles",

  labRailStatusKicker: "— status",
  labRailStatusRoute: "route",
  labRailStatusStage: "stage",
  labRailStatusConfidence: "confidence",
  labRailStatusIter: "iter",
  labRailStatusTools: "tools",
  labRailStatusLast: "last",
  labRailStatusIdle: "at rest",
  labRailStatusRunning: "running",
  labRailStatusStop: "stop esc",
  labRailStatusNone: "—",
  labRailStatusAwaiting: "awaiting question",
  labRailStatusRouteTriad: "triad",
  labRailStatusRouteAgent: "agent",

  labRailPrinciplesKicker: "— in force",
  labRailPrinciplesEmpty: "no principles active in this domain",
  labRailPrinciplesMore: (n) => `+ ${n} more`,

  labRailTrailKicker: "— trail",
  labRailTrailEmpty: "trail empty · first verdict not yet in",
  labRailTrailRefused: "refused",

  labRailTimeNow: "now",
  labRailTimeMinutes: (n) => `${n}m ago`,
  labRailTimeHours: (n) => `${n}h ago`,
  labRailTimeDays: (n) => `${n}d ago`,

  creationKicker: "— TERMINAL",
  creationTagline: "Code · execution · tools",
  creationInputVoice: "— command",
  creationErrorTitle: "error",
  creationPlaceholder: "declare next task…",
  creationRunning: "running…",

  workbench: "workbench",
  recentArtifacts: "mission archive",
  nextStep: "next",
  noActiveTask: "No active task. Declare the next.",
  resumeHint: "resume here",
  actionNextTask: "→ next",
  actionRefine: "↻ refine",
  actionBlock: "✕ block",
  actionUnblock: "↺ reopen",
  actionAllDone: "✓ queue clear",
  taskStateOpen: "open",
  taskStateRunning: "running",
  taskStateDone: "done",
  taskStateBlocked: "blocked",
  onBench: "on bench",
  blockedSection: "blocked",
  doneSection: "done",
  taskSourceManual: "manual",
  taskSourceLab: "insight",
  taskSourceCrew: "crew",
  taskSourceOther: "other",
  artifactEmpty: "archive empty · no results sealed",
  acceptArtifact: "✓ seal artifact",
  acceptHint: "→ closes task · enters the archive",
  artifactSealed: "✓ sealed · logged on mission",
  artifactChip: "◆ sealed",
  artifactTooltip: "sealed",
  refinePrefix: "refine: ",

  termStripLabel: "Workbench",
  termStripMissionLabel: "mission",
  termStripMissionNull: "no mission",
  termStripContext: "context",
  termStripDocs: "docs",
  termStripStatusRunning: "Task running — streaming execution.",
  termStripStatusBlocked: "Task blocked — reopen or advance.",
  termStripStatusDone: "Task complete — result sealed.",
  termReadyTitle: "Ready.",
  termReadyLead: "Declare a task below. It becomes a command. The command has consequence.",
  termReadyTipDeclare: "declare task · enter",
  termReadyTipMission: "open mission · top bar",
  termReadyTipDoctrine: "doctrine · Core › Policies",
  termBriefKicker: "Mission brief",
  termBriefLead: "Workspace ready. Declare a task to begin. Every task that runs here is persisted as an artifact of this mission.",
  termBriefTasks: (done, pending, total) =>
    `${done} done · ${pending} pending · ${total} total`,
  termPendingTitleFallback: "Executing",
  termDoneTitleFallback: "Task complete",
  termLivePill: "live",
  termPartialPill: "partial",
  termErrorPill: "error",
  termErrorTitleFallback: "Error",
  termErrorLead: "The run did not complete. The chamber is ready to retry.",
  termSectionPlan: "plan",
  termSectionExecLog: "execution log",
  termSectionStreaming: "streaming",
  termSectionNotes: "notes",
  termSectionResult: "result",
  termSectionMessage: "message",
  termSectionRecent: "recent artifacts",
  termResultPartial: (reason) =>
    reason
      ? `Partial result — run terminated early: ${reason}.`
      : "Partial result — run terminated early.",
  termResultSealed: "Result sealed. Artifact persisted on mission.",
  termResultReady: "Result ready. Seal to persist as mission artifact.",
  termRunSummary: (iter, tools, ms) =>
    `exit 0 · ${iter} iter · ${tools} tools · ${ms}ms`,
  termArtifactPartial: "partial",
  termArtifactSealedShort: "sealed",

  memoryLoading: "— loading —",
  memoryErrorTitle: "backend",
  memoryErrorPrefix: "backend failure:",

  dormantKicker: "— dormant",
  dormantLab: "insight quiet — nothing is lost; it resumes when the backend returns.",
  dormantMemory: "telemetry paused — the archive remains; only the live pulse is dormant.",
  dormantCreation: "execution paused — the workstation is ready; the bridge to the backend is quiet.",

  spineSyncLabel: (s) =>
    s === "synced" ? "synced" : s === "syncing" ? "syncing" : "local only",
  spineSyncTitle: (s) =>
    s === "synced" ? "mission synced with backend" :
    s === "syncing" ? "pushing changes to backend" :
    "backend unavailable — changes held locally, not yet synced",

  severityCritical: "— critical",
  severityWarn: "— warning",
  severityInfo: "— info",
  dismiss: "dismiss",

  schoolTagline: "— POLICIES",
  schoolSubtitle: "principles that bind every chamber",
  schoolInputVoice: "new law",
  schoolEmpty: "This system has no constitutional memory yet.",
  schoolEmptyKicker: "No doctrine ratified",
  schoolEmptyHint: "Ratify the first operating law.",
  schoolPlaceholder: "Draft the next law…",
  schoolInscribe: "Ratify",
  schoolComposerHint: "enter ratifies · shift+enter new line",
  schoolIntroSub: "Constitutional principles that bind every invocation in every chamber. Explicit inscription, no silent revocation.",

  coreTabPolicies: "Constitutional principles",
  coreTabRouting: "Chamber profiles",
  coreTabPermissions: "Tool allowlist",
  coreTabOrchestration: "Budgets · crew · triad",
  coreTabSystem: "Theme · density · language · diagnostics",

  errorBoundaryKicker: "— critical · internal error",
  errorBoundaryRetry: "try again",

  missionLastArtifact: (time) => `last artifact ${time} ago`,
  missionNoArtifacts: "no artifacts yet",
};

const DICT: Record<Lang, Copy> = { pt: PT, en: EN };

export function useCopy(): Copy {
  const { values } = useTweaks();
  return DICT[values.lang] ?? PT;
}

// Hookless accessor for contexts that cannot call hooks (ErrorBoundary,
// module-level rendering, tests). Defaults to PT — language preference
// lives inside TweaksContext, which may itself be the thing that failed.
export function fallbackCopy(): Copy {
  return PT;
}
