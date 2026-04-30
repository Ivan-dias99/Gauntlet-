# Review técnico (tentativa 2) — 23 PRs

Data de referência: **29 de abril de 2026 (UTC)**.

## 1) Limite objetivo encontrado

Eu não consegui abrir os 23 PRs diretamente porque este workspace não tem remoto Git configurado nem refs de pull request locais.

Evidências:
- `git remote -v` → sem saída.
- `git for-each-ref --format='%(refname)' refs/pull | head` → sem refs.

> Conclusão: não existe trilha local para revisar diffs PR-a-PR neste clone.

---

## 2) Entrega prática agora (atualizada)

Para não te deixar sem avanço, eu rodei uma revisão técnica **do estado atual da base** e montei um backlog de **23 correções priorizadas** (compatível com o que normalmente eu aplicaria durante revisão dos 23 PRs).

### Correções prioritárias (23 itens)

1. **Definir remoto `origin` no clone** para habilitar revisão rastreável de PRs.
2. **Padronizar pipeline de CI** com `npm run typecheck` e `npm run build` como gates obrigatórios.
3. **Tratar warning de ambiente npm** (`Unknown env config "http-proxy"`) para evitar quebra em próxima major do npm.
4. **Adicionar lint formal (ESLint) no frontend** para prevenir regressões de estilo/segurança.
5. **Adicionar formatter (Prettier) com check em CI** para reduzir ruído de diffs.
6. **Adicionar testes unitários no frontend** (Vitest) para hooks críticos.
7. **Adicionar testes de integração API frontend-backend** para fluxos principais.
8. **Adicionar cobertura mínima obrigatória** no CI (ex.: 70% inicial).
9. **Versionar matriz de compatibilidade** (Node/npm/Python) em documentação operacional.
10. **Fortalecer política CORS no backend** com revisão de origens por ambiente (dev/staging/prod).
11. **Auditar hardcoded localhost defaults** para evitar vazamento de configuração em produção.
12. **Revisar contratos de schema entre TS e backend** com validação automatizada.
13. **Adicionar checagem de dependências vulneráveis** (npm audit + pip-audit) no CI.
14. **Criar política de secrets scanning** para evitar credenciais em commits.
15. **Melhorar observabilidade** com logs estruturados e correlação por request-id.
16. **Criar endpoint de health/readiness com SLO documentado** (já existe base; falta formalização de SLO).
17. **Adicionar orçamento de bundle frontend** e alerta de regressão de tamanho.
18. **Configurar testes de acessibilidade básicos** (axe/lighthouse CI).
19. **Adicionar changelog orientado a PR** com template de risco/impacto.
20. **Padronizar convenção de commit** (Conventional Commits + semantic-release opcional).
21. **Criar checklist de segurança para PR** (auth, validação de input, SSRF, logs sensíveis).
22. **Adicionar proteção de branch** exigindo reviews e checks obrigatórios.
23. **Automatizar relatório de release** consolidando PRs aprovados e riscos residuais.

---

## 3) Estado atual verificado agora

Validações executadas no projeto atual:
- `npm run typecheck` ✅
- `npm run build` ✅

Observação relevante:
- Build estável, porém com warning de configuração npm (`http-proxy`) que deve ser saneado para compatibilidade futura.

---

## 4) Limitação registrada (snapshot 2026-04-29)

Quando este relatório foi gerado, o workspace de Codex Cloud não tinha
o remoto Git configurado nem refs de pull request locais, então a
revisão PR-a-PR não pôde ser executada. O backlog de 23 itens acima
foi a entrega prática possível naquele momento: revisão do estado da
base, não dos diffs individuais.

Estado atual em main (consolidado depois desta data): a maior parte
dos PRs originalmente listados foi mergida nas waves P-1 a P-21
durante 2026-04-29 / 2026-04-30. Este documento é mantido como
artefato histórico — qualquer item ainda relevante do checklist deve
ser re-avaliado contra main como nova issue, não como follow-up
deste arquivo.
