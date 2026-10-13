// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  timeout: 30_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce", // 애니메이션 없이 결정적으로 검사 (앱은 prefers-reduced-motion을 존중)
    screenshot: "on",
    launchOptions: { slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 0 }
  },
  // PRD 호환성: 최신 Chrome / Edge (설치된 브라우저 사용, 별도 다운로드 불필요)
  projects: [
    { name: "chrome", use: { channel: "chrome" } },
    { name: "edge", use: { channel: "msedge" } }
  ]
});
