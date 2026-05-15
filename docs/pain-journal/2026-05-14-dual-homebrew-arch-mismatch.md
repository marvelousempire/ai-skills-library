# Dual Homebrew on Apple Silicon — x86 brew installs binaries that can't run

**First seen:** 2026-05-14 (Colima install)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** macos / homebrew / apple-silicon

## Symptom

`brew install colima` succeeds. Running `colima start` fails:
```
level=fatal msg="limactl is running under rosetta, please reinstall lima with native arch"
```

## Diagnose (30 seconds)

```bash
which brew                              # one of two possible paths
file $(which colima)                    # Mach-O x86_64 == wrong; arm64 == right
arch                                    # shell's running arch
ls /opt/homebrew/bin/brew 2>&1 | head   # is the arm64 brew installed?
```

If `which brew` → `/usr/local/bin/brew` (x86) AND `arch` → `arm64` → wrong brew installing wrong binaries.

## Fix

Three layered options, ordered by reversibility:

1. **Direct binary install (recommended):**
   ```bash
   curl -sSL -o ~/.local/bin/colima https://github.com/abiosoft/colima/releases/latest/download/colima-Darwin-arm64
   chmod +x ~/.local/bin/colima
   ```
   Bypasses brew entirely.

2. **Install via the arm64 brew** at `/opt/homebrew/bin/brew` (if it works and recognizes your OS):
   ```bash
   /opt/homebrew/bin/brew install colima
   ```

3. **Reorder PATH** so `/opt/homebrew/bin` comes before `/usr/local/bin`. Persistent but affects every subsequent install.

## Root cause

Apple Silicon Macs can run both arm64 native and x86 (Rosetta). Homebrew is per-prefix:
- `/usr/local/` — x86 / Intel / Rosetta (legacy)
- `/opt/homebrew/` — arm64 / Apple Silicon (native)

Both can coexist. Whichever's directory comes first in `$PATH` "wins" when you type `brew`. Many users have both because tools installed via Rosetta-launched Terminal vs native Terminal pick different brews.

## Prevention

- Check `file $(which <binary>)` after `brew install` of any compiled tool.
- Standardize on arm64 brew at `/opt/homebrew/bin`; uninstall x86 brew if you can.
- Document the prefix-of-record in `context/<project>-context.md` for new sessions.

## Related

- DR: [`docs/improvement/decision-records/0002-colima-over-docker-desktop.md`](../improvement/decision-records/0002-colima-over-docker-desktop.md)
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
