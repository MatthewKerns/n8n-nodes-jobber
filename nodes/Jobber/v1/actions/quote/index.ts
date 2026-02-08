import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { jobberApiRequest, jobberApiRequestAllItems } from '../../transport';
import { QUOTE_FIELDS, JOB_FIELDS, removeEmptyProperties } from '../../helpers';

export { quoteOperations, quoteFields } from './quote.operations';

export async function executeQuoteOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const quoteId = this.getNodeParameter('quoteId', itemIndex) as string;

		const query = `
			query GetQuote($id: EncodedId!) {
				quote(id: $id) {
					${QUOTE_FIELDS}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { id: quoteId },
		});

		responseData = response.quote as IDataObject;

	} else if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const query = `
			query GetQuotes($first: Int, $after: String, $searchTerm: String) {
				quotes(first: $first, after: $after, searchTerm: $searchTerm) {
					edges {
						node {
							${QUOTE_FIELDS}
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		`;

		const variables: IDataObject = {};
		if (filters.searchTerm) {
			variables.searchTerm = filters.searchTerm;
		}

		responseData = await jobberApiRequestAllItems.call(
			this,
			{ query, variables },
			'quotes',
			limit,
		);

	} else if (operation === 'create') {
throw new Error('Create operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const clientId = this.getNodeParameter('clientId', itemIndex) as string;
		const title = this.getNodeParameter('title', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			clientId,
			title,
			message: additionalFields.message,
			propertyId: additionalFields.propertyId,
		});

		const query = `
			mutation CreateQuote($input: QuoteCreateInput!) {
				quoteCreate(input: $input) {
					quote {
						${QUOTE_FIELDS}
					}
					userErrors {
						message
						path
					}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { input },
		});

		const result = response.quoteCreate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to create quote: ${errors}`);
		}

		responseData = result.quote as IDataObject;

	} else if (operation === 'update') {
throw new Error('Update operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const quoteId = this.getNodeParameter('quoteId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			...updateFields,
		});

		const query = `
			mutation UpdateQuote($quoteId: EncodedId!, $input: QuoteUpdateInput!) {
				quoteUpdate(quoteId: $quoteId, input: $input) {
					quote {
						${QUOTE_FIELDS}
					}
					userErrors {
						message
						path
					}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { quoteId, input },
		});

		const result = response.quoteUpdate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to update quote: ${errors}`);
		}

		responseData = result.quote as IDataObject;

	} else if (operation === 'delete') {
throw new Error('Delete operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const quoteId = this.getNodeParameter('quoteId', itemIndex) as string;

		const query = `
			mutation DeleteQuote($quoteId: EncodedId!) {
				quoteDelete(quoteId: $quoteId) {
					quote {
						id
					}
					userErrors {
						message
						path
					}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { quoteId },
		});

		const result = response.quoteDelete as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to delete quote: ${errors}`);
		}

		responseData = { success: true, deletedId: quoteId };

	} else if (operation === 'convertToJob') {
		throw new Error('Convert to Job operation is disabled in read-only mode. Use JobberWriteTool for write operations.');
		const quoteId = this.getNodeParameter('quoteId', itemIndex) as string;

		const query = `
			mutation ConvertQuoteToJob($quoteId: EncodedId!) {
				quoteToJob(quoteId: $quoteId) {
					job {
						${JOB_FIELDS}
					}
					userErrors {
						message
						path
					}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { quoteId },
		});

		const result = response.quoteToJob as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to convert quote to job: ${errors}`);
		}

		responseData = result.job as IDataObject;

	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	if (Array.isArray(responseData)) {
		return responseData.map(data => ({ json: data }));
	}

	return [{ json: responseData }];
}
