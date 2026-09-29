---
layout: default
permalink: /publications/
title: Publications
nav: true
nav_order: 2
---

<link rel="stylesheet" href="{{ '/assets/css/publication-filters.css' | relative_url | bust_file_cache }}">
<script defer src="{{ '/assets/js/publication-filters.js' | relative_url | bust_file_cache }}"></script>

<div id="publication-browser">
<h1 class="publication-sr-only">Publications</h1>

<section class="publication-filters" aria-label="Filter publications" hidden>
  <fieldset class="publication-filter-group" data-filter="year">
    <legend>Year</legend>
    <div class="publication-filter-tags" id="publication-year-tags"></div>
  </fieldset>
  <fieldset class="publication-filter-group" data-filter="venue">
    <legend>Publication venues</legend>
    <div class="publication-filter-tags" id="publication-venue-tags"></div>
  </fieldset>
  <div class="publication-search">
    <label for="bibsearch" class="publication-sr-only">Search publications</label>
    <svg class="publication-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5"></circle>
      <path d="m15.5 15.5 5 5"></path>
    </svg>
    <input type="search" id="bibsearch" placeholder="Search titles, authors, or keywords…" autocomplete="off">
  </div>
  <div class="publication-filter-summary">
    <span class="publication-result-count" role="status" aria-live="polite" aria-atomic="true"></span>
    <button type="button" class="publication-clear" disabled>Clear filters</button>
  </div>
</section>

<div class="publication-empty" hidden>
  <p>No publications match these filters.</p>
  <p>Try another search or clear your filters.</p>
</div>

<div class="publications">

{% bibliography --query @*[year != Undated] %}

{% bibliography --query @*[year = Undated] %}

</div>
</div>
