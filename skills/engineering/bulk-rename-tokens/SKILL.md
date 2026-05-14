---
name: bulk-rename-tokens
id: SK-0014
keywords: [bulk, rename, tokens]
description: >-
  Mass-rename a token across N files using a Python script written to /tmp via Bash heredoc. Avoids the zsh/bash escape pitfalls of inline Python heredocs. Use for feature ID renumbering, slug rename, version bump cascade.
trigger: >-
  Use when renaming the same token across 3+ files in a deterministic way. Also fires when feature IDs need shifting after a race-condition collision.
---

# /bulk-rename-tokens

## What this skill does

The fast + safe pattern:

```bash
cat > /tmp/rewrite.py <<'PY_EOF'
import re

mapping = {
    'old_token_1': 'new_token_1',
    'old_token_2': 'new_token_2',
}

paths = [
    'path/to/file1.md',
    'path/to/file2.sql',
]

def sub(m):
    return mapping.get(m.group(0), m.group(0))

# Word-boundary regex prevents partial-substring matches
pattern = r'\b(' + '|'.join(re.escape(k) for k in mapping) + r')\b'

for p in paths:
    with open(p) as f:
        src = f.read()
    dst = re.sub(pattern, sub, src)
    if dst != src:
        with open(p, 'w') as f:
            f.write(dst)
        print(f'rewrote: {p}')
PY_EOF
python3 /tmp/rewrite.py
```

## Why write to /tmp first

- Inline heredocs with `python3 <<'PYEOF'` work in bash but zsh sometimes mangles backslash escapes in regex patterns
- A temp file is bulletproof — bash writes it once, python reads it once, no shell escaping

## When to use word-boundary `\b`

When the tokens are alphanumeric and you want to match whole words only — don't match `530` inside `15305`.

## When to use negative lookahead instead

For numeric tokens where the rule "not preceded/followed by a digit" matters:

```python
re.sub(r'(?<![0-9])(53[0-9])(?![0-9])', sub, src)
```

This catches `530` in `('530', ...)` but NOT in `15305` or `0530xyz`.

## Origin

Trainer-marketplace session: renumbered feature IDs 530–547 → 548–565 across two markdown files (99 + 22 shifts) with one Python script. See [`rules/library/bulk-token-substitution`](../../../rules/library/bulk-token-substitution/body.md).
