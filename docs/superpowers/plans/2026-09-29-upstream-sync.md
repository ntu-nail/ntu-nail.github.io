# al-folio Upstream Sync Implementation Plan

> Execute in the isolated `codex/sync-al-folio-upstream` worktree. Use the upstream al-folio v1 migration workflow and request an independent code review before handoff.

**Goal:** Merge upstream main `40c06007dab344970b681ba63b2241b1a8209ec1` while retaining NTU NAIL content, routes, site identity, and intended homepage presentation.

**Architecture:** Preserve Git ancestry with a merge from upstream. Adopt the pinned v1 theme/plugin wiring; keep only explicitly reviewed local overrides. Validate on the organization site root (empty baseurl).

**Tech Stack:** Jekyll, Ruby 3.3, al-folio v1 gems, Node, Playwright, GitHub Actions.

- [x] Record clean origin/main baseline `844969adf087fb8186b4c2df991d8908d6d027c1` and build the baseline in an isolated environment.
- [x] Merge upstream on the isolated branch. Preserve locally deleted example content, the NAIL README, bibliography, data, pages, news, assets, and site settings; remove new demo-only content.
- [x] Resolve `_config.yml` using new theme/plugin/SRI wiring and NAIL site values. Review the old `_layouts/about.liquid` override (capitalized news heading) against the new gem and acknowledge any retained override.
- [x] Review GitHub Actions for upstream-demo assumptions. Retain build checks suitable for this customized site and avoid workflows that republish upstream demo data.
- [x] Install pinned dependencies. Run production Jekyll build, formatting checks, applicable integration tests, upgrade audit, and override audit. Document pre-existing or upstream-demo-only failures accurately.
- [x] Compare homepage, people, publications, and projects against baseline at desktop and mobile widths; check navigation, assets, and dark mode.
- [x] Request independent review of conflict resolutions and site preservation, fix material findings, and rerun affected checks.
- [ ] Commit the merge, push the isolated branch, and open a reviewable PR if repository access allows. Keep deployment behind review of the concrete result.
