# NTU NAIL upstream sync

This merge brings upstream `alshedivat/al-folio` main at `40c06007dab344970b681ba63b2241b1a8209ec1` into the NAIL site at `844969adf087fb8186b4c2df991d8908d6d027c1` (233 upstream commits).

## Migration decisions

- Adopt the upstream v1 theme/plugin gems and lockfile, including `al_folio_core` 1.0.15.
- Preserve the NAIL site identity, empty base URL, pages, bibliography, announcements, group photo, people information, and intentional demo deletions.
- Keep one reviewed local override, `_layouts/about.liquid`, based on the new gem with the existing capitalized `News` and `Latest Posts` headings. Track it in `.al-folio-overrides.yml`.
- Do not introduce upstream's new sample posts, teaching pages, plugin catalog page, citation cache, or Einstein CV PDF. Disable inherited demo external feeds, which otherwise generate posts despite the deleted blog page.
- Restrict upstream demo tests and automatic CV/citation publishing to the upstream repository. Keep the shared upgrade audit and add NAIL-specific production/browser checks.
- Exclude test files and build tooling from the published site.

## Validation

Both the original site and merged site built successfully in an isolated Ruby 3.3 Linux container. The candidate was also processed with the deployment's PurgeCSS command before browser checks.

Passed:

```sh
npm ci
bundle install
JEKYLL_ENV=production bundle exec jekyll build
purgecss -c purgecss.config.js
bundle exec al-folio upgrade audit
bundle exec al-folio upgrade overrides audit
bash test/integration_css_minify.sh
bash test/integration_upgrade_cli.sh
bash test/integration_plugin_toggles.sh
bash test/integration_bootstrap_compat.sh
npm run test:site
git diff --check
```

The upgrade audit reports zero blocking and zero non-blocking findings. All 12 Chromium checks pass across desktop and mobile: home, people, publications, projects, unpublished demo/build paths, navigation, and dark-mode switching.

Sixteen before/after screenshots were inspected at widths of 1440 and 390 pixels. Page structure, people cards, project grid dimensions, and content remain intact without horizontal overflow. Upstream changes include navigation icons and slightly different text colors. Pixel-identical rendering is not claimed.

`npm run lint:prettier` reports four existing formatting issues: `README.md`, `_data/repositories.yml`, `_pages/profiles.md`, and `assets/html/people.html`. The same four files fail with the same formatter on the original commit; they are preserved without unrelated formatting changes. Newly adapted files pass targeted formatting checks.

The upstream `lint:style-contract` and demo visual/integration suites are not NAIL release gates: they reject supported local overrides or require deleted demonstration content. `.github/workflows/site-checks.yml` provides the site-specific checks instead.

## Review and release

Review the merge through the sync branch/PR before updating `main`. Updating `main` triggers the site's existing deployment workflow. Preserve the merge commit ancestry when integrating so GitHub recognizes the upstream commits as synchronized.
