import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../resource-kit/docs/llm-advisor/app.js', import.meta.url), 'utf8');
const escapeSource = source.match(/const escapeAttr = [\s\S]*?;\n/)[0];
const render = (name, context) => {
  const fn = source.match(new RegExp(`        function ${name}\\([\\s\\S]*?\\n        }`))[0];
  vm.runInNewContext(`${escapeSource}\n${fn}\n${name}(highlightModel);`, context);
};
const value = `A "quoted" & 'named' model`;
const escaped = `A &quot;quoted&quot; &amp; &apos;named&apos; model`;
const context = () => ({
  mainContent: {}, modalBody: {}, highlightModel: value,
  sanitizeHTML: (text) => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
  getTrackColor: () => '', getPillClasses: () => '', safeHttpUrl: () => '',
  setTimeout: (callback) => callback(),
});

test('decision option identifiers cannot break out of their attributes', () => {
  const ctx = { ...context(), currentStep: 'start', currentTrack: value, history: [],
    decisionTree: { start: { question: 'Question', options: [{ text: value, next: value }] } } };
  render('renderQuestionView', ctx);
  assert.ok(ctx.mainContent.innerHTML.includes(`data-next="${escaped}"`));
  assert.ok(ctx.mainContent.innerHTML.includes(`data-track="${escaped}"`));
  assert.ok(ctx.mainContent.innerHTML.includes(`data-text="${escaped}"`));
});

test('recommendation model names are escaped in attributes', () => {
  const ctx = { ...context(), selectedTools: [{ name: 'Tool', description: '', prompt: '', tools: [value] }] };
  render('renderRecommendationView', ctx);
  assert.ok(ctx.mainContent.innerHTML.includes(`data-model-name="${escaped}"`));
});

test('model card markup escapes quotes while lookup uses the decoded DOM id', () => {
  let lookup; let scrolled = false;
  const ctx = { ...context(), modelInfoData: { [value]: { description: '', features: [] } },
    document: { getElementById: (id) => { lookup = id; return { scrollIntoView: () => { scrolled = true; } }; } } };
  render('renderModelInfoModal', ctx);
  assert.ok(ctx.modalBody.innerHTML.includes(`id="model-card-${escaped.replaceAll(' ', '-')}"`));
  assert.equal(lookup, `model-card-${value.replaceAll(' ', '-')}`);
  assert.equal(scrolled, true);
});
