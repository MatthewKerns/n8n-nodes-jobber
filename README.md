# n8n-nodes-jobber

This is an n8n community node for [Jobber](https://getjobber.com/) - a field service management platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
npm install @arisegroup/n8n-nodes-jobber
```

## Nodes

### Jobber

Interact with Jobber's GraphQL API to manage:

| Resource | Operations |
|----------|------------|
| **Client** | Get, Get Many, Create, Update, Delete |
| **Job** | Get, Get Many, Create, Update, Delete |
| **Quote** | Get, Get Many, Create, Update, Delete, Convert to Job |
| **Invoice** | Get, Get Many, Create, Update, Delete |
| **GraphQL** | Execute custom queries/mutations |

### Jobber Trigger

Listen for Jobber webhook events:

- Client Created/Updated/Deleted
- Job Created/Updated/Deleted
- Quote Created/Updated/Deleted
- Invoice Created/Updated/Deleted
- Request Created/Updated
- Visit Completed

## Credentials

This node uses OAuth2 authentication. You'll need to:

1. Create an app in the [Jobber Developer Center](https://developer.getjobber.com/)
2. Configure OAuth2 credentials in n8n with your Client ID and Client Secret
3. Set the callback URL to your n8n OAuth callback URL

## Configuration

### Webhook Setup

Jobber webhooks are configured at the application level in the Developer Center, not via API. After creating a Jobber Trigger node:

1. Copy the webhook URL from n8n
2. Go to your app in Jobber Developer Center
3. Add the webhook URL and select the events you want to receive

### Rate Limits

Jobber's API has the following limits:
- 2,500 requests per 5 minutes (DDoS protection)
- 10,000 query cost per request (GraphQL complexity limit)

The node handles pagination automatically using cursor-based pagination.

## Development

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Run in development mode
npm run dev

# Lint
npm run lint
```

## Resources

- [Jobber API Documentation](https://developer.getjobber.com/docs/)
- [Jobber GraphQL Playground](https://developer.getjobber.com/apps/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
