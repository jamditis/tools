// Precompiled Tailwind build for the tools.amditis.tech resource kit.
// Replaces the Play CDN (cdn.tailwindcss.com) on the static content pages, so
// production ships a static stylesheet instead of compiling in the browser.
//
// The shared theme includes the Amditis V2 design system plus namespaced tokens
// for the pages that retain distinct typography and colors.
//
// The content globs scan every docs page and its external scripts, so the shared
// stylesheet covers classes written as literals in markup or JS templates. The
// safelist below covers the finite variants built by the showcase at runtime.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../docs/**/*.html', '../docs/**/*.js'],
  safelist: [
    'hover:border-acid',
    'hover:border-ice',
    'hover:border-signal',
    'hover:border-white',
    'group-hover:text-acid',
    'group-hover:text-ice',
    'group-hover:text-signal',
    'group-hover:text-chrome',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        'vibe-sans': ['Space Grotesk', 'sans-serif'],
        'vibe-serif': ['Merriweather', 'serif'],
        'vibe-mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        canvas: '#ede6d4',
        ink: '#121212',
        mist: '#555555',
        clay: '#d6cdb7',
        accent: '#3d4b40',
        'news-bg': '#0a0a0c',
        'news-paper': '#e4e4e7',
        'news-gray': '#27272a',
        'accent-green': '#00dc82',
        'accent-blue': '#3b82f6',
        'accent-pink': '#f43f5e',
        acid: '#3d4b40',
        ice: '#3d4b40',
        signal: '#cc4444',
        chrome: '#121212',
      },
      animation: {
        'page-in': 'pageIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        drift: 'drift 25s ease-in-out infinite',
        'ink-spread': 'inkSpread 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
