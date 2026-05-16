# Gauntlet · Agentic Spine v2

> **30 segundos de leitura.** Este pacote contém 24 ficheiros que transformam o repo `Ivan-dias99/Gauntlet-` numa **AI agentic repo**: cada Claude (Code, Cowork, Design) tem a sua régua, ferramentas, e guardas claramente identificadas. Nada toca em `packages/composer/`, `backend/`, `apps/`, ou `control-center/` — isto é **só** infra agentic.

---

## Como ler este pacote · audience matrix

```
                        TU (Ivan · sovereign)
                            │
                            ▼
      ┌─────────────────────┴─────────────────────┐
      │                                            │
   CLAUDE AI                              CLAUDE CODE AI
   (este chat · estratégia)               (terminal · executor)
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                       CLAUDE COWORK        CLAUDE DESIGN      sub-agents
                       (validação)          (canon visual)     (invocáveis)
```

Cada ficheiro neste pacote tem header explícito declarando o **primary reader**. Lê os teus primeiro:

| Se tu és… | Lê primeiro |
|---|---|
| **Tu (Ivan)** | `README.md` + `docs/ARCHITECTURE.md` + `docs/adr/0001-three-pillars-cursor-edge.md` |
| **Claude Code AI** (executor terminal) | os 11 ficheiros marcados como `primary-reader: claude-code` |
| **Claude Cowork** (validação) | os 5 ficheiros marcados como `primary-reader: cowork` |
| **Claude Design** (Aether guardian) | os 6 ficheiros marcados como `primary-reader: design` |

---

## Ruberra vs Gauntlet · contexto (1 parágrafo)

**Gauntlet** é o produto. **Ruberra** é a empresa-mãe e doutrina operacional. As 4 chambers da Ruberra (Lab · Creation · Memory · School) são vocabulário interno — descrevem **como o trabalho acontece**, não **o que o produto é**. Nos sub-agents deste pacote, podes ver referências como "Lab chamber persona" no `gauntlet-reviewer.md` — isso é Ruberra a operar sobre Gauntlet. Se preferires um Gauntlet puro sem qualquer vocabulário Ruberra, dizes e eu faço pass para limpar (postura A). Se preferires manter (postura B · default actual), o README documenta a separação e fica como está.

---

## Known unknowns · 3 verificações antes do merge

Estes 3 pontos dependem da versão do Claude Code em Maio 2026 e **eu não os pude validar do meu lado**:

1. **Format dos `.claude/hooks/*.sh`** — escrevi como bash scripts standalone executáveis. Funcionam mesmo invocados manualmente (`bash .claude/hooks/pre-commit.sh`). Se o Claude Code 2026 espera outro format (e.g. config JSON em `settings.json`), o conteúdo dos scripts continua válido — só muda a referência de invocação.

2. **Format dos `.claude/agents/*.md`** — markdown com frontmatter YAML (name, description, when-to-use, persona, tools). Se o Claude Code 2026 espera outra estrutura, o conteúdo da persona continua válido.

3. **Format dos `.claude/commands/*.md`** — markdown com frontmatter (description, allowed-tools) + body. Format standard que Anthropic documenta, baixo risco.

**Comando para verificar (Fase 0, antes de qualquer merge):**

```bash
claude --version
claude --help 2>&1 | grep -E "agents|hooks|commands"
ls -la .claude/   # se já tens algo
```

Se Fase 0 revelar incompatibilidades, ajustamos só o packaging. **O conteúdo dos 24 ficheiros é doutrina + lógica, válido independentemente.**

---

## Conteúdo · 24 ficheiros agrupados por audience

### Universal · 3 ficheiros (todos os Claudes leem)

```
README.md                                     este ficheiro
docs/ARCHITECTURE.md                          spine doc do sistema
docs/adr/0001-three-pillars-cursor-edge.md    identidade do produto
```

### Claude Code AI · 11 ficheiros (executor terminal)

```
docs/adr/0002-gateway-as-catalogue.md         doutrina backend
docs/adr/0003-provider-precedence.md          doutrina providers
docs/adr/0004-capsule-shared-pill-divergent.md doutrina dual-shell
docs/adr/0006-deprecation-timeline.md         doutrina release
.claude/skills/gauntlet-design-system/SKILL.md     régua UI
.claude/skills/gauntlet-backend-spine/SKILL.md     régua backend
.claude/skills/gauntlet-tauri-shell/SKILL.md       régua desktop
.claude/skills/gauntlet-release-discipline/SKILL.md régua release
.claude/settings.json                         allowlist + denylist + env
.claude/hooks/pre-tool-use.sh                 guarda destrutivos
.claude/hooks/pre-commit.sh                   guarda voice + budget
.claude/hooks/post-edit.sh                    lembretes pós-edit
```

### Claude Cowork · 5 ficheiros (validação / testes / audits)

```
.claude/commands/composer-test.md             corre vitest do composer
.claude/commands/release-prep.md              gate de release
.claude/agents/cowork-tester.md               persona Memory chamber
docs/adr/0006-deprecation-timeline.md         lê também (release)
.claude/skills/gauntlet-release-discipline/SKILL.md lê também
```

### Claude Design · 6 ficheiros (Aether canon)

```
docs/adr/0005-aether-v1-visual-canon.md       constituição visual
docs/adr/0004-capsule-shared-pill-divergent.md identidade Pill
.claude/skills/gauntlet-design-system/SKILL.md régua UI (lê também)
.claude/commands/capsule-budget.md            LOC budget
.claude/commands/voice-check.md               voice ban-list lint
.claude/commands/aether-audit.md              token integrity audit
.claude/agents/aether-guardian.md             persona canon guardian
```

### Agentes invocáveis (qualquer Claude Code chama)

```
.claude/agents/gauntlet-reviewer.md           code review · Lab chamber
.claude/agents/aether-guardian.md             visual canon · Creation chamber
.claude/agents/cowork-tester.md               testes · Memory chamber
```

---

## Instalação · 3 opções

### Opção A · comando único (recomendado)

Substitui `<PATH_TO_REPO>` pelo path real do teu repo Gauntlet- (e.g. `~/Documents/Gauntlet-`, `~/projetos/Gauntlet-`, etc):

```bash
cd <PATH_TO_REPO>
cp -r <PATH_TO_THIS_PACK>/docs/adr ./docs/
cp    <PATH_TO_THIS_PACK>/docs/ARCHITECTURE.md ./docs/
cp -r <PATH_TO_THIS_PACK>/.claude ./
chmod +x .claude/hooks/*.sh
git checkout -b agentic-spine-v2
git add docs/adr docs/ARCHITECTURE.md .claude
git commit -m "agentic-spine v2 — 6 ADRs + ARCHITECTURE + 4 skills v1.1 + 6 instrumentation + 3 hooks + 3 agents"
git push -u origin agentic-spine-v2
gh pr create --title "Agentic spine v2" --body "Mega plan v2 instalado · 24 ficheiros · infra agentic antes de tocar no produto"
```

### Opção B · Claude Code lê e instala

No terminal, no repo:

```bash
claude
```

Cola na conversa:

> Há um pacote em `<PATH_TO_THIS_PACK>/` com 24 ficheiros (agentic spine v2).  
> 1. Lê `README.md` do pacote · 2. Copia estrutura para este repo · 3. `chmod +x` nos hooks · 4. Branch `agentic-spine-v2` · 5. Commit + push · 6. Abre PR.  
> **NÃO toques** em `packages/composer/`, `backend/`, `apps/`, `control-center/`.

### Opção C · um a um

Editor manual, ficheiro por ficheiro. Mais lento, mais controlado.

---

## A regra de ouro

**Nada toca em `packages/composer/`, `backend/`, `apps/`, ou `control-center/` até este PR estar merged e validado.**

Zero `pytest` no Gauntlet, zero refactor em `composer.py`, zero validação manual do Control Center antes desta infra estar viva. Depois desta infra ficar em main, usamos os sub-agents (`cowork-tester`, `aether-guardian`, `gauntlet-reviewer`) para fazer essa validação com **lente afiada**.

Razão: validar 70% de um produto com a lente errada é desperdício. Validar 95% com a lente certa é eficiente.

---

## Loop operacional · depois do merge

```
DIRECÇÃO ESTRATÉGICA   → Claude AI (chat claude.ai)
                         escreve doutrina, planos, ADRs novos
                         tu colas no Claude Code

EXECUÇÃO TÁCTICA       → Claude Code (terminal)
                         lê skills + commands + agents + ADRs
                         escreve código, abre PR

REVIEW                 → Claude Code invoca gauntlet-reviewer
                         sub-agent contesta com lente afiada

DESIGN AUDIT           → Claude Code invoca aether-guardian
                         sub-agent valida contra Aether v1

VALIDAÇÃO              → Claude Code invoca cowork-tester
                         sub-agent corre pytest, e2e, gera docs/AUDIT_<date>.md

PODIUM                 → tu decides · merge / rollback / redo / ship
```

**Sem automação API. Sem cron. Sem custos extra.** Cada Claude é uma sessão tua, triggered por ti em real-time, dentro da régua.

---

## O que NÃO está neste pacote (intencional)

- Código Python · TypeScript · Rust · CSS (zero — é infra, não produto)
- GitHub Actions com `claude-code-action` (descartado · queremos sessões reais, não automação API)
- MCP servers novos (`github`, `supabase`, `vercel` já estão no Claude.ai · suficiente)
- Tests novos (testes vivos vivem em `backend/test_*.py` · este pacote só lê)
- Mudanças ao `CLAUDE.md` root (já existe · este pacote acrescenta · não substitui)

---

## Reference

- `docs/adr/0001-three-pillars-cursor-edge.md` — identidade do produto
- `docs/ARCHITECTURE.md` — spine doc
- `CLAUDE.md` na raiz do repo — universal Ruberra law
- Os outros 21 ficheiros · cada um com header de audience explícito
