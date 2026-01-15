import type { INodeProperties } from 'n8n-workflow';

export const requestOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['request'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new request',
			action: 'Create a request',
		},
		{
			name: 'Create Note',
			value: 'createNote',
			description: 'Add a note to an existing request',
			action: 'Create a note on a request',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a request',
			action: 'Delete a request',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a request by ID',
			action: 'Get a request',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get multiple requests',
			action: 'Get many requests',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a request',
			action: 'Update a request',
		},
	],
	default: 'getMany',
};

export const requestFields: INodeProperties[] = [
	// ----------------------------------
	//         request: get
	// ----------------------------------
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the request',
	},

	// ----------------------------------
	//         request: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['request'],
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
		},
		displayOptions: {
			show: {
				resource: ['request'],
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
				resource: ['request'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				description: 'Filter requests by client ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Converted', value: 'CONVERTED' },
					{ name: 'Archived', value: 'ARCHIVED' },
				],
				description: 'Filter requests by status',
			},
		],
	},

	// ----------------------------------
	//         request: createNote
	// ----------------------------------
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['createNote'],
			},
		},
		description: 'The ID of the request to add a note to',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['createNote'],
			},
		},
		description: 'The content of the note',
	},

	// ----------------------------------
	//         request: create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['create'],
			},
		},
		description: 'Title of the request',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				description: 'ID of an existing client to associate with this request',
			},
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				default: '',
				description: 'Company name for the request',
			},
			{
				displayName: 'Contact Name',
				name: 'contactName',
				type: 'string',
				default: '',
				description: 'Contact name for the request',
			},
			{
				displayName: 'Details',
				name: 'details',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Details or description of the request',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email address for the request',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for the request',
			},
			{
				displayName: 'Source',
				name: 'source',
				type: 'string',
				default: '',
				description: 'Source of the request (e.g., website, referral)',
			},
		],
	},

	// ----------------------------------
	//         request: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				default: '',
				description: 'Company name for the request',
			},
			{
				displayName: 'Contact Name',
				name: 'contactName',
				type: 'string',
				default: '',
				description: 'Contact name for the request',
			},
			{
				displayName: 'Details',
				name: 'details',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Details or description of the request',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email address for the request',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for the request',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'PENDING',
				options: [
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Converted', value: 'CONVERTED' },
					{ name: 'Archived', value: 'ARCHIVED' },
				],
				description: 'Status of the request',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title of the request',
			},
		],
	},
];
