# CI overview dashboard

A self-contained dashboard that polls your self-hosted GitLab and shows live pipeline status across every project — calmer than the GitLab UI for "what's green and what's red right now."

```text
   ┌─────────────────────────────────────────────────────────────────┐
   │  ▣ CI · self-hosted          git.your.tld   updated 14:32:11    │
   ├─────────────────────────────────────────────────────────────────┤
   │  projects: 8    success: 6    failed: 1    running: 1            │
   ├─────────────────────────────────────────────────────────────────┤
   │  marvelousempire/seeme                       12 recent pipelines │
   │    ● success    main    a7b2fd5    1m 12s    2m ago              │
   │    ● success    main    945a02f    1m 03s    18h ago             │
   │    ● failed     feat/x  c7aed7c    47s       1d ago              │
   │                                                                  │
   │  marvelousempire/ai-skills-library             4 recent           │
   │    ● running    main    be12ab0    —         now                  │
   │    ● success    main    52a9c57    23s       1h ago               │
   └─────────────────────────────────────────────────────────────────┘
```

## What it does

- Polls `GET /api/v4/projects?membership=true` every 15 seconds
- For each project, fetches the 10 most-recent pipelines
- Renders status badges (success / failed / running / pending / manual / scheduled / canceled / skipped)
- Auto-sorts by latest activity
- Pauses polling when the browser tab is hidden (saves API calls)
- Same dark-mode monospace aesthetic as SEEME

## Setup

```sh
cd skills/infra/self-hosted-git/dashboard
cp .env.example .env
# Edit .env — set GITLAB_URL and GITLAB_TOKEN.

# Create a token at User Settings → Access Tokens with scope: read_api
# (read-only is enough; the dashboard never writes).

./serve.sh
# → CI dashboard running at http://127.0.0.1:7778/
```

Open `http://127.0.0.1:7778/` in any browser.

## What you need

| Item | Where to get it |
|---|---|
| Self-hosted GitLab running | the `self-hosted-git` skill (sibling folder) |
| Personal Access Token | User Settings → Access Tokens → New, scope `read_api` |
| Node 24+ on the host | already required for SEEME |

## Architecture

```text
   ┌─────────────┐    fetch    ┌─────────────┐    PRIVATE-TOKEN    ┌──────────┐
   │  browser    │────────────►│  server.ts  │────────────────────►│  GitLab  │
   │  index.html │   /api/*    │  Node http  │   /api/v4/*         │  CE      │
   └─────────────┘             └─────────────┘                     └──────────┘
                                  ▲
                                  │ reads
                              .env / shell env
                              GITLAB_URL, GITLAB_TOKEN
```

Token never leaves the server — the browser fetches `/api/*` paths from `localhost:7778`, and the server proxies to GitLab with the credential attached. No CORS pain, no token in the page source.

## What you might add later

- Filter to a specific project group
- Show jobs (not just pipelines) — click a pipeline to expand
- Trigger a manual pipeline from the dashboard (would need `api` scope on the token)
- Live log streaming for the currently-running job

For now this is a tight read-only "is anything red right now" pane. The full GitLab UI handles the rich workflows.

## Why not just use the GitLab UI?

GitLab's UI is great when you're inside a single project. For cross-project visibility — "across all my projects, what's the current health?" — it's mediocre (you bounce between project pages). This dashboard is the one-glance answer.
