#!/usr/bin/env node
/**
 * Validate All JSON - Background Task Script
 *
 * Validates all LLM Advisor JSON data files for:
 * - Syntax correctness
 * - Schema compliance
 * - Cross-reference integrity
 * - Model name currency
 *
 * Claude Code v2.1 Feature: Run as background task
 * Usage: node scripts/validate-all-json.js &
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_DIR = path.join(
  __dirname,
  "../resource-kit/docs/llm-advisor/data"
);

// Known stale claims in active guidance. Historical case studies and changelog
// entries are intentionally excluded from this check.
const OUTDATED_PATTERNS = [
  { pattern: /\bGPT[ -]?5\.5\b/gi, replacement: "GPT-5.6 Sol" },
  { pattern: /\b(?:Claude )?Sonnet 4\.6\b/gi, replacement: "Claude Sonnet 5" },
  { pattern: /\bGLM-5\.1\b/gi, replacement: "GLM-5.2" },
  { pattern: /\bGrok 3\b/gi, replacement: "Grok 4.5" },
  { pattern: /\bDeepSeek R2\b/gi, replacement: "DeepSeek V4 Pro or Flash" },
];

// File schemas
const SCHEMAS = {
  "decision-tree.json": {
    required: ["start"],
    nodeRequired: ["question", "options"],
  },
  "case-studies.json": {
    isArray: true,
    itemRequired: ["title", "tool", "journalist", "challenge", "solution"],
  },
  "model-info.json": {
    isObject: true,
  },
  "tool-comparison.json": {
    isObject: true,
  },
  "best-practices.json": {
    isObject: true,
  },
  "changelog.json": {
    isArray: true,
    itemRequired: ["version", "notes"],
  },
};

async function validateFile(filename, schema) {
  const filePath = path.join(DATA_DIR, filename);
  const results = {
    file: filename,
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Check file exists
    const content = await fs.readFile(filePath, "utf8");

    // Parse JSON
    let data;
    try {
      data = JSON.parse(content);
    } catch (e) {
      results.valid = false;
      results.errors.push(`JSON syntax error: ${e.message}`);
      return results;
    }

    // Check schema requirements
    if (schema.required) {
      for (const key of schema.required) {
        if (!data[key]) {
          results.valid = false;
          results.errors.push(`Missing required key: ${key}`);
        }
      }
    }

    if (schema.isArray && !Array.isArray(data)) {
      results.valid = false;
      results.errors.push(`Expected array, got ${typeof data}`);
    }

    if (
      schema.isObject &&
      (typeof data !== "object" || data === null || Array.isArray(data))
    ) {
      results.valid = false;
      results.errors.push(`Expected object, got ${typeof data}`);
    }

    if (schema.itemRequired && Array.isArray(data)) {
      data.forEach((item, index) => {
        for (const key of schema.itemRequired) {
          if (!item[key]) {
            results.warnings.push(`Item ${index}: missing ${key}`);
          }
        }
      });
    }

    // Check for outdated model names
    if (!["case-studies.json", "changelog.json"].includes(filename)) {
      for (const { pattern, replacement } of OUTDATED_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          results.valid = false;
          results.errors.push(
            `Outdated model name: "${matches[0]}" → "${replacement}"`
          );
        }
      }
    }

    // Decision tree specific validation
    if (filename === "decision-tree.json" && schema.nodeRequired) {
      for (const [nodeId, node] of Object.entries(data)) {
        for (const key of schema.nodeRequired) {
          if (!node[key]) {
            results.warnings.push(`Node ${nodeId}: missing ${key}`);
          }
        }
        // Check option references
        if (node.options) {
          for (const option of node.options) {
            if (option.next && !data[option.next] && !option.recommendation) {
              results.warnings.push(
                `Node ${nodeId}: option "${option.text}" references non-existent node "${option.next}"`
              );
            }
          }
        }
      }
    }
  } catch (e) {
    if (e.code === "ENOENT") {
      results.valid = false;
      results.errors.push("File not found");
    } else {
      results.valid = false;
      results.errors.push(`Read error: ${e.message}`);
    }
  }

  return results;
}

async function main() {
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  JSON VALIDATION REPORT");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");

  let allValid = true;
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const [filename, schema] of Object.entries(SCHEMAS)) {
    const results = await validateFile(filename, schema);

    const icon = results.valid
      ? results.warnings.length > 0
        ? "⚠️"
        : "✅"
      : "❌";
    console.log(`${icon} ${filename}`);

    if (results.errors.length > 0) {
      allValid = false;
      totalErrors += results.errors.length;
      results.errors.forEach((e) => console.log(`   ❌ ${e}`));
    }

    if (results.warnings.length > 0) {
      totalWarnings += results.warnings.length;
      results.warnings.forEach((w) => console.log(`   ⚠️  ${w}`));
    }
  }

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `Summary: ${totalErrors} errors, ${totalWarnings} warnings`
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  process.exit(allValid ? 0 : 1);
}

main().catch(console.error);
