import getLibraries from "./libraries";
import {
	mainClass,
	id as mcVersion,
	assetIndex,
	minecraftArguments,
	javaVersion,
} from "../mc/launcher_meta.json";

export async function initCheerpj() {
	let classPath = getLibraries().join(":");
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
	cheerpjCreateDisplay(-1, -1, document.getElementById("container"));

	console.table({
		mainClass,
		mcVersion,
	});

	const exitCode = await cheerpjRunMain(
		mainClass,
		classPath,
		minecraftArguments
			.replaceAll("${auth_player_name}", "testing!")
			.replaceAll("${version_name}", mcVersion)
			.replaceAll("${assetIndex}", assetIndex.id)
			.replaceAll("${auth_player_name}", "testing!")
			.replaceAll("${accessToken}", "test"),
		"--demo",
	);
}
