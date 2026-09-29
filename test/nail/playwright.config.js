const { defineConfig, devices } = require("@playwright/test");
const path = require("node:path");

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: "*.spec.js",
  timeout: 30000,
  use: {
    baseURL: process.env.SITE_URL || "http://127.0.0.1:4000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: process.env.NO_WEBSERVER
    ? undefined
    : {
        command: "python3 -m http.server 4000 --bind 127.0.0.1 --directory _site",
        cwd: path.resolve(__dirname, "../.."),
        url: "http://127.0.0.1:4000",
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
});
