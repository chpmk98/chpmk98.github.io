# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal single-page website for Alvin Tan, served at `chpmk98.github.io`. It is a
static site with no build step, no dependencies, and no tests. GitHub Pages serves
the repository root of the `master` branch directly, so any commit pushed to
`master` is published. Preview locally by opening `index.html` in a browser (or
`python3 -m http.server` from the repo root if you need a real origin).

The site is three hand-written files — `index.html`, `index.css`, `index.js` — plus
`js-yaml` loaded from a CDN (the only runtime dependency). Image assets live in
`figures/` (`figures/headshot-2025.jpg` is the About-section portrait, cropped from
`figures/IMG_8858.jpg`; `figures/headshot.jpg` is an older unused one). Each project's
files (a `content.yaml` plus its PDFs/images) live in `projects/<slug>/`, documented
in `projects/README.md`. The résumé PDF is in `projects/` too. `favicon.ico` is
referenced but not committed.

## Architecture

**Scroll-scrubbed CSS animations.** The navbar shrink, logo shrink, and anchor-offset
effects are all keyframe animations that are permanently `animation-play-state: paused`
with `animation-delay: calc(var(--scroll) * -1s)`. `index.js` recomputes the `--scroll`
CSS custom property on every `scroll` event as the page's scroll fraction relative to
the navbar height, which scrubs those animations to a frame instead of playing them.
There is no JavaScript that directly sets animated styles during normal operation — JS
only maintains the `--scroll` variable. The `shrinkNavbar`/`growNavbar`/`navbarScroll`
functions and large commented-out blocks are a superseded imperative approach; leave
them unless deliberately cleaning up.

**Sticky-header anchor offset.** Each section is a `.anchor` div whose `::before`
pseudo-element carries a negative top margin equal to a "header height", so `#anchor`
jump links land below the sticky navbar instead of under it. That offset height is
itself a scroll-scrubbed animation (`anchorResize`) so it tracks the navbar as it
shrinks.

**Runtime-built projects list.** The `#projectList` in the Projects section is empty
in the HTML; `index.js` fills it on load. It gets the list of `projects/` subdirectories
from the public GitHub contents API (`api.github.com/repos/chpmk98/chpmk98.github.io/
contents/projects`), so the list only reflects what has been pushed to `master` — there
is no build step and no manifest. For each subdirectory it fetches
`projects/<slug>/content.yaml` over a relative path, parses it with `js-yaml`, and
renders a `.project` card; relative paths in the YAML resolve against that project's
folder, absolute URLs are used as-is. `index.html?projects=slug1,slug2` overrides the
API call for local preview before pushing.

**Mobile breakpoint.** The `@media screen and (max-width: 580px)` block is a distinct
layout: the navbar becomes non-sticky and vertical, and every scroll-scrubbed
animation is turned off (`animation: none`) because the effects depend on the sticky
navbar. Any change to the desktop scroll behavior needs a matching decision in this
block.

## Conventions

- Layout uses `vw`/`vh` units and percentage margins throughout; font sizes are mostly
  percentages or `px`. Match the surrounding unit choice when editing a rule.
- Typography: body copy and headings are Lato; the `#navbar #logo` wordmark ("AT")
  and the `#titlePage #name` signature ("Alvin Tan") are JetBrains Mono, a deliberate
  paired monospace "identity" treatment — keep those two in the same font. Both
  families load from Google Fonts in `index.html`.
- Dead code is kept as comments rather than deleted. Follow that pattern for
  experimental changes unless asked to remove it.
