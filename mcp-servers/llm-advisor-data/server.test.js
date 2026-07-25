const assert = require("node:assert/strict");
const fs = require("node:fs").promises;
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { Client } = require("@modelcontextprotocol/sdk/client/index.js");

const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js");

// validate_all_json marks each failure with U+274C. Writing the escape keeps a
// literal emoji out of source while still matching what the server emits.
const FAILURE_MARK = "\u274C";

const CATALOG_FILES = [
  "decision-tree.json",
  "case-studies.json",
  "model-info.json",
  "tool-comparison.json",
  "best-practices.json",
  "changelog.json",
];

async function copyCatalog(dataDirectory) {
  const sourceDirectory = path.join(
    __dirname,
    "../../resource-kit/docs/llm-advisor/data"
  );
  for (const filename of CATALOG_FILES) {
    await fs.copyFile(
      path.join(sourceDirectory, filename),
      path.join(dataDirectory, filename)
    );
  }
}

test("validation remains available when model-info.json is malformed", async (t) => {
  const dataDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "llm-advisor-malformed-")
  );
  await fs.writeFile(
    path.join(dataDirectory, "model-info.json"),
    '{"broken":',
    "utf8"
  );
  t.after(() => fs.rm(dataDirectory, { recursive: true, force: true }));

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(__dirname, "index.js")],
    cwd: __dirname,
    env: {
      ...process.env,
      LLM_ADVISOR_DATA_DIR: dataDirectory,
    },
    stderr: "pipe",
  });
  const client = new Client(
    { name: "llm-advisor-data-test", version: "1.0.0" },
    { capabilities: {} }
  );
  t.after(() => client.close());

  await client.connect(transport);
  const listed = await client.listTools();
  assert.ok(listed.tools.some((tool) => tool.name === "validate_all_json"));

  const result = await client.callTool({
    name: "validate_all_json",
    arguments: {},
  });
  assert.equal(result.isError, undefined);
  assert.match(result.content[0].text, new RegExp(`${FAILURE_MARK} modelInfo:`));
});

test("validation reports a syntactically valid model catalog with an invalid schema", async (t) => {
  const dataDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "llm-advisor-invalid-schema-")
  );
  await fs.writeFile(
    path.join(dataDirectory, "model-info.json"),
    JSON.stringify({
      Broken: {
        description: "Invalid catalog entry",
        features: [],
        link: "javascript:alert(1)",
      },
    }),
    "utf8"
  );
  t.after(() => fs.rm(dataDirectory, { recursive: true, force: true }));

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(__dirname, "index.js")],
    cwd: __dirname,
    env: {
      ...process.env,
      LLM_ADVISOR_DATA_DIR: dataDirectory,
    },
    stderr: "pipe",
  });
  const client = new Client(
    { name: "llm-advisor-data-test", version: "1.0.0" },
    { capabilities: {} }
  );
  t.after(() => client.close());

  await client.connect(transport);
  const result = await client.callTool({
    name: "validate_all_json",
    arguments: {},
  });

  assert.equal(result.isError, undefined);
  assert.match(
    result.content[0].text,
    new RegExp(`${FAILURE_MARK} modelInfo: Model Broken link must use HTTP or HTTPS`)
  );
});

test("MCP writes reject unsafe browser-bound content", async (t) => {
  const dataDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "llm-advisor-unsafe-url-")
  );
  await copyCatalog(dataDirectory);
  t.after(() => fs.rm(dataDirectory, { recursive: true, force: true }));

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(__dirname, "index.js")],
    cwd: __dirname,
    env: {
      ...process.env,
      LLM_ADVISOR_DATA_DIR: dataDirectory,
    },
    stderr: "pipe",
  });
  const client = new Client(
    { name: "llm-advisor-data-test", version: "1.0.0" },
    { capabilities: {} }
  );
  t.after(() => client.close());

  await client.connect(transport);
  const result = await client.callTool({
    name: "add_case_study",
    arguments: {
      title: "Unsafe case",
      tool: "Example",
      journalist: "Example newsroom",
      challenge: "Test boundary validation",
      solution: "Reject unsafe data",
      sourceUrl: 'javascript:alert("stored-xss")',
    },
  });

  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /sourceUrl must use HTTP or HTTPS/);
  const stored = JSON.parse(
    await fs.readFile(path.join(dataDirectory, "case-studies.json"), "utf8")
  );
  assert.equal(stored.some((study) => study.title === "Unsafe case"), false);

  for (const [version, notes] of [
    ["unsafe", '<img src=x onerror="alert(1)">'],
    ["unsafe-solidus-svg", "<svg/onload=alert(1)>"],
    ["unsafe-solidus-img", "<img/src=x onerror=alert(1)>"],
    [
      "unsafe-quoted-less-than",
      '<img/src=x onerror=alert(1) data-note="<">',
    ],
    [
      "unsafe-quoted-greater-than",
      '<svg/onload=alert(1) data-note=">">',
    ],
    ["unsafe-closing-tag", "</div>"],
    ["unsafe-comment", "<!-- comment -->"],
    ["unsafe-declaration", "<!DOCTYPE html>"],
    ["unsafe-processing-instruction", '<?xml version="1.0"?>'],
  ]) {
    const changelogResult = await client.callTool({
      name: "add_changelog_entry",
      arguments: { version, notes },
    });
    assert.equal(changelogResult.isError, true);
    assert.match(
      changelogResult.content[0].text,
      /Changelog notes must be plain text without HTML markup/
    );
  }
  const changelog = JSON.parse(
    await fs.readFile(path.join(dataDirectory, "changelog.json"), "utf8")
  );
  assert.equal(
    changelog.some((entry) => entry.version.startsWith("unsafe")),
    false
  );

  const comparisonTextResult = await client.callTool({
    name: "add_changelog_entry",
    arguments: {
      version: "comparison-text",
      notes: "Requires Node >=20 and confirms that 2 < 3.",
    },
  });
  assert.equal(comparisonTextResult.isError, undefined);
  const updatedChangelog = JSON.parse(
    await fs.readFile(path.join(dataDirectory, "changelog.json"), "utf8")
  );
  assert.equal(
    updatedChangelog.some(
      (entry) =>
        entry.version === "comparison-text" &&
        entry.notes === "Requires Node >=20 and confirms that 2 < 3."
    ),
    true
  );

  const adjacentComparisonResult = await client.callTool({
    name: "add_changelog_entry",
    arguments: {
      version: "adjacent-comparison-text",
      notes: "Use x<y when comparing adjacent values.",
    },
  });
  assert.equal(adjacentComparisonResult.isError, undefined);
  const finalChangelog = JSON.parse(
    await fs.readFile(path.join(dataDirectory, "changelog.json"), "utf8")
  );
  assert.equal(
    finalChangelog.some(
      (entry) =>
        entry.version === "adjacent-comparison-text" &&
        entry.notes === "Use x<y when comparing adjacent values."
    ),
    true
  );
});

// Omit decisionTree to exercise the shipped catalog unchanged.
async function makeCatalogWithDecisionTree(t, prefix, decisionTree) {
  const dataDirectory = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  await copyCatalog(dataDirectory);
  if (decisionTree !== undefined) {
    await fs.writeFile(
      path.join(dataDirectory, "decision-tree.json"),
      JSON.stringify(decisionTree),
      "utf8"
    );
  }
  t.after(() => fs.rm(dataDirectory, { recursive: true, force: true }));

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(__dirname, "index.js")],
    cwd: __dirname,
    env: {
      ...process.env,
      LLM_ADVISOR_DATA_DIR: dataDirectory,
    },
    stderr: "pipe",
  });
  const client = new Client(
    { name: "llm-advisor-data-test", version: "1.0.0" },
    { capabilities: {} }
  );
  t.after(() => client.close());
  await client.connect(transport);
  return client;
}

test("validation rejects a decision tree with no start node", async (t) => {
  const client = await makeCatalogWithDecisionTree(t, "llm-advisor-no-start-", {
    tools: {
      question: "Which tool fits?",
      options: [{ text: "Stay here", next: "tools" }],
    },
  });

  const result = await client.callTool({
    name: "validate_all_json",
    arguments: {},
  });

  assert.equal(result.isError, undefined);
  assert.match(result.content[0].text, new RegExp(`${FAILURE_MARK} decisionTree: .*start`));
});

test("validation rejects a decision tree option pointing at a missing node", async (t) => {
  const client = await makeCatalogWithDecisionTree(t, "llm-advisor-dangling-", {
    start: {
      question: "Where do you want to begin?",
      options: [{ text: "Go nowhere", next: "no_such_node" }],
    },
  });

  const result = await client.callTool({
    name: "validate_all_json",
    arguments: {},
  });

  assert.equal(result.isError, undefined);
  assert.match(result.content[0].text, new RegExp(`${FAILURE_MARK} decisionTree: .*no_such_node`));
});

// A catalog only reaches this state by being broken, which is exactly when the
// repair has to be possible. Validating the graph on the way in would reject the
// tree before the node that resolves its dangling edge could be added.
test("a node can be added to a tree whose edges do not yet resolve", async (t) => {
  const client = await makeCatalogWithDecisionTree(t, "llm-advisor-repair-", {
    start: {
      question: "Where do you want to begin?",
      options: [{ text: "Go to research", next: "research" }],
    },
  });

  const added = await client.callTool({
    name: "add_decision_node",
    arguments: {
      nodeId: "research",
      question: "What kind of research?",
      options: [{ text: "Back to the start", next: "start" }],
    },
  });

  assert.equal(added.isError, undefined);

  const result = await client.callTool({
    name: "validate_all_json",
    arguments: {},
  });

  assert.doesNotMatch(result.content[0].text, new RegExp(`${FAILURE_MARK} decisionTree`));
});

// The shipped catalog routes 38 terminal options to "recommendation", which is
// itself a node with no options. Validating that target as an ordinary node keeps
// the graph check honest without special-casing the name.
test("validation accepts the shipped decision tree", async (t) => {
  const client = await makeCatalogWithDecisionTree(t, "llm-advisor-shipped-");

  const result = await client.callTool({
    name: "validate_all_json",
    arguments: {},
  });

  assert.equal(result.isError, undefined);
  assert.doesNotMatch(result.content[0].text, new RegExp(`${FAILURE_MARK} decisionTree`));
});

const TERMINAL_OPTION = {
  text: "Finish here",
  next: "recommendation",
  tools: [
    {
      name: "Example approach",
      description: "What this approach is for.",
      tools: ["Claude Sonnet 5"],
      prompt: "Draft a plan for [TASK].",
    },
  ],
};

test("a node whose option ends at the recommendation view can be added", async (t) => {
  const client = await makeCatalogWithDecisionTree(t, "llm-advisor-terminal-");

  const result = await client.callTool({
    name: "add_decision_node",
    arguments: {
      nodeId: "verification_probe",
      question: "Does a terminal option publish?",
      options: [TERMINAL_OPTION],
    },
  });

  assert.equal(result.isError, undefined);
});

test("a terminal option carrying no recommendations is rejected", async (t) => {
  const client = await makeCatalogWithDecisionTree(t, "llm-advisor-no-tools-");

  const result = await client.callTool({
    name: "add_decision_node",
    arguments: {
      nodeId: "empty_terminal",
      question: "Does an empty terminal option publish?",
      options: [{ text: "Finish here", next: "recommendation" }],
    },
  });

  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /must list at least one recommendation/);
});

test("a terminal recommendation missing its model list is rejected", async (t) => {
  const client = await makeCatalogWithDecisionTree(t, "llm-advisor-no-models-");

  const result = await client.callTool({
    name: "add_decision_node",
    arguments: {
      nodeId: "modelless_terminal",
      question: "Does a recommendation with no models publish?",
      options: [
        {
          ...TERMINAL_OPTION,
          tools: [{ ...TERMINAL_OPTION.tools[0], tools: [] }],
        },
      ],
    },
  });

  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /must list at least one tool/);
});

// The catalog only reaches a schema-invalid state by being broken, which is when
// the repair matters. Running the full validator before the mutation blocked the
// one tool that could fix it, so a bad link had to be edited by hand.
test("a model entry with an unsafe link can be repaired through update_model_info", async (t) => {
  const dataDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "llm-advisor-repair-model-")
  );
  await copyCatalog(dataDirectory);
  await fs.writeFile(
    path.join(dataDirectory, "model-info.json"),
    JSON.stringify({
      Broken: {
        description: "Invalid catalog entry",
        features: [],
        link: "javascript:alert(1)",
      },
    }),
    "utf8"
  );
  t.after(() => fs.rm(dataDirectory, { recursive: true, force: true }));

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(__dirname, "index.js")],
    cwd: __dirname,
    env: { ...process.env, LLM_ADVISOR_DATA_DIR: dataDirectory },
    stderr: "pipe",
  });
  const client = new Client(
    { name: "llm-advisor-data-test", version: "1.0.0" },
    { capabilities: {} }
  );
  t.after(() => client.close());
  await client.connect(transport);

  const repaired = await client.callTool({
    name: "update_model_info",
    arguments: {
      modelName: "Broken",
      updates: { link: "https://example.com/broken" },
    },
  });

  assert.equal(repaired.isError, undefined);
  const stored = JSON.parse(
    await fs.readFile(path.join(dataDirectory, "model-info.json"), "utf8")
  );
  assert.equal(stored.Broken.link, "https://example.com/broken");

  // A name that is not in the catalog must still be refused, now from the
  // document read under the lock rather than a separate unlocked read.
  const unknown = await client.callTool({
    name: "update_model_info",
    arguments: { modelName: "Nonexistent", updates: { description: "x" } },
  });
  assert.equal(unknown.isError, true);
  assert.match(unknown.content[0].text, /Invalid model name/);
});

// JSON.parse creates an own "__proto__" key, and Object.assign copying it runs the
// Object.prototype setter, which repoints the entry's prototype instead of adding
// a field. The validator then reads the fields through that prototype and passes,
// while JSON.stringify writes only own properties, so the catalog would publish an
// empty entry and report success.
test("update_model_info rejects prototype keys instead of publishing an empty entry", async (t) => {
  const dataDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "llm-advisor-proto-")
  );
  await copyCatalog(dataDirectory);
  t.after(() => fs.rm(dataDirectory, { recursive: true, force: true }));

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(__dirname, "index.js")],
    cwd: __dirname,
    env: { ...process.env, LLM_ADVISOR_DATA_DIR: dataDirectory },
    stderr: "pipe",
  });
  const client = new Client(
    { name: "llm-advisor-data-test", version: "1.0.0" },
    { capabilities: {} }
  );
  t.after(() => client.close());
  await client.connect(transport);

  const before = JSON.parse(
    await fs.readFile(path.join(dataDirectory, "model-info.json"), "utf8")
  );
  const modelName = Object.keys(before)[0];

  const result = await client.callTool({
    name: "update_model_info",
    arguments: {
      modelName,
      updates: JSON.parse(
        '{"__proto__":{"description":"polluted","features":[],"link":"https://example.com"}}'
      ),
    },
  });

  assert.equal(result.isError, true);
  const after = JSON.parse(
    await fs.readFile(path.join(dataDirectory, "model-info.json"), "utf8")
  );
  assert.deepEqual(after, before);
});

// Object.assign throws on a null target and silently discards the result for a
// primitive one, so a corrupt entry was the one shape this tool could not repair.
for (const [label, corrupt] of [
  ["null", null],
  ["a primitive", "not an object"],
  ["an array", ["not", "an", "object"]],
]) {
  test(`a model entry that is ${label} can be replaced through update_model_info`, async (t) => {
    const dataDirectory = await fs.mkdtemp(
      path.join(os.tmpdir(), "llm-advisor-corrupt-")
    );
    await copyCatalog(dataDirectory);
    await fs.writeFile(
      path.join(dataDirectory, "model-info.json"),
      JSON.stringify({ Broken: corrupt }),
      "utf8"
    );
    t.after(() => fs.rm(dataDirectory, { recursive: true, force: true }));

    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [path.join(__dirname, "index.js")],
      cwd: __dirname,
      env: { ...process.env, LLM_ADVISOR_DATA_DIR: dataDirectory },
      stderr: "pipe",
    });
    const client = new Client(
      { name: "llm-advisor-data-test", version: "1.0.0" },
      { capabilities: {} }
    );
    t.after(() => client.close());
    await client.connect(transport);

    const repaired = await client.callTool({
      name: "update_model_info",
      arguments: {
        modelName: "Broken",
        updates: {
          description: "Repaired entry",
          features: ["one"],
          link: "https://example.com/repaired",
        },
      },
    });

    assert.equal(repaired.isError, undefined);
    const stored = JSON.parse(
      await fs.readFile(path.join(dataDirectory, "model-info.json"), "utf8")
    );
    assert.deepEqual(stored.Broken, {
      description: "Repaired entry",
      features: ["one"],
      link: "https://example.com/repaired",
    });
  });
}

// The boundary of the repair path, asserted so it is a known contract rather than
// a surprise: publish validation covers the whole catalog, so a single repair
// cannot land while a different entry is still corrupt. Never publishing an
// invalid document wins over repairability here.
test("a repair is refused while another entry is still corrupt", async (t) => {
  const dataDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "llm-advisor-corrupt-pair-")
  );
  await copyCatalog(dataDirectory);
  await fs.writeFile(
    path.join(dataDirectory, "model-info.json"),
    JSON.stringify({ Broken: null, AlsoBroken: null }),
    "utf8"
  );
  t.after(() => fs.rm(dataDirectory, { recursive: true, force: true }));

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(__dirname, "index.js")],
    cwd: __dirname,
    env: { ...process.env, LLM_ADVISOR_DATA_DIR: dataDirectory },
    stderr: "pipe",
  });
  const client = new Client(
    { name: "llm-advisor-data-test", version: "1.0.0" },
    { capabilities: {} }
  );
  t.after(() => client.close());
  await client.connect(transport);

  const result = await client.callTool({
    name: "update_model_info",
    arguments: {
      modelName: "Broken",
      updates: {
        description: "Repaired entry",
        features: ["one"],
        link: "https://example.com/repaired",
      },
    },
  });

  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /Model AlsoBroken must be a JSON object/);
});

// Assigning "__proto__" as a node id would repoint the tree's prototype instead
// of adding a node. The truthy existence check caught that by accident and blamed
// a collision, so the refusal is explicit and reports the real reason.
test("add_decision_node refuses prototype keys as node ids", async (t) => {
  const client = await makeCatalogWithDecisionTree(t, "llm-advisor-node-proto-");

  for (const nodeId of ["__proto__", "constructor", "prototype"]) {
    const result = await client.callTool({
      name: "add_decision_node",
      arguments: {
        nodeId,
        question: "Should this exist?",
        options: [{ text: "Back", next: "start" }],
      },
    });
    assert.equal(result.isError, true, `${nodeId} must be refused`);
    assert.match(result.content[0].text, /Node id must not be/);
  }

  const validation = await client.callTool({
    name: "validate_all_json",
    arguments: {},
  });
  assert.doesNotMatch(
    validation.content[0].text,
    new RegExp(`${FAILURE_MARK} decisionTree`)
  );
});
