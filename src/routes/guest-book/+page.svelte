<script lang="ts">
	import Metadata from '$lib/components/metadata.svelte';

	import { getGuestsBook, insertGuestBook, toggleLikeGuestBook, deleteGuestBook } from './data.remote';
</script>

<Metadata
	title="Guest Book | Wiscaksono"
	description="Leave a lasting imprint on my digital canvas! Sign in and share your thoughts, greetings, or anecdotes on my guest-book page. Your messages contribute to the heart and soul of my online community. Connect with us through your words and be a part of the vibrant conversations happening on my website. Your messages matter, so take a moment to make your mark and be heard!"
/>

<h1 class="sr-only">Wisnu Wicaksono's Guest Book</h1>

<section class="flex-1 flex-grow space-y-1 overflow-y-auto px-3 lg:px-4">
	{#await getGuestsBook()}
		<div class="grid h-full w-full place-items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="animate-spin"
			>
				<path d="M12 2v4" />
				<path d="m16.2 7.8 2.9-2.9" />
				<path d="M18 12h4" />
				<path d="m16.2 16.2 2.9 2.9" />
				<path d="M12 18v4" />
				<path d="m4.9 19.1 2.9-2.9" />
				<path d="M2 12h4" />
				<path d="m4.9 4.9 2.9 2.9" />
			</svg>
		</div>
	{:then { guestBooks, user }}
		<form class="flex flex-col gap-2 text-sm lg:flex-row lg:items-center" {...insertGuestBook}>
			<p class="truncate lg:w-36">
				<span class="text-cyan">~</span>/{user ? user?.username?.toLowerCase().replace(/\s/g, '-') : 'guest'}
			</p>
			<p class="hidden lg:block">:</p>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				required
				autofocus
				type="text"
				minLength={3}
				name="content"
				maxLength={140}
				autoComplete="off"
				disabled={!user}
				placeholder={user ? 'Leave a message' : 'Sign in to leave a message'}
				class="placeholder-opacity-50 placeholder:text-ash-400 caret-cyan flex-1 bg-transparent focus:border-transparent focus:ring-0 focus:outline-none"
			/>
			{#if user}
				<button class="bg-ash-400 text-ash-800 flex w-full items-center justify-center gap-2 gap-x-2 px-2 py-0.5 lg:w-[160px]">Submit</button>
			{:else}
				<a class="bg-ash-400 text-ash-800 flex w-full items-center justify-center gap-2 gap-x-2 px-2 py-0.5 lg:w-[160px]" href="/api/auth">
					<svg width="14" height="14" fill="none" viewBox="0 0 14 14">
						<path
							fill="currentColor"
							fill-rule="evenodd"
							d="M7.005 1C3.685 1 1 3.75 1 7.152c0 2.72 1.72 5.022 4.106 5.836.298.062.408-.132.408-.295 0-.143-.01-.631-.01-1.14-1.67.366-2.018-.734-2.018-.734-.269-.713-.667-.896-.667-.896-.546-.377.04-.377.04-.377.607.04.925.631.925.631.537.937 1.402.673 1.75.51.05-.398.208-.673.377-.826C4.58 9.72 3.177 9.19 3.177 6.826c0-.672.239-1.222.617-1.65-.06-.153-.269-.784.06-1.63 0 0 .506-.163 1.65.632.49-.135.994-.203 1.501-.204.507 0 1.024.071 1.501.204 1.144-.795 1.65-.632 1.65-.632.329.846.12 1.477.06 1.63.388.428.617.978.617 1.65 0 2.363-1.402 2.883-2.744 3.035.218.194.407.56.407 1.141 0 .825-.01 1.487-.01 1.691 0 .163.11.357.408.296C11.28 12.172 13 9.872 13 7.152 13.01 3.75 10.316 1 7.005 1z"
							clip-rule="evenodd"
						/>
					</svg>
					SignIn
				</a>
			{/if}
		</form>

		<ul class="divide-ash-700 flex flex-col gap-y-1 divide-y text-sm lg:divide-y-0">
			{#each guestBooks as item (item.id)}
				<li class="group flex flex-col gap-1 py-1 lg:flex-row lg:gap-2 lg:border-y-0 lg:py-0" class:animate-pulse={item.id < 0}>
					<p class="flex-1 truncate lg:w-36 lg:flex-none">
						<span class="text-cyan">~</span>/{item.username.toLowerCase().replace(/\s/g, '-')}
					</p>
					<p class="block lg:hidden">{item.content}</p>
					<p class="hidden lg:block">:</p>
					<p class="hidden flex-1 lg:block">{item.content}</p>
					{#if user && item.id > 0}
						<div class="flex items-center justify-center gap-x-1">
							<button
								onclick={async () => await toggleLikeGuestBook(item.id)}
								class="flex items-center gap-x-1 opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0"
								aria-label={item.liked ? 'Unlike' : 'Like'}
							>
								<span class="text-xs leading-none">
									{item.likeCount}
								</span>
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="stroke-ash-400" class:fill-ash-400={item.liked}>
									<path
										d="M11.0832 8.16667C11.9523 7.315 12.8332 6.29417 12.8332 4.95833C12.8332 4.10743 12.4952 3.29138 11.8935 2.6897C11.2918 2.08802 10.4757 1.75 9.62484 1.75C8.59817 1.75 7.87484 2.04167 6.99984 2.91667C6.12484 2.04167 5.4015 1.75 4.37484 1.75C3.52393 1.75 2.70788 2.08802 2.1062 2.6897C1.50452 3.29138 1.1665 4.10743 1.1665 4.95833C1.1665 6.3 2.0415 7.32083 2.9165 8.16667L6.99984 12.25L11.0832 8.16667Z"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
							{#if item.userId === user.id}
								<button aria-label="Delete" class="flex items-center justify-center" onclick={async () => await deleteGuestBook(item.id)}>
									<svg width="14" height="14" fill="none" viewBox="0 0 14 14">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 3.5l-7 7M3.5 3.5l7 7" />
									</svg>
								</button>
							{/if}
						</div>
					{/if}
					<p class="hidden lg:block">
						{new Date(item.createdAt)
							.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
							.replace(',', '')
							.replace(/\//g, '-')}
					</p>
				</li>
			{/each}
		</ul>
	{/await}
</section>
