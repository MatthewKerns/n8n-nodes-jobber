import type { INodeProperties } from 'n8n-workflow';

export const jobOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['job'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new job',
			action: 'Create a job',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a job',
			action: 'Delete a job',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a job by ID',
			action: 'Get a job',
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Get multiple jobs',
			action: 'Get many jobs',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a job',
			action: 'Update a job',
		},
	],
	default: 'getMany',
};

export const jobFields: INodeProperties[] = [
	// ----------------------------------
	//         job: get
	// ----------------------------------
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the job',
	},

	// ----------------------------------
	//         job: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['job'],
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
				resource: ['job'],
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
				resource: ['job'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Search Term',
				name: 'searchTerm',
				type: 'string',
				default: '',
				description: 'Search jobs by title or job number',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Requires Invoicing', value: 'REQUIRES_INVOICING' },
					{ name: 'Active', value: 'ACTIVE' },
					{ name: 'Late', value: 'LATE' },
					{ name: 'Today', value: 'TODAY' },
					{ name: 'Upcoming', value: 'UPCOMING' },
					{ name: 'Unscheduled', value: 'UNSCHEDULED' },
				],
				description: 'Filter by job status',
			},
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				description: 'Filter jobs by client ID',
			},
		],
	},

	// ----------------------------------
	//         job: create
	// ----------------------------------
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		description: 'The ID of the client for this job',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		description: 'Title of the job',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Instructions for the job',
			},
			{
				displayName: 'Start Date',
				name: 'startAt',
				type: 'dateTime',
				default: '',
				description: 'When the job starts',
			},
			{
				displayName: 'End Date',
				name: 'endAt',
				type: 'dateTime',
				default: '',
				description: 'When the job ends',
			},
			{
				displayName: 'Property ID',
				name: 'propertyId',
				type: 'string',
				default: '',
				description: 'The property ID for this job',
			},
		],
	},

	// ----------------------------------
	//         job: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title of the job',
			},
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Instructions for the job',
			},
			{
				displayName: 'Start Date',
				name: 'startAt',
				type: 'dateTime',
				default: '',
				description: 'When the job starts',
			},
			{
				displayName: 'End Date',
				name: 'endAt',
				type: 'dateTime',
				default: '',
				description: 'When the job ends',
			},
		],
	},
];
