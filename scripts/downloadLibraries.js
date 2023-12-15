// Crappy version of Gradle
// I know this is bad, but it's better than nothing
import { createWriteStream } from "fs";
import { sync as syncChildDirs } from "mkdirp";
import { fileURLToPath } from "url";
import { dirname, join as joinPath } from "path";
import axios from "axios";
import ora from "ora";
// TODO: make this configurable
const LAUNCHER_META_URL = "https://piston-meta.mojang.com/v1/packages/832d95b9f40699d4961394dcf6cf549e65f15dc5/1.12.2.json";
const __filename = fileURLToPath(import.meta.url);
const currentDirName = dirname(__filename);
const ROOT_PATH = joinPath(currentDirName, "..", "public", "mc");
const launcherMeta = (await axios.get(LAUNCHER_META_URL)).data;
const files = [
    {
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
console.info(`Downloading ${files.length} files...`);
async function downloadFile({ url, friendlyName, destinationPath }) {
    const spinner = ora(`Downloading ${friendlyName}`).start();
    syncChildDirs(dirname(destinationPath));
    const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
    });
    response.data.pipe(createWriteStream(destinationPath));
    return new Promise((resolve, reject) => {
        response.data.on("end", () => {
            spinner.succeed(`Downloaded ${friendlyName}`);
            resolve();
        });
        response.data.on("error", (err) => {
            spinner.fail(`Failed to download ${friendlyName}`);
            reject(err);
        });
    });
}
await Promise.all(files.map((file) => downloadFile({ ...file })));
