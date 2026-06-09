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
    return pathToFileURL(path.resolve(__dirname, "./src/styles/_index.scss"));
  },
};

const stylesPath = path
  .resolve(__dirname, "./src/styles/_index.scss")
  .replaceAll("\\", "/");

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
        additionalData: `@use "${stylesPath}" as *;\n`,
        importers: [new NodePackageImporter(), stylesImporter],
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
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
        outputFilePath: path.resolve(__dirname, "./src/types/style.d.ts"),
      },
      prettierFilePath: path.resolve(__dirname, "./.prettierrc"),
      esmExport: true,
      legacyFileFormat: false,
    }),
  ],
});
