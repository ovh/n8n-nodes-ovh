import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IWebhookFunctions,
	ITriggerFunctions,
	IDataObject,
	IHttpRequestOptions,
	INodePropertyOptions,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

interface Platform {
	id: string;
}

interface Account {
	id: string;
	currentState?: {
		email?: string;
	};
}

interface Slot {
	id: string;
	currentState?: {
		offer?: string;
		email?: string | null;
	};
}

interface Alias {
	id: string;
	currentState?: {
		alias?: string;
	};
}

interface Redirection {
	id: string;
	currentState?: {
		source?: string;
		destination?: string;
	};
}

interface Domain {
	id: string;
	currentState?: {
		name?: string;
	};
}

export async function ovhApiRequest(
	this:
		| IExecuteFunctions
		| ILoadOptionsFunctions
		| IHookFunctions
		| IWebhookFunctions
		| ITriggerFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	option: IDataObject = {},
	platformId?: string,
	apiVersion: string = 'v1',
) {
	const credentials = await this.getCredentials('ovhApi');
	const baseUrl = credentials.endpoint as string;

	// Update the base URL to use the specified API version. Endpoints default to
	// the /1.0 base; some services (e.g. Zimbra) require /v2 instead.
	let updatedBaseUrl = baseUrl;
	if (apiVersion && baseUrl.includes('api.ovh.com')) {
		if (baseUrl.includes('/1.0')) {
			updatedBaseUrl = baseUrl.replace(/\/(1\.0)/, `/${apiVersion}`);
		} else {
			updatedBaseUrl = baseUrl.replace(/\/$/, '') + `/${apiVersion}`;
		}
	}

	// If platformId is provided, replace the placeholder in the endpoint
	let processedEndpoint = endpoint;
	if (platformId) {
		processedEndpoint = processedEndpoint.replace('{platformId}', platformId);
	}

	const options: IHttpRequestOptions = {
		method: method as IHttpRequestOptions['method'],
		url: `${updatedBaseUrl}${processedEndpoint}`,
		json: true,
		...option,
	};

	if ((method === 'POST' || method === 'PUT') && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	// Signature headers are added by the credential's authenticate() function.
	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'ovhApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}


export async function loadZimbraPlatforms(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const platforms = await ovhApiRequest.call(
		this,
		'GET',
		'/zimbra/platform',
		{},
		{},
		{},
		undefined,
		'v2',
	);

	return platforms.map((platform: Platform) => ({
		name: platform.id,
		value: platform.id,
	}));
}

export async function loadZimbraAccounts(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const platformId = this.getNodeParameter('platformId', 0) as string;
	const accounts = await ovhApiRequest.call(
		this,
		'GET',
		'/zimbra/platform/{platformId}/account',
		{},
		{},
		{},
		platformId,
		'v2',
	);

	return accounts.map((account: Account) => ({
		name: account?.currentState?.email ?? account.id,
		value: account.id,
	}));
}

export async function loadZimbraSlots(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const platformId = this.getNodeParameter('platformId', 0) as string;
	const slots = await ovhApiRequest.call(
		this,
		'GET',
		'/zimbra/platform/{platformId}/slot',
		{},
		{},
		{},
		platformId,
		'v2',
	);

	// A free slot (no email tied to it) is the one to use when creating an account.
	return slots.map((slot: Slot) => {
		const offer = slot.currentState?.offer ?? 'Slot';
		const email = slot.currentState?.email;
		return {
			name: email ? `${offer} — ${email}` : `${offer} — available`,
			value: slot.id,
		};
	});
}

export async function loadZimbraAliases(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const platformId = this.getNodeParameter('platformId', 0) as string;
	const aliases = await ovhApiRequest.call(
		this,
		'GET',
		'/zimbra/platform/{platformId}/alias',
		{},
		{},
		{},
		platformId,
		'v2',
	);

	return aliases.map((alias: Alias) => ({
		name: alias.currentState?.alias ?? alias.id,
		value: alias.id,
	}));
}

export async function loadZimbraRedirections(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const platformId = this.getNodeParameter('platformId', 0) as string;
	const redirections = await ovhApiRequest.call(
		this,
		'GET',
		'/zimbra/platform/{platformId}/redirection',
		{},
		{},
		{},
		platformId,
		'v2',
	);

	return redirections.map((redirection: Redirection) => {
		const { source, destination } = redirection.currentState ?? {};
		return {
			name: source && destination ? `${source} -> ${destination}` : redirection.id,
			value: redirection.id,
		};
	});
}

export async function loadZimbraDomains(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const platformId = this.getNodeParameter('platformId', 0) as string;
	const domains = await ovhApiRequest.call(
		this,
		'GET',
		'/zimbra/platform/{platformId}/domain',
		{},
		{},
		{},
		platformId,
		'v2',
	);

	return domains.map((domain: Domain) => ({
		name: domain.currentState?.name ?? domain.id,
		value: domain.id,
	}));
}

export async function loadSmsSenders(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const serviceName = this.getNodeParameter('serviceName', 0) as string;
	const senders = await ovhApiRequest.call(this, 'GET', `/sms/${serviceName}/senders`, {}, {}, {});

	return senders.map((sender: string) => ({
		name: sender,
		value: sender,
	}));
}

export async function loadSmsServiceNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const serviceNames = await ovhApiRequest.call(this, 'GET', '/sms', {}, {}, {});

	return serviceNames.map((serviceName: string) => ({
		name: serviceName,
		value: serviceName,
	}));
}

export async function loadSmsOutgoing(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const serviceName = this.getNodeParameter('serviceName', 0) as string;
	const listOutgoing = await ovhApiRequest.call(this, 'GET', `/sms/${serviceName}/outgoing`, {}, {}, {});

	return listOutgoing.map((id: string) => ({
		name: id,
		value: id,
	}));
}

export async function loadSmsIncoming(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const serviceName = this.getNodeParameter('serviceName', 0) as string;
	const listIncoming = await ovhApiRequest.call(this, 'GET', `/sms/${serviceName}/incoming`, {}, {}, {});

	return listIncoming.map((id: string) => ({
		name: id,
		value: id,
	}));
}

export async function loadVoipBillingAccounts(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const accounts = await ovhApiRequest.call(this, 'GET', '/telephony', {}, {}, {});

	return accounts.map((account: string) => ({
		name: account,
		value: account,
	}));
}

export async function loadVoipServiceNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const billingAccount = this.getNodeParameter('billingAccount', 0) as string;
	const lines = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/line`,
		{},
		{},
		{},
	);

	return lines.map((line: string) => ({
		name: line,
		value: line,
	}));
}

export async function loadLineCalls(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const billingAccount = this.getNodeParameter('billingAccount', 0) as string;
	const serviceName = this.getNodeParameter('serviceName', 0) as string;
	const ids = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/line/${serviceName}/calls`,
		{},
		{},
		{},
	);

	return ids.map((id: number) => ({
		name: id.toString(),
		value: id.toString(),
	}));
}

export async function loadVoicemailServiceNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const billingAccount = this.getNodeParameter('billingAccount', 0) as string;
	const serviceNames = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/voicemail`,
		{},
		{},
		{},
	);

	return serviceNames.map((serviceName: string) => ({
		name: serviceName,
		value: serviceName,
	}));
}

export async function loadVoicemailDirectories(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const billingAccount = this.getNodeParameter('billingAccount', 0) as string;
	const voicemailNumber = this.getNodeParameter('voicemailNumber', 0) as string;
	const directories = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories`,
		{},
		{},
		{},
	);

	return directories.map((directory: string) => ({
		name: directory,
		value: directory,
	}));
}

export async function loadVoipHistoryConsumption(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const billingAccount = this.getNodeParameter('billingAccount', 0) as string;
	const dates = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/historyConsumption`,
		{},
		{},
		{},
	);

	return dates.map((date: string) => ({
		name: date,
		value: date,
	}));
}

export async function loadVxmlServiceNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const billingAccount = this.getNodeParameter('billingAccount', 0) as string;
	const serviceNames = await ovhApiRequest.call(
		this,
		'GET',
		`/telephony/${billingAccount}/vxml`,
		{},
		{},
		{},
	);

	return serviceNames.map((serviceName: string) => ({
		name: serviceName,
		value: serviceName,
	}));
}

