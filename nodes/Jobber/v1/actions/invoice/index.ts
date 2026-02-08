import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { jobberApiRequest, jobberApiRequestAllItems } from '../../transport';
import { INVOICE_FIELDS, removeEmptyProperties } from '../../helpers';

export { invoiceOperations, invoiceFields } from './invoice.operations';

export async function executeInvoiceOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;

		const query = `
			query GetInvoice($id: EncodedId!) {
				invoice(id: $id) {
					${INVOICE_FIELDS}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { id: invoiceId },
		});

		responseData = response.invoice as IDataObject;

	} else if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const query = `
			query GetInvoices($first: Int, $after: String, $searchTerm: String) {
				invoices(first: $first, after: $after, searchTerm: $searchTerm) {
					edges {
						node {
							${INVOICE_FIELDS}
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
			'invoices',
			limit,
		);

	} else if (operation === 'create') {
throw new Error('Create operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const clientId = this.getNodeParameter('clientId', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			clientId,
			subject: additionalFields.subject,
			message: additionalFields.message,
			dueDate: additionalFields.dueDate,
			jobId: additionalFields.jobId,
		});

		const query = `
			mutation CreateInvoice($input: InvoiceCreateInput!) {
				invoiceCreate(input: $input) {
					invoice {
						${INVOICE_FIELDS}
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

		const result = response.invoiceCreate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to create invoice: ${errors}`);
		}

		responseData = result.invoice as IDataObject;

	} else if (operation === 'update') {
throw new Error('Update operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			...updateFields,
		});

		const query = `
			mutation UpdateInvoice($invoiceId: EncodedId!, $input: InvoiceUpdateInput!) {
				invoiceUpdate(invoiceId: $invoiceId, input: $input) {
					invoice {
						${INVOICE_FIELDS}
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
			variables: { invoiceId, input },
		});

		const result = response.invoiceUpdate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to update invoice: ${errors}`);
		}

		responseData = result.invoice as IDataObject;

	} else if (operation === 'delete') {
throw new Error('Delete operation is disabled in read-only mode. Use JobberWriteTool for write operations.');

		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;

		const query = `
			mutation DeleteInvoice($invoiceId: EncodedId!) {
				invoiceDelete(invoiceId: $invoiceId) {
					invoice {
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
			variables: { invoiceId },
		});

		const result = response.invoiceDelete as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to delete invoice: ${errors}`);
		}

		responseData = { success: true, deletedId: invoiceId };

	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	if (Array.isArray(responseData)) {
		return responseData.map(data => ({ json: data }));
	}

	return [{ json: responseData }];
}
