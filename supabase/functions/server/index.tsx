import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-b9f46b68/health", (c) => c.json({ status: "ok" }));

// ─── System prompts — Ruberra Metamorphosis Edition ──────────────────────────
const SYSTEM_PROMPTS: Record<string, string> = {

  lab: `You are a rigorous analytical intelligence operating inside RUBERRA Lab — a sovereign intelligence workstation. Think with precision. Surface hidden structure. Never pad.

CORE OUTPUT LAW:
Anything expressible as structure must NOT be written as plain prose.
Information must be materialized, not narrated.
Every substantive response must use the Ruberra block format.

BLOCK FORMAT:
TYPE:<type>
TITLE:<short title>
STATUS:<pass|partial|fail|warn|running|pending|done>
SECTION:<heading>
- <label> | <value/detail> | <status>
NEXT:<one concrete next step>
TAGS:<tag1>, <tag2>

AVAILABLE TYPES:
- verdict    → conclusion, judgment, final assessment
- report     → multi-finding analysis, evidence review
- execution  → step-by-step plan with per-step state
- signal     → high-value insight, research finding
- audit      → structured review with pass/fail per item
- matrix     → comparative analysis (use rows as items, values as columns)
- tree       → hierarchical taxonomy, file structure, dependency map
- timeline   → chronological process, sequence of events
- evidence   → research packet with sources and confidence levels
- dossier    → case file, investigation folder with all findings

FORMATTING RULES:
- Items use pipe-separated fields: label | value | status
- Status per item: pass / fail / warn / partial / pending / running / done / locked / current
- NEXT: is ONE precise action, not a paragraph
- TAGS: comma-separated domain tags (3 max)
- For multi-block responses: output multiple TYPE: blocks in sequence

CHAMBER IDENTITY:
You are in the LAB. You surface reality, expose contradictions, model systems, audit reasoning chains, run hypothetical simulations, and produce machine-readable findings with human-elegant structure.

Output feels like:
- A research terminal that has done the work
- A clean audit slab with no noise
- An evidence panel with sources and confidence
- A verdict from a calibrated reasoning system

For simple factual or conversational exchanges: use 2-3 sentences of plain prose only. No forced structure.
For any analytical, investigative, comparative, diagnostic, or evaluative task: use blocks.`,

  school: `You are an elite didactic intelligence operating inside RUBERRA School — a sovereign learning environment. Teach from first principles. Build understanding before knowledge. Correct misconceptions directly.

CORE OUTPUT LAW:
Learning outputs must be structured, not narrated.
Lessons must materialize as maps, not paragraphs.
Every substantive teaching response must use the Ruberra block format.

BLOCK FORMAT:
TYPE:<type>
TITLE:<topic title>
PROGRESS:<n of total> (when tracking a learning arc)
STATUS:<done|current|pending|locked>
SECTION:<section heading>
- <concept/item> | <detail/explanation> | <done|current|pending|locked>
NEXT:<the one thing to do next>
TAGS:<domain>, <level>, <type>

AVAILABLE TYPES:
- lesson     → structured learning unit with progression
- execution  → learning plan, study sequence, curriculum ladder
- verdict    → understanding check, mastery assessment
- report     → concept map, knowledge audit
- dossier    → study dossier, research packet on a topic
- matrix     → comparison of concepts, frameworks, models
- timeline   → historical progression, evolution of a concept
- evidence   → theoretical foundations, source-linked material
- tree       → knowledge dependency map, prerequisite graph

STATUS FOR LEARNING ITEMS:
- done    = mastered / completed
- current = active / studying now
- pending = available but not yet started
- locked  = prerequisite not met

CHAMBER IDENTITY:
You are in SCHOOL. You produce lesson maps, curriculum ladders, concept comparisons, mastery bars, dependency maps, and next-unlock logic.

Output feels like:
- An elite study dossier compiled by a master teacher
- A structured curriculum map showing the full path
- A knowledge audit that identifies exactly what's missing
- A learning sequence that unlocks one thing at a time

For simple questions: 2-3 sentences of plain prose. No forced structure.
For any explanation, lesson, concept map, curriculum, study plan, or assessment: use blocks.`,

  creation: `You are a senior build intelligence operating inside RUBERRA Creation — a sovereign output forge. Build real things. Think in systems. Push back on weak architecture. Be direct about trade-offs.

CORE OUTPUT LAW:
Build outputs must be structured, not described.
Every response about building, designing, or producing must materialize as a visible artifact structure.
Use the Ruberra block format for all substantive build and creation tasks.

BLOCK FORMAT:
TYPE:<type>
TITLE:<artifact/build title>
STATUS:<draft|live|done|partial|running|pending|review>
SECTION:<phase/section heading>
- <step/deliverable> | <detail/spec> | <status>
NEXT:<single most critical next action>
TAGS:<output-type>, <domain>, <stage>

AVAILABLE TYPES:
- execution  → build plan, shipping ladder, step-by-step sequence
- creation   → artifact specification, blueprint sheet, output structure
- audit      → review pass, QA checklist, pre-ship verification
- verdict    → build decision, architecture judgment, approach assessment
- blueprint  → structured template, framework output, repeatable system
- dossier    → complete output package, deliverable folder
- matrix     → option comparison, trade-off matrix, build-vs-buy analysis
- timeline   → draft-to-final roadmap, release sequence

BUILD STAGES:
- draft    = in progress, not verified
- review   = ready for review
- done     = shipped / complete
- pending  = queued but not started
- running  = actively building
- partial  = partly complete
- live     = deployed / in production

CHAMBER IDENTITY:
You are in CREATION. You produce build plans, blueprint structures, artifact dossiers, review slabs, shipping ladders, and output packages.

Output feels like:
- A forge that has already started building
- A blueprint with clear structure and no ambiguity
- A shipping checklist that prevents real failure modes
- An artifact dossier ready for export

For simple questions: 2-3 sentences of plain prose. No forced structure.
For any build, design, generate, create, write, or produce task: use blocks.`,
};

// ─── Rich fallback responses ──────────────────────────────────────────────────
const FALLBACK_RESPONSES: Record<string, string[]> = {
  lab: [
    `TYPE:verdict
TITLE:Distributed Consensus — Failure Mode Analysis
STATUS:partial
SECTION:Core Findings
- Raft leader election under partition | 1.5–2× election timeout overhead vs Paxos | warn
- Split-brain conditions | preventable with pre-vote phase | partial
- Log divergence on rejoin | requires log compaction strategy | pending
- Byzantine fault assumption | Raft assumes crash-only — critical gap | fail
SECTION:Confidence Assessment
- Raft correctness proof | verified in original Diego's thesis | pass
- Production Paxos latency claims | unverified at your scale | warn
- Hybrid approach viability | untested at >200 nodes | pending
NEXT:Isolate the pre-vote mechanism and simulate partition recovery latency before committing to Raft.
TAGS:consensus, distributed-systems, fault-tolerance`,

    `TYPE:evidence
TITLE:Event-Driven Architecture — Signal Pack
STATUS:pass
SECTION:Primary Signals
- Operational coupling reduction | 3.4× lower in EDA vs RPC at 50+ services | pass
- Message ordering guarantees | Kafka preserves partition-level ordering only | warn
- Consumer lag as failure signal | >10k messages lag = operational incident threshold | pass
SECTION:Source Confidence
- ACM Queue study (2023) | n=142 production systems | pass
- CNCF survey | self-reported, potential bias | partial
- Internal benchmark data | methodology not disclosed | warn
NEXT:Validate the 3.4× coupling claim against your specific service topology before using as architectural justification.
TAGS:event-driven, architecture, evidence`,

    `TYPE:matrix
TITLE:CQRS vs Event Sourcing — Trade-off Matrix
STATUS:done
SECTION:Comparison
- Write model separation | CQRS: explicit | ES: implicit via events | pass
- Read model flexibility | CQRS: high, independent projections | ES: derived, rebuild cost | partial
- Temporal query support | CQRS: limited | ES: full point-in-time replay | pass
- Operational complexity | CQRS: moderate | ES: high — event schema evolution | warn
- Team cognitive load | CQRS: manageable | ES: steep learning curve | warn
NEXT:Start with CQRS without Event Sourcing. Add ES only when temporal replay or audit trail is a hard requirement.
TAGS:cqrs, event-sourcing, architecture`,
  ],

  school: [
    `TYPE:lesson
TITLE:CAP Theorem — First Principles
PROGRESS:1 of 4
STATUS:current
SECTION:Foundational Model
- Network partition | any distributed system can experience this | done
- Consistency | all nodes see same data at same time | current
- Availability | every request receives a response | pending
- The impossibility | you cannot guarantee all three simultaneously | locked
SECTION:Mental Model
- C + A without P | single-node systems, no network | done
- C + P without A | refuse requests during partition | current
- A + P without C | serve stale data during partition | pending
NEXT:Build intuition for C+P (CP systems) by studying how HBase behaves during a ZooKeeper leader election.
TAGS:distributed-systems, consensus, fundamentals`,

    `TYPE:execution
TITLE:Distributed Systems Learning Path
STATUS:running
SECTION:Curriculum Ladder
- Network fundamentals | TCP, UDP, latency, bandwidth | done
- CAP theorem | consistency/availability trade-offs | done
- Consensus algorithms | Paxos, Raft, PBFT | current
- Consistency models | linearizability, eventual, causal | pending
- Real-world systems | Kafka, Cassandra, Spanner | locked
- Failure engineering | chaos, SLOs, post-mortems | locked
SECTION:Mastery Check
- Can you explain split-brain? | prerequisite for consensus | current
- Can you derive the CAP impossibility? | test of true understanding | pending
NEXT:Complete the Raft paper (Ongaro & Ousterhout, 2014) before moving to consistency models.
TAGS:distributed-systems, curriculum, advanced`,

    `TYPE:dossier
TITLE:Consensus Algorithms — Study Dossier
STATUS:partial
SECTION:Paxos
- Basic Paxos | single-decree consensus | done
- Multi-Paxos | leader optimization for throughput | current
- Paxos liveness | requires leader election — not guaranteed | warn
SECTION:Raft
- Leader election | randomized timeouts, simpler than Paxos | done
- Log replication | strong leader, followers are passive | done
- Safety guarantee | at most one leader per term | done
- Performance gap vs Paxos | 1.5–2× latency overhead at election | warn
NEXT:Implement Raft from scratch in any language. Paper-reading without implementation produces false confidence.
TAGS:consensus, raft, paxos`,
  ],

  creation: [
    `TYPE:execution
TITLE:AI Agent System — Build Plan
STATUS:running
SECTION:Phase 1 — Foundation
- Define capability envelope | what the agent CAN and CANNOT do | done
- Design tool/function schema | typed, versioned, testable | done
- Implement prompt architecture | system + context + task layers | running
SECTION:Phase 2 — Intelligence
- Memory layer design | short-term, long-term, episodic | pending
- Retrieval integration | RAG over domain knowledge | pending
- Evaluation harness | define success metrics before building | pending
SECTION:Phase 3 — Production
- Tracing and observability | every tool call logged + inspectable | locked
- Failure modes and fallbacks | agent must gracefully degrade | locked
- Cost guardrails | token budget per session enforced | locked
NEXT:Lock the tool/function schema before writing any orchestration code. Schema changes break everything downstream.
TAGS:ai-agent, architecture, production`,

    `TYPE:blueprint
TITLE:Technical Deep-Dive Essay — Structure Blueprint
STATUS:draft
SECTION:Document Architecture
- Opening frame | state the central thesis in one sentence | done
- Evidence layer 1 | primary technical argument with code/data | current
- Evidence layer 2 | counter-argument and resolution | pending
- Synthesis | what this changes in how the reader should think | pending
- Forward implication | what comes next given this analysis | pending
SECTION:Quality Standards
- Thesis clarity | can be stated in 15 words or fewer | pass
- Evidence specificity | no vague claims, all claims are falsifiable | current
- Counter-argument presence | mandatory — builds credibility | pending
NEXT:Write the opening frame sentence first. Everything else is built on it. Do not proceed until it is precise.
TAGS:writing, analysis, technical`,

    `TYPE:audit
TITLE:API Design Review
STATUS:partial
SECTION:Checklist
- Resource naming | nouns, plural, consistent casing | pass
- HTTP method semantics | GET/POST/PUT/PATCH/DELETE correct | pass
- Error response schema | inconsistent across endpoints | fail
- Authentication header | Bearer token required on all routes | pass
- Rate limiting | headers present but not documented | warn
- Versioning strategy | no version in URL or header | fail
- Pagination | cursor-based on list endpoints | partial
NEXT:Fix the error response schema inconsistency first — it affects every consumer of the API.
TAGS:api, review, design`,
  ],
};

// ─── Streaming fallback ───────────────────────────────────────────────────────
function makeFallbackStream(tab: string): ReadableStream<Uint8Array> {
  const pool = FALLBACK_RESPONSES[tab] ?? FALLBACK_RESPONSES["lab"];
  const text = pool[Math.floor(Math.random() * pool.length)];
  const encoder = new TextEncoder();
  let i = 0;

  return new ReadableStream<Uint8Array>({
    start(controller) {
      setTimeout(function emit() {
        if (i < text.length) {
          controller.enqueue(encoder.encode(text[i]));
          i++;
          setTimeout(emit, 11);
        } else {
          controller.close();
        }
      }, 380);
    },
  });
}

// ─── Provider detection ───────────────────────────────────────────────────────
function isClaudeModel(modelId: string): boolean {
  return modelId.startsWith("claude-");
}

function isGeminiModel(modelId: string): boolean {
  return modelId.startsWith("gemini-") || modelId.startsWith("imagen-");
}

// Normalize registry model IDs to real Anthropic API identifiers.
// Registry uses suffixed IDs (e.g. "claude-opus-4.6-sch") for chamber
// disambiguation; strip the suffix before calling the API.
function toAnthropicModelId(modelId: string): string {
  const ANTHROPIC_MAP: Record<string, string> = {
    "claude-opus-4.6":     "claude-opus-4-6",
    "claude-opus-4.6-sch": "claude-opus-4-6",
    "claude-sonnet-4.6":   "claude-sonnet-4-6",
    "claude-haiku-4.5":    "claude-haiku-4-5-20251001",
  };
  return ANTHROPIC_MAP[modelId] ?? modelId;
}

// Normalize registry Gemini IDs to real Google Generative Language model names.
function toGeminiModelId(modelId: string): string {
  const GEMINI_MAP: Record<string, string> = {
    "gemini-3.1-pro-high": "gemini-2.5-pro",
    "gemini-3.1-pro-low":  "gemini-2.0-flash",
    "gemini-3.0-flash":    "gemini-2.0-flash",
    "imagen-4":            "gemini-2.0-flash",  // imagen is image-only; route to flash for chat
  };
  return GEMINI_MAP[modelId] ?? "gemini-2.0-flash";
}

// ─── Chat endpoint ────────────────────────────────────────────────────────────
app.post("/make-server-b9f46b68/chat", async (c) => {
  let body: { tab: string; model?: string; messages: { role: string; content: string }[] };

  try {
    body = await c.req.json();
  } catch {
    return c.text("Bad request", 400);
  }

  const { tab, model, messages } = body;
  const systemPrompt = SYSTEM_PROMPTS[tab] ?? SYSTEM_PROMPTS["lab"];
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // ── Claude / Anthropic path ──────────────────────────────────────────────
  if (model && isClaudeModel(model)) {
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (anthropicKey) {
      try {
        const upstream = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type":    "application/json",
            "x-api-key":       anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model:      toAnthropicModelId(model),
            max_tokens: 2048,
            stream:     true,
            system:     systemPrompt,
            messages,
          }),
        });

        if (upstream.ok && upstream.body) {
          const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
              const reader = upstream.body!.getReader();
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  const chunk = decoder.decode(value, { stream: true });
                  for (const line of chunk.split("\n")) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;
                    const data = trimmed.slice(5).trim();
                    if (data === "[DONE]") continue;
                    try {
                      const parsed = JSON.parse(data);
                      if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
                        const text = parsed.delta.text;
                        if (text) controller.enqueue(encoder.encode(text));
                      }
                    } catch {
                      // malformed SSE line — skip
                    }
                  }
                }
              } finally {
                controller.close();
                reader.releaseLock();
              }
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      } catch (err) {
        console.log("[Ruberra] Anthropic fetch failed, using fallback:", err);
      }
    }
  }

  // ── OpenAI path ──────────────────────────────────────────────────────────
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (openaiKey) {
    const systemMessage = {
      role: "system",
      content: systemPrompt,
    };

    try {
      const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          stream: true,
          temperature: 0.3,
          messages: [systemMessage, ...messages],
        }),
      });

      if (upstream.ok && upstream.body) {
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const reader = upstream.body!.getReader();
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                for (const line of chunk.split("\n")) {
                  const trimmed = line.trim();
                  if (!trimmed.startsWith("data:")) continue;
                  const data = trimmed.slice(5).trim();
                  if (data === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) controller.enqueue(encoder.encode(content));
                  } catch {
                    // malformed SSE line — skip
                  }
                }
              }
            } finally {
              controller.close();
              reader.releaseLock();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch (err) {
      console.log("[Ruberra] OpenAI fetch failed, using fallback:", err);
    }
  }

  // ── Gemini / Google path ─────────────────────────────────────────────────
  if (model && isGeminiModel(model)) {
    const geminiKey = Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_AI_API_KEY");
    if (geminiKey) {
      const geminiModelId = toGeminiModelId(model);
      // Map assistant → model role for Gemini API
      const geminiMessages = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      try {
        const upstream = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModelId}:streamGenerateContent?alt=sse&key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: geminiMessages,
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: { maxOutputTokens: 2048 },
            }),
          },
        );

        if (upstream.ok && upstream.body) {
          const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
              const reader = upstream.body!.getReader();
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  const chunk = decoder.decode(value, { stream: true });
                  for (const line of chunk.split("\n")) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;
                    const data = trimmed.slice(5).trim();
                    if (data === "[DONE]") continue;
                    try {
                      const parsed = JSON.parse(data);
                      const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (text) controller.enqueue(encoder.encode(text));
                    } catch {
                      // malformed SSE chunk — skip
                    }
                  }
                }
              } finally {
                controller.close();
                reader.releaseLock();
              }
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      } catch (err) {
        console.log("[Ruberra] Gemini fetch failed, using fallback:", err);
      }
    }
  }

  return new Response(makeFallbackStream(tab), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

// ─── MCP Sovereign Endpoint — Mission v1 ─────────────────────────────────────
// Tools: mission.create · mission.get · mission.list
//        mission.updateState · mission.attachContinuity · mission.buildHandoff
//
// Storage: kv_store keys
//   ruberra:mission:{id}        — full mission object
//   ruberra:missions:index      — array of { id, name, status, chamberLead, updatedAt }

type MissionStatus = "birth" | "active" | "paused" | "blocked" | "completed" | "archived";
type MissionChamberLead = "lab" | "school" | "creation";

interface MissionIndexEntry {
  id: string;
  name: string;
  status: MissionStatus;
  chamberLead: MissionChamberLead;
  updatedAt: number;
}

function makeMissionId(): string {
  return `mission-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function buildMission(params: {
  name: string;
  chamberLead: MissionChamberLead;
  description?: string;
  outcomeStatement?: string;
  tags?: string[];
}) {
  const id  = makeMissionId();
  const now = Date.now();
  return {
    id,
    identity: {
      name:             params.name,
      description:      params.description      ?? "",
      notThis:          "",
      chamberLead:      params.chamberLead,
      outcomeStatement: params.outcomeStatement  ?? "",
      successCriteria:  [],
      scope:            "",
      tags:             params.tags             ?? [],
    },
    workflow:  { pioneerStack: [], routingBias: params.chamberLead, fallbackBias: params.chamberLead === "lab" ? "creation" : "lab", executionStyle: "focused", continuityRefs: [] },
    memory:    { decisions: [], context: "", constraints: [], priorReasoning: [], continuityRefs: [], lastUpdated: now },
    ledger:    { runHistory: [], transitions: [{ from: "birth", to: "birth", at: now, reason: "Mission born" }], currentState: "birth" as MissionStatus },
    runtime:   { testable: false, previewable: false, deployable: false, executionState: "idle" },
    artifacts: { artifacts: [], exportHistory: [] },
    policy:    { allowed: [], forbidden: [], automate: [], requiresApproval: [], connectorAllowlist: [], modelAllowlist: [] },
    createdAt: now,
    updatedAt: now,
  };
}

async function getIndex(): Promise<MissionIndexEntry[]> {
  const idx = await kv.get("ruberra:missions:index");
  return Array.isArray(idx) ? idx : [];
}

async function saveIndex(idx: MissionIndexEntry[]): Promise<void> {
  await kv.set("ruberra:missions:index", idx);
}

app.post("/make-server-b9f46b68/mcp", async (c) => {
  let body: { tool: string; params?: Record<string, unknown> };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "bad_request" }, 400);
  }

  const { tool, params = {} } = body;

  try {
    // ── mission.create ─────────────────────────────────────────────────────
    if (tool === "mission.create") {
      const name       = (params.name as string | undefined)?.trim();
      const chamberLead = (params.chamberLead as MissionChamberLead | undefined) ?? "lab";
      if (!name) return c.json({ error: "name_required" }, 400);

      const mission = buildMission({
        name,
        chamberLead,
        description:      params.description      as string | undefined,
        outcomeStatement: params.outcomeStatement  as string | undefined,
        tags:             params.tags              as string[] | undefined,
      });

      await kv.set(`ruberra:mission:${mission.id}`, mission);
      const idx = await getIndex();
      idx.push({ id: mission.id, name, status: "birth", chamberLead, updatedAt: mission.createdAt });
      await saveIndex(idx);

      return c.json({ ok: true, mission });
    }

    // ── mission.get ────────────────────────────────────────────────────────
    if (tool === "mission.get") {
      const id = params.id as string | undefined;
      if (!id) return c.json({ error: "id_required" }, 400);
      const mission = await kv.get(`ruberra:mission:${id}`);
      if (!mission) return c.json({ error: "not_found" }, 404);
      return c.json({ ok: true, mission });
    }

    // ── mission.list ───────────────────────────────────────────────────────
    if (tool === "mission.list") {
      const idx = await getIndex();
      const statusFilter = params.status as MissionStatus | undefined;
      const list = statusFilter ? idx.filter((e) => e.status === statusFilter) : idx;
      return c.json({ ok: true, missions: list, total: list.length });
    }

    // ── mission.updateState ────────────────────────────────────────────────
    if (tool === "mission.updateState") {
      const id     = params.id     as string | undefined;
      const toState = params.state as MissionStatus | undefined;
      const reason  = (params.reason as string | undefined) ?? "";
      if (!id || !toState) return c.json({ error: "id_and_state_required" }, 400);

      const mission = await kv.get(`ruberra:mission:${id}`);
      if (!mission) return c.json({ error: "not_found" }, 404);

      const now = Date.now();
      const fromState: MissionStatus = mission.ledger?.currentState ?? "birth";
      mission.ledger.currentState = toState;
      mission.ledger.transitions  = [
        ...(mission.ledger.transitions ?? []),
        { from: fromState, to: toState, at: now, reason },
      ];
      mission.updatedAt = now;

      await kv.set(`ruberra:mission:${id}`, mission);

      const idx = await getIndex();
      const entry = idx.find((e: MissionIndexEntry) => e.id === id);
      if (entry) { entry.status = toState; entry.updatedAt = now; }
      await saveIndex(idx);

      return c.json({ ok: true, id, from: fromState, to: toState });
    }

    // ── mission.attachContinuity ───────────────────────────────────────────
    if (tool === "mission.attachContinuity") {
      const id            = params.id            as string | undefined;
      const continuityId  = params.continuityId  as string | undefined;
      if (!id || !continuityId) return c.json({ error: "id_and_continuityId_required" }, 400);

      const mission = await kv.get(`ruberra:mission:${id}`);
      if (!mission) return c.json({ error: "not_found" }, 404);

      const now = Date.now();
      const existing: string[] = mission.workflow?.continuityRefs ?? [];
      if (!existing.includes(continuityId)) {
        mission.workflow.continuityRefs  = [...existing, continuityId];
        mission.memory.continuityRefs    = [...(mission.memory.continuityRefs ?? []), continuityId];
      }
      mission.updatedAt = now;

      await kv.set(`ruberra:mission:${id}`, mission);
      return c.json({ ok: true, id, continuityId, refs: mission.workflow.continuityRefs });
    }

    // ── mission.buildHandoff ───────────────────────────────────────────────
    if (tool === "mission.buildHandoff") {
      const id = params.id as string | undefined;
      if (!id) return c.json({ error: "id_required" }, 400);

      const mission = await kv.get(`ruberra:mission:${id}`);
      if (!mission) return c.json({ error: "not_found" }, 404);

      const handoff = {
        missionId:       id,
        name:            mission.identity?.name ?? "",
        chamberLead:     mission.identity?.chamberLead ?? "lab",
        currentState:    mission.ledger?.currentState ?? "birth",
        outcomeStatement:mission.identity?.outcomeStatement ?? "",
        continuityRefs:  mission.workflow?.continuityRefs ?? [],
        decisions:       mission.memory?.decisions ?? [],
        lastRunDigest:   mission.ledger?.lastRunDigest ?? null,
        artifacts:       (mission.artifacts?.artifacts ?? []).map((a: Record<string, unknown>) => ({ id: a.id, label: a.label, type: a.type })),
        builtAt:         Date.now(),
        schemaVersion:   "1.0",
      };

      return c.json({ ok: true, handoff });
    }

    return c.json({ error: "unknown_tool", tool }, 400);

  } catch (err) {
    console.error("[Ruberra MCP] error:", err);
    return c.json({ error: "internal_error", detail: String(err) }, 500);
  }
});

Deno.serve(app.fetch);
