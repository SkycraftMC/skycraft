import getClasspath from "./classpath";
import {
	mainClass,
	id as mcVersion,
	assetIndex,
	minecraftArguments,
	javaVersion,
} from "../mc/launcher_meta.json";

export async function initCheerpj() {
	let classPath = getClasspath().join(":");
	console.debug("Classpath:", classPath);

	if (javaVersion.majorVersion != 8) {
		throw new Error(
			"Unsupported Java version: CheerpJ only supports Java 8",
		);
	}

	await cheerpjInit({
		javaProperties: ["java.library.path=/app/nativeImpls"],
		clipboardMode: "permission",
	});
	cheerpjCreateDisplay(0, 48, document.getElementById("container")!);

	console.table({
		mainClass,
		mcVersion,
		minecraftArguments,
	});

	const exitCode = await cheerpjRunMain(
		mainClass,
		classPath,
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
}
