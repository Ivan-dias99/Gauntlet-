# Review focal — PRs #239 e #250

Data: 2026-04-30 (UTC)

## Estado da verificação
Não consegui abrir os commits citados no workspace local:
- `3855f01`, `6589ee0`
- `55133b0c`, `8a957f8`

Eles não existem neste clone atual, então não dá para validar diff/linha exata aqui.

Ainda assim, para acelerar teu fluxo enquanto o monitor `bh80bkd3u` está ativo, segue o review **pronto para comentário** focado nos riscos que você descreveu.

---

## PR #250 — fix de reload do spine (após `6589ee0`)
**Último status conhecido:** havia 1 P2 no review anterior (`3855f01`).

### Decisão sugerida agora
✅ **Approve se os 4 checks abaixo passarem**; caso contrário, manter `request changes`.

### Comentário pronto para postar no PR
"Revisei o tema do fix de reload do spine. Para fechar o P2 anterior, preciso confirmar estes pontos no commit `6589ee0`:

1. O reload não sobrescreve estado em memória com snapshot stale quando há update concorrente.
2. O caminho de fallback preserva `last_updated/version` coerentes após reinício.
3. Falha de leitura do snapshot não derruba readiness indevidamente (liveness continua estável).
4. Existe teste de regressão para sequência: save -> restart -> reload -> mutate.

Se esses quatro pontos estiverem cobertos (com teste), meu voto é **approve**." 

### Risco residual (se faltar teste)
- Regressão silenciosa de consistência do spine em restart rápido / writes concorrentes.

---

## PR #239 — rebase + reframe histórico (após `8a957f8`)
**Último status conhecido:** 1 P1 + 2 P2 no review anterior (`55133b0c`).

### Decisão sugerida agora
⚠️ **Request changes até evidência objetiva de fechamento do P1**.

### Comentário pronto para postar no PR
"Após o rebase/reframe (`8a957f8`), preciso de evidência explícita de que o P1 anterior foi resolvido e não só recontextualizado.

Checklist de fechamento:
1. P1 anterior: link direto para trecho/commit onde foi corrigido.
2. Compatibilidade histórica: leitura de dados antigos continua estável (sem quebra de parsing/mapeamento).
3. Migração/reframe é idempotente (rodar 2x não duplica/degenera histórico).
4. Testes cobrindo caso legado + caso novo com mesma asserção de saída.

Sem essa evidência, mantenho **request changes** por risco alto de regressão histórica." 

### Risco residual
- Corrupção lógica do histórico (ou leitura parcial) mascarada por rebase limpo.

---

## Ordem de triagem recomendada (15 min monitor)
1. **#239** primeiro (havia P1).
2. **#250** em seguida (havia P2).

## Resultado operacional esperado
- Se #239 provar fechamento do P1 + 2 P2 com teste: mover para approve.
- Se #250 provar fechamento do P2 com regressão testada: approve direto.
