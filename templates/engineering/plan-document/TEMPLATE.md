# Plan NNNN — [Short descriptive title]

<!-- Replace NNNN with the next number in plans/. Find it: ls plans/ | sort -n | tail -1 -->
<!-- Status line (add when shipped): Status: shipped (commit <sha>, v<version>) -->

## Context

Why this change is being made. What prompted it. The intended outcome.

What is the problem or need this addresses? What is broken today, what requested it, and what will be different when this ships?

## Tasks (precise todos)

<!-- Each task: file path + function name + exact change + dependencies on other tasks -->

1. [task description — specific file, function, what changes]
2. [task description]
3. [task description]

## Critical files

Every path that will be created or modified:

| File | Action |
|---|---|
| `path/to/file.ext` | NEW / EXTEND / MODIFY |

## Verification

How to know it's done correctly. Include the literal command AND expected output.

```sh
# Example:
pnpm tsc --noEmit          # → (no output = clean)
pnpm build                 # → ✓ built in X.XXs
make check                 # → ✓ all assertions pass
```

Also describe: what to see in the UI, what to curl, what the user flow looks like end-to-end.

## Out of scope

What is intentionally NOT being done and why. Prevents scope creep. Documents deliberate non-decisions so future contributors don't add "one more thing."

- [item] — reason
- [item] — reason
