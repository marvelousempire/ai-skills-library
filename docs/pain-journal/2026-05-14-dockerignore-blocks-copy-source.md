# `.dockerignore` excluded a file the Dockerfile's `COPY` references — build fails

**First seen:** 2026-05-14 (first live `make docker-up` for brokerage-prototype)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** docker / build / dockerignore

## Symptom

```
[runtime 2/3] COPY nginx.conf /etc/nginx/conf.d/default.conf
ERROR: failed to calculate checksum of ref ...: "/nginx.conf": not found
```

Dockerfile + `.dockerignore` look correct individually. Build context fetches fine. But the COPY can't find a file you can `ls` locally.

## Diagnose (30 seconds)

```bash
# Cross-reference Dockerfile's COPY sources against .dockerignore lines
grep -E '^COPY' Dockerfile | awk '{print $2}' | while read src; do
  if grep -qF "$src" .dockerignore 2>/dev/null; then
    echo "✗ $src is in Dockerfile COPY but excluded by .dockerignore"
  fi
done
```

If any line prints → that's your bug.

## Fix

Remove the file from `.dockerignore`. Dockerfile-only config (`Dockerfile`, `.dockerignore`, `docker-compose.yml`) stay excluded — they're build orchestration, not image content. Files referenced by `COPY` MUST be in the build context:

```diff
 # Don't re-copy the build config itself
 Dockerfile
 .dockerignore
 docker-compose.yml
-nginx.conf
+# nginx.conf is COPY'd into runtime — must be in context
```

## Root cause

`.dockerignore` filters the build context BEFORE Dockerfile instructions run. Anything excluded simply isn't there when `COPY` looks for it. Easy to add files mid-`.dockerignore` cleanup that the Dockerfile actually needs.

## Prevention

- Add a CI check or local pre-commit hook: cross-reference every `Dockerfile`'s `COPY <src>` against `.dockerignore`.
- After editing `.dockerignore`, run a live `docker build` (not just `--no-cache --target=builder` — go all the way to runtime).
- Comment `.dockerignore` entries that are intentional (vs accidental leftovers).

## Related

- Pain: live-verification gap — see `checklists/post-ship-live-verification.md`
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md) (commit `f38a1ab` is the fix)
