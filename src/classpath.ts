export default function getClasspath(): string[] {
	const libs = import.meta.glob("/mc/**/*.jar", {
		as: "url",
		eager: true,
	});

	let keys = Object.keys(libs);
	return keys.map((libPath) => libPath.replace("/mc/", "/app/mc/"));
}
// TODO: Fix "Assets in the public directory are served at the root path."
