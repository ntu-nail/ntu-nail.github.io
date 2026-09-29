(() => {
  const root = document.getElementById("publication-browser");
  if (!root) return;

  const controls = root.querySelector(".publication-filters");
  const search = root.querySelector("#bibsearch");
  const status = root.querySelector(".publication-result-count");
  const clear = root.querySelector(".publication-clear");
  const empty = root.querySelector(".publication-empty");
  const items = [...root.querySelectorAll(".publications ol.bibliography > li")];
  // Leave the full bibliography readable if metadata is unavailable.
  if (!items.length || items.some((item) => !item.querySelector(".publication-filter-data"))) return;

  // Compact filter labels; keep the original venue keys and citation text intact.
  const venueLabels = new Map([
    ["BioCreative", { short: "BC", full: "BioCreative" }],
    ["Cancer Discovery", { short: "CD", full: "Cancer Discovery" }],
    ["Cognitive Comp.", { short: "CC", full: "Cognitive Computation" }],
    ["Database Oxford", { short: "DB", full: "Database (Oxford)" }],
    ["Expert Systems", { short: "EXSY", full: "Expert Systems" }],
    ["Information Processing & Management", { short: "IPM", full: "Information Processing & Management" }],
    ["International Joint Conference on Rules and Reasoning", { short: "RuleML+RR", full: "International Joint Conference on Rules and Reasoning" }],
    ["Interspeech", { short: "IS", full: "Interspeech" }],
    ["Neurocomputing", { short: "NEUCOM", full: "Neurocomputing" }],
    ["Preprint", { short: "Prepr.", full: "Preprints" }],
  ]);

  const normalize = (text) =>
    text
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const entries = items.map((element) => {
    const data = element.querySelector(".publication-filter-data").dataset;
    const year = data.year.trim() || "Undated";
    const venue = data.venue.trim().replace(/\s+\d{4}$/, "") || "Other";
    const venueLabel = venueLabels.get(venue);
    const title = element.querySelector(".title")?.textContent || "";
    return {
      element,
      year,
      venue,
      text: normalize([title, data.authors, year, venue, venueLabel?.short, venueLabel?.full, data.fullVenue, data.keywords].join(" ")),
    };
  });

  const groups = [...root.querySelectorAll(".publications ol.bibliography")].map((list) => ({
    list,
    heading: list.previousElementSibling?.matches("h2.bibliography") ? list.previousElementSibling : null,
    items: [...list.children],
  }));
  const selected = { year: new Set(), venue: new Set() };
  const facets = [];

  function update() {
    const terms = normalize(search.value).split(" ").filter(Boolean);
    let count = 0;
    for (const entry of entries) {
      const matches =
        (!selected.year.size || selected.year.has(entry.year)) &&
        (!selected.venue.size || selected.venue.has(entry.venue)) &&
        terms.every((term) => entry.text.includes(term));
      entry.element.hidden = !matches;
      if (matches) count++;
    }
    for (const group of groups) {
      const hidden = group.items.every((item) => item.hidden);
      group.list.hidden = hidden;
      if (group.heading) group.heading.hidden = hidden;
    }
    for (const facet of facets) facet.refresh();
    status.textContent = count === entries.length ? `${count} publications` : `${count} of ${entries.length} publications`;
    empty.hidden = count !== 0;
    clear.disabled = !selected.year.size && !selected.venue.size && !search.value;
  }

  function addFacet(key, labels, values) {
    const tags = root.querySelector(`[data-filter="${key}"] .publication-filter-tags`);
    const selection = selected[key];
    const limit = 8;
    let expanded = false;

    function button(label, className) {
      const element = document.createElement("button");
      element.type = "button";
      element.className = className;
      element.textContent = label;
      tags.append(element);
      return element;
    }

    const all = button(labels.all, "publication-tag");
    all.addEventListener("click", () => {
      selection.clear();
      update();
    });
    const options = values.map((value) => {
      const display = key === "venue" ? venueLabels.get(value) : null;
      const element = button(display?.short || value, "publication-tag");
      if (display) element.title = display.full;
      element.addEventListener("click", () => {
        if (selection.has(value)) selection.delete(value);
        else selection.add(value);
        update();
      });
      return { value, element };
    });

    const toggle = values.length > limit ? button(labels.more, "publication-expand") : null;
    if (toggle) {
      toggle.setAttribute("aria-controls", tags.id);
      toggle.addEventListener("click", () => {
        expanded = !expanded;
        refresh();
      });
    }

    function refresh() {
      all.setAttribute("aria-pressed", String(!selection.size));
      options.forEach(({ value, element }, index) => {
        const active = selection.has(value);
        element.setAttribute("aria-pressed", String(active));
        const hidden = !expanded && index >= limit && !active;
        if (hidden && document.activeElement === element) toggle?.focus();
        element.hidden = hidden;
      });
      if (toggle) {
        toggle.textContent = expanded ? labels.less : labels.more;
        toggle.setAttribute("aria-expanded", String(expanded));
      }
    }
    facets.push({ refresh });
  }

  const years = [...new Set(entries.map((entry) => entry.year))].sort((a, b) => {
    if (a === "Undated") return 1;
    if (b === "Undated") return -1;
    return Number(b) - Number(a) || a.localeCompare(b);
  });
  const venueCounts = new Map();
  for (const entry of entries) venueCounts.set(entry.venue, (venueCounts.get(entry.venue) || 0) + 1);
  const venues = [...venueCounts.keys()].sort((a, b) => venueCounts.get(b) - venueCounts.get(a) || a.localeCompare(b));
  addFacet("year", { all: "All years", more: "More years", less: "Fewer years" }, years);
  addFacet("venue", { all: "All venues", more: "More venues", less: "Fewer venues" }, venues);

  search.addEventListener("input", update);
  clear.addEventListener("click", () => {
    selected.year.clear();
    selected.venue.clear();
    search.value = "";
    update();
  });

  // Retain links that used the previous bibliography search hash.
  try {
    const query = decodeURIComponent(window.location.hash.slice(1));
    if (query && !document.getElementById(query)) search.value = query;
  } catch {
    // A malformed hash must not prevent the controls from loading.
  }
  update();
  controls.hidden = false;
})();
