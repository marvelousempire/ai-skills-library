# READYPLAY copy vocabulary standards

Canonical word-choice decisions for all READYPLAY surfaces (marketing,
player web, admin, iOS copy). These are the **approved alternatives** to
language that implies formal contracts, business partnerships, or legal
obligations the platform has not made.

---

## The principle

READYPLAY is a platform that **accommodates** many data sources, devices,
and third-party services through their public APIs and standard SDKs — not
through formal business agreements. The copy must reflect this accurately.

Using "integration" or "partner" language implies:
- A signed contract between companies
- API SLAs and support obligations
- Revenue sharing or co-marketing commitments
- The relationship persists and is maintained

None of these may be true at a given moment. When the language implies they
are and they aren't, the copy is false — and potentially legally uncomfortable.

---

## Approved vocabulary map

### Technical relationships (APIs, SDKs, data flows)

| Avoid | Use instead | Why |
|---|---|---|
| integrates with | accommodates, works with, reads from, accepts | "Accommodates" is accurate: we accept the data, we don't have a contract |
| integration | compatibility, accommodation, support | Same reasoning |
| integrations (nav label) | Compatibilities | Noun form of the preferred vocabulary |
| powered by [Third Party] | uses, built with, reads from | "Powered by" implies a licensing or revenue relationship |
| built on [Third Party] | uses, built with | Less contractual |

### Business relationships (other companies, vendors, ecosystem)

| Avoid | Use instead | Why |
|---|---|---|
| partner | compatible platform, ecosystem peer, works alongside | "Partner" implies a business agreement |
| partners (nav label) | Compatible platforms | Noun form |
| partnership | compatibility, working relationship | Less binding |
| certified by | designed for, works with, built for | "Certified" implies an ongoing validation process |
| official [Third Party] app | app that works with [Third Party] | "Official" implies an endorsement |

### Column / section headings

| Avoid | Use instead |
|---|---|
| Ship & integrate | Devices & compatibility |
| Integrations | Compatibilities |
| Partners | Compatible platforms |

### Descriptions

| Avoid | Use instead |
|---|---|
| "HealthKit integration" | "HealthKit compatibility" or "accommodates HealthKit data" |
| "Whoop partnership" | "Whoop compatibility" |
| "payments rails READYPLAY integrates with" | "payments — what READYPLAY works alongside" |

### CTA labels

| Avoid | Use instead |
|---|---|
| "See integrations" | "See what's compatible" or "Explore compatibilities" |
| "View partners" | "See compatible platforms" |
| "See the ecosystem" | "See what's compatible" |

---

## What is NOT subject to this rule

These uses of "partner" are accurate and should stay:

- **Investor context** — "serious partners" in the context of fundraising. Investors
  are called partners in finance. This is a finance term, not a product claim.
- **"We partner with our users"** — rhetorical; no legal implication. Fine.
- **Technical docs describing actual formal agreements** — if READYPLAY has a
  genuine signed agreement with a company, call it what it is. This rule only
  applies where no formal agreement exists.
- **Internal communications** — word choice matters most in public-facing copy.

---

## URL note

This vocabulary rule applies to **labels and copy**, not URLs. The routes
`/integrations/` and `/partners/` remain unchanged — renaming routes requires
SEO analysis and redirect planning and is a separate decision.

---

## Change log

| Date | Change | PR |
|---|---|---|
| 2026-05-14 | Initial vocabulary standard established; updated Products mega menu + footer | #823 |

---

## See also

- Skill: [`copy-language-audit`](../skills/marketing/copy-language-audit/SKILL.md) — how to find and fix binding language across a surface
- Context: [`readyplay-product-marketing-context.md`](readyplay-product-marketing-context.md) — brand positioning
