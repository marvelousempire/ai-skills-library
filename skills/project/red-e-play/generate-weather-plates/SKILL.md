---
name: generate-weather-plates
id: SK-0123
keywords: [generate, weather, plates]
description: Generate the 16 cinematic weather background plates (8 conditions × day/night) for the Red-E Play HomeView hero by calling OpenAI's gpt-image-1. Drops the resulting JPGs straight into the iOS Assets.xcassets/WeatherPlates/ imagesets, ready for SwiftUI Image(...). Re-runnable for any subset (regenerate just one kind by passing its name as an arg). Reusable for any future "I need N AI-generated plates that match a brand prompt" task.
---

# generate-weather-plates

## What this skill does

Generates the 16 cinematic weather plates for the HomeView hero:

| Kind | Day | Night |
| --- | --- | --- |
| Clear · Cloudy · Windy · Rain · HeavyRain · Thunderstorm · Snow · Fog | ✅ | ✅ |

For each (kind, day/night), it:

1. Sends a polished prompt to OpenAI's `gpt-image-1` model (`size=1536x1024`,
   `quality=high`, `output_format=jpeg`).
2. Decodes the base64 JPG response.
3. Writes it to
   `Red-E Play/Red-E Play/Assets.xcassets/WeatherPlates/WeatherPlate_<Kind>_<DayOrNight>.imageset/WeatherPlate_<Kind>_<DayOrNight>.jpg`
4. Writes a matching `Contents.json` so Xcode treats it as a single 3x asset.

Total cost: ~$2.72 (16 × ~$0.17 per HD image at current OpenAI pricing —
verify with the user before kicking off a full run).

## When to invoke this skill

When the user wants the weather hero plates regenerated, or they ask to add
a new condition (just append a row to the prompt table in `generate.sh`).

## How to run it

```bash
# Generate all 16 (full run, ~$3, ~5–10 minutes)
~/.claude/skills/generate-weather-plates/generate.sh

# Generate one kind only (e.g. re-roll Rain_Day after a bad result)
~/.claude/skills/generate-weather-plates/generate.sh Rain_Day

# Or a subset
~/.claude/skills/generate-weather-plates/generate.sh Rain_Day Snow_Night Clear_Day
```

The script picks up `OPENAI_API_KEY` from (in order):

1. `$OPENAI_API_KEY` in the current shell environment.
2. The first `.env` file found at
   `<repo>/backend/.env`, `<repo>/.env`, or `<repo>/marketing/.env.local`.
3. If still missing, exits with a clear message asking the user to provide one.

The output directory (`Assets.xcassets/WeatherPlates/`) is auto-created if it
doesn't exist.

## Implementation notes

- `gpt-image-1` returns base64 JPEG in the response — use `jq -r '.data[0].b64_json' | base64 -d`.
- 1536×1024 is OpenAI's landscape size; the hero displays it at ~390×260pt so
  resolution is comfortable for @3x devices.
- The 16 prompts share a visual grammar: empty outdoor basketball half-court /
  neighborhood park, 35mm cinematic photo, shallow DoF, no people, landscape
  3:2-ish. Weather is implied in the still (wet asphalt for Rain, snow on rim
  for Snow, etc.) — moving particles drawn on top in SwiftUI sell the active
  condition.
- After a successful generation, the skill prints a summary table of (name,
  bytes, path) so you can spot-check at a glance.

## Cost & safety guardrails

- Each image is ~$0.17 at HD on `gpt-image-1`. Full run = ~$2.72.
- The script prints the planned operations + total estimated cost and waits
  for `[y/N]` confirmation before making any API call. Skip the prompt with
  `--yes` when you're sure (e.g. for a single-image re-roll).
- Files are written with `set -euo pipefail`; partial failures stop and
  preserve already-generated images, so re-running picks up where it left off.
