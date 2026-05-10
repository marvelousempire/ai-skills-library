# Marketing Skills (Corey Haines / marketingskills)

**Upstream:** https://github.com/coreyhaines31/marketingskills  
**License:** MIT (see upstream repo)

## Install (canonical)

From **home directory** (so paths land in `~`):

```bash
export npm_config_cache="$HOME/.npm"
cd "$HOME"
command npx --yes skills add coreyhaines31/marketingskills
```

This installs **41 skills** into **`~/.agents/skills/`**.

If your shell aliases `npx` to `pnpm dlx`, use **`command npx`** as above.

## Cursor + Claude on this Mac

After install, symlink into tool-visible folders (one-time):

```bash
AGENTS="$HOME/.agents/skills"
for d in "$AGENTS"/*/; do
  name=$(basename "$d")
  ln -sfn "$(realpath "$d")" "$HOME/.cursor/skills/$name"
  ln -sfn "$(realpath "$d")" "$HOME/.claude/skills/$name"
done
```

Keep **local-only** skills (e.g. `verify-ship`, `generate-weather-plates`) as real directories under `~/.claude/skills` — do not delete those.

## Foundation skill

Upstream expects **`product-marketing-context`** first for positioning. Create/update `.agents/product-marketing-context.md` (or `.claude/` fallback per upstream docs).

## Skill IDs installed (`~/.agents/skills`)

- `ab-test-setup`
- `ad-creative`
- `ai-seo`
- `analytics-tracking`
- `aso-audit`
- `churn-prevention`
- `co-marketing`
- `cold-email`
- `community-marketing`
- `competitor-alternatives`
- `competitor-profiling`
- `content-strategy`
- `copy-editing`
- `copywriting`
- `customer-research`
- `directory-submissions`
- `email-sequence`
- `form-cro`
- `free-tool-strategy`
- `image`
- `launch-strategy`
- `lead-magnets`
- `marketing-ideas`
- `marketing-psychology`
- `onboarding-cro`
- `page-cro`
- `paid-ads`
- `paywall-upgrade-cro`
- `popup-cro`
- `pricing-strategy`
- `product-marketing-context`
- `programmatic-seo`
- `referral-program`
- `revops`
- `sales-enablement`
- `schema-markup`
- `seo-audit`
- `signup-flow-cro`
- `site-architecture`
- `social-content`
- `video`

## Updates

Re-run `npx skills add coreyhaines31/marketingskills` when upstream releases; then re-run symlink loop for any **new** folder names.

## Overlap

See **[overlap-rules.md](overlap-rules.md)** — **copywriting** / **page-cro** vs **ui-ux-pro-max**.
