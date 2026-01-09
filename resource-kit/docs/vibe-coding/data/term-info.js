/**
 * Interactive Term Info System
 * Click on terms to see definitions in a sidebar (desktop) or modal (mobile)
 */

// Wait for glossary data to load
document.addEventListener('DOMContentLoaded', function() {
  if (typeof VIBE_GLOSSARY === 'undefined') {
    console.warn('VIBE_GLOSSARY not loaded');
    return;
  }

  initTermInfoSystem();
});

function initTermInfoSystem() {
  // Create the info panel elements
  createInfoPanel();
  createMobileModal();

  // Add click handlers to all term links
  document.querySelectorAll('[data-term]').forEach(el => {
    el.addEventListener('click', handleTermClick);
  });
}

function createInfoPanel() {
  // Desktop sidebar panel
  const panel = document.createElement('div');
  panel.id = 'term-info-panel';
  panel.className = 'fixed top-0 right-0 h-full w-96 bg-panel border-l border-white/10 transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto hidden lg:block';
  panel.innerHTML = `
    <div class="sticky top-0 bg-panel border-b border-white/10 p-4 flex justify-between items-center">
      <span class="text-xs text-gray-500 font-mono tracking-widest">TERM_INFO</span>
      <button id="close-panel" class="text-gray-500 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div id="panel-content" class="p-6">
      <p class="text-gray-500 text-sm">Click on a highlighted term to see its definition.</p>
    </div>
  `;
  document.body.appendChild(panel);

  // Close button handler
  document.getElementById('close-panel').addEventListener('click', closePanel);

  // Click outside to close
  document.addEventListener('click', function(e) {
    const panel = document.getElementById('term-info-panel');
    if (!panel.classList.contains('translate-x-full') &&
        !panel.contains(e.target) &&
        !e.target.closest('[data-term]')) {
      closePanel();
    }
  });
}

function createMobileModal() {
  // Mobile modal overlay
  const modal = document.createElement('div');
  modal.id = 'term-info-modal';
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden lg:hidden flex items-end justify-center';
  modal.innerHTML = `
    <div class="bg-panel border-t border-white/10 w-full max-h-[70vh] overflow-y-auto rounded-t-xl">
      <div class="sticky top-0 bg-panel border-b border-white/10 p-4 flex justify-between items-center">
        <span class="text-xs text-gray-500 font-mono tracking-widest">TERM_INFO</span>
        <button id="close-modal" class="text-gray-500 hover:text-white transition-colors p-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div id="modal-content" class="p-6"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Close handlers
  document.getElementById('close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
}

function handleTermClick(e) {
  e.preventDefault();
  const termKey = e.target.dataset.term;
  const termData = VIBE_GLOSSARY[termKey];

  if (!termData) {
    console.warn('Term not found:', termKey);
    return;
  }

  const content = generateTermContent(termData);

  // Check viewport width for mobile vs desktop
  if (window.innerWidth >= 1024) {
    showPanel(content);
  } else {
    showModal(content);
  }
}

function generateTermContent(data) {
  return `
    <div class="space-y-4">
      <!-- Term header -->
      <div>
        <span class="inline-block px-2 py-1 text-xs font-mono bg-acid/10 text-acid border border-acid/30 mb-3">
          ${data.category}
        </span>
        <h3 class="font-display text-2xl text-white font-bold">${data.term}</h3>
        <p class="text-acid font-mono text-sm mt-1">${data.short}</p>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/10"></div>

      <!-- Full definition -->
      <div>
        <h4 class="text-xs text-gray-500 font-mono tracking-widest mb-2">DEFINITION</h4>
        <p class="text-gray-300 leading-relaxed">${data.full}</p>
      </div>

      ${data.example ? `
      <!-- Example -->
      <div>
        <h4 class="text-xs text-gray-500 font-mono tracking-widest mb-2">EXAMPLE</h4>
        <div class="bg-void border border-white/10 p-3 font-mono text-sm">
          <code class="text-ice">${escapeHtml(data.example)}</code>
        </div>
      </div>
      ` : ''}

      ${data.warning ? `
      <!-- Warning -->
      <div class="bg-signal/10 border border-signal/30 p-3">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-signal mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="text-sm text-signal/90">${data.warning}</p>
        </div>
      </div>
      ` : ''}

      ${data.links && data.links.length > 0 ? `
      <!-- Related links -->
      <div>
        <h4 class="text-xs text-gray-500 font-mono tracking-widest mb-2">LEARN MORE</h4>
        <ul class="space-y-1">
          ${data.links.map(link => `
            <li>
              <a href="${link.url}" target="_blank" rel="noopener" class="text-ice hover:text-white transition-colors text-sm flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                ${link.text}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      <!-- Back to glossary link -->
      <div class="pt-4 border-t border-white/10">
        <a href="glossary.html" class="text-gray-500 hover:text-acid transition-colors text-xs font-mono flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          View full glossary
        </a>
      </div>
    </div>
  `;
}

function showPanel(content) {
  const panel = document.getElementById('term-info-panel');
  const contentEl = document.getElementById('panel-content');
  contentEl.innerHTML = content;
  panel.classList.remove('translate-x-full');
}

function closePanel() {
  const panel = document.getElementById('term-info-panel');
  panel.classList.add('translate-x-full');
}

function showModal(content) {
  const modal = document.getElementById('term-info-modal');
  const contentEl = document.getElementById('modal-content');
  contentEl.innerHTML = content;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('term-info-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Helper function to create a clickable term span
// Usage in HTML: <span data-term="npm" class="term-link">npm</span>
// Or call: wrapTerm('npm', 'npm run dev')
function wrapTerm(termKey, displayText) {
  return `<span data-term="${termKey}" class="term-link">${displayText || termKey}</span>`;
}

// CSS for term links (add to your stylesheet or include inline)
const termStyles = document.createElement('style');
termStyles.textContent = `
  .term-link {
    color: #00f0ff;
    cursor: pointer;
    border-bottom: 1px dashed rgba(0, 240, 255, 0.4);
    transition: all 0.2s ease;
  }
  .term-link:hover {
    color: #fff;
    border-bottom-color: #fff;
    background: rgba(0, 240, 255, 0.1);
  }

  /* Panel animation */
  #term-info-panel {
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  }

  /* Modal animation */
  #term-info-modal > div {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(termStyles);
