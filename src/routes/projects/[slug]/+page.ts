import type { Picture } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const posterModules = import.meta.glob('/src/lib/assets/projects/*.{webp,png,gif}', {
	eager: true,
	query: '?enhanced',
	import: 'default'
}) as Record<string, Picture>;

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../contents/projects/${params.slug}.md`);
		const poster = (post.metadata as { poster: string | Picture }).poster;
		if (typeof poster === 'string' && poster.startsWith('$lib')) {
			const resolved = posterModules[poster.replace('$lib', '/src/lib')];
			if (resolved) (post.metadata as { poster: Picture }).poster = resolved;
		}
		return { content: post.default, meta: post.metadata };
	} catch (e) {
		console.error(e);
		error(404, `Could not find ${params.slug}`);
	}
};
