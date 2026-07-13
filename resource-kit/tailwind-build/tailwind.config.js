// Precompiled Tailwind build for the tools.amditis.tech resource kit.
// Replaces the Play CDN (cdn.tailwindcss.com) on the static content pages, so
// production ships a static stylesheet instead of compiling in the browser.
//
// The theme.extend below mirrors the shared runtime config the pages loaded from
// docs/assets/amditis-config.js (the Amditis V2 design system: canvas/ink/accent
// palette, Fraunces/Plus Jakarta Sans fonts, the drift/page-in animations). Keep
// the two in sync until every page is migrated and the runtime config is retired.
//
// The content globs scan every docs page and its external scripts, so the shared
// stylesheet covers classes written as literals in markup or JS templates. Classes
// built by string interpolation (bg-${color}) are not captured, so pages whose JS
// interpolates class names stay on the CDN. See README.md for the migration status.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../docs/**/*.html', '../docs/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        canvas: '#ede6d4',
        ink: '#121212',
        mist: '#6b6b6b',
        clay: '#d6cdb7',
        accent: '#3d4b40',
      },
      animation: {
        'page-in': 'pageIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        drift: 'drift 25s ease-in-out infinite',
        'ink-spread': 'inkSpread 0.6s ease-out forwards',
      },
      keyframes: {
        pageIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-1%, 1%)' },
        },
        inkSpread: {
          '0%': { filter: 'blur(10px)', opacity: '0', transform: 'scale(0.95)' },
          '100%': { filter: 'blur(0)', opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
