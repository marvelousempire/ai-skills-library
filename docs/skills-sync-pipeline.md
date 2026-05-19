# Skills sync pipeline — library is source of truth

**Canonical repo:** [`marvelousempire/ai-skills-library`](https://github.com/marvelousempire/ai-skills-library)

Consumer monorepos (e.g. red-e-play-app) vendor it as `vendor/ai-skills-library` and symlink into `.cursor/skills/`.

## Flow

```text
~/.agents/skills/          ─┐
~/.cursor/skills-cursor/   ─┼─► vendor-skills-from-home.sh (rsync in)
~/.claude/skills/          ─┘
                                    │
                                    ▼
                         vendor/ai-skills-library/skills/
                                    │
              install-repo-skills-to-cursor-project.sh (symlink out)
                                    │
                                    ▼
                         <project>/.cursor/skills/<name> → library

validate-skill-frontmatter.py → git commit → push-all-remotes.sh
                                      ├── origin (GitHub)
                                      └── gitlab (self-hosted, optional)
```

## Commands (monorepo root)

```bash
git submodule update --init vendor/ai-skills-library

# One-shot: pull home → library, re-link .cursor, commit, push
bash scripts/either-host/publish-and-push-ai-skills-library.sh

# Library only (inside vendor/ai-skills-library)
./scripts/vendor-skills-from-home.sh
./scripts/validate-skill-frontmatter.py
./scripts/push-all-remotes.sh

# Watch skills/ + agents/ (requires fswatch)
./scripts/watch-skills.sh
./scripts/watch-skills.sh --push   # also push when tree clean

# Re-link project .cursor/skills after submodule pull
bash scripts/either-host/sync-ai-skills-library.sh
bash scripts/either-host/sync-ai-skills-library.sh --global
```

## GitLab remote (one-time)

```bash
cd vendor/ai-skills-library
git remote add gitlab ssh://git@clinic.yousirjuan.ai:2424/marvelousempire/ai-skills-library.git
git push -u gitlab main
```

Override URL: `GITLAB_REMOTE_URL=... ./scripts/push-all-remotes.sh`

## Packs linked into Cursor

`marketing`, `engineering`, `methodology`, `ide/cursor`, `external`, `project/red-e-play`, `visual/design/ui-ux-pro-max`
