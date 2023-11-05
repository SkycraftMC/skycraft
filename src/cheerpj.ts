import getLibraries from "./libraries";
import { mainClass } from "../public/mc/index.json";

export async function initCheerpj() {
	let classPath = getLibraries().join(":");

	await cheerpjInit({
		javaProperties: ["java.library.path=natives"],
	});
	cheerpjCreateDisplay(-1, -1, document.getElementById("container"));

	console.table({
		mainClass,
	});

	const exitCode = await cheerpjRunMain(
		mainClass,
		classPath,
		"--demo",
		"boing",
		"1.12.2",
	);
}
