import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
} from 'n8n-workflow';

import { resourceProperty } from './actions/types';
import { clientOperations, clientFields } from './actions/client';
import { jobOperations, jobFields } from './actions/job';
import { quoteOperations, quoteFields } from './actions/quote';
import { invoiceOperations, invoiceFields } from './actions/invoice';
import { graphqlOperations, graphqlFields } from './actions/graphql';
import { router } from './actions/router';

export class JobberV1 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jobber',
		name: 'jobber',
		icon: 'file:../jobber.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Jobber API - field service management',
		defaults: {
			name: 'Jobber',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'jobberOAuth2Api',
				required: true,
			},
		],
		properties: [
			resourceProperty,
			// Client
			clientOperations,
			...clientFields,
			// Job
			jobOperations,
			...jobFields,
			// Quote
			quoteOperations,
			...quoteFields,
			// Invoice
			invoiceOperations,
			...invoiceFields,
			// GraphQL
			graphqlOperations,
			...graphqlFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return router.call(this);
	}
}
