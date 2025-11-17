import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { readFileSync } from "fs";

const packageJson = JSON.parse(
  readFileSync("./package.json", "utf-8")
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: "html-transform",
      transformIndexHtml(html) {
        return html.replace(
          /%APP_VERSION%/g,
          packageJson.version
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
