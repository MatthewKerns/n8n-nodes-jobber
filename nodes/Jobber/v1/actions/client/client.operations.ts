import type { INodeProperties } from 'n8n-workflow';

export const clientOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['client'],
		},
	},
	options: [
		// Write operations commented out - read-only mode
		// {
		// 	name: 'Create',
		// 	value: 'create',
		// 	description: 'Create a new client',
		// 	action: 'Create a client',
		// },
		// {
		// 	name: 'Delete',
		// 	value: 'delete',
		// 	description: 'Delete a client',
		// 	action: 'Delete a client',
		// },
		{
			name: 'Get',
			value: 'get',
			description: 'Get a client by ID',
			action: 'Get a client',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get multiple clients',
			action: 'Get many clients',
		},
		// {
		// 	name: 'Update',
		// 	value: 'update',
		// 	description: 'Update a client',
		// 	action: 'Update a client',
		// },
	],
	default: 'getMany',
};

export const clientFields: INodeProperties[] = [
	// ----------------------------------
	//         client: get
	// ----------------------------------
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['get'], // Removed 'update', 'delete' - read-only mode
			},
		},
		description: 'The ID of the client',
	},

	// ----------------------------------
	//         client: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['client'],
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
				resource: ['client'],
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
				resource: ['client'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Search Term',
				name: 'searchTerm',
				type: 'string',
				default: '',
				description: 'Search clients by name, email, or phone',
			},
			{
				displayName: 'Is Lead',
				name: 'isLead',
				type: 'boolean',
				default: false,
				description: 'Whether to filter to only leads',
			},
		],
	},

	// ----------------------------------
	//         client: create (COMMENTED OUT - READ-ONLY MODE)
	// ----------------------------------
	// {
	// 	displayName: 'First Name',
	// 	name: 'firstName',
	// 	type: 'string',
	// 	default: '',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['client'],
	// 			operation: ['create'],
	// 		},
	// 	},
	// 	description: 'First name of the client',
	// },
	// {
	// 	displayName: 'Last Name',
	// 	name: 'lastName',
	// 	type: 'string',
	// 	default: '',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['client'],
	// 			operation: ['create'],
	// 		},
	// 	},
	// 	description: 'Last name of the client',
	// },
	// {
	// 	displayName: 'Company Name',
	// 	name: 'companyName',
	// 	type: 'string',
	// 	default: '',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['client'],
	// 			operation: ['create'],
	// 		},
	// 	},
	// 	description: 'Company name of the client',
	// },
	// {
	// 	displayName: 'Additional Fields',
	// 	name: 'additionalFields',
	// 	type: 'collection',
	// 	placeholder: 'Add Field',
	// 	default: {},
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['client'],
	// 			operation: ['create'],
	// 		},
	// 	},
	// 	options: [
	// 		{
	// 			displayName: 'Title',
	// 			name: 'title',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Title of the client (e.g., Mr., Mrs.)',
	// 		},
	// 		{
	// 			displayName: 'Is Company',
	// 			name: 'isCompany',
	// 			type: 'boolean',
	// 			default: false,
	// 			description: 'Whether this client is a company',
	// 		},
	// 		{
	// 			displayName: 'Email',
	// 			name: 'email',
	// 			type: 'string',
	// 			placeholder: 'name@email.com',
	// 			default: '',
	// 			description: 'Primary email address',
	// 		},
	// 		{
	// 			displayName: 'Phone',
	// 			name: 'phone',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Primary phone number',
	// 		},
	// 	],
	// },

	// ----------------------------------
	//         client: update (COMMENTED OUT - READ-ONLY MODE)
	// ----------------------------------
	// {
	// 	displayName: 'Update Fields',
	// 	name: 'updateFields',
	// 	type: 'collection',
	// 	placeholder: 'Add Field',
	// 	default: {},
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['client'],
	// 			operation: ['update'],
	// 		},
	// 	},
	// 	options: [
	// 		{
	// 			displayName: 'First Name',
	// 			name: 'firstName',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'First name of the client',
	// 		},
	// 		{
	// 			displayName: 'Last Name',
	// 			name: 'lastName',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Last name of the client',
	// 		},
	// 		{
	// 			displayName: 'Company Name',
	// 			name: 'companyName',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Company name of the client',
	// 		},
	// 		{
	// 			displayName: 'Title',
	// 			name: 'title',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Title of the client',
	// 		},
	// 		{
	// 			displayName: 'Is Company',
	// 			name: 'isCompany',
	// 			type: 'boolean',
	// 			default: false,
	// 			description: 'Whether this client is a company',
	// 		},
	// 	],
	// },
];
