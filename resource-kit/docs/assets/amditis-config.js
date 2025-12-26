/**
 * @fileoverview Amditis Theme - Tailwind CSS Configuration
 *
 * This file extends Tailwind CSS with the Amditis design system, a dark
 * retrotech/cyberpunk aesthetic used throughout the CCM AI Tools Resource Kit.
 *
 * ## Design Philosophy
 *
 * The Amditis theme draws inspiration from:
 * - CRT monitors and terminal interfaces
 * - Cyberpunk color palettes (acid green, signal red, ice blue)
 * - Minimalist dark UI with high contrast accents
 *
 * ## Color System
 *
 * The theme uses a layered darkness approach:
 * - `void` (#050505): Deepest black, used for page backgrounds
 * - `panel` (#0a0a0a): Slightly lighter, for card backgrounds
 * - `surface` (#111111): Interactive surfaces, inputs, buttons
 * - `chrome` (#e5e5e5): Primary text color
 *
 * Accent colors follow a semantic naming convention:
 * - `acid`: Primary accent (lime green) - success, highlights, CTAs
 * - `signal`: Warning/danger (red) - errors, alerts, important notices
 * - `ice`: Secondary accent (cyan) - links, info, secondary highlights
 *
 * Each accent has a "Dim" variant at 10% opacity for subtle backgrounds.
 *
 * ## Typography
 *
 * - Display/Sans: "Chakra Petch" - A techy, angular display font
 * - Mono: "Share Tech Mono" - A clean monospace for code and labels
 *
 * ## Animations
 *
 * Custom animations for interactive feedback:
 * - `pulse-fast`: Faster pulse for loading states
 * - `flash`: Binary on/off flash for attention
 * - `glitch`: Text glitch effect for hero elements
 *
 * @module AmditisConfig
 * @requires Tailwind CSS CDN with Play CDN
 * @see {@link https://jamditis.github.io/tools/} Live implementation
 *
 * @example
 * // Usage in HTML (after Tailwind CDN):
 * <script src="assets/amditis-config.js"></script>
 *
 * // Then use custom classes:
 * <div class="bg-void text-chrome">
 *   <span class="text-acid">Highlighted text</span>
 * </div>
 */

tailwind.config = {
    theme: {
        extend: {
            /* ----------------------------------------------------------------
             * TYPOGRAPHY
             * ---------------------------------------------------------------- */

            /**
             * Custom font families for the Amditis theme.
             * @property {string[]} display - Chakra Petch for headings and display text
             * @property {string[]} mono - Share Tech Mono for code and labels
             * @property {string[]} sans - Defaults to display font for consistency
             */
            fontFamily: {
                display: ['Chakra Petch', 'sans-serif'],
                mono: ['Share Tech Mono', 'monospace'],
                sans: ['Chakra Petch', 'sans-serif'],
            },

            /* ----------------------------------------------------------------
             * COLOR PALETTE
             * ---------------------------------------------------------------- */

            /**
             * Amditis dark theme color palette.
             *
             * Background layers (darkest to lightest):
             * - void: Page background (#050505)
             * - panel: Card/container backgrounds (#0a0a0a)
             * - surface: Interactive elements (#111111)
             *
             * Text:
             * - chrome: Primary text (#e5e5e5)
             *
             * Accents:
             * - acid/acidDim: Primary lime green accent
             * - signal/signalDim: Warning red accent
             * - ice/iceDim: Info cyan accent
             */
            colors: {
                // Background layers
                void: '#050505',      // Deepest black - page background
                panel: '#0a0a0a',     // Card backgrounds
                surface: '#111111',   // Interactive surfaces

                // Text
                chrome: '#e5e5e5',    // Primary text color

                // Primary accent: Acid green (success, highlights, CTAs)
                acid: '#ccff00',
                acidDim: 'rgba(204, 255, 0, 0.1)',

                // Warning accent: Signal red (errors, alerts)
                signal: '#ff2a2a',
                signalDim: 'rgba(255, 42, 42, 0.1)',

                // Secondary accent: Ice blue (links, info)
                ice: '#00f0ff',
                iceDim: 'rgba(0, 240, 255, 0.1)',
            },

            /* ----------------------------------------------------------------
             * BACKGROUND PATTERNS
             * ---------------------------------------------------------------- */

            /**
             * Custom background patterns for visual texture.
             */
            backgroundImage: {
                // Grid pattern for subtle texture (1px lines at #222)
                'grid-pattern': "linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)",
            },

            /* ----------------------------------------------------------------
             * ANIMATIONS
             * ---------------------------------------------------------------- */

            /**
             * Custom animation presets.
             * - pulse-fast: 1s pulse for loading indicators
             * - flash: Binary flash for attention-grabbing elements
             * - glitch: Text distortion effect for hero elements
             */
            animation: {
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'flash': 'flash 0.5s steps(1) infinite',
                'glitch': 'glitch-anim 5s infinite linear alternate-reverse',
            },

            /* ----------------------------------------------------------------
             * KEYFRAMES
             * ---------------------------------------------------------------- */

            /**
             * Custom keyframe definitions.
             */
            keyframes: {
                /**
                 * Flash animation - binary on/off at 50% threshold.
                 * Creates a blinking effect for cursor or alert indicators.
                 */
                flash: {
                    '0%, 50%': { opacity: '1' },
                    '51%, 100%': { opacity: '0' },
                }
            }
        }
    }
}
