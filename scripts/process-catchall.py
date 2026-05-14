#!/usr/bin/env python3
"""
process-catchall.py — The AI Skills Library catchall processor.

Reads every pending item in docs/catchall/queue.md, tries to match it to
an existing skill or rule, handles what it can, and files proposals for gaps.
Run by GitHub Actions on every push to queue.md and hourly.

Usage:
  python3 scripts/process-catchall.py
  python3 scripts/process-catchall.py --dry-run
  python3 scripts/process-catchall.py --item "build a dashboard"
"""
from __future__ import annotations
import glob, hashlib, json, os, re, sys, time
from datetime import datetime, timezone
from typing import Optional

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUEUE_PATH  = os.path.join(ROOT, "docs", "catchall", "queue.md")
PROPOSALS_PATH = os.path.join(ROOT, "docs", "proposals", "catchall-proposals.md")

DRY_RUN = "--dry-run" in sys.argv


# ── Index builder ─────────────────────────────────────────────────────────────

def build_product_index() -> list[dict]:
    """Read every SKILL.md and body.md and build a searchable index."""
    index = []
    skill_files = glob.glob(os.path.join(ROOT, "skills", "**", "SKILL.md"), recursive=True)
    rule_files  = glob.glob(os.path.join(ROOT, "rules", "library", "*", "body.md"))

    for path in skill_files + rule_files:
        try:
            content = open(path).read()
        except Exception:
            continue

        product = {"path": path, "type": "skill" if "SKILL.md" in path else "rule"}
        in_fm = fm_open = False
        for line in content.splitlines():
            s = line.strip()
            if s == "---":
                if not fm_open:
                    fm_open = in_fm = True
                else:
                    in_fm = False
                continue
            if in_fm:
                for field in ("name", "id", "goal", "description"):
                    if s.startswith(f"{field}:"):
                        product[field] = s[len(field)+1:].strip().strip("\"'>-").strip()
                if s.startswith("keywords:"):
                    kw_str = s[9:].strip().strip("[]")
                    product["keywords"] = [k.strip() for k in kw_str.split(",")]

        if "name" in product:
            index.append(product)

    return index


# ── Matcher ───────────────────────────────────────────────────────────────────

def score_product(request: str, product: dict) -> float:
    """Score how well a product matches a request. Higher = better."""
    req_words = set(re.split(r"[\s\-_,]", request.lower()))
    score = 0.0

    name_words = set(re.split(r"[\s\-_]", product.get("name", "").lower()))
    kw_words   = set(" ".join(product.get("keywords", [])).replace("-", " ").split())
    desc       = product.get("description", "").lower()
    goal       = product.get("goal", "").lower()

    # Keyword action-verb matches (strong signal)
    for kw in product.get("keywords", []):
        kw_parts = kw.replace("-", " ").split()
        if any(w in req_words for w in kw_parts):
            score += 3.0

    # Name token matches
    overlap = req_words & name_words
    score += len(overlap) * 2.0

    # Description contains request words
    desc_matches = sum(1 for w in req_words if len(w) > 3 and w in desc)
    score += desc_matches * 1.0

    # Goal contains request words
    goal_matches = sum(1 for w in req_words if len(w) > 3 and w in goal)
    score += goal_matches * 0.5

    return score


def find_matches(request: str, index: list[dict], top_n: int = 3) -> list[dict]:
    """Return the top N matching products for a request."""
    scored = [(score_product(request, p), p) for p in index]
    scored.sort(key=lambda x: x[0], reverse=True)
    return [(score, p) for score, p in scored[:top_n] if score > 0]


# ── Queue parser ──────────────────────────────────────────────────────────────

def parse_queue(content: str) -> list[dict]:
    """Parse queue.md into a list of items."""
    items = []
    current: Optional[dict] = None
    for line in content.splitlines():
        if line.startswith("## ") and not line.startswith("## [DATE]"):
            if current:
                items.append(current)
            current = {"title": line[3:].strip(), "raw_lines": [line]}
            continue
        if current is None:
            continue
        current["raw_lines"].append(line)
        if line.startswith("**Received:**"):
            current["received"] = line.split("**Received:**")[1].strip()
        elif line.startswith("**Request:**"):
            current["request"] = line.split("**Request:**")[1].strip()
        elif line.startswith("**Session:**"):
            current["session"] = line.split("**Session:**")[1].strip()
        elif line.startswith("**Attempted matches:**"):
            current["attempted"] = line.split("**Attempted matches:**")[1].strip()
        elif line.startswith("**Status:**"):
            current["status"] = line.split("**Status:**")[1].strip()
    if current:
        items.append(current)
    return items


def update_item_status(content: str, title: str, new_status: str, note: str = "") -> str:
    """Update the status line of an item in queue.md content."""
    lines = content.splitlines(keepends=True)
    in_item = False
    for i, line in enumerate(lines):
        if line.startswith("## ") and title in line:
            in_item = True
        if in_item and line.startswith("**Status:**"):
            lines[i] = f"**Status:** {new_status}\n"
            if note:
                lines.insert(i + 1, f"**Resolution:** {note}\n")
            break
    return "".join(lines)


# ── Proposal filer ────────────────────────────────────────────────────────────

def file_proposal(item: dict, matches: list) -> str:
    """Generate a skill proposal for an unmatched catchall item."""
    request = item.get("request", item["title"])
    date    = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Derive a skill name guess from the request
    words = re.split(r"[\s,]+", request.lower())
    stops = {"a","an","the","for","with","to","in","of","from","and","or","is","are"}
    tokens = [w for w in words if w not in stops and len(w) > 2][:3]
    skill_name = "-".join(tokens) if tokens else "new-catchall-skill"

    proposal = f"""
## {date} — {item['title']}

**Triggered by catchall item:** `{item['title']}`
**Original request:** {request}
**Session:** {item.get('session', 'unknown')}

**Closest existing products:**
"""
    if matches:
        for score, p in matches:
            proposal += f"  - `{p.get('name', '?')}` (score: {score:.1f}) — {p.get('goal', 'no goal')}\n"
    else:
        proposal += "  - None found\n"

    proposal += f"""
**Proposed skill name:** `{skill_name}`
**Proposed goal:** Deliver {skill_name.replace('-', ' ')} output correctly and completely.
**Proposed keywords:** [{tokens[0]+'-request' if tokens else 'handle-request'}, check-output, file-result]
**Status:** pending-review

---
"""
    return proposal


# ── Main ──────────────────────────────────────────────────────────────────────

def process_queue():
    """Main entry point — process all pending items in the queue."""
    print(f"{'DRY RUN — ' if DRY_RUN else ''}Processing catchall queue...")
    print(f"  Queue: {QUEUE_PATH}")

    if not os.path.exists(QUEUE_PATH):
        print("  Queue file not found. Nothing to process.")
        return

    queue_content = open(QUEUE_PATH).read()
    items = parse_queue(queue_content)
    pending = [i for i in items if i.get("status", "").strip() == "pending"]

    if not pending:
        print("  No pending items. Queue is clear.")
        return

    print(f"  Found {len(pending)} pending item(s).")
    index = build_product_index()
    print(f"  Library index: {len(index)} products loaded.")

    proposals = []
    updated_content = queue_content

    for item in pending:
        request = item.get("request", item["title"])
        print(f"\n  Processing: {item['title']}")
        print(f"    Request: {request[:80]}")

        matches = find_matches(request, index, top_n=3)

        if matches and matches[0][0] >= 4.0:
            # Strong match — can attempt to handle
            best_score, best_product = matches[0]
            note = (f"Matched to `{best_product['name']}` (score {best_score:.1f}). "
                    f"Goal: {best_product.get('goal', 'N/A')}. "
                    f"Invoke this skill to handle the request.")
            print(f"    → HANDLED by {best_product['name']} (score {best_score:.1f})")
            updated_content = update_item_status(
                updated_content, item["title"], "handled", note
            )
        elif matches and matches[0][0] >= 2.0:
            # Partial match — flag for human review with suggestion
            best_score, best_product = matches[0]
            note = (f"Partial match: `{best_product['name']}` (score {best_score:.1f}). "
                    f"Needs human review — close but not definitive.")
            print(f"    → NEEDS-HUMAN: partial match {best_product['name']} ({best_score:.1f})")
            updated_content = update_item_status(
                updated_content, item["title"], "needs-human", note
            )
            proposals.append(file_proposal(item, matches))
        else:
            # No match — file a proposal for a new skill
            print(f"    → PROPOSED: no match found, filing skill proposal")
            updated_content = update_item_status(
                updated_content, item["title"], "proposed",
                "No match found. Skill proposal filed in docs/proposals/catchall-proposals.md"
            )
            proposals.append(file_proposal(item, matches))

    # Write updated queue
    if not DRY_RUN:
        open(QUEUE_PATH, "w").write(updated_content)
        print(f"\n  ✅ Queue updated.")

        # Append proposals
        if proposals:
            os.makedirs(os.path.dirname(PROPOSALS_PATH), exist_ok=True)
            with open(PROPOSALS_PATH, "a") as f:
                for p in proposals:
                    f.write(p)
            print(f"  ✅ {len(proposals)} proposal(s) filed to {PROPOSALS_PATH}")
    else:
        print(f"\n  DRY RUN: would update {len(pending)} items, file {len(proposals)} proposals.")


def process_single(request: str):
    """Process a single request string (for testing)."""
    print(f"Processing single request: '{request}'")
    index = build_product_index()
    print(f"Library: {len(index)} products")
    matches = find_matches(request, index, top_n=5)
    print("\nTop matches:")
    for score, p in matches:
        print(f"  [{score:.1f}] {p.get('name')} ({p.get('type')}) — {p.get('goal', 'no goal')[:60]}")


if __name__ == "__main__":
    single = next((sys.argv[i+1] for i, a in enumerate(sys.argv)
                   if a == "--item" and i+1 < len(sys.argv)), None)
    if single:
        process_single(single)
    else:
        process_queue()
