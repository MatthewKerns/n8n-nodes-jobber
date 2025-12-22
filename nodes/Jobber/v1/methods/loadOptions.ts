import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { jobberApiRequest } from '../transport';

/**
 * Load clients for dropdown selection
 */
export async function getClients(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = `
		query GetClientsForDropdown {
			clients(first: 100) {
				edges {
					node {
						id
						firstName
						lastName
						companyName
						isCompany
					}
				}
			}
		}
	`;

	const response = await jobberApiRequest.call(this, { query });
	const clients = response.clients as {
		edges: Array<{
			node: {
				id: string;
				firstName: string;
				lastName: string;
				companyName: string;
				isCompany: boolean;
			};
		}>;
	};

	return clients.edges.map(({ node }) => {
		const displayName = node.isCompany
			? node.companyName || `${node.firstName} ${node.lastName}`
			: `${node.firstName} ${node.lastName}`.trim() || node.companyName;

		return {
			name: displayName,
			value: node.id,
		};
	});
}

/**
 * Load jobs for dropdown selection
 */
export async function getJobs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = `
		query GetJobsForDropdown {
			jobs(first: 100) {
				edges {
					node {
						id
						title
						jobNumber
					}
				}
			}
		}
	`;

	const response = await jobberApiRequest.call(this, { query });
	const jobs = response.jobs as {
		edges: Array<{
			node: {
				id: string;
				title: string;
				jobNumber: number;
			};
		}>;
	};

	return jobs.edges.map(({ node }) => ({
		name: `#${node.jobNumber} - ${node.title || 'Untitled'}`,
		value: node.id,
	}));
}

/**
 * Load quotes for dropdown selection
 */
export async function getQuotes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = `
		query GetQuotesForDropdown {
			quotes(first: 100) {
				edges {
					node {
						id
						title
						quoteNumber
					}
				}
			}
		}
	`;

	const response = await jobberApiRequest.call(this, { query });
	const quotes = response.quotes as {
		edges: Array<{
			node: {
				id: string;
				title: string;
				quoteNumber: number;
			};
		}>;
	};

	return quotes.edges.map(({ node }) => ({
		name: `#${node.quoteNumber} - ${node.title || 'Untitled'}`,
		value: node.id,
	}));
}
