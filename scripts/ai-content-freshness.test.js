import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const activeSurfaces = [
  "CLAUDE.md",
  "CLAUDE-RULES-editorial-tool.md",
  "CLAUDE-RULES-general.md",
  "mcp-servers/llm-advisor-data/index.js",
  "resource-kit/docs/index.html",
  "resource-kit/docs/cost-calculator/index.html",
  "resource-kit/docs/quick-reference-card/index.html",
  "resource-kit/docs/llm-advisor-doc/index.html",
  "resource-kit/docs/llm-advisor/CLAUDE.md",
  "resource-kit/docs/llm-advisor/app.js",
  "resource-kit/docs/llm-advisor/index.html",
  "resource-kit/docs/llm-advisor/vibe-coding/index.html",
  "resource-kit/docs/llm-advisor/data/best-practices.json",
  "resource-kit/docs/llm-advisor/data/decision-tree.json",
  "resource-kit/docs/llm-advisor/data/model-info.json",
  "resource-kit/docs/llm-advisor/data/tool-comparison.json",
  "resource-kit/docs/terminal-setup/index.html",
  "resource-kit/docs/downloads/CLAUDE-RULES-editorial-tool.md",
  "resource-kit/docs/downloads/LLM-COMPARISON.md",
  "resource-kit/docs/downloads/VIBE-CODING-CHECKLIST.md",
  "resource-kit/markdown/llm-advisor.md",
  "resource-kit/markdown/quick-reference.md",
  "resource-kit/markdown/vibe-coding-guide.md",
];

const staleClaims = [
  ["GPT 5.5", /\bGPT[ -]?5\.5\b/i],
  ["Claude Sonnet 4.6", /\b(?:Claude )?Sonnet 4\.6\b/i],
  ["GLM-5.1", /\bGLM-5\.1\b/i],
  ["Grok 3", /\bGrok 3\b/i],
  ["DeepSeek R2", /\bDeepSeek R2\b/i],
  [
    "obsolete Veo access guidance",
    /Video generation is only available in Gemini 3\.1 with Veo/i,
  ],
  ["unsupported 81% SWE-Bench claim", /\b81% on SWE-Bench\b/i],
];

test("active AI guidance contains no known stale model claims", async () => {
  const failures = [];

  for (const relativePath of activeSurfaces) {
    const content = await readFile(resolve(root, relativePath), "utf8");
    for (const [label, pattern] of staleClaims) {
      if (pattern.test(content)) {
        failures.push(`${relativePath}: ${label}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test("primary AI guidance records when its model catalog was verified", async () => {
  const required = [
    "resource-kit/docs/index.html",
    "resource-kit/docs/llm-advisor/index.html",
    "resource-kit/docs/llm-advisor/vibe-coding/index.html",
    "resource-kit/docs/terminal-setup/index.html",
    "resource-kit/docs/downloads/LLM-COMPARISON.md",
  ];

  const missing = [];
  for (const relativePath of required) {
    const content = await readFile(resolve(root, relativePath), "utf8");
    if (!content.includes("Verified July 24, 2026")) {
      missing.push(relativePath);
    }
  }

  assert.deepEqual(missing, []);
});

test("Claude Code guidance uses current hook and subagent locations", async () => {
  const quickReference = await readFile(
    resolve(root, "resource-kit/docs/downloads/CLAUDE-CODE-QUICKREF.md"),
    "utf8"
  );
  const rulesTemplate = await readFile(
    resolve(root, "resource-kit/docs/downloads/CLAUDE-RULES-general.md"),
    "utf8"
  );
  const rootRulesTemplate = await readFile(
    resolve(root, "CLAUDE-RULES-general.md"),
    "utf8"
  );
  const decisionTree = await readFile(
    resolve(root, "resource-kit/docs/llm-advisor/data/decision-tree.json"),
    "utf8"
  );

  for (const content of [
    quickReference,
    rulesTemplate,
    rootRulesTemplate,
    decisionTree,
  ]) {
    assert.match(content, /\.claude\/settings\.json/);
    assert.doesNotMatch(content, /hooks should be placed in \.claude\/hooks/i);
    assert.doesNotMatch(content, /Define (?:specialized )?agents in \.claude\/settings/i);
  }

  assert.match(quickReference, /\.claude\/agents\/<name>\.md/);
  assert.match(rulesTemplate, /\.claude\/agents\/<name>\.md/);
  assert.equal(rootRulesTemplate, rulesTemplate);
});

test("best-practice agent workflow guidance is reachable in the UI", async () => {
  const app = await readFile(
    resolve(root, "resource-kit/docs/llm-advisor/app.js"),
    "utf8"
  );
  const data = JSON.parse(
    await readFile(
      resolve(root, "resource-kit/docs/llm-advisor/data/best-practices.json"),
      "utf8"
    )
  );

  assert.ok(data.general.agentWorkflows.length > 0);
  assert.match(app, /['"]Agent workflows['"]:\s*data\.agentWorkflows/);
});

test("the copyable Claude cost estimator matches the displayed prices", async () => {
  const calculator = await readFile(
    resolve(root, "resource-kit/docs/cost-calculator/index.html"),
    "utf8"
  );

  // Each arm lists every current model id at that price tier. A session on an id
  // no arm names falls through to the Sonnet default and understates its cost,
  // so a new model has to be added here rather than left to the fallback.
  assert.match(
    calculator,
    /\*fable-5\*\)\s+ip=10;\s*op=50;\s*cwp="12\.50";\s*crp="1\.0"/
  );
  assert.match(
    calculator,
    /\*opus-5\*\|\*opus-4-8\*\|\*opus-4-7\*\|\*opus-4-6\*\)\s+ip=5;\s*op=25;\s*cwp="6\.25";\s*crp="0\.5"/
  );
  assert.match(
    calculator,
    /\*sonnet-5\*\|\*sonnet-4-6\*\)\s+ip=3;\s*op=15;\s*cwp="3\.75";\s*crp="0\.3"/
  );
  assert.match(
    calculator,
    /\*haiku-4-5\*\)\s+ip=1;\s*op=5;\s*cwp="1\.25";\s*crp="0\.1"/
  );
  // The snippet is only correct if the page offers the same tiers, so the
  // Fable arm has to be reachable from the UI and the in-page pricing table.
  assert.match(calculator, /Claude Fable 5/);
  assert.match(calculator, /\$10 \/ \$50 per M tokens/);
  assert.match(calculator, /fable:\s*\{\s*ip:\s*10,\s*op:\s*50,/);
  assert.doesNotMatch(calculator, /\bip=15;\s*op=75\b/);
  assert.doesNotMatch(calculator, /\bip=0\.8;\s*op=4\b/);
});
