import { useTweaks, Lang } from "../tweaks/TweaksContext";
import { Chamber } from "../spine/types";

export interface ChamberCopy {
  label: string;
  sub: string;
  lead: string;
}

export interface Copy {
  brand: string;
  chambers: Record<Chamber, ChamberCopy>;
  newMission: string;
  ritualTag: string;
  missionName: string;
  enter: string;
  cancel: string;
  switchMission: string;
  missions: string;
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
  labAwait: string;
  labAnalyzing: string;
  creationKicker: string;
  creationTagline: string;
  creationInputVoice: string;
  creationErrorTitle: string;
  creationEmptyPrompt: string;
  creationPlaceholder: string;
  creationRunning: string;
  workbench: string;
  workQueue: string;
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
  runInterrupted: string;
  artifactInterrupted: string;
  errorLabel: string;
  kanbanPending: string;
  kanbanDone: string;
  refinePrefix: string;
  memoryTagline: string;
  memorySubtitle: string;
  memoryTelemetryKicker: string;
  memoryTelemetryTitle: string;
  memoryLoading: string;
  memoryErrorTitle: string;
  memoryErrorPrefix: string;
  dormantKicker: string;
  dormantLab: string;
  dormantMemory: string;
  dormantCreation: string;
  spineSyncLabel: (state: "synced" | "syncing" | "unsynced") => string;
  spineSyncTitle: (state: "synced" | "syncing" | "unsynced") => string;
  severityCritical: string;
  severityWarn: string;
  severityInfo: string;
  dismiss: string;
  memoryEmpty: string;
  memoryCount: (n: number) => string;
  schoolTagline: string;
  schoolSubtitle: string;
  schoolInputVoice: string;
  schoolEmpty: string;
  schoolEmptyKicker: string;
  schoolEmptyHint: string;
  schoolPlaceholder: string;
  schoolInscribe: string;
  ritualMissionVoice: string;
  errorBoundaryKicker: string;
  errorBoundaryRetry: string;
  homeTitle: string;
  themeTitle: (name: string) => string;
  missionLastArtifact: (time: string) => string;
  missionNoArtifacts: string;
  tweaksTitle: string;
  tweaksClose: string;
  resetTweaks: string;
  resetSpine: string;
  resetSpineConfirm: string;
  memoryDayEntry: (n: number) => string;
  creationPrinciplesPresent: (n: number) => string;
  enterKey: string;
  resumeMission: string;
  newMissionLong: string;
  noMission: string;
  scrollCue: string;
  retune: string;
  sovereignInstrument: string;
  heroSub: string;
  fourChambersKicker: string;
  chambersHeading: string;
  manifesto: string;
  activeMissions: string;
  emptyMissions: string;
  manifestoItems: string[];
  chamberDeck: {
    key: Chamber;
    k: string;
    title: string;
    tag: string;
    body: string;
    glyph: string;
  }[];
}

const PT: Copy = {
  brand: "RUBERRA",
  chambers: {
    Lab: {
      label: "Investigação",
      sub: "Análise · Evidência · Verdade",
      lead: "Investigação · Evidência · Verdade",
    },
    Creation: {
      label: "Construção",
      sub: "Arquitetura · Execução · Consequência",
      lead: "Construção · Execução · Consequência",
    },
    Memory: {
      label: "Memória",
      sub: "Retenção · Inteligência · Continuidade",
      lead: "Memória Viva · Retenção · Inteligência",
    },
    School: {
      label: "Doutrina",
      sub: "Formação · Constituição · Princípio",
      lead: "Doutrina · Constituição · Princípio",
    },
  },
  newMission: "+ Missão",
  ritualTag: "RUBERRA · NOVA MISSÃO",
  missionName: "Nome da missão",
  enter: "Entrar",
  cancel: "cancelar",
  switchMission: "Trocar missão",
  missions: "Missões",
  labKicker: "— PRESSÃO FORENSE",
  labTagline: "Investigação · Evidência · Pressão",
  labInputVoice: "— DIRECTIVA",
  labErrorTitle: "FALHA",
  labEmpty: "Sem evidências. Comece a investigar.",
  labEmptyActiveKicker: "— Sem entrada",
  labEmptyActiveHint: "uma questão, uma hipótese, uma fractura",
  labEmptyNoMissionKicker: "— Sem missão activa",
  labEmptyNoMissionBody: "Cria ou activa uma missão para investigar.",
  labEmptyNoMissionHint: "+ missão no canto superior",
  labPlaceholder: "Evidência, análise, hipótese...",
  labPlaceholderNoMission: "Activa uma missão para investigar...",
  labPlaceholderPending: "Aguardando verdict...",
  labPlaceholderRefused: "Reformula. Fractura. Pressiona mais.",
  labAwait: "Aguardando resposta...",
  labAnalyzing: "ANALISANDO",
  creationKicker: "— TERMINAL SOBERANO",
  creationTagline: "Construção · Execução · Consequência",
  creationInputVoice: "— COMANDO",
  creationErrorTitle: "EXECUÇÃO",
  creationEmptyPrompt: "$ _",
  creationPlaceholder: "declarar próxima tarefa…",
  creationRunning: "a executar…",
  workbench: "bancada",
  workQueue: "fila de trabalho",
  recentArtifacts: "arquivo da missão",
  nextStep: "próximo",
  noActiveTask: "Sem tarefa activa. Declara a próxima.",
  resumeHint: "Retomar aqui",
  actionNextTask: "→ próxima",
  actionRefine: "↻ refinar",
  actionBlock: "✕ bloquear",
  actionUnblock: "↺ reabrir",
  actionAllDone: "✓ fila limpa",
  taskStateOpen: "aberta",
  taskStateRunning: "em curso",
  taskStateDone: "concluída",
  taskStateBlocked: "bloqueada",
  onBench: "na bancada",
  blockedSection: "bloqueadas",
  doneSection: "concluídas",
  taskSourceManual: "manual",
  taskSourceLab: "lab",
  taskSourceCrew: "crew",
  taskSourceOther: "outra",
  artifactEmpty: "arquivo vazio · nenhuma consequência selada",
  acceptArtifact: "✓ selar artefacto",
  acceptHint: "→ fecha tarefa · entra no arquivo",
  artifactSealed: "✓ selado · arquivado na missão",
  artifactChip: "◆ selado",
  artifactTooltip: "selado",
  runInterrupted: "⚠ interrompido cedo",
  artifactInterrupted: "⚠ interrompido cedo",
  errorLabel: "ERRO",
  kanbanPending: "pendente",
  kanbanDone: "concluída",
  refinePrefix: "refinar: ",
  memoryTagline: "— ARQUIVO VIVO",
  memorySubtitle: "o que a missão já decidiu",
  memoryTelemetryKicker: "— TELEMETRIA",
  memoryTelemetryTitle: "Pulso da missão",
  memoryLoading: "— a carregar —",
  memoryErrorTitle: "BACKEND",
  memoryErrorPrefix: "falha do backend:",
  dormantKicker: "— DORMENTE",
  dormantLab: "laboratório em silêncio — nada é perdido; volta quando o backend regressar.",
  dormantMemory: "telemetria em pausa — o arquivo permanece; só o pulso em directo está dormente.",
  dormantCreation: "execução em pausa — a plataforma segue pronta; a ponte para o backend está silenciosa.",
  spineSyncLabel: (s) =>
    s === "synced" ? "sincronizado" : s === "syncing" ? "a sincronizar" : "local",
  spineSyncTitle: (s) =>
    s === "synced" ? "missão sincronizada com o backend" :
    s === "syncing" ? "a enviar alterações para o backend" :
    "backend indisponível — alterações guardadas localmente, por sincronizar",
  severityCritical: "— CRÍTICO",
  severityWarn: "— AVISO",
  severityInfo: "— INFO",
  dismiss: "dispensar",
  memoryEmpty: "— log vazio —",
  memoryCount: (n) => `${n} evento${n === 1 ? "" : "s"}`,
  schoolTagline: "DOUTRINA SOBERANA",
  schoolSubtitle: "princípios que vinculam Lab e Creation",
  schoolInputVoice: "INSCRIÇÃO DE ARTIGO",
  schoolEmpty: "Sem princípios registados. A constituição está em branco.",
  schoolEmptyKicker: "Constituição em branco",
  schoolEmptyHint: "inscreve o primeiro artigo abaixo",
  schoolPlaceholder: "Redigir o próximo artigo da doutrina…",
  schoolInscribe: "Inscrever",
  ritualMissionVoice: "— MISSÃO",
  errorBoundaryKicker: "— CRÍTICO · ERRO INTERNO",
  errorBoundaryRetry: "TENTAR NOVAMENTE",
  homeTitle: "Voltar ao início",
  themeTitle: (name) => `Tema: ${name}`,
  missionLastArtifact: (time) => `último artefacto há ${time}`,
  missionNoArtifacts: "ainda sem artefactos",
  tweaksTitle: "Tweaks",
  tweaksClose: "FECHAR ×",
  resetTweaks: "repor tweaks",
  resetSpine: "repor spine",
  resetSpineConfirm: "Repor spine? Missões, notas, tarefas e princípios serão apagados.",
  memoryDayEntry: (n) => `${n} ${n === 1 ? "entrada" : "entradas"}`,
  creationPrinciplesPresent: (n) =>
    `${n} princípio${n !== 1 ? "s" : ""} da doutrina bem presentes nesta câmara`,
  enterKey: "Enter",
  resumeMission: "Retomar missão",
  newMissionLong: "+ Nova missão",
  noMission: "Sem missão",
  scrollCue: "↓ Role para ver as câmaras",
  retune: "Tweaks",
  sovereignInstrument: "— Instrumento soberano · v∞",
  heroSub:
    "Um sistema operativo privado para quem constrói com consequência. Quatro câmaras. Uma voz. Sua.",
  fourChambersKicker: "— As quatro câmaras",
  chambersHeading: "Cada câmara é um órgão. Juntas, fazem um organismo.",
  manifesto: "— Manifesto",
  activeMissions: "— Missões ativas",
  emptyMissions: "Nenhuma. A página está em branco.",
  manifestoItems: [
    "Lucidez sobre produtividade",
    "Consequência sobre velocidade",
    "Soberania sobre consenso",
    "Arquivo sobre memória",
  ],
  chamberDeck: [
    { key: "Lab", k: "01", title: "Investigação", tag: "Forense, cirúrgica", body: "Interrogatório do real. Separa o que é sabido, presumido e ausente. A IA não concorda — ela pressiona.", glyph: "※" },
    { key: "Creation", k: "02", title: "Construção", tag: "Terminal soberano", body: "Intenção vira ação. Cada tarefa é um comando. Exit code visível. Sem motivação.", glyph: "›_" },
    { key: "Memory", k: "03", title: "Memória", tag: "Arquivo estrutural", body: "Tudo é gravado em linha do tempo. Nenhum evento se perde. A missão lembra-se de si.", glyph: "◇" },
    { key: "School", k: "04", title: "Doutrina", tag: "Princípios codificados", body: "A voz que permanece. Princípios numerados, referenciáveis, imutáveis até reescritos.", glyph: "§" },
  ],
};

const EN: Copy = {
  brand: "RUBERRA",
  chambers: {
    Lab: { label: "Lab", sub: "Analysis · Evidence · Truth", lead: "Lab · Evidence · Truth" },
    Creation: { label: "Creation", sub: "Architecture · Execution · Consequence", lead: "Creation · Execution · Consequence" },
    Memory: { label: "Memory", sub: "Retention · Intelligence · Continuity", lead: "Living Memory · Retention · Intelligence" },
    School: { label: "School", sub: "Formation · Constitution · Principle", lead: "School · Constitution · Principle" },
  },
  newMission: "+ Mission",
  ritualTag: "RUBERRA · NEW MISSION",
  missionName: "Mission name",
  enter: "Enter",
  cancel: "cancel",
  switchMission: "Switch mission",
  missions: "Missions",
  labKicker: "— FORENSIC PRESSURE",
  labTagline: "Investigation · Evidence · Pressure",
  labInputVoice: "— DIRECTIVE",
  labErrorTitle: "FAILURE",
  labEmpty: "No evidence. Begin investigating.",
  labEmptyActiveKicker: "— No entry",
  labEmptyActiveHint: "a question, a hypothesis, a fracture",
  labEmptyNoMissionKicker: "— No active mission",
  labEmptyNoMissionBody: "Create or activate a mission to investigate.",
  labEmptyNoMissionHint: "+ mission in the top corner",
  labPlaceholder: "Evidence, analysis, hypothesis...",
  labPlaceholderNoMission: "Activate a mission to investigate...",
  labPlaceholderPending: "Awaiting verdict...",
  labPlaceholderRefused: "Reformulate. Fracture. Press harder.",
  labAwait: "Awaiting response...",
  labAnalyzing: "ANALYZING",
  creationKicker: "— SOVEREIGN TERMINAL",
  creationTagline: "Construction · Execution · Consequence",
  creationInputVoice: "— COMMAND",
  creationErrorTitle: "EXECUTION",
  creationEmptyPrompt: "$ _",
  creationPlaceholder: "declare next task…",
  creationRunning: "running…",
  workbench: "workbench",
  workQueue: "work queue",
  recentArtifacts: "mission archive",
  nextStep: "next",
  noActiveTask: "No active task. Declare the next.",
  resumeHint: "Resume here",
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
  taskSourceLab: "lab",
  taskSourceCrew: "crew",
  taskSourceOther: "other",
  artifactEmpty: "archive empty · no consequences sealed",
  acceptArtifact: "✓ seal artifact",
  acceptHint: "→ closes task · enters the archive",
  artifactSealed: "✓ sealed · logged on mission",
  artifactChip: "◆ sealed",
  artifactTooltip: "sealed",
  runInterrupted: "⚠ cut short",
  artifactInterrupted: "⚠ cut short",
  errorLabel: "ERROR",
  kanbanPending: "pending",
  kanbanDone: "done",
  refinePrefix: "refine: ",
  memoryTagline: "— LIVING ARCHIVE",
  memorySubtitle: "what the mission has already decided",
  memoryTelemetryKicker: "— TELEMETRY",
  memoryTelemetryTitle: "Mission pulse",
  memoryLoading: "— loading —",
  memoryErrorTitle: "BACKEND",
  memoryErrorPrefix: "backend failure:",
  dormantKicker: "— DORMANT",
  dormantLab: "lab quiet — nothing is lost; it resumes when the backend returns.",
  dormantMemory: "telemetry paused — the archive remains; only the live pulse is dormant.",
  dormantCreation: "execution paused — the workstation is ready; the bridge to the backend is quiet.",
  spineSyncLabel: (s) =>
    s === "synced" ? "synced" : s === "syncing" ? "syncing" : "local only",
  spineSyncTitle: (s) =>
    s === "synced" ? "mission synced with backend" :
    s === "syncing" ? "pushing changes to backend" :
    "backend unavailable — changes held locally, not yet synced",
  severityCritical: "— CRITICAL",
  severityWarn: "— WARNING",
  severityInfo: "— INFO",
  dismiss: "dismiss",
  memoryEmpty: "— empty log —",
  memoryCount: (n) => `${n} event${n === 1 ? "" : "s"}`,
  schoolTagline: "SOVEREIGN DOCTRINE",
  schoolSubtitle: "principles that bind Lab and Creation",
  schoolInputVoice: "ARTICLE INSCRIPTION",
  schoolEmpty: "No principles recorded. Constitution is blank.",
  schoolEmptyKicker: "Blank constitution",
  schoolEmptyHint: "inscribe the first article below",
  schoolPlaceholder: "Draft the next article of the doctrine…",
  schoolInscribe: "Inscribe",
  ritualMissionVoice: "— MISSION",
  errorBoundaryKicker: "— CRITICAL · INTERNAL ERROR",
  errorBoundaryRetry: "TRY AGAIN",
  homeTitle: "Back to landing",
  themeTitle: (name) => `Theme: ${name}`,
  missionLastArtifact: (time) => `last artifact ${time} ago`,
  missionNoArtifacts: "no artifacts yet",
  tweaksTitle: "Tweaks",
  tweaksClose: "CLOSE ×",
  resetTweaks: "reset tweaks",
  resetSpine: "reset spine",
  resetSpineConfirm: "Reset spine? Missions, notes, tasks and principles will be erased.",
  memoryDayEntry: (n) => `${n} ${n === 1 ? "entry" : "entries"}`,
  creationPrinciplesPresent: (n) =>
    `${n} doctrine principle${n !== 1 ? "s" : ""} present in this chamber`,
  enterKey: "Enter",
  resumeMission: "Resume mission",
  newMissionLong: "+ New mission",
  noMission: "No mission",
  scrollCue: "↓ Scroll to see the chambers",
  retune: "Tweaks",
  sovereignInstrument: "— Sovereign instrument · v∞",
  heroSub:
    "A private operating system for those who build with consequence. Four chambers. One voice. Yours.",
  fourChambersKicker: "— The four chambers",
  chambersHeading: "Each chamber is an organ. Together, they form an organism.",
  manifesto: "— Manifesto",
  activeMissions: "— Active missions",
  emptyMissions: "None. The page is blank.",
  manifestoItems: [
    "Lucidity over productivity",
    "Consequence over speed",
    "Sovereignty over consensus",
    "Archive over memory",
  ],
  chamberDeck: [
    { key: "Lab", k: "01", title: "Investigation", tag: "Forensic, surgical", body: "Interrogation of the real. Separates known, assumed, absent. The AI doesn't agree — it presses.", glyph: "※" },
    { key: "Creation", k: "02", title: "Construction", tag: "Sovereign terminal", body: "Intent becomes action. Each task is a command. Exit code visible. No motivation.", glyph: "›_" },
    { key: "Memory", k: "03", title: "Memory", tag: "Structural archive", body: "Everything recorded on a timeline. No event lost. The mission remembers itself.", glyph: "◇" },
    { key: "School", k: "04", title: "Doctrine", tag: "Codified principles", body: "The voice that remains. Numbered, referenceable principles — immutable until rewritten.", glyph: "§" },
  ],
};

const DICT: Record<Lang, Copy> = { pt: PT, en: EN };

export function useCopy(): Copy {
  const { values } = useTweaks();
  return DICT[values.lang] ?? PT;
}

// Hookless accessor for contexts that cannot call hooks (ErrorBoundary,
// module-level rendering, tests). Defaults to PT — language preference lives
// inside TweaksContext, which may itself be the thing that failed.
export function fallbackCopy(): Copy {
  return PT;
}
