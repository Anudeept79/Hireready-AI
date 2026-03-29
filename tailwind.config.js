/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:     '#0A0A0A',
          card:   '#141414',
          card2:  '#1A1A1A',
          border: '#2A2A2A',
          cyan:   '#00C8FF',
          green:  '#00FF88',
          white:  '#FFFFFF',
          muted:  '#888888',
          faint:  '#444444',
          dark:   '#050505',
          glow:   '#00C8FF30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
