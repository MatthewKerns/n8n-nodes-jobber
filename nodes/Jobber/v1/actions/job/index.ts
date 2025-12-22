import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { jobberApiRequest, jobberApiRequestAllItems } from '../../transport';
import { JOB_FIELDS, removeEmptyProperties } from '../../helpers';

export { jobOperations, jobFields } from './job.operations';

export async function executeJobOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const jobId = this.getNodeParameter('jobId', itemIndex) as string;

		const query = `
			query GetJob($id: EncodedId!) {
				job(id: $id) {
					${JOB_FIELDS}
				}
			}
		`;

		const response = await jobberApiRequest.call(this, {
			query,
			variables: { id: jobId },
		});

		responseData = response.job as IDataObject;

	} else if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const query = `
			query GetJobs($first: Int, $after: String, $searchTerm: String) {
				jobs(first: $first, after: $after, searchTerm: $searchTerm) {
					edges {
						node {
							${JOB_FIELDS}
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
			'jobs',
			limit,
		);

	} else if (operation === 'create') {
		const clientId = this.getNodeParameter('clientId', itemIndex) as string;
		const title = this.getNodeParameter('title', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			clientId,
			title,
			instructions: additionalFields.instructions,
			startAt: additionalFields.startAt,
			endAt: additionalFields.endAt,
			propertyId: additionalFields.propertyId,
		});

		const query = `
			mutation CreateJob($input: JobCreateInput!) {
				jobCreate(input: $input) {
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
			variables: { input },
		});

		const result = response.jobCreate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to create job: ${errors}`);
		}

		responseData = result.job as IDataObject;

	} else if (operation === 'update') {
		const jobId = this.getNodeParameter('jobId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const input: IDataObject = removeEmptyProperties({
			...updateFields,
		});

		const query = `
			mutation UpdateJob($jobId: EncodedId!, $input: JobUpdateInput!) {
				jobUpdate(jobId: $jobId, input: $input) {
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
			variables: { jobId, input },
		});

		const result = response.jobUpdate as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to update job: ${errors}`);
		}

		responseData = result.job as IDataObject;

	} else if (operation === 'delete') {
		const jobId = this.getNodeParameter('jobId', itemIndex) as string;

		const query = `
			mutation DeleteJob($jobId: EncodedId!) {
				jobDelete(jobId: $jobId) {
					job {
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
			variables: { jobId },
		});

		const result = response.jobDelete as IDataObject;
		if (result.userErrors && (result.userErrors as IDataObject[]).length > 0) {
			const errors = (result.userErrors as Array<{ message: string }>)
				.map(e => e.message)
				.join(', ');
			throw new Error(`Failed to delete job: ${errors}`);
		}

		responseData = { success: true, deletedId: jobId };

	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	if (Array.isArray(responseData)) {
		return responseData.map(data => ({ json: data }));
	}

	return [{ json: responseData }];
}
