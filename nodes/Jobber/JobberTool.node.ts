import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
} from 'n8n-workflow';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export class JobberTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jobber Tool',
		name: 'jobberTool',
		icon: 'file:jobber.svg',
		group: ['transform'],
		version: 1,
		description: 'AI Tool for querying Jobber CRM (clients, jobs, quotes, invoices)',
		defaults: {
			name: 'Jobber Tool',
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
		inputs: [],
		outputs: ['ai_tool'],
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
				default: 'jobber_query',
				description: 'The name of the function to be called, could contain underscores',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: 'Query Jobber CRM for clients, jobs, quotes, and invoices using GraphQL. IMPORTANT: Object fields (phones, emails, addresses) MUST include sub-fields using curly braces, e.g., phones { number } not just phones. Example: query { clients(first: 10) { nodes { id name phones { number } emails { address } } } }',
				description:
					'Used by the AI to understand when to call this tool',
				typeOptions: {
					rows: 3,
				},
			},
			{
				displayName: 'GraphQL Query',
				name: 'query',
				type: 'string',
				default: `query {
  clients(first: 10) {
    nodes {
      id
      name
      phones { number description primary }
      emails { address primary }
    }
  }
}`,
				description: 'GraphQL query to execute. Object fields like phones, emails, addresses must include sub-fields: phones { number } not just phones. Common patterns: clients { nodes { id name phones { number } } }, jobs(clientId: "123") { nodes { id title } }',
				typeOptions: {
					rows: 10,
				},
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const query = this.getNodeParameter('query', i) as string;

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
							query,
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

	async supplyData(this: ISupplyDataFunctions): Promise<SupplyData> {
		const name = this.getNodeParameter('name', 0) as string;
		const description = this.getNodeParameter('description', 0) as string;

		const schema = z.object({
			query: z.string().describe('GraphQL query to execute. CRITICAL: Object fields (phones, emails, addresses) MUST include sub-fields in curly braces. Example: query { clients(first: 10) { nodes { id name phones { number description primary } emails { address primary } } } }'),
		});

		const tool = new DynamicStructuredTool({
			name,
			description,
			schema,
			func: async (input) => {
				const credentials = await this.getCredentials('jobberOAuth2Api') as any;

				const response = await fetch('https://api.getjobber.com/api/graphql', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-JOBBER-GRAPHQL-VERSION': '2025-04-16',
						'Authorization': `Bearer ${credentials.oauthTokenData?.access_token || credentials.accessToken}`,
					},
					body: JSON.stringify({
						query: input.query,
					}),
				});

				const data = await response.json();
				return JSON.stringify(data);
			},
		});

		return {
			response: tool,
		};
	}
}
