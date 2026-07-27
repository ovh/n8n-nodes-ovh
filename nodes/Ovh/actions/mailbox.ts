import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { ovhApiRequest } from '../GenericFunctions';

export async function list(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/zimbra/platform/{platformId}/account`,
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

export async function get(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const accountId = this.getNodeParameter('accountId', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/zimbra/platform/{platformId}/account/${accountId}`,
		{},
		{},
		{},
		platformId,
		'v2',
	);
}

export async function create(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const newEmail = this.getNodeParameter('newEmail', i) as string;
	const offer = this.getNodeParameter('offer', i) as string;
	const slotId = this.getNodeParameter('slotId', i) as string;
	const password = this.getNodeParameter('password', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = {
		targetSpec: {
			email: newEmail,
			offer,
			slotId,
			password,
			contactInformation: {
				city: additionalFields.city || '',
				company: additionalFields.company || '',
				country: additionalFields.country || '',
				phoneNumber: additionalFields.phoneNumber || '',
			},
			displayName: additionalFields.displayName || newEmail,
			firstName: additionalFields.firstName || '',
			lastName: additionalFields.lastName || '',
		},
	};

	return await ovhApiRequest.call(
		this,
		'POST',
		`/zimbra/platform/{platformId}/account`,
		body,
		{},
		{},
		platformId,
		'v2',
	);
}

export async function rename(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const accountId = this.getNodeParameter('accountId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const body: IDataObject = {
		targetSpec: {
			...(updateFields.newDisplayName && {
				displayName: updateFields.newDisplayName,
			}),
			...(updateFields.newEmail && {
				email: updateFields.newEmail,
			}),
		},
	};

	return await ovhApiRequest.call(
		this,
		'PUT',
		`/zimbra/platform/{platformId}/account/${accountId}`,
		body,
		{},
		{},
		platformId,
		'v2',
	);
}

export async function changePassword(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const accountId = this.getNodeParameter('accountId', i) as string;
	const newPassword = this.getNodeParameter('newPassword', i) as string;

	const body: IDataObject = {
		targetSpec: {
			password: newPassword,
		},
	};

	return await ovhApiRequest.call(
		this,
		'PUT',
		`/zimbra/platform/{platformId}/account/${accountId}`,
		body,
		{},
		{},
		platformId,
		'v2',
	);
}

export async function deleteMailbox(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const accountId = this.getNodeParameter('accountId', i) as string;

	return await ovhApiRequest.call(
		this,
		'DELETE',
		`/zimbra/platform/{platformId}/account/${accountId}`,
		{},
		{},
		{},
		platformId,
		'v2',
	);
}

export async function listAliases(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/zimbra/platform/{platformId}/alias`,
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

export async function createAlias(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const alias = this.getNodeParameter('alias', i) as string;
	const targetId = this.getNodeParameter('targetId', i) as string;

	const body: IDataObject = {
		targetSpec: {
			alias,
			targetId,
		},
	};

	return await ovhApiRequest.call(
		this,
		'POST',
		`/zimbra/platform/{platformId}/alias`,
		body,
		{},
		{},
		platformId,
		'v2',
	);
}

export async function deleteAlias(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const aliasId = this.getNodeParameter('aliasId', i) as string;

	return await ovhApiRequest.call(
		this,
		'DELETE',
		`/zimbra/platform/{platformId}/alias/${aliasId}`,
		{},
		{},
		{},
		platformId,
		'v2',
	);
}

export async function listRedirections(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/zimbra/platform/{platformId}/redirection`,
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

export async function createRedirection(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const source = this.getNodeParameter('source', i) as string;
	const destination = this.getNodeParameter('destination', i) as string;

	const body: IDataObject = {
		targetSpec: {
			source,
			destination,
		},
	};

	return await ovhApiRequest.call(
		this,
		'POST',
		`/zimbra/platform/{platformId}/redirection`,
		body,
		{},
		{},
		platformId,
		'v2',
	);
}

export async function deleteRedirection(this: IExecuteFunctions, i: number) {
	const platformId = this.getNodeParameter('platformId', i) as string;
	const redirectionId = this.getNodeParameter('redirectionId', i) as string;

	return await ovhApiRequest.call(
		this,
		'DELETE',
		`/zimbra/platform/{platformId}/redirection/${redirectionId}`,
		{},
		{},
		{},
		platformId,
		'v2',
	);
}
