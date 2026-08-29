/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Neutral paper, near-black ink, charcoal accent. The `cream`/`sand`/
      // `clay` names are historical — the values are neutral greys, no brown.
      colors: {
        cream: {
          50: "#f6f6f5",
          100: "#f1f1f0",
          200: "#e8e8e7",
          300: "#dcdcdb",
        },
        sand: "#e6e6e5",
        clay: "#d2d3d2",
        // No mid-grey type: the whole ramp stays in near-black/charcoal so
        // secondary copy reads as dark, never washed out.
        ink: {
          DEFAULT: "#17191a",
          soft: "#23262a",
          muted: "#2f3336",
          faint: "#4a4f52",
        },
        // Driven by CSS vars (see globals.css) so the accent ramp can be
        // re-toned in one place. `gold` is the historical token name.
        gold: {
          DEFAULT: "rgb(var(--gold) / <alpha-value>)",
          soft: "rgb(var(--gold-soft) / <alpha-value>)",
          dark: "rgb(var(--gold-dark) / <alpha-value>)",
        },
        espresso: {
          DEFAULT: "#0d0d0d",
          dark: "#000000",
        },
        coal: {
          DEFAULT: "#0d0d0d",
          deep: "#080808",
        },
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        condensed: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.22em",
        wide2: "0.32em",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        sweep: {
          "0%": { transform: "translateX(-120%) skewX(-12deg)", opacity: "0" },
          "20%": { opacity: "0.5" },
          "100%": { transform: "translateX(220%) skewX(-12deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 54%": { opacity: "1" },
          "55%, 100%": { opacity: "0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        sweep: "sweep 7s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        marquee: "marquee 36s linear infinite",
        blink: "blink 1.1s steps(1, end) infinite",
      },
    },
  },
  plugins: [],
};
