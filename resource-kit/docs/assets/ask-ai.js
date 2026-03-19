/**
 * @fileoverview Ask AI dropdown component (cream theme)
 *
 * Self-contained vanilla JS component that injects an "Ask an AI about this"
 * dropdown button into every page. Provides quick links to Claude, ChatGPT,
 * and Gemini with a page-aware prompt, plus a markdown download option using
 * Turndown.js.
 *
 * Usage: Include this script on any page. It auto-initializes on
 * DOMContentLoaded and injects itself as the first child of <main>,
 * falling back to <body> if no <main> element exists.
 *
 * All styles are inline. No external CSS required.
 *
 * @module AskAI
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // THEME CONSTANTS
  // ---------------------------------------------------------------------------

  var THEME = {
    buttonBg: '#3d4b40',
    buttonColor: '#ffffff',
    buttonBorder: '1px solid #3d4b40',
    buttonRadius: '0.5rem',
    panelBg: '#ffffff',
    panelColor: '#121212',
    panelBorder: '1px solid #d6cdb7',
    panelRadius: '0.75rem',
    panelShadow: '0 10px 25px rgba(0,0,0,0.1)',
    itemHoverBg: '#f5f0e6',
    iconColor: '#3d4b40',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  };

  // ---------------------------------------------------------------------------
  // SVG ICONS (hardcoded static markup -- no user input, safe for innerHTML)
  // ---------------------------------------------------------------------------

  var ICONS = {
    sparkle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"/></svg>',
    chatBubble: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    diamond: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L22 12L12 22L2 12Z"/></svg>',
    download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'
  };

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  function getPageTitle() {
    var h1 = document.querySelector('h1');
    return (h1 && h1.textContent.trim()) || document.title || 'this page';
  }

  function getPageContext() {
    var root = document.querySelector('main') || document.body;
    var parts = [];

    // Meta description
    var meta = document.querySelector('meta[name="description"]');
    if (meta && meta.content) {
      parts.push(meta.content.trim());
    }

    // Section headings as outline
    var headings = root.querySelectorAll('h2, h3');
    if (headings.length) {
      var outline = [];
      for (var i = 0; i < headings.length && i < 10; i++) {
        var text = headings[i].textContent.trim();
        if (text) outline.push('- ' + text);
      }
      if (outline.length) {
        parts.push('Sections covered:\n' + outline.join('\n'));
      }
    }

    // First paragraph of content
    var firstP = root.querySelector('p');
    if (firstP && firstP.textContent.trim()) {
      var pText = firstP.textContent.trim();
      if (pText.length > 400) pText = pText.substring(0, 400) + '...';
      parts.push('Intro: ' + pText);
    }

    return parts.join('\n\n');
  }

  function getPrompt() {
    var title = getPageTitle();
    var context = getPageContext();
    var prompt = 'I\'m learning about "' + title + '".';
    if (context) {
      prompt += '\n\nHere\'s what the page covers:\n\n' + context;
    }
    prompt += '\n\nCan you explain the key concepts and help me understand how to apply them?';
    return prompt;
  }

  function getSlug() {
    var path = window.location.pathname.replace(/\/$/, '').replace(/^\//, '');
    if (!path) return 'page';
    return path.replace(/\//g, '-').replace(/\.html?$/, '') || 'page';
  }

  function setStyle(el, styles) {
    for (var key in styles) {
      if (styles.hasOwnProperty(key)) {
        el.style[key] = styles[key];
      }
    }
  }

  // ---------------------------------------------------------------------------
  // TURNDOWN LOADER + MARKDOWN DOWNLOAD
  // ---------------------------------------------------------------------------

  var turndownPromise = null;

  function loadTurndown(callback) {
    if (typeof TurndownService !== 'undefined') {
      callback();
      return;
    }
    if (!turndownPromise) {
      turndownPromise = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = 'https://unpkg.com/turndown@7.2.0/dist/turndown.js';
        script.onload = resolve;
        script.onerror = function () {
          turndownPromise = null; // allow retry on failure
          reject(new Error('Failed to load Turndown'));
        };
        document.head.appendChild(script);
      });
    }
    turndownPromise.then(callback).catch(function () {
      alert('Failed to load markdown converter. Please try again.');
    });
  }

  function downloadMarkdown() {
    loadTurndown(function () {
      var source = document.querySelector('main') || document.body;
      var clone = source.cloneNode(true);
      // Remove the ask-ai widget from the clone so it doesn't appear in the download
      var widget = clone.querySelector('[data-ask-ai]');
      if (widget) widget.remove();
      var html = clone.innerHTML;
      var td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
      var md = td.turndown(html);
      var title = getPageTitle();
      var url = window.location.href;
      var content = '# ' + title + '\n\nSource: ' + url + '\n\n' + md;
      var blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = getSlug() + '.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    });
  }

  // ---------------------------------------------------------------------------
  // DROPDOWN ITEMS CONFIG
  // ---------------------------------------------------------------------------

  var ITEMS = [
    {
      label: 'Ask Claude',
      icon: ICONS.sparkle,
      href: function () {
        return 'https://claude.ai/new?q=' + encodeURIComponent(getPrompt());
      }
    },
    {
      label: 'Ask ChatGPT',
      icon: ICONS.chatBubble,
      href: function () {
        return 'https://chatgpt.com/?q=' + encodeURIComponent(getPrompt());
      }
    },
    {
      label: 'Ask Gemini',
      icon: ICONS.diamond,
      href: function () {
        return 'https://gemini.google.com/app?q=' + encodeURIComponent(getPrompt());
      }
    },
    {
      label: 'Download as markdown',
      icon: ICONS.download,
      action: downloadMarkdown
    }
  ];

  // ---------------------------------------------------------------------------
  // DOM CONSTRUCTION HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Creates an SVG element container from a static SVG string.
   * The SVG strings in ICONS are hardcoded constants (no user input),
   * so this is safe from injection.
   */
  function createIconSpan(svgString) {
    var span = document.createElement('span');
    setStyle(span, {
      color: THEME.iconColor,
      display: 'inline-flex',
      flexShrink: '0'
    });
    // SVG strings are static constants defined above, not user input
    span.innerHTML = svgString;
    return span;
  }

  // ---------------------------------------------------------------------------
  // BUILD DOM
  // ---------------------------------------------------------------------------

  function init() {
    // Find injection point: first child of <main>, or first child of <body> as fallback
    var mainEl = document.querySelector('main') || document.body;
    if (!mainEl) return;

    var hasMain = !!document.querySelector('main');

    // Container for the button + dropdown (inline-block so it sizes to content)
    // No wrapper div — the container is appended directly into an existing layout row

    var container = document.createElement('div');
    container.setAttribute('data-ask-ai', 'true');
    setStyle(container, {
      position: 'relative',
      display: 'inline-block',
      fontFamily: THEME.fontFamily
    });

    // Trigger button
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-haspopup', 'dialog');

    // Chat bubble icon — clearly communicates "ask a question"
    button.appendChild(createIconSpan(ICONS.chatBubble));
    button.title = 'Ask an AI about this page';

    setStyle(button, {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      background: THEME.buttonBg,
      color: THEME.buttonColor,
      border: 'none',
      borderRadius: '50%',
      width: '2rem',
      height: '2rem',
      padding: '0',
      cursor: 'pointer',
      transition: 'opacity 0.15s ease, transform 0.15s ease',
      flexShrink: '0'
    });

    button.addEventListener('mouseenter', function () { button.style.opacity = '0.85'; button.style.transform = 'scale(1.1)'; });
    button.addEventListener('mouseleave', function () { button.style.opacity = '1'; button.style.transform = 'scale(1)'; });

    // Dropdown panel
    var panel = document.createElement('div');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Ask an AI about this page');
    setStyle(panel, {
      position: 'absolute',
      top: 'calc(100% + 0.375rem)',
      right: '0',
      minWidth: '13rem',
      background: THEME.panelBg,
      color: THEME.panelColor,
      border: THEME.panelBorder,
      borderRadius: THEME.panelRadius,
      boxShadow: THEME.panelShadow,
      padding: '0.375rem',
      display: 'none',
      zIndex: '50',
      fontFamily: THEME.fontFamily
    });

    // Build menu items
    ITEMS.forEach(function (item) {
      var menuItem;

      if (item.href) {
        // AI link items use <a> with noopener noreferrer for tabnabbing protection
        menuItem = document.createElement('a');
        menuItem.href = item.href();
        menuItem.target = '_blank';
        menuItem.rel = 'noopener noreferrer';
        menuItem.addEventListener('click', function () {
          // Update href with current page context right before navigation
          menuItem.href = item.href();
          closeDropdown();
        });
      } else {
        // Non-link items (e.g. download) use <button>
        menuItem = document.createElement('button');
        menuItem.type = 'button';
        menuItem.addEventListener('click', function () {
          closeDropdown();
          item.action();
        });
      }

      // Icon
      menuItem.appendChild(createIconSpan(item.icon));

      // Label text (safe -- uses textContent)
      var labelSpan = document.createElement('span');
      labelSpan.textContent = item.label;
      menuItem.appendChild(labelSpan);

      setStyle(menuItem, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        width: '100%',
        padding: '0.5rem 0.625rem',
        fontSize: '0.8125rem',
        fontWeight: '500',
        fontFamily: THEME.fontFamily,
        color: THEME.panelColor,
        background: 'transparent',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        textAlign: 'left',
        lineHeight: '1.4',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        transition: 'background 0.12s ease'
      });

      menuItem.addEventListener('mouseenter', function () {
        menuItem.style.background = THEME.itemHoverBg;
      });
      menuItem.addEventListener('mouseleave', function () {
        menuItem.style.background = 'transparent';
      });

      panel.appendChild(menuItem);
    });

    container.appendChild(button);
    container.appendChild(panel);

    // Inject into the header nav alongside existing nav links
    var headerNav = document.querySelector('header nav');
    if (headerNav) {
      headerNav.appendChild(container);
    } else {
      // Fallback: append to the header's inner flex row
      var header = document.querySelector('header');
      if (header) {
        var headerFlex = header.querySelector('[class*="flex"]');
        if (headerFlex) {
          headerFlex.appendChild(container);
        }
      }
    }

    // -----------------------------------------------------------------------
    // INTERACTION LOGIC
    // -----------------------------------------------------------------------

    var isOpen = false;

    function openDropdown() {
      isOpen = true;
      panel.style.display = 'block';
      button.setAttribute('aria-expanded', 'true');
      // Reposition if it overflows the right edge of the viewport
      requestAnimationFrame(function () {
        var rect = panel.getBoundingClientRect();
        if (rect.right > window.innerWidth - 8) {
          panel.style.left = 'auto';
          panel.style.right = '0';
        }
      });
    }

    function closeDropdown() {
      isOpen = false;
      panel.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
      // Reset positioning for next open
      panel.style.left = '0';
      panel.style.right = 'auto';
    }

    button.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Click outside closes dropdown
    document.addEventListener('click', function (e) {
      if (isOpen && !container.contains(e.target)) {
        closeDropdown();
      }
    });

    // Escape closes dropdown
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeDropdown();
        button.focus();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // AUTO-INITIALIZATION
  // ---------------------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
