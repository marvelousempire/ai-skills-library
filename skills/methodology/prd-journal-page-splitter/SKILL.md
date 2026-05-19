---
name: prd-journal-page-splitter
description: >-
  Parses long PRD Journal, chat-export, planning, or single-file doctrine
  documents into organized documentation folders. Use when the user mentions
  PRD Journal, parse pages, split pages, break everything into folders, separate
  folders for pages, one markdown file per page section, or references files
  like plans/PRD Journal-*.md.
---

# PRD Journal Page Splitter

Use this skill to turn a long, mixed PRD Journal or chat-style planning file
into a clean folder tree with one folder per discovered page/topic and one
markdown file per page section.

## When To Use

Use this skill when the user asks to:

- Parse a PRD Journal.
- Split pages from a long markdown file.
- Break everything into folders.
- Put related sections that work together into the same page folder.
- Create separate markdown files for each section of each page.
- Convert a chat-export or planning dump into organized repo documents.

Common trigger examples:

- `@plans/PRD Journal-make-sense-protocol.md`
- "parse the pages"
- "break everything into folders"
- "separate folders for all pages"
- "separate md file for each page section"
- "keep the things that work together in the same page"

## Core Rules

1. Read the full source document before writing output.
2. Detect pages/topics from major headings, repeated topic blocks, filenames,
   workflow/action names, map titles, manifest titles, checklist titles, and
   chat-style continuation markers.
3. Keep sections that belong to the same page/topic in the same folder.
4. Create a separate folder for every discovered page/topic.
5. Create a separate `.md` file for each page section inside that folder.
6. Preserve source wording unless the user explicitly asks for cleanup.
7. Preserve code blocks, YAML, markdown headings, commands, and snippets exactly.
8. Add an index README that maps generated folders/files back to the source
   document and section titles.
9. Deduplicate repeated or updated versions by keeping the latest version as
   canonical and marking older versions as superseded.
10. Do not flatten everything into one giant markdown file.

## Output Shape

Default output should live beside the source unless the user names another
destination.

For a source like:

```text
plans/PRD Journal-make-sense-protocol.md
```

Create a sibling folder like:

```text
plans/prd-journal-make-sense-protocol/
  README.md
  01-overview/
    01-overview.md
    02-core-architecture.md
    03-mandatory-thinking-tools.md
  02-kingdom-pairs/
    01-clarity-vs-ambiguity.md
    02-intent-vs-execution.md
    03-structure-vs-flow.md
  03-github-actions/
    01-microslice-distribution-action.md
    02-valid-intent-check-action.md
    03-belief-system-execute-action.md
  04-maps/
    01-microslice-solvency-map.md
    02-make-sense-protocol-architecture-map.md
```

Adjust folder names to match the actual source sections.

## Page Detection

Treat each of these as a likely page/topic boundary:

- H1, H2, or H3 headings.
- Bold standalone labels, such as `**Overview**`.
- Numbered page labels, such as `### 1. microslice-distribution/action.yml`.
- File path headings, especially `.yml`, `.yaml`, `.md`, `.json`, `.ts`, `.tsx`,
  `.js`, `.jsx`, `.sh`, or workflow/action names.
- Map titles, manifest titles, scoring definitions, trigger engines, workflow
  sections, architecture sections, rules, guardrails, and implementation formats.
- Chat transitions like "Continuing the PRD", "Want me to continue", "Got it",
  or "Here's how..." when they introduce a new durable artifact.

Do not treat every paragraph as a page. A page is a durable topic or artifact
that could stand as a useful document in the repo.

## Grouping Rules

Group related sections together when they work as the same page family:

- All GitHub action definitions belong in an actions/workflows page group.
- All maps belong in a maps page group.
- All scoring metrics belong in a metrics page group.
- All trigger-engine material belongs in a trigger-engine page group.
- All manifest/governance material belongs in a manifest/governance page group.
- Overview, purpose, and architecture summaries can share an overview page group.

If two sections have the same title and one says updated, robust, optimized, or
recommended, keep the newest/strongest version canonical and place the older
version in a `superseded/` file or mark it clearly at the top.

## File Content Rules

Each generated markdown file should include:

```markdown
# <Section Title>

**Source:** `<source path>`
**Source section:** `<original heading or line range if known>`
**Status:** canonical | superseded | draft

<preserved section content>
```

Use `canonical` when it is the selected current version. Use `superseded` when a
later update replaces it. Use `draft` when the source is exploratory and no final
version is obvious.

## Index README Rules

The generated `README.md` must include:

- Source file path.
- Brief purpose of the split.
- Folder/file inventory.
- Canonical-vs-superseded notes.
- Any ambiguous sections that need human review.

## Verification

After splitting:

1. Confirm every major source section is represented in the index.
2. Confirm code blocks and YAML snippets still render as fenced blocks.
3. Confirm same-topic sections are grouped together.
4. Confirm no unrelated repo files were changed.
5. Tell the user which output folder was created and any sections that need
   human review.

## Related skills

- [`doctrine-decanter-sorting-agent`](../doctrine-decanter-sorting-agent/) — adds re-numbering, bottom cleared-zone dedupe, `archive/`, and full `docs/` tree (use when the dump is messier than a straight page split).
