import getClasspath from "./classpath";

export default async function downloadJars() {
	const classpath = getClasspath();
	await Promise.all(
		classpath.map(async (filePath) => {
			const response = await fetch(filePath);
			if (!response.ok) throw new Error(`Failed to download ${filePath}`);
			const arrayBuffer = await response.arrayBuffer();
			const data = new Uint8Array(arrayBuffer);
			cheerpOSAddStringFile(filePath.replace("/mc/", "/str/mc/"), data);
		}),
	);
}
