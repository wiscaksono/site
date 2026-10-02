import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	BASE_URL: { static: true },
	PUBLIC_UMAMI_TRACKING_ID: { public: true, static: true },
	GITHUB_CLIENT_ID: { static: true },
	GITHUB_CLIENT_SECRET: { static: true },
	DATABASE_URL: { static: true }
});
