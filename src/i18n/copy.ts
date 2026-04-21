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
  labEmpty: string;
  labNoInput: string;
  labNoMission: string;
  labNeedMission: string;
  labPlaceholder: string;
  labAwait: string;
  labAnalyzing: string;
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
  taskSourceManual: string;
  taskSourceLab: string;
  taskSourceCrew: string;
  taskSourceOther: string;
  artifactEmpty: string;
  refinePrefix: string;
  memoryEmpty: string;
  memoryCount: (n: number) => string;
  schoolEmpty: string;
  schoolPlaceholder: string;
  schoolInscribe: string;
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
  labEmpty: "Sem evidências. Comece a investigar.",
  labNoInput: "— Sem entrada",
  labNoMission: "— Sem missão ativa",
  labNeedMission: "Cria ou ativa uma missão para investigar.",
  labPlaceholder: "Evidência, análise, hipótese...",
  labAwait: "Aguardando resposta...",
  labAnalyzing: "ANALISANDO",
  creationEmptyPrompt: "$ _",
  creationPlaceholder: "nova tarefa...",
  creationRunning: "executando...",
  workbench: "bancada",
  workQueue: "fila de trabalho",
  recentArtifacts: "artefactos recentes",
  nextStep: "próximo passo",
  noActiveTask: "Nenhuma tarefa ativa. Declara a próxima.",
  resumeHint: "Retomar aqui",
  actionNextTask: "→ próxima tarefa",
  actionRefine: "↻ refinar",
  actionBlock: "✕ bloquear",
  actionUnblock: "↺ reabrir",
  actionAllDone: "✓ fila limpa",
  taskStateOpen: "aberta",
  taskStateRunning: "em curso",
  taskStateDone: "concluída",
  taskStateBlocked: "bloqueada",
  taskSourceManual: "manual",
  taskSourceLab: "lab",
  taskSourceCrew: "crew",
  taskSourceOther: "outra",
  artifactEmpty: "ainda sem artefactos aceites nesta missão",
  refinePrefix: "refinar: ",
  memoryEmpty: "— log vazio —",
  memoryCount: (n) => `${n} evento${n === 1 ? "" : "s"}`,
  schoolEmpty: "Sem princípios registados. A constituição está em branco.",
  schoolPlaceholder: "Novo princípio...",
  schoolInscribe: "Inscrever",
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
  labEmpty: "No evidence. Begin investigating.",
  labNoInput: "— No input",
  labNoMission: "— No active mission",
  labNeedMission: "Create or activate a mission to investigate.",
  labPlaceholder: "Evidence, analysis, hypothesis...",
  labAwait: "Awaiting response...",
  labAnalyzing: "ANALYZING",
  creationEmptyPrompt: "$ _",
  creationPlaceholder: "new task...",
  creationRunning: "running...",
  workbench: "workbench",
  workQueue: "work queue",
  recentArtifacts: "recent artifacts",
  nextStep: "next step",
  noActiveTask: "No active task. Declare the next one.",
  resumeHint: "Resume here",
  actionNextTask: "→ next task",
  actionRefine: "↻ refine",
  actionBlock: "✕ block",
  actionUnblock: "↺ reopen",
  actionAllDone: "✓ queue clear",
  taskStateOpen: "open",
  taskStateRunning: "running",
  taskStateDone: "done",
  taskStateBlocked: "blocked",
  taskSourceManual: "manual",
  taskSourceLab: "lab",
  taskSourceCrew: "crew",
  taskSourceOther: "other",
  artifactEmpty: "no accepted artifacts on this mission yet",
  refinePrefix: "refine: ",
  memoryEmpty: "— empty log —",
  memoryCount: (n) => `${n} event${n === 1 ? "" : "s"}`,
  schoolEmpty: "No principles recorded. Constitution is blank.",
  schoolPlaceholder: "New principle...",
  schoolInscribe: "Inscribe",
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
