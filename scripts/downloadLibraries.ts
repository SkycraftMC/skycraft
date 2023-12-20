import { createWriteStream } from "fs";
import { sync as syncChildDirs } from "mkdirp";
import { fileURLToPath } from "url";
import { dirname, join as joinPath } from "path";
import download from "download";
import axios from "axios";
import ora from "ora";

// URL for the launcher metadata
const LAUNCHER_META_URL =
	"https://piston-meta.mojang.com/v1/packages/832d95b9f40699d4961394dcf6cf549e65f15dc5/1.12.2.json";

const __filename = fileURLToPath(import.meta.url);
const currentDirName = dirname(__filename);

const ROOT_PATH = joinPath(currentDirName, "..", "mc");

// Fetch the launcher metadata
const launcherMeta: MinecraftJson = (await axios.get(LAUNCHER_META_URL)).data;
const libraries = launcherMeta.libraries;

type DownloadableFile = {
	friendlyName: string;
	url: string;
	destinationPath: string;
};
const filesToDownload: DownloadableFile[] = [
	{
		// FIXME: duplicated request
		friendlyName: "Minecraft 1.12.2 - Launcher Meta",
		url: LAUNCHER_META_URL,
		destinationPath: joinPath(ROOT_PATH, "launcher_meta.json"),
	},
	{
		friendlyName: "Minecraft 1.12.2 - Client Jar",
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
		const response = await axios({
			method: "get",
			url: file.url,
			responseType: "stream",
		});

		response.data.pipe(createWriteStream(file.destinationPath));

		await new Promise((resolve, reject) => {
			response.data.on("end", resolve);
			response.data.on("error", reject);
		});

		spinner.succeed(`Downloaded ${file.friendlyName}`);
	} catch (error) {
		spinner.fail(`Failed to download ${file.friendlyName}`);
		throw error;
	}
}
