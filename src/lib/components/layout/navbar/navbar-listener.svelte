<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	import { navbarMenu } from './navbar-menu';

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
		const target = e.target as HTMLElement;
		if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

		const menuItem = navbarMenu.find((item) => item.key === e.key.toLowerCase());
		if (menuItem) goto(resolve(menuItem.href));
	};
</script>

<svelte:window onkeydown={handleKeydown} />
