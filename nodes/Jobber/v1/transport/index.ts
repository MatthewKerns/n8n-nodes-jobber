import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const JOBBER_API_URL = 'https://api.getjobber.com/api/graphql';
const JOBBER_API_VERSION = '2025-04-16';

export interface GraphQLResponse<T = IDataObject> {
	data?: T;
	errors?: Array<{
		message: string;
		path?: string[];
		extensions?: IDataObject;
	}>;
}

export interface JobberRequestOptions {
	query: string;
	variables?: IDataObject;
	operationName?: string;
}

/**
 * Execute a GraphQL request to Jobber API
 */
export async function jobberApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	options: JobberRequestOptions,
): Promise<IDataObject> {
	const requestOptions = {
		method: 'POST' as const,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-JOBBER-GRAPHQL-VERSION': JOBBER_API_VERSION,
		},
		body: {
			query: options.query,
			variables: options.variables || {},
			operationName: options.operationName,
		},
		uri: JOBBER_API_URL,
		json: true,
	};

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'jobberOAuth2Api',
			requestOptions,
		) as GraphQLResponse;

		if (response.errors && response.errors.length > 0) {
			const errorMessages = response.errors.map(e => e.message).join(', ');
			throw new NodeApiError(this.getNode(), response as unknown as JsonObject, {
				message: `Jobber API Error: ${errorMessages}`,
			});
		}

		return response.data || {};
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'Failed to execute Jobber API request',
		});
	}
}

/**
 * Execute a paginated GraphQL query using Relay-style cursor pagination
 */
export async function jobberApiRequestAllItems(
	this: IExecuteFunctions,
	options: JobberRequestOptions,
	dataPath: string,
	limit?: number,
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	let hasNextPage = true;
	let cursor: string | undefined;

	while (hasNextPage) {
		const variables = {
			...options.variables,
			first: Math.min(limit ? limit - results.length : 100, 100),
			after: cursor,
		};

		const response = await jobberApiRequest.call(this, {
			...options,
			variables,
		});

		// Navigate to the data using the path (e.g., 'clients' or 'jobs')
		const pathParts = dataPath.split('.');
		let data: IDataObject = response;
		for (const part of pathParts) {
			data = data[part] as IDataObject;
			if (!data) break;
		}

		if (data) {
			const edges = (data.edges || []) as Array<{ node: IDataObject }>;
			const nodes = edges.map(edge => edge.node);
			results.push(...nodes);

			const pageInfo = data.pageInfo as { hasNextPage: boolean; endCursor: string } | undefined;
			hasNextPage = pageInfo?.hasNextPage || false;
			cursor = pageInfo?.endCursor;

			// Check if we've hit the limit
			if (limit && results.length >= limit) {
				hasNextPage = false;
			}
		} else {
			hasNextPage = false;
		}
	}

	return limit ? results.slice(0, limit) : results;
}
