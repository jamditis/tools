import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skillUrl = new URL("../skills/pdf-design/SKILL.md", import.meta.url);

test("pdf-design publishes no maintainer-specific credential or upload wiring", async () => {
  const skill = await readFile(skillUrl, "utf8");

  const forbiddenPatterns = [
    /\/home\/jamditis\//,
    /drive-token\.json/,
    /1lKTdwq4_5uErj-tBN112WCdJGD2YtetO/,
    /1e5dtKOiuvk0PPrFq3UyNI2UAa6RFiom3/,
    /Shared with Joe/i,
    /Claude Workspace/i,
    /~\/\.claude\/scripts\/legion-browser\.py/,
  ];

  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(skill, pattern);
  }

  assert.match(skill, /user-chosen destination/i);
  assert.match(skill, /connected Google Drive (tool|integration)/i);
  assert.match(skill, /Do not read or parse raw OAuth token files/i);
  assert.match(skill, /--blink-settings=scriptEnabled=false/);
});
