#!/usr/bin/env python3
"""
stamp-product-ids.py — Plan 0027 upgrade.

Stamps every product in the AI Skills Library with the full 8-field schema:
  name, id, hash, keywords (action-based), relations, before, governed_by, meta

Products:
  SKILL.md files              -> id: SK-XXXX
  rules/library/*/body.md    -> id: RL-XXXX

Keywords are action-based verb-object tags (up to 2 words, hyphenated).
Keywords are ALWAYS overwritten. Other new fields are only added if missing.

Usage:
  python3 scripts/stamp-product-ids.py              # apply all changes
  python3 scripts/stamp-product-ids.py --dry-run    # preview without writing
  python3 scripts/stamp-product-ids.py --dustpan /path/to/dustpan
"""
from __future__ import annotations
import glob, hashlib, os, re, sys
from typing import Optional

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Action keyword lookup - manually curated verb-object tags
ACTION_KEYWORDS = {
    "failure-proof-audit":              ["run-audit", "check-gaps", "build-leadsheet"],
    "gap-audit-and-elevation":          ["audit-gaps", "propose-elevations", "file-audit"],
    "create-skill":                     ["write-skill", "define-schema", "stamp-product"],
    "skill-nutrients-decanter":         ["filter-nutrients", "extract-lessons", "compound-learning"],
    "skill-writing-voice":              ["enforce-voice", "check-clarity", "validate-steps"],
    "skill-frontmatter":                ["validate-schema", "enforce-fields", "check-frontmatter"],
    "cost-annotation-discipline":       ["annotate-cost", "classify-tier", "label-action"],
    "ai-proposal-review-inbox":         ["review-proposal", "accept-snippet", "dismiss-proposal"],
    "never-run-sudo-from-app":          ["show-command", "copy-command", "open-terminal"],
    "make-check-defense-in-depth":      ["run-check", "verify-references", "catch-regression"],
    "sandboxed-filesystem-peek":        ["read-path", "measure-size", "list-directory"],
    "tool-calling-approval-reentry":    ["pause-tool", "show-approval", "resume-loop"],
    "make-update-make-doctor":          ["pull-latest", "diagnose-install", "check-version"],
    "feature-marketing-md":             ["write-feature-md", "generate-copy", "document-feature"],
    "conversation-retrospective-extraction": ["read-conversation", "classify-finding", "file-skill"],
    "real-time-honest-signaling":       ["wire-event", "track-freed", "report-completion"],
    "library-plus-doc-template":        ["write-doc", "capture-moment", "pair-with-artifact"],
    "three-tier-safety-classification": ["classify-tier", "enforce-safety", "gate-action"],
    "post-ship-elevation-pass":         ["audit-gaps", "propose-elevations", "wait-approval"],
    "plan-first-substantive-changes":   ["write-plan", "get-approval", "define-scope"],
    "post-sse-via-fetch-readablestream":["stream-post", "parse-sse", "handle-events"],
    "product-repo-architecture":        ["setup-repo", "configure-release", "name-branch"],
    "avery-goodman-repo-standard":      ["brand-repo", "label-folder", "write-readme"],
    "confirm-ship-clearly":             ["check-tag", "verify-merge", "show-receipts"],
    "applescript-native-ui":            ["write-applescript", "show-dialog", "send-notification"],
    "streaming-sse-event-vocabulary":   ["define-events", "route-messages", "handle-stream"],
    "emergency-auto-navigate-on-condition": ["monitor-metric", "navigate-surface", "detect-threshold"],
    "multi-surface-single-engine":      ["route-surface", "call-engine", "adapt-output"],
    "babysit":                          ["review-pr", "fix-ci", "merge-ready"],
    "ship-flow":                        ["open-pr", "merge-pr", "verify-deploy"],
    "split-to-prs":                     ["split-changes", "create-pr", "scope-commit"],
    "rebase-changelog-resolver":        ["rebase-branch", "resolve-conflict", "update-changelog"],
    "save-plan":                        ["save-plan", "write-plan", "file-decision"],
    "plan-mode-runbook":                ["run-plan", "execute-steps", "verify-output"],
    "session-retrospective":            ["extract-lessons", "file-skill", "update-library"],
    "migrate-to-skills":                ["migrate-rule", "convert-skill", "file-product"],
    "canvas":                           ["open-canvas", "analyze-data", "display-table"],
    "sdk":                              ["build-sdk", "integrate-api", "configure-client"],
    "shell":                            ["run-command", "execute-script", "parse-output"],
    "statusline":                       ["show-status", "configure-bar", "display-info"],
    "update-cli-config":                ["update-config", "configure-cli", "set-option"],
    "update-cursor-settings":           ["update-settings", "configure-cursor", "set-preference"],
    "create-hook":                      ["create-hook", "configure-trigger", "wire-event"],
    "create-rule":                      ["create-rule", "define-policy", "write-rule"],
    "create-subagent":                  ["create-agent", "define-role", "configure-subagent"],
    "bulk-rename-tokens":               ["rename-token", "find-replace", "update-references"],
    "quality-bar-honest":               ["set-quality", "enforce-bar", "reject-shortcut"],
    "post-ship-audit-elevation":        ["audit-ship", "elevate-output", "file-findings"],
    "migration-shipping":               ["ship-migration", "run-migration", "verify-schema"],
    "schema-fk-typecheck":              ["check-schema", "validate-fk", "verify-types"],
    "secure-data-flow-protocol":        ["secure-flow", "encrypt-data", "validate-transfer"],
    "versioned-pinned-protocol":        ["pin-version", "lock-dependency", "set-version"],
    "multi-actor-consensus-mechanic":   ["build-consensus", "coordinate-actors", "resolve-conflict"],
    "marketplace-with-trust-reserve":   ["setup-marketplace", "configure-trust", "reserve-funds"],
    "aesthetic-consistency":            ["check-style", "enforce-aesthetic", "align-design"],
    "compliance-matrix":                ["build-matrix", "track-compliance", "verify-rule"],
    "cross-reference-rippling":         ["ripple-update", "sync-reference", "propagate-change"],
    "cross-reference-on-skill-add":     ["update-index", "ripple-references", "sync-catalog"],
    "decision-records":                 ["record-decision", "document-why", "log-decision"],
    "doctor-script-pattern":            ["run-doctor", "diagnose-system", "report-health"],
    "graceful-degradation":             ["degrade-gracefully", "handle-failure", "fallback-safely"],
    "idempotent-commands":              ["run-idempotent", "check-state", "skip-if-done"],
    "migration-guide-format":           ["write-migration", "document-steps", "format-guide"],
    "multi-surface-design":             ["design-surface", "coordinate-ui", "align-platform"],
    "plan-first":                       ["write-plan", "define-scope", "get-approval"],
    "verification-gates":               ["run-gate", "verify-output", "check-completion"],
    "register-feature-ledger-plan":     ["register-feature", "log-plan", "track-ledger"],
    "ui-ux-pro-max":                    ["design-ui", "review-ux", "apply-guidelines"],
    "ascii-flow-diagrams":              ["draw-diagram", "map-flow", "visualize-architecture"],
    "seeme":                            ["generate-diagram", "visualize-idea", "draw-flow"],
    "self-hosted-git":                  ["setup-gitlab", "configure-ci", "host-git"],
    "verify-ship":                      ["verify-ship", "check-deploy", "confirm-release"],
    "post-ship-elevation-pass":         ["audit-gaps", "propose-elevations", "wait-approval"],
    "emil-design-eng":                  ["apply-design", "enforce-polish", "review-detail"],
    "generate-weather-plates":          ["generate-plates", "create-assets", "render-weather"],
    "new-repo-setup":                     ["setup-repo", "scaffold-structure", "initialize-standard"],
    "existing-repo-alignment":            ["align-repo", "reshape-structure", "audit-existing"],
    "product-schema-standard":            ["enforce-schema", "validate-fields", "stamp-product"],
}

GOVERNED_BY = {
    "create-skill":                     ["RL-0039", "RL-0044", "global"],
    "failure-proof-audit":              ["RL-0039", "RL-0044", "RL-0043"],
    "product-repo-architecture":        ["RL-0039", "RL-0032", "global"],
    "plan-first-substantive-changes":   ["RL-0032", "RL-0039", "global"],
    "confirm-ship-clearly":             ["RL-0043", "RL-0039", "global"],
    "make-check-defense-in-depth":      ["RL-0039", "RL-0043", "global"],
}

RELATIONS = {
    "failure-proof-audit":                   ["conversation-retrospective-extraction", "post-ship-elevation-pass"],
    "gap-audit-and-elevation":               ["post-ship-elevation-pass", "failure-proof-audit"],
    "create-skill":                          ["conversation-retrospective-extraction", "plan-first-substantive-changes"],
    "post-ship-elevation-pass":              ["gap-audit-and-elevation", "create-skill"],
    "conversation-retrospective-extraction": ["create-skill", "failure-proof-audit", "gap-audit-and-elevation"],
    "make-check-defense-in-depth":           ["confirm-ship-clearly", "make-update-make-doctor"],
    "skill-nutrients-decanter":              ["conversation-retrospective-extraction", "create-skill"],
    "plan-first-substantive-changes":        ["confirm-ship-clearly", "post-ship-elevation-pass"],
    "product-repo-architecture":             ["avery-goodman-repo-standard", "make-check-defense-in-depth"],
}

BEFORE = {
    "failure-proof-audit":                   ["gap-audit-and-elevation", "plan-first-substantive-changes"],
    "create-skill":                          ["skill-nutrients-decanter", "gap-audit-and-elevation"],
    "post-ship-elevation-pass":              ["confirm-ship-clearly"],
    "conversation-retrospective-extraction": ["skill-nutrients-decanter"],
    "make-check-defense-in-depth":           ["plan-first-substantive-changes"],
    "ship-flow":                             ["plan-first-substantive-changes", "make-check-defense-in-depth"],
    "avery-goodman-repo-standard":           ["product-repo-architecture"],
}

# ── Goal lookup — curated one-line achievement statements ─────────────────────
# What does this product achieve when it runs successfully?
# Distinct from description (triggers/routing) — this is the outcome.
GOALS = {
    "create-skill":                          "Every new product is correctly structured, voiced, and ready to route before it enters the library.",
    "skill-writing-voice":                   "Every product is written with CLI clarity — no vague language, no open paths, no hallucination routes.",
    "skill-frontmatter":                     "Every product file has valid, complete frontmatter before it is committed.",
    "product-schema-standard":               "Every product carries the full 8-field schema with action keywords and living metadata.",
    "failure-proof-audit":                   "Every system is hardened against the failure modes that six months of real-world use would expose.",
    "gap-audit-and-elevation":               "Every ship is followed by a named gap list and an ambitious elevation proposal.",
    "post-ship-elevation-pass":              "Every shipped feature is immediately audited for gaps and extended with its most ambitious version.",
    "conversation-retrospective-extraction": "Every significant session produces permanent library improvements that make the next session smarter.",
    "skill-nutrients-decanter":              "Only net-positive lessons — nutrients — make it into the library; noise is filtered out.",
    "product-repo-architecture":             "Every git repo starts with the right structure from the first commit so no architectural debt accumulates.",
    "avery-goodman-repo-standard":           "Every AVERY GOODMAN repo is immediately recognizable — branded, labeled, and structured identically.",
    "new-repo-setup":                        "Every new repo is correctly typed, structured, and committed on the first try with no structural debt.",
    "existing-repo-alignment":               "Any existing repo can be reshaped to the AVERY GOODMAN standard without destroying what is already there.",
    "cost-annotation-discipline":            "Every destructive action tells the user exactly what they will lose before they click.",
    "ai-proposal-review-inbox":              "AI agents can grow curated source files through a review inbox without ever auto-mutating the source.",
    "never-run-sudo-from-app":               "No app ever asks for a Mac password — the OS password prompt is always the consent gate.",
    "make-check-defense-in-depth":           "No renamed string or broken reference ships undetected — CI catches the whole regression class.",
    "sandboxed-filesystem-peek":             "AI agents can read the filesystem safely without becoming a data-exfiltration vector.",
    "tool-calling-approval-reentry":         "AI agents with destructive tools always pause for human approval before running, then resume cleanly.",
    "make-update-make-doctor":               "Any user can safely update and diagnose a git-clone-and-make tool regardless of branch state.",
    "real-time-honest-signaling":            "Every UI signal reflects what the system actually reports — no faked completion, no estimated measurements.",
    "library-plus-doc-template":             "Every library entry has a companion doc that captures what it does and the moment that prompted it.",
    "three-tier-safety-classification":      "No auto-clean ever reaches irreplaceable data — the safety tier is a structural code guarantee.",
    "streaming-sse-event-vocabulary":        "Every AI agent stream uses the same named events so any frontend can consume any agent.",
    "multi-surface-single-engine":           "One engine powers every surface — the logic is never duplicated across CLI, web, Shortcut, or launchd.",
    "post-sse-via-fetch-readablestream":     "POST endpoints can stream SSE without EventSource — any AI chat backend works with any frontend.",
    "confirm-ship-clearly":                  "Every ship is confirmed with four receipts — tag, PR state, commit, and version — before declaring done.",
    "emergency-auto-navigate-on-condition":  "The UI takes the user to the right surface automatically when a system crosses a critical threshold.",
    "feature-marketing-md":                  "Every shipped feature has a self-contained marketing brief ready to power any launch on any channel.",
    "plan-first-substantive-changes":        "Every substantive change is planned, approved, and documented before a single line of code is written.",
}

CATEGORY_VERB = {
    "engineering/architecture": "design",
    "engineering":              "run",
    "methodology":              "audit",
    "marketing":                "write",
    "visual/design/ux":         "design",
    "visual/design/ui":         "build",
    "visual/design/architecture": "architect",
    "visual/design/paint":      "style",
    "visual/design":            "design",
    "visual/diagrams":          "draw",
    "visual":                   "design",
    "infra":                    "setup",
    "mobile":                   "build",
    "ide/cursor":               "configure",
    "ide":                      "configure",
    "project":                  "run",
    "external":                 "integrate",
    "rules":                    "enforce",
}

STOPS = {
    "and","or","the","a","an","for","with","via","to","in","of","from",
    "by","as","its","that","this","on","at","not","has","how","use","make",
    "add","run","get","set","all","any","new","pro","max","one","two","per",
    "pre","post","non","auto","self","sub","mid","off","out","up","re","do",
    "is","be","can","will","may","if","vs","plus","cross",
}


def derive_action_keywords(name, path):
    if name in ACTION_KEYWORDS:
        return ACTION_KEYWORDS[name]
    rel = path.replace(ROOT + "/", "")
    category = "engineering"
    for cat in sorted(CATEGORY_VERB.keys(), key=len, reverse=True):
        if cat in rel:
            category = cat
            break
    is_rule = "rules/library" in rel
    verb = CATEGORY_VERB.get("rules" if is_rule else category, "run")
    parts = re.split(r"[-_]", name.lower())
    tokens = [p for p in parts if p not in STOPS and len(p) > 2]
    if not tokens:
        return [f"{verb}-skill"]
    tags = [f"{verb}-{tokens[0]}"]
    if len(tokens) > 1:
        tags.append(f"check-{tokens[1]}")
    if len(tokens) > 2:
        tags.append(f"build-{tokens[2]}")
    elif len(tokens) == 2:
        tags.append(f"file-{tokens[0]}")
    return tags[:3]


def make_hash(name, pid):
    return hashlib.sha1(f"{name}{pid}".encode()).hexdigest()[:7]


def derive_goal(name, path):
    """One-sentence goal: what this product achieves when it runs successfully."""
    if name in GOALS:
        return GOALS[name]
    # Fallback: construct from the product name
    label = name.replace("-", " ").replace("_", " ")
    return f"Deliver {label} output correctly and completely."


def has_field(content, field):
    in_fm = fm_open = False
    for line in content.splitlines():
        s = line.strip()
        if s == "---":
            if not fm_open:
                fm_open = in_fm = True
            else:
                in_fm = False
            continue
        if in_fm and re.match(rf"^{re.escape(field)}\s*:", s):
            return True
    return False


def get_name(content, fallback):
    in_fm = fm_open = False
    for line in content.splitlines():
        s = line.strip()
        if s == "---":
            if not fm_open:
                fm_open = in_fm = True
            else:
                in_fm = False
            continue
        if in_fm and s.startswith("name:"):
            return s[5:].strip().strip("\"'")
    return fallback


def replace_keywords(content, kws):
    kw_str = ", ".join(kws)
    new_line = f"keywords: [{kw_str}]"
    lines = content.splitlines(keepends=True)
    in_fm = fm_open = False
    for i, line in enumerate(lines):
        s = line.strip()
        if s == "---":
            if not fm_open:
                fm_open = in_fm = True
            else:
                in_fm = False
            continue
        if in_fm and s.startswith("keywords:"):
            lines[i] = new_line + "\n"
            return "".join(lines)
    return content


def insert_after(content, anchor_prefix, new_fields):
    lines = content.splitlines(keepends=True)
    in_fm = fm_open = False
    for i, line in enumerate(lines):
        s = line.strip()
        if s == "---":
            if not fm_open:
                fm_open = in_fm = True
            else:
                in_fm = False
            continue
        if in_fm and s.startswith(anchor_prefix):
            lines.insert(i + 1, new_fields)
            return "".join(lines)
    return content


def fmt(items):
    return "[]" if not items else "[" + ", ".join(items) + "]"


def stamp(path, pid, dry_run=False):
    try:
        content = open(path).read()
    except Exception as e:
        return f"  ERROR {e}  {path}"

    name = get_name(content, os.path.basename(os.path.dirname(path)))
    kws  = derive_action_keywords(name, path)
    h    = make_hash(name, pid)
    gov  = GOVERNED_BY.get(name, ["global"])
    rels = RELATIONS.get(name, [])
    bef  = BEFORE.get(name, [])
    goal = derive_goal(name, path)
    acts = []

    if not content.startswith("---"):
        kw_str = ", ".join(kws)
        fm = (f"---\nname: {name}\nid: {pid}\nhash: {h}\n"
              f"keywords: [{kw_str}]\nrelations: {fmt(rels)}\nbefore: {fmt(bef)}\n"
              f"governed_by: {fmt(gov)}\nmeta: dynamic\n"
              f"goal: {goal}\n---\n\n")
        new = fm + content
        acts.append("add-frontmatter")
    else:
        new = content
        # Always overwrite keywords
        if has_field(new, "keywords"):
            new = replace_keywords(new, kws)
            acts.append(f"kw=[{','.join(kws)}]")
        else:
            new = insert_after(new, "name:", f"keywords: [{', '.join(kws)}]\n")
            acts.append(f"+kw=[{','.join(kws)}]")

        extra = ""
        if not has_field(new, "hash"):
            extra += f"hash: {h}\n"; acts.append(f"+hash")
        if not has_field(new, "relations"):
            extra += f"relations: {fmt(rels)}\n"; acts.append("+relations")
        if not has_field(new, "before"):
            extra += f"before: {fmt(bef)}\n"; acts.append("+before")
        if not has_field(new, "governed_by"):
            extra += f"governed_by: {fmt(gov)}\n"; acts.append("+governed_by")
        if not has_field(new, "meta"):
            extra += "meta: dynamic\n"; acts.append("+meta")
        if not has_field(new, "goal"):
            extra += f"goal: {goal}\n"; acts.append("+goal")
        if extra:
            new = insert_after(new, "keywords:", extra)

    if not dry_run and new != content:
        open(path, "w").write(new)

    tag = "DRY" if dry_run else "OK "
    lbl = " | ".join(acts) if acts else "no-change"
    return f"  {tag}  {lbl}  {os.path.relpath(path, ROOT)}"


def stamp_dustpan(dustpan_root, dry_run=False):
    docs_dir = os.path.join(dustpan_root, "applescripts", "docs")
    if not os.path.exists(docs_dir):
        print(f"  ERROR: {docs_dir} not found")
        return
    ds_kw = {
        "0001-dustpan-main":         ["run-cleanup", "free-space", "show-progress"],
        "0002-show-disk-status":     ["show-disk", "check-health", "open-dashboard"],
        "0003-quick-rescue":         ["run-rescue", "free-space", "show-results"],
        "0004-show-locked-space":    ["scan-ownership", "copy-command", "unlock-space"],
        "0005-quick-rescue-dry-run": ["measure-space", "preview-cleanup", "check-savings"],
    }
    for i, path in enumerate(sorted(glob.glob(os.path.join(docs_dir, "*.md")))):
        stem = os.path.splitext(os.path.basename(path))[0]
        pid  = f"DS-{i+1:04d}"
        kws  = ds_kw.get(stem, ["run-script", "show-result", "confirm-done"])
        h    = make_hash(stem, pid)
        acts = []
        try:
            content = open(path).read()
        except Exception as e:
            print(f"  ERROR {e}"); continue
        new = content
        if not content.startswith("---"):
            kw_str = ", ".join(kws)
            fm = (f"---\nname: {stem}\nid: {pid}\nhash: {h}\n"
                  f"keywords: [{kw_str}]\nrelations: []\nbefore: []\n"
                  f"governed_by: [global]\nmeta: dynamic\n---\n\n")
            new = fm + content; acts.append("add-frontmatter")
        else:
            if has_field(new, "keywords"):
                new = replace_keywords(new, kws); acts.append(f"kw=[{','.join(kws)}]")
            extra = ""
            for f, v in [("hash", f"{h}"), ("relations", "[]"), ("before", "[]"),
                         ("governed_by", "[global]"), ("meta", "dynamic"),
                     ("goal", f"Deliver {stem} output correctly and completely.")]:
                if not has_field(new, f):
                    extra += f"{f}: {v}\n"; acts.append(f"+{f}")
            if extra:
                new = insert_after(new, "keywords:", extra)
        if not dry_run and new != content:
            open(path, "w").write(new)
        tag = "DRY" if dry_run else "OK "
        print(f"  {tag}  {' | '.join(acts) or 'no-change'}  applescripts/docs/{os.path.basename(path)}")


def main():
    dry_run = "--dry-run" in sys.argv
    dustpan = next((sys.argv[i+1] for i,a in enumerate(sys.argv)
                    if a == "--dustpan" and i+1 < len(sys.argv)), None)
    if dustpan:
        print("=== DUSTPAN APPLESCRIPT DOCS ===")
        stamp_dustpan(dustpan, dry_run); return

    skills = sorted(f for f in glob.glob(f"{ROOT}/skills/**/*.md", recursive=True)
                    if os.path.basename(f) == "SKILL.md")
    rules  = sorted(glob.glob(f"{ROOT}/rules/library/*/body.md"))
    print(f"Found {len(skills)} skills, {len(rules)} rules  Mode: {'DRY' if dry_run else 'WRITE'}\n")

    print("=== SKILLS ===")
    for i, path in enumerate(skills):
        print(stamp(path, f"SK-{i+1:04d}", dry_run))
    print("\n=== RULES ===")
    for i, path in enumerate(rules):
        print(stamp(path, f"RL-{i+1:04d}", dry_run))
    print("\nDone.")

if __name__ == "__main__":
    main()
