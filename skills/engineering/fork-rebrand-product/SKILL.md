---
name: fork-rebrand-product
id: SK-0142
hash: c7f405e
keywords: [run-fork, check-rebrand, build-product]
goal: Every fork/rebrand ships as a traceable product rename with attribution, compatibility, docs, skills, and verification intact.
relations: [cross-reference-rippling, verification-gates, decision-records]
before: [plan-first-substantive-changes]
governed_by: [global]
meta: dynamic
description: >-
  Fork and rebrand a product repo without losing attribution, compatibility,
  package behavior, or routing docs. Use when the user says "fork and rebrand",
  "rename this repo", "turn upstream into our product", "make a branded fork",
  "rebrand claude-mem to Membadat", or asks to capture a rebrand process as a
  reusable skill.
---

# fork-rebrand-product

Use this skill when a repo must be forked, renamed, branded, and wired back into
the owning product system. It is based on the Membadat fork/rebrand of
`thedotmack/claude-mem` into `marvelousempire/membadat`.

## When

Run this skill when all conditions are true:

1. There is an upstream project or existing private fork.
2. The target product needs a new name, package identity, CLI identity, docs, and
   repository identity.
3. Attribution, license, migration, and compatibility matter.
4. The result must be reusable by agents through AI Skills Library or product
   docs.

Do not run this skill for a simple file rename or one-off string replacement.

## Input

Collect these values before editing:

```yaml
old_name: claude-mem
new_name: membadat
display_name: Membadat
upstream_repo: thedotmack/claude-mem
target_repo: marvelousempire/membadat
local_checkout: /Users/nivram/Developer/membadat
product_role: "memory tissue inside SYNTHIA, Nephew's Brain"
legacy_env_prefix: CLAUDE_MEM
new_env_prefix: MEMBADAT
legacy_data_dir: ~/.claude-mem
new_data_dir: ~/.membadat
```

If any value is unknown, stop and ask. Do not guess repository ownership.

## Output

Produce:

- A local checkout with `origin` pointed at the branded fork and `upstream`
  pointed at the original project.
- Rebranded package metadata, CLI names, plugin manifests, docs, examples,
  default data paths, and environment prefixes.
- A `NOTICE.md` that preserves upstream project, author, repository, and license.
- A rebrand inventory explaining what changed and what remains compatible.
- Product docs and skill-library entries that route future agents to the new
  product name.
- Verification output showing JSON/YAML/frontmatter checks and stale-name audit.

## Rules

- Preserve license and upstream attribution.
- Keep old names only for upstream attribution, migration notes, and real
  compatibility fallbacks.
- Do not remove old config/data support if users may already have persisted data.
- Do not patch generated or minified bundles by hand unless the repo already
  treats them as source-controlled distributables.
- Do not claim the fork is shipped until its native install/build/test commands
  pass.
- Do not push unless the user explicitly asks.

## Steps

1. **Plan the fork.** Write or update a plan that names the upstream repo, target
   repo, local checkout, license, compatibility policy, and verification commands.

2. **Create or verify the target repo.**

   ```bash
   gh repo view "OWNER/NEW_REPO" --json nameWithOwner,url,isPrivate,defaultBranchRef || \
     gh repo create "OWNER/NEW_REPO" --private --description "<description>" --clone=false
   ```

3. **Clone with two remotes.**

   ```bash
   git clone "https://github.com/UPSTREAM_OWNER/OLD_REPO.git" "/path/to/new-repo"
   cd "/path/to/new-repo"
   git remote rename origin upstream
   git remote add origin "https://github.com/OWNER/NEW_REPO.git"
   git remote -v
   ```

4. **Inventory before editing.** Search for old product names, package names,
   env vars, data directories, plugin IDs, marketplace namespaces, docs,
   generated bundles, tests, and install scripts.

   ```bash
   rg "old-name|Old Name|OLD_ENV|~/.old-name" .
   ```

5. **Run the text rebrand script.** Use
   `scripts/rebrand_text.py` from this skill. Review the changed file list before
   continuing.

6. **Run the JSON metadata normalizer.** Use
   `scripts/normalize_json_metadata.py` to update package and plugin metadata.

7. **Move obvious path names.** Rename directories such as
   `docker/old-name` to `docker/new-name` and rule files such as
   `old-name-context.md` to `new-name-context.md`.

8. **Add attribution.** Write `NOTICE.md` with upstream and fork details. Keep
   the upstream `LICENSE` unless legal review says otherwise.

9. **Add compatibility fallback.** If the old install may already exist, keep
   compatibility for real persisted data, such as old env vars or old data dirs.

10. **Update downstream memory.** Record the product decision in the governing
    memory system or decision log.

11. **Update skill-library routing.** Add or update bridge skills and catalogs so
    future agents use the new product name.

12. **Verify.** Run the checks below.

## Checks

Minimum checks:

```bash
python3 skills/engineering/fork-rebrand-product/scripts/verify_rebrand.py \
  --root /path/to/new-repo \
  --old-name old-name \
  --new-name new-name \
  --allowed-old-path NOTICE.md \
  --allowed-old-path docs/rebrand-inventory.md
```

```bash
node -e "for (const p of ['package.json']) JSON.parse(require('fs').readFileSync(p, 'utf8')); console.log('json ok')"
```

```bash
git remote -v
git status --short
```

Run the repo-native commands after dependencies are available:

```bash
npm install
npm run build
npm run typecheck
npm test
```

If the repo uses Bun, verify Bun first:

```bash
bun --version
```

If Bun is missing, report that build/test is blocked. Do not mark the fork as
fully shipped.

## Never

- Never remove upstream attribution.
- Never erase old persisted memory/data without a migration path.
- Never replace all old-name strings blindly after verification; some old-name
  strings are required for attribution and compatibility.
- Never treat a GitHub repo creation as a code ship. It is only the container.
- Never push or create a release without explicit user approval.

## Done

The rebrand is done when:

- `origin` points at the branded repo and `upstream` points at the source repo.
- Package/plugin metadata names the new product.
- Active docs and examples use the new product name.
- Old names appear only in allowed attribution or compatibility locations.
- Native build/tests pass, or blockers are stated plainly.
- Downstream product docs, memory decisions, and skill-library routing point to
  the new name.

## Reference

- Process/codebook: [`references/rebrand-codebook.md`](references/rebrand-codebook.md)
- Text replacement script: [`scripts/rebrand_text.py`](scripts/rebrand_text.py)
- JSON metadata script: [`scripts/normalize_json_metadata.py`](scripts/normalize_json_metadata.py)
- Verification script: [`scripts/verify_rebrand.py`](scripts/verify_rebrand.py)
