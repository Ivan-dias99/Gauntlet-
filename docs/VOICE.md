# Voice — guia único de copywriting do Signal

Este documento é a fonte canónica para qualquer string visível ao utilizador
no produto. Se uma chamber, painel, lente ou estado vazio escrever copy nova,
tem de bater com o que está aqui. Se entrar em conflito, este guia ganha.

Aplica-se a:

- `src/i18n/copy.ts` (PT canonical, EN espelho).
- Strings inline em `src/chambers/`, `src/shell/`, `src/spine/`.
- `placeholder=""`, `aria-label=""`, `title=""`, texto literal em JSX.
- Mensagens de erro renderizadas a partir de `BackendError.message`.

## 1. Identidade

> Operador, não consumidor.

Quem lê o produto está a executar — não a navegar marketing. A copy fala como
um terminal: factual, presente, sem cerimónia. Nunca celebra, nunca pede
desculpa. Não promete nada que o backend não tenha realmente devolvido.

A regra-mestra herdada da doutrina:

> Recusar antes de adivinhar.

Se uma string sugere certeza onde só há incerteza, está errada.

## 2. Tempo verbal

Presente factual. O estado é o que é, agora.

| Errado                          | Certo                       |
|---------------------------------|-----------------------------|
| `Spine foi carregado`           | `spine carregado`           |
| `O plano vai ser gerado em breve` | `plano por gerar`         |
| `Successfully saved!`           | `guardado`                  |
| `Run completed successfully`    | `run · selada`              |

Particípio ou nominalização — nunca passado composto, nunca futuro
promissório.

## 3. Verbos

Imperativos curtos. Um verbo por botão.

| Errado                                    | Certo            |
|-------------------------------------------|------------------|
| `Click here to open the panel`            | `abrir painel`   |
| `Please wait while we load your data`     | (skeleton)       |
| `Press this button to start the analysis` | `correr`         |
| `Are you sure you want to continue?`      | `confirmar?`     |

Lista canónica dos verbos preferidos:

`abrir`, `fechar`, `correr`, `parar`, `pausar`, `retomar`, `selar`, `recusar`,
`validar`, `gerar`, `descartar`, `anexar`, `confirmar`, `cancelar`, `editar`,
`reabrir`, `bloquear`, `desbloquear`, `inscrever`, `arquivar`, `repetir`.

Em EN o equivalente é também imperativo: `open`, `close`, `run`, `stop`,
`pause`, `resume`, `seal`, `refuse`, `validate`, `generate`, `dismiss`,
`attach`, `confirm`, `cancel`, `edit`, `reopen`, `block`, `unblock`,
`inscribe`, `archive`, `retry`.

## 4. Banidos

Não escreve, em copy nenhuma:

- Emoji decorativo: `🚀`, `🔥`, `✨`, `🎉`, `🎊`, `🥳`, `💥`, `👏`, `💯`,
  `🙌`, `❤️`, `😀`, `😎`.
- Pontos de exclamação: `!`, `!!`, `!!!`. Mesmo um único `!` no fim de uma
  frase é proibido — quebra o registo factual.
- Marcadores de afecto: `oops`, `yay`, `ouch`, `hooray`, `awesome`, `cool`,
  `nice`, `oh no`.
- Educação ornamental: `please`, `por favor`, `kindly`, `thank you`,
  `thanks`, `obrigado`.
- Espera animada: `Loading...`, `Loading…`, `Please wait`, `One moment`,
  `Hang on`, `Just a sec`, `Aguarda…`.
- "Click here", "Press here", "Tap to". O botão diz o que faz; o resto é
  ruído.
- Auto-elogio do sistema: `successfully`, `done correctly`, `everything
  worked`, `tudo certo`.

Se precisares de uma destas formas, o problema é o estado da UI, não a copy.
Substitui por:

- `Loading…` → componente skeleton sem texto, ou kicker `a carregar` (sem
  reticências animadas, sem `please`).
- `Please wait` → skeleton.
- `Successfully saved!` → `guardado` ou pill `selado`.
- `Are you sure?` → `confirmar?` + botões `confirmar` / `cancelar`.
- `Oops, something went wrong` → `erro` + envelope tipado da `BackendError`.

## 5. Permitidos

Glifos e marcadores semânticos com função clara:

- `✅` `⚠` `❌` — estados verde / aviso / erro em pills e ribbons.
- `🟡` `🔴` — estados intermediários, idem.
- `—` — em-dash para kickers (`— em repouso`).
- `→` — encadeamento (`triad → judge → verdict`).
- `·` — separador interno (`mock · canned plan`).
- `✓` `✕` — confirmar / dispensar em chips e botões compactos.
- `◆` `◉` `▸` `≡` `↑` `↻` `❚❚` `▶` — usados na shell como ícones tipográficos
  já estabelecidos. Não inventar novos sem justificação.

Tudo isto é semântico; nunca decorativo.

## 6. Comprimento

| Local                       | Limite                     |
|-----------------------------|----------------------------|
| Botão                       | 1–3 palavras               |
| Placeholder                 | 1 frase curta              |
| Mensagem de erro            | 1 frase                    |
| Kicker (caps tracking)      | 2–4 palavras               |
| Body de empty state         | máximo 2 frases            |
| Tooltip / `title`           | 1 frase                    |

Nunca dois pontos no fim de uma frase de UI. Nunca duas frases num botão.
Se a frase precisa de explicar mais, é um caso de `EmptyState` ou painel —
não de label.

## 7. Idioma

- `pt-PT` é o canon. Cada string nova tem de existir primeiro em PT.
- EN é espelho directo, mantido em paralelo em `copy.ts`.
- Termos técnicos do produto não traduzem: `spine`, `triad`, `judge`,
  `chamber`, `mission`, `run`, `provider`, `mock`, `live`, `seal`, `gate`.
- Nomes próprios de chambers ficam em capital inicial: `Insight`, `Surface`,
  `Terminal`, `Archive`, `Core`. Tudo o resto vai em minúsculas.
- Se o utilizador alternar idioma em Core › System, todo o produto espelha.
  Não há strings hardcoded a contornar `useCopy()`.

## 8. Maiúsculas

Minúsculas por defeito. Apenas levam capital:

- Nomes próprios das chambers e do produto (`Signal`).
- Início de frase em mensagens longas (empty body, dormant panels).
- Kickers em caps com letter-spacing (`— INSIGHT`, `— POLICIES`) — apenas
  os já estabelecidos no design system.

Tudo o resto — labels, pills, botões, tabs — é minúsculo.

## 9. Pontuação

- Ponto final em frases completas (empty body, dormant copy).
- Sem ponto final em pills, kickers, labels, botões, tabs.
- Sem ponto de exclamação.
- Reticências `…` apenas para indicar continuação real
  (`a carregar ledger desta missão…`). Nunca como afecto (`espera!…`).

## 10. Erros (envelopes do backend)

Quando uma `BackendError.message` chega ao frontend:

1. Se há código tipado (`SURFACE_DESIGN_SYSTEM_REQUIRED`,
   `SURFACE_PROVIDER`, etc.) → mapeia para um valor em `copy.ts`
   (`surfaceErrDesignSystemRequired`, `surfaceErrProvider`, ...).
2. Se não há código → renderiza o `message` cru. O backend é dono do tom;
   este guia só rege a tradução.
3. Nunca injectes "Oops", "Sorry", "Please try again". O `ErrorPanel` já
   diz o severity em kicker (`— crítico`, `— aviso`, `— info`).

## 11. Empty states

Coordenado com a wave que dá a primitive `EmptyState` (P-36).
Cada empty state tem três partes:

- `kicker` — `— em repouso` ou similar (caps tracking, lowercase com em-dash).
- `body` — italic serif, 1–2 frases factuais.
- `hint` — mono micro-copy opcional, 1 frase imperativa.

Sem glifos decorativos. O glyph existe na primitive; usa-se com parcimónia
para estados liminares (`◇` como marca de proveniência ausente, por exemplo).

## 12. Lint

`scripts/check-voice.mjs` faz grep dos termos banidos em `src/`. Corre como:

```sh
node scripts/check-voice.mjs
```

ou via npm:

```sh
npm run check:voice
```

Sai com código 1 em qualquer hit. CI deve falhar antes de qualquer string
banida chegar a produção.

## 13. Revisão

Qualquer PR que introduza copy nova precisa, no mínimo, de:

1. PT em `copy.ts` (chave nova ou valor revisto).
2. EN espelho em `copy.ts`.
3. `node scripts/check-voice.mjs` limpo.
4. `npx tsc --noEmit` limpo.
5. Visualizar o resultado na UI antes de pedir review.

A doutrina é a mesma: o produto não inventa estado. A copy também não.
