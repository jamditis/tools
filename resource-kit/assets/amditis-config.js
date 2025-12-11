tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                display: ['Chakra Petch', 'sans-serif'],
                mono: ['Share Tech Mono', 'monospace'],
                sans: ['Chakra Petch', 'sans-serif'], // Default sans to display font for consistency
            },
            colors: {
                void: '#050505',
                panel: '#0a0a0a',
                surface: '#111111',
                chrome: '#e5e5e5',
                acid: '#ccff00',
                acidDim: 'rgba(204, 255, 0, 0.1)',
                signal: '#ff2a2a', 
                signalDim: 'rgba(255, 42, 42, 0.1)',
                ice: '#00f0ff',
                iceDim: 'rgba(0, 240, 255, 0.1)',
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)",
            },
            animation: {
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'flash': 'flash 0.5s steps(1) infinite',
                'glitch': 'glitch-anim 5s infinite linear alternate-reverse',
            },
            keyframes: {
                flash: {
                    '0%, 50%': { opacity: '1' },
                    '51%, 100%': { opacity: '0' },
                }
            }
        }
    }
}