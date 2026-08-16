/**
 * @fileoverview Amditis V3 day/night paper toggle.
 *
 * Renders the theme control and persists the reader's choice. The stored value
 * is read by a small inline script in each page's <head> so the correct palette
 * is applied before first paint; this file only handles the control itself.
 *
 * ## Contract
 *
 * - Storage key `amditis-theme`, values `"light"` or `"dark"`.
 * - No stored value means "follow the system", and the CSS handles that through
 *   `prefers-color-scheme`. Nothing is written until the reader chooses.
 * - The chosen theme is mirrored onto `<html data-theme>`.
 *
 * The pattern follows the glossary pages' `glossary-beginner-mode` precedent:
 * localStorage access is wrapped so a blocked-storage browser degrades to a
 * working, non-persisting toggle rather than a broken page.
 *
 * ## Placement
 *
 * The control is rendered into every `[data-theme-toggle-slot]` element on the
 * page. Pages with no slot get a small fixed control instead, so no page is
 * left without a way to switch.
 *
 * @module AmditisThemeToggle
 * @see assets/amditis-v3.css — `.theme-toggle`
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'amditis-theme';
    var root = document.documentElement;

    /**
     * Reads the stored preference.
     * @returns {string|null} `"light"`, `"dark"`, or null when unset/unavailable.
     */
    function stored() {
        try {
            var value = window.localStorage.getItem(STORAGE_KEY);
            return value === 'light' || value === 'dark' ? value : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Persists the preference, tolerating browsers that block storage.
     * @param {string} value `"light"` or `"dark"`.
     */
    function store(value) {
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch (error) {
            /* Private-mode and blocked-storage browsers keep a session-only toggle. */
        }
    }

    /**
     * Resolves the theme currently on screen, whether chosen or inherited.
     * @returns {string} `"light"` or `"dark"`.
     */
    function current() {
        var choice = root.getAttribute('data-theme');
        if (choice === 'light' || choice === 'dark') {
            return choice;
        }
        return window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    var SUN =
        '<svg class="theme-toggle__day" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.6" stroke-linecap="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2' +
        'M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"/></svg>';

    var MOON =
        '<svg class="theme-toggle__night" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>';

    var buttons = [];

    /**
     * Applies a theme and updates every rendered control.
     * @param {string} theme `"light"` or `"dark"`.
     */
    function apply(theme) {
        root.setAttribute('data-theme', theme);
        for (var i = 0; i < buttons.length; i += 1) {
            buttons[i].setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to day paper' : 'Switch to night paper'
            );
            buttons[i].setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
    }

    /**
     * Builds one toggle button.
     * @param {boolean} floating Whether this is the fixed fallback control.
     * @returns {HTMLButtonElement}
     */
    function build(floating) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'theme-toggle' + (floating ? ' theme-toggle--floating' : '');
        button.innerHTML = SUN + MOON;
        button.addEventListener('click', function () {
            var next = current() === 'dark' ? 'light' : 'dark';
            /* Repaint the swap instantly rather than cross-fading every colour. */
            root.classList.add('theme-switching');
            apply(next);
            store(next);
            window.setTimeout(function () {
                root.classList.remove('theme-switching');
            }, 60);
        });
        return button;
    }

    function init() {
        var slots = document.querySelectorAll('[data-theme-toggle-slot]');

        if (slots.length) {
            for (var i = 0; i < slots.length; i += 1) {
                var button = build(false);
                if (slots[i].hasAttribute('data-theme-toggle-on-slab')) {
                    button.classList.add('theme-toggle--on-slab');
                }
                buttons.push(button);
                slots[i].appendChild(button);
            }
        } else {
            var floating = build(true);
            buttons.push(floating);
            document.body.appendChild(floating);
        }

        apply(current());

        /* Follow the system while the reader has expressed no preference. */
        if (!stored() && window.matchMedia) {
            var query = window.matchMedia('(prefers-color-scheme: dark)');
            var onChange = function (event) {
                if (!stored()) {
                    root.removeAttribute('data-theme');
                    apply(event.matches ? 'dark' : 'light');
                }
            };
            if (query.addEventListener) {
                query.addEventListener('change', onChange);
            } else if (query.addListener) {
                query.addListener(onChange);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
