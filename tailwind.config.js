/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tessera: {
          bg: '#06070a',
          surface: '#0c0e15',
          surfaceHover: '#131622',
          card: '#10131d',
          cardElevated: '#151927',
          border: '#1a1f2e',
          borderHover: '#2a324b',
          textMuted: '#6b768e',
          textSecondary: '#9aa5be',
          textPrimary: '#f2f5fc',
          accent: '#ff4800', // Meteora Sol Ember
          accentHover: '#ff6224',
          accentMuted: 'rgba(255, 72, 0, 0.12)',
          accentBorder: 'rgba(255, 72, 0, 0.35)',
          cyan: '#00e5d4',
          cyanMuted: 'rgba(0, 229, 212, 0.12)',
          green: '#10b981',
          greenMuted: 'rgba(16, 185, 129, 0.12)',
          amber: '#f59e0b',
          amberMuted: 'rgba(245, 158, 11, 0.12)',
          purple: '#9d4edd',
          purpleMuted: 'rgba(157, 78, 221, 0.12)',
          red: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Fira Code', 'Roboto Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(255, 72, 0, 0.08) 1px, transparent 1px)",
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(255, 72, 0, 0.15), transparent 70%)',
        'radial-cyan': 'radial-gradient(circle at 100% 100%, rgba(0, 229, 212, 0.12), transparent 70%)',
      },
      boxShadow: {
        glow: '0 0 28px -4px rgba(255, 72, 0, 0.35)',
        glowLg: '0 0 50px -10px rgba(255, 72, 0, 0.45)',
        glowCyan: '0 0 28px -4px rgba(0, 229, 212, 0.3)',
        glowGreen: '0 0 28px -4px rgba(16, 185, 129, 0.3)',
        glowPurple: '0 0 28px -4px rgba(157, 78, 221, 0.3)',
        card: '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
