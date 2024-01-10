export default function getClasspath(filesystem?: "app" | "str"): string[] {
	const libs = import.meta.glob("/mc/**/*.jar", {
		as: "url",
		eager: true,
	});

	let keys = Object.values(libs);
	if (filesystem) {
		keys = keys.map((key) => key.replace("/mc/", `/${filesystem}/mc/`));
	}
	return keys;
}
// TODO: Fix "Assets in the public directory are served at the root path."
