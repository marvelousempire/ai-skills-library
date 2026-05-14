---
name: copy-language-audit
id: SK-0077
keywords: [write-copy, check-language, build-audit]
goal: Deliver copy language audit output correctly and completely.
hash: 4ef9a41
relations: []
before: []
governed_by: [global]
meta: dynamic
description: "When the user wants to audit marketing copy for contractual, binding, or overly-formal language and replace it with platform-appropriate vocabulary. Also use when the user mentions 'binding language,' 'integration language,' 'partnership language,' 'sounds too corporate,' 'sounds like we have contracts,' 'soften this,' 'loose language,' 'accommodate instead of integrate,' 'compatibility instead of integration,' 'too formal,' 'legal-sounding,' 'implied obligations,' or 'we don't want to imply a partnership.' Use this whenever copy implies contractual relationships, fixed integrations, or formal partnerships that the product hasn't committed to. For writing new copy from scratch, see copywriting. For general copy improvements, see copy-editing."
metadata:
  version: 1.0.0
---

# Copy Language Audit

You are auditing marketing copy for vocabulary that inadvertently implies contracts, formal integrations, partnerships, or legal obligations the product hasn't made — and replacing it with language that describes the same reality in looser, more accurate terms.

---

## Why this matters

Certain words carry legal and contractual weight in the minds of readers — especially founders, investors, and enterprise buyers:

- **"Integration"** implies a formal technical contract: APIs, SLAs, uptime commitments, versioned endpoints, support obligations.
- **"Partnership"** implies a business agreement: revenue share, co-marketing, joint liability, signed contracts.
- **"Certified"**, **"official"**, **"authorized"** imply a vetting process and ongoing relationship you may not have.

When a platform is early-stage and working with third-party services through public APIs or standard SDKs — not formal business agreements — these words overclaim. If the relationship ever dissolves, the copy becomes false overnight. If a lawyer or savvy buyer reads it, it creates expectations the company can't back up.

**The fix is not to hide the relationship — it's to describe it accurately.** "READYPLAY accommodates HealthKit data" is just as compelling as "READYPLAY integrates with HealthKit" and is true regardless of whether Apple ever acknowledges the product.

---

## The vocabulary map

| Binding / contractual | Loose / accurate |
|---|---|
| integrates with | accommodates, works with, reads from, accepts, supports |
| integration | compatibility, accommodation, support |
| integrations (noun, navigation) | compatibilities |
| partner | compatible platform, ecosystem peer, works alongside |
| partners (nav label) | compatible platforms |
| partnership | compatibility, working relationship |
| certified by | designed for, works with, built for |
| powered by [third party] | uses, reads from, built on top of |
| official [third-party] app | app that works with [third party] |
| we've partnered with | we work alongside, we accommodate |
| our integration with X | our X compatibility, how we work with X |

---

## Audit process

### Step 1 — Find binding vocabulary

Scan the copy for these patterns:

```
integrat(e|es|ion|ions|ing|ed)
partner(s|ship|ships|ed|ing)
certif(y|ied|ication)
official [brand name]
powered by [third party]
authorized
endorsed
```

Flag every instance. Note the page/section and the exact phrase.

### Step 2 — Classify each instance

For each flagged instance, ask:

1. **Is there a formal agreement?** (Signed contract, API agreement with commercial terms, co-marketing deal, revenue share)
   - Yes → language may be acceptable if the agreement is real and current
   - No → flag for replacement

2. **Would the relationship change if the third party stopped responding to emails?**
   - Yes → use loose language; the product works with the public API/SDK regardless of the relationship
   - No → formal language may be appropriate

3. **Does this appear in navigation, headings, or CTAs?** (High-impact placements amplify the implied commitment)
   - Yes → higher priority to fix
   - No → still worth fixing but lower urgency

### Step 3 — Rewrite using accommodation vocabulary

Use the vocabulary map above. Preserve the meaning; strip the obligation.

**Examples:**

```
Before: "Integrations — HealthKit, Whoop, and the wearable roadmap."
After:  "Compatibilities — HealthKit, Whoop, and the health data READYPLAY accommodates."

Before: "Ship & integrate"
After:  "Devices & compatibility"

Before: "Partners — Cameras, devices, and payments rails READYPLAY plays alongside."
After:  "Compatible platforms — Cameras, devices, and payments — what READYPLAY works alongside."

Before: "See our integrations"
After:  "See what's compatible"

Before: "We've partnered with Whoop to bring recovery data into your OVR."
After:  "READYPLAY accommodates Whoop recovery data in your OVR."
```

### Step 4 — Check the full surface

The vocabulary change must be consistent across:
- Navigation labels (mega menu, mobile nav, footer)
- Page headings and subheadings
- Body copy descriptions
- CTAs and button labels
- Meta descriptions and OG copy
- Any page dedicated to the topic (`/integrations/`, `/partners/`)

Don't fix the nav label and leave the page copy using the old vocabulary — the mismatch looks like an error.

---

## What NOT to change

Not all uses of these words are contractual:

- **"serious partners" in an investor context** — investors/co-investors are called partners in finance. This is accurate, not overclaiming.
- **"we partner with our users"** — rhetorical; no legal implication.
- **"partnership with the community"** — soft, relational use; fine.
- **API docs describing actual technical integration specs** — technical accuracy matters more than marketing softness here.

Apply judgment. The goal is to remove false implications of formal business relationships, not to scrub every use of the word "partner" from the English language.

---

## Output format

Deliver a table of all flagged instances:

| Location | Before | After | Priority |
|---|---|---|---|
| Products mega menu heading | "Ship & integrate" | "Devices & compatibility" | High |
| Products nav item | "Integrations" | "Compatibilities" | High |
| Products nav item | "Partners" | "Compatible platforms" | High |
| Footer nav | "Integrations" | "Compatibilities" | Medium |
| /integrations/ page H1 | "Integrations" | "Compatibility" | Medium |

Then list any instances you intentionally left unchanged, with one-sentence justification.

---

## Related skills

- **copywriting**: For writing new copy from scratch
- **copy-editing**: For general copy polish and accuracy
- **brand-voice:enforce-voice**: For maintaining brand tone consistency across the rewrite
