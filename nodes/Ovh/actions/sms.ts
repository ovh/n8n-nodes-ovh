import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { ovhApiRequest } from '../GenericFunctions';

export async function send(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const sender = this.getNodeParameter('sender', i, '') as string;
	const to = this.getNodeParameter('to', i) as string;
	const message = this.getNodeParameter('message', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const receivers = to
		.split(',')
		.map((receiver) => receiver.trim())
		.filter(Boolean);

	const body: IDataObject = {
		receivers,
		message,
		...additionalFields,
	};

	// `sender` is optional per the API: when omitted, `senderForResponse` (in
	// Additional Fields) must be set so OVH allocates a reply-capable number.
	if (sender) {
		body.sender = sender;
	}

	return await ovhApiRequest.call(this, 'POST', `/sms/${serviceName}/jobs`, body, {}, {});
}

export async function getIncoming(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const incomingId = this.getNodeParameter('incomingId', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/sms/${serviceName}/incoming/${incomingId}`,
		{},
		{},
		{},
	);
}

export async function getOutgoing(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const outgoingId = this.getNodeParameter('outgoingId', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/sms/${serviceName}/outgoing/${outgoingId}`,
		{},
		{},
		{},
	);
}

export async function listIncoming(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/sms/${serviceName}/incoming`,
		{},
		{},
		{},
	);

	if (returnAll || !Array.isArray(response)) {
		return response;
	}

	const limit = this.getNodeParameter('limit', i) as number;
	return response.slice(0, limit);
}

export async function listOutgoing(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/sms/${serviceName}/outgoing`,
		{},
		{},
		{},
	);

	if (returnAll || !Array.isArray(response)) {
		return response;
	}

	const limit = this.getNodeParameter('limit', i) as number;
	return response.slice(0, limit);
}

export async function deleteIncoming(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const incomingId = this.getNodeParameter('incomingId', i) as string;

	return await ovhApiRequest.call(
		this,
		'DELETE',
		`/sms/${serviceName}/incoming/${incomingId}`,
		{},
		{},
		{},
	);
}

export async function deleteOutgoing(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const outgoingId = this.getNodeParameter('outgoingId', i) as string;

	return await ovhApiRequest.call(
		this,
		'DELETE',
		`/sms/${serviceName}/outgoing/${outgoingId}`,
		{},
		{},
		{},
	);
}

export async function getAccount(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;

	return await ovhApiRequest.call(this, 'GET', `/sms/${serviceName}`, {}, {}, {});
}

export async function sendBatch(this: IExecuteFunctions, i: number) {
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const sender = this.getNodeParameter('sender', i, '') as string;
	const to = this.getNodeParameter('to', i) as string;
	const message = this.getNodeParameter('message', i) as string;
	const batchName = this.getNodeParameter('batchName', i, '') as string;
	const deferred = this.getNodeParameter('deferred', i, '') as string;

	const receivers = to
		.split(',')
		.map((receiver) => receiver.trim())
		.filter(Boolean);

	const body: IDataObject = {
		message,
		to: receivers,
	};

	if (sender) {
		body.from = sender;
	}
	if (batchName) {
		body.name = batchName;
	}
	if (deferred) {
		body.deferred = deferred;
	}

	return await ovhApiRequest.call(this, 'POST', `/sms/${serviceName}/batches`, body, {}, {});
}
