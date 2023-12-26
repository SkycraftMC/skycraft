import "./style.css";

import getClasspath from "./classpath";
import downloadJars from "./downloadJars";
import {
	mainClass,
	id as mcVersion,
	minecraftArguments,
	javaVersion,
} from "../mc/launcher_meta.json";
import { Java_org_lwjgl_DefaultSysImplementation_getPointerSize } from "./nativeImpls/lwjgl/main";
import { NO_TREE_SHAKING } from "./nativeImpls/jawt/main"; // FIXME: Remove this line when tree shaking is fixed

// CheerpJ only supports Java 8
if (javaVersion.majorVersion != 8) {
	throw new Error("Unsupported Java version: CheerpJ only supports Java 8");
}

const classpath = getClasspath("app");
console.debug(classpath);

Java_org_lwjgl_DefaultSysImplementation_getPointerSize();
NO_TREE_SHAKING();

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
await downloadJars();

// And finally, run the main class
const exitCode = await cheerpjRunMain(
	mainClass,
	getClasspath("str").join(":"),
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
