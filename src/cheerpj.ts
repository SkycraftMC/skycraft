import getLibraries from "./libraries";
import {
	mainClass,
	version,
	minecraftArguments,
} from "../public/mc/index.json";

export async function initCheerpj() {
	let classPath = getLibraries().join(":");

	await cheerpjInit({
		javaProperties: ["java.library.path=natives"],
	});
	cheerpjCreateDisplay(-1, -1, document.getElementById("container"));

	console.table({
		mainClass,
		version,
	});

	const exitCode = await cheerpjRunMain(
		mainClass,
		classPath,
		minecraftArguments
			.replaceAll("${auth_player_name}", "testing!")
			.replaceAll("${version_name}", version)
			.replaceAll("${assetIndex}", "1.12")
			.replaceAll("${auth_player_name}", "testing!")
			.replaceAll("${accessToken}", "test"),
		"--demo",
	);
}
