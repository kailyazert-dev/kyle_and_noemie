# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A single-page, no-build, vanilla HTML/CSS/JS "will you go on a date with me" interactive page (`index.html`, `index.css`, `index.js`), in French. There is no package manager, bundler, framework, or test suite — the entire app is three static files plus a JSON data file.

## Running locally

Opening `index.html` directly via `file://` breaks the page: `index.js` loads text content from `index.json` via `fetch()`, which browsers block under the `file://` origin. Always serve the folder over HTTP instead, e.g.:

```
python -m http.server 8000
```

then visit `http://localhost:8000`. No build, lint, or test commands exist for this project.

## Architecture

The app is a linear, state-machine-like narrative flow driven entirely by DOM manipulation inside `index.js`, gated behind three "pages" in `index.html` that are shown/hidden by toggling `display`/`opacity` (`.container` → `#page-2` → `#page-3`):

1. **`.container` (page 1)** — Initial "Veut tu date avec moi ?" prompt with `#btn-oui` / `#btn-non`.
   - `#btn-non` never lets itself be clicked: `handlePointer()` (fed by `mousemove` on desktop, `touchstart` on mobile) detects proximity to the button via `TRIGGER_DISTANCE` and teleports it to a random position, escalating reactions (`spawnEmojis()`, `spawnTexts()`, shrinking the button / growing `#btn-oui`) based on `escapeCount`.
   - Clicking `#btn-oui` sets `gameOver = true` (stops `handlePointer` from doing anything further) and transitions to page 2.

2. **`#page-2`** — Typewriter-effect intro text (`texte1`), then reveals `#btn-suivant` to advance to page 3.

3. **`#page-3`** — Three clickable `.card` elements, each triggering `playThinkCard()` which types out one of `think_card1/2/3` into `#typed2` and, on completion of each specific card (by index), lazily starts one of three `<canvas>`-based animation loops that layer on top of each other and are never stopped once started:
   - card 0 → `startPetals()` (`#c-petals`, falling petal shapes)
   - card 1 → `startParticles()` (`#c-particles`, glowing dust particles)
   - card 2 → `startCharacters()` (`#c-chars`, a small pixel-art sprite animation drawn from hardcoded frame/palette arrays) and reveals the final WhatsApp CTA buttons (`#btns-final`)

   All three canvases are pre-declared in the HTML with `display:none` and only shown/sized when their corresponding animation starts.

## Content/code separation

User-facing narrative text lives in `index.json` (`texte1`, `think_card1`, `think_card2`, `think_card3`), not hardcoded in `index.js`. `index.js` fetches this file once at load time (`textesPromise`) and `await`s it inside the `#btn-oui` click handler before using any of the strings. When editing the copy, edit `index.json`; when editing behavior/animations, edit `index.js`.

The final call-to-action buttons (`#btn-final-oui` / `#btn-final-non`) link out to hardcoded `wa.me` WhatsApp URLs with pre-filled messages, defined directly in `index.html`.
