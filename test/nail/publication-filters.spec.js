const { test, expect } = require("@playwright/test");

test("publication filters combine multiple years, venues, and search", async ({ page }) => {
  await page.goto("/publications/");
  const years = page.getByRole("group", { name: "Year", exact: true });
  const venues = page.getByRole("group", { name: "Publication venues", exact: true });
  const entries = page.locator(".publications .bibliography > li:visible");
  const total = await entries.count();
  await expect(years.getByRole("button", { name: "All years", exact: true })).toHaveAttribute("aria-pressed", "true");
  await years.getByRole("button", { name: "2024", exact: true }).click();
  await venues.getByRole("button", { name: "NeurIPS", exact: true }).click();
  await expect(page.locator("h2.bibliography:visible")).toHaveText(["2024"]);
  await expect(entries.filter({ hasText: "Mercury: A Code Efficiency Benchmark" })).toHaveCount(1);
  await years.getByRole("button", { name: "2025", exact: true }).click();
  await expect(years.getByRole("button", { name: "2024", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(years.getByRole("button", { name: "2025", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(entries.filter({ hasText: "HyperGraphRAG:" })).toHaveCount(1);
  await venues.getByRole("button", { name: "ACL", exact: true }).click();
  await expect(entries.filter({ hasText: "CodeArena:" })).toHaveCount(1);
  await expect(entries.filter({ hasText: "HyperGraphRAG:" })).toHaveCount(1);
  await page.getByRole("searchbox", { name: "Search publications" }).fill("mercury");
  await expect(entries).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText(`1 of ${total} publications`);
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(entries).toHaveCount(total);
  await expect(page.getByRole("status")).toHaveText(`${total} publications`);
  await expect(page.getByRole("searchbox", { name: "Search publications" })).toBeEmpty();
});

test("publication filters search full authors and handle no results", async ({ page }) => {
  await page.goto("/publications/");
  const search = page.getByRole("searchbox", { name: "Search publications" });
  const entries = page.locator(".publications .bibliography > li:visible");
  await search.fill("  REGINA   BARZILAY  ");
  await expect(entries).toHaveCount(2);
  await expect(entries.filter({ hasText: "Deep learning to estimate RECIST" })).toHaveCount(1);
  await expect(entries.filter({ hasText: "Capturing Greater Context for Question Generation" })).toHaveCount(1);
  await page.getByRole("group", { name: "Year", exact: true }).getByRole("button", { name: "2026", exact: true }).click();
  await expect(entries).toHaveCount(0);
  await expect(page.getByText("No publications match these filters.", { exact: true })).toBeVisible();
  await expect(page.locator("h2.bibliography:visible")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.getByText("No publications match these filters.", { exact: true })).toBeHidden();
  expect(await entries.count()).toBeGreaterThan(200);
});

test("publication filters expose older tags and support keyboard and dark mode", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/publications/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const years = page.getByRole("group", { name: "Year", exact: true });
  const venues = page.getByRole("group", { name: "Publication venues", exact: true });
  await years.getByRole("button", { name: "More years" }).click();
  const year = years.getByRole("button", { name: "2007", exact: true });
  await year.focus();
  await page.keyboard.press("Space");
  await expect(year).toHaveAttribute("aria-pressed", "true");
  await years.getByRole("button", { name: "Fewer years" }).click();
  await expect(year).toBeVisible();
  await venues.getByRole("button", { name: "More venues" }).click();
  await venues.getByRole("button", { name: "URSW", exact: true }).focus();
  await page.keyboard.press("Enter");
  const entries = page.locator(".publications .bibliography > li:visible");
  await expect(entries).toHaveCount(1);
  await expect(entries).toContainText("Axiom-oriented Reasoning");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await venues.getByRole("button", { name: "All venues", exact: true }).click();
  await expect(venues.getByRole("button", { name: "URSW", exact: true })).toHaveAttribute("aria-pressed", "false");
  await year.focus();
  await page.keyboard.press("Space");
  await expect(year).toBeHidden();
  await expect(years.getByRole("button", { name: "More years" })).toBeFocused();
});

test("publication filters preserve a readable bibliography without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL || process.env.SITE_URL || "http://127.0.0.1:4000"}/publications/`);
  expect(await page.locator(".publications .bibliography > li:visible").count()).toBeGreaterThan(200);
  await expect(page.getByRole("group", { name: "Year", exact: true })).toBeHidden();
  await context.close();
});

test("publication filters include undated work and consolidate venue editions", async ({ page }) => {
  await page.goto("/publications/");
  const years = page.getByRole("group", { name: "Year", exact: true });
  const venues = page.getByRole("group", { name: "Publication venues", exact: true });
  const entries = page.locator(".publications .bibliography > li:visible");
  await years.getByRole("button", { name: "More years" }).click();
  await years.getByRole("button", { name: "Undated", exact: true }).click();
  await expect(entries).toHaveCount(3);
  await expect(page.locator("h2.bibliography:visible")).toHaveText(["Undated"]);
  await years.getByRole("button", { name: "All years", exact: true }).click();
  await venues.getByRole("button", { name: "More venues" }).click();
  await venues.getByRole("button", { name: "CIKM", exact: true }).click();
  await expect(entries).toHaveCount(4);
  await expect(entries.filter({ hasText: "CIKM 2017" })).toHaveCount(1);
  await expect(venues.getByRole("button", { name: "CIKM 2017", exact: true })).toHaveCount(0);
});
