// Script to extract data structures from llm-advisor.html
const fs = require('fs');

// Read the HTML file
const html = fs.readFileSync('llm-advisor.html', 'utf-8');

// Extract the script content
const scriptMatch = html.match(/<script>\s*\(function\(\)\s*{([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.error('Could not find script section');
    process.exit(1);
}

const scriptContent = scriptMatch[1];

// Extract each data structure using regex
const dataStructures = {
    'decisionTree': /const decisionTree\s*=\s*({[\s\S]*?});[\s\n]*const toolComparisonData/,
    'toolComparisonData': /const toolComparisonData\s*=\s*({[\s\S]*?});[\s\n]*const caseStudiesData/,
    'caseStudiesData': /const caseStudiesData\s*=\s*(\[[\s\S]*?\]);[\s\n]*const bestPracticesData/,
    'bestPracticesData': /const bestPracticesData\s*=\s*({[\s\S]*?});[\s\n]*const modelInfoData/,
    'modelInfoData': /const modelInfoData\s*=\s*({[\s\S]*?});[\s\n]*const changelogData/,
    'changelogData': /const changelogData\s*=\s*(\[[\s\S]*?\]);[\s\n]*let currentStep/
};

// Create data directory if it doesn't exist
if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

// Extract and save each data structure
for (const [name, regex] of Object.entries(dataStructures)) {
    const match = scriptContent.match(regex);
    if (match && match[1]) {
        try {
            // Evaluate the JavaScript object/array
            const data = eval(`(${match[1]})`);

            // Convert to JSON and save
            const jsonFilename = `data/${name.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1)}.json`;
            fs.writeFileSync(jsonFilename, JSON.stringify(data, null, 2));
            console.log(`✓ Created ${jsonFilename}`);
        } catch (error) {
            console.error(`✗ Error extracting ${name}:`, error.message);
        }
    } else {
        console.error(`✗ Could not find ${name}`);
    }
}

console.log('\nData extraction complete!');
