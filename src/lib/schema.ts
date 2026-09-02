import { identity } from '$lib/identity';

type SchemaOrgEntity = {
	'@type': string;
	'@id': string;
	[key: string]: unknown;
};

export function buildSiteSchema(baseUrl: string): { '@context': string; '@graph': SchemaOrgEntity[] } {
	const personId = `${baseUrl}/#person`;

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Person',
				'@id': personId,
				name: identity.name,
				url: `${baseUrl}/`,
				sameAs: [...identity.sameAs]
			},
			{
				'@type': 'WebSite',
				'@id': `${baseUrl}/#website`,
				name: identity.siteName,
				url: `${baseUrl}/`,
				publisher: { '@id': personId }
			}
		]
	};
}
