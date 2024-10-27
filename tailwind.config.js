module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/globals.css"
  ],
  theme: {
    extend: {
      backgroundImage: {
        gradient:
          "linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)"
      },
      animation: {
        opacity: "opacity 0.25s ease-in-out",
        appearFromRight: "appearFromRight 300ms ease-in-out",
        wiggle: "wiggle 1.5s ease-in-out infinite",
        popup: "popup 0.25s ease-in-out",
        shimmer: "shimmer 3s ease-out infinite alternate"
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px"
      },
      keyframes: {
        opacity: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        appearFromRight: {
          "0%": { opacity: 0.3, transform: "translate(15%, 0px);" },
          "100%": { opacity: 1, transform: "translate(0);" }
        },
        wiggle: {
          "0%, 20%, 80%, 100%": {
            transform: "rotate(0deg)"
          },
          "30%, 60%": {
            transform: "rotate(-2deg)"
          },
          "40%, 70%": {
            transform: "rotate(2deg)"
          },
          "45%": {
            transform: "rotate(-4deg)"
          },
          "55%": {
            transform: "rotate(4deg)"
          }
        },
        popup: {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 }
        },
        shimmer: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#8bbcdc", // Muted blue for primary
          "primary-content": "#ffffff",
          background: "#1e1e2e", // Dark but not fully black
          "base-100": "#2e2e3e", // Softer dark background
          "base-content": "#a9b1d6", // Light text color
          success: "#61d4b3", // Muted teal for success
          error: "#ff6b6b", // Soft red for error
          warning: "#f3a683", // Muted orange for warning
          info: "#45aaf2", // Softer light blue for info
          neutral: "#23232e" // Neutral dark
        }
      }
    ]
  }
};
