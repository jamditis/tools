/**
 * @fileoverview Ask AI dropdown component (cream theme)
 *
 * Self-contained vanilla JS component that injects an "Ask an AI about this"
 * dropdown button into every page. Provides quick links to Claude, ChatGPT,
 * and Gemini with a page-aware prompt, plus a markdown download option using
 * Turndown.js.
 *
 * Usage: Include this script on any page. It auto-initializes on
 * DOMContentLoaded and injects itself after the last <header> element.
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

  function getPrompt() {
    var title = getPageTitle();
    var hostname = window.location.hostname;
    var url = window.location.href;
    return 'I\'m reading about "' + title + '" on ' + hostname + '.\n\nURL: ' + url + '\n\nCan you explain the key concepts and help me apply them?';
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

  var turndownLoaded = false;

  function loadTurndown(callback) {
    if (turndownLoaded && typeof TurndownService !== 'undefined') {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/turndown/dist/turndown.js';
    script.onload = function () {
      turndownLoaded = true;
      callback();
    };
    script.onerror = function () {
      alert('Failed to load markdown converter. Please try again.');
    };
    document.head.appendChild(script);
  }

  function downloadMarkdown() {
    loadTurndown(function () {
      var mainEl = document.querySelector('main');
      var html = mainEl ? mainEl.innerHTML : document.body.innerHTML;
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
      action: function () {
        window.open('https://claude.ai/new?q=' + encodeURIComponent(getPrompt()), '_blank');
      }
    },
    {
      label: 'Ask ChatGPT',
      icon: ICONS.chatBubble,
      action: function () {
        window.open('https://chatgpt.com/?q=' + encodeURIComponent(getPrompt()), '_blank');
      }
    },
    {
      label: 'Ask Gemini',
      icon: ICONS.diamond,
      action: function () {
        window.open('https://gemini.google.com/app?q=' + encodeURIComponent(getPrompt()), '_blank');
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
    // Find the last <header> on the page
    var headers = document.querySelectorAll('header');
    if (!headers.length) return;
    var lastHeader = headers[headers.length - 1];

    // Outer wrapper (max-width container with auto margins)
    var wrapper = document.createElement('div');
    setStyle(wrapper, {
      maxWidth: '64rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      paddingTop: '0.75rem',
      paddingBottom: '0',
      position: 'relative',
      zIndex: '40',
      fontFamily: THEME.fontFamily
    });

    // Container for the button + dropdown (inline-block so it sizes to content)
    var container = document.createElement('div');
    setStyle(container, {
      position: 'relative',
      display: 'inline-block'
    });

    // Trigger button
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-haspopup', 'true');

    var buttonLabel = document.createTextNode('Ask an AI about this ');
    button.appendChild(buttonLabel);
    // Chevron icon (static SVG constant)
    var chevronSpan = document.createElement('span');
    chevronSpan.style.display = 'inline-flex';
    chevronSpan.innerHTML = ICONS.chevronDown;
    button.appendChild(chevronSpan);

    setStyle(button, {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: THEME.buttonBg,
      color: THEME.buttonColor,
      border: THEME.buttonBorder,
      borderRadius: THEME.buttonRadius,
      padding: '0.5rem 1rem',
      fontSize: '0.8125rem',
      fontWeight: '600',
      fontFamily: THEME.fontFamily,
      cursor: 'pointer',
      lineHeight: '1.4',
      whiteSpace: 'nowrap',
      transition: 'opacity 0.15s ease'
    });

    button.addEventListener('mouseenter', function () { button.style.opacity = '0.85'; });
    button.addEventListener('mouseleave', function () { button.style.opacity = '1'; });

    // Dropdown panel
    var panel = document.createElement('div');
    panel.setAttribute('role', 'menu');
    setStyle(panel, {
      position: 'absolute',
      top: 'calc(100% + 0.375rem)',
      left: '0',
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
      var menuItem = document.createElement('button');
      menuItem.type = 'button';
      menuItem.setAttribute('role', 'menuitem');

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
        transition: 'background 0.12s ease'
      });

      menuItem.addEventListener('mouseenter', function () {
        menuItem.style.background = THEME.itemHoverBg;
      });
      menuItem.addEventListener('mouseleave', function () {
        menuItem.style.background = 'transparent';
      });

      menuItem.addEventListener('click', function () {
        closeDropdown();
        item.action();
      });

      panel.appendChild(menuItem);
    });

    container.appendChild(button);
    container.appendChild(panel);
    wrapper.appendChild(container);

    // Inject after the last header
    if (lastHeader.nextSibling) {
      lastHeader.parentNode.insertBefore(wrapper, lastHeader.nextSibling);
    } else {
      lastHeader.parentNode.appendChild(wrapper);
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
