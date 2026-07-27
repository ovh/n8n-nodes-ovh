import {
	type IDataObject,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerFunctions,
	type ITriggerResponse,
	NodeConnectionTypes,
	sleep,
} from 'n8n-workflow';
import { ovhApiRequest, loadVoipBillingAccounts } from '../Ovh/GenericFunctions';

const EVENTS_URL = 'https://events.voip.ovh.net/';

interface EventsResponse {
	Session?: string;
	Events?: IDataObject[];
}

export class OvhTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Trigger',
		name: 'ovhTrigger',
		icon: { light: 'file:ovh.svg', dark: 'file:ovh.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["billingAccount"]}}',
		description: 'Starts the workflow on OVH telephony (VoIP) call events',
		usableAsTool: true,
		defaults: {
			name: 'OVH Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'ovhApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Billing Account Name or ID',
				name: 'billingAccount',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadVoipBillingAccounts',
				},
				default: '',
				required: true,
				description:
					'The telephony billing account to listen on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'End Calling',
						value: 'end_calling',
					},
					{
						name: 'End Hold',
						value: 'end_hold',
					},
					{
						name: 'End Ringing',
						value: 'end_ringing',
					},
					{
						name: 'Start Calling',
						value: 'start_calling',
					},
					{
						name: 'Start Hold',
						value: 'start_hold',
					},
					{
						name: 'Start Ringing',
						value: 'start_ringing',
					},
				],
				default: [],
				description: 'The call events to trigger on. Leave empty to trigger on all events.',
			},
		],
	};

	methods = {
		loadOptions: {
			loadVoipBillingAccounts,
		},
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const billingAccount = this.getNodeParameter('billingAccount') as string;
		const events = this.getNodeParameter('events', []) as string[];

		let closed = false;
		let token = '';

		const generateToken = async (): Promise<string> => {
			// POST requires an `expiration` and returns the token as a plain string
			// (the { token } object shape is the GET response, not POST).
			const token = await ovhApiRequest.call(
				this,
				'POST',
				`/telephony/${billingAccount}/eventToken`,
				{ expiration: 'unlimited' },
				{},
				{},
			);
			return token as string;
		};

		// Long-poll the OVH events server. The endpoint holds the connection open until
		// events arrive, returns `{ Session, Events[] }`, and expects the returned Session
		// to be echoed back on the next request as the cursor. This call is NOT OVH-signed —
		// the token in the query string authenticates it against a separate host.
		const poll = async (emitOnce: boolean): Promise<void> => {
			let session = '';
			while (!closed) {
				try {
					if (!token) {
						token = await generateToken();
					}

					let url = `${EVENTS_URL}?token=${encodeURIComponent(token)}`;
					if (session) {
						url += `&session=${encodeURIComponent(session)}`;
					}

					const response = (await this.helpers.httpRequest({
						method: 'GET',
						url,
						json: true,
						timeout: 60000,
					})) as EventsResponse;

					if (closed) {
						return;
					}

					if (response?.Session) {
						session = response.Session;
					}

					for (const event of response?.Events ?? []) {
						const eventType = event.Event as string;
						if (events.length === 0 || events.includes(eventType)) {
							this.emit([this.helpers.returnJsonArray([event])]);
							if (emitOnce) {
								return;
							}
						}
					}
				} catch {
					if (closed) {
						return;
					}
					// The token may have expired or the connection dropped — reset and back off.
					token = '';
					session = '';
					await sleep(5000);
				}
			}
		};

		const closeFunction = async (): Promise<void> => {
			closed = true;
		};

		const manualTriggerFunction = async (): Promise<void> => {
			await poll(true);
		};

		if (this.getMode() === 'trigger') {
			void poll(false);
		}

		return {
			closeFunction,
			manualTriggerFunction,
		};
	}
}
