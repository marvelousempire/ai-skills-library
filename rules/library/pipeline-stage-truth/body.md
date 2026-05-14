---
name: pipeline-stage-truth
id: RL-0031
keywords: [pipeline, stage, truth]
---

# Pipeline-stage truth — name the stage, don't generalize

Work moves through 6 distinct stages. Each is a different status. "Done" without a stage is a story, not a status.

| Stage | Meaning | Evidence |
|---|---|---|
| In my working tree | Files edited, not yet committed | `git status` |
| Committed | Local commit exists | `git log` |
| Pushed | On origin, but no PR yet | `git ls-remote` shows the SHA |
| PR'd | Pull request open, awaiting review/CI | `gh pr view` |
| Merged | PR merged to main | `gh pr view --json state` returns MERGED |
| Deployed | Build/deploy workflow run completed | `gh run list` shows completed/success |
| Live | Smoke test passed against the live URL | `curl` returns expected shape |

## The rule

When telling anyone (user, teammate, future-you in a doc) that work is "shipped" or "live":

- **Live** requires that you have curl'd the production URL OR seen `gh run list` show a `success` deploy workflow since the relevant merge to main, OR clicked through the live page
- **Shipped** requires the PR is merged into main
- **In review** = PR'd, awaiting merge
- **On a branch** = pushed but pre-PR
- **In my working tree** = committed locally, not on remote

If you can't name the stage, you don't know the status. Find out before reporting.

## Origin

Adopted from red-e-play's dev-discipline rules. Re-affirmed every "done" reply in the trainer-marketplace session.
