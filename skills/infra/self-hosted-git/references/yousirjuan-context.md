# How this skill fits into the yousirjuan platform vision

The yousirjuan platform plan describes a sovereign, self-hosted AI infrastructure stack split into 12 categories. This skill operationalizes Category 11 (Governance, GitOps & Operational Memory) and depends on portions of Categories 10 (Infrastructure & Deployment) and 12 (Hardware & Compute).

## Where this skill plugs in

```text
   ┌──────────────────────────────────────────────────────────────────┐
   │  yousirjuan platform — 12 categories                              │
   ├──────────────────────────────────────────────────────────────────┤
   │   1. Inputs & ingestion                                           │
   │   2. Knowledge & embeddings                                       │
   │   3. Reasoning & generation                                       │
   │   4. AI assistants & UIs                                          │
   │   5. Voice                                                        │
   │   6. Media generation                                             │
   │   7. Evaluation & QA                                              │
   │   8. Orchestration                                                │
   │   9. Workspaces & namespaces                                      │
   │  10. Infrastructure & Deployment        ←── this skill USES       │
   │  11. Governance, GitOps & Operational Memory   ←── this skill IS  │
   │  12. Hardware & Compute Roles           ←── this skill RUNS ON    │
   └──────────────────────────────────────────────────────────────────┘
```

## What this skill ships per category

### Category 11 — Governance, GitOps & Operational Memory ([master](../../../../docs/yousirjuan-platform-skills-master.md#11-governance-gitops--operational-memory))

| Tool in plan | Status before | Status after this skill |
|---|---|---|
| Git | Core | Core (unchanged) |
| GitHub | Active | Active (upstream sync only) |
| **GitLab CE** | **Planned** | **Active** ← this skill |
| Gitea | Candidate | Alternative (not selected) |
| Forgejo | Candidate | Alternative (not selected) |
| **GitLab Runners** | **Planned** | **Active** ← this skill (auto-registers one) |
| **GitLab Registry** | **Planned** | **Active** ← this skill (enabled in Compose) |
| Git LFS | Candidate | Candidate (works on GitLab CE; enable per-project) |

### Category 10 — Infrastructure & Deployment ([master](../../../../docs/yousirjuan-platform-skills-master.md#10-infrastructure--deployment))

| Tool in plan | Used by this skill |
|---|---|
| Docker, Docker Compose | yes — the entire stack runs on Compose |
| WireGuard | yes — Path B (target) network entry |
| nginx | replaced by Caddy in this skill (auto-HTTPS) |
| Terraform | not yet — could be added if you want declarative infra |
| Ansible | not yet — could be added for multi-host runner setup |
| SOPS / Vault | candidate — secrets currently via env vars; SOPS is the natural upgrade |

### Category 12 — Hardware & Compute ([master](../../../../docs/yousirjuan-platform-skills-master.md#12-hardware--compute-roles))

| Hardware | Role | This skill |
|---|---|---|
| MacBook Pro M5 Max | main workstation | git client; CI runner candidate |
| **Mac mini M4 Pro** | **persistent runtime node** | **the host for this skill (target)** |
| **Flint 2** | **home gateway** | **WireGuard tunnel entry point (target)** |
| Slate AX | travel router | mobile WireGuard endpoint |
| NVIDIA DGX Spark | frontier inference node | CI runner (large-mem, cuda) |
| NVIDIA Jetson Thor | edge AI node | CI runner (arm64, edge) |

## How to update the ledger after running this skill

When you've actually run the playbook and have a working GitLab on your Mac mini:

1. Open [`docs/yousirjuan-platform-skills-master.md`](../../../../docs/yousirjuan-platform-skills-master.md), find the Category 11 table, and bump:
   - `GitLab CE` status: `Planned` → `Active`
   - `Gitea` status: `Candidate` → `Alternative (not selected)`
   - `Forgejo` status: `Candidate` → `Alternative (not selected)`
   - `GitLab Runners` status: `Planned` → `Active`
   - `GitLab Registry` status: `Planned` → `Active`

2. Open [`docs/yousirjuan-upstream-repo-ledger.md`](../../../../docs/yousirjuan-upstream-repo-ledger.md), find section 11, and make the same edits.

3. (Optional) Add a "first-run notes" section to your private notebook with the resolved hostname, root password reset confirmation, and runner registration date. Helps with future audits.

## Why the alignment matters

The skills library + the yousirjuan platform docs are the two halves of the same thing: the platform docs describe *what should exist*, and the skills describe *how to bring each piece into existence*. When a skill ships that operationalizes a planned platform component, the ledger should reflect it. That's how the library stays honest about what's actually running.
