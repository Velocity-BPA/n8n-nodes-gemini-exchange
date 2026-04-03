import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class GeminiExchangeApi implements ICredentialType {
	name = 'geminiExchangeApi';
	displayName = 'Gemini Exchange API';
	documentationUrl = 'https://docs.gemini.com/rest-api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Gemini API key',
			required: true,
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Gemini API secret for signing requests',
			required: true,
		},
		{
			displayName: 'Sandbox',
			name: 'sandbox',
			type: 'boolean',
			default: false,
			description: 'Whether to use the Gemini sandbox environment for testing',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.gemini.com',
			description: 'The base URL for the Gemini API',
		},
	];
}