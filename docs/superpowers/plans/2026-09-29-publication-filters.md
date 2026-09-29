# Publication Filters Implementation Plan

**Goal:** Replace the old Publications header with year and venue tags plus combined text search.

**Architecture:** Compose this site-specific page with the existing default layout. Use the supported bibliography hook for escaped metadata, and a page-scoped JavaScript controller and stylesheet. Do not duplicate the upstream bibliography template or maintain a second publication dataset.

**Tech Stack:** Jekyll/Liquid, vanilla JavaScript/CSS, Playwright.

## 1. Specify and verify interactions

- [x] Verify the existing page-heading assertion accepts a visually hidden Publications heading without weakening coverage.
- [x] Add `test/nail/publication-filters.spec.js` covering multi-select OR, combined AND, full-author search, reset, empty groups, and keyboard controls.
- [x] Run the new tests against the existing build and confirm they fail because the new tag controls are absent.

Run:

```sh
rtk proxy env NODE_PATH=/private/tmp/ntu-nail-upstream-sync/node_modules PLAYWRIGHT_BROWSERS_PATH=/private/tmp/ntu-nail-playwright NO_WEBSERVER=1 SITE_URL=http://127.0.0.1:4250 /private/tmp/ntu-nail-upstream-sync/node_modules/.bin/playwright test --config test/nail/playwright.config.js --grep 'publication filters' --project=desktop --workers=1
```

## 2. Implement the controls

- [x] Replace `_pages/publications.md` header composition with a hidden accessible heading, Year and Publication venues fieldsets, search, reset, result count, and empty state. Keep `#bibsearch` for existing tests; stop including the theme's competing search controller.
- [x] Add `_includes/hook/bib.liquid` to supply escaped year, abbreviated venue, full venue, authors, and keywords from the single bibliography source.
- [x] Add `assets/js/publication-filters.js`: index entries once; create real toggle buttons with `aria-pressed`; combine selected sets and normalized query terms; hide unmatched entries and empty year groups; update the result count. Use DOM text APIs, not HTML interpolation.
- [x] Add `assets/css/publication-filters.css`: wrap chips within the page, use theme color variables, preserve focus indicators, style selected tags and the input, and enforce hidden states after PurgeCSS.
- [x] Keep controls hidden until successfully initialized; preserve all entries without JavaScript.

## 3. Verify and publish

- [x] Build a clean snapshot containing the new files in the existing Ruby 3.3 container.
- [x] Run `bundle exec al-folio upgrade audit`, `bundle exec al-folio upgrade overrides audit`, and `bundle exec jekyll build`; review any hook/override findings.
- [x] Run PurgeCSS including the new JS/CSS, then the complete NAIL browser suite on desktop and mobile.
- [x] Inspect screenshots of initial, filtered, expanded, empty, and dark-mode states. Confirm all 229 records remain unchanged.
- [x] Request focused code review, fix material findings, and rerun affected checks.
Release: commit only feature files, integrate into main, publish, and verify the live filters and deployment checks.

Validation: production build, both upgrade audits, CSS minification integration, Prettier, and all 22 desktop/mobile checks passed. The bibliography remains unchanged at 229 entries. Review found no blockers; the optional collapsed-tag keyboard-focus issue was reproduced and fixed with a regression assertion. The final build includes the independent People update from main (`4768bb1`).
