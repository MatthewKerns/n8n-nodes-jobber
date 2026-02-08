import type { INodeProperties } from 'n8n-workflow';

export const quoteOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['quote'],
		},
	},
	options: [
		// Write operations commented out - read-only mode
		// {
		// 	name: 'Convert to Job',
		// 	value: 'convertToJob',
		// 	description: 'Convert a quote to a job',
		// 	action: 'Convert quote to job',
		// },

		// {

		// name: 'Create',

		// value: 'create',

		// description: 'Create a new quote',

		// action: 'Create a quote',

		// },

		// {

		// name: 'Delete',

		// value: 'delete',

		// description: 'Delete a quote',

		// action: 'Delete a quote',

		// },
		{
			name: 'Get',
			value: 'get',
			description: 'Get a quote by ID',
			action: 'Get a quote',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get multiple quotes',
			action: 'Get many quotes',
		},

		// {

		// name: 'Update',

		// value: 'update',

		// description: 'Update a quote',

		// action: 'Update a quote',

		// },
	],
	default: 'getMany',
};

export const quoteFields: INodeProperties[] = [
	// ----------------------------------
	//         quote: get
	// ----------------------------------
	{
		displayName: 'Quote ID',
		name: 'quoteId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['get'] // Removed 'update', 'delete' - read-only mode,
			},
		},
		description: 'The ID of the quote',
	},

	// ----------------------------------
	//         quote: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['quote'],
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
				resource: ['quote'],
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
				resource: ['quote'],
				operation: ['getMany'],
			},
		},
		options: [
		// Write operations commented out - read-only mode
			{
				displayName: 'Search Term',
				name: 'searchTerm',
				type: 'string',
				default: '',
				description: 'Search quotes by title or quote number',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				options: [
		// Write operations commented out - read-only mode
					{ name: 'All', value: '' },
					{ name: 'Draft', value: 'DRAFT' },
					{ name: 'Awaiting Response', value: 'AWAITING_RESPONSE' },
					{ name: 'Approved', value: 'APPROVED' },
					{ name: 'Converted', value: 'CONVERTED' },
					{ name: 'Archived', value: 'ARCHIVED' },
				],
				description: 'Filter by quote status',
			},
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				description: 'Filter quotes by client ID',
			},
		],
	},

	// ----------------------------------


	//         quote: create (COMMENTED OUT - READ-ONLY MODE)


	// ----------------------------------


	// 	{


	// 		displayName: 'Client ID',


	// 		name: 'clientId',


	// 		type: 'string',


	// 		required: true,


	// 		default: '',


	// 		displayOptions: {


	// 			show: {


	// 				resource: ['quote'],


	// 				operation: ['create'],


	// 			},


	// 		},


	// 		description: 'The ID of the client for this quote',


	// 	},


	// 	{


	// 		displayName: 'Title',


	// 		name: 'title',


	// 		type: 'string',


	// 		default: '',


	// 		displayOptions: {


	// 			show: {


	// 				resource: ['quote'],


	// 				operation: ['create'],


	// 			},


	// 		},


	// 		description: 'Title of the quote',


	// 	},


	// 	{


	// 		displayName: 'Additional Fields',


	// 		name: 'additionalFields',


	// 		type: 'collection',


	// 		placeholder: 'Add Field',


	// 		default: {},


	// 		displayOptions: {


	// 			show: {


	// 				resource: ['quote'],


	// 				operation: ['create'],


	// 			},


	// 		},


	// 		options: [
		// Write operations commented out - read-only mode


	// 			{


	// 				displayName: 'Message',


	// 				name: 'message',


	// 				type: 'string',


	// 				typeOptions: {


	// 					rows: 4,


	// 				},


	// 				default: '',


	// 				description: 'Message/notes for the quote',


	// 			},


	// 			{


	// 				displayName: 'Property ID',


	// 				name: 'propertyId',


	// 				type: 'string',


	// 				default: '',


	// 				description: 'The property ID for this quote',


	// 			},


	// 		],


	// 	},

	// ----------------------------------


	//         quote: update (COMMENTED OUT - READ-ONLY MODE)


	// ----------------------------------


	// 	{


	// 		displayName: 'Update Fields',


	// 		name: 'updateFields',


	// 		type: 'collection',


	// 		placeholder: 'Add Field',


	// 		default: {},


	// 		displayOptions: {


	// 			show: {


	// 				resource: ['quote'],


	// 				operation: ['update'],


	// 			},


	// 		},


	// 		options: [
		// Write operations commented out - read-only mode


	// 			{


	// 				displayName: 'Title',


	// 				name: 'title',


	// 				type: 'string',


	// 				default: '',


	// 				description: 'Title of the quote',


	// 			},


	// 			{


	// 				displayName: 'Message',


	// 				name: 'message',


	// 				type: 'string',


	// 				typeOptions: {


	// 					rows: 4,


	// 				},


	// 				default: '',


	// 				description: 'Message/notes for the quote',


	// 			},


	// 		],


	// 	},
];
