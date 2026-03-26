/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        raf: {
          blue: '#1e3a5f',
          lightblue: '#2d5f8a',
          gold: '#c9a84c',
          green: '#2d7a4f',
        }
      }
    },
  },
  plugins: [],
}
