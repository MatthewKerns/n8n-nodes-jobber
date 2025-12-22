import type { INodeProperties } from 'n8n-workflow';

export const graphqlOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['graphql'],
		},
	},
	options: [
		{
			name: 'Execute',
			value: 'execute',
			description: 'Execute a custom GraphQL query or mutation',
			action: 'Execute GraphQL query',
		},
	],
	default: 'execute',
};

export const graphqlFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['graphql'],
				operation: ['execute'],
			},
		},
		placeholder: `query ClientsQuery {
  clients(first: 10) {
    edges {
      node {
        id
        firstName
        lastName
      }
    }
  }
}`,
		description: 'The GraphQL query or mutation to execute',
	},
	{
		displayName: 'Variables',
		name: 'variables',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['graphql'],
				operation: ['execute'],
			},
		},
		placeholder: '{"id": "abc123"}',
		description: 'Variables to pass to the GraphQL query (as JSON)',
	},
	{
		displayName: 'Operation Name',
		name: 'operationName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['graphql'],
				operation: ['execute'],
			},
		},
		description: 'The name of the operation to execute (optional, for queries with multiple operations)',
	},
];
