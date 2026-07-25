/**
 * @fileoverview LLM Journalism Tool Advisor - Main Application Script
 *
 * This is the core application module for the LLM Tool Advisor, an interactive
 * decision tree that helps journalists select appropriate AI tools for their
 * workflows. The application guides users through a series of questions and
 * provides personalized tool recommendations.
 *
 * ## Architecture Overview
 *
 * The application uses an IIFE (Immediately Invoked Function Expression) pattern
 * to encapsulate state and avoid polluting the global namespace. Only the `init`
 * function is exposed globally via `window.initLLMAdvisor`.
 *
 * ## Data Flow
 *
 * 1. `loadAllData()` fetches JSON files and populates global data variables
 * 2. `init()` is called after data loads, querying DOM elements and setting up events
 * 3. `renderApp()` orchestrates view rendering based on current state
 * 4. User interactions trigger state changes and re-renders
 *
 * ## State Management
 *
 * Application state is managed through module-scoped variables:
 * - `currentStep`: Current position in the decision tree
 * - `history`: Array of previous selections for back navigation
 * - `selectedTools`: Tools selected for the current recommendation
 * - `showRecommendation`: Boolean flag for recommendation view
 * - `currentTrack`: Current workflow track (research/content/multimedia/automation)
 *
 * ## Event Handling
 *
 * Uses event delegation on the main container for most interactions. Elements
 * outside the container (modal, sidebar) have their own event listeners attached
 * in `init()`.
 *
 * @module LLMToolAdvisor
 * @author Amditis Resource Kit
 * @version 2.0
 * @requires Tailwind CSS
 * @requires Lucide Icons
 * @see {@link https://jamditis.github.io/tools/llm-advisor/} Live Demo
 */

/* ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================ */

/**
 * Represents a single tool recommendation with details and sample prompts.
 * @typedef {Object} ToolRecommendation
 * @property {string} name - Display name of the tool/workflow (e.g., "Research Assistant")
 * @property {string} description - Detailed description of the tool's purpose
 * @property {string[]} tools - Array of AI model names recommended for this task
 * @property {string} prompt - Sample prompt to get started with this workflow
 * @property {string} [tips] - Optional pro tips for effective usage
 */

/**
 * Represents a decision tree option that users can select.
 * @typedef {Object} DecisionOption
 * @property {string} text - Display text for the option button
 * @property {string} [next] - Key of the next decision tree node, or "recommendation"
 * @property {ToolRecommendation[]} [tools] - Tool recommendations (only for terminal nodes)
 * @property {string} [track] - Workflow track: "research" | "content" | "multimedia" | "automation"
 */

/**
 * Represents a node in the decision tree.
 * @typedef {Object} DecisionNode
 * @property {string} question - The question to display to the user
 * @property {DecisionOption[]} options - Available options for this question
 */

/**
 * The complete decision tree structure loaded from JSON.
 * @typedef {Object<string, DecisionNode>} DecisionTree
 */

/**
 * Comparison data for an AI tool.
 * @typedef {Object} ToolComparisonEntry
 * @property {string|string[]} strengths - Key strengths of the tool
 * @property {string|string[]} weaknesses - Known limitations
 * @property {string|string[]} bestFor - Ideal use cases
 * @property {string} pricing - Pricing information
 */

/**
 * Case study demonstrating AI tool usage in journalism.
 * @typedef {Object} CaseStudy
 * @property {string} title - Title of the case study
 * @property {string} tool - Primary AI tool featured
 * @property {string} journalist - Author or organization
 * @property {string} challenge - Problem being addressed
 * @property {string} tips - Key takeaways
 * @property {string} quote - Notable quote from the case study
 * @property {string} [sourceUrl] - Link to the original source
 */

/**
 * Information about an AI model.
 * @typedef {Object} ModelInfo
 * @property {string} description - Brief description of the model
 * @property {string[]} features - Key features of the model
 * @property {string} link - URL to the model's website
 */

/**
 * A history entry recording a user's navigation through the decision tree.
 * @typedef {Object} HistoryEntry
 * @property {string} step - The decision tree node key
 * @property {string} question - The question that was displayed
 * @property {string} selection - The option text the user selected
 * @property {string} track - The workflow track at this step
 */

/**
 * Changelog entry for version history.
 * @typedef {Object} ChangelogEntry
 * @property {string} version - Version number
 * @property {string} notes - HTML-formatted release notes
 */

/* ============================================================================
 * GLOBAL DATA VARIABLES
 * ============================================================================ */

/**
 * The complete decision tree data structure.
 * Loaded from `data/decision-tree.json`.
 * Keys are node identifiers (e.g., "start", "research_1"), values are DecisionNode objects.
 * @type {DecisionTree|null}
 */
let decisionTree = null;

/**
 * Tool comparison data for the comparison modal.
 * Loaded from `data/tool-comparison.json`.
 * Keys are tool names (e.g., "Claude", "Gemini"), values are ToolComparisonEntry objects.
 * @type {Object<string, ToolComparisonEntry>|null}
 */
let toolComparisonData = null;

/**
 * Array of journalism case studies demonstrating AI tool usage.
 * Loaded from `data/case-studies.json`.
 * @type {CaseStudy[]|null}
 */
let caseStudiesData = null;

/**
 * Best practices guide organized by category.
 * Loaded from `data/best-practices.json`.
 * Currently uses a "general" key containing various tip categories.
 * @type {{ general: Object }|null}
 */
let bestPracticesData = null;

/**
 * Information about available AI models.
 * Loaded from `data/model-info.json`.
 * Keys are model names, values are ModelInfo objects.
 * @type {Object<string, ModelInfo>|null}
 */
let modelInfoData = null;

/**
 * Version history and changelog entries.
 * Loaded from `data/changelog.json`.
 * @type {ChangelogEntry[]|null}
 */
let changelogData = null;

/* ============================================================================
 * DATA LOADING
 * ============================================================================ */

/**
 * Loads all required JSON data files in parallel.
 *
 * This function must be called before initializing the application. It fetches
 * all six JSON data files concurrently and populates the global data variables.
 *
 * @async
 * @function loadAllData
 * @returns {Promise<boolean>} True if all data loaded successfully, false on error
 *
 * @example
 * // Typical usage at application startup
 * loadAllData().then(success => {
 *   if (success) {
 *     window.initLLMAdvisor();
 *   }
 * });
 *
 * @throws {Error} Logs error to console but does not throw; returns false instead
 */
async function loadAllData() {
    try {
        // Fetch all JSON files concurrently for better performance
        const responses = await Promise.all([
            fetch('data/decision-tree.json'),
            fetch('data/tool-comparison.json'),
            fetch('data/case-studies.json'),
            fetch('data/best-practices.json'),
            fetch('data/model-info.json'),
            fetch('data/changelog.json')
        ]);

        // Parse all JSON responses and assign to global variables via destructuring
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

/* ============================================================================
 * MAIN APPLICATION MODULE (IIFE)
 * ============================================================================ */

/**
 * Main application module using the Immediately Invoked Function Expression (IIFE) pattern.
 *
 * This encapsulates all application state and logic, preventing global namespace pollution.
 * Only `window.initLLMAdvisor` is exposed for external initialization.
 *
 * @namespace LLMAdvisorApp
 */
(function() {
        // -------------------------------------------------------------------------
        // DOM CONTAINER REFERENCE
        // -------------------------------------------------------------------------

        /** @type {HTMLElement|null} The main container element for the advisor */
        const container = document.getElementById('llm-tool-advisor-container');
        if (!container) {
            console.error('LLM Tool Advisor container not found.');
            return;
        }

        // -------------------------------------------------------------------------
        // APPLICATION STATE
        // -------------------------------------------------------------------------

        /**
         * Current position in the decision tree.
         * @type {string}
         */
        let currentStep = 'start';

        /**
         * Navigation history for back button functionality.
         * @type {HistoryEntry[]}
         */
        let history = [];

        /**
         * Currently selected tool recommendations.
         * @type {ToolRecommendation[]}
         */
        let selectedTools = [];

        /**
         * Tools selected for comparison in the comparison modal (max 3).
         * @type {string[]}
         */
        let compareTools = [];

        /**
         * Whether to display the recommendation view vs. question view.
         * @type {boolean}
         */
        let showRecommendation = false;

        /**
         * Current workflow track for theming.
         * @type {'research'|'content'|'multimedia'|'automation'}
         */
        let currentTrack = 'research';

        // -------------------------------------------------------------------------
        // DOM ELEMENT REFERENCES
        // -------------------------------------------------------------------------

        /** @type {HTMLElement} Main content area for questions and recommendations */
        let mainContent;
        /** @type {HTMLElement} Progress bar element */
        let progressBar;
        /** @type {HTMLElement} Breadcrumb navigation container */
        let breadcrumbContainer;
        /** @type {HTMLInputElement} Theme toggle checkbox (currently unused) */
        let themeToggleBtn;
        /** @type {HTMLButtonElement} Back navigation button */
        let backBtn;
        /** @type {HTMLButtonElement} Restart button */
        let restartBtn;
        /** @type {HTMLSelectElement} Workflow jump dropdown selector */
        let toolSelector;
        /** @type {HTMLElement} Universal modal overlay */
        let universalModal;
        /** @type {HTMLElement} Modal title element */
        let modalTitle;
        /** @type {HTMLElement} Modal body content area */
        let modalBody;

        // -------------------------------------------------------------------------
        // DOM QUERY FUNCTIONS
        // -------------------------------------------------------------------------

        /**
         * Queries and caches all required DOM element references.
         *
         * This function separates elements inside the main container from those
         * outside (modal, sidebar buttons) which require document-level queries.
         *
         * @function queryDOMElements
         * @returns {boolean} True if all required elements were found, false otherwise
         *
         * @example
         * if (!queryDOMElements()) {
         *   console.error('Failed to initialize - missing DOM elements');
         *   return;
         * }
         */
        function queryDOMElements() {
            // Elements inside the container
            mainContent = container.querySelector('#main-content');
            progressBar = container.querySelector('#progress-bar');
            breadcrumbContainer = container.querySelector('#breadcrumb');
            backBtn = container.querySelector('#back-btn');
            restartBtn = container.querySelector('#restart-btn');
            toolSelector = container.querySelector('#tool-selector');

            // Elements outside the container (modal and hidden controls)
            // These must be queried from document, not container
            themeToggleBtn = document.querySelector('#theme-toggle-checkbox');
            universalModal = document.querySelector('#universal-modal');
            modalTitle = document.querySelector('#modal-title');
            modalBody = document.querySelector('#modal-body');

            // Return false if any critical element is missing
            return mainContent && progressBar && breadcrumbContainer && backBtn && restartBtn && toolSelector && universalModal;
        }

        // -------------------------------------------------------------------------
        // STYLING UTILITY FUNCTIONS
        // -------------------------------------------------------------------------

        /**
         * Returns Tailwind CSS classes for styling AI tool pills/badges.
         *
         * Uses partial string matching to determine the tool family and return
         * appropriate brand colors. Falls back to neutral gray for unknown tools.
         *
         * @function getPillClasses
         * @param {string} tool - The tool name (may include version, e.g., "Claude Opus 4.8")
         * @returns {string} Tailwind CSS classes for background and text color
         *
         * @example
         * getPillClasses('Claude Opus 4.8')  // Returns 'bg-[#d9843b] text-white'
         * getPillClasses('Unknown Tool')     // Returns 'bg-slate-700 text-slate-300'
         */
        const getPillClasses = (tool) => {
             // Map of tool name fragments to their brand colors
             const toolColorMap = {
                 'Claude': 'bg-[#d9843b] text-white',       // Anthropic orange
                 'Gemini': 'bg-[#369a8b] text-white',       // Google teal
                 'Nano Banana': 'bg-[#369a8b] text-white',  // Alias for Gemini
                 'Codex': 'bg-slate-500 text-white',        // OpenAI neutral
                 'GPT-5.6 Sol': 'bg-slate-500 text-white',      // OpenAI neutral
                 'GLM': 'bg-orange-500 text-white',         // Open-weight GLM family
                 'Qwen': 'bg-orange-500 text-white',        // Open-weight Qwen family
                 'GPT': 'bg-slate-500 text-white',          // OpenAI neutral
                 'Grok': 'bg-blue-500 text-white',          // xAI blue
                 'DeepSeek': 'bg-[#615EFC] text-white',     // DeepSeek purple
                 'Mistral': 'bg-pink-500 text-white',       // Mistral pink
                 'Perplexity': 'bg-violet-500 text-white',  // Perplexity violet
                 'ElevenLabs': 'bg-emerald-500 text-white', // ElevenLabs green
                 'Midjourney': 'bg-indigo-600 text-white',  // Midjourney indigo
                 'NotebookLM': 'bg-slate-600 text-white',   // Google NotebookLM
                 'Custom AI': 'bg-gray-500 text-gray-100',  // Generic custom
                 'RAG-enabled': 'bg-gray-500 text-white',   // RAG systems
                 'Open Source': 'bg-orange-500 text-white'  // Open source models
             };

             // Find the first matching key using partial string match
             const key = Object.keys(toolColorMap).find(k => tool.includes(k));
             return key ? toolColorMap[key] : 'bg-slate-700 text-slate-300';
        };

        /**
         * Returns Tailwind CSS classes for track-specific theming.
         *
         * Each workflow track has a distinct color scheme aligned with the
         * Amditis theme:
         * - research: ice (cyan) - for investigation and analysis
         * - content: acid (lime) - for writing and content creation
         * - multimedia: signal (red) - for audio/video production
         * - automation: white - for workflow automation
         *
         * @function getTrackColor
         * @param {string} track - The workflow track name
         * @returns {string} Tailwind CSS classes for text and border colors
         *
         * @example
         * getTrackColor('research')   // Returns 'text-accent border-accent'
         * getTrackColor('invalid')    // Returns 'text-accent border-accent' (default)
         */
        const getTrackColor = (track) => {
            const colors = {
                'research': 'text-accent border-accent',
                'content': 'text-accent border-accent',
                'multimedia': 'text-accent border-accent',
                'automation': 'text-ink border-ink'
            };
            return colors[track] || 'text-accent border-accent';
        };

        // -------------------------------------------------------------------------
        // SECURITY UTILITY FUNCTIONS
        // -------------------------------------------------------------------------

        /**
         * Sanitizes a string for safe HTML insertion by escaping HTML entities.
         *
         * Uses the browser's built-in text content encoding to prevent XSS attacks.
         * All user-provided content should be passed through this function before
         * being inserted into the DOM via innerHTML.
         *
         * @function sanitizeHTML
         * @param {string} str - The string to sanitize
         * @returns {string} The sanitized string with HTML entities escaped
         *
         * @example
         * sanitizeHTML('<script>alert("xss")</script>')
         * // Returns '&lt;script&gt;alert("xss")&lt;/script&gt;'
         */
        const sanitizeHTML = (str) => {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        };

        /**
         * Escapes & and quotes for safe round-trip through an HTML attribute.
         *
         * & must be escaped first; otherwise a literal substring like "&quot;"
         * in the input would be decoded back to a quote when the browser parses
         * the attribute, breaking dataset round-trips and downstream lookups.
         *
         * @function escapeAttr
         * @param {string} str - The string to escape
         * @returns {string} The string with &, ', and " replaced by entities
         *
         * @example
         * escapeAttr('Say "hello" & goodbye')  // 'Say &quot;hello&quot; &amp; goodbye'
         */
        const escapeAttr = (str) => str
            .replace(/&/g, "&amp;")
            .replace(/'/g, "&apos;")
            .replace(/"/g, "&quot;");

        /**
         * Returns a normalized absolute HTTP(S) URL or an empty string.
         *
         * @function safeHttpUrl
         * @param {unknown} value - Candidate URL from a data file
         * @returns {string} A safe absolute URL, or an empty string
         */
        const safeHttpUrl = (value) => {
            if (typeof value !== 'string') return '';
            try {
                const url = new URL(value);
                return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
            } catch {
                return '';
            }
        };

        /**
         * Keeps legacy changelog formatting while removing executable markup.
         *
         * @function sanitizeRichHTML
         * @param {unknown} value - Candidate changelog HTML
         * @returns {string} HTML limited to the changelog display allowlist
         */
        const sanitizeRichHTML = (value) => {
            if (typeof value !== 'string') return '';
            const container = document.createElement('div');
            container.innerHTML = value;
            const allowedTags = new Set(['A', 'CODE', 'EM', 'H3', 'H4', 'LI', 'P', 'STRONG', 'U', 'UL']);
            const presentationClasses = {
                A: 'text-accent underline',
                CODE: 'font-mono text-ink bg-white/50 border border-ink/10 px-1',
                EM: 'italic',
                H3: 'font-display text-xl font-bold mb-4 text-ink',
                H4: 'font-display text-base font-bold mt-4 mb-2 text-ink',
                LI: 'text-mist leading-relaxed',
                P: 'mb-3 text-mist leading-relaxed',
                STRONG: 'font-semibold text-ink',
                U: 'underline',
                UL: 'list-disc pl-5 space-y-1 mb-3',
            };

            for (const element of [...container.querySelectorAll('*')]) {
                if (!allowedTags.has(element.tagName)) {
                    element.replaceWith(document.createTextNode(element.textContent || ''));
                    continue;
                }

                const href = element.tagName === 'A' ? safeHttpUrl(element.getAttribute('href')) : '';
                for (const attribute of [...element.attributes]) {
                    element.removeAttribute(attribute.name);
                }
                element.setAttribute('class', presentationClasses[element.tagName]);
                if (element.tagName === 'A' && href) {
                    element.setAttribute('href', href);
                    element.setAttribute('target', '_blank');
                    element.setAttribute('rel', 'noopener noreferrer');
                } else if (element.tagName === 'A') {
                    element.replaceWith(...element.childNodes);
                }
            }

            return container.innerHTML;
        };

        // -------------------------------------------------------------------------
        // RENDERING FUNCTIONS
        // -------------------------------------------------------------------------

        /**
         * Main render orchestrator that handles view transitions.
         *
         * Applies a fade-out/fade-in transition effect when switching between
         * question and recommendation views. Updates the progress bar and
         * breadcrumbs after rendering.
         *
         * @function renderApp
         * @returns {void}
         *
         * @fires updateProgressBarAndBreadcrumbs
         */
        function renderApp() {
            if (!mainContent) return;

            // Fade out current content
            mainContent.style.opacity = '0';

            // After fade completes, render new content and fade in
            setTimeout(() => {
                if (showRecommendation) {
                    renderRecommendationView();
                } else {
                    renderQuestionView();
                }
                mainContent.style.opacity = '1';
                updateProgressBarAndBreadcrumbs();
            }, 150);
        }

        /**
         * Renders the question/options view for the current decision tree step.
         *
         * Generates HTML for the current question and all available options as
         * interactive buttons. Each button contains data attributes used by the
         * event handler to determine navigation:
         *
         * - `data-next`: The next node key or "recommendation"
         * - `data-text`: The option text for history tracking
         * - `data-tools`: JSON-stringified tool recommendations (for terminal nodes)
         * - `data-track`: The workflow track for theming
         *
         * @function renderQuestionView
         * @returns {void}
         *
         * @example
         * // Button structure generated:
         * // <button class="option-button" data-next="research_2" data-track="research">
         * //   <span>Option text</span>
         * // </button>
         */
        function renderQuestionView() {
            const node = decisionTree[currentStep];

            // Generate option buttons with staggered animation delays
            let optionsHTML = node.options.map((option, index) => {
                // Serialize tools array for data attribute (if present)
                const toolsJSON = option.tools ? escapeAttr(JSON.stringify(option.tools)) : 'null';
                const trackColor = getTrackColor(option.track || currentTrack);

                return `
                <button class="option-button group w-full text-left p-5 transition-all duration-200 flex justify-between items-center bg-white/40 border border-ink/10 hover:border-accent hover:bg-white/60"
                        data-next="${option.next}"
                        data-text="${sanitizeHTML(option.text)}"
                        data-tools='${toolsJSON}'
                        data-track="${option.track || currentTrack}"
                        style="animation-delay: ${index * 50}ms">
                    <div class="flex items-center gap-4">
                        <span class="text-xs font-mono text-mist group-hover:text-accent transition-colors">0${index + 1}</span>
                        <span class="font-display text-ink group-hover:text-accent transition-colors">${sanitizeHTML(option.text)}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 ml-2 text-mist group-hover:text-accent group-hover:translate-x-1 transition-all"><path d="m9 18 6-6-6-6"/></svg>
                </button>`;
            }).join('');

            // Render question header with step counter and options
            mainContent.innerHTML = `
                <div class="mb-8">
                    <div class="text-xs font-mono text-accent mb-2 tracking-widest">QUERY_${String(history.length + 1).padStart(2, '0')}</div>
                    <h2 class="font-display text-2xl sm:text-3xl text-ink tracking-wide">${sanitizeHTML(node.question)}</h2>
                </div>
                <div class="space-y-3">${optionsHTML}</div>`;
        }

        /**
         * Renders the recommendation view with tool cards.
         *
         * Displays the selected tool recommendations as styled cards, each containing:
         * - Tool name and description
         * - Recommended AI models (as clickable pills that open model info)
         * - Sample prompt for getting started
         * - Optional pro tips
         *
         * Also includes a restart button to begin a new query.
         *
         * @function renderRecommendationView
         * @returns {void}
         */
        function renderRecommendationView() {
            // Generate HTML for each recommended tool card
            let toolsHTML = selectedTools.map((tool, index) => `
                <div class="recommendation-card border border-ink/10 bg-white/40 p-6 transition-all duration-300 relative overflow-hidden" style="animation-delay: ${index * 100}ms">
                    <div class="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                    <div class="pl-4">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-8 h-8 bg-accent/20 border border-accent flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M12 20s-8-4.5-8-12.5A8 8 0 0 1 12 4a8 8 0 0 1 8 8.5c0 8-8 12.5-8 12.5z"/><circle cx="12" cy="11" r="2"/></svg>
                            </div>
                            <h3 class="font-display text-xl text-ink tracking-wide">${sanitizeHTML(tool.name)}</h3>
                        </div>
                        <p class="text-sm text-mist mb-6 leading-relaxed">${sanitizeHTML(tool.description)}</p>

                        <div class="mb-6">
                            <h4 class="text-xs font-mono text-accent mb-3 tracking-widest">RECOMMENDED_MODELS</h4>
                            <div class="flex flex-wrap gap-2">
                                ${tool.tools.map(item => `<button class="model-pill-btn text-xs font-medium px-3 py-1.5 rounded-sm ${getPillClasses(item)} hover:opacity-80 transition-opacity" data-model-name="${item}">${sanitizeHTML(item)}</button>`).join('')}
                            </div>
                        </div>

                        <div class="mb-6">
                            <h4 class="text-xs font-mono text-accent mb-3 tracking-widest">SAMPLE_PROMPT</h4>
                            <code class="block text-sm text-ink whitespace-pre-wrap font-mono bg-white/50 border border-ink/10 p-4 leading-relaxed">${sanitizeHTML(tool.prompt)}</code>
                        </div>

                        ${tool.tips ? `
                        <div>
                            <h4 class="text-xs font-mono text-accent mb-3 tracking-widest">PRO_TIPS</h4>
                            <p class="text-sm text-mist leading-relaxed border-l-2 border-accent/30 pl-4">${sanitizeHTML(tool.tips)}</p>
                        </div>` : ''}
                    </div>
                </div>`).join('');

            // Render the complete recommendation view with header and restart button
            mainContent.innerHTML = `
                <div class="mb-8">
                    <div class="text-xs font-mono text-accent mb-2 tracking-widest">ANALYSIS_COMPLETE</div>
                    <h2 class="font-display text-2xl sm:text-3xl text-ink tracking-wide">Recommended tools and approaches</h2>
                </div>
                <div class="space-y-6">${toolsHTML}</div>
                <div class="mt-8 pt-6 border-t border-ink/10">
                    <button id="restart-from-rec-btn" class="flex items-center gap-2 px-6 py-3 text-sm font-mono bg-white/40 border border-ink/10 text-mist hover:text-accent hover:border-accent transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        [ START_NEW_QUERY ]
                    </button>
                </div>`;
        }

        // -------------------------------------------------------------------------
        // NAVIGATION & PATH FINDING FUNCTIONS
        // -------------------------------------------------------------------------

        /**
         * Finds the complete navigation path to reach a specific workflow.
         *
         * This function is used by the "Jump to workflow" dropdown to reconstruct
         * the history that would lead to a specific tool recommendation. It performs
         * two operations:
         *
         * 1. Forward search: Find the terminal node containing the workflow
         * 2. Backward trace: Recursively trace from that node back to "start"
         *
         * @function findPathForWorkflow
         * @param {string} workflowName - The name of the workflow/tool to find
         * @returns {HistoryEntry[]} Array of history entries from start to the workflow,
         *                           or empty array if workflow not found
         *
         * @example
         * const path = findPathForWorkflow('Research Assistant');
         * // Returns: [
         * //   { step: 'start', question: '...', selection: 'Research', track: 'research' },
         * //   { step: 'research_1', question: '...', selection: 'Quick lookup', track: 'research' }
         * // ]
         */
        function findPathForWorkflow(workflowName) {
            // Step 1: Find the terminal node containing this workflow
            let endNodeInfo = null;
            for (const stepKey in decisionTree) {
                const node = decisionTree[stepKey];
                if (node.options) {
                    for (const option of node.options) {
                        // Check if this option leads to the target workflow
                        if (option.tools && option.tools[0].name === workflowName) {
                            endNodeInfo = {
                                parentStep: stepKey,
                                finalSelection: option.text,
                                track: option.track || (decisionTree[stepKey] ? decisionTree[stepKey].track : 'research')
                            };
                            break;
                        }
                    }
                }
                if (endNodeInfo) break;
            }

            // Return empty path if workflow not found
            if (!endNodeInfo) return [];

            /**
             * Recursively traces backwards from a target step to the start node.
             * @param {string} targetStep - The step key to trace back from
             * @returns {HistoryEntry[]} The path from start to targetStep
             */
            function traceBack(targetStep) {
                if (targetStep === 'start') return [];

                // Search all nodes for one that leads to targetStep
                for (const stepKey in decisionTree) {
                    const node = decisionTree[stepKey];
                    if (node.options) {
                        for (const option of node.options) {
                            if (option.next === targetStep) {
                                // Recursively trace back, then add this step
                                const path = traceBack(stepKey);
                                path.push({
                                    step: stepKey,
                                    question: node.question,
                                    selection: option.text,
                                    track: option.track || (decisionTree[stepKey] ? decisionTree[stepKey].track : 'research'),
                                });
                                return path;
                            }
                        }
                    }
                }
                return [];
            }

            // Build complete path: trace back to start, then add the final selection
            const basePath = traceBack(endNodeInfo.parentStep);
            basePath.push({
                step: endNodeInfo.parentStep,
                question: decisionTree[endNodeInfo.parentStep].question,
                selection: endNodeInfo.finalSelection,
                track: endNodeInfo.track
            });
            return basePath;
        }

        /**
         * Populates the workflow jump dropdown with all available workflows.
         *
         * Extracts all unique workflow names from terminal nodes in the decision
         * tree and creates sorted dropdown options. This allows users to jump
         * directly to any workflow without navigating through the decision tree.
         *
         * @function populateToolSelector
         * @returns {void}
         */
        function populateToolSelector() {
            if (!toolSelector) return;

            // Extract all options that have tool recommendations (terminal nodes)
            const allOptions = Object.values(decisionTree)
                .flatMap(node => node.options || [])
                .filter(option => option.tools);

            // Build unique workflow map (using first tool name as identifier)
            let uniqueWorkflows = {};
            allOptions.forEach(option => {
                const toolName = option.tools[0].name;
                if (!uniqueWorkflows[toolName]) {
                    uniqueWorkflows[toolName] = { name: toolName, value: toolName };
                }
            });

            // Render sorted dropdown options
            toolSelector.innerHTML = '<option value="">Jump to a workflow...</option>' +
                Object.values(uniqueWorkflows)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(opt => `<option value="${escapeAttr(opt.value)}">${sanitizeHTML(opt.name)}</option>`)
                    .join('');
        }

        // -------------------------------------------------------------------------
        // MODAL RENDERING FUNCTIONS
        // -------------------------------------------------------------------------

        /**
         * Renders the tool comparison modal content.
         *
         * Displays a tool selection interface and a comparison table. Users can
         * select up to 3 tools to compare side-by-side across features:
         * - Key strengths
         * - Limitations
         * - Best use cases
         * - Pricing
         *
         * The modal updates dynamically as tools are selected/deselected via
         * the `compareTools` state array.
         *
         * @function renderComparisonModal
         * @returns {void}
         */
        function renderComparisonModal() {
            // Render tool selection buttons
            const headerHTML = `
                <h3 class="text-sm font-mono text-accent mb-4 tracking-widest">SELECT_TOOLS (MAX 3)</h3>
                <div class="flex flex-wrap gap-2">
                    ${Object.keys(toolComparisonData).map(tool => `
                        <button class="px-3 py-1.5 text-sm font-medium transition-all compare-tool-btn ${compareTools.includes(tool) ? getPillClasses(tool) + ' ring-2 ring-offset-2 ring-offset-canvas ring-current' : 'bg-white/80 border border-ink/15 text-ink/75 hover:text-ink hover:border-ink/40'}" data-tool="${escapeAttr(tool)}">${sanitizeHTML(tool)}</button>
                    `).join('')}
                </div>`;

            let tableHTML = '';
            if (compareTools.length > 0) {
                // Build comparison table when tools are selected
                const features = ['strengths', 'weaknesses', 'bestFor', 'pricing'];
                const featureNames = {
                    strengths: 'Key strengths',
                    weaknesses: 'Limitations',
                    bestFor: 'Best use cases',
                    pricing: 'Pricing'
                };

                tableHTML = `
                    <div class="overflow-x-auto mt-6">
                        <table class="min-w-full w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-ink/10">
                                    <th class="py-3 font-mono text-xs text-mist tracking-wider">FEATURE</th>
                                    ${compareTools.map(tool => `<th class="py-3"><span class="text-xs font-medium px-3 py-1 rounded-sm inline-block ${getPillClasses(tool)}">${sanitizeHTML(tool)}</span></th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${features.map(feature => `
                                    <tr class="align-top border-b border-ink/5">
                                        <td class="py-4 pr-4 font-medium text-ink whitespace-nowrap">${featureNames[feature]}</td>
                                        ${compareTools.map(tool => `<td class="py-4 pr-4 text-ink/85">${Array.isArray(toolComparisonData[tool][feature]) ? `<ul class="list-disc pl-5 space-y-1">${toolComparisonData[tool][feature].map(item => `<li>${sanitizeHTML(item)}</li>`).join('')}</ul>` : sanitizeHTML(toolComparisonData[tool][feature])}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>`;
            } else {
                // Show placeholder when no tools selected
                tableHTML = `<div class="text-center p-8 bg-white/70 border border-ink/15 mt-6"><p class="text-ink/70 font-mono text-sm">Select up to three tools to compare their features side-by-side.</p></div>`;
            }
            modalBody.innerHTML = headerHTML + tableHTML;
        }

        /**
         * Renders the journalism case studies modal content.
         *
         * Displays a grid of case study cards, each featuring:
         * - Title and tool used
         * - Journalist/organization
         * - Challenge addressed
         * - Key takeaway
         * - Notable quote
         * - Optional source link
         *
         * @function renderCaseStudiesModal
        * @returns {void}
         */
        function renderCaseStudiesModal() {
            modalBody.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${caseStudiesData.map(study => {
                const sourceUrl = safeHttpUrl(study.sourceUrl);
                return `
                <div class="border border-ink/10 overflow-hidden flex flex-col bg-white/40">
                    <div class="px-5 py-4 ${getPillClasses(study.tool)}">
                        <div class="flex justify-between items-start gap-2">
                            <h3 class="font-display font-bold text-lg leading-tight">${sanitizeHTML(study.title)}</h3>
                            <span class="text-xs px-2 py-1 bg-white/20 rounded-sm font-mono flex-shrink-0">${sanitizeHTML(study.tool)}</span>
                        </div>
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <div class="flex-grow">
                            <p class="text-sm mb-3 font-medium text-mist">${sanitizeHTML(study.journalist)}</p>
                            <div class="text-sm space-y-4">
                                <div>
                                    <h4 class="font-mono text-xs text-accent tracking-wider mb-2">CHALLENGE</h4>
                                    <p class="text-mist">${sanitizeHTML(study.challenge)}</p>
                                </div>
                                <div>
                                    <h4 class="font-mono text-xs text-accent tracking-wider mb-2">KEY_TAKEAWAY</h4>
                                    <p class="text-mist">${sanitizeHTML(study.tips)}</p>
                                </div>
                                <div>
                                    <h4 class="font-mono text-xs text-accent tracking-wider mb-2">WORDS_OF_WISDOM</h4>
                                    <p class="border-l-2 pl-4 py-2 border-accent/30 bg-accent/5 text-sm italic text-ink">"${sanitizeHTML(study.quote)}"</p>
                                </div>
                            </div>
                        </div>
                        ${sourceUrl ? `<div class="mt-4 flex justify-end"><a href="${escapeAttr(sourceUrl)}" target="_blank" rel="noopener noreferrer" class="text-sm font-mono text-accent hover:underline">Learn more →</a></div>` : ''}
                    </div>
                </div>`;
            }).join('')}</div>`;
        }

        /**
         * Renders the best practices guide modal content.
         *
         * Displays categorized tips for effective AI tool usage:
         * - Core principles
         * - Effective prompting techniques
         * - Workflow integration
         * - Image prompting
         * - Ethical guidelines & privacy
         *
         * @function renderBestPracticesModal
         * @returns {void}
         */
        function renderBestPracticesModal() {
            const data = bestPracticesData.general;
            if (!data) {
                modalBody.innerHTML = '<p class="text-mist">No best practices available.</p>';
                return;
            }

            let contentHTML = '<div class="space-y-8">';

            // Map section keys to display titles
            const sections = {
                'Core principles': data.corePrinciples,
                'Effective prompting is a conversation': data.promptingTechniques,
                'Agent workflows': data.agentWorkflows,
                'Workflow integration': data.workflowIntegration,
                'Prompting for images': data.imagePrompting,
                'Ethical guidelines & privacy': data.ethicalGuidelines
            };

            // Render each section with its tips
            for (const [title, tips] of Object.entries(sections)) {
                if (tips) {
                    contentHTML += `
                        <div>
                            <h3 class="font-display text-lg font-bold mb-4 text-ink">${title}</h3>
                            <ul class="space-y-3 text-sm">
                                ${tips.map((tip) => `
                                    <li class="flex items-start text-mist">
                                        <svg class="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>${sanitizeRichHTML(tip)}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>`;
                }
            }
            contentHTML += '</div>';
            modalBody.innerHTML = contentHTML;
        }

        /**
         * Renders the AI model information modal content.
         *
         * Displays a grid of model information cards with descriptions,
         * key features, and links to official websites. Optionally highlights
         * and scrolls to a specific model when opened from a model pill click.
         *
         * @function renderModelInfoModal
         * @param {string|null} [highlightModel=null] - Model name to highlight and scroll to
         * @returns {void}
         */
        function renderModelInfoModal(highlightModel = null) {
            let contentHTML = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

            // Generate card for each model
            for (const [name, data] of Object.entries(modelInfoData)) {
                const isHighlighted = name === highlightModel;
                const modelUrl = safeHttpUrl(data.link);
                contentHTML += `
                <div id="model-card-${name.replace(/\s+/g, '-')}" class="border border-ink/10 overflow-hidden flex flex-col bg-white/40 ${isHighlighted ? 'ring-2 ring-accent' : ''}">
                    <div class="px-5 py-4 ${getPillClasses(name)}"><h3 class="font-display font-bold text-lg">${sanitizeHTML(name)}</h3></div>
                    <div class="p-5 flex flex-col flex-grow">
                        <div class="flex-grow">
                            <p class="text-sm mb-4 text-mist">${sanitizeHTML(data.description)}</p>
                            <h4 class="text-xs font-mono text-accent mb-3 tracking-wider">KEY_FEATURES</h4>
                            <ul class="space-y-2 text-sm list-disc pl-5 text-mist">${data.features.map(feature => `<li>${sanitizeHTML(feature)}</li>`).join('')}</ul>
                        </div>
                        ${modelUrl ? `<div class="mt-4 flex justify-end">
                            <a href="${escapeAttr(modelUrl)}" target="_blank" rel="noopener noreferrer" class="text-sm font-mono text-accent hover:underline">Visit website →</a>
                        </div>` : ''}
                    </div>
                </div>`;
            }
            contentHTML += '</div>';
            modalBody.innerHTML = contentHTML;

            // Scroll to highlighted model after render
            if (highlightModel) {
                const cardElement = document.getElementById(`model-card-${highlightModel.replace(/\s+/g, '-')}`);
                if (cardElement) {
                    setTimeout(() => cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }
            }
        }

        /**
         * Renders the changelog/release notes modal content.
         *
         * Displays version history with release notes for each version.
         * Notes may contain HTML formatting.
         *
         * @function renderChangelogModal
         * @returns {void}
         */
        function renderChangelogModal() {
            modalBody.innerHTML = changelogData.map(log => `
                <div class="pb-6 mb-6 border-b border-ink/10 last:border-b-0 last:mb-0 last:pb-0">
                    <p class="text-sm font-mono text-accent mb-2">v${sanitizeHTML(log.version)}</p>
                    <div class="text-sm text-mist">${sanitizeRichHTML(log.notes)}</div>
                </div>
            `).join('');
        }

        // -------------------------------------------------------------------------
        // UI STATE FUNCTIONS
        // -------------------------------------------------------------------------

        /**
         * Updates the progress bar width and breadcrumb navigation.
         *
         * Progress is calculated as a percentage based on navigation history
         * depth, with 100% shown when viewing recommendations. Also manages
         * the back button's disabled state and visibility of breadcrumbs.
         *
         * @function updateProgressBarAndBreadcrumbs
         * @returns {void}
         */
        function updateProgressBarAndBreadcrumbs() {
            // Calculate progress (estimate 4 steps to completion)
            const estimatedTotalSteps = 4;
            const progress = showRecommendation ? 100 : Math.min(100, (history.length / estimatedTotalSteps) * 100);

            // Update progress bar
            progressBar.style.width = `${progress}%`;
            progressBar.className = 'absolute top-0 left-0 h-full bg-accent transition-all duration-500';

            // Update back button state
            backBtn.disabled = history.length === 0;
            backBtn.classList.toggle('opacity-30', backBtn.disabled);
            backBtn.classList.toggle('cursor-not-allowed', backBtn.disabled);

            // Update breadcrumb trail
            if (history.length > 0) {
                breadcrumbContainer.classList.remove('hidden');
                breadcrumbContainer.innerHTML = history
                    .map(item => `<span class="text-mist hover:text-accent transition-colors">${sanitizeHTML(item.selection)}</span>`)
                    .join('<span class="text-mist/50 mx-2">/</span>');
            } else {
                breadcrumbContainer.classList.add('hidden');
            }
        }

        /**
         * Updates the current workflow track for theming.
         *
         * @function updateTrackColor
         * @param {string} track - The new track: "research" | "content" | "multimedia" | "automation"
         * @returns {void}
         */
        function updateTrackColor(track) {
            if (!track) return;
            currentTrack = track;
        }

        // -------------------------------------------------------------------------
        // MODAL CONTROL FUNCTIONS
        // -------------------------------------------------------------------------

        /**
         * Opens the universal modal with specified content.
         *
         * Accepts a title and a render function that will populate the modal body.
         * Additional arguments are passed through to the render function.
         * Prevents body scrolling while modal is open.
         *
         * @function showModal
         * @param {string} title - The modal title text
         * @param {Function} renderFunction - Function to render modal body content
         * @param {...*} args - Additional arguments to pass to renderFunction
         * @returns {void}
         *
         * @example
         * showModal('Tool comparison', renderComparisonModal);
         * showModal('Model information', renderModelInfoModal, 'Claude Opus 4.8');
         */
        function showModal(title, renderFunction, ...args) {
            modalTitle.textContent = title;
            renderFunction(...args);
            universalModal.classList.remove('hidden');
            universalModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }

        /**
         * Closes the universal modal and restores body scrolling.
         *
         * @function hideModal
         * @returns {void}
         */
        function hideModal() {
            universalModal.classList.add('hidden');
            universalModal.classList.remove('flex');
            document.body.style.overflow = '';
        }

        // -------------------------------------------------------------------------
        // EVENT HANDLERS
        // -------------------------------------------------------------------------

        /**
         * Handles option button clicks in the question view.
         *
         * Extracts navigation data from button's data attributes, updates state,
         * and triggers a re-render. If the option leads to a recommendation,
         * switches to recommendation view.
         *
         * @function handleOptionSelect
         * @param {Event} e - The click event
         * @returns {void}
         */
        function handleOptionSelect(e) {
            const button = e.target.closest('.option-button');
            if (!button) return;

            // Extract data from button attributes
            const { next, text, track } = button.dataset;
            let tools = button.dataset.tools;

            // Update track theming if specified
            if (track) updateTrackColor(track);

            // Parse tools JSON if this is a terminal node
            if (tools && tools !== 'null') {
                tools = tools.replace(/&quot;/g, '"');
                selectedTools = JSON.parse(tools);
            }

            // Add current step to history before navigating
            history.push({
                step: currentStep,
                question: decisionTree[currentStep].question,
                selection: text,
                track: currentTrack
            });

            // Navigate to next step or show recommendation
            if (next === "recommendation") {
                showRecommendation = true;
            } else {
                currentStep = next;
            }
            renderApp();
        }

        /**
         * Resets the application to its initial state.
         *
         * Clears all navigation history and returns to the start node.
         *
         * @function handleRestart
         * @returns {void}
         */
        function handleRestart() {
            currentStep = 'start';
            history = [];
            selectedTools = [];
            showRecommendation = false;
            currentTrack = 'research';
            renderApp();
        }

        /**
         * Navigates back to the previous step in history.
         *
         * Pops the last entry from history and restores that step's state.
         * Does nothing if history is empty.
         *
         * @function handleBack
         * @returns {void}
         */
        function handleBack() {
            if (history.length > 0) {
                const previous = history.pop();
                currentStep = previous.step;
                updateTrackColor(previous.track);
                showRecommendation = false;
                selectedTools = [];
                renderApp();
            }
        }

        /**
         * Handles workflow selection from the jump dropdown.
         *
         * Reconstructs the navigation path to the selected workflow and
         * displays its recommendations directly.
         *
         * @function handleToolSelect
         * @param {Event} e - The change event from the select element
         * @returns {void}
         */
        function handleToolSelect(e) {
            if (!e.target.value) return;
            const workflowName = e.target.value;

            // Find the path to this workflow
            const path = findPathForWorkflow(workflowName);
            if (path.length > 0) {
                history = path;

                // Find the target option to get its tools
                const allOptions = Object.values(decisionTree)
                    .flatMap(node => node.options || [])
                    .filter(option => option.tools);
                const targetOption = allOptions.find(opt => opt.tools && opt.tools[0].name === workflowName);

                if (targetOption) {
                    selectedTools = targetOption.tools;
                    currentTrack = path[path.length - 1].track;
                    showRecommendation = true;
                    renderApp();
                }
            }
        }

        /**
         * Handles Escape key press to close modal.
         *
         * @function handleEscKey
         * @param {KeyboardEvent} e - The keyboard event
         * @returns {void}
         */
        function handleEscKey(e) {
            if (e.key === 'Escape') hideModal();
        }

        // -------------------------------------------------------------------------
        // INITIALIZATION
        // -------------------------------------------------------------------------

        /**
         * Initializes the LLM Tool Advisor application.
         *
         * This function:
         * 1. Queries and caches all DOM element references
         * 2. Renders the initial view
         * 3. Populates the workflow jump dropdown
         * 4. Sets up event delegation on the main container
         * 5. Attaches event listeners to elements outside the container
         *
         * ## Event Delegation Pattern
         *
         * Most click events are handled via event delegation on the main container
         * for efficiency. However, elements outside the container (modal, sidebar)
         * require their own event listeners attached here.
         *
         * @function init
         * @returns {void}
         * @global
         * @see window.initLLMAdvisor
         */
        function init() {
            if (!queryDOMElements()) {
                console.error('Failed to query DOM elements.');
                return;
            }

            // Initial render and populate dropdown
            renderApp();
            populateToolSelector();

            // ----------------------------------------------------------------
            // Main Container Event Delegation
            // ----------------------------------------------------------------
            // Single event listener handles all button clicks inside container
            container.addEventListener('click', e => {
                const button = e.target.closest('button');
                if (!button) return;

                const id = button.id;
                const classList = button.classList;

                // Option buttons (question view)
                if (classList.contains('option-button')) {
                    handleOptionSelect(e);
                    return;
                }

                // Restart buttons (both in header and recommendation view)
                if (id === 'restart-from-rec-btn' || id === 'restart-btn') {
                    handleRestart();
                    return;
                }

                // Footer modal triggers
                if (id === 'footer-best-practices-btn') {
                    showModal('Best practices guide', renderBestPracticesModal);
                    return;
                }
                if (id === 'show-changelog-btn') {
                    showModal('Release notes', renderChangelogModal);
                    return;
                }

                // Model pills (open model info modal with highlight)
                if (classList.contains('model-pill-btn')) {
                    const modelName = button.dataset.modelName;
                    showModal('Model information', renderModelInfoModal, modelName);
                    return;
                }

                // Navigation buttons
                if (id === 'back-btn') {
                    handleBack();
                    return;
                }

                // Sidebar modal triggers (may also be in container on mobile)
                if (id === 'show-comparison-btn') {
                    compareTools = [];
                    showModal('Tool comparison', renderComparisonModal);
                    return;
                }
                if (id === 'show-case-studies-btn') {
                    showModal('Journalistic case studies', renderCaseStudiesModal);
                    return;
                }
                if (id === 'footer-model-info-btn') {
                    showModal('Model information', renderModelInfoModal);
                    return;
                }

                // Modal close button
                if (classList.contains('modal-close-btn')) {
                    hideModal();
                    return;
                }

                // Tool comparison toggle
                if (classList.contains('compare-tool-btn')) {
                    const tool = button.dataset.tool;
                    if (compareTools.includes(tool)) {
                        compareTools = compareTools.filter(t => t !== tool);
                    } else if (compareTools.length < 3) {
                        compareTools.push(tool);
                    }
                    renderComparisonModal();
                }
            });

            // ----------------------------------------------------------------
            // Theme Toggle (currently unused, placeholder for future)
            // ----------------------------------------------------------------
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('change', () => {});
            }

            // ----------------------------------------------------------------
            // Workflow Jump Dropdown
            // ----------------------------------------------------------------
            toolSelector.addEventListener('change', handleToolSelect);

            // ----------------------------------------------------------------
            // Global Event Listeners
            // ----------------------------------------------------------------
            // Escape key to close modal
            document.addEventListener('keydown', handleEscKey);

            // Modal backdrop click and internal button handling
            universalModal.addEventListener('click', e => {
                // Click on backdrop closes modal
                if (e.target === universalModal) hideModal();

                // Handle clicks inside the modal
                const button = e.target.closest('button');
                if (!button) return;

                if (button.classList.contains('modal-close-btn')) {
                    hideModal();
                    return;
                }

                // Tool comparison toggles inside modal
                if (button.classList.contains('compare-tool-btn')) {
                    const tool = button.dataset.tool;
                    if (compareTools.includes(tool)) {
                        compareTools = compareTools.filter(t => t !== tool);
                    } else if (compareTools.length < 3) {
                        compareTools.push(tool);
                    }
                    renderComparisonModal();
                    return;
                }

                // Model pills inside modal (for switching between models)
                if (button.classList.contains('model-pill-btn')) {
                    const modelName = button.dataset.modelName;
                    showModal('Model information', renderModelInfoModal, modelName);
                    return;
                }
            });

            // ----------------------------------------------------------------
            // Sidebar Buttons (Outside Main Container)
            // ----------------------------------------------------------------
            // These elements are in the page layout but outside #llm-tool-advisor-container,
            // so they need their own event listeners (event delegation doesn't reach them)
            const showComparisonBtn = document.getElementById('show-comparison-btn');
            const showCaseStudiesBtn = document.getElementById('show-case-studies-btn');

            if (showComparisonBtn) {
                showComparisonBtn.addEventListener('click', () => {
                    compareTools = [];
                    showModal('Tool comparison', renderComparisonModal);
                });
            }

            if (showCaseStudiesBtn) {
                showCaseStudiesBtn.addEventListener('click', () => {
                    showModal('Journalistic case studies', renderCaseStudiesModal);
                });
            }
        }

    // =========================================================================
    // EXPOSE INIT FUNCTION
    // =========================================================================

    /**
     * Global reference to the initialization function.
     *
     * Exposed on window object so it can be called after data loads.
     * This is the only externally accessible function from the IIFE.
     *
     * @global
     * @function window.initLLMAdvisor
     */
    window.initLLMAdvisor = init;

})();

/* ============================================================================
 * APPLICATION STARTUP
 * ============================================================================ */

/**
 * Application entry point.
 *
 * Loads all JSON data files, then initializes the application once
 * the DOM is ready. Displays an error message if data loading fails.
 */
loadAllData().then(success => {
    if (success) {
        // Wait for DOM to be ready if still loading
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', window.initLLMAdvisor);
        } else {
            // DOM already ready, initialize immediately
            window.initLLMAdvisor();
        }
    } else {
        // Data loading failed - show error message
        console.error('Failed to load application data');
        document.addEventListener('DOMContentLoaded', () => {
            const mainContent = document.querySelector('#main-content');
            if (mainContent) {
                mainContent.innerHTML = '<div class="text-center p-8 border border-red-500/30 bg-red-50"><p class="text-red-600 font-mono">ERROR: Failed to load application data. Please refresh the page.</p></div>';
            }
        });
    }
});
