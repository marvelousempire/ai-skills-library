# You-Sir Juan platform skills

**Canonical path (this repo):** `skills/yousirjuan/<skill-id>/SKILL.md`

**Retired — never use:** `skills/project/yousirjuan/` (removed; agents must not cite it).

From the `yousirjuan` app monorepo (git submodule), the same files appear as:

`vendor/ai-skills-library/skills/yousirjuan/<skill-id>/SKILL.md`

## Agent ownership

These skills are **agent-managed**:

- Create and update skills in **`marvelousempire/ai-skills-library`** via agent sessions (Nephew, Bishop, Automata, Scene Skout, count-keeper, cross-reference-rippler, skill-scaffolder, or any library agent).
- Do **not** copy `SKILL.md` into app repos; consume via submodule + install script.
- When platform behavior changes, update the skill here first, then bump the submodule pointer in `yousirjuan`.

## Cursor install

From **ai-skills-library** root:

```bash
./scripts/install-repo-skills-to-cursor-project.sh /path/to/yousirjuan
```

Installs flat symlinks under `<project>/.cursor/skills/<skill-id>/`.

## Skills in this pack

| Skill | Use when |
|---|---|
| `associate-agent-system` | 4-persona Associate Agent architecture |
| `bash-installer-oneliners` | You-Sir Juan or third-party `curl \| bash` installers |
| `hardware-compat-doc` | New machine / hardware matrix docs |
| `ios-realitykit-4-patterns` | iOS kiosk RealityKit 4 UI |
| `marketing-feature-doc` | `docs/marketing/NN-feature.md` for shipped features |
| `parallel-agent-coordination` | Multi-surface iOS + web + backend builds |
| `bishop-seven-houses-pipeline` | Bishop agent birth pipeline |
| `bishop-pydantic-manifest-validation` | Manifest validation for agent bundles |
| `infrastructure-operator-setup` | **Read order** for docs/setup + fleet operator context |
| `family-office-voice-stack` | **Parakeet, Holler, Whisper, Fish Speech** — sovereign voice tiers |
| `sovereign-rag-retrieve` | **Brain A/B, Qdrant, bge-m3, tower-api retrieve** |
| `wireguard-bind-law` | **Plan 0180** — bind loopback + wg0 only |
| `cassette-factory-brain-proxy` | **Cassette Factory** one-tap + NEPHEW_BRAIN_PROXY |
| `sovereign-egress-default-deny` | **Plan 0231** — default deny cloud egress |

## Rule

All agents: [`rules/library/yousirjuan-skills-pack-path/`](../../rules/library/yousirjuan-skills-pack-path/body.md)
