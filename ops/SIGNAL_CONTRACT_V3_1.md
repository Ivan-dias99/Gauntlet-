# Signal Contract V3.1 — Implementable Lock

> Status: **locked as foundational contract for Wave 6a onwards**
> Supersedes: V2 (manifesto), V3 (vision)
> Doctrine alignment: "refuse before guessing", "don't be wrong", "evidence over assertion"

## Veredito

V3 estava forte como visão, fraco como contrato implementável. Este documento
fecha as 5 decisões pendentes em V2.1 e corta a inflação de V3, deixando um
contrato executável.

---

## Decisão 1 — 4 artefactos canónicos

Os 6 artefactos de V2 foram reduzidos a 4. As fronteiras anteriores viraram
secções internas, eventos ou provas — não são objectos soberanos separados.

### 1. Project Contract

**Origem:** Archive + Core (autoria conjunta, persistência única).

**Campos:**
```
project identity
concept
mission
target user
problem
scope
non-goals
principles
rules
workflow
allowed tools
quality gates
definition of done
risk policy
```

Archive regista. Core governa. Mas o artefacto final é **um só**.

### 2. Truth Distillation

**Origem:** Insight.

**Campos:**
```
validated direction
final thesis
strategic decisions
open unknowns
research notes
refusal reasons
risks
confidence
surface seed
terminal seed
```

Este é o primeiro artefacto a ser implementado — Wave 6a.

### 3. Build Specification

**Origem:** Surface.

**Campos:**
```
screens
frames
components
props
states
interactions
data requirements
visual rules
accessibility rules
acceptance criteria
spec-to-code contract
```

Surface deixa de ser "visual bonito" — passa a produzir uma especificação que
Terminal consegue implementar sem ambiguidade.

### 4. Delivery Ledger

**Origem:** Terminal + Surface Final + Archive (consolidação).

**Campos:**
```
patch transactions
files read
files changed
commands run
diff summary
gates
preview verdict
known issues
rollback plan
release state
evidence
assumed context     (ver Decisão 5 / Default 5)
```

Terminal implementa. Surface valida. Archive guarda a prova.

---

## Decisão 2 — Ordem canónica como recomendação, não prisão

A ordem recomendada continua:

```
Archive/Core → Insight → Surface → Terminal → Surface Final → Archive
```

Mas o utilizador pode entrar por qualquer chamber.

### Regra real

A chamber pode operar fora da ordem, mas deve **declarar**:
- O que está a assumir
- O que está em falta
- Quais artefactos ficarão stale como consequência

### Exemplo operacional

Utilizador vai directo ao Terminal:

```
Input: "cria uma página de login"

Terminal não bloqueia automaticamente. Responde:

  Posso executar, mas faltam:
  - Project Contract
  - Truth Distillation
  - Build Specification

  Modo seguro:
  1. criar implementação mínima
  2. marcar assumptions
  3. gerar Delivery Ledger com risco medium/high
  4. pedir validação posterior em Surface/Core
```

### Quando bloqueia mesmo

Bloqueio real só dispara quando:
- acção é destrutiva
- acção muda arquitectura
- acção muda regras do produto
- acção envolve deploy
- acção toca dados sensíveis
- acção contradiz Core
- falta contexto essencial para não quebrar

---

## Decisão 3 — Intent Switch Guard híbrido

Auto-classify barato para baixo risco. Prompt explícito quando há sinal forte.

### Classificação automática

Cada input é classificado como:
```
same_project
project_refinement
new_project
brainstorm
contradiction
unclear
```

### Pergunta explícita obrigatória

Dispara prompt quando detectar:
- novo projecto
- contradição forte
- mudança de público
- mudança de conceito
- mudança de arquitectura
- mudança de regra Core
- risco de contaminar projecto activo
- confiança baixa na classificação

### Prompt padrão

```
Isto parece mudar o contexto actual.

Projecto activo:
{currentProject}

Nova intenção:
{newIntent}

Escolhe:
1. Pausar projecto actual e iniciar novo.
2. Guardar como brainstorm.
3. Aplicar ao projecto actual com retenção em cascata.
4. Cancelar.
```

---

## Decisão 4 — Wave 6a = Truth Distillation

A primeira implementação real é **só** Truth Distillation. Nada mais.

Sem Repo Graph, sem Click-to-Issue, sem engines pesadas, sem DAG completo.

### Wave 6a tem de provar

> Insight consegue transformar conversa confusa em artefacto estruturado,
> versionado, reutilizável e visível pelas outras chambers.

### Schema Truth Distillation (Wave 6a)

```
id
version
status
sourceMissionId
summary
validatedDirection
coreDecisions
unknowns
risks
surfaceSeed
terminalSeed
confidence
createdAt
updatedAt
supersedesVersion
```

### UI mínima

Em Insight:
- botão **Distill Truth**
- painel **Truth Distillation**
- acções: aceitar, refinar, marcar stale, enviar para Surface, enviar para Terminal

Em Surface / Terminal:
- mostrar se existe Truth Distillation activa
- mostrar seeds recebidas
- mostrar aviso se stale

### Definition of Done — Wave 6a

```
1. Insight gera Truth Distillation estruturada.
2. Utilizador pode aceitar ou refinar.
3. A versão aceite fica ligada à missão activa.
4. Surface consegue ler surfaceSeed.
5. Terminal consegue ler terminalSeed.
6. Mudança posterior no Insight cria nova versão, não sobrescreve silenciosamente.
7. Versão antiga fica superseded ou stale.
```

---

## Decisão 5 — Versionamento + failure-mode obrigatórios

Cada artefacto canónico carrega:

```
id
type
version
status
createdAt
updatedAt
createdBy
sourceChamber
dependsOn
supersedes
invalidates
confidence
failureState
```

### Status possíveis

```
draft
review
approved
stale
superseded
invalidated
blocked
failed
```

### Failure modes obrigatórios

Todo handoff pode falhar. Códigos canónicos:

```
missing_context
low_confidence
contradiction
stale_dependency
schema_invalid
tool_unavailable
backend_unreachable
user_rejected
gate_failed
```

### Regra de consumo

> Uma chamber posterior nunca consome artefacto `failed`, `invalidated` ou
> `stale` sem declarar risco.

---

## Engines: rebaixadas para roadmap

Contrato implementável precisa de **4 mecanismos de base** apenas:

```
1. Artifact Store
2. Versioning + Dependency Tracker
3. Intent Switch Guard
4. Handoff State
```

Tudo o resto vai para roadmap posterior:

| Item                     | Quando entra |
| ------------------------ | ------------ |
| Repo Graph               | Wave 7+      |
| Task DAG                 | Wave 7       |
| Patch Transaction        | Wave 7       |
| Spec-to-Code Contract    | Wave 7       |
| Preview Inspector        | Wave 8+      |
| Click-to-Issue           | Wave 8+      |
| DOM-to-component mapping | Wave 9+      |
| Evidence Ledger avançado | Wave 7/8     |

---

## Contrato em prosa

> Signal é uma linha de produção de projecto com memória, chambers
> especializadas e artefactos versionados.
>
> O sistema mantém um projecto activo por vez, permite projectos pausados e
> separa brainstorm de produção.
>
> Archive e Core criam o **Project Contract**. Insight cria a **Truth
> Distillation**. Surface cria a **Build Specification**. Terminal e Surface
> Final criam o **Delivery Ledger**.
>
> A ordem recomendada é Archive/Core → Insight → Surface → Terminal → Surface
> Final, mas o utilizador pode entrar por qualquer chamber. Quando entra fora
> de ordem, o sistema não bloqueia por defeito: declara assumptions, riscos e
> dependências ausentes.
>
> Toda mudança relevante cria nova versão de artefacto. Nada é sobrescrito
> silenciosamente. Quando uma decisão anterior muda, artefactos dependentes
> ficam stale, superseded ou invalidated.
>
> O Intent Switch Guard decide semanticamente se o input pertence ao projecto
> actual, mas pergunta explicitamente quando houver troca de projecto,
> brainstorm, contradição ou risco de contaminação.
>
> A primeira implementação real é Wave 6a: Truth Distillation versionada em
> Insight, consumível por Surface e Terminal.
>
> Sem versionamento, não há cascade revalidation. Sem failure-mode, não há
> handoff confiável. Sem artefactos reduzidos, não há implementação real.

---

## Lock operacional

### O que fica

```
4 artefactos
ordem recomendada (não prisão)
handoff com estado
versionamento obrigatório
failure-mode obrigatório
TruthDistillation como Wave 6a
```

### O que morre por agora

```
12 engines no contrato principal
5 modos de execução
Repo Graph imediato
Click-to-Issue imediato
DOM mapping imediato
pipeline rígido obrigatório
6 artefactos soberanos
```

### Wave seguinte correta

```
Wave 6a — Truth Distillation Versioned Artifact
```

Objectivo único:

> Fazer o Insight gerar uma verdade estruturada, versionada e reutilizável,
> sem quebrar o projecto activo, sem misturar contexto e sem obrigar ainda o
> resto do pipeline a existir completo.

---

## Wave 6a Pre-flight Defaults

> Status: **propostos, aguardam confirmação ou edição**
>
> Estas são respostas concretas a 6 ambiguidades pequenas detectadas durante
> a revisão de V3.1. Nenhuma bloqueia o contrato; todas precisam de decisão
> antes do primeiro PR de Wave 6a. Cada uma tem um default sugerido com
> rationale; o utilizador edita só onde discordar.

### Default 1 — `surfaceSeed` / `terminalSeed` shape

Estruturado mínimo, com `question` obrigatório e `hints` opcional:

```ts
type SurfaceSeed = {
  question: string;
  hints?: {
    designSystemSuggestion?: string;
    screenCountEstimate?: number;
    fidelityHint?: "wireframe" | "hi-fi";
  };
};

type TerminalSeed = {
  task: string;
  hints?: {
    fileTargets?: string[];
    riskLevel?: "low" | "medium" | "high";
    requiresGate?: ("typecheck" | "build" | "test")[];
  };
};
```

**Rationale:** free-text sozinho é fraco; structured-only é prematuro. Híbrido
com obrigatório + opcional dá Wave 6a funcional sem comprometer Wave 6b.

### Default 2 — Motor do Intent Switch Guard auto-classify

Heurística word-overlap simples na v1:
- Tokens normalizados do input vs `Project Contract.concept` activo
- < 30% overlap → `unclear` → dispara prompt explícito
- 30–70% → `same_project` (silencioso)
- 70%+ → `project_refinement`
- Tokens-âncora (`novo projeto`, `outra ideia`, `muda tudo`) → `new_project` força prompt
- LLM-classify só na v2 se a heurística falhar muito

**Rationale:** zero custo runtime, zero latência, suficiente para 80% dos
casos. LLM só quando os dados mostrarem que vale.

### Default 3 — Trigger de cascade staleness por campo

Whitelist explícita por artefacto:

```
Project Contract → triggers stale em downstream se mudar:
  concept | mission | targetUser | nonGoals | principles

Truth Distillation → triggers stale em downstream se mudar:
  validatedDirection | coreDecisions | surfaceSeed | terminalSeed
```

Mudança em campos não-whitelist (`notes`, `risks`, `confidence`) → não dispara
cascade.

**Rationale:** editar `notes` constantemente sem invalidar o pipeline é
sanidade. Whitelist é honesta, simples, auditável.

> Wave 6a não precisa disto (só existe um artefacto), mas a regra fica
> definida desde já para Wave 6b.

### Default 4 — "Marcar stale" como acção dual

Dois caminhos vivos:

- **Sistémico:** versão upstream incrementa em campo whitelist → downstream
  `status: stale` automático
- **Manual:** botão "marcar stale" no painel do artefacto downstream
  (utilizador força)

Em ambos os casos:

```ts
{
  staleSince: ISO_timestamp;
  staleReason: "upstream:projectContract:v3" | "manual";
}
```

**Rationale:** utilizador sabe coisas que o sistema não sabe ("esta direcção
já não me convence"). Manual respeita isso.

### Default 5 — Assumptions tracking no "modo seguro"

Campo `assumedContext` no Delivery Ledger:

```ts
type AssumedDependency = {
  type: "project_contract" | "truth_distillation" | "build_specification";
  missing: boolean;
  riskLevel: "low" | "medium" | "high";
  declaredAt: string;
  declaration: string;   // texto livre: "assumi auth via email/password sem OAuth"
};

type DeliveryLedger = {
  // ... outros campos canónicos
  assumedContext: AssumedDependency[];
};
```

Cada Patch Transaction em modo seguro herda esta lista. Visível no Archive.

**Rationale:** o "modo seguro" sem rasto é mentira. Com rasto é Rubera.

### Default 6 — Multi-mission + Truth Distillation paused

Última `approved` por `missionId` ganha:

- Cada `TruthDistillation` carrega `missionId` no schema
- Quando uma missão é resumida (`paused → active`), o sistema procura:
  1. Última `approved` ligada àquela missão → activa
  2. Sem `approved`, última `draft` → activa em estado draft
  3. Sem nada → seed vazia, Insight começa "in blank"

**Rationale:** comportamento previsível, sem invenção, alinhado com a
doutrina de não inventar contexto.

---

## Histórico de decisões

| Versão | Estado | Notas |
| ------ | ------ | ----- |
| V2     | superseded | manifesto, 22 secções, 6 artefactos |
| V3     | superseded | visão estratégica, 12 engines, 5 modos, comparativo concorrentes |
| V3.1   | **active** | contrato implementável, 4 artefactos, Wave 6a definida |

V3 fica como visão estratégica de longo prazo. V3.1 é o contrato de execução.
