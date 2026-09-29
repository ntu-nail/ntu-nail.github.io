# Publication filters

Replace the visible Publications heading, introductory copy, and old search field with two tag groups and a search input. Keep the navigation title, document title, and an accessible, visually hidden page heading.

- **Year:** newest first, with Undated last. Initially show the eight most recent years; expand to reach older years.
- **Publication venues:** use bibliography abbreviations, normalize CIKM 2017 to CIKM, and fall back to the full venue when an abbreviation is absent. Initially show the eight most frequent venues; expand to reach all others.
- Support multiple selected tags in each group. Matching uses OR within a group and AND between groups and the search query. Selecting All clears that group. Clear filters resets both groups and search.
- Search titles, complete author lists, full venues, year, and existing keywords. Match case-insensitively and ignore diacritics. All query words must match. Search must not depend on whether authors have been expanded.
- Show the matching publication count and a useful empty-result message. Hide empty year headings and lists. Keep selected tags visible when collapsing additional choices.
- Preserve the existing 229 bibliography records, entry links, author expansion, light/dark theme, responsive layout, and navigation. No new external requests or libraries.

Use the theme's default layout for page composition and its existing `hook/bib.liquid` extension point to emit escaped metadata on each publication. Add isolated page CSS and JavaScript. The hook is a site-owned extension, not a copy of the upstream bibliography template. Without JavaScript, the bibliography remains readable and the inactive controls stay hidden.

Validation covers tag generation, single and combined filters, multiple selections, reset, no results, hidden-author searches, keyboard operation, desktop/mobile overflow, dark mode, and unchanged bibliography counts. Run the existing build/audit/PurgeCSS/site-check pipeline before publishing.
