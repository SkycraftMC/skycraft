import { sync as syncChildDirs } from "mkdirp";
import { fileURLToPath } from "url";
import { dirname, join as joinPath } from "path";
import { ofetch } from "ofetch";
import {
	version,
	versionManifestUrl,
	assetApiBaseUrl,
	userAgent,
} from "../skycraft.json";
import PQueue from "p-queue";
import ProgressBar from "progress";
import { promises as fsPromises } from "fs";

import type { MinecraftJson } from "./launcherMeta";

// URL for the launcher metadata
const { versions } = await ofetch(versionManifestUrl);
const launcherMetaUrl = versions.find((v) => v.id === version)?.url;

const __filename = fileURLToPath(import.meta.url);
const currentDirName = dirname(__filename);

const ROOT_PATH = joinPath(currentDirName, "..", "mc");
const LEGACY_PATH = joinPath(ROOT_PATH, "assets", "virtual", "legacy");

// Fetch the launcher metadata
const launcherMeta = await ofetch<MinecraftJson>(launcherMetaUrl);
const libraries = launcherMeta.libraries;
const assetIndex = await ofetch(launcherMeta.assetIndex.url);
const assetObjects = assetIndex.objects;

type DownloadableFile = {
	friendlyName: string;
	url: string;
	destinationPath: string;
	symlinks?: string[];
};

const queue = new PQueue({ concurrency: 5, intervalCap: 12, interval: 1400 });

const additions: DownloadableFile[] = [
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
for (const addition in additions) {
	queue.add(async () => downloadFile(additions[addition]));
}

const bar = new ProgressBar(":bar :current/:total :percent :etas", {
	total:
		additions.length +
		libraries.filter((library) => library.downloads.artifact).length +
		length +
		Object.keys(assetObjects).length,
});

// Download libraries
libraries.forEach((library) => {
	if (library.natives) {
		console.warn("Skipping native download", library.name);
	}

	if ("artifact" in library.downloads) {
		queue.add(async () =>
			downloadFile({
				friendlyName: library.name,
				url: library.downloads.artifact.url,
				destinationPath: joinPath(
					ROOT_PATH,
					"libraries",
					library.downloads.artifact.path,
				),
			}),
		);
	}
});

// Download assets
syncChildDirs(LEGACY_PATH);
for (const assetObjectPath in assetObjects) {
	const hash = assetObjects[assetObjectPath].hash;

	queue.add(async () =>
		downloadFile({
			friendlyName: assetObjectPath,
			url: `${assetApiBaseUrl}/${hash.substring(0, 2)}/${hash}`,
			destinationPath: joinPath(
				ROOT_PATH,
				"assets",
				"objects",
				hash.substring(0, 2),
				hash,
				assetObjectPath,
			),
			symlinks: [
				// for versions below 1.7
				joinPath(LEGACY_PATH, assetObjectPath),
			],
		}),
	);
}

async function downloadFile(file: DownloadableFile) {
	try {
		syncChildDirs(dirname(file.destinationPath));
		const response = await ofetch(file.url, {
			headers: {
				"User-Agent": userAgent,
			},
			responseType: "arrayBuffer",
			retryDelay: 500,
		});

		await fsPromises.writeFile(file.destinationPath, Buffer.from(response));

		if (file.symlinks) {
			for (const symlink of file.symlinks) {
				syncChildDirs(dirname(symlink));
				await fsPromises.symlink(file.destinationPath, symlink, "file");
			}
		}

		bar.tick();
	} catch (error) {
		console.error(error);
		throw error;
	}
}
