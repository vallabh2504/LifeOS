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
        primary: "#1E1E1E",    // Midnight Black (Background)
        secondary: "#2D2D2D",  // Onyx (Card surfaces)
        accent: "#00E5FF",     // Electric Cyan (CTAs/Active)
        muted: "#B0B0B0",      // Slate Gray (Secondary text)
      },
    },
  },
  plugins: [],
}
