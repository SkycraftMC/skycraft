import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		wasm(),
		topLevelAwait(),
		process.env.NODE_ENV === "production" &&
			viteStaticCopy({
				targets: [
					{
						src: "mc",
						dest: "",
					},
				],
			}),
	],
	build: {
		outDir: "dist", // Change this to your desired output directory
		minify: true,
	},
});
