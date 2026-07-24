import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("accessibility snapshots preserve first-match selector behavior", async () => {
  const browserSource = await readFile(resolve(root, "scripts/browser.ts"), "utf8");
  assert.match(
    browserSource,
    /\.locator\(options\?\.root \|\| 'html'\)\s*\.first\(\)\s*\.ariaSnapshot\(\)/
  );
});
