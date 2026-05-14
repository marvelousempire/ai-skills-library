---
name: live-version-before-debug
id: RL-0023
keywords: [enforce-live, check-version, build-before]
goal: Deliver live version before debug output correctly and completely.
hash: 0b12291
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Live version before debug

## The rule

When a bug is still visible after a deploy that shows ✅ green in CI,
**verify the live version matches your commit before touching any code.**

This single check takes 10 seconds. Skipping it costs a full deploy
cycle — code change → commit → push → PR → merge → 5-minute build → smoke
test → retest — discovering at the end that the problem was never in the
version you thought was running.

---

## The check

```bash
# For Next.js sites that expose a version in the HTML
curl -s "https://your-site.com/" | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+'

# Or check a dedicated version endpoint
curl -s "https://your-site.com/marketing-version.json"
curl -s "https://your-site.com/version/"
curl -s "https://api.your-site.com/health"

# For sites that embed git state
curl -s "https://your-site.com/git-state.json" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('short'), d.get('subject','')[:60])"
```

If the version in the response does not match the version in your
`package.json` (or the commit SHA you merged), your deploy did not land.
Do not debug the code — debug the deploy.

---

## What "version confirmed" means

**Version is correct + bug still present = the code is wrong.**
Your fix addressed the wrong thing. See [`root-cause-not-symptom`](root-cause-not-symptom.mdc).

**Version is wrong (old version still serving) = deploy didn't land.**
Possible causes:
- Deploy workflow failed after the smoke-test step (rare but real)
- CDN / proxy is serving a cached old build
- The deploy targeted the wrong environment
- A concurrent deploy ran and overwrote yours

Check `gh run list --workflow "Deploy ..."` first.

---

## When to run this check

1. **Immediately after a user reports "still broken"** — before reading any code.
2. **When your deploy showed green but you haven't manually tested** — confirm before telling anyone it's live.
3. **After any emergency deploy where you skipped normal verification** — trust nothing.

---

## Why deploys appear green but the wrong version serves

The smoke test in most deploy workflows only checks HTTP 200 on the
homepage. It does NOT check:
- Which version is responding
- Whether the specific changed component is rendering correctly
- Whether the new JavaScript bundle was loaded (CDN cache)

A deploy can be "successful" by all CI metrics while the VPS still serves
the old build because the atomic swap (`mv .next-new .next`) succeeded but
`pm2 reload` restarted before the new build was fully written to disk.

The version check is the only way to be certain.

---

## Cost of skipping this check

Each wasted deploy cycle in a typical Next.js VPS setup:

| Step | Time |
|---|---|
| Code change | 2–10 min |
| Commit + push + PR | 2 min |
| GitHub Actions queue + start | 1–3 min |
| `pnpm install` + `pnpm build` on VPS | 5–8 min |
| Smoke test + pm2 reload | 1 min |
| Manual retest | 2 min |
| **Total per wasted cycle** | **13–26 min** |

The version check costs 10 seconds. It pays for itself on the first use.

---

## Related rules

- [`go-live-path`](go-live-path.mdc) — deploy checklist; this rule adds one mandatory step after deploy
- [`root-cause-not-symptom`](root-cause-not-symptom.mdc) — if the version is confirmed correct, your fix is wrong
- [`dev-discipline`](dev-discipline.mdc) — pipeline stage naming (deployed ≠ verified working)
