/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-geminiexchange/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import * as crypto from 'crypto';

export class GeminiExchange implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gemini Exchange',
    name: 'geminiexchange',
    icon: 'file:geminiexchange.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Gemini Exchange API',
    defaults: {
      name: 'Gemini Exchange',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'geminiexchangeApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'MarketData',
            value: 'marketData',
          },
          {
            name: 'FundTransfer',
            value: 'fundTransfer',
          },
          {
            name: 'StakingReward',
            value: 'stakingReward',
          },
          {
            name: 'FeeAndCommission',
            value: 'feeAndCommission',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Account', value: 'getAccount', description: 'Get account details', action: 'Get account details' },
    { name: 'Get Balances', value: 'getBalances', description: 'Get available balances', action: 'Get available balances' },
    { name: 'Get Notional Balances', value: 'getNotionalBalances', description: 'Get notional balances in specified currency', action: 'Get notional balances' },
    { name: 'Get Transfers', value: 'getTransfers', description: 'Get transfer history', action: 'Get transfer history' },
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['order'] } },
  options: [
    { name: 'Create Order', value: 'createOrder', description: 'Place a new order', action: 'Create order' },
    { name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel an order', action: 'Cancel order' },
    { name: 'Cancel All Session Orders', value: 'cancelAllSessionOrders', description: 'Cancel all session orders', action: 'Cancel all session orders' },
    { name: 'Cancel All Orders', value: 'cancelAllOrders', description: 'Cancel all active orders', action: 'Cancel all orders' },
    { name: 'Get Order Status', value: 'getOrderStatus', description: 'Get order status', action: 'Get order status' },
    { name: 'Get Active Orders', value: 'getActiveOrders', description: 'Get active orders', action: 'Get active orders' },
    { name: 'Get Trade History', value: 'getTradeHistory', description: 'Get past trades', action: 'Get trade history' },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['marketData'] } },
  options: [
    { name: 'Get Symbols', value: 'getSymbols', description: 'Get available trading symbols', action: 'Get symbols' },
    { name: 'Get Symbol Details', value: 'getSymbolDetails', description: 'Get symbol details', action: 'Get symbol details' },
    { name: 'Get Ticker', value: 'getTicker', description: 'Get ticker information', action: 'Get ticker' },
    { name: 'Get Order Book', value: 'getOrderBook', description: 'Get order book', action: 'Get order book' },
    { name: 'Get Recent Trades', value: 'getRecentTrades', description: 'Get recent trades', action: 'Get recent trades' },
    { name: 'Get Auction Data', value: 'getAuctionData', description: 'Get current auction data', action: 'Get auction data' },
    { name: 'Get Auction History', value: 'getAuctionHistory', description: 'Get auction history', action: 'Get auction history' },
  ],
  default: 'getSymbols',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['fundTransfer'] } },
	options: [
		{
			name: 'Get Deposit Addresses',
			value: 'getDepositAddresses',
			description: 'Get deposit addresses for a specific network',
			action: 'Get deposit addresses'
		},
		{
			name: 'Create Deposit Address',
			value: 'createDepositAddress',
			description: 'Create a new deposit address for a specific network',
			action: 'Create deposit address'
		},
		{
			name: 'Create Withdrawal',
			value: 'createWithdrawal',
			description: 'Withdraw cryptocurrency to an external address',
			action: 'Create withdrawal'
		},
		{
			name: 'Get Trading Volume',
			value: 'getTradingVolume',
			description: 'Get 30-day notional trading volume',
			action: 'Get trading volume'
		}
	],
	default: 'getDepositAddresses',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['stakingReward'] } },
  options: [
    { name: 'Get Staking Rates', value: 'getStakingRates', description: 'Get current staking rates', action: 'Get staking rates' },
    { name: 'Get Earn History', value: 'getEarnHistory', description: 'Get earning history', action: 'Get earn history' },
    { name: 'Get Earn Balance', value: 'getEarnBalance', description: 'Get earning balance', action: 'Get earn balance' }
  ],
  default: 'getStakingRates',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['feeAndCommission'] } },
  options: [
    { 
      name: 'Get Notional Volume', 
      value: 'getNotionalVolume', 
      description: 'Get 30-day notional volume',
      action: 'Get notional volume'
    },
    { 
      name: 'Get Trade Volume', 
      value: 'getTradeVolume', 
      description: 'Get 30-day trade volume',
      action: 'Get trade volume'
    }
  ],
  default: 'getNotionalVolume',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getNotionalBalances'] } },
  default: 'USD',
  description: 'Currency for notional balance calculation',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getTransfers'] } },
  default: '',
  description: 'Only return transfers after this timestamp',
},
{
  displayName: 'Limit Transfers',
  name: 'limitTransfers',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getTransfers'] } },
  default: 50,
  description: 'Maximum number of transfers to return',
},
{
  displayName: 'Client Order ID',
  name: 'clientOrderId',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  description: 'Client-specified order identifier',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  description: 'Currency symbol (e.g., BTCUSD)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  description: 'Amount to buy or sell',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  description: 'Price per unit',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' },
  ],
  default: 'buy',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  description: 'Order side',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  options: [
    { name: 'Exchange Limit', value: 'exchange limit' },
    { name: 'Exchange Market', value: 'exchange market' },
  ],
  default: 'exchange limit',
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  description: 'Order type',
},
{
  displayName: 'Options',
  name: 'options',
  type: 'collection',
  placeholder: 'Add Option',
  default: {},
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    {
      displayName: 'Immediate or Cancel',
      name: 'immediate_or_cancel',
      type: 'boolean',
      default: false,
      description: 'Cancel remaining portion of order if not filled immediately',
    },
    {
      displayName: 'Fill or Kill',
      name: 'fill_or_kill',
      type: 'boolean',
      default: false,
      description: 'Cancel order if not filled entirely immediately',
    },
  ],
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['order'], operation: ['cancelOrder', 'getOrderStatus'] } },
  description: 'Order ID to cancel or get status for',
},
{
  displayName: 'Client Order ID',
  name: 'clientOrderId',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['order'], operation: ['getOrderStatus'] } },
  description: 'Client order ID (alternative to order ID)',
},
{
  displayName: 'Include Trades',
  name: 'includeTrades',
  type: 'boolean',
  default: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrderStatus'] } },
  description: 'Include trade information in response',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['order'], operation: ['getTradeHistory'] } },
  description: 'Currency symbol to filter trades',
},
{
  displayName: 'Limit Trades',
  name: 'limitTrades',
  type: 'number',
  default: 50,
  displayOptions: { show: { resource: ['order'], operation: ['getTradeHistory'] } },
  description: 'Maximum number of trades to return',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'number',
  default: 0,
  displayOptions: { show: { resource: ['order'], operation: ['getTradeHistory'] } },
  description: 'Only return trades after this timestamp',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getSymbolDetails'] } },
  default: '',
  description: 'The trading symbol to get details for',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getTicker'] } },
  default: '',
  description: 'The trading symbol to get ticker for',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getOrderBook'] } },
  default: '',
  description: 'The trading symbol to get order book for',
},
{
  displayName: 'Limit Bids',
  name: 'limitBids',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['marketData'], operation: ['getOrderBook'] } },
  default: 50,
  description: 'The maximum number of bid levels to return',
},
{
  displayName: 'Limit Asks',
  name: 'limitAsks',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['marketData'], operation: ['getOrderBook'] } },
  default: 50,
  description: 'The maximum number of ask levels to return',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getRecentTrades'] } },
  default: '',
  description: 'The trading symbol to get trades for',
},
{
  displayName: 'Since',
  name: 'since',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['marketData'], operation: ['getRecentTrades'] } },
  default: 0,
  description: 'Get trades after this timestamp',
},
{
  displayName: 'Limit Trades',
  name: 'limitTrades',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['marketData'], operation: ['getRecentTrades'] } },
  default: 50,
  description: 'The maximum number of trades to return',
},
{
  displayName: 'Include Breaks',
  name: 'includeBreaks',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['marketData'], operation: ['getRecentTrades'] } },
  default: false,
  description: 'Whether to include breaks in the response',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getAuctionData'] } },
  default: '',
  description: 'The trading symbol to get auction data for',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getAuctionHistory'] } },
  default: '',
  description: 'The trading symbol to get auction history for',
},
{
  displayName: 'Since',
  name: 'since',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['marketData'], operation: ['getAuctionHistory'] } },
  default: 0,
  description: 'Get auction history after this timestamp',
},
{
  displayName: 'Limit Auction Results',
  name: 'limitAuctionResults',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['marketData'], operation: ['getAuctionHistory'] } },
  default: 50,
  description: 'The maximum number of auction results to return',
},
{
  displayName: 'Include Indicative',
  name: 'includeIndicative',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['marketData'], operation: ['getAuctionHistory'] } },
  default: false,
  description: 'Whether to include indicative prices',
},
{
	displayName: 'Network',
	name: 'network',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fundTransfer'],
			operation: ['getDepositAddresses', 'createDepositAddress']
		}
	},
	default: '',
	description: 'The network for the deposit address (e.g., bitcoin, ethereum, litecoin)',
},
{
	displayName: 'Label',
	name: 'label',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['fundTransfer'],
			operation: ['createDepositAddress']
		}
	},
	default: '',
	description: 'Optional label for the new deposit address',
},
{
	displayName: 'Currency',
	name: 'currency',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fundTransfer'],
			operation: ['createWithdrawal']
		}
	},
	default: '',
	description: 'The currency symbol to withdraw (e.g., BTC, ETH, LTC)',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fundTransfer'],
			operation: ['createWithdrawal']
		}
	},
	default: '',
	description: 'The external address to withdraw to',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fundTransfer'],
			operation: ['createWithdrawal']
		}
	},
	default: '',
	description: 'The amount to withdraw',
},
{
	displayName: 'Withdrawal Label',
	name: 'withdrawalLabel',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['fundTransfer'],
			operation: ['createWithdrawal']
		}
	},
	default: '',
	description: 'Optional label for the withdrawal',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  default: '',
  description: 'Currency symbol (e.g., BTC, ETH, GUSD)',
  displayOptions: { show: { resource: ['stakingReward'], operation: ['getEarnHistory'] } },
},
{
  displayName: 'Since Timestamp',
  name: 'since',
  type: 'number',
  default: 0,
  description: 'Start timestamp for history query',
  displayOptions: { show: { resource: ['stakingReward'], operation: ['getEarnHistory'] } },
},
{
  displayName: 'Until Timestamp',
  name: 'until',
  type: 'number',
  default: 0,
  description: 'End timestamp for history query',
  displayOptions: { show: { resource: ['stakingReward'], operation: ['getEarnHistory'] } },
},
// No additional parameters needed for these operations,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'order':
        return [await executeOrderOperations.call(this, items)];
      case 'marketData':
        return [await executeMarketDataOperations.call(this, items)];
      case 'fundTransfer':
        return [await executeFundTransferOperations.call(this, items)];
      case 'stakingReward':
        return [await executeStakingRewardOperations.call(this, items)];
      case 'feeAndCommission':
        return [await executeFeeAndCommissionOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('geminiexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAccount': {
          const endpoint = '/v1/account';
          const nonce = Date.now().toString();
          const payload = {
            request: endpoint,
            nonce: nonce,
          };
          
          const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(encodedPayload).digest('hex');
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': encodedPayload,
              'X-GEMINI-SIGNATURE': signature,
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBalances': {
          const endpoint = '/v1/balances';
          const nonce = Date.now().toString();
          const payload = {
            request: endpoint,
            nonce: nonce,
          };
          
          const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(encodedPayload).digest('hex');
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': encodedPayload,
              'X-GEMINI-SIGNATURE': signature,
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getNotionalBalances': {
          const currency = this.getNodeParameter('currency', i) as string;
          const endpoint = `/v1/notionalbalances/${currency}`;
          const nonce = Date.now().toString();
          const payload = {
            request: endpoint,
            nonce: nonce,
          };
          
          const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(encodedPayload).digest('hex');
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': encodedPayload,
              'X-GEMINI-SIGNATURE': signature,
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTransfers': {
          const endpoint = '/v1/transfers';
          const nonce = Date.now().toString();
          const timestamp = this.getNodeParameter('timestamp', i) as number;
          const limitTransfers = this.getNodeParameter('limitTransfers', i) as number;
          
          const payload: any = {
            request: endpoint,
            nonce: nonce,
          };
          
          if (timestamp) {
            payload.timestamp = timestamp;
          }
          
          if (limitTransfers) {
            payload.limit_transfers = limitTransfers;
          }
          
          const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(encodedPayload).digest('hex');
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': encodedPayload,
              'X-GEMINI-SIGNATURE': signature,
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('geminiexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = Date.now().toString();

      switch (operation) {
        case 'createOrder': {
          const clientOrderId = this.getNodeParameter('clientOrderId', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const price = this.getNodeParameter('price', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const options = this.getNodeParameter('options', i) as any;

          const payload: any = {
            request: '/v1/order/new',
            nonce,
            symbol,
            amount,
            price,
            side,
            type,
            ...options,
          };

          if (clientOrderId) {
            payload.client_order_id = clientOrderId;
          }

          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');

          const requestOptions: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/order/new`,
            headers: {
              'Content-Type': 'text/plain',
              'Content-Length': '0',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Cache-Control': 'no-cache',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(requestOptions) as any;
          break;
        }

        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const payload = {
            request: '/v1/order/cancel',
            nonce,
            order_id: orderId,
          };

          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');

          const requestOptions: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/order/cancel`,
            headers: {
              'Content-Type': 'text/plain',
              'Content-Length': '0',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Cache-Control': 'no-cache',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(requestOptions) as any;
          break;
        }

        case 'cancelAllSessionOrders': {
          const payload = {
            request: '/v1/order/cancel/session',
            nonce,
          };

          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');

          const requestOptions: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/order/cancel/session`,
            headers: {
              'Content-Type': 'text/plain',
              'Content-Length': '0',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Cache-Control': 'no-cache',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(requestOptions) as any;
          break;
        }

        case 'cancelAllOrders': {
          const payload = {
            request: '/v1/order/cancel/all',
            nonce,
          };

          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');

          const requestOptions: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/order/cancel/all`,
            headers: {
              'Content-Type': 'text/plain',
              'Content-Length': '0',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Cache-Control': 'no-cache',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(requestOptions) as any;
          break;
        }

        case 'getOrderStatus': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const clientOrderId = this.getNodeParameter('clientOrderId', i) as string;
          const includeTrades = this.getNodeParameter('includeTrades', i) as boolean;

          const payload: any = {
            request: '/v1/order/status',
            nonce,
            include_trades: includeTrades,
          };

          if (orderId) {
            payload.order_id = orderId;
          } else if (clientOrderId) {
            payload.client_order_id = clientOrderId;
          }

          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');

          const requestOptions: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/order/status`,
            headers: {
              'Content-Type': 'text/plain',
              'Content-Length': '0',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Cache-Control': 'no-cache',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(requestOptions) as any;
          break;
        }

        case 'getActiveOrders': {
          const payload = {
            request: '/v1/orders',
            nonce,
          };

          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');

          const requestOptions: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/orders`,
            headers: {
              'Content-Type': 'text/plain',
              'Content-Length': '0',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Cache-Control': 'no-cache',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(requestOptions) as any;
          break;
        }

        case 'getTradeHistory': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const limitTrades = this.getNodeParameter('limitTrades', i) as number;
          const timestamp = this.getNodeParameter('timestamp', i) as number;

          const payload: any = {
            request: '/v1/mytrades',
            nonce,
          };

          if (symbol) payload.symbol = symbol;
          if (limitTrades) payload.limit_trades = limitTrades;
          if (timestamp) payload.timestamp = timestamp;

          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');

          const requestOptions: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/mytrades`,
            headers: {
              'Content-Type': 'text/plain',
              'Content-Length': '0',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Cache-Control': 'no-cache',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(requestOptions) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMarketDataOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('geminiexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getSymbols': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/symbols`,
            headers: {
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getSymbolDetails': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/symbols/details/${symbol}`,
            headers: {
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTicker': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/pubticker/${symbol}`,
            headers: {
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOrderBook': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const limitBids = this.getNodeParameter('limitBids', i) as number;
          const limitAsks = this.getNodeParameter('limitAsks', i) as number;
          
          const params = new URLSearchParams();
          if (limitBids) params.append('limit_bids', limitBids.toString());
          if (limitAsks) params.append('limit_asks', limitAsks.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/book/${symbol}${params.toString() ? '?' + params.toString() : ''}`,
            headers: {
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getRecentTrades': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const since = this.getNodeParameter('since', i) as number;
          const limitTrades = this.getNodeParameter('limitTrades', i) as number;
          const includeBreaks = this.getNodeParameter('includeBreaks', i) as boolean;
          
          const params = new URLSearchParams();
          if (since) params.append('since', since.toString());
          if (limitTrades) params.append('limit_trades', limitTrades.toString());
          if (includeBreaks) params.append('include_breaks', includeBreaks.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/trades/${symbol}${params.toString() ? '?' + params.toString() : ''}`,
            headers: {
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAuctionData': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/auction/${symbol}`,
            headers: {
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAuctionHistory': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const since = this.getNodeParameter('since', i) as number;
          const limitAuctionResults = this.getNodeParameter('limitAuctionResults', i) as number;
          const includeIndicative = this.getNodeParameter('includeIndicative', i) as boolean;
          
          const params = new URLSearchParams();
          if (since) params.append('since', since.toString());
          if (limitAuctionResults) params.append('limit_auction_results', limitAuctionResults.toString());
          if (includeIndicative) params.append('include_indicative', includeIndicative.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/auction/${symbol}/history${params.toString() ? '?' + params.toString() : ''}`,
            headers: {
              'Content-Type': 'text/plain',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeFundTransferOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('geminiexchangeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const baseUrl = credentials.baseUrl || 'https://api.gemini.com';
			const nonce = Date.now().toString();

			switch (operation) {
				case 'getDepositAddresses': {
					const network = this.getNodeParameter('network', i) as string;
					
					const payload = {
						request: `/v1/addresses/${network}`,
						nonce: nonce,
					};

					const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
					const signature = require('crypto')
						.createHmac('sha384', credentials.apiSecret)
						.update(encodedPayload)
						.digest('hex');

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v1/addresses/${network}`,
						headers: {
							'Content-Type': 'text/plain',
							'X-GEMINI-APIKEY': credentials.apiKey,
							'X-GEMINI-PAYLOAD': encodedPayload,
							'X-GEMINI-SIGNATURE': signature,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createDepositAddress': {
					const network = this.getNodeParameter('network', i) as string;
					const label = this.getNodeParameter('label', i) as string;

					const payload: any = {
						request: `/v1/addresses/${network}`,
						nonce: nonce,
					};

					if (label) {
						payload.label = label;
					}

					const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
					const signature = require('crypto')
						.createHmac('sha384', credentials.apiSecret)
						.update(encodedPayload)
						.digest('hex');

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/v1/addresses/${network}`,
						headers: {
							'Content-Type': 'text/plain',
							'X-GEMINI-APIKEY': credentials.apiKey,
							'X-GEMINI-PAYLOAD': encodedPayload,
							'X-GEMINI-SIGNATURE': signature,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createWithdrawal': {
					const currency = this.getNodeParameter('currency', i) as string;
					const address = this.getNodeParameter('address', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					const withdrawalLabel = this.getNodeParameter('withdrawalLabel', i) as string;

					const payload: any = {
						request: `/v1/withdraw/${currency}`,
						nonce: nonce,
						address: address,
						amount: amount,
					};

					if (withdrawalLabel) {
						payload.label = withdrawalLabel;
					}

					const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
					const signature = require('crypto')
						.createHmac('sha384', credentials.apiSecret)
						.update(encodedPayload)
						.digest('hex');

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/v1/withdraw/${currency}`,
						headers: {
							'Content-Type': 'text/plain',
							'X-GEMINI-APIKEY': credentials.apiKey,
							'X-GEMINI-PAYLOAD': encodedPayload,
							'X-GEMINI-SIGNATURE': signature,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTradingVolume': {
					const payload = {
						request: `/v1/notionalvolume`,
						nonce: nonce,
					};

					const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
					const signature = require('crypto')
						.createHmac('sha384', credentials.apiSecret)
						.update(encodedPayload)
						.digest('hex');

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v1/notionalvolume`,
						headers: {
							'Content-Type': 'text/plain',
							'X-GEMINI-APIKEY': credentials.apiKey,
							'X-GEMINI-PAYLOAD': encodedPayload,
							'X-GEMINI-SIGNATURE': signature,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeStakingRewardOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('geminiexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = Date.now().toString();

      switch (operation) {
        case 'getStakingRates': {
          const endpoint = '/v1/earn/rates';
          const payload = { request: endpoint, nonce };
          const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(encodedPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'Content-Type': 'text/plain',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': encodedPayload,
              'X-GEMINI-SIGNATURE': signature,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getEarnHistory': {
          const endpoint = '/v1/earn/history';
          const currency = this.getNodeParameter('currency', i) as string;
          const since = this.getNodeParameter('since', i) as number;
          const until = this.getNodeParameter('until', i) as number;
          
          const payload: any = { request: endpoint, nonce };
          if (currency) payload.currency = currency;
          if (since) payload.since = since;
          if (until) payload.until = until;

          const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(encodedPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'Content-Type': 'text/plain',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': encodedPayload,
              'X-GEMINI-SIGNATURE': signature,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getEarnBalance': {
          const endpoint = '/v1/earn/balance';
          const payload = { request: endpoint, nonce };
          const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(encodedPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'Content-Type': 'text/plain',
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': encodedPayload,
              'X-GEMINI-SIGNATURE': signature,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeFeeAndCommissionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('geminiexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getNotionalVolume': {
          const nonce = Date.now().toString();
          const requestPath = '/v1/notionalvolume';
          const payload = {
            request: requestPath,
            nonce: nonce
          };
          
          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const crypto = require('crypto');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + requestPath,
            headers: {
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-cache'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTradeVolume': {
          const nonce = Date.now().toString();
          const requestPath = '/v1/tradevolume';
          const payload = {
            request: requestPath,
            nonce: nonce
          };
          
          const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
          const crypto = require('crypto');
          const signature = crypto.createHmac('sha384', credentials.apiSecret).update(payloadBase64).digest('hex');
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + requestPath,
            headers: {
              'X-GEMINI-APIKEY': credentials.apiKey,
              'X-GEMINI-PAYLOAD': payloadBase64,
              'X-GEMINI-SIGNATURE': signature,
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-cache'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
