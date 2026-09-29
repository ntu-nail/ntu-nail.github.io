---
layout: page
permalink: /publications/
title: Publications
description: Journal articles, conference papers, and preprints by Professor Luu Anh Tuan.
nav: true
nav_order: 2
---

Includes preprints and accepted papers, with published versions preferred where available.
Last updated: September 29, 2026. [Google Scholar](https://scholar.google.com/citations?user=d6ixOGYAAAAJ).

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography --query @*[year != Undated] %}

{% bibliography --query @*[year = Undated] %}

</div>
