import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
	plugins: [wasm(), topLevelAwait()],
	build: {
		outDir: "dist", // Change this to your desired output directory
		minify: true,
	},
});
