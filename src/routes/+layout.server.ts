import { BASE_URL } from '$env/static/private';
import { buildSiteSchema } from '$lib/schema';
import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load: LayoutServerLoad = () => {
	const siteSchemaHtml = `<script type="application/ld+json">${JSON.stringify(buildSiteSchema(BASE_URL))}</script>`;

	return { siteSchemaHtml, baseUrl: BASE_URL };
};
