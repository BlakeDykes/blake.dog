import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import sassDts from "vite-plugin-sass-dts";
import { NodePackageImporter, type FileImporter } from "sass-embedded";
import { pathToFileURL } from "url";

const stylesImporter: FileImporter<"async"> = {
  findFileUrl(url) {
    if (url !== "@/styles") {
      return null;
    }
    return pathToFileURL(path.resolve(__dirname, "./src/assets/styles"));
  },
};

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    modules: {
      exportGlobals: true,
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles" as common;\n`,
        importers: [new NodePackageImporter(), stylesImporter],
      },
    },
  },

  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    sassDts({
      enabledMode: ["development", "production"],
      global: {
        generate: true,
        outputFilePath: path.resolve(__dirname, "./src/@types/style.d.ts"),
      },
      prettierFilePath: path.resolve("./.prettierrc"),
      esmExport: true,
    }),
  ],
});
