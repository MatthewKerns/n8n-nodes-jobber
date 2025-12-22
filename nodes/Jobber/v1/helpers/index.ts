import type { IDataObject } from 'n8n-workflow';

/**
 * Build a GraphQL fields selection string from an array of field names
 */
export function buildFieldsSelection(fields: string[]): string {
	return fields.join('\n');
}

/**
 * Remove undefined and null values from an object
 */
export function removeEmptyProperties(obj: IDataObject): IDataObject {
	const result: IDataObject = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			result[key] = value;
		}
	}
	return result;
}

/**
 * Parse a Jobber global ID to extract the type and local ID
 * Jobber uses base64-encoded global IDs in format: "Type:localId"
 */
export function parseJobberId(globalId: string): { type: string; localId: string } | null {
	try {
		const decoded = Buffer.from(globalId, 'base64').toString('utf-8');
		const [type, localId] = decoded.split(':');
		if (type && localId) {
			return { type, localId };
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Create a Jobber global ID from type and local ID
 */
export function createJobberId(type: string, localId: string): string {
	return Buffer.from(`${type}:${localId}`).toString('base64');
}

/**
 * Common fields for Client queries
 */
export const CLIENT_FIELDS = `
	id
	firstName
	lastName
	companyName
	title
	isCompany
	isLead
	createdAt
	updatedAt
	emails {
		address
		primary
	}
	phones {
		number
		primary
		smsAllowed
	}
	billingAddress {
		street1
		street2
		city
		province
		postalCode
		country
	}
`;

/**
 * Common fields for Job queries
 */
export const JOB_FIELDS = `
	id
	title
	jobNumber
	instructions
	startAt
	endAt
	jobStatus
	createdAt
	updatedAt
	client {
		id
		firstName
		lastName
		companyName
	}
	property {
		id
		address {
			street1
			street2
			city
			province
			postalCode
			country
		}
	}
`;

/**
 * Common fields for Quote queries
 */
export const QUOTE_FIELDS = `
	id
	quoteNumber
	title
	message
	quoteStatus
	createdAt
	updatedAt
	client {
		id
		firstName
		lastName
		companyName
	}
	amounts {
		subtotal
		total
		depositAmount
	}
`;

/**
 * Common fields for Invoice queries
 */
export const INVOICE_FIELDS = `
	id
	invoiceNumber
	subject
	message
	invoiceStatus
	createdAt
	updatedAt
	issuedDate
	dueDate
	client {
		id
		firstName
		lastName
		companyName
	}
	amounts {
		subtotal
		total
		depositAmount
		amountDue
		amountPaid
	}
`;
