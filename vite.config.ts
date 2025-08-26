import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import eslintPlugin from "vite-plugin-eslint2";
import prettierPlugin from "vite-plugin-prettier";
import tsconfigPaths from "vite-tsconfig-paths";

import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    eslintPlugin(),
    prettierPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
