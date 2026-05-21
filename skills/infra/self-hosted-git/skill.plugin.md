---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: self-hosted-git
generated_at: 2026-05-21T08:11:23Z
---

<!--
Skill Name:       Self Hosted Git
Slug:              self-hosted-git
Pack:              Infra (infra)
Version:           1.0.0
Status:            stable
Artifact type:     skill
Skill ID:          SK-0063
Summary:           Stand up a private GitLab CE Git server on a Mac mini (or any spare box) with Docker Compose, Caddy auto-HTTPS, and a Tailscale-or-WireGuard tunnel for remote…
Author:            marvelousempire
License:           MIT
Requires:          —
Invoke:            Use **self-hosted-git**.
-->

# Self Hosted Git

| | |
|---|---|
| **Slug** | `self-hosted-git` |
| **Pack** | Infra |
| **Version** | 1.0.0 |
| **Status** | stable |
| **Type** | skill |
| **Skill ID** | SK-0063 |
| **Path** | `skills/infra/self-hosted-git` |

## Summary

Stand up a private GitLab CE Git server on a Mac mini (or any spare box) with Docker Compose, Caddy auto-HTTPS, and a Tailscale-or-WireGuard tunnel for remote…

## Description

Stand up a private GitLab CE Git server on a Mac mini (or any spare box) with Docker Compose, Caddy auto-HTTPS, and a Tailscale-or-WireGuard tunnel for remote access. Includes GitHub-Actions-equivalent CI/CD via GitLab Runners (5 ready-to-use .gitlab-ci.yml templates + a tutorial), a self-contained CI overview dashboard, container registry, GitHub repo migration, daily backups to Backblaze B2, and an upgrade-stepping checklist. Anchors in the yousirjuan platform Category 11 (Governance, GitOps & Operational Memory). Triggers on "set up private git", "self-host git", "GitLab on Mac mini", "private git server", "private repo hosting", "migrate from GitHub", "self-hosted GitHub Actions", "private CI/CD", "GitLab CI", "replace GitHub Actions".

## Invoke

Use **self-hosted-git**.

## Triggers / keywords

`setup-gitlab`, `configure-ci`, `host-git`

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

