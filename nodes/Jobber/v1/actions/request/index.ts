import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { jobberApiRequest, jobberApiRequestAllItems } from '../../transport';
import { REQUEST_FIELDS, removeEmptyProperties } from '../../helpers';

export { requestOperations, requestFields } from './request.operations';

export async function executeRequestOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const requestId = this.getNodeParameter('requestId', itemIndex) as string;

		const query = `
			query GetRequest($id: EncodedId!) {
				request(id: $id) {
					${REQUEST_FIELDS}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { id: requestId },
		});

		responseData = response.request as IDataObject;

	} else if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const query = `
			query GetRequests($first: Int, $after: String, $filter: RequestFilterAttributes) {
				requests(first: $first, after: $after, filter: $filter) {
					edges {
						node {
							${REQUEST_FIELDS}
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
		if (filters.status) {
			variables.filter = { status: filters.status };
		}

		responseData = await jobberApiRequestAllItems.call(
			this,
			{ query, variables },
			'requests',
			limit,
		);

	} else if (operation === 'create') {
throw new Error('Create operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const title = this.getNodeParameter('title', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			title,
			companyName: additionalFields.companyName,
			contactName: additionalFields.contactName,
			phone: additionalFields.phone,
			email: additionalFields.email,
			details: additionalFields.details,
			source: additionalFields.source,
			clientId: additionalFields.clientId,
		});

		const query = `
			mutation CreateRequest($input: RequestCreateInput!) {
				requestCreate(input: $input) {
					request {
						${REQUEST_FIELDS}
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

		const result = response.requestCreate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to create request: ${errors}`);
		}

		responseData = result.request as IDataObject;

	} else if (operation === 'update') {
throw new Error('Update operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const requestId = this.getNodeParameter('requestId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			...updateFields,
		});

		const query = `
			mutation UpdateRequest($requestId: EncodedId!, $input: RequestUpdateInput!) {
				requestUpdate(requestId: $requestId, input: $input) {
					request {
						${REQUEST_FIELDS}
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
			variables: { requestId, input },
		});

		const result = response.requestUpdate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to update request: ${errors}`);
		}

		responseData = result.request as IDataObject;

	} else if (operation === 'delete') {
throw new Error('Delete operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const requestId = this.getNodeParameter('requestId', itemIndex) as string;

		const query = `
			mutation DeleteRequest($requestId: EncodedId!) {
				requestDelete(requestId: $requestId) {
					request {
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
			variables: { requestId },
		});

		const result = response.requestDelete as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to delete request: ${errors}`);
		}

		responseData = { success: true, deletedId: requestId };

	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	if (Array.isArray(responseData)) {
		return responseData.map(data => ({ json: data }));
	}

	return [{ json: responseData }];
}
