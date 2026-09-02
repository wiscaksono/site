import { randomBytes, timingSafeEqual } from 'node:crypto';
import { BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

const AUTHORIZATION_ENDPOINT = 'https://github.com/login/oauth/authorize';
const TOKEN_ENDPOINT = 'https://github.com/login/oauth/access_token';

export function generateState(): string {
	return randomBytes(32).toString('base64url');
}

export function constantTimeEqual(a: string, b: string): boolean {
	const ab = Buffer.from(a);
	const bb = Buffer.from(b);
	if (ab.length !== bb.length) return false;
	return timingSafeEqual(ab, bb);
}

export function createGitHubAuthorizationURL(state: string, scopes: string[] = []): URL {
	const url = new URL(AUTHORIZATION_ENDPOINT);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('client_id', GITHUB_CLIENT_ID);
	url.searchParams.set('redirect_uri', BASE_URL + '/api/auth/callback');
	url.searchParams.set('state', state);
	if (scopes.length) url.searchParams.set('scope', scopes.join(' '));
	return url;
}

export async function validateGitHubCode(code: string): Promise<{ accessToken: string }> {
	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		code,
		redirect_uri: BASE_URL + '/api/auth/callback',
		client_id: GITHUB_CLIENT_ID,
		client_secret: GITHUB_CLIENT_SECRET
	});

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded',
		'User-Agent': 'wiscaksono-site',
		Authorization: `Basic ${Buffer.from(`${GITHUB_CLIENT_ID}:${GITHUB_CLIENT_SECRET}`).toString('base64')}`
	};

	const response = await fetch(TOKEN_ENDPOINT, {
		method: 'POST',
		headers,
		body: body.toString()
	});

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		throw new Error(`GitHub token exchange failed: ${response.status} ${text}`);
	}

	const data = (await response.json()) as {
		access_token?: string;
		error?: string;
		error_description?: string;
	};

	if (data.error || !data.access_token) {
		throw new Error(data.error_description ?? data.error ?? 'No access token returned');
	}

	return { accessToken: data.access_token };
}
