---
layout: about
title: About
permalink: /
subtitle: Welcome to Nanyang Technological University AI Language Group!
show_navbar_brand: true

selected_papers: false # includes a list of papers marked as "selected={true}"
social: false # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 8 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 4 # leave blank to include all the blog posts
---

<link rel="stylesheet" href="{{ '/assets/css/home.css' | relative_url | bust_file_cache }}">

<p><picture>
  {% if site.imagemagick.enabled %}
    <source
      type="image/webp"
      srcset="{% for width in site.imagemagick.widths %}{{ '/assets/img/NAIL_GROUP_PHOTO' | relative_url }}-{{ width }}.webp {{ width }}w{% unless forloop.last %}, {% endunless %}{% endfor %}"
      sizes="(min-width: {{ site.max_width }}) {{ site.max_width | minus: 30 }}px, calc(100vw - 30px)"
    >
  {% endif %}
  <img
    src="{{ '/assets/img/NAIL_GROUP_PHOTO.jpg' | relative_url }}"
    alt="NTU AI Language Group (NAIL) group photo"
    class="img-fluid"
    width="4032"
    height="3024"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  >
</picture></p>
