---
name: cassette-discipline
id: RL-0066
keywords: [enforce-cassette, check-plugin, build-manifest-driven, plug-and-play, host-survives]
goal: Every host in the operator stack (Nephew CT, DustPan, AISL, etc.) must be a cassette player — plug-in surfaces (agents, apps, skills, rules, native cards) are added/removed via a manifest edit alone, never by editing the host's runtime code. The host must keep running when any cassette is missing or broken.
hash: pending
relations: [contracts-and-prudence, rule-propagation-discipline, operator-control-tower-mindset, live-dashboard-pattern]
before: []
governed_by: [global]
meta: dynamic
---

# Cassette discipline — host is the player, plug-ins are the tapes

## The verbatim source (stated by Avery 2026-05-22)

> these little seeds act like pages in a book or athletic cassette tapes in a cassette player that can easily go and play we stopped and taken out and the cassette player still the same we need to make sure that everything works plug and play while everything goes and remains on interrupted in the absence of a cassette - make sure your nephew is completely set that way every agent, every app every skill every rule every system that's plugged into nephew, operates the same way in every other system, like dustpan, can do the same by having apps in the app folder plugged in the same way seamlessly unintrusive

## The rule

Every host in the operator stack MUST follow the **cassette/player** model:

1. **The HOST is the player.** Nephew Control Tower, DustPan, AI Skills Library, Automata Pad, Clinic, Historia — each is a player that boots, reads its manifest(s), and renders/routes/loads whatever is plugged in.
2. **Plug-ins are cassettes.** Agents (MCP servers), apps (iframe surfaces), skills (methodology bodies), rules (`.claude/rules/*.md`), native cards (React routes), cleaner categories, allowlisted actions, etc.
3. **Every cassette appears in a manifest.** One JSON file (or canonical glob) is the single source of truth for what's plugged in. The host iterates the manifest; it does NOT hardcode references to specific cassette IDs.
4. **The host survives missing/broken cassettes.** Pulling a cassette out of the player doesn't break the player. A bad cassette renders a placeholder, never crashes the host. The other cassettes keep playing.
5. **Adding a cassette = manifest edit + cassette file.** Never `App.tsx` edit. Never `vite.config.ts` edit. Never `nav.tsx` edit. Anything that requires editing N files to add one cassette is a violation.
6. **A tape plays in any player.** A frontend speaker cassette renders in multiple hosts — the CT shell, a standalone Tauri app, a differently-themed player. Its core surface must NOT depend on host-only theme tokens; render a self-contained canvas, or use only tokens guaranteed across every host. A tape can't assume the player's color.

## When this rule fires

- Authoring or refactoring a host (Nephew CT App.tsx, DustPan's tabbed UI, AISL's catalog generator)
- Reviewing a PR that adds a new plug-in surface — does adding the next one ALSO require a code edit?
- When you find yourself writing a hardcoded array of plug-in IDs in the host
- When you find yourself writing per-cassette `if (id === "foo") { ... }` branches in the host

## When this does NOT fire

- The DEFAULT case of a route — e.g. `/login` is intrinsic to the host, not a cassette. Hardcode it.
- One-off composition where the host's chrome legitimately differs between cassettes (e.g. CT's auth-gated section can stay explicit because each page has different shell composition; the public native-card section MUST be manifest-driven).

## The four cassette layers (and where each manifest lives)

| Cassette type | Host | Manifest path | Auto-discovery mechanism |
|---|---|---|---|
| **MCP agents** | Nephew CT MCP Status page | `nephew/data/mcp-registry.json` | JSON imported at build time + iterated |
| **Iframe apps** | Nephew CT EmbedAppPage | `nephew/data/control-tower-apps.manifest.json` | JSON imported, looked up by route param |
| **Native CT cards** | Nephew CT App.tsx | `nephew/data/native-cards.manifest.json` | JSON iterated + Vite `import.meta.glob` for components |
| **Per-agent vite proxies** | Nephew CT vite.config.ts | `nephew/data/agent-endpoints.json` | Node JSON import + proxy block generation |
| **Cleaner categories** | DustPan UI | `dustpan/web/cleaners.py` `CATEGORIES` | Python dict iterated by `/api/tabs` and category routes |
| **AI agent rules** | DustPan Ask DustPan | `dustpan/AI_AGENT_RULES/manifest.json` | Manifest loaded at prompt-build time |
| **Methodology skills** | AISL catalog | `ai-skills-library/skills/**/SKILL.md` glob | Walked at catalog regeneration time |
| **Behavioral rules** | Every operator repo | `.claude/rules/*.md` + `.cursor/rules/*.mdc` globs | Loaded by Claude Code / Cursor on session start |
| **Allowlisted remote actions** | server-operator | `nephew/apps/server-operator/api/actions.py` `REMOTE_ACTIONS` | Python dict iterated by `/api/servers/actions` |

If a layer in your host doesn't have a manifest, the host is not cassette-compliant. Build one.

## Fleet cassettes + the Speaker contract (backend)

The four layers above are **frontend** cassettes. A whole class lives on the
backend: **fleet cassettes** — self-contained services that plug into the
Family Office fleet (the DGX). Examples shipped: `reranker` (:7997), `doc-rag`
(:8004), `graph-service` (LangGraph, :8005), `comfyui` (:8188), the Historia
sync. These are cassettes too, and they're how the player gets a **Speaker**.

### What is a "Speaker"?

A cassette is *heard* through two speakers. A cassette with no speaker is
silent — loaded but unusable.

1. **Health speaker** — every fleet cassette ships `GET /health` (liveness) and
   `GET /doctor` (a deep probe of its own dependencies). This is how the player
   *hears* it's alive and renders a true status LED. Ties directly to
   [`os-pill-and-about-modal`](os-pill-and-about-modal.md) (the LED) and
   [`live-dashboard-pattern`](live-dashboard-pattern.md) (the poll). A cassette
   that can't answer `/doctor` cannot degrade gracefully — the host can't tell
   "missing" from "broken."
2. **Edge speaker** — a cassette becomes reachable by the family only when
   exposed through the **gated VPS vhost** (mTLS + family-SSO,
   `auth_request → 127.0.0.1:8088/api/v1/auth/verify`, anon → sign-in). That
   gated surface *is* the speaker. Mirror the clinic/grafana vhosts; never
   expose a cassette to the edge ungated.

### The fleet cassette shape (zero-edit, like native cards)

```
deploy/fleet/<name>/
  app.py | server.js     # the service
  Dockerfile             # arm64 (see below)
  doctor.sh              # GET /doctor health probe (doctor-script-pattern)
```
Plus **one** service block in `deploy/fleet/docker-compose.yml`. Endpoints are
**env-configured, never hardcoded** (`DOC_RAG_URL`, `VLLM_URL`, …). Adding a
fleet cassette = a folder + a compose row. Nothing else is edited — the same
zero-edit discipline as native cards.

### arm64-first (the Grace DGX reality)

Off-the-shelf images are usually **amd64** and will not run on the Grace DGX
(this bit us 5× in one session: Whisper, Infinity, ComfyUI, Metabase). Rule:

- `docker manifest inspect <image>` for `arm64` **before** choosing an image.
- amd64-only → **build a custom arm64 image** (the reranker/doc-rag pattern).
- GPU cassettes → base on **NGC arm64 PyTorch** (CUDA built for Blackwell
  GB10/sm_121, the same path vLLM uses); **stub PyPI extensions whose ABI
  rejects NGC's torch** (e.g. an empty `torchaudio` module for ComfyUI, which
  only imports it for an unused audio VAE).

### Clean deploy = git, not scp

The cassette lives in the **repo**; the host gets it via `git pull` +
`docker compose build`, never ad-hoc `scp`. The repo is the source of truth;
the DGX is a checkout. (Per [`multi-repo-sync-audit`](multi-repo-sync-audit.md)
+ [`contracts-and-prudence`](contracts-and-prudence.md) — scp'd-but-uncommitted
work is invisible drift.)

### The Speaker (edge) vhost template

```nginx
server {
  listen 443 ssl;
  server_name <cassette>.jailynmarvin.com;
  ssl_certificate     /etc/letsencrypt/live/<cassette>.jailynmarvin.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/<cassette>.jailynmarvin.com/privkey.pem;
  ssl_verify_client on;                                   # mTLS
  ssl_client_certificate /etc/jailynmarvin-ca/ca.crt;
  location = /family-auth-verify { internal; proxy_pass http://127.0.0.1:8088/api/v1/auth/verify; }
  error_page 401 = @family_signin;
  location @family_signin { return 302 https://jailynmarvin.com/sign-in; }
  location / { auth_request /family-auth-verify; proxy_pass http://127.0.0.1:<host-port>; }
}
```

### Reliability contract — a Speaker that stays good

The two Speakers make a cassette *heard*; these four keep it *trustworthy*.
Each was paid for the hard way (the doc-rag wedge + stale-brain session, 2026-06-04):

1. **Single-flight long ops.** Any endpoint that runs a long mutating job
   (ingest, reindex, build) MUST be single-flight: an overlapping call returns
   **409 "already running"**, never queues. Queuing stacks on the worker and
   wedges it — the count freezes and nothing progresses. Steal a stale lock
   after a TTL so a crashed job can't block forever. (Ref: doc-rag `/ingest`.)
2. **Freshness is part of liveness.** A cassette serving *derived* data
   (embedded / ingested / computed) MUST declare how it stays current — a timer
   or webhook — not just answer `/health`. "Healthy but stale" reads as working
   and isn't. (Ref: the fleet brain-refresh timer.)
3. **No-safe-default env → pin it in `.env`.** "Env-configured, never hardcoded"
   is necessary but not sufficient. If a var has no safe default (a mount path,
   a model name), a bare `docker compose up` silently uses the wrong default and
   quietly guts the cassette. Pin it in the compose `.env`. (Ref: `RAW_DOCS_HOST`
   defaulting to an empty `./raw-docs` — served zero docs until pinned.)
4. **The probe must answer behind the gate.** A `/doctor` that 200s on loopback
   but sits behind family-SSO at the edge makes the LED lie. Probe a loopback /
   internal path, or account for the gate — an honest LED or none.

## The auto-discovery pattern (the trick that makes it zero-edit)

For React/Vite hosts, use `import.meta.glob` so adding a `<Name>Page.tsx` file makes the component automatically available without editing imports:

```ts
const pageModules = import.meta.glob<Record<string, ComponentType>>(
  "./pages/*.tsx",
  { eager: true },
);
const componentMap: Record<string, ComponentType> = {};
for (const [filePath, mod] of Object.entries(pageModules)) {
  const name = filePath.replace(/^\.\/pages\//, "").replace(/\.tsx$/, "");
  const named = mod[name] || mod["default"];
  if (named) componentMap[name] = named;
}
```

Then the host's route table iterates a manifest and looks each component up by name:

```tsx
{manifest.cards.map((c) => (
  <Route key={c.id} path={c.path} element={<Wrap card={c} Component={componentMap[c.component]} />} />
))}
```

Adding a new card = `data/native-cards.manifest.json` row + `src/pages/MyNewPage.tsx`. Zero edits anywhere else.

## The graceful-degradation pattern

When a manifest references a cassette that isn't installed yet (component file missing, agent backend down, skill not yet built):

```tsx
function renderManifestCard(card) {
  const Component = componentMap[card.component];
  if (!Component) {
    return <PlaceholderCassette card={card} reason="component file missing" />;
  }
  return <Component />;
}
```

The host renders a placeholder explaining what's missing. The rest of CT keeps running. The operator can either add the file or remove the manifest row. **The host is never crashed by a missing cassette.**

## Concrete anti-patterns this rule forbids

- **Hardcoded route arrays** in `App.tsx` — every public route should derive from a manifest
- **Hardcoded proxy entries** in `vite.config.ts` — derive from `data/agent-endpoints.json`
- **Hardcoded nav tabs** in `DustpanNav.tsx` and similar — filter the manifest by parent
- **Hardcoded `if (agent === "dustpan")` branches** — iterate the registry
- **Adding an agent that requires editing N files** — should be one manifest row, period
- **Crashes when a cassette is missing** — host MUST degrade gracefully

## Examples

### ✓ Compliant — Nephew CT native cards (after 2026-05-22 refactor)

Adding a 10th native CT card:

```diff
+ // data/native-cards.manifest.json
+ {
+   "id": "n8n-summary",
+   "path": "/n8n",
+   "label": "n8n",
+   "agent_id": "n8n",
+   "parent_id": null,
+   "component": "N8nSummaryPage",
+   ...
+ }

+ // apps/control-tower/src/pages/N8nSummaryPage.tsx
+ export function N8nSummaryPage() { ... }
```

That's it. No App.tsx edit, no DustpanNav edit, no FleetOverview edit. The route appears, the component renders, the nav (if applicable) updates.

### ✗ Violation — Nephew CT native cards (before 2026-05-22 refactor)

Adding a 10th card required:
1. Import the component at the top of `App.tsx`
2. Add a `<Route>` block in the public-routes section of `App.tsx`
3. Add a vite proxy entry in `vite.config.ts` (if the card has its own agent backend)
4. Edit `DustpanNav.tsx` if the card is a sub-tab
5. Edit `FleetOverviewPage.tsx` if the card should appear in the fleet rollup

Five edits for one card. That's not cassette-compliant.

## Verification

For every host in the stack, the following should be true:

1. List every plug-in surface
2. For each, identify the manifest that drives it (or build one)
3. Confirm the host iterates the manifest, doesn't hardcode IDs
4. Confirm the host degrades gracefully when a cassette is missing
5. Test: add a hypothetical new cassette by editing only the manifest + adding one cassette file. Confirm no other host code needs to change.

If any of step 1–5 fails, the host has a cassette-discipline gap. File it as a follow-up task.

## Propagation

Per [`rule-propagation-discipline`](rule-propagation-discipline.md): this rule's body lives in `nephew/.claude/rules/`, mirrored to `.cursor/rules/` and every operator repo's `.claude/rules/` + `.cursor/rules/`. Memory entry saved.

## Related

- **Plan:** `nephew/plans/0061-cassette-discipline.md` — the rollout that formalized this rule
- **Manifests:** `nephew/data/native-cards.manifest.json`, `nephew/data/agent-endpoints.json`, `nephew/data/mcp-registry.json`, `nephew/data/control-tower-apps.manifest.json`
- **Auto-discovery example:** `nephew/apps/control-tower/src/App.tsx` (uses `import.meta.glob`)
- **Sister rule:** [`rule-propagation-discipline`](rule-propagation-discipline.md) — every rule propagates the same way every cassette does
- **Philosophy:** [`contracts-and-prudence`](contracts-and-prudence.md) — manifests ARE contracts; hardcoded arrays are anti-contracts
