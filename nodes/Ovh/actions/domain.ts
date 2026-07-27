import type { IExecuteFunctions } from 'n8n-workflow';
import { ovhApiRequest } from '../GenericFunctions';

export async function listDomains(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/zimbra/platform/{platformId}/domain`,
		{},
		{},
		{},
		platformId,
		'v2',
	);

	if (returnAll || !Array.isArray(response)) {
		return response;
	}

	const limit = this.getNodeParameter('limit', i) as number;
	return response.slice(0, limit);
}

export async function getDomain(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const domainId = this.getNodeParameter('domainId', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/zimbra/platform/{platformId}/domain/${domainId}`,
		{},
		{},
		{},
		platformId,
		'v2',
	);
}
