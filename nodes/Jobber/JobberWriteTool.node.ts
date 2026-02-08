import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { ApplicationError } from 'n8n-workflow';

export class JobberWriteTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jobber Write Tool',
		name: 'jobberWriteTool',
		icon: 'file:jobber.svg',
		group: ['transform'],
		version: 1,
		description: 'AI Tool for creating/updating/deleting data in Jobber CRM using GraphQL mutations',
		defaults: {
			name: 'Jobber Write Tool',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Tools'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://github.com/MatthewKerns/n8n-nodes-jobber',
					},
				],
			},
		},
		inputs: ['main'],
		outputs: ['main'],
		outputNames: ['ai_tool'],
		credentials: [
			{
				name: 'jobberOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: 'jobber_write',
				description: 'The name of the function to be called, could contain underscores',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: 'Create, update, or delete data in Jobber CRM using GraphQL mutations. Operations: clientCreate, clientUpdate, jobCreate, quoteCreate, invoiceCreate, etc. IMPORTANT: This tool MODIFIES data - use with caution. Always confirm with user before executing writes.',
				description:
					'Used by the AI to understand when to call this tool',
				typeOptions: {
					rows: 3,
				},
			},
			{
				displayName: 'GraphQL Mutation',
				name: 'mutation',
				type: 'string',
				default: `mutation {
  clientCreate(input: {
    firstName: "John"
    lastName: "Doe"
    phones: [{number: "555-1234", primary: true}]
    emails: [{address: "john@example.com", primary: true}]
  }) {
    client {
      id
      name
      phones { number }
      emails { address }
    }
  }
}`,
				description: 'GraphQL mutation to execute. Common mutations: clientCreate, clientUpdate, jobCreate, quoteCreate, invoiceCreate. Always include return fields to confirm the operation succeeded.',
				typeOptions: {
					rows: 15,
				},
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// For AI Tool: read from incoming JSON data (from AI agent)
				// For manual execution: fall back to node parameters
				const inputData = items[i].json;
				const mutation = (inputData.mutation as string) || (this.getNodeParameter('mutation', i) as string);

				// Validate that this is actually a mutation (safety check)
				const trimmedMutation = String(mutation).trim().toLowerCase();
				if (!trimmedMutation.startsWith('mutation')) {
					throw new ApplicationError('JobberWriteTool only accepts GraphQL mutations (not queries). Use JobberTool for read operations.');
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'jobberOAuth2Api',
					{
						method: 'POST',
						url: 'https://api.getjobber.com/api/graphql',
						headers: {
							'Content-Type': 'application/json',
							'X-JOBBER-GRAPHQL-VERSION': '2025-04-16',
						},
						body: {
							query: mutation,
						},
					},
				);

				returnData.push({
					json: response,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : 'Unknown error' },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
