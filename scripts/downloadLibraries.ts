import { createWriteStream } from "fs";
import { sync as syncChildDirs } from "mkdirp";
import { fileURLToPath } from "url";
import { dirname, join as joinPath } from "path";
import ora from "ora";
import { ofetch } from "ofetch";
import { version, versionManifestUrl } from "../skycraft.json";
import type { MinecraftJson } from "./launcherMeta";

// URL for the launcher metadata
const { versions } = await ofetch(versionManifestUrl);
const launcherMetaUrl = versions.find((v) => v.id === version)?.url;

const __filename = fileURLToPath(import.meta.url);
const currentDirName = dirname(__filename);

const ROOT_PATH = joinPath(currentDirName, "..", "mc");

// Fetch the launcher metadata
const launcherMeta = await ofetch<MinecraftJson>(launcherMetaUrl);
const libraries = launcherMeta.libraries;

type DownloadableFile = {
	friendlyName: string;
	url: string;
	destinationPath: string;
};
const filesToDownload: DownloadableFile[] = [
	{
		// TODO: remove duplicated request
		friendlyName: `Minecraft ${version} - Launcher Meta`,
		url: launcherMetaUrl,
		destinationPath: joinPath(ROOT_PATH, "launcher_meta.json"),
	},
	{
		friendlyName: `Minecraft ${version} - Client Jar`,
		url: launcherMeta.downloads.client.url,
		destinationPath: joinPath(ROOT_PATH, "client.jar"),
	},
];

libraries.forEach((library) => {
	if (library.natives) {
		console.warn("Skipping native download", library.name);
	}

	if (library.downloads.artifact) {
		filesToDownload.push({
			friendlyName: library.name,
			url: library.downloads.artifact.url,
			destinationPath: joinPath(
				ROOT_PATH,
				"libraries",
				library.downloads.artifact.path,
			),
		});
	}
});

console.info(`Downloading ${filesToDownload.length} files...`);

await Promise.all(filesToDownload.map((file) => downloadFile(file)));

async function downloadFile(file: DownloadableFile) {
	const spinner = ora(`Downloading ${file.friendlyName}`).start();

	try {
		syncChildDirs(dirname(file.destinationPath));
		const response = await ofetch(file.url, {
			responseType: "arrayBuffer",
		});

		let stream = createWriteStream(file.destinationPath);
		stream.write(Buffer.from(response));

		spinner.succeed(`Downloaded ${file.friendlyName}`);
	} catch (error) {
		spinner.fail(`Failed to download ${file.friendlyName}`);
		throw error;
	}
}
