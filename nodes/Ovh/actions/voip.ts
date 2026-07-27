import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { ovhApiRequest } from '../GenericFunctions';

export async function click2call(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const calledNumber = this.getNodeParameter('calledNumber', i) as string;
	const callingNumber = this.getNodeParameter('callingNumber', i, '') as string;
	const intercom = this.getNodeParameter('intercom', i) as boolean;

	const body: IDataObject = {
		calledNumber,
		intercom,
	};

	if (callingNumber) {
		body.callingNumber = callingNumber;
	}

	return await ovhApiRequest.call(
		this,
		'POST',
		`/telephony/${billingAccount}/line/${serviceName}/click2Call`,
		body,
		{},
		{},
	);
}

export async function blockLine(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const mode = this.getNodeParameter('mode', i) as string;

	return await ovhApiRequest.call(
		this,
		'POST',
		`/telephony/${billingAccount}/line/${serviceName}/block`,
		{ mode },
		{},
		{},
	);
}

export async function unblockLine(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;

	return await ovhApiRequest.call(
		this,
		'POST',
		`/telephony/${billingAccount}/line/${serviceName}/unblock`,
		{},
		{},
		{},
	);
}

export async function listVoicemails(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/voicemail`,
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

export async function getVoicemail(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/voicemail/${serviceName}`,
		{},
		{},
		{},
	);
}

export async function deleteVoicemail(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const voicemailNumber = this.getNodeParameter('voicemailNumber', i) as string;
	const messageId = this.getNodeParameter('messageId', i) as string;

	return await ovhApiRequest.call(
		this,
		'DELETE',
		`/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${messageId}`,
		{},
		{},
		{},
	);
}

export async function getVoicemailTranscript(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const voicemailNumber = this.getNodeParameter('voicemailNumber', i) as string;
	const messageId = this.getNodeParameter('messageId', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${messageId}/transcript?format=json`,
		{},
		{},
		{},
	);
}

export async function getConsumption(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const billingDate = this.getNodeParameter('billingDate', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/historyConsumption/${billingDate}`,
		{},
		{},
		{},
	);
}

export async function configureVxml(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const vxmlServiceName = this.getNodeParameter('vxmlServiceName', i) as string;
	const url = this.getNodeParameter('vxmlUrl', i) as string;
	const urlRecord = this.getNodeParameter('urlRecord', i, '') as string;

	const body: IDataObject = {
		url,
	};

	if (urlRecord) {
		body.urlRecord = urlRecord;
	}

	return await ovhApiRequest.call(
		this,
		'PUT',
		`/telephony/${billingAccount}/vxml/${vxmlServiceName}/settings`,
		body,
		{},
		{},
	);
}

export async function listLines(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/line`,
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

export async function getLine(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/line/${serviceName}`,
		{},
		{},
		{},
	);
}

export async function listVoicemailMessages(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const voicemailNumber = this.getNodeParameter('voicemailNumber', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories`,
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

export async function getVoicemailMessage(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const voicemailNumber = this.getNodeParameter('voicemailNumber', i) as string;
	const messageId = this.getNodeParameter('messageId', i) as string;

	return await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${messageId}`,
		{},
		{},
		{},
	);
}

export async function listCalls(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	const response = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/line/${serviceName}/calls`,
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

export async function hangupCall(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const callId = this.getNodeParameter('callId', i) as string;

	return await ovhApiRequest.call(
		this,
		'POST',
		`/telephony/${billingAccount}/line/${serviceName}/calls/${callId}/hangup`,
		{},
		{},
		{},
	);
}

export async function holdCall(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const callId = this.getNodeParameter('callId', i) as string;

	return await ovhApiRequest.call(
		this,
		'POST',
		`/telephony/${billingAccount}/line/${serviceName}/calls/${callId}/hold`,
		{},
		{},
		{},
	);
}

export async function transferCall(this: IExecuteFunctions, i: number) {
	const billingAccount = this.getNodeParameter('billingAccount', i) as string;
	const serviceName = this.getNodeParameter('serviceName', i) as string;
	const callId = this.getNodeParameter('callId', i) as string;
	const transferNumber = this.getNodeParameter('transferNumber', i) as string;

	return await ovhApiRequest.call(
		this,
		'POST',
		`/telephony/${billingAccount}/line/${serviceName}/calls/${callId}/transfer`,
		{ number: transferNumber },
		{},
		{},
	);
}
