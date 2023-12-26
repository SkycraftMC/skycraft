import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";

export default defineConfig({
	plugins: [wasm(), topLevelAwait()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes(path.join("src", "nativeImpls", "lwjgl"))) {
						return "lwjgl";
					} else if (
						id.includes(path.join("src", "nativeImpls", "jawt"))
					) {
						return "jawt";
					}
				},
				chunkFileNames: "nativeImpls/[name].js", // Define chunk file naming pattern
				entryFileNames: "[name].js", // Add this line
			},
		},
		outDir: "dist",
	},
});
