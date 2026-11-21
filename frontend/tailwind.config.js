/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1220',
        neon: {
          blue: '#2563EB',
          cyan: '#06B6D4',
          teal: '#14B8A6'
        }
      }
    },
  },
  plugins: [],
}
