# n8n-nodes-gemini-exchange

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node that integrates with Gemini Exchange's cryptocurrency trading platform. This node provides access to 6 core resources including account management, order execution, market data retrieval, fund transfers, staking rewards, and fee tracking capabilities for automated cryptocurrency trading and portfolio management workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Cryptocurrency](https://img.shields.io/badge/Crypto-Trading-orange)
![Exchange](https://img.shields.io/badge/Exchange-Gemini-green)
![API](https://img.shields.io/badge/API-REST-purple)

## Features

• **Account Management** - Retrieve account balances, trading history, and profile information
• **Advanced Order Execution** - Place, modify, and cancel market and limit orders with full order lifecycle management
• **Real-time Market Data** - Access live price feeds, order books, and trading volumes
• **Secure Fund Transfers** - Manage deposits and withdrawals with multi-signature security
• **Staking Rewards Tracking** - Monitor and claim staking rewards across supported cryptocurrencies
• **Fee & Commission Analytics** - Track trading fees, withdrawal costs, and commission structures
• **Rate Limiting Compliance** - Built-in request throttling to respect Gemini's API limits
• **Error Recovery** - Comprehensive error handling with automatic retry mechanisms

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-gemini-exchange`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-gemini-exchange
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-gemini-exchange.git
cd n8n-nodes-gemini-exchange
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-gemini-exchange
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Gemini API key from account settings | Yes |
| API Secret | Your Gemini API secret (keep secure) | Yes |
| Sandbox Mode | Enable for testing with sandbox environment | No |
| Environment | Production or Sandbox environment selection | Yes |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balances | Retrieve current cryptocurrency and fiat balances |
| Get Profile | Fetch account profile and verification status |
| Get Trading History | Access complete trading history with filtering options |
| Get Deposit Addresses | Retrieve cryptocurrency deposit addresses |
| Get Account Activity | View account activity log and audit trail |

### 2. Order

| Operation | Description |
|-----------|-------------|
| Place Order | Create new market or limit buy/sell orders |
| Get Order Status | Check status of specific orders by ID |
| List Active Orders | Retrieve all open orders |
| Cancel Order | Cancel specific orders by ID |
| Cancel All Orders | Cancel all open orders for a symbol |
| Get Order History | Access historical order data with pagination |
| Modify Order | Update existing order parameters |

### 3. MarketData

| Operation | Description |
|-----------|-------------|
| Get Ticker | Retrieve current price and 24h statistics |
| Get Order Book | Access current bid/ask order book depth |
| Get Trade History | Fetch recent public trade history |
| Get Candles | Retrieve OHLCV candlestick data |
| Get Symbols | List all available trading pairs |
| Get Exchange Info | Get exchange trading rules and limits |

### 4. FundTransfer

| Operation | Description |
|-----------|-------------|
| Initiate Withdrawal | Start cryptocurrency or fiat withdrawals |
| Get Transfer History | Access deposit and withdrawal history |
| Get Transfer Status | Check status of specific transfers |
| Cancel Withdrawal | Cancel pending withdrawal requests |
| Get Withdrawal Fees | Retrieve current withdrawal fee schedule |
| Get Deposit History | Access detailed deposit transaction history |

### 5. StakingReward

| Operation | Description |
|-----------|-------------|
| Get Staking Rewards | Retrieve earned staking rewards by asset |
| Get Staking History | Access historical staking reward payments |
| Claim Rewards | Claim available staking rewards |
| Get Staking Rates | Fetch current staking reward rates |
| Get Staking Balance | Check assets currently being staked |

### 6. FeeAndCommission

| Operation | Description |
|-----------|-------------|
| Get Trading Fees | Retrieve current trading fee schedule |
| Get Fee History | Access historical trading fee payments |
| Get Commission Structure | Fetch referral commission rates |
| Calculate Fees | Estimate fees for proposed trades |
| Get Volume Tiers | Access trading volume tier information |

## Usage Examples

```javascript
// Get account balances
{
  "resource": "account",
  "operation": "getBalances",
  "credentials": "geminiExchangeApi"
}
```

```javascript
// Place a limit buy order
{
  "resource": "order",
  "operation": "placeOrder",
  "symbol": "BTCUSD",
  "type": "limit",
  "side": "buy",
  "amount": "0.1",
  "price": "45000.00",
  "credentials": "geminiExchangeApi"
}
```

```javascript
// Get real-time market ticker
{
  "resource": "marketData",
  "operation": "getTicker",
  "symbol": "ETHUSD",
  "credentials": "geminiExchangeApi"
}
```

```javascript
// Initiate cryptocurrency withdrawal
{
  "resource": "fundTransfer",
  "operation": "initiateWithdrawal",
  "currency": "BTC",
  "amount": "0.05",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "credentials": "geminiExchangeApi"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Credentials | Authentication failed with provided keys | Verify API key and secret in credentials |
| Rate Limit Exceeded | Too many requests sent to API | Wait for rate limit reset or implement delays |
| Insufficient Funds | Not enough balance for requested operation | Check account balance before placing orders |
| Invalid Symbol | Trading pair not supported or malformed | Use valid symbol format (e.g., BTCUSD) |
| Order Not Found | Specified order ID does not exist | Verify order ID or check order history |
| Market Closed | Trading not available for selected pair | Check market hours and trading status |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-gemini-exchange/issues)
- **Gemini API Documentation**: [https://docs.gemini.com/rest-api/](https://docs.gemini.com/rest-api/)
- **Gemini Developer Community**: [https://community.gemini.com/](https://community.gemini.com/)