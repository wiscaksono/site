import type { Pathname } from '$app/types';

interface Menu {
	title: string;
	href: Pathname;
	key: string;
}

export const navbarMenu: Menu[] = [
	{
		title: 'home',
		href: '/',
		key: 'h'
	},
	{
		title: 'abouts',
		href: '/abouts',
		key: 'a'
	},
	{
		title: 'projects',
		href: '/projects',
		key: 'p'
	},
	{
		title: 'guest-book',
		href: '/guest-book',
		key: 'g'
	}
];
