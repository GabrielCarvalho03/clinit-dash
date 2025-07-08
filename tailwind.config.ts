import tailwindcss from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Azul padrão
        secondary: "#6366f1",
        neutral: {
          100: "#f5f5f5",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [require("tailwind-scrollbar")],

  corePlugins: {
    preflight: true, // Se você estiver usando algum reset
  },
};
