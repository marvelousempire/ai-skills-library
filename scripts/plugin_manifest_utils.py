"""Shared helpers for skill/agent WordPress-style plugin manifests."""
from __future__ import annotations

import re
from pathlib import Path


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end]
    out: dict[str, str] = {}
    lines = block.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if not m:
            i += 1
            continue
        key, val = m.group(1), m.group(2).strip()
        if val in (">-", ">", "|", "|-"):
            folded: list[str] = []
            i += 1
            while i < len(lines) and lines[i].startswith("  "):
                folded.append(lines[i].strip())
                i += 1
            out[key] = " ".join(folded)
            continue
        if val.startswith('"') and val.endswith('"'):
            val = val[1:-1]
        elif val.startswith("'") and val.endswith("'"):
            val = val[1:-1]
        out[key] = val
        i += 1
    return out


def body_summary(text: str) -> str:
    if not text.startswith("---"):
        rest = text
    else:
        end = text.find("\n---", 3)
        if end == -1:
            return ""
        rest = text[end + 4 :].lstrip()
    for para in re.split(r"\n\s*\n", rest):
        para = re.sub(r"^#+\s*", "", para.strip())
        para = re.sub(r"\s+", " ", para).strip()
        if len(para) > 40:
            return para
    return ""


def parse_list_field(fm: dict[str, str], key: str) -> list[str]:
    raw = fm.get(key, "").strip()
    if not raw:
        return []
    if raw.startswith("[") and raw.endswith("]"):
        inner = raw[1:-1]
        parts = [p.strip().strip("'\"") for p in inner.split(",") if p.strip()]
        return [p for p in parts if p]
    return [raw]


def first_sentence(desc: str, max_len: int = 160) -> str:
    desc = re.sub(r"\s+", " ", desc).strip()
    if len(desc) <= max_len:
        return desc
    cut = desc[: max_len - 1].rsplit(" ", 1)[0]
    return cut + "…"


def slug_to_title(slug: str) -> str:
    return " ".join(w.capitalize() for w in slug.split("-"))


def extract_philosophy_blockquote(text: str) -> str | None:
    m = re.search(
        r"## Philosophy[^\n]*\n+\s*>\s*\*\*(.+?)\*\*",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    if m:
        return m.group(1).strip()
    return None


def infer_slug_from_heading(text: str, fallback: str) -> str:
    m = re.search(r"^#\s+Agent(?:\s+contract)?:\s*([a-z0-9-]+)", text, re.M | re.I)
    if m:
        return m.group(1).strip().lower()
    m = re.search(r"^#\s+Agent:\s*([a-z0-9-]+)", text, re.M | re.I)
    if m:
        return m.group(1).strip().lower()
    return fallback
