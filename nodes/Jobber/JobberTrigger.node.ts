import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';
import crypto from 'crypto';

export class JobberTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jobber Trigger',
		name: 'jobberTrigger',
		icon: 'file:jobber.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when a Jobber event occurs',
		defaults: {
			name: 'Jobber Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'jobberOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'CLIENT_CREATE',
				options: [
					// Client events
					{
						name: 'Client Created',
						value: 'CLIENT_CREATE',
						description: 'Triggered when a new client is created',
					},
					{
						name: 'Client Updated',
						value: 'CLIENT_UPDATE',
						description: 'Triggered when a client is updated',
					},
					{
						name: 'Client Deleted',
						value: 'CLIENT_DESTROY',
						description: 'Triggered when a client is deleted',
					},
					// Job events
					{
						name: 'Job Created',
						value: 'JOB_CREATE',
						description: 'Triggered when a new job is created',
					},
					{
						name: 'Job Updated',
						value: 'JOB_UPDATE',
						description: 'Triggered when a job is updated',
					},
					{
						name: 'Job Deleted',
						value: 'JOB_DESTROY',
						description: 'Triggered when a job is deleted',
					},
					// Quote events
					{
						name: 'Quote Created',
						value: 'QUOTE_CREATE',
						description: 'Triggered when a new quote is created',
					},
					{
						name: 'Quote Updated',
						value: 'QUOTE_UPDATE',
						description: 'Triggered when a quote is updated',
					},
					{
						name: 'Quote Deleted',
						value: 'QUOTE_DESTROY',
						description: 'Triggered when a quote is deleted',
					},
					// Invoice events
					{
						name: 'Invoice Created',
						value: 'INVOICE_CREATE',
						description: 'Triggered when a new invoice is created',
					},
					{
						name: 'Invoice Updated',
						value: 'INVOICE_UPDATE',
						description: 'Triggered when an invoice is updated',
					},
					{
						name: 'Invoice Deleted',
						value: 'INVOICE_DESTROY',
						description: 'Triggered when an invoice is deleted',
					},
					// Request events
					{
						name: 'Request Created',
						value: 'REQUEST_CREATE',
						description: 'Triggered when a new request is created',
					},
					{
						name: 'Request Updated',
						value: 'REQUEST_UPDATE',
						description: 'Triggered when a request is updated',
					},
					// Visit events
					{
						name: 'Visit Completed',
						value: 'VISIT_COMPLETE',
						description: 'Triggered when a visit is completed',
					},
				],
				description: 'The event to listen for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify the webhook signature using your OAuth client secret',
					},
					{
						displayName: 'Deduplicate Events',
						name: 'deduplicateEvents',
						type: 'boolean',
						default: true,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description: 'Jobber may send duplicate webhooks. Enable this to filter duplicates based on the webhook ID.',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Jobber webhooks are configured at the app level in the Developer Center,
				// not via API. This method returns false to indicate the webhook URL
				// should be displayed to the user for manual configuration.
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Webhooks must be configured manually in Jobber Developer Center
				// The webhook URL is displayed in the n8n UI
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Webhooks must be removed manually from Jobber Developer Center
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const options = this.getNodeParameter('options', {}) as IDataObject;
		const expectedEvent = this.getNodeParameter('event') as string;

		// Verify signature if enabled
		if (options.verifySignature !== false) {
			const signature = req.headers['x-jobber-hmac-sha256'] as string;
			if (signature) {
				const credentials = await this.getCredentials('jobberOAuth2Api');
				const clientSecret = credentials.clientSecret as string;

				const rawBody = JSON.stringify(body);
				const expectedSignature = crypto
					.createHmac('sha256', clientSecret)
					.update(rawBody)
					.digest('base64');

				if (signature !== expectedSignature) {
					// Signature mismatch - could be tampered or wrong secret
					return {
						noWebhookResponse: true,
					};
				}
			}
		}

		// Check if this is the event we're listening for
		const webhookTopic = body.topic as string;
		if (webhookTopic && webhookTopic !== expectedEvent) {
			// Not the event we're looking for
			return {
				noWebhookResponse: true,
			};
		}

		// Handle deduplication
		// Jobber sends webhooks with at-least-once delivery, meaning duplicates are possible
		// The webHookEvent query in the payload contains the event data
		const workflowStaticData = this.getWorkflowStaticData('node');
		const webhookId = body.id as string;

		if (options.deduplicateEvents !== false && webhookId) {
			const processedWebhooks = (workflowStaticData.processedWebhooks as string[]) || [];

			if (processedWebhooks.includes(webhookId)) {
				// Already processed this webhook
				return {
					noWebhookResponse: true,
				};
			}

			// Keep track of last 100 webhook IDs to prevent memory bloat
			processedWebhooks.push(webhookId);
			if (processedWebhooks.length > 100) {
				processedWebhooks.shift();
			}
			workflowStaticData.processedWebhooks = processedWebhooks;
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
