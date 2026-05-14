# Path A — Tailscale Funnel quickstart

Use this when you want to **start today** on any spare Mac or Linux box without touching your router. No port forwarding, no public DNS, no Let's Encrypt config. Works on networks behind CGNAT (most home internet) and corporate firewalls.

## Why Tailscale (for Path A)

| Property | Detail |
|---|---|
| Cost | Free for personal use (up to 3 users, 100 devices) |
| TLS | Tailscale issues + auto-renews certs for `*.ts.net` hostnames |
| Public reach | Tailscale Funnel publishes the host on the public internet under your `*.ts.net` name |
| Private reach | Devices already on your tailnet reach it via private mesh, faster + cheaper than Funnel |
| Network admin | Zero. No port-forward, no NAT, no DDNS |

## Setup (15 minutes)

```sh
# 1. On the host running GitLab:
brew install --cask tailscale   # or your platform's installer
tailscale up

# 2. Find your machine's tailnet hostname:
tailscale status | head -3
# Your hostname is something like: mac-mini.<your-tailnet>.ts.net

# 3. Export it for Compose:
export GITLAB_HOSTNAME=mac-mini.<your-tailnet>.ts.net
export GITLAB_ROOT_PASSWORD="change-me-on-first-login"

# 4. Switch the Caddyfile to the "Tailscale Funnel" mode.
#    Replace the body of templates/Caddyfile with:
cat > templates/Caddyfile <<'CADDY'
:80 {
    reverse_proxy gitlab:80
}
CADDY

# 5. Boot GitLab (see SKILL.md for the full sequence).
mkdir -p ./data/{config,logs,data,caddy-config,caddy-data,runner}
docker compose -f templates/gitlab-compose.yml up -d

# 6. Wait for "GitLab is now ready" in the logs (1–3 minutes).
docker compose -f templates/gitlab-compose.yml logs -f gitlab

# 7. Expose the Caddy port via Tailscale Funnel:
sudo tailscale serve --bg --https=443 http://localhost:80
sudo tailscale funnel --bg 443

# 8. Visit https://$GITLAB_HOSTNAME — Tailscale serves a valid cert,
#    Caddy forwards to GitLab. Log in as `root` with the password above.
```

## What about the container registry on a separate subdomain?

Tailscale Funnel publishes one hostname. Two options:

1. **Skip the registry subdomain.** Most CI/CD use cases work fine with a path-based registry URL — GitLab exposes registry endpoints on the main hostname.
2. **Use a custom domain instead** (jump to Path B's Caddyfile section). You buy a domain, point its A/AAAA records at your Tailscale exit-node IP, and Caddy gets Let's Encrypt certs for both subdomains.

Most personal-use installations don't need the separate registry subdomain. The image push/pull works through `$GITLAB_HOSTNAME:5050/<group>/<repo>` once you enable the registry's internal HTTP port.

## When to graduate to Path B

Move to the [Mac mini + Flint 2 WireGuard setup](wireguard-quickstart.md) when:

- The Mac mini lands on your desk
- You start needing the container registry on its own subdomain (multi-runner setups)
- You're hitting Tailscale's free-tier device limit
- You want zero external dependencies (Tailscale Inc. is in the path on Funnel)
