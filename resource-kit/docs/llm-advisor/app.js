// LLM Journalism Tool Advisor - Main Application Script
// Updated for Amditis Theme

// Global data variables (loaded from JSON files)
let decisionTree = null;
let toolComparisonData = null;
let caseStudiesData = null;
let bestPracticesData = null;
let modelInfoData = null;
let changelogData = null;

// Load all data from JSON files
async function loadAllData() {
    try {
        const responses = await Promise.all([
            fetch('data/decision-tree.json'),
            fetch('data/tool-comparison.json'),
            fetch('data/case-studies.json'),
            fetch('data/best-practices.json'),
            fetch('data/model-info.json'),
            fetch('data/changelog.json')
        ]);

        [
            decisionTree,
            toolComparisonData,
            caseStudiesData,
            bestPracticesData,
            modelInfoData,
            changelogData
        ] = await Promise.all(responses.map(r => r.json()));

        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        return false;
    }
}

// Main application code (wrapped to execute after data loads)
(function() {
        const container = document.getElementById('llm-tool-advisor-container');
        if (!container) {
            console.error('LLM Tool Advisor container not found.');
            return;
        }

        let currentStep = 'start', history = [], selectedTools = [], compareTools = [], showRecommendation = false, currentTrack = 'research';

        let mainContent, progressBar, breadcrumbContainer, themeToggleBtn, backBtn, restartBtn, toolSelector, universalModal, modalTitle, modalBody;

        function queryDOMElements() {
            // Elements inside the container
            mainContent = container.querySelector('#main-content');
            progressBar = container.querySelector('#progress-bar');
            breadcrumbContainer = container.querySelector('#breadcrumb');
            backBtn = container.querySelector('#back-btn');
            restartBtn = container.querySelector('#restart-btn');
            toolSelector = container.querySelector('#tool-selector');
            // Elements outside the container (modal and hidden controls)
            themeToggleBtn = document.querySelector('#theme-toggle-checkbox');
            universalModal = document.querySelector('#universal-modal');
            modalTitle = document.querySelector('#modal-title');
            modalBody = document.querySelector('#modal-body');
            return mainContent && progressBar && breadcrumbContainer && backBtn && restartBtn && toolSelector && universalModal;
        }

        const getPillClasses = (tool) => {
             const toolColorMap = {
                 'Claude': 'bg-[#d9843b] text-white',
                 'Gemini': 'bg-[#369a8b] text-white',
                 'Nano Banana': 'bg-[#369a8b] text-white',
                 'Codex': 'bg-slate-500 text-white',
                 'GPT 5.1': 'bg-slate-500 text-white',
                 'GPT': 'bg-slate-500 text-white',
                 'Grok': 'bg-blue-500 text-white',
                 'DeepSeek': 'bg-[#615EFC] text-white',
                 'Mistral': 'bg-pink-500 text-white',
                 'Perplexity': 'bg-violet-500 text-white',
                 'ElevenLabs': 'bg-emerald-500 text-white',
                 'Midjourney': 'bg-indigo-600 text-white',
                 'NotebookLM': 'bg-slate-600 text-white',
                 'Custom AI': 'bg-gray-500 text-gray-100',
                 'RAG-enabled': 'bg-gray-500 text-white',
                 'Open Source': 'bg-orange-500 text-white'
             };
             const key = Object.keys(toolColorMap).find(k => tool.includes(k));
             return key ? toolColorMap[key] : 'bg-slate-700 text-slate-300';
        };

        const getTrackColor = (track) => {
            const colors = {
                'research': 'text-ice border-ice',
                'content': 'text-acid border-acid',
                'multimedia': 'text-signal border-signal',
                'automation': 'text-white border-white'
            };
            return colors[track] || 'text-acid border-acid';
        };

        const sanitizeHTML = (str) => { const temp = document.createElement('div'); temp.textContent = str; return temp.innerHTML; };
        const escapeAttr = (str) => str.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

        function renderApp() {
            if (!mainContent) return;
            mainContent.style.opacity = '0';
            setTimeout(() => {
                if (showRecommendation) { renderRecommendationView(); }
                else { renderQuestionView(); }
                mainContent.style.opacity = '1';
                updateProgressBarAndBreadcrumbs();
            }, 150);
        }

        function renderQuestionView() {
            const node = decisionTree[currentStep];

            let optionsHTML = node.options.map((option, index) => {
                const toolsJSON = option.tools ? escapeAttr(JSON.stringify(option.tools)) : 'null';
                const trackColor = getTrackColor(option.track || currentTrack);
                return `
                <button class="option-button group w-full text-left p-5 transition-all duration-200 flex justify-between items-center bg-surface border border-white/10 hover:border-acid hover:bg-panel"
                        data-next="${option.next}"
                        data-text="${sanitizeHTML(option.text)}"
                        data-tools='${toolsJSON}'
                        data-track="${option.track || currentTrack}"
                        style="animation-delay: ${index * 50}ms">
                    <div class="flex items-center gap-4">
                        <span class="text-xs font-mono text-gray-600 group-hover:text-acid transition-colors">0${index + 1}</span>
                        <span class="font-display text-chrome group-hover:text-white transition-colors">${sanitizeHTML(option.text)}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 ml-2 text-gray-600 group-hover:text-acid group-hover:translate-x-1 transition-all"><path d="m9 18 6-6-6-6"/></svg>
                </button>`;
            }).join('');

            mainContent.innerHTML = `
                <div class="mb-8">
                    <div class="text-xs font-mono text-acid mb-2 tracking-widest">QUERY_${String(history.length + 1).padStart(2, '0')}</div>
                    <h2 class="font-display text-2xl sm:text-3xl text-white tracking-wide">${sanitizeHTML(node.question)}</h2>
                </div>
                <div class="space-y-3">${optionsHTML}</div>`;
        }

        function renderRecommendationView() {
            let toolsHTML = selectedTools.map((tool, index) => `
                <div class="recommendation-card border border-white/10 bg-panel p-6 transition-all duration-300 relative overflow-hidden" style="animation-delay: ${index * 100}ms">
                    <div class="absolute top-0 left-0 w-1 h-full bg-acid"></div>
                    <div class="pl-4">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-8 h-8 bg-acid/20 border border-acid flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-acid"><path d="M12 20s-8-4.5-8-12.5A8 8 0 0 1 12 4a8 8 0 0 1 8 8.5c0 8-8 12.5-8 12.5z"/><circle cx="12" cy="11" r="2"/></svg>
                            </div>
                            <h3 class="font-display text-xl text-white tracking-wide">${sanitizeHTML(tool.name)}</h3>
                        </div>
                        <p class="text-sm text-gray-400 mb-6 leading-relaxed">${sanitizeHTML(tool.description)}</p>

                        <div class="mb-6">
                            <h4 class="text-xs font-mono text-acid mb-3 tracking-widest">RECOMMENDED_MODELS</h4>
                            <div class="flex flex-wrap gap-2">
                                ${tool.tools.map(item => `<button class="model-pill-btn text-xs font-medium px-3 py-1.5 rounded-sm ${getPillClasses(item)} hover:opacity-80 transition-opacity" data-model-name="${item}">${sanitizeHTML(item)}</button>`).join('')}
                            </div>
                        </div>

                        <div class="mb-6">
                            <h4 class="text-xs font-mono text-ice mb-3 tracking-widest">SAMPLE_PROMPT</h4>
                            <code class="block text-sm text-gray-300 whitespace-pre-wrap font-mono bg-void border border-white/10 p-4 leading-relaxed">${sanitizeHTML(tool.prompt)}</code>
                        </div>

                        ${tool.tips ? `
                        <div>
                            <h4 class="text-xs font-mono text-signal mb-3 tracking-widest">PRO_TIPS</h4>
                            <p class="text-sm text-gray-400 leading-relaxed border-l-2 border-signal/30 pl-4">${sanitizeHTML(tool.tips)}</p>
                        </div>` : ''}
                    </div>
                </div>`).join('');

            mainContent.innerHTML = `
                <div class="mb-8">
                    <div class="text-xs font-mono text-acid mb-2 tracking-widest">ANALYSIS_COMPLETE</div>
                    <h2 class="font-display text-2xl sm:text-3xl text-white tracking-wide">Recommended tools and approaches</h2>
                </div>
                <div class="space-y-6">${toolsHTML}</div>
                <div class="mt-8 pt-6 border-t border-white/10">
                    <button id="restart-from-rec-btn" class="flex items-center gap-2 px-6 py-3 text-sm font-mono bg-surface border border-white/10 text-gray-400 hover:text-acid hover:border-acid transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        [ START_NEW_QUERY ]
                    </button>
                </div>`;
        }

        function findPathForWorkflow(workflowName) {
            let endNodeInfo = null;
            for (const stepKey in decisionTree) {
                const node = decisionTree[stepKey];
                if (node.options) {
                    for (const option of node.options) {
                        if (option.tools && option.tools[0].name === workflowName) {
                            endNodeInfo = { parentStep: stepKey, finalSelection: option.text, track: option.track || (decisionTree[stepKey] ? decisionTree[stepKey].track : 'research') };
                            break;
                        }
                    }
                }
                if (endNodeInfo) break;
            }
            if (!endNodeInfo) return [];
            function traceBack(targetStep) {
                if (targetStep === 'start') return [];
                for (const stepKey in decisionTree) {
                    const node = decisionTree[stepKey];
                    if (node.options) {
                        for (const option of node.options) {
                            if (option.next === targetStep) {
                                const path = traceBack(stepKey);
                                path.push({ step: stepKey, question: node.question, selection: option.text, track: option.track || (decisionTree[stepKey] ? decisionTree[stepKey].track : 'research'), });
                                return path;
                            }
                        }
                    }
                }
                return [];
            }
            const basePath = traceBack(endNodeInfo.parentStep);
            basePath.push({ step: endNodeInfo.parentStep, question: decisionTree[endNodeInfo.parentStep].question, selection: endNodeInfo.finalSelection, track: endNodeInfo.track });
            return basePath;
        }

        function populateToolSelector() {
            if (!toolSelector) return;
            const allOptions = Object.values(decisionTree).flatMap(node => node.options || []).filter(option => option.tools);
            let uniqueWorkflows = {};
            allOptions.forEach(option => {
                const toolName = option.tools[0].name;
                if (!uniqueWorkflows[toolName]) {
                    uniqueWorkflows[toolName] = { name: toolName, value: toolName };
                }
            });
            toolSelector.innerHTML = '<option value="">Jump to a workflow...</option>' + Object.values(uniqueWorkflows).sort((a,b) => a.name.localeCompare(b.name)).map(opt => `<option value="${escapeAttr(opt.value)}">${sanitizeHTML(opt.name)}</option>`).join('');
        }

        function renderComparisonModal() {
            const headerHTML = `
                <h3 class="text-sm font-mono text-acid mb-4 tracking-widest">SELECT_TOOLS (MAX 3)</h3>
                <div class="flex flex-wrap gap-2">
                    ${Object.keys(toolComparisonData).map(tool => `
                        <button class="px-3 py-1.5 text-sm font-medium transition-all compare-tool-btn ${compareTools.includes(tool) ? getPillClasses(tool) + ' ring-2 ring-offset-2 ring-offset-panel ring-current' : 'bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-white/30'}" data-tool="${tool}">${tool}</button>
                    `).join('')}
                </div>`;
            let tableHTML = '';
            if (compareTools.length > 0) {
                const features = ['strengths', 'weaknesses', 'bestFor', 'pricing'];
                const featureNames = { strengths: 'Key strengths', weaknesses: 'Limitations', bestFor: 'Best use cases', pricing: 'Pricing' };
                tableHTML = `
                    <div class="overflow-x-auto mt-6">
                        <table class="min-w-full w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-white/10">
                                    <th class="py-3 font-mono text-xs text-gray-500 tracking-wider">FEATURE</th>
                                    ${compareTools.map(tool => `<th class="py-3"><span class="text-xs font-medium px-3 py-1 rounded-sm inline-block ${getPillClasses(tool)}">${tool}</span></th>`).join('')}
                                </tr>
                            </thead>
                            <tbody class="text-gray-400">
                                ${features.map(feature => `
                                    <tr class="align-top border-b border-white/5">
                                        <td class="py-4 font-medium text-chrome">${featureNames[feature]}</td>
                                        ${compareTools.map(tool => `<td class="py-4 pr-4">${Array.isArray(toolComparisonData[tool][feature]) ? `<ul class="list-disc pl-5 space-y-1">${toolComparisonData[tool][feature].map(item => `<li>${sanitizeHTML(item)}</li>`).join('')}</ul>` : sanitizeHTML(toolComparisonData[tool][feature])}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>`;
            } else {
                tableHTML = `<div class="text-center p-8 bg-surface border border-white/10 mt-6"><p class="text-gray-500 font-mono text-sm">Select up to three tools to compare their features side-by-side.</p></div>`;
            }
            modalBody.innerHTML = headerHTML + tableHTML;
        }

        function renderCaseStudiesModal() {
            modalBody.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${caseStudiesData.map(study => `
                <div class="border border-white/10 overflow-hidden flex flex-col bg-panel">
                    <div class="px-5 py-4 ${getPillClasses(study.tool)}">
                        <div class="flex justify-between items-start gap-2">
                            <h3 class="font-display font-bold text-lg leading-tight">${sanitizeHTML(study.title)}</h3>
                            <span class="text-xs px-2 py-1 bg-white/20 rounded-sm font-mono flex-shrink-0">${sanitizeHTML(study.tool)}</span>
                        </div>
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <div class="flex-grow">
                            <p class="text-sm mb-3 font-medium text-gray-500">${sanitizeHTML(study.journalist)}</p>
                            <div class="text-sm space-y-4">
                                <div>
                                    <h4 class="font-mono text-xs text-signal tracking-wider mb-2">CHALLENGE</h4>
                                    <p class="text-gray-400">${sanitizeHTML(study.challenge)}</p>
                                </div>
                                <div>
                                    <h4 class="font-mono text-xs text-acid tracking-wider mb-2">KEY_TAKEAWAY</h4>
                                    <p class="text-gray-400">${sanitizeHTML(study.tips)}</p>
                                </div>
                                <div>
                                    <h4 class="font-mono text-xs text-ice tracking-wider mb-2">WORDS_OF_WISDOM</h4>
                                    <p class="border-l-2 pl-4 py-2 border-ice/30 bg-iceDim text-sm italic text-gray-300">"${sanitizeHTML(study.quote)}"</p>
                                </div>
                            </div>
                        </div>
                        ${study.sourceUrl ? `<div class="mt-4 flex justify-end"><a href="${study.sourceUrl}" target="_blank" rel="noopener noreferrer" class="text-sm font-mono text-acid hover:underline">Learn more →</a></div>` : ''}
                    </div>
                </div>`).join('')}</div>`;
        }

        function renderBestPracticesModal() {
            const data = bestPracticesData.general;
            if (!data) { modalBody.innerHTML = '<p class="text-gray-500">No best practices available.</p>'; return; }
            let contentHTML = '<div class="space-y-8">';
            const sections = {
                'Core principles': data.corePrinciples,
                'Effective prompting is a conversation': data.promptingTechniques,
                'Workflow integration': data.workflowIntegration,
                'Prompting for Images': data.imagePrompting,
                'Ethical guidelines & privacy': data.ethicalGuidelines
            };
            for (const [title, tips] of Object.entries(sections)) {
                if (tips) {
                    contentHTML += `
                        <div>
                            <h3 class="font-display text-lg font-bold mb-4 text-white">${title}</h3>
                            <ul class="space-y-3 text-sm">
                                ${tips.map((tip) => `
                                    <li class="flex items-start text-gray-400">
                                        <svg class="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-acid" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>${tip}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>`;
                }
            }
            contentHTML += '</div>';
            modalBody.innerHTML = contentHTML;
        }

        function renderModelInfoModal(highlightModel = null) {
            let contentHTML = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
            for (const [name, data] of Object.entries(modelInfoData)) {
                const isHighlighted = name === highlightModel;
                contentHTML += `
                <div id="model-card-${name.replace(/\s+/g, '-')}" class="border border-white/10 overflow-hidden flex flex-col bg-panel ${isHighlighted ? 'ring-2 ring-acid' : ''}">
                    <div class="px-5 py-4 ${getPillClasses(name)}"><h3 class="font-display font-bold text-lg">${sanitizeHTML(name)}</h3></div>
                    <div class="p-5 flex flex-col flex-grow">
                        <div class="flex-grow">
                            <p class="text-sm mb-4 text-gray-400">${sanitizeHTML(data.description)}</p>
                            <h4 class="text-xs font-mono text-acid mb-3 tracking-wider">KEY_FEATURES</h4>
                            <ul class="space-y-2 text-sm list-disc pl-5 text-gray-400">${data.features.map(feature => `<li>${sanitizeHTML(feature)}</li>`).join('')}</ul>
                        </div>
                        <div class="mt-4 flex justify-end">
                            <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="text-sm font-mono text-acid hover:underline">Visit website →</a>
                        </div>
                    </div>
                </div>`;
            }
            contentHTML += '</div>';
            modalBody.innerHTML = contentHTML;
            if (highlightModel) {
                const cardElement = document.querySelector(`#model-card-${highlightModel.replace(/\s+/g, '-')}`);
                if (cardElement) { setTimeout(() => cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); }
            }
        }

        function renderChangelogModal() {
            modalBody.innerHTML = changelogData.map(log => `
                <div class="pb-6 mb-6 border-b border-white/10 last:border-b-0 last:mb-0 last:pb-0">
                    <p class="text-sm font-mono text-acid mb-2">v${log.version}</p>
                    <div class="text-sm text-gray-400">${log.notes}</div>
                </div>
            `).join('');
        }

        function updateProgressBarAndBreadcrumbs() {
            const estimatedTotalSteps = 4;
            const progress = showRecommendation ? 100 : Math.min(100, (history.length / estimatedTotalSteps) * 100);
            progressBar.style.width = `${progress}%`;
            progressBar.className = 'absolute top-0 left-0 h-full bg-acid transition-all duration-500';

            backBtn.disabled = history.length === 0;
            backBtn.classList.toggle('opacity-30', backBtn.disabled);
            backBtn.classList.toggle('cursor-not-allowed', backBtn.disabled);

            if (history.length > 0) {
                breadcrumbContainer.classList.remove('hidden');
                breadcrumbContainer.innerHTML = history.map(item => `<span class="text-gray-500 hover:text-acid transition-colors">${sanitizeHTML(item.selection)}</span>`).join('<span class="text-gray-700 mx-2">/</span>');
            } else {
                breadcrumbContainer.classList.add('hidden');
            }
        }

        function updateTrackColor(track) {
            if (!track) return;
            currentTrack = track;
        }

        function showModal(title, renderFunction, ...args) {
            modalTitle.textContent = title;
            renderFunction(...args);
            universalModal.classList.remove('hidden');
            universalModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }

        function hideModal() {
            universalModal.classList.add('hidden');
            universalModal.classList.remove('flex');
            document.body.style.overflow = '';
        }

        function handleOptionSelect(e) {
            const button = e.target.closest('.option-button');
            if (!button) return;
            const { next, text, track } = button.dataset;
            let tools = button.dataset.tools;

            if (track) updateTrackColor(track);

            if (tools && tools !== 'null') {
                tools = tools.replace(/&quot;/g, '"');
                selectedTools = JSON.parse(tools);
            }
            history.push({ step: currentStep, question: decisionTree[currentStep].question, selection: text, track: currentTrack });
            if (next === "recommendation") {
                showRecommendation = true;
            } else {
                currentStep = next;
            }
            renderApp();
        }

        function handleRestart() { currentStep = 'start'; history = []; selectedTools = []; showRecommendation = false; currentTrack = 'research'; renderApp(); }
        function handleBack() { if (history.length > 0) { const previous = history.pop(); currentStep = previous.step; updateTrackColor(previous.track); showRecommendation = false; selectedTools = []; renderApp(); } }

        function handleToolSelect(e) {
            if (!e.target.value) return;
            const workflowName = e.target.value;

            const path = findPathForWorkflow(workflowName);
            if (path.length > 0) {
                history = path;
                const allOptions = Object.values(decisionTree).flatMap(node => node.options || []).filter(option => option.tools);
                const targetOption = allOptions.find(opt => opt.tools && opt.tools[0].name === workflowName);
                if (targetOption) {
                    selectedTools = targetOption.tools;
                    currentTrack = path[path.length - 1].track;
                    showRecommendation = true;
                    renderApp();
                }
            }
        }

        function handleEscKey(e) {
            if (e.key === 'Escape') hideModal();
        }

        function init() {
            if (!queryDOMElements()) {
                console.error('Failed to query DOM elements.');
                return;
            }

            renderApp();
            populateToolSelector();

            container.addEventListener('click', e => {
                const button = e.target.closest('button');
                if (!button) return;
                const id = button.id;
                const classList = button.classList;
                if (classList.contains('option-button')) { handleOptionSelect(e); return; }
                if (id === 'restart-from-rec-btn' || id === 'restart-btn') { handleRestart(); return; }
                if (id === 'footer-best-practices-btn') { showModal('Best practices guide', renderBestPracticesModal); return; }
                if (id === 'show-changelog-btn') { showModal('Release notes', renderChangelogModal); return; }
                if (classList.contains('model-pill-btn')) { const modelName = button.dataset.modelName; showModal('Model information', renderModelInfoModal, modelName); return; }
                if (id === 'back-btn') { handleBack(); return; }
                if (id === 'show-comparison-btn') { compareTools = []; showModal('Tool comparison', renderComparisonModal); return; }
                if (id === 'show-case-studies-btn') { showModal('Journalistic case studies', renderCaseStudiesModal); return; }
                if (id === 'footer-model-info-btn') { showModal('Model information', renderModelInfoModal); return; }
                if (classList.contains('modal-close-btn')) { hideModal(); return; }
                if(classList.contains('compare-tool-btn')) {
                    const tool = button.dataset.tool;
                    if (compareTools.includes(tool)) {
                        compareTools = compareTools.filter(t => t !== tool);
                    } else if (compareTools.length < 3) {
                        compareTools.push(tool);
                    }
                    renderComparisonModal();
                }
            });

            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('change', () => {});
            }
            toolSelector.addEventListener('change', handleToolSelect);

            document.addEventListener('keydown', handleEscKey);
            universalModal.addEventListener('click', e => {
                if (e.target === universalModal) hideModal();
            });
        }

    // Expose init function for external calling after data loads
    window.initLLMAdvisor = init;

})();

// Start the application by loading data first
loadAllData().then(success => {
    if (success) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', window.initLLMAdvisor);
        } else {
            window.initLLMAdvisor();
        }
    } else {
        console.error('Failed to load application data');
        document.addEventListener('DOMContentLoaded', () => {
            const mainContent = document.querySelector('#main-content');
            if (mainContent) {
                mainContent.innerHTML = '<div class="text-center p-8 border border-signal/30 bg-signalDim"><p class="text-signal font-mono">ERROR: Failed to load application data. Please refresh the page.</p></div>';
            }
        });
    }
});
