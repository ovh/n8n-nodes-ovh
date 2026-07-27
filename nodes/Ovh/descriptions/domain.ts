import type { INodeProperties } from 'n8n-workflow';

export const domainOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['domain'],
		},
	},
	options: [
		{
			name: 'Get Domain',
			value: 'get',
			action: 'Get a domain',
			description: 'Get the details of a domain',
		},
		{
			name: 'List Domains',
			value: 'list',
			action: 'List domains',
			description: 'List domains on a platform',
		},
	],
	default: 'list',
};

export const domainFields: INodeProperties[] = [
	{
		displayName: 'Platform Name or ID',
		name: 'platformId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadZimbraPlatforms',
		},
		default: '',
		description:
			'The platform for the Zimbra service. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'Domain Name or ID',
		name: 'domainId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['get'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadZimbraDomains',
			loadOptionsDependsOn: ['platformId'],
		},
		default: '',
		description:
			'The domain to get. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				resource: ['domain'],
				operation: ['list'],
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
				resource: ['domain'],
				operation: ['list'],
				returnAll: [false],
			},
		},
	},
];
