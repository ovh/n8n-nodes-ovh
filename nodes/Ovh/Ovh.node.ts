import {
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
	NodeApiError,
	NodeConnectionTypes,
} from 'n8n-workflow';
import { router } from './actions';
import {
	mailboxOperations,
	mailboxFields,
	smsOperations,
	smsFields,
	voipOperations,
	voipFields,
	domainOperations,
	domainFields,
} from './descriptions';
import {
	loadZimbraAccounts,
	loadZimbraPlatforms,
	loadZimbraSlots,
	loadZimbraAliases,
	loadZimbraRedirections,
	loadZimbraDomains,
	loadSmsServiceNames,
	loadSmsSenders,
	loadVoipBillingAccounts,
	loadVoipServiceNames,
	loadLineCalls,
	loadVoipHistoryConsumption,
	loadSmsOutgoing,
	loadSmsIncoming,
	loadVoicemailServiceNames,
	loadVoicemailDirectories,
	loadVxmlServiceNames,
} from './GenericFunctions';

export class Ovh implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH',
		name: 'ovh',
		icon: { light: 'file:ovh.svg', dark: 'file:ovh.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with OVH API services',
		defaults: {
			name: 'OVH',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'ovhApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'Mailbox',
						value: 'mailbox',
					},
					{
						name: 'SMS',
						value: 'sms',
					},
					{
						name: 'VoIP',
						value: 'voip',
					},
				],
				default: 'mailbox',
			},
			mailboxOperations,
			smsOperations,
			voipOperations,
			domainOperations,
			...mailboxFields,
			...smsFields,
			...voipFields,
			...domainFields,
		],
	};

	methods = {
		loadOptions: {
			loadZimbraPlatforms,
			loadZimbraAccounts,
			loadZimbraSlots,
			loadZimbraAliases,
			loadZimbraRedirections,
			loadZimbraDomains,
			loadSmsServiceNames,
			loadSmsSenders,
			loadVoipBillingAccounts,
			loadVoipServiceNames,
			loadLineCalls,
			loadSmsOutgoing,
			loadSmsIncoming,
			loadVoicemailServiceNames,
			loadVoicemailDirectories,
			loadVoipHistoryConsumption,
			loadVxmlServiceNames,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const responseData = await router.call(this, i);

				const rawItems = Array.isArray(responseData) ? responseData : [responseData];
				const jsonItems = rawItems.map((entry) =>
					entry !== null && typeof entry === 'object'
						? (entry as IDataObject)
						: ({ value: entry } as IDataObject),
				);

				returnData.push(
					...this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(jsonItems), {
						itemData: { item: i },
					}),
				);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
