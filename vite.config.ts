import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import eslintPlugin from "@nabla/vite-plugin-eslint";

export default defineConfig({
	plugins: [wasm(), eslintPlugin(), topLevelAwait()],
	build: {
		outDir: "dist", // Change this to your desired output directory
		minify: true,
	},
});
