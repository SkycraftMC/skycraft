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
		// `Function` being ambiguous is fine, because native functions can accept any number of arguments/types
		// eslint-disable-next-line @typescript-eslint/ban-types
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

	function cheerpOSAddStringFile(
		path: string,
		data: string | Uint8Array,
	): void;
}

export {};
