import type {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
	Icon,
} from 'n8n-workflow';
import { createHash } from 'crypto';

export class OvhApi implements ICredentialType {
	name = 'ovhApi';

	displayName = 'OVH API';

	icon: Icon = { light: 'file:ovh.svg', dark: 'file:ovh.dark.svg' };

	documentationUrl = 'https://api.ovh.com/console/';

	properties: INodeProperties[] = [
		{
			displayName: 'Endpoint',
			name: 'endpoint',
			type: 'options',
			options: [
				{
					name: 'OVH Europe',
					value: 'https://eu.api.ovh.com/1.0',
				},
				{
					name: 'OVH Canada',
					value: 'https://ca.api.ovh.com/1.0',
				},
				{
					name: 'OVH US',
					value: 'https://api.us.ovhcloud.com/1.0',
				},
				{
					name: 'So you Start Europe',
					value: 'https://eu.api.soyoustart.com/1.0',
				},
				{
					name: 'So you Start Canada',
					value: 'https://ca.api.soyoustart.com/1.0',
				},
				{
					name: 'Kimsufi Europe',
					value: 'https://eu.api.kimsufi.com/1.0',
				},
				{
					name: 'Kimsufi Canada',
					value: 'https://ca.api.kimsufi.com/1.0',
				},
			],
			default: 'https://eu.api.ovh.com/1.0',
			description: 'The OVH API endpoint to use.',
		},
		{
			displayName: 'Application Key',
			name: 'applicationKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'OVH Application key.',
			required: true,
		},
		{
			displayName: 'Application Secret',
			name: 'applicationSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'OVH Application secret.',
			required: true,
		},
		{
			displayName: 'Consumer Key',
			name: 'consumerKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'OVH Consumer key.',
			required: true,
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const { applicationKey, applicationSecret, consumerKey } = credentials as {
			applicationKey: string;
			applicationSecret: string;
			consumerKey: string;
		};

		const method = (requestOptions.method ?? 'GET').toUpperCase();
		const url = requestOptions.url ?? '';
		const timestamp = Math.round(Date.now() / 1000).toString();

		// OVH signs the exact body that is sent. Only POST/PUT carry a body,
		// with non-ASCII characters escaped to match the serialized payload.
		let bodyForSignature = '';
		if ((method === 'POST' || method === 'PUT') && requestOptions.body) {
			bodyForSignature = JSON.stringify(requestOptions.body).replace(
				new RegExp('[\u0080-\uFFFF]', 'g'),
				(m) => '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4),
			);
		}

		const signature =
			'$1$' +
			createHash('sha1')
				.update([applicationSecret, consumerKey, method, url, bodyForSignature, timestamp].join('+'))
				.digest('hex');

		requestOptions.headers = {
			...requestOptions.headers,
			'X-Ovh-Application': applicationKey,
			'X-Ovh-Consumer': consumerKey,
			'X-Ovh-Signature': signature,
			'X-Ovh-Timestamp': timestamp,
		};

		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.endpoint}}',
			url: '/auth/time',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 200,
					message:
						'Connection successful! Authentication will be verified when using the nodes. Make sure your Application Key, Application Secret, and Consumer Key are correct.',
				},
			},
		],
	};
}
