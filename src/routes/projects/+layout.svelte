<script lang="ts">
	import { page } from '$app/state';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { createWebHaptics } from 'web-haptics/svelte';

	import Icon from '$lib/components/icon.svelte';

	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	let activeTechstack = $derived(browser ? (page.url.searchParams.get('techstack') ?? '') : '');

	const { trigger, destroy } = createWebHaptics();

	onDestroy(destroy);
</script>

<div class="flex min-h-0 flex-1 flex-col px-3 pt-3 lg:px-4 lg:py-0">
	<nav class="bg-ash-700 sticky top-0 z-50 mb-2 flex shrink-0 items-center overflow-x-auto overscroll-x-contain select-none">
		{#each data.techstacks as item (item)}
			<a
				onclick={() => trigger()}
				href={item === 'All Projects' ? '/projects' : `/projects?techstack=${item}`}
				data-active={activeTechstack === item || (activeTechstack === '' && item === 'All Projects')}
				class="text-ash-300 data-[active=true]:bg-ash-300 data-[active=true]:text-ash-800 flex shrink-0 items-center gap-1.5 px-3 py-0.5 leading-none transition-all"
				aria-label={`Filter by ${item ?? 'All Projects'}`}
			>
				{#if item !== 'All Projects'}
					<Icon name={item ?? ''} aria-hidden="true" />
				{/if}
				<span class="sr-only">Filter by {item}</span>
				{item}
			</a>
		{/each}
	</nav>
	<div class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
		{@render children()}
	</div>
</div>
