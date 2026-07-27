import type { INodeProperties } from 'n8n-workflow';

export const voipOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['voip'],
		},
	},
	options: [
		{
			name: 'Block Line',
			value: 'blockLine',
			action: 'Block a phone line',
			description: 'Block incoming and/or outgoing calls on a line',
		},
		{
			name: 'Click to Call',
			value: 'click2call',
			action: 'Make a click to call request',
			description: 'Initiate a click-to-call request',
		},
		{
			name: 'Configure VXML',
			value: 'configureVxml',
			action: 'Configure vxml settings',
			description: 'Configure the VXML service settings',
		},
		{
			name: 'Delete Voicemail',
			value: 'deleteVoicemail',
			action: 'Delete a voicemail message',
			description: 'Delete a voicemail message',
		},
		{
			name: 'Get Consumption History',
			value: 'getConsumption',
			action: 'Get consumption history',
			description: 'Get the billed consumption history for a period',
		},
		{
			name: 'Get Line',
			value: 'getLine',
			action: 'Get a phone line',
			description: 'Get the details of a phone line',
		},
		{
			name: 'Get Voicemail',
			value: 'getVoicemail',
			action: 'Get voicemail detail',
			description: 'Get voicemail detail',
		},
		{
			name: 'Get Voicemail Message',
			value: 'getVoicemailMessage',
			action: 'Get a voicemail message',
			description: 'Get the details of a single voicemail message',
		},
		{
			name: 'Get Voicemail Transcript',
			value: 'getVoicemailTranscript',
			action: 'Get voicemail transcript',
			description: 'Get transcript of a voicemail message',
		},
		{
			name: 'Hang Up Call',
			value: 'hangupCall',
			action: 'Hang up a call',
			description: 'Hang up an ongoing call on a line',
		},
		{
			name: 'Hold Call',
			value: 'holdCall',
			action: 'Hold a call',
			description: 'Toggle hold on an ongoing call',
		},
		{
			name: 'List Calls',
			value: 'listCalls',
			action: 'List ongoing calls',
			description: 'List the ongoing calls on a line',
		},
		{
			name: 'List Lines',
			value: 'listLines',
			action: 'List phone lines',
			description: 'List the phone lines on a billing account',
		},
		{
			name: 'List Voicemail Messages',
			value: 'listVoicemailMessages',
			action: 'List voicemail messages',
			description: 'List the messages in a voicemail',
		},
		{
			name: 'List Voicemails',
			value: 'listVoicemails',
			action: 'List voicemail services',
			description: 'List the voicemail services on a billing account',
		},
		{
			name: 'Transfer Call',
			value: 'transferCall',
			action: 'Transfer a call',
			description: 'Transfer an ongoing call to another number',
		},
		{
			name: 'Unblock Line',
			value: 'unblockLine',
			action: 'Unblock a phone line',
			description: 'Remove call blocking from a line',
		},
	],
	default: 'click2call',
};

export const voipFields: INodeProperties[] = [
	{
		displayName: 'Billing Account Name or ID',
		name: 'billingAccount',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['voip'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadVoipBillingAccounts',
		},
		default: '',
		description:
			'The billing account. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'Service Name or ID',
		name: 'serviceName',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['blockLine', 'unblockLine', 'click2call', 'getVoicemail', 'getLine', 'listCalls', 'hangupCall', 'holdCall', 'transferCall'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadVoipServiceNames',
			loadOptionsDependsOn: ['billingAccount']
		},
		default: '',
		description:
			'The VoIP service. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'To',
		name: 'calledNumber',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['click2call'],
			},
		},
		default: '',
		description: 'Destination phone number',
		required: true,
	},
	{
		displayName: 'Calling Number',
		name: 'callingNumber',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['click2call'],
			},
		},
		default: '',
		description: 'The number that rings first (caller ID). Defaults to the line number if empty.',
	},
	{
		displayName: 'Intercom',
		name: 'intercom',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['click2call'],
			},
		},
		default: false,
		description: 'Whether to enable intercom mode for the call',
	},
	{
		displayName: 'Block Mode',
		name: 'mode',
		type: 'options',
		options: [
			{
				name: 'Both',
				value: 'both',
			},
			{
				name: 'Incoming',
				value: 'incoming',
			},
			{
				name: 'Outgoing',
				value: 'outgoing',
			},
		],
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['blockLine'],
			},
		},
		default: 'both',
		description: 'Which call directions to block',
	},
	{
		displayName: 'Call Name or ID',
		name: 'callId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['hangupCall', 'holdCall', 'transferCall'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadLineCalls',
			loadOptionsDependsOn: ['billingAccount', 'serviceName'],
		},
		default: '',
		description:
			'The ongoing call to act on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'Transfer to Number',
		name: 'transferNumber',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['transferCall'],
			},
		},
		default: '',
		description: 'The phone number to transfer the call to',
		required: true,
	},
	{
		displayName: 'VXML Service Name or ID',
		name: 'vxmlServiceName',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['configureVxml'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadVxmlServiceNames',
			loadOptionsDependsOn: ['billingAccount'],
		},
		default: '',
		description:
			'The VXML service to configure. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'VXML URL',
		name: 'vxmlUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['configureVxml'],
			},
		},
		default: '',
		description: 'The URL that serves the VXML script for the service',
		required: true,
	},
	{
		displayName: 'Recording URL',
		name: 'urlRecord',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['configureVxml'],
			},
		},
		default: '',
		description: 'Optional URL called to record the call',
	},
	{
		displayName: 'Billing Date Name or ID',
		name: 'billingDate',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['getConsumption'],
			},
		},
		default: '',
		typeOptions: {
			loadOptionsMethod: 'loadVoipHistoryConsumption',
			loadOptionsDependsOn: ['billingAccount']
		},
		required: true,
	},
	{
		displayName: 'Voicemail Service Name or ID',
		name: 'voicemailNumber',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['getVoicemailTranscript', 'deleteVoicemail', 'listVoicemailMessages', 'getVoicemailMessage'],
			},
		},
		default: '',
		typeOptions: {
			loadOptionsMethod: 'loadVoicemailServiceNames',
			loadOptionsDependsOn: ['billingAccount']
		},
		required: true,
	},
	{
		displayName: 'Message Name or ID',
		name: 'messageId',
		type: 'options',
		description: 'The voicemail message. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['voip'],
				operation: ['getVoicemailTranscript', 'deleteVoicemail', 'getVoicemailMessage'],
			},
		},
		default: '',
		typeOptions: {
			loadOptionsMethod: 'loadVoicemailDirectories',
			loadOptionsDependsOn: ['billingAccount', 'voicemailNumber']
		},
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
				resource: ['voip'],
				operation: ['listVoicemails', 'listLines', 'listVoicemailMessages', 'listCalls'],
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
				resource: ['voip'],
				operation: ['listVoicemails', 'listLines', 'listVoicemailMessages', 'listCalls'],
				returnAll: [false],
			},
		},
	},
];
