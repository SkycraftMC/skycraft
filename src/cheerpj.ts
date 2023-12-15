import getLibraries from "./libraries";
import {
	mainClass,
	id as mcVersion,
	assetIndex,
	minecraftArguments,
	javaVersion,
} from "../public/mc/launcher_meta.json";

export async function initCheerpj() {
	let classPath = getLibraries().join(":");

	if (javaVersion.majorVersion != 8) {
		throw new Error(
			"Unsupported Java version: CheerpJ only supports Java 8",
		);
	}

	await cheerpjInit({
		javaProperties: ["java.library.path=natives"],
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
