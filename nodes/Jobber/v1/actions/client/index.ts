import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { jobberApiRequest, jobberApiRequestAllItems } from '../../transport';
import { CLIENT_FIELDS, removeEmptyProperties } from '../../helpers';

export { clientOperations, clientFields } from './client.operations';

export async function executeClientOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const clientId = this.getNodeParameter('clientId', itemIndex) as string;

		const query = `
			query GetClient($id: EncodedId!) {
				client(id: $id) {
					${CLIENT_FIELDS}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { id: clientId },
		});

		responseData = response.client as IDataObject;

	} else if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const query = `
			query GetClients($first: Int, $after: String, $searchTerm: String) {
				clients(first: $first, after: $after, searchTerm: $searchTerm) {
					edges {
						node {
							${CLIENT_FIELDS}
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
			'clients',
			limit,
		);

	} else if (operation === 'create') {
throw new Error('Create operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const firstName = this.getNodeParameter('firstName', itemIndex) as string;
		const lastName = this.getNodeParameter('lastName', itemIndex) as string;
		const companyName = this.getNodeParameter('companyName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			firstName,
			lastName,
			companyName,
			title: additionalFields.title,
			isCompany: additionalFields.isCompany,
		});

		// Handle email if provided
		if (additionalFields.email) {
			input.emails = [{ description: 'MAIN', address: additionalFields.email }];
		}

		// Handle phone if provided
		if (additionalFields.phone) {
			input.phones = [{ description: 'MAIN', number: additionalFields.phone }];
		}

		const query = `
			mutation CreateClient($input: ClientCreateInput!) {
				clientCreate(input: $input) {
					client {
						${CLIENT_FIELDS}
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

		const result = response.clientCreate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to create client: ${errors}`);
		}

		responseData = result.client as IDataObject;

	} else if (operation === 'update') {
throw new Error('Update operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const clientId = this.getNodeParameter('clientId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			...updateFields,
		});

		const query = `
			mutation UpdateClient($clientId: EncodedId!, $input: ClientUpdateInput!) {
				clientUpdate(clientId: $clientId, input: $input) {
					client {
						${CLIENT_FIELDS}
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
			variables: { clientId, input },
		});

		const result = response.clientUpdate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to update client: ${errors}`);
		}

		responseData = result.client as IDataObject;

	} else if (operation === 'delete') {
throw new Error('Delete operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const clientId = this.getNodeParameter('clientId', itemIndex) as string;

		const query = `
			mutation DeleteClient($clientId: EncodedId!) {
				clientDelete(clientId: $clientId) {
					client {
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
			variables: { clientId },
		});

		const result = response.clientDelete as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to delete client: ${errors}`);
		}

		responseData = { success: true, deletedId: clientId };

	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	if (Array.isArray(responseData)) {
		return responseData.map(data => ({ json: data }));
	}

	return [{ json: responseData }];
}
