---
name: wireguard-bind-law
id: SK-YSJ-0203
domain: yousirjuan
status: Active
description: >
  Plan 0180 — internal services bind 127.0.0.1 + WireGuard 10.1.0.5 only;
  never 0.0.0.0 on LAN. Family Office Sandwich network model.
---

# WireGuard Bind Law

## The law

> Every internal cassette/service binds **`127.0.0.1` + `10.1.0.5` (wg0)** — **never `0.0.0.0`**.

Public edge: only `nephew-family-edge` (:443/:80). Everything else: WG mesh or door names.

## Forbidden

- Re-adding `0.0.0.0` to cassette compose ports
- Telling operators to use raw LAN IPs for services closed by Plan 0180
- Tailscale or third-party coordination servers (WG self-hosted only)

## Reach patterns

| From | To DGX service |
|------|----------------|
| Mac on LAN | `http://192.168.10.205:<port>/` for UIs documented in mac-dgx rule |
| Mac on WG | `http://10.1.0.5:<port>/` |
| Family door | `http://<slug>.localhost/` after `make doors` |

## Docs

- YSJ `docs/setup/02-network-security.md` · `18-wireguard-matrix-nas-gitea-why.md`
- Nephew `docs/infrastructure/family-office-network.md`
- Cursor rule `family-office-network.mdc`

## Factory compliance

Cassette Factory scaffolds `APP_BIND=127.0.0.1` (Mac) and `10.1.0.5` (DGX overlay).
