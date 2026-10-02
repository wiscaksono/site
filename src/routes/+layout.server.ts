import { BASE_URL } from '$app/env/private';
import { buildSiteSchema } from '#lib/schema.js';
import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load: LayoutServerLoad = () => {
	const siteSchemaHtml = `<script type="application/ld+json">${JSON.stringify(buildSiteSchema(BASE_URL))}</script>`;

	return { siteSchemaHtml, baseUrl: BASE_URL };
};
