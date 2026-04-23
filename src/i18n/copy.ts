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
  labEmpty: string;
  labEmptyActiveKicker: string;
  labEmptyActiveHint: string;
  labEmptyNoMissionKicker: string;
  labEmptyNoMissionBody: string;
  labEmptyNoMissionHint: string;
  labPlaceholder: string;
  labPlaceholderNoMission: string;
  labPlaceholderPending: string;
  labPlaceholderRefused: string;
  labTurnAsk: string;       // user turn label (calm)
  labTurnAnswer: string;    // AI turn label
  labTurnWarn: string;      // AI warning turn
  labTurnRefuse: string;    // AI refusal turn

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
  labEmpty: "Sem perguntas ainda. Escreve a primeira.",
  labEmptyActiveKicker: "— sem entrada",
  labEmptyActiveHint: "uma pergunta basta",
  labEmptyNoMissionKicker: "— sem missão activa",
  labEmptyNoMissionBody: "Escreve uma pergunta — a missão cria-se automaticamente.",
  labEmptyNoMissionHint: "o primeiro envio cria a missão",
  labPlaceholder: "Pergunta…",
  labPlaceholderNoMission: "Pergunta para criar a missão…",
  labPlaceholderPending: "A processar…",
  labPlaceholderRefused: "Reformula com mais contexto.",
  labTurnAsk: "pergunta",
  labTurnAnswer: "resposta",
  labTurnWarn: "aviso",
  labTurnRefuse: "recusa",

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
  labEmpty: "No questions yet. Type the first.",
  labEmptyActiveKicker: "— no entry",
  labEmptyActiveHint: "one question is enough",
  labEmptyNoMissionKicker: "— no active mission",
  labEmptyNoMissionBody: "Type a question — the mission is created automatically.",
  labEmptyNoMissionHint: "the first send starts the mission",
  labPlaceholder: "Question…",
  labPlaceholderNoMission: "Question to start a mission…",
  labPlaceholderPending: "Processing…",
  labPlaceholderRefused: "Reformulate with more context.",
  labTurnAsk: "question",
  labTurnAnswer: "answer",
  labTurnWarn: "warning",
  labTurnRefuse: "refusal",

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
