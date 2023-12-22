export default function getClasspath(): string[] {
	const libs = import.meta.glob("/mc/**/*.jar", {
		as: "url",
		eager: true,
	});

	const keys = Object.values(libs);
	return keys;
}
// TODO: Fix "Assets in the public directory are served at the root path."
