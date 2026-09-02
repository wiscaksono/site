<script lang="ts">
	interface $$Props {
		isFullscreen: boolean;
		onMouseDown: (e: MouseEvent) => void;
		toggleFullscreen: () => void;
	}

	let { isFullscreen, onMouseDown, toggleFullscreen }: $$Props = $props();

	function handleHeaderKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleFullscreen();
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<header
	class={`group relative hidden cursor-default items-center overflow-hidden px-4 py-2.5 lg:flex ${isFullscreen ? 'lg:cursor-pointer' : 'lg:cursor-grab lg:active:cursor-grabbing'}`}
	onmousedown={onMouseDown}
	onkeydown={handleHeaderKeyDown}
>
	<button class="grid h-6 w-6 place-items-center rounded-full" onclick={() => window.close()} aria-label="Close">
		<div class="grid size-3.5 place-items-center rounded-full bg-[#898989] transition-colors group-hover:bg-[#FF6057]">
			<svg
				width="124"
				height="124"
				viewBox="0 0 124 124"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				class="size-2.5 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<rect x="26.8701" y="88.3883" width="87" height="11" transform="rotate(-45 26.8701 88.3883)" fill="#7E0508" />
				<rect x="26.8701" y="34.6482" width="11" height="87" transform="rotate(-45 26.8701 34.6482)" fill="#7E0508" />
			</svg>
		</div>
	</button>
	<button class="grid h-6 w-6 place-items-center rounded-full" aria-label="Minimize">
		<div class="grid size-3.5 place-items-center rounded-full bg-[#898989] transition-colors group-hover:bg-[#FEBC2D]">
			<svg
				width="87"
				height="11"
				viewBox="0 0 87 11"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				class="h-0.5 w-1.75 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<rect width="87" height="11" fill="#985712" />
			</svg>
		</div>
	</button>
	<button class="grid h-6 w-6 place-items-center rounded-full" onclick={toggleFullscreen} aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
		<div class="grid size-3.5 place-items-center rounded-full bg-[#898989] transition-colors group-hover:bg-[#2BC840]">
			<svg
				width="143"
				height="143"
				viewBox="0 0 143 143"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				class="size-2.5 rotate-90 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<path
					d="M108.242 32.8833C108.797 32.8817 109.247 33.3317 109.245 33.8862L109.092 87.5891C109.09 88.4786 108.014 88.9223 107.385 88.2933L53.8351 34.7432C53.2061 34.1142 53.6498 33.0387 54.5394 33.0361L108.242 32.8833Z"
					fill="#0B650D"
				/>
				<path
					d="M33.8862 109.245C33.3317 109.247 32.8818 108.797 32.8833 108.242L33.0361 54.5394C33.0387 53.6499 34.1142 53.2061 34.7432 53.8351L88.2933 107.385C88.9223 108.014 88.4786 109.09 87.5891 109.092L33.8862 109.245Z"
					fill="#0B650D"
				/>
			</svg>
		</div>
	</button>
</header>
