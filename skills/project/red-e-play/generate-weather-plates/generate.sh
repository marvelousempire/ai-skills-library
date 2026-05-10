#!/usr/bin/env bash
# generate.sh — produce 16 cinematic weather plates for the Red-E Play HomeView hero.
# Calls OpenAI gpt-image-1 and drops JPGs into Assets.xcassets/WeatherPlates/.
#
# Usage:
#   ./generate.sh                          # all 16 (with confirm prompt)
#   ./generate.sh --yes                    # all 16, skip confirm
#   ./generate.sh Rain_Day Snow_Night      # just these
#   ./generate.sh --yes Rain_Day           # subset, skip confirm
#
# Exit codes: 0=success, 1=missing dep / bad arg, 2=missing API key, 3=API error.

set -euo pipefail

# ---------- locate repo ----------
# The skill writes assets into a specific repo path. Try the env override first,
# then auto-detect from common worktree roots.
REPO_ROOT="${RED_E_PLAY_REPO_ROOT:-}"
if [[ -z "$REPO_ROOT" ]]; then
  # Walk up from $PWD looking for "Red-E Play" subdir + project.pbxproj.
  d="$(pwd)"
  while [[ "$d" != "/" ]]; do
    if [[ -d "$d/Red-E Play/Red-E Play" && -f "$d/Red-E Play/RedEPlay.xcodeproj/project.pbxproj" ]]; then
      REPO_ROOT="$d"; break
    fi
    d="$(dirname "$d")"
  done
fi
if [[ -z "$REPO_ROOT" ]]; then
  REPO_ROOT="/Users/nivram/Developer/red-e-play-app"
  if [[ ! -d "$REPO_ROOT/Red-E Play/Red-E Play" ]]; then
    echo "❌ Could not locate the Red-E Play repo. Set RED_E_PLAY_REPO_ROOT or run from inside it." >&2
    exit 1
  fi
fi

ASSETS_DIR="$REPO_ROOT/Red-E Play/Red-E Play/Assets.xcassets/WeatherPlates"
mkdir -p "$ASSETS_DIR"

# ---------- locate API key ----------
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  for envfile in \
    "$REPO_ROOT/backend/.env" \
    "$REPO_ROOT/.env" \
    "$REPO_ROOT/marketing/.env.local"; do
    if [[ -f "$envfile" ]]; then
      key="$(grep -E '^OPENAI_API_KEY=' "$envfile" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"' || true)"
      if [[ -n "$key" ]]; then OPENAI_API_KEY="$key"; export OPENAI_API_KEY; break; fi
    fi
  done
fi
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  cat >&2 <<MSG
❌ OPENAI_API_KEY is not set.

Set it once in your shell:
  export OPENAI_API_KEY=sk-...

Or add it to one of:
  $REPO_ROOT/backend/.env
  $REPO_ROOT/.env

Cost estimate: ~\$0.17 per image, ~\$2.72 for the full 16.
MSG
  exit 2
fi

# ---------- check deps ----------
for cmd in curl jq base64; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ Missing required command: $cmd" >&2
    exit 1
  fi
done

# ---------- prompt table ----------
# Format: NAME|PROMPT
# Shared visual grammar: empty outdoor basketball half-court / neighborhood
# park, 35mm cinematic photo, shallow DoF, no people, slight grain, landscape.
# Top 40% reserved for sky/treeline so headline copy floats over uniform area.
PLATES=(
  "Clear_Day|Empty outdoor basketball half-court in a neighborhood park, golden afternoon sunlight, dry asphalt, single hoop with crisp shadow, blurred green trees in background, distant city skyline hint, top 40 percent of frame is clear blue sky for headline copy, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Clear_Night|Empty outdoor basketball half-court in a neighborhood park at night, clear starry indigo sky filling top 40 percent of frame, single warm streetlamp casting glow on rim and asphalt, deep blue shadows, blurred suburban trees, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Cloudy_Day|Empty outdoor basketball half-court in a city park, overcast soft daylight, flat diffused light, single hoop, dry but pale asphalt, top 40 percent of frame is heavy grey cloud cover, blurred trees in background, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Cloudy_Night|Empty outdoor basketball half-court at night, thick low overcast sky in top 40 percent of frame with faint moonlight glow behind clouds, single hoop, single warm streetlamp, blurred suburban trees, deep blue and grey palette, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Windy_Day|Empty outdoor basketball half-court in a neighborhood park, bright windy afternoon, leaves and dust streaking through frame, net flapping sideways, fast moving thin clouds in top 40 percent of frame, blurred trees bending, 35mm cinematic photo, shallow depth of field, motion in foliage, no people, slight grain, landscape orientation, photorealistic"
  "Windy_Night|Empty outdoor basketball half-court at night, windy gust visible as blowing leaves, fast thin clouds in indigo sky in top 40 percent of frame, net flapping sideways, single warm streetlamp, blurred trees bending, deep blue palette, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Rain_Day|Empty outdoor basketball half-court in a city park, overcast rainy afternoon, wet glossy asphalt with reflections of the hoop and sky, single hoop, blurred trees in the background, top 40 percent of frame is heavy steel-grey rain cloud, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Rain_Night|Empty outdoor basketball half-court at night, rainy night, wet glossy asphalt reflecting warm streetlamp light, dark steel-blue sky filling top 40 percent of frame, single hoop with droplets on rim, blurred trees, atmospheric mist, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "HeavyRain_Day|Empty outdoor basketball half-court in a city park during a heavy downpour, deep puddles on asphalt with active ripples, dramatic dark grey storm sky filling top 40 percent of frame, single hoop dripping water, blurred trees barely visible through rain mist, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "HeavyRain_Night|Empty outdoor basketball half-court at night in a heavy downpour, deep puddles reflecting warm streetlamp light with active ripples, dramatic black storm sky filling top 40 percent of frame, single hoop dripping water, dense atmospheric mist, blurred trees, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Thunderstorm_Day|Empty outdoor basketball half-court in a city park during a thunderstorm, a single faint distant lightning bolt in the dark cumulonimbus cloud filling top 40 percent of frame, wet glossy asphalt with reflections, dramatic dark sky, single hoop, blurred trees, atmospheric mist, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Thunderstorm_Night|Empty outdoor basketball half-court at night during a thunderstorm, a single faint distant lightning bolt in the black storm cloud filling top 40 percent of frame, wet asphalt reflecting warm streetlamp light, single hoop, blurred trees, atmospheric mist, deep purple-black palette, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Snow_Day|Empty outdoor basketball half-court in a snowy park, fresh white snow on the asphalt and rim, pale grey overcast winter sky filling top 40 percent of frame, single hoop with snow on backboard, blurred bare trees, soft cool light, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Snow_Night|Empty outdoor basketball half-court at night, fresh snow on asphalt and rim, single warm streetlamp casting golden glow on white snow, deep blue-violet winter sky filling top 40 percent of frame, single hoop with snow on backboard, blurred bare trees, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Fog_Day|Empty outdoor basketball half-court in a foggy park, thick atmospheric fog limiting visibility, ghostly half-visible hoop, washed-out grey-white sky filling top 40 percent of frame, blurred fading silhouettes of trees, soft diffused daylight, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
  "Fog_Night|Empty outdoor basketball half-court at night in heavy fog, single warm streetlamp glowing through dense mist, ghostly silhouette of hoop, blurred fading silhouettes of trees, deep grey-blue palette, atmospheric and moody, 35mm cinematic photo, shallow depth of field, no people, slight grain, landscape orientation, photorealistic"
)

# ---------- arg parsing ----------
SKIP_CONFIRM=0
WANTED=()
for arg in "$@"; do
  case "$arg" in
    --yes|-y) SKIP_CONFIRM=1 ;;
    -*) echo "❌ Unknown flag: $arg" >&2; exit 1 ;;
    *)  WANTED+=("$arg") ;;
  esac
done

# ---------- filter prompts ----------
SELECTED=()
if [[ ${#WANTED[@]} -eq 0 ]]; then
  SELECTED=("${PLATES[@]}")
else
  for w in "${WANTED[@]}"; do
    found=0
    for p in "${PLATES[@]}"; do
      name="${p%%|*}"
      if [[ "$name" == "$w" ]]; then SELECTED+=("$p"); found=1; break; fi
    done
    if [[ $found -eq 0 ]]; then
      echo "❌ Unknown plate: $w" >&2
      echo "   Known names:" >&2
      for p in "${PLATES[@]}"; do echo "     ${p%%|*}" >&2; done
      exit 1
    fi
  done
fi

count=${#SELECTED[@]}
est_cost=$(awk "BEGIN { printf \"%.2f\", $count * 0.17 }")
echo "Plan: generate $count plate(s) → $ASSETS_DIR"
echo "Estimated OpenAI cost: ~\$$est_cost"
echo
for p in "${SELECTED[@]}"; do echo "  - ${p%%|*}"; done
echo

if [[ $SKIP_CONFIRM -eq 0 ]]; then
  read -r -p "Proceed? [y/N] " ans
  case "$ans" in y|Y|yes|YES) ;; *) echo "Aborted."; exit 0 ;; esac
fi

# ---------- generate one ----------
generate_one() {
  local name="$1"
  local prompt="$2"
  local set_dir="$ASSETS_DIR/WeatherPlate_${name}.imageset"
  local jpg_path="$set_dir/WeatherPlate_${name}.jpg"
  local contents_path="$set_dir/Contents.json"

  mkdir -p "$set_dir"

  echo "→ $name"
  local body
  body="$(jq -nc \
    --arg model "gpt-image-1" \
    --arg prompt "$prompt" \
    --arg size "1536x1024" \
    --arg quality "high" \
    --arg output_format "jpeg" \
    '{model: $model, prompt: $prompt, size: $size, quality: $quality, output_format: $output_format, n: 1}')"

  local resp
  if ! resp="$(curl -sS --fail-with-body \
      -X POST "https://api.openai.com/v1/images/generations" \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -H "Content-Type: application/json" \
      -d "$body")"; then
    echo "  ❌ API call failed for $name. Response:" >&2
    echo "$resp" >&2
    return 3
  fi

  # Extract b64 → write jpg
  local b64
  b64="$(echo "$resp" | jq -r '.data[0].b64_json // empty')"
  if [[ -z "$b64" ]]; then
    echo "  ❌ No b64_json in response for $name. Body was:" >&2
    echo "$resp" >&2
    return 3
  fi
  echo "$b64" | base64 -d > "$jpg_path"

  # Write Contents.json (single 3x universal image)
  cat > "$contents_path" <<JSON
{
  "images" : [
    {
      "filename" : "WeatherPlate_${name}.jpg",
      "idiom" : "universal",
      "scale" : "3x"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
JSON

  local size
  size="$(stat -f%z "$jpg_path" 2>/dev/null || stat -c%s "$jpg_path")"
  echo "  ✓ wrote $jpg_path (${size} bytes)"
}

# ---------- run ----------
echo
fail=0
for p in "${SELECTED[@]}"; do
  name="${p%%|*}"
  prompt="${p#*|}"
  if ! generate_one "$name" "$prompt"; then
    fail=$((fail+1))
  fi
done

echo
if [[ $fail -gt 0 ]]; then
  echo "Done with $fail failure(s). Re-run for failed names only."
  exit 3
fi
echo "Done. $count plate(s) written to:"
echo "  $ASSETS_DIR"
