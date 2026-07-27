import type { INodeProperties } from 'n8n-workflow';

export const smsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['sms'],
		},
	},
	options: [
		{
			name: 'Delete Incoming',
			value: 'deleteIncoming',
			action: 'Delete incoming SMS',
			description: 'Delete a received SMS message',
		},
		{
			name: 'Delete Outgoing',
			value: 'deleteOutgoing',
			action: 'Delete outgoing SMS',
			description: 'Delete a sent SMS message',
		},
		{
			name: 'Get Account',
			value: 'getAccount',
			action: 'Get SMS account',
			description: 'Get SMS account details such as remaining credits',
		},
		{
			name: 'Get Incoming',
			value: 'getIncoming',
			action: 'Get incoming SMS',
			description: 'Get incoming SMS message detail',
		},
		{
			name: 'Get Outgoing',
			value: 'getOutgoing',
			action: 'Get outgoing SMS',
			description: 'Get sent SMS message detail',
		},
		{
			name: 'List Incoming',
			value: 'listIncoming',
			action: 'List incoming SMS',
			description: 'List incoming SMS messages',
		},
		{
			name: 'List Outgoing',
			value: 'listOutgoing',
			action: 'List outgoing SMS',
			description: 'List sent SMS messages',
		},
		{
			name: 'Send Batch',
			value: 'sendBatch',
			action: 'Send an SMS batch',
			description: 'Send a batch of SMS messages, optionally scheduled',
		},
		{
			name: 'Send SMS',
			value: 'send',
			action: 'Send an SMS',
			description: 'Send an SMS message',
		},
	],
	default: 'send',
};

export const smsFields: INodeProperties[] = [
	{
		displayName: 'Service Name or ID',
		name: 'serviceName',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sms'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadSmsServiceNames',
		},
		default: '',
		description:
			'The SMS service. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'Sender Name or ID',
		name: 'sender',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send', 'sendBatch'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadSmsSenders',
			loadOptionsDependsOn: ['serviceName'],
		},
		default: '',
		description:
			'The sender the message is sent from. Leave empty and enable "Sender for Response" for a two-way SMS. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send', 'sendBatch'],
			},
		},
		default: '',
		description: 'Recipient phone number(s) with country code, comma-separated for multiple',
		required: true,
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send', 'sendBatch'],
			},
		},
		default: '',
		description: 'The SMS message content',
		required: true,
	},
	{
		displayName: 'Batch Name',
		name: 'batchName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['sendBatch'],
			},
		},
		default: '',
		description: 'Optional name for the batch',
	},
	{
		displayName: 'Scheduled Send Time',
		name: 'deferred',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['sendBatch'],
			},
		},
		default: '',
		description: 'Optional date/time to send the batch (leave empty to send immediately)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Differed Period (Minutes)',
				name: 'differedPeriod',
				type: 'number',
				default: 0,
				description: 'Delay before the message is sent, in minutes',
			},
			{
				displayName: 'No Stop Clause',
				name: 'noStopClause',
				type: 'boolean',
				default: false,
				description: 'Whether to remove the STOP clause appended to marketing messages',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{
						name: 'High',
						value: 'high',
					},
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'Very Low',
						value: 'veryLow',
					},
				],
				default: 'high',
				description: 'The delivery priority of the message',
			},
			{
				displayName: 'Sender for Response',
				name: 'senderForResponse',
				type: 'boolean',
				default: false,
				description:
					'Whether to send a two-way SMS the recipient can reply to (OVH allocates a response number instead of using a fixed sender)',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Custom tag echoed back on the outgoing message and in the send report',
			},
			{
				displayName: 'Validity Period (Minutes)',
				name: 'validityPeriod',
				type: 'number',
				default: 2880,
				description: 'How long the message stays valid for delivery, in minutes',
			},
		],
	},
	{
		displayName: 'Outgoing Item Name or ID',
		name: 'outgoingId',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['getOutgoing', 'deleteOutgoing'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadSmsOutgoing',
			loadOptionsDependsOn: ['serviceName'],
		},
		default: '',
		required: true,
	},
	{
		displayName: 'Incoming Item Name or ID',
		name: 'incomingId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['getIncoming', 'deleteIncoming'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadSmsIncoming',
			loadOptionsDependsOn: ['serviceName'],
		},
		default: '',
		description: 'The income item. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listIncoming', 'listOutgoing'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['sms'],
				operation: ['listIncoming', 'listOutgoing'],
				returnAll: [false],
			},
		},
	},
];
