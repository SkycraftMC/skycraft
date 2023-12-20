declare global {
	async function cheerpjInit(options?: {
		version?: number;
		status?: "splash" | "none" | "default";
		logCanvasUpdates?: boolean;
		preloadResources?: { [key: string]: number[] };
		preloadProgress?: (preloadDone: number, preloadTotal: number) => void;
		clipboardMode?: "permission" | "system" | "java";
		beepCallback?: () => void;
		enableInputMethods?: boolean;
		overrideShortcuts?: (evt: KeyboardEvent) => boolean;
		appletParamFilter?: (
			originalName: string,
			paramValue: string,
		) => string;
		natives?: { [method: string]: Function };
		overrideDocumentBase?: string;
		javaProperties?: string[];
		tailscaleControlUrl?: string;
		tailscaleDnsUrl?: string;
		tailscaleAuthKey?: string;
		tailscaleLoginUrlCb?: (url: string) => void;
		fetch?: (
			url: string,
			method: string,
			postData: ArrayBuffer,
			headers: unknown[],
		) => Promise<unknown>;
	}): Promise<void>;

	function cheerpjCreateDisplay(
		width: number,
		height: number,
		parent?: HTMLElement,
	): HTMLElement;

	async function cheerpjRunMain(
		className: string,
		classPath: string,
		...args: string[]
	): Promise<number>;
}

export {};
