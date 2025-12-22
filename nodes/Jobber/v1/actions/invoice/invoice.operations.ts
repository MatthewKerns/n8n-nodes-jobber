import type { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['invoice'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new invoice',
			action: 'Create an invoice',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete an invoice',
			action: 'Delete an invoice',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get an invoice by ID',
			action: 'Get an invoice',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get multiple invoices',
			action: 'Get many invoices',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update an invoice',
			action: 'Update an invoice',
		},
	],
	default: 'getMany',
};

export const invoiceFields: INodeProperties[] = [
	// ----------------------------------
	//         invoice: get
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the invoice',
	},

	// ----------------------------------
	//         invoice: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Search Term',
				name: 'searchTerm',
				type: 'string',
				default: '',
				description: 'Search invoices by subject or invoice number',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Draft', value: 'DRAFT' },
					{ name: 'Awaiting Payment', value: 'AWAITING_PAYMENT' },
					{ name: 'Paid', value: 'PAID' },
					{ name: 'Past Due', value: 'PAST_DUE' },
					{ name: 'Bad Debt', value: 'BAD_DEBT' },
				],
				description: 'Filter by invoice status',
			},
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				description: 'Filter invoices by client ID',
			},
		],
	},

	// ----------------------------------
	//         invoice: create
	// ----------------------------------
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['create'],
			},
		},
		description: 'The ID of the client for this invoice',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Subject of the invoice',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Message/notes for the invoice',
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
				description: 'When the invoice is due',
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				default: '',
				description: 'Link this invoice to a job',
			},
		],
	},

	// ----------------------------------
	//         invoice: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Subject of the invoice',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Message/notes for the invoice',
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
				description: 'When the invoice is due',
			},
		],
	},
];
