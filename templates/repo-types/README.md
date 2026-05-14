# Repo Type Catalog
**managed by the duty and order of AVERY GOODMAN**

> Every repo under AVERY GOODMAN starts from a Type. Pick the Type that matches what you're building. The Type gives you the folder structure, the README skeleton, and the ai-skills-library skills that apply. You flesh it out. You never invent the structure from scratch.

---

## The 7 Repo Types

| ID | Type | What it is | When to use |
|---|---|---|---|
| [TYPE-001](./TYPE-001-app/) | **App** | A software application with a user-facing interface | DustPan, Red-E Play, any interactive product |
| [TYPE-002](./TYPE-002-library/) | **Library** | A knowledge, skill, or code library — the thing other repos pull from | ai-skills-library, a shared component library |
| [TYPE-003](./TYPE-003-guide/) | **Guide** | Documentation, reference system, how-to, or operational manual | This repo's GUIDE.md expanded into a full repo; SOPs |
| [TYPE-004](./TYPE-004-book/) | **Book** | Long-form written work with chapters, sections, or a narrative arc | A playbook, curriculum, or published content |
| [TYPE-005](./TYPE-005-ui-system/) | **UI System** | A design system, component library, or visual standards repo | Tokens, components, Figma exports, style guides |
| [TYPE-006](./TYPE-006-api/) | **API** | A backend service, REST/GraphQL API, or standalone microservice | Headless backends, data APIs, auth services |
| [TYPE-007](./TYPE-007-tool/) | **Tool** | A CLI, utility, or automation tool | DustPan's AppleScript engine, xcc CLI, scripts |

---

## Hybrid types

Most real projects are hybrids. Use the **primary type** for the folder structure, then borrow sections from secondary types.

| If you're building... | Primary type | Borrow from |
|---|---|---|
| An app with its own docs site | TYPE-001 App | TYPE-003 Guide |
| A library with a tutorial | TYPE-002 Library | TYPE-004 Book |
| A design system with a demo app | TYPE-005 UI System | TYPE-001 App |
| A tool with documentation | TYPE-007 Tool | TYPE-003 Guide |

---

## How to use these templates

**New repo:**
1. Pick your type
2. Open the `TYPE.md` in that folder — read the structure
3. Run the setup checklist in `TYPE.md` to scaffold the folders
4. Copy `README.template.md` from that folder to your repo root
5. Fill in every bracketed placeholder — do not leave any behind
6. Invoke the listed ai-skills-library skills to complete the setup

**Existing repo:**
Use `existing-repo-alignment` (SK — see `skills/engineering/existing-repo-alignment/`) — it diagnoses the repo, maps it to a type, and produces a non-destructive change manifest.

---

## The fixed AVERY GOODMAN label system

Regardless of type, the following labels apply to every folder:

| Folder | Label | What lives here |
|---|---|---|
| `plans/` | THINKING | Plan documents before any feature |
| `docs/` | KNOWLEDGE | Reference material, changelogs |
| `docs/marketing/` | PITCH | One MD per feature (8-section template) |
| `src/` or `apps/` | FACE | The user-facing layer |
| `lib/` or `web/` | BRAIN | The logic/backend layer |
| `scripts/` | TOOLS | Maintenance and automation scripts |
| `assets/` | SKIN | Icons, images, visual identity |
| `bin/` | KEYS | CLI entry points and wrappers |
