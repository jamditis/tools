/**
 * @fileoverview Data Extraction Utility for LLM Advisor
 *
 * A Node.js build tool that extracts embedded JavaScript data structures from
 * the monolithic llm-advisor.html file and saves them as separate JSON files.
 * This enables modular data management while maintaining backwards compatibility.
 *
 * ## Purpose
 *
 * The original LLM Advisor had all data (decision tree, comparisons, case studies,
 * etc.) embedded directly in the HTML file. This script was created to:
 * 1. Extract data into maintainable JSON files
 * 2. Enable easier updates without touching the main application
 * 3. Support future API-driven data loading
 *
 * ## Usage
 *
 * ```bash
 * cd resource-kit/docs/llm-advisor
 * node extract-data.js
 * ```
 *
 * ## Output Files
 *
 * Creates the following files in the `data/` directory:
 * - `decision-tree.json` - Navigation flow and tool recommendations
 * - `tool-comparison-data.json` - Side-by-side tool comparisons
 * - `case-studies-data.json` - Real-world usage examples
 * - `best-practices-data.json` - Guidelines for each tool
 * - `model-info-data.json` - AI model specifications
 * - `changelog-data.json` - Version history
 *
 * ## Security Note
 *
 * This script uses `eval()` to parse JavaScript object literals from the source.
 * This is acceptable here because:
 * - Only runs during development/build, never in production
 * - Only processes local project files, not user input
 * - Developer must explicitly run the script
 *
 * Do NOT use this pattern for user-supplied or untrusted data.
 *
 * @module ExtractData
 * @requires fs
 * @see {@link app.js} Main application that consumes the extracted data
 */

const fs = require('fs');

/* ==========================================================================
   1. READ SOURCE FILE
   ========================================================================== */

/**
 * Source HTML file path.
 * Assumes script is run from the llm-advisor directory.
 */
const SOURCE_FILE = 'llm-advisor.html';

/**
 * Read the HTML file containing embedded data structures.
 * @type {string}
 */
const html = fs.readFileSync(SOURCE_FILE, 'utf-8');

/* ==========================================================================
   2. EXTRACT SCRIPT CONTENT
   ========================================================================== */

/**
 * Regex to extract the main IIFE script block from HTML.
 * Matches: <script> (function() { ... </script>
 *
 * The captured group contains the script body without the IIFE wrapper.
 */
const SCRIPT_PATTERN = /<script>\s*\(function\(\)\s*{([\s\S]*?)<\/script>/;

const scriptMatch = html.match(SCRIPT_PATTERN);
if (!scriptMatch) {
    console.error('Could not find script section');
    process.exit(1);
}

const scriptContent = scriptMatch[1];

/* ==========================================================================
   3. DATA STRUCTURE DEFINITIONS
   ========================================================================== */

/**
 * Mapping of data structure names to their extraction regex patterns.
 *
 * Each regex:
 * - Matches a `const name = {...}` or `const name = [...]` declaration
 * - Captures the value (object or array literal)
 * - Uses lookahead to stop at the next const declaration
 *
 * @type {Object.<string, RegExp>}
 *
 * @property {RegExp} decisionTree - Navigation nodes and tool recommendations
 * @property {RegExp} toolComparisonData - Feature comparison matrices
 * @property {RegExp} caseStudiesData - Journalism use case examples
 * @property {RegExp} bestPracticesData - Tool-specific guidelines
 * @property {RegExp} modelInfoData - AI model specifications and capabilities
 * @property {RegExp} changelogData - Application version history
 */
const dataStructures = {
    'decisionTree': /const decisionTree\s*=\s*({[\s\S]*?});[\s\n]*const toolComparisonData/,
    'toolComparisonData': /const toolComparisonData\s*=\s*({[\s\S]*?});[\s\n]*const caseStudiesData/,
    'caseStudiesData': /const caseStudiesData\s*=\s*(\[[\s\S]*?\]);[\s\n]*const bestPracticesData/,
    'bestPracticesData': /const bestPracticesData\s*=\s*({[\s\S]*?});[\s\n]*const modelInfoData/,
    'modelInfoData': /const modelInfoData\s*=\s*({[\s\S]*?});[\s\n]*const changelogData/,
    'changelogData': /const changelogData\s*=\s*(\[[\s\S]*?\]);[\s\n]*let currentStep/
};

/* ==========================================================================
   4. OUTPUT DIRECTORY SETUP
   ========================================================================== */

/**
 * Output directory for extracted JSON files.
 * @type {string}
 */
const OUTPUT_DIR = 'data';

// Create data directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

/* ==========================================================================
   5. EXTRACTION AND SERIALIZATION
   ========================================================================== */

/**
 * Converts camelCase to kebab-case.
 * Used for generating JSON filenames from JavaScript variable names.
 *
 * @example
 * 'decisionTree' -> 'decision-tree'
 * 'toolComparisonData' -> 'tool-comparison-data'
 *
 * @param {string} name - camelCase variable name
 * @returns {string} kebab-case filename (without extension)
 */
const toKebabCase = (name) => name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);

/**
 * Extract each data structure, parse it, and save as JSON.
 *
 * Process:
 * 1. Match the regex against script content
 * 2. Use eval() to parse the JavaScript literal into a JS object
 * 3. Serialize to JSON with pretty-printing
 * 4. Write to data/{kebab-case-name}.json
 */
for (const [name, regex] of Object.entries(dataStructures)) {
    const match = scriptContent.match(regex);
    if (match && match[1]) {
        try {
            // Evaluate the JavaScript object/array literal
            // Note: eval() is safe here as we're only processing our own source files
            const data = eval(`(${match[1]})`);

            // Convert variable name to kebab-case filename
            const jsonFilename = `${OUTPUT_DIR}/${toKebabCase(name)}.json`;

            // Write formatted JSON
            fs.writeFileSync(jsonFilename, JSON.stringify(data, null, 2));
            console.log(`✓ Created ${jsonFilename}`);
        } catch (error) {
            console.error(`✗ Error extracting ${name}:`, error.message);
        }
    } else {
        console.error(`✗ Could not find ${name}`);
    }
}

/* ==========================================================================
   6. COMPLETION
   ========================================================================== */

console.log('\nData extraction complete!');
