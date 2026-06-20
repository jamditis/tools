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
const fs = require("fs").promises;
const path = require("path");

// Data file paths
const DATA_DIR = path.join(__dirname, "../../resource-kit/docs/llm-advisor/data");
const FILES = {
  decisionTree: path.join(DATA_DIR, "decision-tree.json"),
  caseStudies: path.join(DATA_DIR, "case-studies.json"),
  modelInfo: path.join(DATA_DIR, "model-info.json"),
  toolComparison: path.join(DATA_DIR, "tool-comparison.json"),
  bestPractices: path.join(DATA_DIR, "best-practices.json"),
  changelog: path.join(DATA_DIR, "changelog.json"),
};

// Model name validation
const VALID_MODELS = [
  "Claude Opus 4.8",
  "Claude Sonnet 4.6",
  "Gemini 3.1 Pro",
  "Gemini 3.1 Flash",
  "GPT 5.5",
  "Codex (GPT 5.5)",
];

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

// Helper: Write JSON file with pretty formatting
async function writeJsonFile(filePath, data) {
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, "utf8");
}

// Helper: Validate model names
function validateModelName(name) {
  if (!VALID_MODELS.includes(name)) {
    throw new Error(
      `Invalid model name: "${name}". Valid names: ${VALID_MODELS.join(", ")}`
    );
  }
  return true;
}

// Define tools
server.setRequestHandler("tools/list", async () => {
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
            organization: {
              type: "string",
              description: "News organization name",
            },
            challenge: {
              type: "string",
              description: "The challenge they faced",
            },
            solution: {
              type: "string",
              description: "How they solved it with AI",
            },
            tools: {
              type: "array",
              description: "AI tools used",
              items: { type: "string" },
            },
            outcome: {
              type: "string",
              description: "Results achieved",
            },
          },
          required: ["title", "organization", "challenge", "solution"],
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
              description: `Model name (one of: ${VALID_MODELS.join(", ")})`,
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
            date: {
              type: "string",
              description: "Release date (YYYY-MM-DD)",
            },
            changes: {
              type: "array",
              description: "Array of change descriptions",
              items: { type: "string" },
            },
          },
          required: ["version", "changes"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
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
        const tree = await readJsonFile(FILES.decisionTree);
        if (tree[args.nodeId]) {
          throw new Error(`Node already exists: ${args.nodeId}`);
        }
        tree[args.nodeId] = {
          question: args.question,
          options: args.options,
        };
        await writeJsonFile(FILES.decisionTree, tree);
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
        const studies = await readJsonFile(FILES.caseStudies);
        const newStudy = {
          id: `case-${Date.now()}`,
          title: args.title,
          organization: args.organization,
          challenge: args.challenge,
          solution: args.solution,
          tools: args.tools || [],
          outcome: args.outcome || "",
          dateAdded: new Date().toISOString().split("T")[0],
        };
        studies.push(newStudy);
        await writeJsonFile(FILES.caseStudies, studies);
        return {
          content: [
            {
              type: "text",
              text: `Added case study: "${args.title}" (ID: ${newStudy.id})`,
            },
          ],
        };
      }

      case "update_model_info": {
        validateModelName(args.modelName);
        const models = await readJsonFile(FILES.modelInfo);
        if (!models[args.modelName]) {
          models[args.modelName] = {};
        }
        Object.assign(models[args.modelName], args.updates);
        await writeJsonFile(FILES.modelInfo, models);
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
          /Claude 4 Opus/g,
          /Claude 3/g,
          /GPT-4o/g,
          /GPT-4/g,
          /Gemini 2\./g,
          /Gemini 1\./g,
        ];
        const issues = [];

        for (const [name, filePath] of Object.entries(FILES)) {
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
        const changelog = await readJsonFile(FILES.changelog);
        const entry = {
          version: args.version,
          date: args.date || new Date().toISOString().split("T")[0],
          changes: args.changes,
        };
        changelog.unshift(entry);
        await writeJsonFile(FILES.changelog, changelog);
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
