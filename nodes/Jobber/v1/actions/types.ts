import type { INodeProperties } from 'n8n-workflow';

export type JobberResource = 'client' | 'job' | 'quote' | 'invoice' | 'graphql';

export type ClientOperation = 'get' | 'getMany' | 'create' | 'update' | 'delete';
export type JobOperation = 'get' | 'getMany' | 'create' | 'update' | 'delete';
export type QuoteOperation = 'get' | 'getMany' | 'create' | 'update' | 'delete' | 'convertToJob';
export type InvoiceOperation = 'get' | 'getMany' | 'create' | 'update' | 'delete';
export type GraphQLOperation = 'execute';

export interface ResourceDescription {
	name: JobberResource;
	value: JobberResource;
	description: string;
}

export interface OperationDescription {
	name: string;
	value: string;
	description: string;
	action: string;
}

export const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Client',
			value: 'client',
			description: 'Manage clients',
		},
		{
			name: 'Job',
			value: 'job',
			description: 'Manage jobs',
		},
		{
			name: 'Quote',
			value: 'quote',
			description: 'Manage quotes',
		},
		{
			name: 'Invoice',
			value: 'invoice',
			description: 'Manage invoices',
		},
		{
			name: 'GraphQL',
			value: 'graphql',
			description: 'Execute custom GraphQL queries',
		},
	],
	default: 'client',
};
