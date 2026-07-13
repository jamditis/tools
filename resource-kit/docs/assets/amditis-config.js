/**
 * @fileoverview Amditis Theme V2 - Tailwind CSS Configuration
 *
 * This file extends Tailwind CSS with the Amditis V2 design system, a light
 * editorial/archival aesthetic used throughout the Amditis Resource Kit.
 *
 * ## Design Philosophy
 *
 * The Amditis V2 theme draws inspiration from:
 * - Museum archives and institutional design
 * - Editorial print layouts with material honesty
 * - Parchment and paper textures with subtle warmth
 *
 * ## Color System
 *
 * The theme uses a warm, light-based approach:
 * - `canvas` (#ede6d4): Cream page background
 * - `ink` (#121212): Dark text color
 * - `clay` (#d6cdb7): Neutral accent for borders/dividers
 * - `mist` (#6b6b6b): Secondary/tertiary text
 * - `accent` (#3d4b40): Muted green accent
 *
 * ## Typography
 *
 * - Display: "Fraunces" - Elegant serif for headings
 * - Sans: "Plus Jakarta Sans" - Clean sans-serif for body text
 *
 * ## Animations
 *
 * Custom animations for refined interactions:
 * - `page-in`: Staggered fade-in entrance
 * - `drift`: Slow ambient light movement
 * - `ink-spread`: Blur/scale hover effect
 *
 * @module AmditisConfigV2
 * @requires Tailwind CSS CDN with Play CDN
 * @see {@link https://jamditis.github.io/tools/} Live implementation
 *
 * The static content pages no longer use this: they ship the precompiled
 * stylesheet from ../tailwind-build. If you change the palette here, mirror it in
 * resource-kit/tailwind-build/tailwind.config.js and rebuild, or the migrated
 * pages drift from the pages still on the CDN.
 */

tailwind.config = {
    theme: {
        extend: {
            /* ----------------------------------------------------------------
             * TYPOGRAPHY
             * ---------------------------------------------------------------- */

            /**
             * Custom font families for the Amditis V2 theme.
             * @property {string[]} display - Fraunces for headings and display text
             * @property {string[]} sans - Plus Jakarta Sans for body text
             */
            fontFamily: {
                display: ['Fraunces', 'serif'],
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            },

            /* ----------------------------------------------------------------
             * COLOR PALETTE
             * ---------------------------------------------------------------- */

            /**
             * Amditis V2 light editorial color palette.
             *
             * Background:
             * - canvas: Cream page background (#ede6d4)
             *
             * Text:
             * - ink: Primary dark text (#121212)
             * - mist: Secondary text (#6b6b6b)
             *
             * Accents:
             * - clay: Neutral warm accent (#d6cdb7)
             * - accent: Muted green (#3d4b40)
             */
            colors: {
                // Background
                canvas: '#ede6d4',     // Cream page background

                // Text colors
                ink: '#121212',        // Primary dark text
                mist: '#6b6b6b',       // Secondary/tertiary text

                // Accents
                clay: '#d6cdb7',       // Neutral warm accent
                accent: '#3d4b40',     // Muted green accent
            },

            /* ----------------------------------------------------------------
             * ANIMATIONS
             * ---------------------------------------------------------------- */

            /**
             * Custom animation presets.
             * - page-in: Staggered entrance animation
             * - drift: Slow ambient movement for backgrounds
             * - ink-spread: Blur/scale effect for hover states
             */
            animation: {
                'page-in': 'pageIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'drift': 'drift 25s ease-in-out infinite',
                'ink-spread': 'inkSpread 0.6s ease-out forwards',
            },

            /* ----------------------------------------------------------------
             * KEYFRAMES
             * ---------------------------------------------------------------- */

            /**
             * Custom keyframe definitions.
             */
            keyframes: {
                /**
                 * Page-in animation - fade up entrance.
                 */
                pageIn: {
                    '0%': { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                /**
                 * Drift animation - slow ambient movement.
                 */
                drift: {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '50%': { transform: 'translate(-1%, 1%)' },
                },
                /**
                 * Ink spread animation - blur/scale reveal.
                 */
                inkSpread: {
                    '0%': { filter: 'blur(10px)', opacity: '0', transform: 'scale(0.95)' },
                    '100%': { filter: 'blur(0)', opacity: '1', transform: 'scale(1)' },
                }
            }
        }
    }
}
