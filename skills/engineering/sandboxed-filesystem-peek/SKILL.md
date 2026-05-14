---
name: sandboxed-filesystem-peek
description: >-
  Give an AI agent or third-party tool read-only filesystem access via a
  strict allowlist + hard-deny + symlink-resolution validator. Path-traversal
  proof. Returns metadata (size, is_dir) but never file contents. Designed for
  AI agents that need to investigate the user's machine without becoming a
  data-exfiltration vector. Triggers on "AI filesystem access", "let the agent
  look around", "filesystem peek sandbox", "ALLOWED_ROOTS DENY_ROOTS",
  "path-traversal protection for agent", "list_directory tool",
  "measure_path tool", "filesystem read sandbox", "AI agent can't see system
  files".
---

# Sandboxed filesystem peek — let the AI look around safely

When you build an AI agent that needs filesystem access — to investigate disk usage, to find files, to verify configurations — you have a security problem. Naive "let the agent read any path" is a data-exfiltration vector. The agent could be prompt-injected to read `~/.ssh/id_rsa` or `~/Library/Keychains/` and dump contents into a chat surface that ships to a third-party API.

The fix: a **strict allowlist + hard-deny + symlink-resolution** path validator, paired with **content-never-returned** semantics. The agent can `measure_path` (return size) and `list_directory` (return {name, is_dir, size_bytes} per child) — but never `cat` a file. Path validation resolves symlinks first so they can't sneak through.

## When to use this skill

- Building an AI agent (Anthropic / OpenAI tool-use) that needs filesystem read access
- Designing the `measure_path` / `list_directory` tools for an agent
- Auditing an AI tool that has FS access — checking whether `/etc/passwd` is reachable
- The user says "the AI can see my files" with concern
- Building any tool where prompt injection could leak data via filesystem reads

## The architecture (four pieces)

1. **Hard-deny root list.** Paths under these are rejected, period.
2. **Hard-deny sub-path list.** Paths under HOME but in specific known-sensitive places.
3. **Allowed-roots list.** The path must be under at least one entry here.
4. **Symlink resolution before allowlist check.** So `/Applications/Safari.app → /System/Applications/Safari.app` correctly gets denied.

Returns: `None` if blocked, the resolved `Path` if allowed.

## Canonical implementation (Python, from DustPan)

```python
from pathlib import Path
import os

HOME = Path.home()

DENY_ROOTS_HARD = {
    "/etc", "/System", "/usr", "/bin", "/sbin", "/var", "/private",
    "/dev", "/Library", "/Network", "/cores", "/.vol",
}

DENY_SUBPATHS = [
    HOME / ".ssh",
    HOME / ".aws",
    HOME / ".gnupg",
    HOME / ".config" / "gh" / "hosts.yml",
    HOME / "Library" / "Keychains",
    HOME / "Library" / "Mail",
    HOME / "Library" / "Messages",
    HOME / "Library" / "Application Support" / "MobileSync" / "Backup",
    HOME / "Library" / "Cookies",
    HOME / "Library" / "PersonalAssistant",
]

ALLOWED_ROOTS = [
    HOME / "Library" / "Caches",
    HOME / "Library" / "Application Support",
    HOME / "Library" / "Containers",
    HOME / "Library" / "Developer",
    HOME / "Library" / "Logs",
    HOME / "Developer",
    HOME / "Documents",
    HOME / "Downloads",
    HOME / "Desktop",
    HOME / "Movies",
    HOME / "Music",
    HOME / "Pictures",
    HOME / ".cache",
    HOME / ".npm",
    HOME / ".cargo",
    HOME / ".pnpm-store",
    Path("/Applications"),
]


def validate_peek_path(raw: str):
    """Return resolved Path if safe to read, else None."""
    if not raw or not isinstance(raw, str):
        return None
    try:
        p = Path(os.path.expanduser(raw.strip())).resolve(strict=False)
    except (OSError, RuntimeError):
        return None

    p_str = str(p)
    for deny in DENY_ROOTS_HARD:
        if p_str == deny or p_str.startswith(deny + "/"):
            return None

    for deny in DENY_SUBPATHS:
        try:
            p.relative_to(deny)
            return None
        except ValueError:
            pass

    for root in ALLOWED_ROOTS:
        try:
            p.relative_to(root)
            return p
        except ValueError:
            pass

    return None
```

## The two safe tools the agent gets

`measure_path(path)` — returns `{path, exists, size_gb, is_dir, is_symlink}`. Nothing else.

`list_directory(path)` — returns up to 50 children sorted by size desc, each entry `{name, is_dir, size_bytes, is_symlink}`. **Never returns file contents.**

That's it. Both route through `validate_peek_path()`.

## Critical correctness properties

1. **`resolve(strict=False)` is called BEFORE allowlist check.** This catches symlinks. On macOS Tahoe, `/Applications/Safari.app` resolves to `/System/Applications/Safari.app`, which hits the `/System` hard-deny. Without symlink resolution, an agent could read system apps by following the friendly path.

2. **`relative_to()` is the right primitive.** It raises `ValueError` if the path is not under the candidate root. Don't use string-prefix matching (`path.startswith(root)`) — that's buggy with trailing slashes and tilde expansion order.

3. **Hard-deny is checked BEFORE allow.** So a path that is BOTH in an allowed root AND under a deny sub-path (e.g. `~/Library/Application Support/MobileSync/Backup/...`) is correctly denied.

4. **Cap directory listings.** 50 entries max. Prevents memory exhaustion on huge dirs.

5. **Never expose file contents.** `list_directory` only returns names + sizes. There is no `read_file` tool. The agent can know that `~/Library/Caches/JetBrains/PyCharm2024.1` is 3.4 GB and contains some folders — it cannot read what's in them.

## What gets denied (validated examples)

| Input | Result |
|---|---|
| `~/Library/Caches` | ALLOWED |
| `~/Library/Containers/com.docker` | ALLOWED |
| `~/Developer/something` | ALLOWED |
| `~/Downloads` | ALLOWED |
| `~/.ssh` | BLOCKED |
| `~/.ssh/id_rsa` | BLOCKED |
| `/etc/passwd` | BLOCKED |
| `/System/Library` | BLOCKED |
| `~/Library/Keychains` | BLOCKED |
| `~/Library/Messages` | BLOCKED |
| `/Applications/Safari.app` | BLOCKED (resolves through symlink to /System/Applications/) |
| `""` (empty) | BLOCKED |

## Tool registration (Anthropic + OpenAI shape)

The DustPan pattern: a single tool registry dict projects into both Anthropic `tool_use` and OpenAI `function-calling` shapes. The path-touching tools are Tier A (read-only, no approval):

```python
{
    "name": "measure_path",
    "description": (
        "Measure on-disk size of a specific path (du -sh equivalent). "
        "Only paths under ~/Library, ~/Developer, ~/Documents, ~/Downloads, "
        "~/Desktop, ~/Movies, ~/Music, ~/Pictures, /Applications, and common "
        "dev caches (~/.npm, ~/.cargo, etc.) are allowed. System dirs are blocked."
    ),
    "input_schema": {
        "type": "object",
        "properties": {"path": {"type": "string"}},
        "required": ["path"],
    },
    "tier": "A", "requires_approval": False,
    "handler": _h_measure_path,
}
```

## Pairing

This skill pairs with:
- **`never-run-sudo-from-app`** — the agent can READ via this, but can't WRITE / DELETE / sudo. The action surface stays minimal.
- **`tool-calling-approval-reentry`** — even for tools that don't need approval, the rest of the agent flow benefits from the same surface.

## Anti-patterns

- ❌ String-prefix allowlist (`if path.startswith("~/")` — defeated by `~/` → `/Users/me/../...`)
- ❌ Symlink check AFTER allowlist (defeated by symlinks pointing into denied roots)
- ❌ A `read_file` tool that returns contents. Even with allowlist, contents = data exfiltration risk.
- ❌ No cap on directory listing entries (memory exhaustion + huge prompt-injection surface)
- ❌ Trusting user-supplied path strings without resolution

## Invocation

- "Use **sandboxed-filesystem-peek**."
- "Design the filesystem-access sandbox for this AI agent."
- "Audit `measure_path` / `list_directory` for path-traversal."
- "What's the right allowlist for an agent that needs to investigate disk usage?"

## Reference implementation

DustPan v0.23. The validator + tools live in [`web/agent_tools.py`](https://github.com/marvelousempire/dustpan/blob/main/web/agent_tools.py). Test cases for the validator (allowed + denied + symlink-following) are in the plan file [`plans/0023-conversational-sadpa-agent.md`](https://github.com/marvelousempire/dustpan/blob/main/plans/0023-conversational-sadpa-agent.md).
