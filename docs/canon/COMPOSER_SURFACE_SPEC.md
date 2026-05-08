# Composer Surface Spec

**Status:** canonical · 2026-05-08 · sessão hora-seria
**Resolves:** [#315](https://github.com/Ivan-dias99/Aiinterfaceshelldesign/issues/315)

This is the source of truth for the Composer surface. It documents what
exists today, not what was once planned.

---

## Doutrina

> The Composer is not a page. The Composer is not a dashboard. The
> Composer is not the Control Center. The Composer is the cursor-adjacent
> command surface.

A camada de inteligência na ponta do cursor. O utilizador aponta, diz o
que quer, executa onde já está.

## Canónica

| Surface | Path | Papel |
|---|---|---|
| **Composer** | `packages/composer/src/` | O *carro*. Single Capsule + Pill + ComposerClient partilhados. |
| **Browser-extension shell** | `apps/browser-extension/` | Chassis A — content-script + service worker. |
| **Desktop shell (Tauri)** | `apps/desktop/` | Chassis B — janela transparente + tray icon. |
| **Control Center** | `control-center/` | A *garagem*. Configuração, histórico, diagnostics. **Nunca compete com o Composer.** |
| **Backend FastAPI** | `backend/` | O *maestro*. Routing multimodelo, tools, memory, ledger. |

> Lente 2 (CLAUDE.md): "Uma só implementação partilhada por todos os
> shells. Divergência visual ou funcional entre shells é regressão."

## Paridade visual entre shells

Verificada em `2026-05-08`. Ambos os shells apresentam:

```
GAUNTLET                                            ⋯  ESC
cursor · capsule
[ • PROVIDER ] [Page Title]                  [claude-sonnet-4-6] [RE-READ]
SELECTION none      PAGE CAPTURED yes      DOM CAPTURED 47       SCREENSHOT on

Input: ___________________________________________________________________
       (placeholder: "O que queres? / abre comandos · Enter envia · Shift+Enter nova linha")

[↩] [⌘K]    [ANEXAR]    [ECRÃ]    [VOZ]                      [ENVIAR]

PLANO/RESPOSTA · model · latency
content
[Copy] [Save]
```

O que **não** aparece (removido por doutrina):

- Chip `{ambient.shell}` ('desktop'/'browser') — entregava o shell.
- URL placeholder `desktop://capsule` ou `desktop://unknown` — exposição
  de implementação.
- Botão SHELL no row — só desktop tinha; agora é só `/shell` no slash
  command (continuou em desktop, ausente na web — invisível na main row).
- Janela popup standalone `composer.html` — eliminada totalmente
  (ver CHANGELOG `Unreleased` 2026-05-08).

## Pill

Pequena bolinha ember a respirar perto do cursor. Estado visual:

- **idle** — gradiente ember + halo difuso (3.2s breathe loop).
- **active** — pulsa uma vez forte (~1.3× scale com onda 8px).
- **online** — backend respondeu healthz nos últimos 5s.
- **offline** — backend não responde.

Browser pill: ancora com ofset ao cursor, segue movimento por hover.
Desktop pill: ancora canto inferior direito (220×56 window, transparent,
alwaysOnTop, skipTaskbar).

## Capsule

| Parâmetro | Valor |
|---|---|
| Width | clamp(700px, 90vw, 900px) |
| Max-height | clamp(420px, 80vh, 580px) |
| Layout | dois painéis (left = context · right = compose/result) |
| Mount | shadow DOM (browser) · transparent Tauri window (desktop) |
| Theme | `data-theme="light"` (cream) default · `data-theme="dark"` opt-in |
| Acento | ember `#d07a5a` · peach dot `#f4c4ad` |
| Animation | rise 360ms cubic-spring + aurora drift 200ms delay |

Layout NÃO é dashboard. Não cresce a página. Scroll interno em conteúdo
longo.

## State Machine

```ts
type ComposerPhase =
  | 'idle'
  | 'planning'    // request sent, no deltas
  | 'streaming'   // first delta arrived
  | 'plan_ready'  // `done` event, plan visible
  | 'executing'   // operator approved DOM actions running
  | 'executed'    // results in
  | 'error';
```

Transições:

```
idle → planning → streaming → plan_ready
                              ↓
                              ↓ (operator approves)
                              ↓
                            executing → executed
                              ↓
                            (rejected)
                              ↓
                            plan_ready
```

Qualquer estado pode falhar → `error` com mensagem visível.

## Labels canónicos

```
Enviar
Resposta
Plano
Executar
Executar com cuidado
Executado
Anexar
Ecrã
Voz
Copy
Save
Re-read
Erro
```

**Não** usar (variantes que dispersam linguagem):

- ~~Compor~~ ~~Acionar~~ ~~Submit~~ ~~Run~~ ~~Magic~~ ~~Assistant~~
  ~~Preview~~ (em vez de RESPOSTA)

## Context formatting

Painel esquerdo. Context strip mostra como **chips/badges**, não como
parágrafos:

| Chip | Quando aparece | Exemplo |
|---|---|---|
| URL / pageTitle | Quando há contexto real | `Wikipedia · Lisbon` ou `https://...` |
| `claude-sonnet-4-6` | Modelo activo (echo da gateway) | sempre |
| `RE-READ` | Botão para re-capturar contexto | sempre |
| `SELECTION` | Carácteres seleccionados | `none` ou `42 chars` |
| `PAGE CAPTURED` | Texto da página | `yes` / `no` |
| `DOM CAPTURED` | Skeleton elements | `47` ou `—` |
| `SCREENSHOT` | Screenshot anexado auto | `on` / `off` |

Selected text como card legível, line-breaks preservados. Mono fonte
**só** quando conteúdo parece código. Truncação com fade.

DOM skeleton **nunca** aparece raw na UI principal. Só vai no prompt.

## Preview / Result

Painel direito. Quatro layouts distintos:

### A. Resposta texto (caso B do dom_plan)

```
RESPOSTA · claude-sonnet-4-6 · 568ms

<conteúdo>

[Copy] [Save] [Guardar como…]
```

### B. Plano de DOM actions (caso A)

```
PLANO · 2 actions · claude-sonnet-4-6 · 563ms

1. fill input[name="search_query"] = "Sertanejo"
2. click button.ytSearchboxComponentSearchButton            [SENSÍVEL]

[Executar]   [Executar com cuidado]
```

Acções marcadas `SENSÍVEL` requerem o checkbox **"Confirmo, executar
mesmo assim"** antes de Executar com cuidado se activar.

### C. Acção sensível (alarme)

```
⚠️ ACÇÕES SENSÍVEIS NO PLANO
  · submit button

[ ] Confirmo, executar mesmo assim.

[Executar com cuidado]
```

### D. Resultado de execução

```
RESULTADO · 2 ok · 1 falhou

step 1 ✓ fill executed
step 2 ✓ click executed
step 3 ✕ selector not found
```

Falhas, rejections, e erros genéricos têm cores distintas (verde ✓ /
vermelho ✕ / cinza para abortado).

## Capabilities matrix (paridade implementada)

| Capability | Browser | Desktop | Implementação |
|---|---|---|---|
| `domExecution` | ✅ | ❌ | apenas faz sentido em DOM |
| `screenshot` | ✅ | ✅ | tab-capture · capture_screen |
| `screenCapture` | ✅ | ✅ | mesma shape `{base64, path}` |
| `filesystemRead` | ✅ | ✅ | File API · Tauri filesystem |
| `filesystemWrite` | ❌ | ✅ | desktop only (security) |
| `voice` | ✅ | ✅ | Web Speech API |
| `remoteVoice` | ✅ | ✅ | backend `/voice/transcribe` |
| `streaming` | ✅ | ✅ | SSE · ReadableStream |
| `shellExecute` | ❌ | ✅ | desktop only · allowlist |
| `notifications` | ❌ | ✅ | tauri-plugin-notification |

> Onde a capability **falta**, o botão correspondente **não aparece** —
> a row visual fica idêntica em ambos os shells (`ANEXAR · ECRÃ · VOZ ·
> ENVIAR`). SHELL acessível só via `/shell` slash command no desktop.

## Control Center limitations

Control Center **pode**:

- Configurar settings (model defaults, screenshot defaults, max chars).
- Inspeccionar runs (Ledger).
- Ver permissões e revogar.
- Mostrar memory records.
- Ver diagnostics da gateway.

Control Center **não pode**:

- Tornar-se a interface principal.
- Replicar o cápsula como dashboard.
- Iniciar conversas.
- Substituir o composer.

Se uma feature parece "tem de ir para o Control Center", primeiro
avalia: pode entrar no Composer denso? Se sim, vai para lá. CC só
recebe diagnostics e settings que não cabem perto do cursor.

## Composer denso, backend gordo

⚠️ Doutrina actualizada 2026-05-07 (CLAUDE.md lente 2).

O Composer **não é** mínimo. É **denso, viciante, sofisticado** — com
todos os connectors, plugins, tools, commands, skills embutidos.
Inteligência na ponta do dedo.

Backend continua gordo: model routing, tools server-side, memória,
segurança, ledger.

Composer é a interface densa que **expõe tudo** isso na ponta do cursor.

## Future shared UI extraction

`packages/composer/` já é o package partilhado. Ambos os shells
importam de lá via vite alias `@gauntlet/composer`.

**Não** criar novos `packages/*-ui` separados a menos que haja um
terceiro shell real a consumir (mobile app? VS Code extension?). Até
lá, `packages/composer/` é onde tudo vive.

Se extracção for necessária no futuro, extrair só:

- `Pill`
- `Capsule` shell
- Phase machine
- Context card
- Preview renderer
- Danger gate
- Result renderer
- Tokens (`tokens.css`)

NÃO extrair: backend calls, browser-only DOM execution, extension-specific
APIs. Esses ficam nos shells.

## Provider precedence (engine.py · 2026-05-08)

```
MOCK > Groq > Anthropic > Gemini > error
        ↑       paused      paused
     primary
```

- **Groq** (Llama 3.3-70b / gpt-oss-120b): primário, free tier, latência
  sub-segundo, streaming SSE.
- **Anthropic**: pausado por custo. Compatível, opt-in via
  `ANTHROPIC_API_KEY` sem `GAUNTLET_GROQ_API_KEY`.
- **Gemini**: pausado, segundo fallback opcional.
- **MOCK**: sempre vence quando `GAUNTLET_MOCK=1`.

## Histórico de convergência (commits)

Esta spec foi cristalizada nos seguintes commits da branch `hora-seria`:

| Commit | O que ficou |
|---|---|
| `b94253c` | backend default port 3002 (CSP alinhada) |
| `8c9cd09` | icon.ico Windows + assets multi-resolução |
| `4b86a84` | composer-client DEV_BACKEND + CORS Tauri |
| `6d853b8` | extension lifeboat removido em URLs restritas |
| `ce9ef5a` | onboarding ancora dentro da cápsula |
| `6d6e132` | shell chip + URL placeholder removidos |
| `ac20b75` | dead state cleanup (context-pop pulse) |
| `946f5d4` | CORS aceita localhost:port (Tauri dev Vite) |
| `28b739d` | .gitattributes (CRLF flapping morto) |
| `4f8b446` | mock devolve JSON válido para dom_plan |
| `9fbb619` | Groq primário; Anthropic+Gemini em pausa |
| `7b87c9a` | Groq stream() + erros legíveis na cápsula |
| `fa3e796` | paridade visual completa entre shells (Fase 5) |

---

**Esta spec é viva.** Quando algo na cápsula divergir disto, ou se actualiza
a spec ou se corrige o código.
