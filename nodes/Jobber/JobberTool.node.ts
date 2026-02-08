import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

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
				default: 'Query Jobber CRM for clients, jobs, quotes, and invoices using GraphQL. Provide a GraphQL query string. Common queries: search clients by name, get job/quote/invoice by ID, list recent jobs.',
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
      phones
    }
  }
}`,
				description: 'The GraphQL query to execute',
				typeOptions: {
					rows: 10,
				},
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: any[] = [];

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
}
