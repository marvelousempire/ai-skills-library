---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: product-repo-architecture
generated_at: 2026-05-19T19:05:57Z
---

<!--
Skill Name:       Product Repo Architecture
Slug:              product-repo-architecture
Pack:              Engineering · Architecture (engineering/architecture)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0007
Summary:           The opinionated git repo structure, Makefile interface, GitHub Actions auto-release workflow, version-tracking pattern, git branch and PR naming conventions,…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **product-repo-architecture**.
-->

# Product Repo Architecture

| | |
|---|---|
| **Slug** | `product-repo-architecture` |
| **Pack** | Engineering · Architecture |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0007 |
| **Path** | `skills/engineering/architecture/product-repo-architecture` |

## Summary

The opinionated git repo structure, Makefile interface, GitHub Actions auto-release workflow, version-tracking pattern, git branch and PR naming conventions,…

## Description

The opinionated git repo structure, Makefile interface, GitHub Actions auto-release workflow, version-tracking pattern, git branch and PR naming conventions, folder hierarchy, and single-source-of-truth file discipline for any macOS developer tool or local-first web app that ships via git clone + make. This is a git + GitHub-specific pattern: uses gh CLI, GitHub Actions for auto-tagging releases on every squash-merge to main, git branch naming that embeds the version number, and GitHub Releases for distribution. Covers: Makefile as primary UX, kVersion in one canonical file, squash-merge + auto-tag, numbered append-only plan docs, PR body format, and the make check CI gate. Triggers on "set up this git repo", "git repo structure", "GitHub repo architecture", "GitHub Actions release workflow", "auto-release on merge", "git branch naming", "version tracking in git", "how should I set up this repo", "Makefile conventions", "where do plans go", "GitHub releases", "single source of truth for version", "how did we organize the DustPan repo".

## Invoke

Use **product-repo-architecture**.

## Triggers / keywords

`setup-repo`, `configure-release`, `name-branch`

## Requires (run first)

—

## Overlap (related skills)

—

## Philosophy

—

## Files

- [`SKILL.md`](SKILL.md) — agent instructions
- [`skill.plugin.json`](skill.plugin.json) — machine manifest (directory grid)
- This file — human lead sheet (WordPress-style header)

