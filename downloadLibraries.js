import { createWriteStream } from "fs";
import { sync as syncChildDirs } from "mkdirp";
import { dirname } from "path";
import axios from "axios";

const ASSET_INDEX_URL =
	"https://piston-meta.mojang.com/v1/packages/832d95b9f40699d4961394dcf6cf549e65f15dc5/1.12.2.json";

const downloadFile = async (url, destinationPath) => {
	syncChildDirs(dirname(destinationPath));
	const response = await axios({
		method: "get",
		url: url,
		responseType: "stream",
	});

	response.data.pipe(createWriteStream(destinationPath));

	return new Promise((resolve, reject) => {
		response.data.on("end", () => {
			resolve();
		});

		response.data.on("error", (err) => {
			reject(err);
		});
	});
};

await downloadFile(ASSET_INDEX_URL, "./public/mc/index.json");
