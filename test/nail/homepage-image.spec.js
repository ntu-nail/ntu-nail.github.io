const { test, expect } = require("@playwright/test");

test("homepage prioritizes a responsive photo without downloading the original", async ({ page }) => {
  const requestedPhotos = [];
  page.on("request", (request) => {
    if (request.url().includes("NAIL_GROUP_PHOTO")) requestedPhotos.push(request.url());
  });
  await page.goto("/");
  const photo = page.locator('img[src*="NAIL_GROUP_PHOTO"]');
  await expect(photo).toHaveAttribute("loading", "eager");
  await expect(photo).toHaveAttribute("fetchpriority", "high");
  await expect(photo).toHaveAttribute("width", "4032");
  await expect(photo).toHaveAttribute("height", "3024");
  await expect.poll(() => photo.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  const resource = await photo.evaluate((image) => {
    const timing = performance.getEntriesByName(image.currentSrc)[0];
    return { src: image.currentSrc, bytes: timing?.encodedBodySize };
  });
  expect(resource.src).toMatch(/NAIL_GROUP_PHOTO-\d+\.webp$/);
  expect(resource.bytes).toBeGreaterThan(0);
  expect(resource.bytes).toBeLessThan(400000);
  expect(requestedPhotos).toEqual([resource.src]);
});

test("homepage reserves photo space before the image arrives", async ({ page }) => {
  let releaseImage;
  const imageGate = new Promise((resolve) => (releaseImage = resolve));
  await page.route("**/assets/img/NAIL_GROUP_PHOTO*", async (route) => {
    await imageGate;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const photo = page.locator('img[src*="NAIL_GROUP_PHOTO"]');
    const before = await photo.boundingBox();
    expect(before.width).toBeGreaterThan(300);
    expect(before.height / before.width).toBeCloseTo(0.75, 2);
    releaseImage();
    await expect.poll(() => photo.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    const after = await photo.boundingBox();
    expect(after.height).toBeCloseTo(before.height, 0);
  } finally {
    releaseImage();
  }
});
