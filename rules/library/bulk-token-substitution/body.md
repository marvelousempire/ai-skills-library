# Bulk token substitution — Python-in-Bash beats N Edit calls

When you need to rewrite the same token across 3+ files (feature ID renumber, slug rename, version bump in many places), the fast + safe pattern is a Python heredoc in Bash. Write the script to a temp file via Bash heredoc, then invoke `python3` against it — this avoids zsh/bash double-escape issues that arise when embedding Python directly via `<<PYEOF`.

```bash
cat > /tmp/rewrite.py <<'PY_EOF'
import re
mapping = {'530': '548', '531': '549', '532': '550'}
paths = ['docs/Plan-X.md', 'docs/Feature Ledger.md', 'backend/migrations/0165.sql']

def sub(m): return mapping.get(m.group(0), m.group(0))

for p in paths:
    with open(p) as f: src = f.read()
    dst = re.sub(r'(?<![0-9])(53[0-9])(?![0-9])', sub, src)
    if dst != src:
        with open(p, 'w') as f: f.write(dst)
        print(f'rewrote: {p}')
PY_EOF
python3 /tmp/rewrite.py
```

## Why not N Edit calls?

- 18 Edit calls = 18 round-trips with potential for one to fail mid-way and leave inconsistent state
- Edit's `old_string` matching is exact-substring; if any token has surrounding chars that vary, you need 18 different old_strings
- Python's regex lookahead/lookbehind protects against partial matches (e.g. 530 vs 5305)

## When to still use Edit

- 1-2 substitutions
- The change isn't deterministic (you're editing surrounding context too)
- The file isn't tracked in git yet

## Origin

Trainer-marketplace session: renumbered feature IDs 530-547 to 548-565 across two markdown files (99 + 22 token shifts) with one Python script. Same job via 18 Edit calls would have been ~10x slower and risked inconsistent state.
