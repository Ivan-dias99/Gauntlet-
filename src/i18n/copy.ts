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

  // Brand doctrine line — rendered next to "Signal" in CanonRibbon.
  // Calm mono register; states the epistemic north in five words.
  brandDoctrine: string;

  // Insight — reasoning chamber
  labKicker: string;
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
  creationInputVoice: string;
  creationErrorTitle: string;
  creationPlaceholder: string;
  creationRunning: string;

  // Terminal composer affordances — chrome buttons + not-wired flyouts.
  // Repo/branch/connectors carry honest "requires backend" copy because
  // the backend contracts (GET /repo/status, GET /connectors, ...) do
  // not exist yet. No fake data, no canned branch list.
  termAffordContext: string;
  termAffordRecent: string;
  termAffordTools: string;
  termAffordRepo: string;
  termAffordBranch: string;
  termAffordConnectors: string;
  termRepoNotWiredTitle: string;
  termRepoNotWiredBody: string;
  termRepoNotWiredContract: string;
  termConnectorsNotWiredTitle: string;
  termConnectorsNotWiredBody: string;
  termConnectorsNotWiredContract: string;
  // Composer identity zone (workbench-strip family).
  termComposerLabel: string;
  termComposerPathRoot: string;
  termComposerStatusIdle: string;
  termComposerStatusPending: string;

  // Surface studio — cockpit identity for the design workstation.
  // The chamber's plan generator is mock until the provider lands;
  // status copy carries the honest posture.
  surfaceStudioLabel: string;
  surfaceStudioStatusIdle: string;
  surfaceStudioStatusBriefing: string;
  surfaceStudioStatusPending: string;
  surfaceStudioStatusReady: string;
  surfaceStudioModeLabel: string;
  surfaceStudioFidelityLabel: string;
  surfaceStudioDsLabel: string;
  surfaceStudioDsEmpty: string;
  surfaceStudioBriefLabel: string;
  surfaceStudioBriefPlaceholder: string;
  surfaceStudioGenerate: string;
  surfaceStudioGenerating: string;
  surfaceStudioMockBanner: string;

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
  dormantSurface: string;
  dormantCore: string;

  // Archive list / detail empty states
  archiveListEmpty: string;
  archiveDetailEmptyKicker: string;
  archiveDetailEmptyBody: string;

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

  // Critical error boundary
  errorBoundaryKicker: string;
  errorBoundaryRetry: string;

  // Mission-pill telemetry
  missionLastArtifact: (time: string) => string;
  missionNoArtifacts: string;
}

const PT: Copy = {
  chambers: {
    insight:  { label: "Insight",  sub: "evidência · triad + juiz · recusa por defeito", lead: "Insight · três análises antes de uma resposta" },
    surface:  { label: "Surface",  sub: "design · mock declarado · provider trocável",   lead: "Surface · workstation de design" },
    terminal: { label: "Terminal", sub: "código · agent loop · tool allowlist",          lead: "Terminal · execução com consequência" },
    archive:  { label: "Archive",  sub: "runs selados · proveniência · ledger",          lead: "Archive · cada execução fica registada" },
    // Core retains institutional register by design.
    core:     { label: "Core",     sub: "políticas · roteamento · governance",           lead: "Core · princípios que vinculam cada chamber" },
  },
  switchMission: "Trocar missão",
  missions: "Missões",

  brandDoctrine: "recusar antes de adivinhar",

  labKicker: "— INSIGHT",
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
  labThreadEmptyIdleBody: "três análises antes de uma resposta · divergência vira recusa.",
  labThreadEmptyActiveBody: "próxima pergunta continua a missão · mesma triad, mesmo juiz.",

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
  labRailPrinciplesEmpty: "sem princípios activos · inscreve em Core › Policies",
  labRailPrinciplesMore: (n) => `+ ${n} mais`,

  labRailTrailKicker: "— trilha",
  labRailTrailEmpty: "trilha vazia · primeiro veredicto ainda por chegar",
  labRailTrailRefused: "recusado",

  labRailTimeNow: "agora",
  labRailTimeMinutes: (n) => `há ${n}m`,
  labRailTimeHours: (n) => `há ${n}h`,
  labRailTimeDays: (n) => `há ${n}d`,

  creationKicker: "— TERMINAL",
  creationInputVoice: "— comando",
  creationErrorTitle: "erro",
  creationPlaceholder: "declarar próxima tarefa…",
  creationRunning: "a executar…",

  termAffordContext: "contexto · sinais que viajam com cada tarefa",
  termAffordRecent: "recentes · últimas tarefas desta missão",
  termAffordTools: "tools · allowlist real desta câmara",
  termAffordRepo: "repo · requer backend git",
  termAffordBranch: "branch · requer repo status",
  termAffordConnectors: "connectors · registry ainda não ligado",
  termComposerLabel: "TERMINAL",
  termComposerPathRoot: "~/mission",
  termComposerStatusIdle: "pronto · próxima tarefa torna-se comando",
  termComposerStatusPending: "execução em curso · streaming",

  surfaceStudioLabel: "STUDIO",
  surfaceStudioStatusIdle: "studio aberto · briefing por escrever",
  surfaceStudioStatusBriefing: "briefing em curso · plano por gerar",
  surfaceStudioStatusPending: "geração em curso · plano canned a chegar",
  surfaceStudioStatusReady: "plano selado · screens prontos para revisão",
  surfaceStudioModeLabel: "modo",
  surfaceStudioFidelityLabel: "fidelidade",
  surfaceStudioDsLabel: "design system",
  surfaceStudioDsEmpty: "sem design system",
  surfaceStudioBriefLabel: "brief",
  surfaceStudioBriefPlaceholder: "Descreve a superfície — propósito, utilizador, restrições…",
  surfaceStudioGenerate: "Gerar plano",
  surfaceStudioGenerating: "a gerar…",
  surfaceStudioMockBanner: "mock declarado · nenhum provider chamado · plano canned",
  termRepoNotWiredTitle: "repo · não ligado",
  termRepoNotWiredBody: "Endpoint git do backend ainda não existe. Branch, dirty state, ahead/behind ficam por ligar — Signal não inventa branch.",
  termRepoNotWiredContract: "espera por: GET /repo/status · GET /repo/branches · POST /repo/checkout",
  termConnectorsNotWiredTitle: "connectors · não ligado",
  termConnectorsNotWiredBody: "Registry de conectores externos ainda não existe. GitHub, Vercel, fontes de docs ficam por ligar — Signal não pinta integração que não tem.",
  termConnectorsNotWiredContract: "espera por: GET /connectors · POST /connectors/{id}/connect",

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
  dormantLab: "backend dormente — Insight recusa fingir. nada é perdido; o estado local persiste até a triad voltar.",
  dormantMemory: "backend dormente — o ledger está local; o pulso em directo só regressa quando o brain responder.",
  dormantCreation: "backend dormente — Terminal não inventa execução. a bancada segue pronta; a ponte está silenciosa.",
  dormantSurface: "backend dormente — Surface não fabrica plano sem o brain. modo, fidelidade e design system ficam guardados localmente até a ponte voltar.",
  dormantCore: "backend dormente — doutrina por carregar. o que aparece veio só da cache local; nenhum princípio novo é inscrito até a sincronização voltar.",

  archiveListEmpty: "— sem entradas para este filtro —",
  archiveDetailEmptyKicker: "— proveniência",
  archiveDetailEmptyBody: "Selecciona uma entrada do ledger para ver a origem, o artefacto ligado, e a cadeia que a produziu.",

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
  schoolInputVoice: "novo princípio",
  schoolEmpty: "Sem princípios. Adiciona o primeiro.",
  schoolEmptyKicker: "Sem princípios",
  schoolEmptyHint: "escreve o primeiro em baixo",
  schoolPlaceholder: "Redigir o próximo princípio…",
  schoolInscribe: "Adicionar",

  errorBoundaryKicker: "— crítico · erro interno",
  errorBoundaryRetry: "tentar novamente",

  missionLastArtifact: (time) => `último artefacto há ${time}`,
  missionNoArtifacts: "ainda sem artefactos",
};

const EN: Copy = {
  chambers: {
    insight:  { label: "Insight",  sub: "evidence · triad + judge · refuse by default", lead: "Insight · three analyses before one answer" },
    surface:  { label: "Surface",  sub: "design · declared mock · swappable provider",  lead: "Surface · design workstation" },
    terminal: { label: "Terminal", sub: "code · agent loop · tool allowlist",           lead: "Terminal · execution with consequence" },
    archive:  { label: "Archive",  sub: "sealed runs · provenance · ledger",            lead: "Archive · every run is logged" },
    core:     { label: "Core",     sub: "policies · routing · governance",              lead: "Core · principles that bind every chamber" },
  },
  switchMission: "Switch mission",
  missions: "Missions",

  brandDoctrine: "refuse before guessing",

  labKicker: "— INSIGHT",
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
  labThreadEmptyIdleBody: "three analyses before one answer · divergence becomes refusal.",
  labThreadEmptyActiveBody: "next question continues the mission · same triad, same judge.",

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
  labRailPrinciplesEmpty: "no principles active · inscribe at Core › Policies",
  labRailPrinciplesMore: (n) => `+ ${n} more`,

  labRailTrailKicker: "— trail",
  labRailTrailEmpty: "trail empty · first verdict not yet in",
  labRailTrailRefused: "refused",

  labRailTimeNow: "now",
  labRailTimeMinutes: (n) => `${n}m ago`,
  labRailTimeHours: (n) => `${n}h ago`,
  labRailTimeDays: (n) => `${n}d ago`,

  creationKicker: "— TERMINAL",
  creationInputVoice: "— command",
  creationErrorTitle: "error",
  creationPlaceholder: "declare next task…",
  creationRunning: "running…",

  termAffordContext: "context · signals travelling with each task",
  termAffordRecent: "recent · latest tasks in this mission",
  termAffordTools: "tools · real chamber allowlist",
  termAffordRepo: "repo · requires git backend",
  termAffordBranch: "branch · requires repo status",
  termAffordConnectors: "connectors · registry not wired yet",
  termComposerLabel: "TERMINAL",
  termComposerPathRoot: "~/mission",
  termComposerStatusIdle: "ready · next task becomes a command",
  termComposerStatusPending: "running · streaming",

  surfaceStudioLabel: "STUDIO",
  surfaceStudioStatusIdle: "studio open · brief not yet written",
  surfaceStudioStatusBriefing: "briefing in progress · plan not yet generated",
  surfaceStudioStatusPending: "generating · canned plan en route",
  surfaceStudioStatusReady: "plan sealed · screens ready for review",
  surfaceStudioModeLabel: "mode",
  surfaceStudioFidelityLabel: "fidelity",
  surfaceStudioDsLabel: "design system",
  surfaceStudioDsEmpty: "no design system",
  surfaceStudioBriefLabel: "brief",
  surfaceStudioBriefPlaceholder: "Describe the surface — purpose, user, constraints…",
  surfaceStudioGenerate: "Generate plan",
  surfaceStudioGenerating: "generating…",
  surfaceStudioMockBanner: "declared mock · no provider called · canned plan",
  termRepoNotWiredTitle: "repo · not wired",
  termRepoNotWiredBody: "Backend git endpoint does not exist yet. Branch, dirty state, ahead/behind await wiring — Signal does not invent a branch.",
  termRepoNotWiredContract: "awaiting: GET /repo/status · GET /repo/branches · POST /repo/checkout",
  termConnectorsNotWiredTitle: "connectors · not wired",
  termConnectorsNotWiredBody: "External connector registry does not exist yet. GitHub, Vercel, docs sources await wiring — Signal does not paint integrations it has not earned.",
  termConnectorsNotWiredContract: "awaiting: GET /connectors · POST /connectors/{id}/connect",

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
  dormantLab: "backend dormant — Insight refuses to fake. nothing is lost; local state persists until the triad returns.",
  dormantMemory: "backend dormant — the ledger is local; the live pulse resumes only when the brain answers.",
  dormantCreation: "backend dormant — Terminal does not invent execution. the workbench is ready; the bridge is quiet.",
  dormantSurface: "backend dormant — Surface will not fabricate a plan without the brain. mode, fidelity and design system stay held locally until the bridge returns.",
  dormantCore: "backend dormant — doctrine not yet loaded. what appears below came from local cache only; no new principle is inscribed until sync resumes.",

  archiveListEmpty: "— no entries for this filter —",
  archiveDetailEmptyKicker: "— provenance",
  archiveDetailEmptyBody: "Select a ledger entry to see its origin, the linked artifact, and the chain that produced it.",

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
  schoolInputVoice: "new principle",
  schoolEmpty: "No principles. Add the first.",
  schoolEmptyKicker: "No principles",
  schoolEmptyHint: "write the first one below",
  schoolPlaceholder: "Draft the next principle…",
  schoolInscribe: "Add",

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
