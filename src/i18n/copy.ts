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
  // Workbench-strip family — small lowercase labels next to the
  // mission caret. Locale-bound so Surface and Terminal don't leak
  // English into a PT shell.
  wbMissionLabel: string;
  wbMissionNull: string;
  // Mission switcher — "+ new thread" entry inside the dropdown.
  newThreadLabel: string;
  newThreadHint: string;

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
  // Terminal Workbench lenses — five tools above the composer that
  // narrate the execution territory: repo · diff · gates · deploy ·
  // queue. Each carries a label, a flyout body, and the backend
  // contract pending wiring (Run Queue is partially wired — it reads
  // mission.tasks).
  termWbRepoLabel: string;
  termWbRepoBody: string;
  termWbRepoContract: string;
  termWbDiffLabel: string;
  termWbDiffBody: string;
  termWbDiffContract: string;
  termWbGatesLabel: string;
  termWbGatesBody: string;
  termWbGatesContract: string;
  termWbDeployLabel: string;
  termWbDeployBody: string;
  termWbDeployContract: string;
  termWbQueueLabel: string;
  termWbQueueBody: string;
  termWbQueueContract: string;
  termWbValueIdle: string;
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
  // Mode / fidelity option labels — locale-bound. Hardcoded in
  // CreationPanel before; pulled here so EN ≠ PT mismatch stops.
  surfaceModePrototype: string;
  surfaceModeSlideDeck: string;
  surfaceModeFromTemplate: string;
  surfaceModeOther: string;
  surfaceFidelityWireframe: string;
  surfaceFidelityHiFi: string;
  // Right-rail hero empty state — shown above the gallery tabs when
  // no plan has been generated. Replaced by the plan preview on
  // generate. Mirrors the elegant "— sem contrato visual" hero of
  // the pre-cockpit Surface.
  surfaceRailEmptyKicker: string;
  surfaceRailEmptyBody: string;
  // Contract-blocked checklist — leads the canvas when no plan
  // exists. Each row reflects a real piece of the brief that must be
  // declared before the visual contract can validate. Examples drop
  // to a secondary accelerator strip below the checklist.
  surfaceContractBlockedKicker: string;
  surfaceContractBlockedBody: string;
  surfaceContractFieldIntent: string;
  surfaceContractFieldOutput: string;
  surfaceContractFieldFidelity: string;
  surfaceContractFieldDs: string;
  surfaceExamplesKicker: string;
  surfaceExamplesHint: string;
  // Canvas view router — four top-level tabs that switch the right
  // column between brief · plan · files · wireframes. Files and
  // wireframes are honest "not wired" until the design backend lands;
  // the empty states declare the contracts pending.
  surfaceCanvasTabBrief: string;
  surfaceCanvasTabPlan: string;
  surfaceCanvasTabFiles: string;
  surfaceCanvasTabWireframes: string;
  surfacePlanEmptyKicker: string;
  surfacePlanEmptyBody: string;
  surfaceFilesEmptyKicker: string;
  surfaceFilesEmptyBody: string;
  surfaceFilesEmptyContract: string;
  surfaceFilesPagesLabel: string;
  surfaceFilesComponentsLabel: string;
  surfaceFilesUploadsLabel: string;
  surfaceWireframesEmptyKicker: string;
  surfaceWireframesEmptyBody: string;
  surfaceWireframesEmptyContract: string;
  // Insight Workbench lenses — 5 chips on the evidence territory.
  // All wired (real-time, derived from local live + verdict state).
  insightWbLabel: string;
  insightWbStatusIdle: string;
  insightWbStatusRunning: string;
  insightWbStatusVerdict: string;
  insightWbStatusRefused: string;
  insightWbTriadLabel: string;
  insightWbTriadBody: string;
  insightWbJudgeLabel: string;
  insightWbJudgeBody: string;
  insightWbJudgeIdle: string;
  insightWbJudgeHigh: string;
  insightWbJudgeLow: string;
  insightWbDivergenceLabel: string;
  insightWbDivergenceBody: string;
  insightWbMemoryLabel: string;
  insightWbMemoryBody: string;
  insightWbMemoryClean: string;
  insightWbMemoryFailed: string;
  insightWbDoctrineLabel: string;
  insightWbDoctrineBody: string;
  insightWbValueIdle: string;
  // Core Workbench lenses — 5 chips on the governance territory.
  // Read-only mirror of system state (Wave 5; editability lands Wave 7).
  coreWbLabel: string;
  coreWbStatusReadOnly: string;
  coreWbChambersLabel: string;
  coreWbChambersBody: string;
  coreWbToolsLabel: string;
  coreWbToolsBody: string;
  coreWbDoctrineLabel: string;
  coreWbDoctrineBody: string;
  coreWbBackendLabel: string;
  coreWbBackendBody: string;
  coreWbBackendMock: string;
  coreWbBackendLive: string;
  coreWbSpineLabel: string;
  coreWbSpineBody: string;
  coreWbSpineSynced: string;
  coreWbSpineSyncing: string;
  coreWbSpineLocal: string;
  coreWbValueIdle: string;
  // Surface Workbench lenses — five tools at the top of the chamber
  // that narrate the visual territory: contract · design system ·
  // layout/grid · component inventory · state matrix. Each carries
  // a label, a flyout body and the backend contract pending.
  // Contract value is wired (idle / draft / valid / sealed); the
  // others are honest "not wired" until the design backend lands.
  surfaceWbContractLabel: string;
  surfaceWbContractBody: string;
  surfaceWbContractContract: string;
  surfaceWbContractIdle: string;
  surfaceWbContractDraft: string;
  surfaceWbContractValid: string;
  surfaceWbContractSealed: string;
  surfaceWbDsLabel: string;
  surfaceWbDsBody: string;
  surfaceWbDsContract: string;
  surfaceWbLayoutLabel: string;
  surfaceWbLayoutBody: string;
  surfaceWbLayoutContract: string;
  surfaceWbComponentsLabel: string;
  surfaceWbComponentsBody: string;
  surfaceWbComponentsContract: string;
  surfaceWbStatesLabel: string;
  surfaceWbStatesBody: string;
  surfaceWbStatesContract: string;
  surfaceWbValueIdle: string;
  // Surface composer affordances — Visual References Attach +
  // Preview / Handoff control. Both honest "not wired" until the
  // upload + handoff endpoints land.
  surfaceComposerRefsLabel: string;
  surfaceComposerRefsBody: string;
  surfaceComposerRefsContract: string;
  surfaceComposerHandoffLabel: string;
  surfaceComposerHandoffBody: string;
  surfaceComposerHandoffContract: string;
  // Output Mode label — replaces the old "Mode" label so the
  // composer reads as "what shape does the visual contract take?"
  // not "what category". Values still pinned to the backend's
  // SurfaceBriefPayload literal (prototype | slide_deck | from_template
  // | other); landing + component_spec land when the backend type
  // catches up.
  surfaceComposerOutputModeLabel: string;
  // CTA copy — the cockpit's primary action. "Formar Contrato Visual"
  // reads as a contract-forming verb (not a generic submit).
  surfaceCtaForm: string;
  surfaceCtaFormHint: string;

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
  wbMissionLabel: "missão",
  wbMissionNull: "sem missão",
  newThreadLabel: "nova missão",
  newThreadHint: "Insight · primeira pergunta cria missão",

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
  surfaceModePrototype: "Protótipo",
  surfaceModeSlideDeck: "Slide deck",
  surfaceModeFromTemplate: "Template",
  surfaceModeOther: "Outro",
  surfaceFidelityWireframe: "Wireframe",
  surfaceFidelityHiFi: "Alta fidelidade",
  surfaceRailEmptyKicker: "— sem contrato visual ainda",
  surfaceRailEmptyBody: "Define modo, fidelidade e design system, depois escreve o brief e gera o contrato visual. O plano aparece aqui — screens, componentes, notas.",
  surfaceContractBlockedKicker: "— contrato visual bloqueado",
  surfaceContractBlockedBody: "Forma o contrato à esquerda. Cada linha por completar mantém-no bloqueado.",
  surfaceContractFieldIntent: "intenção · brief escrito",
  surfaceContractFieldOutput: "output · prototype / deck / template / other",
  surfaceContractFieldFidelity: "fidelidade · wireframe ou high-fidelity",
  surfaceContractFieldDs: "design system · pick um existente ou declara none",
  surfaceExamplesKicker: "— atalhos",
  surfaceExamplesHint: "pontos de partida canned. Substitui-se quando Core/Routing expor o catálogo real.",
  surfaceCanvasTabBrief: "brief",
  surfaceCanvasTabPlan: "plan",
  surfaceCanvasTabFiles: "files",
  surfaceCanvasTabWireframes: "wireframes",
  surfacePlanEmptyKicker: "— plano por gerar",
  surfacePlanEmptyBody: "Forma o contrato à esquerda e gera. O plano aparece aqui — screens, componentes, notas.",
  surfaceFilesEmptyKicker: "— files & components · não ligado",
  surfaceFilesEmptyBody: "Pages, componentes e uploads — todo o material que o plano produz e que a Workbench inspecciona. O backend de ficheiros ainda não existe; Signal não inventa ficheiros que ninguém escreveu.",
  surfaceFilesEmptyContract: "espera por: POST /surface/files/upload · GET /surface/files/{mission} · GET /surface/files/{mission}/components",
  surfaceFilesPagesLabel: "pages",
  surfaceFilesComponentsLabel: "components",
  surfaceFilesUploadsLabel: "uploads",
  surfaceWireframesEmptyKicker: "— wireframes · sketchbook · não ligado",
  surfaceWireframesEmptyBody: "Modo de ideação manual — esboços, anotações, direções rápidas antes do plano. O backend de wireframes ainda não existe; Signal não pinta sketchbook que não foi guardado.",
  surfaceWireframesEmptyContract: "espera por: POST /surface/wireframes/{mission} · GET /surface/wireframes/{mission}",
  insightWbLabel: "INSIGHT",
  insightWbStatusIdle: "em repouso · pronto para a próxima pergunta",
  insightWbStatusRunning: "três análises a correr · juiz a aguardar",
  insightWbStatusVerdict: "veredicto pronunciado",
  insightWbStatusRefused: "recusado · divergência ou falha prévia",
  insightWbTriadLabel: "triad",
  insightWbTriadBody: "Três análises paralelas. Lê o estado em tempo real (running x/3 ou done). Sem tool use — só evidência sob pressão.",
  insightWbJudgeLabel: "judge",
  insightWbJudgeBody: "Juiz das três respostas. high se concordam exactamente em factos e números; low se qualquer divergência. Recusa por defeito.",
  insightWbJudgeIdle: "—",
  insightWbJudgeHigh: "high",
  insightWbJudgeLow: "low",
  insightWbDivergenceLabel: "divergence",
  insightWbDivergenceBody: "Pontos onde as três respostas discordaram. 0 quando o juiz devolve high; ≥1 quando recusa por inconsistência.",
  insightWbMemoryLabel: "memory",
  insightWbMemoryBody: "Failure memory · esta pergunta já causou problemas antes? Se sim, Signal recusa por princípio mesmo que as três respostas concordem.",
  insightWbMemoryClean: "clean",
  insightWbMemoryFailed: "failed",
  insightWbDoctrineLabel: "doctrine",
  insightWbDoctrineBody: "Princípios em vigor que viajam com cada pergunta. Inscritos em Core › Policies; aplicados a todas as triad runs desta missão.",
  insightWbValueIdle: "—",
  coreWbLabel: "CORE",
  coreWbStatusReadOnly: "governance read-only · edição chega em Wave 7",
  coreWbChambersLabel: "chambers",
  coreWbChambersBody: "Câmaras registadas: Insight, Surface, Terminal, Archive, Core. Cinco modos cognitivos, cinco perfis em chambers/profiles.py.",
  coreWbToolsLabel: "tools",
  coreWbToolsBody: "Allowlist do Terminal (read_file, list_directory, run_command, execute_python, git, web_fetch, web_search). Outras chambers herdam tuple vazia — triad-only path.",
  coreWbDoctrineLabel: "doctrine",
  coreWbDoctrineBody: "Princípios em vigor inscritos em Policies. Viajam com cada query como build_principles_context. Editáveis localmente já hoje.",
  coreWbBackendLabel: "backend",
  coreWbBackendBody: "Modo do brain. mock = canned, sem chamadas Anthropic. live = real provider routing. Soberania total — frontend nunca chama o provider directamente.",
  coreWbBackendMock: "mock",
  coreWbBackendLive: "live",
  coreWbSpineLabel: "spine",
  coreWbSpineBody: "Estado da workspace snapshot. synced = backend tem o estado local. syncing = a empurrar. local = backend dormente; snapshot persiste local até regressar.",
  coreWbSpineSynced: "synced",
  coreWbSpineSyncing: "syncing",
  coreWbSpineLocal: "local",
  coreWbValueIdle: "—",
  surfaceWbContractLabel: "contract",
  surfaceWbContractBody: "Estado do contrato visual — idle / draft / valid / sealed. Reflete o brief actual e o plano gerado. Wired ao estado local da câmara.",
  surfaceWbContractContract: "wired · lê brief + plan do estado local Surface",
  surfaceWbContractIdle: "idle",
  surfaceWbContractDraft: "draft",
  surfaceWbContractValid: "valid",
  surfaceWbContractSealed: "sealed",
  surfaceWbDsLabel: "ds",
  surfaceWbDsBody: "Lente do design system — tokens, typography, radius, colors, spacing. Vai ler do registry quando o Core/Routing expor os DSes; agora só conta o DS escolhido no brief.",
  surfaceWbDsContract: "espera por: GET /design-systems · GET /design-systems/{id}/tokens",
  surfaceWbLayoutLabel: "layout",
  surfaceWbLayoutBody: "Lente de layout — grid, colunas, breakpoints, density, modo responsive. Signal não desenha grid sem o design backend dizer o que é válido.",
  surfaceWbLayoutContract: "espera por: GET /design/layout · POST /design/layout/probe",
  surfaceWbComponentsLabel: "components",
  surfaceWbComponentsBody: "Inventário de componentes — cards, inputs, rails, buttons, panels e seus estados usados no plano. Lê do plano gerado; vazio quando ainda não há plano.",
  surfaceWbComponentsContract: "wired · lê plan.components quando o plano aterrar",
  surfaceWbStatesLabel: "states",
  surfaceWbStatesBody: "Matriz de estados — empty, loading, error, blocked, valid, stale, archived. Signal não pinta state que o backend de design não validou.",
  surfaceWbStatesContract: "espera por: GET /design/states · POST /design/states/validate",
  surfaceWbValueIdle: "—",
  surfaceComposerRefsLabel: "refs · screenshots / mood / brand (não ligado)",
  surfaceComposerRefsBody: "Anexar screenshots, referências visuais, brand guidelines, fragmentos de UI existente. Endpoint de upload de assets ainda não existe; Signal não inventa upload.",
  surfaceComposerRefsContract: "espera por: POST /surface/refs/upload · GET /surface/refs/{mission}",
  surfaceComposerHandoffLabel: "handoff · enviar para Terminal / arquivar (não ligado)",
  surfaceComposerHandoffBody: "Preview do contrato, export do spec, enviar plano para Terminal implementar, arquivar como artefacto. Endpoints de handoff ainda não existem.",
  surfaceComposerHandoffContract: "espera por: POST /surface/plan/{id}/handoff · POST /surface/plan/{id}/seal",
  surfaceComposerOutputModeLabel: "output",
  surfaceCtaForm: "Formar contrato visual",
  surfaceCtaFormHint: "⌘/Ctrl + Enter",
  termWbRepoLabel: "repo",
  termWbRepoBody: "Lente do repositório — root, branch ativa, dirty state, remote, último commit. O backend git ainda não existe; Signal não inventa branch.",
  termWbRepoContract: "espera por: GET /repo/status · GET /repo/branches · POST /repo/checkout",
  termWbDiffLabel: "diff",
  termWbDiffBody: "Lente do diff atual — ficheiros alterados, additions/deletions, staged/unstaged, conflitos. Signal não fabrica diff sem repo real.",
  termWbDiffContract: "espera por: GET /repo/diff · GET /repo/status",
  termWbGatesLabel: "gates",
  termWbGatesBody: "Build gates — typecheck, build, tests, lint, smoke, runtime health. Signal não declara verde sem o gate ter corrido.",
  termWbGatesContract: "espera por: GET /build/status · POST /build/run",
  termWbDeployLabel: "deploy",
  termWbDeployBody: "Lente de deploy — Vercel preview/prod, URL ativo, commit SHA, env, logs. Signal não anuncia URL de deploy que não foi feito.",
  termWbDeployContract: "espera por: GET /deploy/status · GET /deploy/{env}/logs",
  termWbQueueLabel: "queue",
  termWbQueueBody: "Run queue desta missão — tarefas activas, pendentes, bloqueadas, concluídas, falhadas. Lê do spine; conta o que está realmente lá.",
  termWbQueueContract: "wired · lê activeMission.tasks no spine local",
  termWbValueIdle: "—",

  workbench: "bancada",
  recentArtifacts: "arquivo da missão",
  nextStep: "próximo",
  noActiveTask: "Sem tarefa activa.",
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
  termStripStatusRunning: "Em curso.",
  termStripStatusBlocked: "Bloqueada.",
  termStripStatusDone: "Concluída.",
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
  wbMissionLabel: "mission",
  wbMissionNull: "no mission",
  newThreadLabel: "new mission",
  newThreadHint: "Insight · first question creates a mission",

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
  surfaceModePrototype: "Prototype",
  surfaceModeSlideDeck: "Slide deck",
  surfaceModeFromTemplate: "Template",
  surfaceModeOther: "Other",
  surfaceFidelityWireframe: "Wireframe",
  surfaceFidelityHiFi: "Hi-fi",
  surfaceRailEmptyKicker: "— no visual contract yet",
  surfaceRailEmptyBody: "Set mode, fidelity and design system, then write the brief and generate the visual contract. The plan lands here — screens, components, notes.",
  surfaceContractBlockedKicker: "— visual contract blocked",
  surfaceContractBlockedBody: "Form the contract on the left. Each unchecked row keeps it blocked.",
  surfaceContractFieldIntent: "intent · brief written",
  surfaceContractFieldOutput: "output · prototype / deck / template / other",
  surfaceContractFieldFidelity: "fidelity · wireframe or high-fidelity",
  surfaceContractFieldDs: "design system · pick one or declare none",
  surfaceExamplesKicker: "— shortcuts",
  surfaceExamplesHint: "canned starting points. Replaced when Core/Routing exposes the real catalogue.",
  surfaceCanvasTabBrief: "brief",
  surfaceCanvasTabPlan: "plan",
  surfaceCanvasTabFiles: "files",
  surfaceCanvasTabWireframes: "wireframes",
  surfacePlanEmptyKicker: "— plan not generated yet",
  surfacePlanEmptyBody: "Form the contract on the left and generate. The plan lands here — screens, components, notes.",
  surfaceFilesEmptyKicker: "— files & components · not wired",
  surfaceFilesEmptyBody: "Pages, components and uploads — the material the plan produces and the Workbench inspects. The files backend does not exist yet; Signal does not fabricate files no one wrote.",
  surfaceFilesEmptyContract: "awaiting: POST /surface/files/upload · GET /surface/files/{mission} · GET /surface/files/{mission}/components",
  surfaceFilesPagesLabel: "pages",
  surfaceFilesComponentsLabel: "components",
  surfaceFilesUploadsLabel: "uploads",
  surfaceWireframesEmptyKicker: "— wireframes · sketchbook · not wired",
  surfaceWireframesEmptyBody: "Manual ideation — sketches, annotations, fast directions before the plan. The wireframes backend does not exist yet; Signal does not paint a sketchbook nobody saved.",
  surfaceWireframesEmptyContract: "awaiting: POST /surface/wireframes/{mission} · GET /surface/wireframes/{mission}",
  insightWbLabel: "INSIGHT",
  insightWbStatusIdle: "at rest · ready for the next question",
  insightWbStatusRunning: "three analyses running · judge pending",
  insightWbStatusVerdict: "verdict pronounced",
  insightWbStatusRefused: "refused · divergence or prior failure",
  insightWbTriadLabel: "triad",
  insightWbTriadBody: "Three parallel analyses. Reads live state (running x/3 or done). No tool use — only evidence under pressure.",
  insightWbJudgeLabel: "judge",
  insightWbJudgeBody: "Judge of the three answers. high if they agree exactly on facts and numbers; low on any divergence. Refuses by default.",
  insightWbJudgeIdle: "—",
  insightWbJudgeHigh: "high",
  insightWbJudgeLow: "low",
  insightWbDivergenceLabel: "divergence",
  insightWbDivergenceBody: "Points where the three answers disagreed. 0 when the judge returns high; ≥1 when it refuses for inconsistency.",
  insightWbMemoryLabel: "memory",
  insightWbMemoryBody: "Failure memory · has this question caused problems before? If so, Signal refuses by principle even when the three answers agree.",
  insightWbMemoryClean: "clean",
  insightWbMemoryFailed: "failed",
  insightWbDoctrineLabel: "doctrine",
  insightWbDoctrineBody: "Active principles travelling with each question. Inscribed in Core › Policies; applied to every triad run in this mission.",
  insightWbValueIdle: "—",
  coreWbLabel: "CORE",
  coreWbStatusReadOnly: "governance read-only · editing lands in Wave 7",
  coreWbChambersLabel: "chambers",
  coreWbChambersBody: "Registered chambers: Insight, Surface, Terminal, Archive, Core. Five cognitive modes, five profiles in chambers/profiles.py.",
  coreWbToolsLabel: "tools",
  coreWbToolsBody: "Terminal allowlist (read_file, list_directory, run_command, execute_python, git, web_fetch, web_search). Other chambers inherit an empty tuple — triad-only path.",
  coreWbDoctrineLabel: "doctrine",
  coreWbDoctrineBody: "Active principles inscribed in Policies. Travel with each query as build_principles_context. Editable locally today.",
  coreWbBackendLabel: "backend",
  coreWbBackendBody: "Brain mode. mock = canned, no Anthropic calls. live = real provider routing. Full sovereignty — frontend never calls the provider directly.",
  coreWbBackendMock: "mock",
  coreWbBackendLive: "live",
  coreWbSpineLabel: "spine",
  coreWbSpineBody: "Workspace snapshot state. synced = backend holds the local state. syncing = pushing. local = backend dormant; snapshot persists locally until it returns.",
  coreWbSpineSynced: "synced",
  coreWbSpineSyncing: "syncing",
  coreWbSpineLocal: "local",
  coreWbValueIdle: "—",
  surfaceWbContractLabel: "contract",
  surfaceWbContractBody: "Visual contract state — idle / draft / valid / sealed. Reflects the current brief and generated plan. Wired to the chamber's local state.",
  surfaceWbContractContract: "wired · reads brief + plan from local Surface state",
  surfaceWbContractIdle: "idle",
  surfaceWbContractDraft: "draft",
  surfaceWbContractValid: "valid",
  surfaceWbContractSealed: "sealed",
  surfaceWbDsLabel: "ds",
  surfaceWbDsBody: "Design system lens — tokens, typography, radius, colors, spacing. Will read from the registry when Core/Routing exposes DSes; for now it only echoes the brief's DS pick.",
  surfaceWbDsContract: "awaiting: GET /design-systems · GET /design-systems/{id}/tokens",
  surfaceWbLayoutLabel: "layout",
  surfaceWbLayoutBody: "Layout lens — grid, columns, breakpoints, density, responsive mode. Signal does not draw a grid without the design backend declaring what is valid.",
  surfaceWbLayoutContract: "awaiting: GET /design/layout · POST /design/layout/probe",
  surfaceWbComponentsLabel: "components",
  surfaceWbComponentsBody: "Component inventory — cards, inputs, rails, buttons, panels and their used states across the plan. Reads from the generated plan; empty until a plan lands.",
  surfaceWbComponentsContract: "wired · reads plan.components when a plan arrives",
  surfaceWbStatesLabel: "states",
  surfaceWbStatesBody: "State matrix — empty, loading, error, blocked, valid, stale, archived. Signal does not paint a state the design backend has not validated.",
  surfaceWbStatesContract: "awaiting: GET /design/states · POST /design/states/validate",
  surfaceWbValueIdle: "—",
  surfaceComposerRefsLabel: "refs · screenshots / mood / brand (not wired)",
  surfaceComposerRefsBody: "Attach screenshots, visual references, brand guidelines, fragments of existing UI. The asset upload endpoint does not exist yet; Signal does not fake an upload.",
  surfaceComposerRefsContract: "awaiting: POST /surface/refs/upload · GET /surface/refs/{mission}",
  surfaceComposerHandoffLabel: "handoff · send to Terminal / archive (not wired)",
  surfaceComposerHandoffBody: "Contract preview, spec export, hand the plan to Terminal for implementation, archive as artifact. Handoff endpoints do not exist yet.",
  surfaceComposerHandoffContract: "awaiting: POST /surface/plan/{id}/handoff · POST /surface/plan/{id}/seal",
  surfaceComposerOutputModeLabel: "output",
  surfaceCtaForm: "Form visual contract",
  surfaceCtaFormHint: "⌘/Ctrl + Enter",
  termWbRepoLabel: "repo",
  termWbRepoBody: "Repository lens — root, active branch, dirty state, remote, last commit. The git backend does not exist yet; Signal does not invent a branch.",
  termWbRepoContract: "awaiting: GET /repo/status · GET /repo/branches · POST /repo/checkout",
  termWbDiffLabel: "diff",
  termWbDiffBody: "Diff lens — files changed, additions/deletions, staged/unstaged, conflicts. Signal does not fabricate a diff without a real repo.",
  termWbDiffContract: "awaiting: GET /repo/diff · GET /repo/status",
  termWbGatesLabel: "gates",
  termWbGatesBody: "Build gates — typecheck, build, tests, lint, smoke, runtime health. Signal does not declare green without the gate having run.",
  termWbGatesContract: "awaiting: GET /build/status · POST /build/run",
  termWbDeployLabel: "deploy",
  termWbDeployBody: "Deploy lens — Vercel preview/prod, live URL, commit SHA, env, logs. Signal does not announce a deploy URL that has not been deployed.",
  termWbDeployContract: "awaiting: GET /deploy/status · GET /deploy/{env}/logs",
  termWbQueueLabel: "queue",
  termWbQueueBody: "Mission run queue — active, pending, blocked, done and failed tasks. Reads from spine; counts what is actually there.",
  termWbQueueContract: "wired · reads activeMission.tasks from the local spine",
  termWbValueIdle: "—",

  workbench: "workbench",
  recentArtifacts: "mission archive",
  nextStep: "next",
  noActiveTask: "No active task.",
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
  termStripStatusRunning: "Running.",
  termStripStatusBlocked: "Blocked.",
  termStripStatusDone: "Done.",
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
