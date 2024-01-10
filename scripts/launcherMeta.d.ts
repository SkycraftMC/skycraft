export interface Downloads {
	client: Download;
	server: Download;
}

export interface Download {
	sha1: string;
	size: number;
	url: string;
	path: string;
}

export interface AssetIndex {
	id: string;
	sha1: string;
	size: number;
	totalSize: number;
	url: string;
}

export interface LibraryDownload {
	artifact?: Download;
	classifiers?: {
		"native-linux": Download;
	};
}

export interface LibraryRule {
	action: string;
	os?: {
		name: string;
	};
}

export interface Library {
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

export interface LoggingFile extends Download {
	id: string;
}

export interface LoggingConfig {
	argument: string;
	file: LoggingFile;
	type: string;
}

export interface Logging {
	client: LoggingConfig;
}

export interface MinecraftJson {
	assetIndex: AssetIndex;
	downloads: Downloads;
	libraries: Library[];
	logging: Logging;
}
