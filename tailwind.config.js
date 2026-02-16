/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#050505",    // Deeper Black
        secondary: "#121212",  // Darker Grey
        accent: "#00E5FF",     // Electric Cyan
        purple: {
          500: "#7000FF",      // Cyber Purple
        },
        muted: "#888888",      // Dimmer Gray
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
