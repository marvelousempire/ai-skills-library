# Installer Release Checklist

Before pushing a version tag that triggers the release-<platform>.yml workflow.

## The installer script
```
[ ] bash -n installers/<platform>/install.sh   # syntax check passes
[ ] shellcheck --severity=error installers/<platform>/install.sh  # lint passes
[ ] All steps are idempotent (safe to re-run)
[ ] .env is only written if it doesn't already exist
[ ] SESSION_SECRET is generated with: openssl rand -hex 32
[ ] OLLAMA_MODEL default matches hardware target (not a too-large model)
[ ] LaunchAgent / systemd service file is idempotent
[ ] Script ends by opening the browser
[ ] Log file path is documented in the script header
```

## GitHub Actions workflow
```
[ ] runs-on: matches the target platform (macos-13 for Intel, ubuntu-latest for Linux)
[ ] validate job: syntax check + shellcheck
[ ] publish job: copies script, sha256sum, gh release create/upload
[ ] PUBLIC_REPO_TOKEN secret is set on the private repo
```

## VPS nginx config
```
[ ] location = /<platform> block redirects to GitHub Releases latest
[ ] location = /<platform>/sha256 block for checksum
[ ] location = /<platform>/guide block for README
[ ] nginx -t passes
[ ] systemctl reload nginx after adding config
```

## Verification after release
```bash
curl -fsSL https://get.yousirjuan.ai/<platform> | head -5
# Should show the script header

curl -fsSL https://get.yousirjuan.ai/<platform>/sha256
# Should show a SHA-256 hash
```
