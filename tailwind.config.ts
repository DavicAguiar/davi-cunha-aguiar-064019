import type { Config } from 'tailwindcss'

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          dark: '#047857',
        },
        accent: {
          DEFAULT: '#7c3aed',
        },
        neutral: {
          text: '#334155',
          border: '#cbd5e1',
        }
      },
      backgroundImage: {
        'soft-gradient': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }
    },
  },
  plugins: [],
} satisfies Config
