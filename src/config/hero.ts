import { heroui } from "@heroui/react";
// or import from theme package if you are using individual packages.
// import { heroui } from "@heroui/theme";

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: "#ec4899", // Tailwind pink-500
          foreground: "#ffffff",
        },
      },
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: "#db2777", // Tailwind pink-600
          foreground: "#ffffff",
        },
      },
    },
  },
});
