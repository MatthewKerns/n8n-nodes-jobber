import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { executeClientOperation } from './client';
import { executeJobOperation } from './job';
import { executeQuoteOperation } from './quote';
import { executeInvoiceOperation } from './invoice';
import { executeGraphQLOperation } from './graphql';

export async function router(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	const resource = this.getNodeParameter('resource', 0) as string;

	for (let i = 0; i < items.length; i++) {
		try {
			const operation = this.getNodeParameter('operation', i) as string;
			let results: INodeExecutionData[];

			switch (resource) {
				case 'client':
					results = await executeClientOperation.call(this, operation, i);
					break;
				case 'job':
					results = await executeJobOperation.call(this, operation, i);
					break;
				case 'quote':
					results = await executeQuoteOperation.call(this, operation, i);
					break;
				case 'invoice':
					results = await executeInvoiceOperation.call(this, operation, i);
					break;
				case 'graphql':
					results = await executeGraphQLOperation.call(this, operation, i);
					break;
				default:
					throw new Error(`Unknown resource: ${resource}`);
			}

			// Add pairedItem information for item linking
			results = results.map(result => ({
				...result,
				pairedItem: { item: i },
			}));

			returnData.push(...results);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return [returnData];
}
