interface Downloads {
	client: Download;
	server: Download;
}

interface Download {
	sha1: string;
	size: number;
	url: string;
	path: string;
}

interface AssetIndex {
	id: string;
	sha1: string;
	size: number;
	totalSize: number;
	url: string;
}

interface LibraryDownload {
	artifact: Download;
	classifiers?: {
		"native-linux": Download;
	};
}

interface LibraryRule {
	action: string;
	os?: {
		name: string;
	};
}

interface Library {
	name: string;
	downloads: LibraryDownload;
	natives?: {
		linux: string;
		osx: string;
		windows: string;
	};
	extract?: {
		exclude?: string[];
	};
	rules?: LibraryRule[];
}

interface LoggingFile extends Download {
	id: string;
}

interface LoggingConfig {
	argument: string;
	file: LoggingFile;
	type: string;
}

interface Logging {
	client: LoggingConfig;
}

interface MinecraftJson {
	assetIndex: AssetIndex;
	downloads: Downloads;
	libraries: Library[];
	logging: Logging;
}
