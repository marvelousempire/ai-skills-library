# Shared utilities — extract to lib/, never copy-paste

A pure function that appears in more than one route file, service, or
module is a `lib/` function waiting to be written. Copying it inline is
the first step toward the three files diverging silently over time.

---

## The rule

**If you write a function and immediately think "I also need this in
`admin.js`" or "this is the same logic as in `players.js`" — stop.**
Write it in `lib/` first, then `require`/`import` it in both places.

```
backend/src/lib/display-name.js   ← one source of truth
backend/src/routes/players.js     → require('../lib/display-name')
backend/src/routes/admin.js       → require('../lib/display-name')
backend/src/routes/auth-web.js    → require('../lib/display-name')
```

---

## The failure mode this prevents

A copy-pasted function in three files looks fine at write time. Six weeks
later someone fixes a bug in `players.js` and forgets `admin.js` and
`auth-web.js`. The admin shows a different format than the iOS app shows.
The bug is reported as a product inconsistency and takes hours to trace
back to three independent copies of what should be one function.

Real example from this repo: `computeShortDisplayName` was written in
`players.js`, then copied into `admin.js` and `auth-web.js` in the same
session. Three files, three definitions, all identical — but the next
person to change the format must find and update all three.

---

## What belongs in lib/

- Any function with no side effects (pure computation)
- Any function called from two or more routes
- Any formatter, normalizer, or validator that operates on the same
  domain concept in multiple places (display names, phone numbers, dates)

## What stays inline

- A one-liner that's only used in one place (moving it to lib/ adds
  complexity without benefit)
- Route-specific business logic that doesn't generalize
- Functions that depend on `req`, `res`, or route-level middleware context

---

## For Swift / iOS

The same principle applies. A computed property or method used in two
or more SwiftUI views belongs in a `Player+DisplayName.swift` extension
or a `NameFormatter.swift` utility, not inline in each view.

---

## Detecting drift

```bash
# Find functions defined more than once across route files
grep -rh "function compute\|function format\|function normalize" \
  backend/src/routes/ --include="*.js" | sort | uniq -d
```

Any non-empty output is a candidate for extraction.

## Naming convention

`lib/<domain>-<verb>.js` where domain is the data type and verb is the
operation: `display-name.js`, `phone-normalize.js`, `age-compute.js`.
Short and predictable beats creative.
