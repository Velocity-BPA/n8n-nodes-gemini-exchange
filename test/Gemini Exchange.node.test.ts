/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { GeminiExchange } from '../nodes/Gemini Exchange/Gemini Exchange.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('GeminiExchange Node', () => {
  let node: GeminiExchange;

  beforeAll(() => {
    node = new GeminiExchange();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Gemini Exchange');
      expect(node.description.name).toBe('geminiexchange');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-api-key', 
        apiSecret: 'test-api-secret',
        baseUrl: 'https://api.gemini.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get account details successfully', async () => {
    const mockResponse = { account: { id: '123', name: 'Test Account' } };
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccount');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get balances successfully', async () => {
    const mockResponse = [{ currency: 'BTC', amount: '1.5' }, { currency: 'USD', amount: '1000.00' }];
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBalances');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get notional balances successfully', async () => {
    const mockResponse = [{ currency: 'BTC', amount: '1.5', amountNotional: '45000.00' }];
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNotionalBalances')
      .mockReturnValueOnce('USD');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get transfers successfully', async () => {
    const mockResponse = [{ type: 'Deposit', currency: 'BTC', amount: '1.0' }];
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransfers')
      .mockReturnValueOnce(1640995200)
      .mockReturnValueOnce(50);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccount');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        apiSecret: 'test-secret',
        baseUrl: 'https://api.gemini.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should create order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createOrder')
      .mockReturnValueOnce('client123')
      .mockReturnValueOnce('BTCUSD')
      .mockReturnValueOnce('0.1')
      .mockReturnValueOnce('50000')
      .mockReturnValueOnce('buy')
      .mockReturnValueOnce('exchange limit')
      .mockReturnValueOnce({});

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ order_id: '12345' });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.order_id).toBe('12345');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.gemini.com/v1/order/new',
      })
    );
  });

  it('should cancel order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelOrder')
      .mockReturnValueOnce('12345');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: 'ok' });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('ok');
  });

  it('should get order status successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrderStatus')
      .mockReturnValueOnce('12345')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(true);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      order_id: '12345',
      status: 'filled'
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.order_id).toBe('12345');
    expect(result[0].json.status).toBe('filled');
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createOrder');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('MarketData Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.gemini.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get symbols successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getSymbols');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(['BTCUSD', 'ETHUSD']);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(['BTCUSD', 'ETHUSD']);
  });

  it('should get symbol details successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSymbolDetails')
      .mockReturnValueOnce('BTCUSD');
    
    const mockResponse = { symbol: 'BTCUSD', base_currency: 'BTC' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get ticker successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTicker')
      .mockReturnValueOnce('BTCUSD');
    
    const mockResponse = { symbol: 'BTCUSD', last: '50000' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get order book successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrderBook')
      .mockReturnValueOnce('BTCUSD')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(10);
    
    const mockResponse = { bids: [], asks: [] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get recent trades successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRecentTrades')
      .mockReturnValueOnce('BTCUSD')
      .mockReturnValueOnce(1234567890)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(false);
    
    const mockResponse = [{ price: '50000', amount: '0.1' }];
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should handle errors properly', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getSymbols');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('FundTransfer Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				apiSecret: 'test-api-secret',
				baseUrl: 'https://api.gemini.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn()
			}
		};
	});

	it('should get deposit addresses successfully', async () => {
		const mockResponse = [{ address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', network: 'bitcoin' }];
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getDepositAddresses')
			.mockReturnValueOnce('bitcoin');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeFundTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: 'https://api.gemini.com/v1/addresses/bitcoin'
			})
		);
	});

	it('should create deposit address successfully', async () => {
		const mockResponse = { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', network: 'bitcoin', label: 'test-label' };
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createDepositAddress')
			.mockReturnValueOnce('bitcoin')
			.mockReturnValueOnce('test-label');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeFundTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.gemini.com/v1/addresses/bitcoin'
			})
		);
	});

	it('should create withdrawal successfully', async () => {
		const mockResponse = { txHash: '0x123...', amount: '0.1', address: 'bc1qtest...' };
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createWithdrawal')
			.mockReturnValueOnce('BTC')
			.mockReturnValueOnce('bc1qtest123')
			.mockReturnValueOnce('0.1')
			.mockReturnValueOnce('test-withdrawal');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeFundTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.gemini.com/v1/withdraw/BTC'
			})
		);
	});

	it('should get trading volume successfully', async () => {
		const mockResponse = { notional_30d_volume: 10000.50, last_updated_ms: 1234567890 };
		
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTradingVolume');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeFundTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: 'https://api.gemini.com/v1/notionalvolume'
			})
		);
	});

	it('should handle API errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getDepositAddresses');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeFundTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getDepositAddresses');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeFundTransferOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('API Error');
	});
});

describe('StakingReward Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        apiSecret: 'test-secret',
        baseUrl: 'https://api.gemini.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get staking rates successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getStakingRates');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([{ currency: 'BTC', rate: 0.02 }]);

    const result = await executeStakingRewardOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual([{ currency: 'BTC', rate: 0.02 }]);
  });

  it('should get earn history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEarnHistory')
      .mockReturnValueOnce('BTC')
      .mockReturnValueOnce(1640995200000)
      .mockReturnValueOnce(1641081600000);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([{ date: '2022-01-01', amount: '0.001' }]);

    const result = await executeStakingRewardOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual([{ date: '2022-01-01', amount: '0.001' }]);
  });

  it('should get earn balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getEarnBalance');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([{ currency: 'GUSD', balance: '1000.50' }]);

    const result = await executeStakingRewardOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual([{ currency: 'GUSD', balance: '1000.50' }]);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getStakingRates');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeStakingRewardOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('FeeAndCommission Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        apiSecret: 'test-secret',
        baseUrl: 'https://api.gemini.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getNotionalVolume operation', () => {
    it('should get notional volume successfully', async () => {
      const mockResponse = {
        notional_30d_volume: 1000000,
        last_updated_ms: 1234567890,
        account_id: 12345
      };
      
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getNotionalVolume');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFeeAndCommissionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.gemini.com/v1/notionalvolume',
          headers: expect.objectContaining({
            'X-GEMINI-APIKEY': 'test-key',
          })
        })
      );
    });

    it('should handle errors when getting notional volume', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getNotionalVolume');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFeeAndCommissionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTradeVolume operation', () => {
    it('should get trade volume successfully', async () => {
      const mockResponse = [
        {
          account_id: 12345,
          symbol: 'btcusd',
          base_currency: 'btc',
          notional_currency: 'usd',
          data_date: '2023-01-01',
          total_volume_base: 10.5,
          maker_volume_base: 8.2,
          taker_volume_base: 2.3,
          total_volume_notional: 250000,
          maker_volume_notional: 195000,
          taker_volume_notional: 55000
        }
      ];
      
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTradeVolume');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFeeAndCommissionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.gemini.com/v1/tradevolume',
          headers: expect.objectContaining({
            'X-GEMINI-APIKEY': 'test-key',
          })
        })
      );
    });

    it('should handle errors when getting trade volume', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTradeVolume');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFeeAndCommissionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});
});
