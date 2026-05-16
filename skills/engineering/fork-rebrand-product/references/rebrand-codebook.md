# Fork/Rebrand Codebook

This reference captures the exact process and Python patterns used during the
Membadat fork/rebrand.

## Membadat Inputs

```yaml
old_name: claude-mem
new_name: membadat
display_name: Membadat
upstream_repo: thedotmack/claude-mem
target_repo: marvelousempire/membadat
local_checkout: /Users/nivram/Developer/membadat
legacy_env_prefix: CLAUDE_MEM
new_env_prefix: MEMBADAT
legacy_data_dir: ~/.claude-mem
new_data_dir: ~/.membadat
```

## GitHub And Clone Commands

```bash
gh repo view "marvelousempire/membadat" --json nameWithOwner,url,isPrivate,defaultBranchRef,description
gh repo create "marvelousempire/membadat" --private --description "Membadat - SYNTHIA memory tissue forked from claude-mem" --clone=false
git clone "https://github.com/thedotmack/claude-mem.git" "/Users/nivram/Developer/membadat"
cd "/Users/nivram/Developer/membadat"
git remote rename origin upstream
git remote add origin "https://github.com/marvelousempire/membadat.git"
git remote -v
```

## Broad Text Replacement Pattern

The first pass used a Python script equivalent to:

```python
from pathlib import Path

root = Path("/Users/nivram/Developer/membadat")
exts = {".md", ".json", ".ts", ".js", ".cjs", ".mjs", ".sh", ".yml", ".yaml", ".toml", ".txt", ".tsx", ".css", ".html"}
repls = [
    ("CLAUDE_MEM", "MEMBADAT"),
    ("claude_mem", "membadat"),
    ("Claude-Mem", "Membadat"),
    ("Claude-mem", "Membadat"),
    ("claude-mem", "membadat"),
    ("Claude Mem", "Membadat"),
    ("Claude memory", "Membadat memory"),
]

for path in root.rglob("*"):
    if not path.is_file() or path.suffix.lower() not in exts or ".git" in path.parts:
        continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    new = text
    for old, replacement in repls:
        new = new.replace(old, replacement)
    if new != text:
        path.write_text(new, encoding="utf-8")
```

Use `scripts/rebrand_text.py` for a reusable version.

## Ownership Replacement Pattern

After broad text replacement, repo ownership was corrected separately:

```python
repls = [
    ("thedotmack/membadat", "marvelousempire/membadat"),
    ("marketplaces/thedotmack", "marketplaces/marvelousempire"),
    ("cache/thedotmack", "cache/marvelousempire"),
    ("membadat@thedotmack", "membadat@marvelousempire"),
    ("membadat-thedotmack", "membadat-marvelousempire"),
]
```

This separate pass matters because upstream attribution should still mention
`thedotmack/claude-mem` in `NOTICE.md` and rebrand inventory.

## JSON Metadata Normalization Pattern

The rebrand normalized package and plugin JSON with a Node snippet. The reusable
Python equivalent is `scripts/normalize_json_metadata.py`.

Fields to normalize:

- `name`
- `description`
- `author`
- `contributors`
- `repository`
- `homepage`
- `bugs`
- `bin`
- plugin `interface.displayName`
- plugin `interface.shortDescription`
- plugin `interface.longDescription`
- plugin `interface.developerName`
- plugin `interface.websiteURL`

## Compatibility Fallback Pattern

Keep legacy values only for real persisted state. The Membadat example kept:

```ts
if (process.env.CLAUDE_MEM_DATA_DIR) {
  return process.env.CLAUDE_MEM_DATA_DIR;
}

const legacySettingsPath = join(homedir(), '.claude-mem', 'settings.json');
```

The new default remained:

```ts
const defaultDataDir = join(homedir(), '.membadat');
```

## Verification Pattern

Stale old-name references are allowed only in:

- `NOTICE.md`
- `docs/rebrand-inventory.md`
- explicit migration docs
- compatibility fallback code
- license or attribution files

All other matches require review.

Use:

```bash
python3 skills/engineering/fork-rebrand-product/scripts/verify_rebrand.py \
  --root /Users/nivram/Developer/membadat \
  --old-name claude-mem \
  --new-name membadat \
  --allowed-old-path NOTICE.md \
  --allowed-old-path docs/rebrand-inventory.md \
  --allowed-old-path src/shared/paths.ts
```
