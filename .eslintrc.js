module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/nodes',
	],
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	env: {
		node: true,
		es2022: true,
	},
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'n8n-nodes-base/node-param-description-boolean-without-whether': 'warn',
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js'],
};
