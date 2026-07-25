const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const buildDir = __dirname;
const docsDir = path.join(buildDir, "../docs");

const migratedPages = [
  "html-editor/index.html",
  "llm-advisor/ai-showcase/index.html",
  "llm-advisor/vibe-coding/index.html",
];

test("the final Tailwind pages use the compiled stylesheet", () => {
  for (const relativePath of migratedPages) {
    const html = fs.readFileSync(path.join(docsDir, relativePath), "utf8");
    assert.doesNotMatch(html, /cdn\.tailwindcss\.com/, relativePath);
    assert.match(
      html,
      /<link rel="stylesheet" href="\/assets\/tailwind\.css">/,
      relativePath
    );
  }
});

test("page-specific font families do not replace the shared theme", () => {
  const config = require("./tailwind.config.js");
  assert.deepEqual(config.theme.extend.fontFamily.sans, [
    "Plus Jakarta Sans",
    "sans-serif",
  ]);
  assert.deepEqual(config.theme.extend.fontFamily["vibe-sans"], [
    "Space Grotesk",
    "sans-serif",
  ]);
  assert.deepEqual(config.theme.extend.fontFamily["vibe-serif"], [
    "Merriweather",
    "serif",
  ]);
  assert.deepEqual(config.theme.extend.fontFamily["vibe-mono"], [
    "JetBrains Mono",
    "monospace",
  ]);

  const vibeGuide = fs.readFileSync(
    path.join(docsDir, "llm-advisor/vibe-coding/index.html"),
    "utf8"
  );
  assert.match(vibeGuide, /<body class="[^"]*\bfont-vibe-sans\b/);
});

test("the compiled stylesheet contains the interpolated showcase variants", () => {
  const css = fs.readFileSync(path.join(docsDir, "assets/tailwind.css"), "utf8");
  for (const selector of [
    ".hover\\:border-acid:hover",
    ".hover\\:border-ice:hover",
    ".hover\\:border-signal:hover",
    ".group:hover .group-hover\\:text-acid",
    ".group:hover .group-hover\\:text-ice",
    ".group:hover .group-hover\\:text-signal",
    ".group:hover .group-hover\\:text-chrome",
  ]) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
});

test("the migrated pages contain valid inline JavaScript", () => {
  for (const relativePath of migratedPages) {
    const html = fs.readFileSync(path.join(docsDir, relativePath), "utf8");
    const scripts = html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi);
    let index = 0;
    for (const match of scripts) {
      assert.doesNotThrow(
        () =>
          new vm.Script(match[1], {
            filename: `${relativePath}:inline-script-${index}`,
          }),
        relativePath
      );
      index += 1;
    }
  }
});
