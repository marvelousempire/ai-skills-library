#!/usr/bin/env python3
"""
generate-system-prompt.py — System prompt injector.

Compresses GUIDE.md + top skills by goal + all rules into a single system
prompt that can be prepended to any AI session. For AI systems that don't
support MCP or RAG — this is the "copy-paste brain injection."

Usage:
  python3 scripts/generate-system-prompt.py                    # full prompt
  python3 scripts/generate-system-prompt.py --compact          # condensed
  python3 scripts/generate-system-prompt.py --skills-only      # just skills
  python3 scripts/generate-system-prompt.py --rules-only       # just rules
  python3 scripts/generate-system-prompt.py --output prompt.md # save to file
"""
from __future__ import annotations
import glob, os, re, sys
from pathlib import Path

ROOT   = Path(__file__).parent.parent
GUIDE  = ROOT / "GUIDE.md"
OUTPUT = next((sys.argv[i+1] for i, a in enumerate(sys.argv)
               if a == "--output" and i+1 < len(sys.argv)), None)
COMPACT     = "--compact" in sys.argv
SKILLS_ONLY = "--skills-only" in sys.argv
RULES_ONLY  = "--rules-only" in sys.argv


def read_frontmatter(path: str) -> dict:
    p = {}
    in_fm = fm_open = False
    for line in open(path).read().splitlines():
        s = line.strip()
        if s == "---":
            if not fm_open: fm_open = in_fm = True
            else: in_fm = False
            continue
        if in_fm:
            for field in ("name","id","goal","description"):
                if s.startswith(f"{field}:"):
                    p[field] = s[len(field)+1:].strip().strip("\"'>-").strip()
            if s.startswith("keywords:"):
                p["keywords"] = [k.strip() for k in s[9:].strip().strip("[]").split(",")]
    return p


def build_prompt() -> str:
    sections = []

    # ── Header ────────────────────────────────────────────────────────────────
    sections.append(
        "# AI SKILLS LIBRARY — OPERATING BRAIN\n"
        "**managed by the duty and order of AVERY GOODMAN**\n\n"
        "You have been given the AI Skills Library as your operating brain. "
        "Read the following and operate accordingly. Do not improvise what is "
        "already defined here.\n"
    )

    # ── Core operating rules (compressed from GUIDE.md) ───────────────────────
    if not SKILLS_ONLY and not RULES_ONLY:
        sections.append(
            "## HOW TO OPERATE\n\n"
            "1. **Check the library before acting.** Every request should be matched "
            "to a skill, rule, or agent in this library. If no match exists, log it "
            "to the catchall.\n\n"
            "2. **Order of operations:** Rules fire first (always-on). Then match the "
            "request to a skill. Check the skill's `before:` list and run prerequisites. "
            "Execute the skill. Surface `relations:` as next steps.\n\n"
            "3. **Decompose before routing.** Every raw question → concise form (≤20 words) "
            "+ function label. The function label is your routing signal.\n\n"
            "4. **Rules govern how skills run.** Rules are policies. Skills are procedures. "
            "The router merges both.\n"
        )

    # ── Skills index (compact) ────────────────────────────────────────────────
    if not RULES_ONLY:
        skill_files = sorted(glob.glob(str(ROOT / "skills" / "**" / "SKILL.md"), recursive=True))
        skill_rows = []
        for path in skill_files:
            p = read_frontmatter(path)
            if not p.get("name"): continue
            kw_str = ", ".join(p.get("keywords", []))
            goal   = p.get("goal", "")[:70]
            if COMPACT:
                skill_rows.append(f"- `{p['name']}` ({p.get('id','?')}): {goal}")
            else:
                skill_rows.append(
                    f"| `{p['name']}` | {p.get('id','?')} | {kw_str} | {goal} |"
                )

        if COMPACT:
            sections.append("## SKILLS\n\n" + "\n".join(skill_rows) + "\n")
        else:
            header = "## SKILLS\n\n| Name | ID | Keywords | Goal |\n|---|---|---|---|\n"
            sections.append(header + "\n".join(skill_rows) + "\n")

    # ── Rules index ───────────────────────────────────────────────────────────
    if not SKILLS_ONLY:
        rule_files = sorted(glob.glob(str(ROOT / "rules" / "library" / "*" / "body.md")))
        rule_rows = []
        for path in rule_files:
            p = read_frontmatter(path)
            if not p.get("name"): continue
            # Read the "When this fires" section
            content = open(path).read()
            fires_match = re.search(r"## When this fires\s*\n(.+?)(?=\n##|\Z)", content, re.DOTALL)
            fires = fires_match.group(1).strip()[:60] if fires_match else ""
            kw_str = ", ".join(p.get("keywords", []))
            if COMPACT:
                rule_rows.append(f"- `{p['name']}` ({p.get('id','?')}): {fires}")
            else:
                rule_rows.append(
                    f"| `{p['name']}` | {p.get('id','?')} | {kw_str} | {fires} |"
                )

        if COMPACT:
            sections.append("## RULES (always-on)\n\n" + "\n".join(rule_rows) + "\n")
        else:
            header = "## RULES (always-on)\n\n| Name | ID | Keywords | Fires when |\n|---|---|---|---|\n"
            sections.append(header + "\n".join(rule_rows) + "\n")

    # ── Catchall instruction ───────────────────────────────────────────────────
    if not SKILLS_ONLY and not RULES_ONLY:
        sections.append(
            "## CATCHALL\n\n"
            "If no skill matches: log the request to `docs/catchall/queue.md`. "
            "The GitHub Actions processor will match it or file a skill proposal. "
            "The library has no permanent blind spots.\n"
        )

    prompt = "\n".join(sections)
    char_count = len(prompt)
    token_est  = char_count // 4
    print(f"Generated: {char_count:,} chars ≈ {token_est:,} tokens", file=sys.stderr)
    return prompt


if __name__ == "__main__":
    prompt = build_prompt()
    if OUTPUT:
        open(OUTPUT, "w").write(prompt)
        print(f"Saved to {OUTPUT}", file=sys.stderr)
    else:
        print(prompt)
