import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import eslintPlugin from "vite-plugin-eslint2";
import prettierPlugin from "vite-plugin-prettier";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), eslintPlugin(), prettierPlugin()],
});
