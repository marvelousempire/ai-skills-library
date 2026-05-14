# Path B — Mac mini + Flint 2 + WireGuard

The target architecture per the [yousirjuan platform plan](../../../../docs/yousirjuan-platform-skills-master.md#12-hardware--compute-roles).

```text
   ┌─────────────────┐   WireGuard   ┌─────────────────┐
   │  laptop / phone │◄──────────────┤   Flint 2       │
   │  anywhere       │  encrypted    │   home gateway  │
   └─────────────────┘  tunnel       └────────┬────────┘
                                              │  LAN
                                              ▼
                                     ┌──────────────────┐
                                     │  Mac mini M4 Pro │
                                     │  GitLab + Caddy  │
                                     │  + Runner        │
                                     └──────────────────┘
```

## What you need

| Item | Status (per yousirjuan ledger) | Required for |
|---|---|---|
| Mac mini M4 Pro | Target | The host running GitLab |
| Flint 2 (GL.iNet GL-MT6000) | Target | WireGuard server + home gateway |
| Domain you own | optional but recommended | nice URLs + Let's Encrypt certs |
| Static LAN IP for the Mac mini | required | Flint 2 forwards to a known address |

## Setup (60 minutes once hardware is in hand)

### 1. Mac mini — give it a fixed LAN address

In Flint 2's admin UI: **Network → LAN → Static Leases**. Add an entry pinning the Mac mini's MAC to (e.g.) `192.168.8.10`.

### 2. Flint 2 — enable the WireGuard server

In Flint 2: **VPN → WireGuard Server → Enable**. Default port is `51820/udp`. Create one client config per device (laptop, phone). Each client gets a `.conf` file or QR code.

Forward UDP/51820 from the WAN to the Flint 2 itself (the Flint runs the WireGuard server). No port forwarding to the Mac mini is needed — clients reach it through the encrypted tunnel.

### 3. DNS — point your domain at the Mac mini's LAN IP

You have two choices:

- **Public DNS (recommended for real-domain installs)**: create an A record `git.your.tld → <your WAN IP>`. Flint 2 forwards ports 80 + 443 to `192.168.8.10`. Caddy gets Let's Encrypt certs over the public internet.
- **Tailnet/WireGuard-only DNS**: edit `/etc/hosts` on each client device to map `git.your.tld → 192.168.8.10`. Never resolves publicly. No public ports forwarded. Caddy uses the [DNS-01 challenge](https://caddyserver.com/docs/automatic-https#dns-challenge) for cert renewal (requires API access to your DNS provider).

For a true "private to my house only" setup, use the second option.

### 4. Mac mini — install Docker, clone the skill, boot the stack

```sh
# Install Docker Desktop or OrbStack (lighter).
brew install --cask docker     # or: brew install --cask orbstack

# Clone the skills library, get into the playbook.
git clone <your-repo>          # this works AFTER GitLab is up; bootstrap from GitHub for now
cd skills/infra/self-hosted-git

# Set the hostname + initial root password.
export GITLAB_HOSTNAME=git.your.tld
export GITLAB_ROOT_PASSWORD="change-me-on-first-login"

mkdir -p ./data/{config,logs,data,caddy-config,caddy-data,runner}
docker compose -f templates/gitlab-compose.yml up -d
docker compose -f templates/gitlab-compose.yml logs -f gitlab
# wait for "GitLab is now ready"
```

### 5. Forward Flint 2 ports to the Mac mini

In Flint 2: **Firewall → Port Forwarding**. Add:

| Source port | Protocol | Destination | Destination port |
|---|---|---|---|
| 80 | TCP | 192.168.8.10 | 80 |
| 443 | TCP | 192.168.8.10 | 443 |
| 2222 | TCP | 192.168.8.10 | 2222 |

(Skip 80/443 if you went with the WireGuard-only DNS option.)

### 6. Test from a client device

```sh
# Connect to WireGuard via the Flint 2 client config.
# Then:
curl -fsS https://git.your.tld/-/health    # should return: GitLab OK
```

## Why this is the target

- **$0/mo recurring cost** once the hardware is bought.
- **Yours**. No third party in the path (unlike Path A's Tailscale Funnel).
- **Always-on**. The Mac mini stays on; the Flint 2 stays on; the tunnel is always available.
- **Performant**. Mac mini M4 Pro outpaces any cheap VPS.
- **Aligns with the yousirjuan stack**. The Mac mini is also the planned runtime for Qdrant, PostgreSQL, Open WebUI, Ollama, ingestion workers per the platform plan.

## Migration from Path A

When you're ready to switch from Tailscale to WireGuard:

```sh
# 1. Stop the Path A stack.
docker compose -f templates/gitlab-compose.yml down

# 2. Copy the data directory to the Mac mini (or attach the same external drive).
rsync -a ./data/ <mac-mini>:/path/to/self-hosted-git/data/

# 3. Update GITLAB_HOSTNAME to the new domain (and the GitLab Omnibus
#    `external_url` setting in data/config/gitlab.rb to match).
# 4. Update DNS as above.
# 5. Restart the Compose stack on the new host.
docker compose -f templates/gitlab-compose.yml up -d
```

GitLab's external URL change requires one `gitlab-ctl reconfigure` after editing `gitlab.rb` — the container does this on restart automatically.
