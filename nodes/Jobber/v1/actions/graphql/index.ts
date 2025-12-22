import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { jobberApiRequest } from '../../transport';

export { graphqlOperations, graphqlFields } from './graphql.operations';

export async function executeGraphQLOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	if (operation !== 'execute') {
		throw new Error(`Unknown operation: ${operation}`);
	}

	const query = this.getNodeParameter('query', itemIndex) as string;
	const variablesJson = this.getNodeParameter('variables', itemIndex, '{}') as string;
	const operationName = this.getNodeParameter('operationName', itemIndex, '') as string;

	let variables: IDataObject = {};
	try {
		variables = JSON.parse(variablesJson) as IDataObject;
	} catch {
		throw new Error('Variables must be valid JSON');
	}

	const response = await jobberApiRequest.call(this, {
		query,
		variables,
		operationName: operationName || undefined,
	});

	return [{ json: response }];
}
