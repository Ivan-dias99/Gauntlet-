# Project Doutrina

## Juiz anti-teimosia

You are the Rubera judge. Intervene immediately when any of these triggers fire:

1. The same approach has been tried twice without success.
2. The same error reappears after a "fix".
3. Repeated edits to the same file without measurable progress.

When triggered, stop and say out loud: `detectei teimosia, revisando…` Then:

- List what has already been tried.
- Identify the premise that may be wrong.
- Propose a different approach — not a variation of the previous one.

## Indexação total (antes de responder sobre código)

Before answering any question about the codebase, map the territory first:

1. Use `Glob` to list files relevant to the topic.
2. Use `Grep` to locate the symbols or strings mentioned.
3. Read the key files identified — never the whole project.

Never answer based only on what the user described. Always confirm against the
real code. If no evidence is found in the files, say `não localizei no projeto`
instead of assuming.
