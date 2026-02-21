import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  preview: {
    host: true,
    port: 3000,
    allowedHosts: ["new.ecofy.dk"],
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Fix @tiptap/pm broken exports (missing "." specifier in package.json)
      "@tiptap/pm/state": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/state/index.js"),
      "@tiptap/pm/view": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/view/index.js"),
      "@tiptap/pm/model": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/model/index.js"),
      "@tiptap/pm/transform": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/transform/index.js"),
      "@tiptap/pm/commands": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/commands/index.js"),
      "@tiptap/pm/schema-list": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/schema-list/index.js"),
      "@tiptap/pm/dropcursor": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/dropcursor/index.js"),
      "@tiptap/pm/gapcursor": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/gapcursor/index.js"),
      "@tiptap/pm/history": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/history/index.js"),
      "@tiptap/pm/inputrules": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/inputrules/index.js"),
      "@tiptap/pm/keymap": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/keymap/index.js"),
      "@tiptap/pm/tables": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/tables/index.js"),
      "@tiptap/pm/changeset": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/changeset/index.js"),
      "@tiptap/pm/collab": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/collab/index.js"),
      "@tiptap/pm/markdown": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/markdown/index.js"),
      "@tiptap/pm/menu": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/menu/index.js"),
      "@tiptap/pm/schema-basic": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/schema-basic/index.js"),
      "@tiptap/pm/trailing-node": path.resolve(__dirname, "node_modules/@tiptap/pm/dist/trailing-node/index.js"),
    },
  },
}));
