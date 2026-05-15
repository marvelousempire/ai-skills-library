# Mobile JWT TTL — access tokens must be ≥ 24h for mobile clients

JWT access tokens for mobile apps must be at least 24 hours. The recommended
value is 7 days. A 1-hour TTL on a mobile access token is not a security
measure — it is a silent data-loss time bomb.

---

## The failure mode

The iOS game sync flow:

1. User plays a game
2. User puts their phone down
3. User picks the phone back up 2+ hours later
4. SyncService fires on foreground
5. JWT access token is expired
6. Refresh exchange is attempted
7. If the refresh call fails — network drop, server 5xx, clock skew — the
   sync aborts silently
8. The game is never recorded
9. The user has permanent data loss with no error message

The refresh works 99% of the time. The 1% failure rate during a game sync is
permanent data loss. The game IDs may be marked as "pushed" even if the push
failed (depending on the push flow), creating a loop that is invisible to the
user and invisible to the operator.

---

## The rule

```
JWT_EXPIRES_IN=7d        # access token — mobile clients
JWT_REFRESH_EXPIRES_IN=90d  # refresh token — the real security boundary
```

The 90-day refresh token IS the security boundary. Shortening the access
token to 1 hour adds a silent failure point to the most critical data path
in the system with no user-visible error and no security benefit — a stolen
1-hour token is just as dangerous as a stolen 7-day token (both grant full
access until revoked, which requires a separate revocation mechanism
regardless of TTL).

---

## Diagnosis

```bash
# On the production VPS:
grep JWT_EXPIRES_IN /opt/readyplay/api/.env
# Should be 7d, NOT 1h
```

If you see `JWT_EXPIRES_IN=1h`, change it and restart the API process. No
migration required — new tokens issued after the restart will use the new TTL.
Existing tokens remain valid until they expire naturally.

---

## Exceptions

- **Web clients** (browser sessions): 1h access tokens + automatic refresh
  via httpOnly cookies are appropriate. The browser is always online when the
  user is interacting with it.
- **Service-to-service tokens** (cron jobs, webhooks): match the TTL to the
  job schedule, never shorter.
- **Admin tokens**: 8h (workday) is appropriate if MFA is required at login.

Mobile clients are the only case where a short access token TTL creates
systemic data-loss risk due to background sync patterns.

---

## First seen

Red-E Play production VPS, 2026-05-14. `JWT_EXPIRES_IN=1h` discovered during
game sync debugging. Changed to `7d`. The game pipeline diagnosis revealed
that zero game sessions were in the DB partly because of refresh failures
during background sync.
