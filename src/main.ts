import "./style.css";

import getClasspath from "./classpath";
import {
	mainClass,
	id as mcVersion,
	minecraftArguments,
} from "../mc/launcher_meta.json";
import { stripIndent } from "common-tags";
// Required because we don't know whether `javaVersion` is there or not
import * as launcherMeta from "../mc/launcher_meta.json";

// CheerpJ only supports Java 8
const javaVersion = launcherMeta.javaVersion;
if (javaVersion) {
	if (javaVersion.majorVersion != 8) {
		throw new Error(
			"Unsupported Java version: CheerpJ only supports Java 8",
		);
	}
} else {
	console.warn(
		"The launcher metadata doesn't contain a Java version - it may not work (that said, it most likely will due to its age)",
	);
}

// Set up CheerpJ
await cheerpjInit({
	javaProperties: ["java.library.path=/app/nativeImpls"],
	clipboardMode: "permission",
});
cheerpjCreateDisplay(0, 0, document.getElementById("container")!);

// Print some debug info
console.table({
	mainClass,
	mcVersion,
	minecraftArguments,
});
console.debug("Classpath:", getClasspath());
console.debug("/str/ classpath:", getClasspath("str"));

// Download the JARs into the /str/ filesystem
const downloadStart = performance.now();
const downloadTasks = getClasspath().map((filePath) =>
	(async function () {
		const response = await fetch(filePath);
		if (!response.ok) throw new Error(`Failed to download ${filePath}`);
		const arrayBuffer = await response.arrayBuffer();
		const data = new Uint8Array(arrayBuffer);
		const newFilePath = filePath
			.replace("/mc/", "/str/mc/")
			.replace("/assets/", "/str/assets/"); // TODO: remove jank
		console.debug(`Downloaded ${filePath} to ${newFilePath}`);
		cheerpOSAddStringFile(newFilePath, data);
	})(),
);
await Promise.allSettled(downloadTasks);
console.log(
	`Downloaded ${getClasspath().length} JARs in ${(
		(performance.now() - downloadStart) /
		1000
	).toFixed(3)}ms`,
);

// And finally, run the main class
const exitCode = await cheerpjRunMain(
	mainClass,
	getClasspath("str").join(":"),
	"--accessToken",
	"testtoken",
	"--version",
	mcVersion,
	"-assetsDir",
	"/app/mc/assets/virtual/legacy/",
);

// If the exit code is not 0, then the game crashed
if (exitCode !== 0) {
	// TODO: add the Discord link
	alert(
		stripIndent`
		Oops, Minecraft crashed!

		Exit code: ${exitCode}

		Please report this to @justhypex on Discord.
		`,
	);
	throw new Error(`Minecraft exited with code ${exitCode}`);
}
