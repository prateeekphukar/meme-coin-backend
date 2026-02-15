# Coinbase URL Feature

## Overview
All coin/token endpoints now include clickable Coinbase URLs that link directly to each coin's page on Coinbase.

## API Endpoints with Coinbase Links

### Get All Tokens
```
GET /api/v1/tokens
```
Query Parameters:
- `limit` (optional): Number of tokens to return (default: 100)
- `offset` (optional): Pagination offset (default: 0)

Response includes `coinbaseUrl` for each token:
```json
{
  "tokens": [
    {
      "id": "uuid",
      "symbol": "BTC",
      "name": "Bitcoin",
      "address": "0x...",
      "chainId": "uuid",
      "priceUsd": 50000,
      "marketCap": 1000000000,
      "memeScore": 95.5,
      "coinbaseUrl": "https://www.coinbase.com/price/BTC",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 100
}
```

### Get Top Tokens
```
GET /api/v1/tokens/top
```
Query Parameters:
- `limit` (optional): Number of top tokens to return (default: 20)

Returns top tokens by meme score, each with a Coinbase URL.

### Get Single Token
```
GET /api/v1/tokens/:id
```
Returns a single token with its Coinbase URL.

### Get User Watchlists (with Coinbase URLs)
```
GET /api/v1/watchlists/user/:userId
```
Returns user watchlists where each token includes its Coinbase URL for quick access.

### Sync Coinbase URLs
```
POST /api/v1/tokens/sync-coinbase-urls
```
Bulk updates Coinbase URLs for all tokens in the database.

## Frontend Integration

When displaying coins in your frontend, you can make them clickable by using the `coinbaseUrl` field:

```javascript
// React Example
{tokens.map(token => (
  <a 
    key={token.id}
    href={token.coinbaseUrl}
    target="_blank"
    rel="noopener noreferrer"
  >
    {token.symbol} - {token.name}
  </a>
))}
```

```html
<!-- HTML Example -->
<a href="${token.coinbaseUrl}" target="_blank" rel="noopener noreferrer">
  ${token.symbol} - ${token.name}
</a>
```

## URL Format
Coinbase URLs follow this format:
```
https://www.coinbase.com/price/{SYMBOL}
```

Where `{SYMBOL}` is the uppercase token symbol (e.g., BTC, ETH, DOGE).

## Database Schema
The Token model now includes:
```prisma
model Token {
  // ... other fields
  coinbaseUrl     String?
  // ... other fields
}
```

## Running the Application

1. Start the database:
```bash
docker-compose up -d postgres redis
```

2. Run migrations:
```bash
npm run prisma:migrate
```

3. Start the development server:
```bash
npm run start:dev
```

4. Access the API documentation:
```
http://localhost:3000/docs
```

## Testing the Feature

1. Create some test data in your database
2. Call `GET /api/v1/tokens` - each token will include a `coinbaseUrl`
3. Use these URLs in your frontend to make coin tabs clickable
4. URLs will open the coin's Coinbase page in a new tab
