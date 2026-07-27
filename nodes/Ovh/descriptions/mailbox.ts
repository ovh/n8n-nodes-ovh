import type { INodeProperties } from 'n8n-workflow';

export const mailboxOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['mailbox'],
		},
	},
	options: [
		{
			name: 'Change Mailbox Password',
			value: 'changePassword',
			action: 'Change mailbox password',
			description: 'Change authentication password for a mailbox/account',
		},
		{
			name: 'Create Alias',
			value: 'createAlias',
			action: 'Create an alias',
			description: 'Create a new email alias',
		},
		{
			name: 'Create Mailbox',
			value: 'create',
			action: 'Create a mailbox',
			description: 'Create a new mailbox/folder',
		},
		{
			name: 'Create Redirection',
			value: 'createRedirection',
			action: 'Create a redirection',
			description: 'Create a new email redirection',
		},
		{
			name: 'Delete Alias',
			value: 'deleteAlias',
			action: 'Delete an alias',
			description: 'Delete an email alias',
		},
		{
			name: 'Delete Mailbox',
			value: 'delete',
			action: 'Delete a mailbox',
			description: 'Delete a mailbox and its content',
		},
		{
			name: 'Delete Redirection',
			value: 'deleteRedirection',
			action: 'Delete a redirection',
			description: 'Delete an email redirection',
		},
		{
			name: 'Get Mailbox Info',
			value: 'get',
			action: 'Get mailbox info',
			description: 'Fetch metadata for a specific mailbox',
		},
		{
			name: 'List Aliases',
			value: 'listAliases',
			action: 'List aliases',
			description: 'List email aliases on a platform',
		},
		{
			name: 'List Mailboxes',
			value: 'list',
			action: 'List all mailboxes',
			description: 'Retrieve all mailboxes/folders for an account',
		},
		{
			name: 'List Redirections',
			value: 'listRedirections',
			action: 'List redirections',
			description: 'List email redirections on a platform',
		},
		{
			name: 'Rename Mailbox',
			value: 'rename',
			action: 'Rename a mailbox',
			description: 'Rename an existing mailbox',
		},
	],
	default: 'list',
};

export const mailboxFields: INodeProperties[] = [
	{
		displayName: 'Platform Name or ID',
		name: 'platformId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['mailbox'],
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
		displayName: 'Account Name or ID',
		name: 'accountId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['get', 'rename', 'changePassword', 'delete'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadZimbraAccounts',
			loadOptionsDependsOn: ['platformId'],
		},
		default: '',
		description:
			'The mailbox account (identified by its ID; the list shows the email address). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'New Email',
		name: 'newEmail',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The email address of the mailbox'
	},
	{
		displayName: 'Offer',
		name: 'offer',
		type: 'options',
		options: [
			{
				name: 'Pro',
				value: 'PRO',
			},
			{
				name: 'Starter',
				value: 'STARTER',
			},
		],
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['create'],
			},
		},
		default: 'STARTER',
		description: 'The offer type for the new mailbox',
		required: true,
	},
	{
		displayName: 'Slot Name or ID',
		name: 'slotId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'loadZimbraSlots',
			loadOptionsDependsOn: ['platformId'],
		},
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['create'],
			},
		},
		default: '',
		description:
			'An available slot to assign the mailbox to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Password for the new mailbox',
		required: true,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City for the contact information',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Company name for the contact information',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country for the contact information',
			},
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				description: 'Display name for the mailbox',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name of the user',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name of the user',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				description: 'Phone number for the contact information',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['rename'],
			},
		},
		options: [
			{
				displayName: 'New Display Name',
				name: 'newDisplayName',
				type: 'string',
				default: '',
				description: 'New display name for the mailbox',
			},
			{
				displayName: 'New Email',
				name: 'newEmail',
				type: 'string',
				default: '',
				description: 'New email address for the mailbox',
			},
		],
	},
	{
		displayName: 'New Password',
		name: 'newPassword',
		type: 'string',
		typeOptions: { password: true },
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['changePassword'],
			},
		},
		default: '',
		description: 'New password for the mailbox',
		required: true,
	},
	{
		displayName: 'Alias',
		name: 'alias',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['createAlias'],
			},
		},
		default: '',
		description: 'The alias email address to create',
		required: true,
	},
	{
		displayName: 'Target Account Name or ID',
		name: 'targetId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['createAlias'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadZimbraAccounts',
			loadOptionsDependsOn: ['platformId'],
		},
		default: '',
		description:
			'The mailbox account the alias points to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'Alias Name or ID',
		name: 'aliasId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['deleteAlias'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadZimbraAliases',
			loadOptionsDependsOn: ['platformId'],
		},
		default: '',
		description:
			'The alias to delete. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
	},
	{
		displayName: 'Source',
		name: 'source',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['createRedirection'],
			},
		},
		default: '',
		description: 'The source email address to redirect',
		required: true,
	},
	{
		displayName: 'Destination',
		name: 'destination',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['createRedirection'],
			},
		},
		default: '',
		description: 'The destination email address to redirect to',
		required: true,
	},
	{
		displayName: 'Redirection Name or ID',
		name: 'redirectionId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['mailbox'],
				operation: ['deleteRedirection'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'loadZimbraRedirections',
			loadOptionsDependsOn: ['platformId'],
		},
		default: '',
		description:
			'The redirection to delete. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				resource: ['mailbox'],
				operation: ['list', 'listAliases', 'listRedirections'],
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
				resource: ['mailbox'],
				operation: ['list', 'listAliases', 'listRedirections'],
				returnAll: [false],
			},
		},
	},
];
