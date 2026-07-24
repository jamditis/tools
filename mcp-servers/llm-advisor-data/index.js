#!/usr/bin/env node
/**
 * MCP Server: LLM Advisor Data Management
 *
 * Provides tools for managing LLM Advisor JSON data files with:
 * - Schema validation
 * - CRUD operations for decision tree nodes
 * - Case study management
 * - Model info updates
 * - Dynamic tool updates via list_changed notifications
 *
 * New Claude Code v2.1 Features Used:
 * - MCP list_changed notifications for dynamic tool updates
 * - Wildcard permissions (mcp__llm-advisor-data__*)
 */

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const fs = require("fs").promises;
const path = require("path");
const { JsonFileStore } = require("./storage.js");

// Data file paths
const DATA_DIR = process.env.LLM_ADVISOR_DATA_DIR
  ? path.resolve(process.env.LLM_ADVISOR_DATA_DIR)
  : path.join(__dirname, "../../resource-kit/docs/llm-advisor/data");
const FILES = {
  decisionTree: path.join(DATA_DIR, "decision-tree.json"),
  caseStudies: path.join(DATA_DIR, "case-studies.json"),
  modelInfo: path.join(DATA_DIR, "model-info.json"),
  toolComparison: path.join(DATA_DIR, "tool-comparison.json"),
  bestPractices: path.join(DATA_DIR, "best-practices.json"),
  changelog: path.join(DATA_DIR, "changelog.json"),
};

// Create server instance
const server = new Server(
  {
    name: "llm-advisor-data",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper: Read JSON file
async function readJsonFile(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

const jsonStore = new JsonFileStore();

function validateRecord(data, name) {
  if (!data || Array.isArray(data) || typeof data !== "object") {
    throw new Error(`${name} must be a JSON object`);
  }
}

function isAsciiLetter(character) {
  return (
    (character >= "A" && character <= "Z") ||
    (character >= "a" && character <= "z")
  );
}

function isHtmlWhitespace(character) {
  return (
    character === " " ||
    character === "\t" ||
    character === "\n" ||
    character === "\f" ||
    character === "\r"
  );
}

function containsHtmlMarkup(value) {
  for (
    let start = value.indexOf("<");
    start !== -1;
    start = value.indexOf("<", start + 1)
  ) {
    let cursor = start + 1;
    if (value[cursor] === "/") {
      cursor += 1;
    }

    const opener = value[cursor];
    if (opener === "!" || opener === "?") {
      if (value.indexOf(">", cursor + 1) !== -1) {
        return true;
      }
      continue;
    }
    if (!isAsciiLetter(opener)) {
      continue;
    }

    for (cursor += 1; cursor < value.length; cursor += 1) {
      const character = value[cursor];
      if (character === ">") {
        return true;
      }
      if (character !== "=") {
        continue;
      }

      let attributeValueStart = cursor + 1;
      while (isHtmlWhitespace(value[attributeValueStart])) {
        attributeValueStart += 1;
      }
      const quote = value[attributeValueStart];
      if (quote !== '"' && quote !== "'") {
        continue;
      }

      const quoteEnd = value.indexOf(quote, attributeValueStart + 1);
      if (quoteEnd === -1) {
        break;
      }
      cursor = quoteEnd;
    }
  }

  return false;
}

function validatePlainText(value, name) {
  if (typeof value !== "string" || containsHtmlMarkup(value)) {
    throw new Error(`${name} must be plain text without HTML markup`);
  }
}

function validateHttpUrl(value, name, { allowEmpty = false } = {}) {
  if (allowEmpty && value === "") {
    return;
  }
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} must be an absolute HTTP(S) URL`);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute HTTP(S) URL`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use HTTP or HTTPS`);
  }
}

function validateDecisionTree(data) {
  validateRecord(data, "Decision tree");
  for (const [nodeId, node] of Object.entries(data)) {
    validateRecord(node, `Decision node ${nodeId}`);
    if (typeof node.question !== "string" || !Array.isArray(node.options)) {
      throw new Error(
        `Decision node ${nodeId} must have a question and options array`
      );
    }
  }
}

function validateCaseStudies(data) {
  if (!Array.isArray(data)) {
    throw new Error("Case studies must be a JSON array");
  }
  for (const [index, study] of data.entries()) {
    validateRecord(study, `Case study ${index}`);
    for (const field of ["title", "tool", "journalist", "challenge", "solution"]) {
      if (typeof study[field] !== "string" || !study[field].trim()) {
        throw new Error(`Case study ${index} must have a non-empty ${field}`);
      }
    }
    validateHttpUrl(study.sourceUrl || "", `Case study ${index} sourceUrl`, {
      allowEmpty: true,
    });
  }
}

function validateModelInfo(data) {
  validateRecord(data, "Model info");
  for (const [name, model] of Object.entries(data)) {
    validateRecord(model, `Model ${name}`);
    if (
      typeof model.description !== "string" ||
      !Array.isArray(model.features) ||
      typeof model.link !== "string"
    ) {
      throw new Error(
        `Model ${name} must have a description, features array, and link`
      );
    }
    validateHttpUrl(model.link, `Model ${name} link`);
  }
}

function validateChangelog(data) {
  if (!Array.isArray(data)) {
    throw new Error("Changelog must be a JSON array");
  }
  for (const [index, entry] of data.entries()) {
    validateRecord(entry, `Changelog entry ${index}`);
    if (
      typeof entry.version !== "string" ||
      typeof entry.notes !== "string"
    ) {
      throw new Error(
        `Changelog entry ${index} must have string version and notes fields`
      );
    }
  }
}

// Load model names only when a tool needs them. Keeping startup independent
// from catalog health leaves validate_all_json available to diagnose and repair
// malformed or missing data files.
async function getValidModels() {
  const models = await readJsonFile(FILES.modelInfo);
  validateModelInfo(models);
  return Object.keys(models);
}

// Helper: Validate model names
async function validateModelName(name) {
  const validModels = await getValidModels();
  if (!validModels.includes(name)) {
    throw new Error(
      `Invalid model name: "${name}". Valid names: ${validModels.join(", ")}`
    );
  }
  return true;
}

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const validModels = await getValidModels().catch(() => []);
  const modelNameDescription =
    validModels.length > 0
      ? `Model name (one of: ${validModels.join(", ")})`
      : "Model name from model-info.json (catalog currently unavailable)";

  return {
    tools: [
      {
        name: "list_decision_nodes",
        description: "List all nodes in the decision tree",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_decision_node",
        description: "Get a specific decision tree node by ID",
        inputSchema: {
          type: "object",
          properties: {
            nodeId: {
              type: "string",
              description: "The node ID (e.g., 'start', 'research', 'content')",
            },
          },
          required: ["nodeId"],
        },
      },
      {
        name: "add_decision_node",
        description: "Add a new node to the decision tree",
        inputSchema: {
          type: "object",
          properties: {
            nodeId: {
              type: "string",
              description: "Unique ID for the new node",
            },
            question: {
              type: "string",
              description: "The question to display at this node",
            },
            options: {
              type: "array",
              description: "Array of option objects with text and next fields",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  next: { type: "string" },
                },
              },
            },
          },
          required: ["nodeId", "question", "options"],
        },
      },
      {
        name: "add_case_study",
        description: "Add a new case study to the collection",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Case study title",
            },
            tool: {
              type: "string",
              description: "Primary AI tool used",
            },
            journalist: {
              type: "string",
              description: "Journalist or news organization",
            },
            challenge: {
              type: "string",
              description: "The challenge they faced",
            },
            solution: {
              type: "string",
              description: "How they solved it with AI",
            },
            outcome: {
              type: "string",
              description: "Results achieved",
            },
            quote: {
              type: "string",
              description: "Optional representative quote",
            },
            tips: {
              type: "string",
              description: "Optional practical tips",
            },
            sourceUrl: {
              type: "string",
              description: "Public source URL",
            },
          },
          required: ["title", "tool", "journalist", "challenge", "solution"],
        },
      },
      {
        name: "update_model_info",
        description: "Update information for an AI model",
        inputSchema: {
          type: "object",
          properties: {
            modelName: {
              type: "string",
              description: modelNameDescription,
            },
            updates: {
              type: "object",
              description: "Fields to update (description, strengths, weaknesses, etc.)",
            },
          },
          required: ["modelName", "updates"],
        },
      },
      {
        name: "validate_all_json",
        description: "Validate all JSON data files for syntax and consistency",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "check_model_names",
        description: "Check all files for outdated model names",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "add_changelog_entry",
        description: "Add a new entry to the changelog",
        inputSchema: {
          type: "object",
          properties: {
            version: {
              type: "string",
              description: "Version number (e.g., '2.1.0')",
            },
            notes: {
              type: "string",
              description:
                "Plain-text changelog notes; comparison operators such as >= are allowed",
            },
          },
          required: ["version", "notes"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_decision_nodes": {
        const tree = await readJsonFile(FILES.decisionTree);
        const nodes = Object.keys(tree).map((id) => ({
          id,
          question: tree[id].question,
          optionCount: tree[id].options?.length || 0,
        }));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(nodes, null, 2),
            },
          ],
        };
      }

      case "get_decision_node": {
        const tree = await readJsonFile(FILES.decisionTree);
        const node = tree[args.nodeId];
        if (!node) {
          throw new Error(`Node not found: ${args.nodeId}`);
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ id: args.nodeId, ...node }, null, 2),
            },
          ],
        };
      }

      case "add_decision_node": {
        await jsonStore.mutate(
          FILES.decisionTree,
          validateDecisionTree,
          (tree) => {
            if (tree[args.nodeId]) {
              throw new Error(`Node already exists: ${args.nodeId}`);
            }
            tree[args.nodeId] = {
              question: args.question,
              options: args.options,
            };
            return tree;
          }
        );
        return {
          content: [
            {
              type: "text",
              text: `Successfully added node: ${args.nodeId}`,
            },
          ],
        };
      }

      case "add_case_study": {
        const newStudy = {
          title: args.title,
          tool: args.tool,
          journalist: args.journalist,
          challenge: args.challenge,
          solution: args.solution,
          quote: args.quote || "",
          outcome: args.outcome || "",
          tips: args.tips || "",
          sourceUrl: args.sourceUrl || "",
        };
        await jsonStore.mutate(
          FILES.caseStudies,
          validateCaseStudies,
          (studies) => {
            studies.push(newStudy);
            return studies;
          }
        );
        return {
          content: [
            {
              type: "text",
              text: `Added case study: "${args.title}"`,
            },
          ],
        };
      }

      case "update_model_info": {
        await validateModelName(args.modelName);
        await jsonStore.mutate(FILES.modelInfo, validateModelInfo, (models) => {
          if (!models[args.modelName]) {
            models[args.modelName] = {};
          }
          validateRecord(args.updates, "Model updates");
          Object.assign(models[args.modelName], args.updates);
          return models;
        });
        return {
          content: [
            {
              type: "text",
              text: `Updated model info for: ${args.modelName}`,
            },
          ],
        };
      }

      case "validate_all_json": {
        const results = [];
        for (const [name, filePath] of Object.entries(FILES)) {
          try {
            await readJsonFile(filePath);
            results.push(`✅ ${name}: valid`);
          } catch (e) {
            results.push(`❌ ${name}: ${e.message}`);
          }
        }
        return {
          content: [
            {
              type: "text",
              text: results.join("\n"),
            },
          ],
        };
      }

      case "check_model_names": {
        const outdatedPatterns = [
          /\bGPT[ -]?5\.5\b/g,
          /\b(?:Claude )?Sonnet 4\.6\b/g,
          /\bGLM-5\.1\b/g,
          /\bGrok 3\b/g,
          /\bDeepSeek R2\b/g,
        ];
        const issues = [];

        for (const [name, filePath] of Object.entries(FILES)) {
          if (name === "caseStudies" || name === "changelog") continue;
          try {
            const content = await fs.readFile(filePath, "utf8");
            for (const pattern of outdatedPatterns) {
              const matches = content.match(pattern);
              if (matches) {
                issues.push(`${name}: Found "${matches[0]}"`);
              }
            }
          } catch (e) {
            // Skip if file doesn't exist
          }
        }

        return {
          content: [
            {
              type: "text",
              text:
                issues.length > 0
                  ? `Found outdated model names:\n${issues.join("\n")}`
                  : "✅ All model names are current",
            },
          ],
        };
      }

      case "add_changelog_entry": {
        validatePlainText(args.notes, "Changelog notes");
        const entry = {
          version: args.version,
          notes: args.notes,
        };
        await jsonStore.mutate(FILES.changelog, validateChangelog, (changelog) => {
          changelog.unshift(entry);
          return changelog;
        });
        return {
          content: [
            {
              type: "text",
              text: `Added changelog entry for version ${args.version}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LLM Advisor Data MCP Server running");
}

main().catch(console.error);
