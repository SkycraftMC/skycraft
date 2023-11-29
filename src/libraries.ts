export default function getLibraries(): string[] {
	const libs = import.meta.glob("/public/mc/libraries/**/*.jar", {
		as: "url",
		eager: true,
	});

	let keys = Object.keys(libs);
	return keys.map((libPath) => libPath.replace("/public/", "/app/"));
}
// TODO: Fix "Assets in the public directory are served at the root path."
