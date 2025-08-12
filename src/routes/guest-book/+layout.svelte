<script lang="ts">
	let { children } = $props();
</script>

<svelte:boundary>
	{@render children()}

	{#snippet pending()}
		<section class="flex-1 flex-grow space-y-1 overflow-y-auto px-3 lg:px-4">
			{#each Array.from({ length: 50 }), i (i)}
				<li class="group flex h-5 animate-pulse flex-col gap-1 py-1 lg:flex-row lg:gap-2 lg:border-y-0 lg:py-0">
					<div class="bg-ash-600/50 h-full flex-1 truncate lg:w-36 lg:flex-none"></div>
					<p class="text-ash-600/50 bg-ash-600/50 hidden lg:block">:</p>
					<p class="bg-ash-600/50 hidden flex-1 lg:block"></p>
					<p class="bg-ash-600/50 hidden w-[159px] lg:block"></p>
				</li>
			{/each}
		</section>
	{/snippet}
</svelte:boundary>
