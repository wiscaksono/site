<script lang="ts">
	import { page } from '$app/state';
	import { MediaQuery } from 'svelte/reactivity';

	interface $$Props {
		title: string;
		description: string;
		image?: string;
	}

	let { title, description, image = '/opengraph-image.png' }: $$Props = $props();

	const mobileQuery = new MediaQuery('(max-width: 1024px)');
	let isMobile = $derived(mobileQuery.current);

	const baseUrl = $derived(page.data.baseUrl);
	const imageUrl = $derived(image.startsWith('/') ? `${baseUrl}${image}` : image);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="theme-color" content={isMobile ? '#262626' : '#454545'} />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={baseUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={baseUrl} />
	<meta property="twitter:url" content={baseUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
