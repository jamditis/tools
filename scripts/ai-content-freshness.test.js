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
  "resource-kit/docs/downloads/AI-MODEL-SOURCE-REGISTER.md",
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
  ["Kimi K2.5 as a current model", /\bKimi K2\.5\b/i],
  [
    "obsolete Veo access guidance",
    /Video generation is only available in Gemini 3\.1 with Veo/i,
  ],
  ["unsupported 81% SWE-Bench claim", /\b81% on SWE-Bench\b/i],
  ["stale MiniMax weight promise", /MiniMax[^\n]{0,100}(?:weights?[^\n]{0,40}coming soon|verify (?:the )?(?:promised )?weight release)/i],
  ["stale xAI ownership wording", /(?:^|[^A-Za-z])xAI's current frontier model/i],
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
    "resource-kit/markdown/llm-advisor.md",
    "resource-kit/markdown/vibe-coding-guide.md",
  ];

  const missing = [];
  for (const relativePath of required) {
    const content = await readFile(resolve(root, relativePath), "utf8");
    if (!/Verified(?::\*\*)? August 15, 2026/.test(content)) {
      missing.push(relativePath);
    }
  }

  assert.deepEqual(missing, []);
});

test("the skills site card matches the current public catalog", async () => {
  const home = await readFile(
    resolve(root, "resource-kit/docs/index.html"),
    "utf8"
  );

  assert.match(home, /https:\/\/skills\.amditis\.tech\//);
  assert.match(home, /62 agent skills, 12 plugins, and 17 hooks/);
  assert.match(home, />62 Skills</);
  assert.match(home, />12 Plugins</);
  assert.match(home, />17 Hooks</);
  assert.doesNotMatch(home, /jamditis\.github\.io\/claude-skills-journalism/);
});

test("the model catalog includes each current provider tier", async () => {
  const models = JSON.parse(
    await readFile(
      resolve(root, "resource-kit/docs/llm-advisor/data/model-info.json"),
      "utf8"
    )
  );

  for (const model of [
    "Claude Opus 5",
    "GPT-5.6 Sol",
    "GPT-5.6 Terra",
    "GPT-5.6 Luna",
    "Gemini 3.7 Flash",
    "Gemini 3.5 Flash",
    "Gemini 3.6 Flash",
    "Qwen 3.8 Max (preview)",
    "Qwen 3.7 Plus",
    "Kimi K3 (open weights)",
    "MiniMax M3",
    "NVIDIA Nemotron 3 Ultra (open weights)",
    "Mistral Medium 3.5 (open weights)",
    "Mistral Small 4 (open weights)",
    "Step-3.7-Flash (open weights)",
    "MiMo-V2-Flash (open weights)",
    "Tencent Hy3 (open weights)",
    "Cohere Command A+ (open weights)",
    "Llama 4 Scout / Maverick (open weights)",
    "ERNIE 5.1",
    "ByteDance Seed2.0",
  ]) {
    assert.ok(models[model], `missing current model: ${model}`);
  }
});

test("the public advisor records the current refresh", async () => {
  const changelog = JSON.parse(
    await readFile(
      resolve(root, "resource-kit/docs/llm-advisor/data/changelog.json"),
      "utf8"
    )
  );
  const advisor = await readFile(
    resolve(root, "resource-kit/docs/llm-advisor/index.html"),
    "utf8"
  );

  assert.equal(changelog[0].version, "August 15, 2026");
  assert.match(changelog[0].notes, /official-source register/);
  assert.match(advisor, /Kit v2\.6/);
});

test("current recommendation surfaces use the newest workhorse models", async () => {
  const recommendationSurfaces = [
    "CLAUDE.md",
    "resource-kit/docs/index.html",
    "resource-kit/docs/downloads/LLM-COMPARISON.md",
    "resource-kit/docs/downloads/VIBE-CODING-CHECKLIST.md",
    "resource-kit/markdown/llm-advisor.md",
    "resource-kit/markdown/quick-reference.md",
  ];

  for (const relativePath of recommendationSurfaces) {
    const content = await readFile(resolve(root, relativePath), "utf8");
    assert.match(content, /Claude Opus 5/);
    assert.match(content, /Gemini 3\.7 Flash/);
  }

  const register = await readFile(
    resolve(root, "resource-kit/docs/downloads/AI-MODEL-SOURCE-REGISTER.md"),
    "utf8"
  );
  for (const provider of [
    "Moonshot AI",
    "DeepSeek",
    "Z.ai",
    "Alibaba Cloud",
    "Qwen Team, Alibaba",
    "MiniMax",
    "StepFun",
    "Xiaomi",
    "Tencent",
    "Baidu",
    "ByteDance",
    "Mistral AI",
    "Cohere",
    "NVIDIA",
    "Meta",
  ]) {
    assert.match(register, new RegExp(`\\| ${provider.replace(".", "\\.")} \\|`));
  }

  for (const currentSpecialist of [
    "GPT Image 2",
    "GPT Realtime 2.1",
    "Grok Imagine API",
    "Sonar Deep Research",
    "Eleven v3",
    "Music v2",
    "V8.2",
    "Nano Banana 2",
    "Veo 3.1",
    "Muse Image",
    "Seedream 5.0 Lite",
    "Voxtral TTS",
    "OCR 4",
  ]) {
    assert.match(register, new RegExp(currentSpecialist.replaceAll(".", "\\.")));
  }

  assert.match(register, /MiniMax Community License/);
  assert.match(register, /Imagen API models on August 17, 2026/);
  assert.match(register, /Sora 2 and Sora 2 Pro as legacy models/);
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
