// web-haptics@0.0.6 ships `dist/svelte/index.js` but its `./svelte` export points at a
// `dist/svelte/index.d.ts` that does not exist in the published package, so TypeScript/
// svelte-check cannot find types for the subpath. This mirrors the real `createWebHaptics` API.
declare module 'web-haptics/svelte' {
	export function createWebHaptics(options?: import('web-haptics').WebHapticsOptions): {
		trigger(input?: import('web-haptics').HapticInput, options?: import('web-haptics').TriggerOptions): Promise<void>;
		cancel(): void;
		destroy(): void;
		setDebug(debug: boolean): void;
		isSupported: boolean;
	};
}
