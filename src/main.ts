import "./style.css";

import getClasspath from "./classpath";
import {
	mainClass,
	id as mcVersion,
	minecraftArguments,
	javaVersion,
} from "../mc/launcher_meta.json";

// TODO: get rid of the IIFE
(async () => {
	if (javaVersion.majorVersion != 8) {
		throw new Error(
			"Unsupported Java version: CheerpJ only supports Java 8",
		);
	}

	let classpath = getClasspath();
	console.debug(classpath);

	await cheerpjInit({
		javaProperties: ["java.library.path=/app/nativeImpls"],
		clipboardMode: "permission",
	});
	cheerpjCreateDisplay(-1, -1, document.getElementById("container")!);

	console.table({
		mainClass,
		mcVersion,
		minecraftArguments,
	});

	// Download the JARs
	await Promise.all(
		classpath.map(async (filePath) => {
			const response = await fetch(filePath);
			if (!response.ok) throw new Error(`Failed to download ${filePath}`);
			const arrayBuffer = await response.arrayBuffer();
			const data = new Uint8Array(arrayBuffer);
			cheerpOSAddStringFile(filePath.replace("/mc/", "/str/mc/"), data);
		}),
	);

	// And finally, run the main class
	const exitCode = await cheerpjRunMain(
		mainClass,
		classpath.join(":").replaceAll("/mc/", "/str/mc/"),
		"--accessToken",
		"testtoken",
		"--version",
		mcVersion,
	);

	if (exitCode !== 0) {
		// TODO: add the Discord link
		alert(
			`Oops, Minecraft crashed!\n\nExit code: ${exitCode}\n\nPlease report this to the devs: @justhypex on Discord`,
		);
		throw new Error(`Minecraft exited with code ${exitCode}`);
	}
})();
