/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#07080d',
        ink: '#10141c',
        cyan: {
          DEFAULT: '#3ef0ff',
          dim: '#147f8c',
        },
        silver: '#d5dee8',
      },
      fontFamily: {
        display: ['Syne', 'Segoe UI', 'sans-serif'],
        sans: ['Outfit', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 42px rgba(62, 240, 255, 0.16)',
      },
      minHeight: {
        11: '2.75rem',
      },
    },
  },
  plugins: [],
}
