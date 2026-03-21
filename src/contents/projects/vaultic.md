---
title: Vaultic
description: Cloud storage that uses Telegram as the backend. Upload, preview, and share files through a web interface. Telegram stores everything.
poster: /projects/vaultic.png
techstack:
  - SvelteKit
---

[Vaultic](https://github.com/wiscaksono/vaultic) is cloud storage that uses Telegram as the backend. You upload files through a web app, they get sent to a private Telegram channel. Download, preview, share, all from the same interface.

## Why

Cloud storage costs money. Google Drive, Dropbox, iCloud. They all start free and then the bills show up. Meanwhile Telegram lets you send files up to 2GB per message to a channel, and there's no limit on how many messages you can send.

The math is straightforward. If you split a 10GB file into chunks and send each one as a separate message, you've got yourself free storage with no cap. You just need something to handle the chunking, reassembly, and a decent UI on top.

That's what Vaultic does.

## How it works

The upload path goes like this: browser splits the file into chunks (50MB each, configurable), sends them to the server in parallel, server reassembles the chunks, then sends the complete file to a Telegram channel via TDLib. The file's Telegram message ID gets stored in a local SQLite database alongside the metadata: name, size, mime type, which user owns it, what folder it's in.

Download is the reverse. Server fetches the file from Telegram, streams it back to the browser. There's an in-memory LRU cache so the same file doesn't get re-downloaded from Telegram every time someone opens it.

For files over the 2GB Telegram limit, the server splits them into multiple Telegram messages automatically. A 5GB file becomes four messages. The database tracks which chunks belong to which file and in what order, so reassembly on download is transparent.

## The hard parts

TDLib, Telegram's official client library, was the biggest source of pain. It's a C++ library with Node.js bindings, and it does things its own way.

The first real problem: `sendMessage` returns immediately with a local message ID, but the actual upload to Telegram happens in the background. If you delete the temp file before TDLib finishes reading it, the upload silently fails. I had to set up a global event listener that catches `updateMessageSendSucceeded` and resolves a promise, so the code waits until the file actually reaches Telegram before cleaning up.

Rate limiting was another thing. Telegram throttles you if you send too many messages too fast. Upload a folder with 50 files and you'll hit `Too Many Requests: retry after 38` around file 15. The fix was a retry loop that parses the wait time from the error message and backs off automatically.

The chunked upload protocol needed some thought too. Browser-side chunks go to the server via sequential HTTP requests (now parallel, which made a big difference for speed). Server-side assembly uses `appendFileSync` because async stream writing had backpressure issues that produced empty files. Not elegant, but it works.

## Claude was pretty useful

I built most of this in a single session with Claude as a pair programmer. The whole thing, from brainstorming the architecture to deploying on a VPS, happened in one conversation. Claude handled the boilerplate, caught edge cases I missed (like `crypto.randomUUID` not working on HTTP, or `BODY_SIZE_LIMIT=0` meaning zero bytes instead of unlimited), and was generally good at turning vague ideas into working code.

It's not magic though. I still had to think through the architecture, catch when something felt wrong, and debug the stuff Claude couldn't see (like TDLib's event timing issues that only showed up at runtime). But for cranking through a lot of code quickly, it was genuinely helpful.

## What you get

File management with folders, breadcrumbs, drag-to-move. Multi-select with bulk operations. Grid and list views. Context menus.

File preview for images, video, audio, PDF, and code files. Code gets syntax highlighting with Shiki. 50+ languages, light and dark themes, line numbers.

Share links with optional passwords, expiry dates, and download limits. The share page works without login and has its own preview.

Multi-user auth with an admin panel. Per-user storage quotas. Ban/unban. Trash with restore.

Dark mode that follows your system preference (or you can override it). PWA so you can install it. Keyboard shortcuts too. Cmd+K for search, Cmd+A to select all, Cmd+/ to see the full list.

A floating upload panel in the bottom-right corner (like Google Drive) that shows progress for all active uploads and persists across page navigation. Uploads can resume after a page refresh.

Everything is configurable through environment variables. Chunk sizes, cache limits, storage quotas, timeouts. The README has presets for different VPS sizes.

## Stack

- [SvelteKit](https://svelte.dev) with Node adapter for the full-stack framework
- [TDLib](https://github.com/eilvelia/tdl) via tdl for Telegram's MTProto protocol (no file size limits, unlike the Bot API)
- [SQLite](https://www.sqlite.org) via Drizzle ORM for the database
- [Better Auth](https://better-auth.com) for authentication with email/password and admin roles
- [Tailwind CSS](https://tailwindcss.com) + [shadcn-svelte](https://next.shadcn-svelte.com) for the UI
- [Shiki](https://shiki.style) for syntax highlighting in file previews
- [Sharp](https://sharp.pixelplumbing.com) for thumbnail generation
- [Pino](https://getpino.io) for structured logging

[Source code](https://github.com/wiscaksono/vaultic)
