export default function getClasspath(rootFolder?: "app" | "str"): string[] {
	const libs = import.meta.glob("/mc/**/*.jar", {
		as: "url",
		eager: true,
	});

	const unmappedPaths = Object.values(libs);

	if (rootFolder) {
		return unmappedPaths.map((path) =>
			path.replace("/mc/", `/${rootFolder}/mc/`),
		);
	}
	return unmappedPaths;
}
// TODO: Fix "Assets in the public directory are served at the root path."
