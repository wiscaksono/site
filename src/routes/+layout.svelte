<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import { PUBLIC_UMAMI_TRACKING_ID } from '$env/static/public';

	import '../app.css';
	import { dev } from '$app/environment';
	import Header from '$lib/components/layout/header/header.svelte';
	import Navbar from '$lib/components/layout/navbar/navbar.svelte';

	let { data, children } = $props();

	let dragging = $state(false);
	let isFullscreen = $state(false);
	let offset = $state({ x: 0, y: 0 });
	let position = $state({ x: 0, y: 0 });
	let containerElement = $state<HTMLElement | null>(null);
	const mobileQuery = new MediaQuery('(max-width: 1024px)');
	let isMobile = $derived(mobileQuery.current);

	function toggleFullscreen() {
		if (isMobile) return;
		if (!isFullscreen) containerElement?.requestFullscreen();
		else {
			document.exitFullscreen();
			position = { x: 0, y: 0 };
		}
		isFullscreen = !isFullscreen;
	}

	function onMouseDown(e: MouseEvent) {
		if (isMobile) return;
		dragging = true;
		offset = { x: e.clientX - position.x, y: e.clientY - position.y };
	}

	function handleMouseUp() {
		dragging = false;
	}

	function handleMouseMove(e: MouseEvent) {
		if (dragging) position = { x: e.clientX - offset.x, y: e.clientY - offset.y };
	}

	function handleFullscreenChange() {
		if (!document.fullscreenElement) isFullscreen = false;
	}

	$effect(() => {
		if (!isMobile) return;

		position = { x: 0, y: 0 };
	});
</script>

<svelte:window onmouseup={handleMouseUp} onmousemove={handleMouseMove} />
<svelte:document onfullscreenchange={handleFullscreenChange} />

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html data.siteSchemaHtml}
	{#if !dev}
		<script defer src="https://umami.wiscaksono.com/script.js" data-website-id={PUBLIC_UMAMI_TRACKING_ID}></script>
	{/if}
</svelte:head>

<main
	bind:this={containerElement}
	data-fullscreen={isFullscreen || isMobile}
	class="from-ash-800 lg:gradient-border gradient-border-from-ash-800 gradient-border-via-ash-700 gradient-border-to-ash-400 to-ash-700 z-10 flex h-dvh w-dvw flex-col overflow-hidden rounded-xl bg-linear-to-tr via-75% [--gradient-border-angle:45deg] data-[fullscreen=true]:rounded-none lg:h-[75dvh] lg:w-[70dvw]"
	class:container-shadow={!isFullscreen || !isMobile}
	style:transform="translate({position.x}px, {position.y}px)"
	style:transition={dragging ? 'none' : 'all 0.2s ease-out'}
>
	<Header {isFullscreen} {onMouseDown} {toggleFullscreen} />
	{@render children()}
	<Navbar />
</main>

<video
	src="/leaves.mp4"
	autoplay
	loop
	muted
	playsinline
	preload="auto"
	aria-hidden="true"
	draggable="false"
	class="pointer-events-none fixed inset-0 z-999 hidden h-full w-full object-cover object-top mix-blend-multiply grayscale select-none motion-reduce:hidden lg:block"
></video>
