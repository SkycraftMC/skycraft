import "./style.css";

import getClasspath from "./classpath";
import downloadJars from "./downloadJars";
import {
	mainClass,
	id as mcVersion,
	minecraftArguments,
} from "../mc/launcher_meta.json";
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

const classpath = getClasspath();
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

// Download the JARs into the /str/ filesystem
await downloadJars(classpath);

// And finally, run the main class
const exitCode = await cheerpjRunMain(
	mainClass,
	classpath.join(":").replaceAll("/mc/", "/str/mc/"),
	"--accessToken",
	"testtoken",
	"--version",
	mcVersion,
	"-assetsDir",
	"/app/mc/assets/virtual/legacy/",
);

if (exitCode !== 0) {
	// TODO: add the Discord link
	alert(
		`Oops, Minecraft crashed!\n\nExit code: ${exitCode}\n\nPlease report this to the devs: @justhypex on Discord`,
	);
	throw new Error(`Minecraft exited with code ${exitCode}`);
}
