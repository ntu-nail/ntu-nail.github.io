---
layout: page
permalink: /people/
title: People
nav: true
nav_order: 7
---

<style>
  .people-section {
    max-width: 1200px;
    margin: 0 auto 2.5rem;
  }
  .people-section h2.people-heading {
    font-size: 1.4rem;
    border-bottom: 1px solid var(--global-divider-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1.25rem;
  }
  .lab-members {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  /* Collapse to 2 columns on medium screens */
  @media (max-width: 900px) {
    .lab-members {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Collapse to 1 column on small screens */
  @media (max-width: 600px) {
    .lab-members {
      grid-template-columns: 1fr;
    }
  }
  .member-card {
    background-color: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    padding: 1rem;
  }
  .member-card img,
  .member-card .member-initials {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 0.75rem;
  }
  .member-card img {
    display: block;
    object-fit: cover;
  }
  .member-card .member-initials {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--global-theme-color);
    color: var(--global-hover-text-color);
    font-size: 2.25rem;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
  .member-card h3 {
    font-size: 1.1rem;
    margin: 0.5rem 0 0.25rem;
  }
  .member-card p {
    color: var(--global-text-color-light);
    margin: 0;
  }
</style>

{% for section in site.data.people %}

<div class="people-section">
  <h2 class="people-heading">{{ section.title }}</h2>
  <div class="lab-members">
    {% for member in section.members %}
      <div class="member-card">
        {% if member.photo %}
          <img src="{{ member.photo | prepend: '/assets/img/people/' | relative_url }}" alt="{{ member.name }}" loading="lazy">
        {% else %}
          {% assign name_parts = member.name | split: ' ' %}
          <div class="member-initials" aria-hidden="true">{{ name_parts[0] | slice: 0 }}{{ name_parts[1] | slice: 0 }}</div>
        {% endif %}
        <h3>
          {% if member.url %}<a href="{{ member.url }}">{{ member.name }}</a>{% else %}{{ member.name }}{% endif %}
        </h3>
        <p>{{ member.role }}</p>
      </div>
    {% endfor %}
  </div>
</div>
{% endfor %}
