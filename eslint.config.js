import eslint from "@eslint/js";
import eslintConfigPrettier from "@vue/eslint-config-prettier/skip-formatting";
import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  eslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  {
    name: "app/vue-conventions",
    files: ["**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/require-prop-types": "off",
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/attribute-hyphenation": ["error", "always"],
      "vue/v-on-event-hyphenation": ["error", "always"],
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ],
    },
  },
  eslintConfigPrettier,
);