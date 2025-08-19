import { fail } from '@sveltejs/kit';
import { desc, eq, sql, count, and } from 'drizzle-orm';
import { command, form, getRequestEvent, prerender } from '$app/server';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const getGuestBooksPrepared = db
	.select({
		id: table.guestBook.id,
		content: table.guestBook.content,
		userId: table.guestBook.userId,
		username: table.user.username,
		createdAt: table.guestBook.createdAt,
		likeCount: count(table.guestBookLike.userId).mapWith(Number),
		liked: sql<number>`count(case when ${table.guestBookLike.userId} = ${sql.placeholder('currentUserId')} then 1 end)`.mapWith((val) => val > 0)
	})
	.from(table.guestBook)
	.innerJoin(table.user, eq(table.guestBook.userId, table.user.id))
	.leftJoin(table.guestBookLike, eq(table.guestBookLike.guestBookId, table.guestBook.id))
	.groupBy(table.guestBook.id, table.user.username)
	.orderBy(desc(table.guestBook.createdAt))
	.prepare('get_guest_books');

export const getGuestsBook = prerender(async () => {
	const { locals } = getRequestEvent();

	const currentUserId = locals.user?.id ?? null;
	const guestBooks = await getGuestBooksPrepared.execute({ currentUserId });

	return { user: locals.user, guestBooks };
});

export const insertGuestBook = form(async (formData) => {
	const { locals } = getRequestEvent();
	if (!locals.user) return fail(401, { error: 'Unauthorized' });

	const content = formData.get('content') as string;
	if (!content || content.trim().length < 3 || content.length > 140) return fail(400, { content, error: 'Invalid content length' });

	await db.insert(table.guestBook).values({ content, userId: locals.user.id, createdAt: new Date() }).returning({
		id: table.guestBook.id,
		content: table.guestBook.content,
		userId: table.guestBook.userId,
		createdAt: table.guestBook.createdAt
	});

	await getGuestsBook().refresh();
});

export const toggleLikeGuestBook = command('unchecked', async (guestBookId: number) => {
	const { locals } = getRequestEvent();
	if (!locals.user) return fail(401, { error: 'Unauthorized' });

	await db.transaction(async (tx) => {
		const [exist] = await tx
			.select({ id: table.guestBookLike.guestBookId })
			.from(table.guestBookLike)
			.where(and(eq(table.guestBookLike.guestBookId, guestBookId), eq(table.guestBookLike.userId, locals.user!.id)));

		if (exist) {
			await tx.delete(table.guestBookLike).where(and(eq(table.guestBookLike.guestBookId, guestBookId), eq(table.guestBookLike.userId, locals.user!.id)));
		} else {
			const [guestBookExists] = await tx.select({ id: table.guestBook.id }).from(table.guestBook).where(eq(table.guestBook.id, guestBookId));
			if (!guestBookExists) return;
			await tx.insert(table.guestBookLike).values({ guestBookId: guestBookId, userId: locals.user!.id });
		}
	});

	await getGuestsBook().refresh();
});

export const deleteGuestBook = command('unchecked', async (guestBookId: number) => {
	const { locals } = getRequestEvent();
	if (!locals.user) return fail(401, { error: 'Unauthorized' });

	await db.delete(table.guestBook).where(and(eq(table.guestBook.id, guestBookId), eq(table.guestBook.userId, locals.user.id)));
	await getGuestsBook().refresh();
});
