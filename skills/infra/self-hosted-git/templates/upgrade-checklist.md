# Upgrade checklist + disaster recovery

GitLab is the one thing in this skill pack that demands a thoughtful upgrade process. **Never skip across major versions** — you risk migrations breaking. Use this checklist every time you bump the image tag.

## The single most important rule

> Always upgrade through the [official upgrade path](https://docs.gitlab.com/ee/update/), one supported step at a time.
>
> Each major version has a "last minor of the previous major you must be on before jumping". Skipping bricks the Postgres migrations.

## Pre-upgrade checklist (5 minutes)

1. **Take a backup right now.**
   ```sh
   docker exec -t gitlab gitlab-backup create STRATEGY=copy
   docker cp gitlab:/etc/gitlab/gitlab-secrets.json ./gitlab-secrets-pre-upgrade.json
   ```

2. **Find the current version.**
   ```sh
   docker exec -t gitlab cat /opt/gitlab/version-manifest.txt | head -1
   ```

3. **Look up the target version's required path** at <https://docs.gitlab.com/ee/update/upgrade_paths>. Example: 16.x → 17.x requires going 16.x → 16.11 → 17.0 → 17.x. Don't skip.

4. **Read the breaking-changes section** for the target version. It's usually short. Most installs aren't affected; occasionally a config key gets renamed.

## During the upgrade

```sh
# 1. Switch the image tag in templates/gitlab-compose.yml, e.g.:
#      gitlab/gitlab-ce:17.5.1-ce.0   ← pin the exact version
#    DON'T use :latest for upgrades — it gives you no choice on the path.

# 2. Pull the new image first (no disruption yet).
docker compose -f templates/gitlab-compose.yml pull gitlab

# 3. Stop only GitLab (keep Caddy + runner running; they'll just queue traffic).
docker compose -f templates/gitlab-compose.yml stop gitlab

# 4. Restart it on the new image. The first boot runs migrations.
docker compose -f templates/gitlab-compose.yml up -d gitlab

# 5. Tail logs and watch for "GitLab is now ready". Migrations can take
#    10+ minutes on large instances.
docker compose -f templates/gitlab-compose.yml logs -f gitlab

# 6. Verify in the web UI: Admin Area → Component Information. All
#    components should show the new version.
```

## Post-upgrade smoke test

```sh
# Run from any client:
curl -fsS https://$GITLAB_HOSTNAME/-/health
# → GitLab OK

# Test a real-world flow:
git clone https://$GITLAB_HOSTNAME/<user>/<repo>.git /tmp/upgrade-test
cd /tmp/upgrade-test
echo "upgrade test $(date)" >> .upgrade-test
git add . && git commit -m "upgrade smoke" && git push
```

## If something is broken

```sh
# Roll back: stop the new container, pin the old image tag, restart.
docker compose -f templates/gitlab-compose.yml stop gitlab
# Edit gitlab-compose.yml back to the previous tag.
docker compose -f templates/gitlab-compose.yml up -d gitlab
```

If migrations partially ran and you can't roll back cleanly, see the disaster-recovery section below — restore from the backup you took in step 1.

## Disaster recovery

Use the most recent backup tar + secrets file:

```sh
# 1. Stop GitLab + drop the data volumes (or move them aside).
docker compose -f templates/gitlab-compose.yml down
mv data data.borked.$(date +%s)
mkdir -p data/{config,logs,data,caddy-config,caddy-data,runner}

# 2. Boot a clean GitLab on the SAME version the backup was taken on.
#    (Restore won't work cross-version.)
docker compose -f templates/gitlab-compose.yml up -d gitlab
docker compose -f templates/gitlab-compose.yml logs -f gitlab
# wait for "GitLab is now ready"

# 3. Drop the backup tar into the new container.
docker cp YYYYMMDD-HHMMSS_gitlab_backup.tar gitlab:/var/opt/gitlab/backups/

# 4. Drop the secrets file in.
docker cp YYYYMMDD-HHMMSS_gitlab-secrets.json gitlab:/etc/gitlab/gitlab-secrets.json

# 5. Stop the services that read from the DB before restoring.
docker exec -t gitlab gitlab-ctl stop puma
docker exec -t gitlab gitlab-ctl stop sidekiq

# 6. Run the restore. GitLab figures out the filename from the timestamp.
docker exec -t gitlab gitlab-backup restore BACKUP=YYYYMMDD-HHMMSS

# 7. Reconfigure + restart.
docker exec -t gitlab gitlab-ctl reconfigure
docker exec -t gitlab gitlab-ctl restart

# 8. Run integrity checks.
docker exec -t gitlab gitlab-rake gitlab:check SANITIZE=true
```

## How often to upgrade

| Cadence | Why |
|---|---|
| Patch releases (17.5.1 → 17.5.2) | every 2–4 weeks, low risk, do it casually |
| Minor releases (17.5 → 17.6) | once a month, follow the breaking-changes list |
| Major releases (17.x → 18.0) | once a year, plan a 30-minute window, **always backup first** |

GitLab releases on the 22nd of each month. The next minor is always available a few days later. Skipping months is fine; skipping years requires you to step through every major in between.
