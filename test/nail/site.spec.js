const { test, expect } = require("@playwright/test");

for (const [route, heading] of [
  ["/", "NAIL"],
  ["/people/", "People"],
  ["/publications/", "Publications"],
]) {
  test(`${route} preserves content, local assets, and responsive layout`, async ({ page }) => {
    const localFailures = [];
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (url.origin === new URL(page.url()).origin && response.status() >= 400) localFailures.push(`${response.status()} ${url.pathname}`);
    });
    await page.goto(route);
    await expect(page.locator("h1").first()).toHaveText(heading);
    await expect(page.locator("nav")).not.toContainText(/Projects|Plugins|Teaching|Repositories|Blog|CV/);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    expect(localFailures).toEqual([]);
    if (route === "/") {
      await expect(page.getByText("Welcome to the NTU AI Language Group (NAIL)!")).toBeVisible();
      const photo = page.locator('img[src*="NAIL_GROUP_PHOTO"]');
      await expect(photo).toBeVisible();
      await expect.poll(() => photo.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(page.getByRole("heading", { name: "News", exact: true })).toBeVisible();
    }
    if (route === "/people/") {
      await expect(page.locator(".member-card")).toHaveCount(20);
      await expect(page.getByRole("link", { name: "Luu Anh Tuan", exact: true })).toHaveAttribute("href", "https://tuanluu.github.io/");
      await expect(page.getByRole("link", { name: "Du Mingzhe", exact: true })).toHaveAttribute("href", "https://mingzhe.space");
    }
    if (route === "/publications/") {
      await expect(page.locator(".publications")).toContainText(/Mercury: A code efficiency benchmark for code large language models/i);
      await expect(page.locator(".bibliography > li").first()).toBeVisible();
    }
  });
}

test("publications cover early and recent work and remain searchable", async ({ page }) => {
  await page.goto("/publications/");
  expect(await page.locator(".bibliography > li").count()).toBeGreaterThan(200);
  await expect(page.locator("h2.bibliography").last()).toHaveText("Undated");
  await expect(page.getByRole("link", { name: "Google Scholar", exact: true })).toHaveAttribute(
    "href",
    "https://scholar.google.com/citations?user=d6ixOGYAAAAJ"
  );
  for (const title of ["Measuring the Checker", "Axiom-oriented Reasoning", "Uncertainty of Thoughts"]) {
    await page.locator("#bibsearch").fill(title);
    await expect(page.locator(".bibliography > li:visible")).toHaveCount(1);
    await expect(page.locator(".bibliography > li:visible .title")).toContainText(title);
  }
  await page.locator("#bibsearch").fill("Tracking the Truth");
  await expect(page.locator(".bibliography > li:visible")).toHaveCount(1);
  await expect(page.locator(".bibliography > li:visible")).toContainText("arXiv preprint withdrawn by the authors");
});

test("removed pages and build files stay unpublished", async ({ request }) => {
  for (const route of [
    "/projects/index.html",
    "/cv/",
    "/teaching/",
    "/repositories/",
    "/plugins/",
    "/blog/2025/plotly/",
    "/test/style_contract.js",
    "/requirements.txt",
    "/assets/rendercv/rendercv_output/Albert_Einstein_CV.pdf",
  ]) {
    expect((await request.get(route)).status(), route).toBe(404);
  }
});

test("navigation and theme toggle work", async ({ page, isMobile }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("/");
  if (isMobile) await page.locator(".navbar-toggler").click();
  await page.locator("nav").getByRole("link", { name: "People", exact: true }).click();
  await expect(page).toHaveURL(/\/people\/$/);
  await page.waitForLoadState("domcontentloaded");
  if (isMobile) await page.locator(".navbar-toggler").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.locator("#light-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
