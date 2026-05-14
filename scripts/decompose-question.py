#!/usr/bin/env python3
"""
decompose-question.py — The AI Skills Library question decomposer.

For every incoming question/prompt/task, produces:
  1. Concise form  — stripped-down essence (≤20 words)
  2. Function label — action-verb category → maps to a skill

Logs to docs/faq/question-log.md and updates docs/faq/function-map.md.

Usage:
  python3 scripts/decompose-question.py "Your full question here"
  python3 scripts/decompose-question.py --stdin          (reads from stdin)
  python3 scripts/decompose-question.py --batch file.txt  (one question per line)
  python3 scripts/decompose-question.py --dry-run "..."  (preview only)
"""
from __future__ import annotations
import glob, hashlib, os, re, sys, time
from datetime import datetime, timezone
from typing import Optional

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_PATH     = os.path.join(ROOT, "docs", "faq", "question-log.md")
FUNCMAP_PATH = os.path.join(ROOT, "docs", "faq", "function-map.md")
CATCHALL_PATH = os.path.join(ROOT, "docs", "catchall", "queue.md")

DRY_RUN = "--dry-run" in sys.argv

# ── Stop words for concise-form extraction ───────────────────────────────────
FILLER = {
    "i", "need", "to", "know", "if", "we", "can", "the", "a", "an", "for",
    "with", "you", "like", "that", "this", "um", "uh", "kind", "sort", "of",
    "you know", "basically", "essentially", "just", "really", "actually",
    "its", "it's", "our", "my", "your", "their", "in", "on", "at", "by",
    "about", "into", "from", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "might", "may", "all", "things", "stuff", "something",
    "anything", "everything", "some", "any", "there", "here", "so", "and",
    "but", "or", "also", "too", "very", "quite", "pretty",
}

# ── Function label taxonomy ───────────────────────────────────────────────────
# Maps patterns in the question → (function-label, skill-name, skill-id)
FUNCTION_PATTERNS = [
    # Repo and project setup
    (r"set.up|create|start|init|scaffold|new.repo|new.project", "setup-repo",       "new-repo-setup",                     "SK-0135"),
    (r"align|reshape|bring.*standard|convert.*repo|existing.*repo", "align-repo",   "existing-repo-alignment",            "SK-0136"),
    (r"brand|readme|label|folder.*label|avery.*goodman",         "brand-repo",       "avery-goodman-repo-standard",        "SK-0003"),
    # Audit and quality
    (r"audit|gap|what.*left|elevation|after.*ship",              "audit-gaps",        "gap-audit-and-elevation",            "SK-0113"),
    (r"failure.proof|full.audit|six.month|boolean.lead",         "run-audit",         "failure-proof-audit",                "SK-0112"),
    (r"check|verify|validate|test|does.*pass",                    "run-check",         "make-check-defense-in-depth",        "SK-0025"),
    # Skills and library
    (r"write.*skill|create.*skill|new.*skill|add.*skill",         "write-skill",       "create-skill",                       "SK-0021"),
    (r"extract|retrospective|what.*learn|session.*lessons",       "extract-lessons",   "conversation-retrospective-extraction","SK-0017"),
    (r"nutrient|worth.*filing|what.*file|filter.*lessons",        "filter-nutrients",  "skill-nutrients-decanter",           "SK-0120"),
    # Ship and release
    (r"ship|release|merge|deploy|is.*live|confirm.*ship",         "verify-merge",      "confirm-ship-clearly",               "SK-0016"),
    (r"update|pull.*latest|git.*pull|make.*update",               "pull-latest",       "make-update-make-doctor",            "SK-0026"),
    # Architecture and structure
    (r"architect|structure|design.*system|how.*organized",        "design-structure",  "product-repo-architecture",          "SK-0007"),
    (r"type.*repo|what.*type|TYPE-00",                            "identify-type",     "new-repo-setup",                     "SK-0135"),
    # Marketing and docs
    (r"marketing|feature.*md|launch|channel.*copy|write.*doc",   "write-feature-md",  "feature-marketing-md",               "SK-0043"),
    # Catchall
    (r"catchall|nothing.*match|no.*skill|can.*handle",            "route-catchall",    "catchall-processor",                 "SK-0137"),
    # Annotation
    (r"cost.*annotation|what.*cost|what.*lose|before.*click",     "annotate-cost",     "cost-annotation-discipline",         "SK-0018"),
    # Unsafe ops
    (r"sudo|permission|chown|ownership|locked.*space",            "unlock-space",      "never-run-sudo-from-app",            "SK-0027"),
    # Tool calling / AI
    (r"tool.*calling|approval|agent.*action|AI.*approval",        "show-approval",     "tool-calling-approval-reentry",      "SK-0030"),
    (r"ai.*propose|propose.*skill|review.*inbox|proposal",        "review-proposal",   "ai-proposal-review-inbox",           "SK-0001"),
]


def derive_function(raw: str) -> tuple[str, str, str]:
    """Return (function-label, skill-name, skill-id) for a question."""
    lower = raw.lower()
    for pattern, label, skill, skill_id in FUNCTION_PATTERNS:
        if re.search(pattern, lower):
            return label, skill, skill_id
    return "handle-request", "catchall-processor", "SK-0137"


def make_concise(raw: str) -> str:
    """Strip a question down to its ≤20-word essence."""
    # Remove filler phrases first
    text = raw
    for phrase in ["you know", "basically", "essentially", "i need to know if",
                   "can you", "could you", "would you", "i was wondering"]:
        text = re.sub(re.escape(phrase), "", text, flags=re.IGNORECASE)

    # Tokenize, remove stop words, rebuild
    words = re.split(r"\s+", text.strip())
    meaningful = [w for w in words
                  if w.lower().rstrip(",.?!") not in FILLER and len(w) > 1]

    # Cap at 20 words and capitalize first word
    concise_words = meaningful[:20]
    if concise_words:
        concise_words[0] = concise_words[0].capitalize()
    concise = " ".join(concise_words)

    # Clean up trailing punctuation and add period if missing
    concise = re.sub(r"[,.?!]+$", "", concise).strip()
    if concise and not concise.endswith("."):
        concise += ""

    return concise or raw[:80]


def next_q_number() -> str:
    """Read the log and return the next Q-XXXX number."""
    if not os.path.exists(LOG_PATH):
        return "Q-0001"
    content = open(LOG_PATH).read()
    numbers = re.findall(r"## Q-(\d{4})", content)
    if not numbers:
        return "Q-0001"
    return f"Q-{int(max(numbers)) + 1:04d}"


def log_question(raw: str, session: str = "unknown", routed_to: str = "?",
                 outcome: str = "pending") -> dict:
    """Decompose and log one question. Returns the decomposition."""
    concise     = make_concise(raw)
    func_label, skill_name, skill_id = derive_function(raw)
    q_num = next_q_number()
    ts    = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    date  = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    entry = f"""
## {q_num} | {date} | {func_label}
**Raw:** {raw[:300]}
**Concise:** {concise}
**Function:** {func_label} → {skill_id} ({skill_name})
**Session:** {session}
**Routed to:** {routed_to}
**Outcome:** {outcome}

---
"""

    if not DRY_RUN:
        # Append to question log
        os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
        with open(LOG_PATH, "a") as f:
            f.write(entry)
        # Update function map
        update_function_map(func_label, skill_name, skill_id, concise)

    result = {
        "q_num":      q_num,
        "raw":        raw,
        "concise":    concise,
        "function":   func_label,
        "skill":      skill_name,
        "skill_id":   skill_id,
        "session":    session,
        "outcome":    outcome,
    }
    return result


def update_function_map(func_label: str, skill_name: str, skill_id: str,
                        concise: str) -> None:
    """Increment the count for a function label in function-map.md."""
    if not os.path.exists(FUNCMAP_PATH):
        return

    content = open(FUNCMAP_PATH).read()
    pattern = rf"^{re.escape(func_label)}: (\d+) uses"

    if re.search(pattern, content, re.MULTILINE):
        # Increment count
        def increment(m):
            return f"{func_label}: {int(m.group(1)) + 1} uses"
        content = re.sub(pattern, increment, content, flags=re.MULTILINE)
        # Also append the concise form to its "Common forms" block
        target = f"{func_label}: "
        idx = content.find(target)
        if idx != -1:
            block_end = content.find("\n\n", idx)
            if block_end != -1:
                content = content[:block_end] + f'\n  - "{concise}"' + content[block_end:]
    else:
        # Add new entry before the closing comment
        new_entry = (f"\n**`{func_label}`**: 1 use → {skill_id} ({skill_name})\n"
                     f'  Common forms:\n  - "{concise}"\n')
        content = content.rstrip() + "\n" + new_entry + "\n"

    open(FUNCMAP_PATH, "w").write(content)


def print_decomposition(result: dict) -> None:
    """Pretty-print the decomposition result."""
    print(f"\n{'DRY RUN — ' if DRY_RUN else ''}Decomposed {result['q_num']}:")
    print(f"  RAW:      {result['raw'][:80]}{'...' if len(result['raw']) > 80 else ''}")
    print(f"  CONCISE:  {result['concise']}")
    print(f"  FUNCTION: {result['function']} → {result['skill_id']} ({result['skill']})")
    print(f"  SESSION:  {result['session']}")


def main():
    args = sys.argv[1:]
    # Remove flags
    clean_args = [a for a in args if not a.startswith("--")]
    session    = next((sys.argv[i+1] for i, a in enumerate(sys.argv)
                       if a == "--session" and i+1 < len(sys.argv)), "cli")

    if "--stdin" in args:
        raw = sys.stdin.read().strip()
        if raw:
            result = log_question(raw, session=session)
            print_decomposition(result)

    elif "--batch" in args:
        batch_file = next((sys.argv[i+1] for i, a in enumerate(sys.argv)
                           if a == "--batch" and i+1 < len(sys.argv)), None)
        if batch_file and os.path.exists(batch_file):
            for line in open(batch_file):
                line = line.strip()
                if line and not line.startswith("#"):
                    result = log_question(line, session=session)
                    print_decomposition(result)

    elif clean_args:
        raw = " ".join(clean_args)
        result = log_question(raw, session=session)
        print_decomposition(result)

    else:
        print("Usage:")
        print("  python3 scripts/decompose-question.py 'Your question here'")
        print("  python3 scripts/decompose-question.py --stdin")
        print("  python3 scripts/decompose-question.py --batch questions.txt")
        print("  python3 scripts/decompose-question.py --dry-run 'Question'")


if __name__ == "__main__":
    main()
