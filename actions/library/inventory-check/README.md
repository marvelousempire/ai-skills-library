# inventory-check (action)

Nephew's first move on every input. Scans rules/, skills/, agents/, and actions/library/ for an existing handler. Returns `match=true` with a handler reference, or `match=false` with a deficiency hint.

Spec: [`ACTION.md`](./ACTION.md).

See [`../../workflows/on-input-arrives.yml`](../../workflows/on-input-arrives.yml) for the primary usage.
