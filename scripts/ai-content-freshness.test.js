import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";
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
  "resource-kit/docs/next-level/index.html",
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
  ["GPT 5.6", /\bGPT[ -]?5\.6\b/i],
  ["Gemini 3.7 Flash", /\bGemini 3\.7 Flash\b/i],
  ["Gemini 3.1 Pro", /\bGemini 3\.1 Pro\b/i],
  ["Grok 4.5", /\bGrok 4\.5\b/i],
  ["GLM-5.2", /\bGLM-5\.2\b/i],
  ["Mistral Medium 3.5", /\bMistral Medium 3\.5\b/i],
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
    if (!/Verified(?::\*\*)? November 2, 2026/.test(content)) {
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
  assert.match(home, /76 agent skills, 14 plugins, and 17 hooks/);
  assert.match(home, />76 Skills</);
  assert.match(home, />14 Plugins</);
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
    "Claude Fable 5.1",
    "Claude Opus 5.5",
    "Claude Sonnet 5.5",
    "Claude Haiku 5.5",
    "GPT-6 Astra",
    "GPT-6.1 Sol",
    "GPT-6.1 Terra",
    "GPT-6 Luna",
    "Codex (GPT-6.1 Sol)",
    "Gemini 4 Argon",
    "Gemini 3.8 Flash",
    "Gemini 3.6 Flash",
    "Grok 4.7",
    "Qwen 3.8 Max",
    "Qwen 3.8 Flash",
    "Qwen 3.7 Plus",
    "Kimi K3 (open weights)",
    "MiniMax M3",
    "NVIDIA Nemotron 3 Ultra (open weights)",
    "Mistral Large 4 (open weights)",
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

  assert.equal(changelog[0].version, "November 2, 2026");
  assert.match(changelog[0].notes, /Codex guidance/);
  assert.match(advisor, /Kit v2\.8/);
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
    assert.match(content, /Claude Opus 5\.5/);
    assert.match(content, /Gemini 3\.8 Flash/);
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
    "GPT Image 2.5",
    "GPT Realtime 2.1",
    "Grok Imagine Image 2.0",
    "Agent API",
    "Eleven v4",
    "Music v2.5",
    "V8.2",
    "Nano Banana 2.1",
    "Gemini Omni Flash",
    "Muse Image",
    "Seedream 5.0 Lite",
    "Voxtral TTS 3",
    "OCR 4.1",
  ]) {
    assert.match(register, new RegExp(currentSpecialist.replaceAll(".", "\\.")));
  }

  assert.match(register, /MiniMax Community License/);
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

test("the copyable statusline preserves cumulative cost across pricing changes", async () => {
  const calculator = await readFile(
    resolve(root, "resource-kit/docs/cost-calculator/index.html"),
    "utf8"
  );
  const snippet = calculator.match(/<pre[^>]*id="snippet-code"[^>]*>([\s\S]*?)<\/pre>/)?.[1];
  assert.ok(snippet, "copyable statusline snippet exists");

  // The documented cumulative cost is the oracle. Identical historical usage
  // must not be repriced when the latest prompt crosses 100K or compacts.
  for (const [model, prompt, cost, expected] of [
    ["claude-haiku-5-5", 99999, 0.15, "~$0.15"],
    ["claude-haiku-5-5", 100001, 0.15, "~$0.15"],
    ["claude-haiku-5-5", 100001, 0.75, "~$0.75"],
    ["claude-haiku-5-5", 99999, 0.75, "~$0.75"],
    ["claude-opus-5-5", 99999, 0.75, "~$0.75"],
  ]) {
    const result = spawnSync("bash", ["-c", snippet], {
      input: JSON.stringify({
        model: { id: model },
        cost: { total_cost_usd: cost },
        context_window: {
          total_input_tokens: 1000000,
          total_output_tokens: 100000,
          current_usage: { input_tokens: prompt },
        },
      }),
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), expected, `${model}, prompt ${prompt}`);
  }
  const empty = spawnSync("bash", ["-c", snippet], { input: "{}", encoding: "utf8" });
  assert.equal(empty.status, 0, empty.stderr);
  assert.equal(empty.stdout.trim(), "~$0.00");
});

test("the calculator retains its displayed model and long-prompt prices", async () => {
  const calculator = await readFile(
    resolve(root, "resource-kit/docs/cost-calculator/index.html"),
    "utf8"
  );
  assert.match(calculator, /Claude Fable 5\.1/);
  assert.match(calculator, /\$10 \/ \$50 per M tokens/);
  assert.match(calculator, /fable:\s*\{\s*ip:\s*10,\s*op:\s*50,/);
  assert.match(calculator, /longPrompt:\s*\{\s*over:\s*100,\s*ip:\s*0\.5,\s*op:\s*2\.5,\s*cwp:\s*0\.625,\s*crp:\s*0\.05/);
});
