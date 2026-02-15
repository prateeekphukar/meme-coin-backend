# New Launches Feature - Newly Launched Coins with High Volume

## Overview
Track newly launched meme coins with high transaction volume, including current prices, historical prices, and price changes since launch.

## API Endpoints

### Get Newly Launched Coins
```
GET /api/v1/tokens/new-launches
```

**Query Parameters:**
- `maxDays` (optional): Maximum days since launch (default: 30)
- `minVolume` (optional): Minimum 24h volume in USD (default: 100,000)
- `limit` (optional): Maximum number of results (default: 50)

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/tokens/new-launches?maxDays=7&minVolume=500000&limit=20"
```

**Response:**
```json
{
  "tokens": [
    {
      "id": "uuid",
      "symbol": "NEWMEME",
      "name": "New Meme Coin",
      "address": "0x...",
      "currentPrice": 0.0025,
      "initialPrice": 0.001,
      "priceChangePercent": 150.0,
      "volume24h": 1500000,
      "marketCap": 2500000,
      "memeScore": 87.5,
      "coinbaseUrl": "https://www.coinbase.com/price/NEWMEME",
      "launchDate": "2026-02-10T00:00:00.000Z",
      "daysSinceLaunch": 5,
      "priceHistory": [
        {
          "priceUsd": 0.001,
          "timestamp": "2026-02-10T00:00:00.000Z",
          "volume24h": 500000
        },
        {
          "priceUsd": 0.0015,
          "timestamp": "2026-02-11T00:00:00.000Z",
          "volume24h": 750000
        },
        {
          "priceUsd": 0.0025,
          "timestamp": "2026-02-15T00:00:00.000Z",
          "volume24h": 1500000
        }
      ]
    }
  ],
  "total": 15,
  "filters": {
    "maxDaysSinceLaunch": 7,
    "minVolume24h": 500000
  }
}
```

### Get Token Price History
```
GET /api/v1/tokens/:id/price-history
```

**Query Parameters:**
- `days` (optional): Number of days of history to fetch (default: 30)

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/tokens/abc-123/price-history?days=7"
```

**Response:**
```json
[
  {
    "priceUsd": 0.001,
    "volume24h": 500000,
    "memeScore": 75.0,
    "timestamp": "2026-02-08T00:00:00.000Z"
  },
  {
    "priceUsd": 0.0025,
    "volume24h": 1500000,
    "memeScore": 87.5,
    "timestamp": "2026-02-15T00:00:00.000Z"
  }
]
```

## Database Schema Updates

### Token Model
New fields added to track launches and volume:

```prisma
model Token {
  // ... existing fields
  volume24h       Float?          // 24-hour trading volume in USD
  launchDate      DateTime?       // Token launch date
  initialPrice    Float?          // Initial launch price in USD
  // ... other fields
}
```

**Indexes added:**
- `launchDate` (descending) - For efficient querying of recent launches
- `volume24h` (descending) - For sorting by trading volume

## Frontend Integration Examples

### React Component
```jsx
import React, { useEffect, useState } from 'react';

function NewLaunches() {
  const [newCoins, setNewCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/tokens/new-launches?maxDays=7&minVolume=500000')
      .then(res => res.json())
      .then(data => {
        setNewCoins(data.tokens);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="new-launches">
      <h2>🚀 Newly Launched Coins (High Volume)</h2>
      <div className="filters">
        <p>Showing coins from last {newCoins[0]?.filters?.maxDaysSinceLaunch || 7} days</p>
        <p>Minimum volume: ${newCoins[0]?.filters?.minVolume24h?.toLocaleString() || '100,000'}</p>
      </div>
      
      {newCoins.map(coin => (
        <div key={coin.id} className="coin-card">
          <div className="coin-header">
            <h3>
              <a href={coin.coinbaseUrl} target="_blank" rel="noopener noreferrer">
                {coin.symbol} - {coin.name}
              </a>
            </h3>
            <span className="launch-badge">
              Launched {coin.daysSinceLaunch} days ago
            </span>
          </div>
          
          <div className="coin-stats">
            <div className="stat">
              <label>Current Price:</label>
              <span>${coin.currentPrice.toFixed(6)}</span>
            </div>
            
            <div className="stat">
              <label>Initial Price:</label>
              <span>${coin.initialPrice?.toFixed(6) || 'N/A'}</span>
            </div>
            
            <div className={`stat ${coin.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
              <label>Change:</label>
              <span>
                {coin.priceChangePercent >= 0 ? '+' : ''}
                {coin.priceChangePercent?.toFixed(2)}%
              </span>
            </div>
            
            <div className="stat">
              <label>24h Volume:</label>
              <span>${coin.volume24h.toLocaleString()}</span>
            </div>
            
            <div className="stat">
              <label>Market Cap:</label>
              <span>${coin.marketCap?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
          
          {/* Price Chart */}
          <div className="price-history">
            <h4>Price History</h4>
            {coin.priceHistory.map((point, idx) => (
              <div key={idx} className="history-point">
                <span>{new Date(point.timestamp).toLocaleDateString()}</span>
                <span>${point.priceUsd.toFixed(6)}</span>
                <span>Vol: ${point.volume24h?.toLocaleString() || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NewLaunches;
```

### Vue.js Component
```vue
<template>
  <div class="new-launches">
    <h2>🚀 Newly Launched Coins (High Volume)</h2>
    
    <div class="filters">
      <label>Max Days: 
        <input v-model.number="maxDays" type="number" @change="fetchCoins" />
      </label>
      <label>Min Volume: 
        <input v-model.number="minVolume" type="number" @change="fetchCoins" />
      </label>
    </div>

    <div v-for="coin in coins" :key="coin.id" class="coin-card">
      <h3>
        <a :href="coin.coinbaseUrl" target="_blank" rel="noopener noreferrer">
          {{ coin.symbol }} - {{ coin.name }}
        </a>
      </h3>
      
      <div class="coin-info">
        <p>Current: ${{ coin.currentPrice }}</p>
        <p>Initial: ${{ coin.initialPrice }}</p>
        <p :class="{ positive: coin.priceChangePercent >= 0, negative: coin.priceChangePercent < 0 }">
          Change: {{ coin.priceChangePercent?.toFixed(2) }}%
        </p>
        <p>Volume: ${{ coin.volume24h.toLocaleString() }}</p>
        <p>Launched: {{ coin.daysSinceLaunch }} days ago</p>
      </div>

      <div class="price-history">
        <div v-for="(point, idx) in coin.priceHistory" :key="idx">
          {{ new Date(point.timestamp).toLocaleDateString() }}: ${{ point.priceUsd }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      coins: [],
      maxDays: 7,
      minVolume: 500000
    };
  },
  mounted() {
    this.fetchCoins();
  },
  methods: {
    async fetchCoins() {
      const response = await fetch(
        `/api/v1/tokens/new-launches?maxDays=${this.maxDays}&minVolume=${this.minVolume}`
      );
      const data = await response.json();
      this.coins = data.tokens;
    }
  }
};
</script>
```

### Plain JavaScript
```javascript
async function loadNewLaunches() {
  const response = await fetch('/api/v1/tokens/new-launches?maxDays=7&minVolume=500000');
  const data = await response.json();
  
  const container = document.getElementById('new-launches-container');
  
  data.tokens.forEach(coin => {
    const card = document.createElement('div');
    card.className = 'coin-card';
    
    card.innerHTML = `
      <h3>
        <a href="${coin.coinbaseUrl}" target="_blank" rel="noopener noreferrer">
          ${coin.symbol} - ${coin.name}
        </a>
      </h3>
      <div class="stats">
        <p>Current Price: $${coin.currentPrice.toFixed(6)}</p>
        <p>Initial Price: $${coin.initialPrice?.toFixed(6) || 'N/A'}</p>
        <p class="${coin.priceChangePercent >= 0 ? 'positive' : 'negative'}">
          Change: ${coin.priceChangePercent >= 0 ? '+' : ''}${coin.priceChangePercent?.toFixed(2)}%
        </p>
        <p>24h Volume: $${coin.volume24h.toLocaleString()}</p>
        <p>Launched: ${coin.daysSinceLaunch} days ago</p>
      </div>
      <div class="price-history">
        <h4>Price History</h4>
        ${coin.priceHistory.map(point => `
          <div class="history-point">
            <span>${new Date(point.timestamp).toLocaleDateString()}</span>
            <span>$${point.priceUsd.toFixed(6)}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Load on page load
document.addEventListener('DOMContentLoaded', loadNewLaunches);
```

## Data Population

To populate the database with sample data for testing:

### SQL Script
```sql
-- Insert sample chain
INSERT INTO "Chain" (id, name, symbol, "createdAt")
VALUES ('chain-1', 'Ethereum', 'ETH', NOW());

-- Insert newly launched tokens with high volume
INSERT INTO "Token" (
  id, symbol, name, address, "chainId", 
  "priceUsd", "marketCap", "volume24h", "memeScore", 
  "launchDate", "initialPrice", "coinbaseUrl",
  "createdAt", "updatedAt"
)
VALUES 
  (
    'token-1', 'ROCKETMEME', 'Rocket Meme', '0x1234...', 'chain-1',
    0.0025, 2500000, 1500000, 87.5,
    NOW() - INTERVAL '5 days', 0.001, 'https://www.coinbase.com/price/ROCKETMEME',
    NOW(), NOW()
  ),
  (
    'token-2', 'MOONSHOT', 'Moon Shot Token', '0x5678...', 'chain-1',
    0.015, 15000000, 3200000, 92.0,
    NOW() - INTERVAL '3 days', 0.005, 'https://www.coinbase.com/price/MOONSHOT',
    NOW(), NOW()
  );

-- Insert price history snapshots
INSERT INTO "TokenSnapshot" (id, "tokenId", "priceUsd", "volume24h", "memeScore", timestamp)
VALUES
  ('snap-1', 'token-1', 0.001, 500000, 75.0, NOW() - INTERVAL '5 days'),
  ('snap-2', 'token-1', 0.0015, 750000, 80.0, NOW() - INTERVAL '3 days'),
  ('snap-3', 'token-1', 0.0025, 1500000, 87.5, NOW()),
  ('snap-4', 'token-2', 0.005, 1000000, 85.0, NOW() - INTERVAL '3 days'),
  ('snap-5', 'token-2', 0.010, 2000000, 90.0, NOW() - INTERVAL '1 day'),
  ('snap-6', 'token-2', 0.015, 3200000, 92.0, NOW());
```

## Use Cases

1. **Discovery Dashboard**: Show users the hottest newly launched coins
2. **Trading Alerts**: Alert users when new coins exceed volume thresholds
3. **Investment Research**: Track price performance of recent launches
4. **Market Trends**: Analyze which new coins gain traction quickly
5. **Portfolio Tracking**: Monitor new additions to watchlists

## Performance Considerations

- Database indexes on `launchDate` and `volume24h` ensure fast queries
- Price history is limited to 100 snapshots per token in the query
- Default filters balance comprehensiveness with performance:
  - 30 days max age
  - $100,000 minimum volume
  - 50 results per page

## Migration

Run the migration to add new fields:

```bash
npm run prisma:migrate
```

This will add:
- `volume24h` field to Token table
- `launchDate` field to Token table
- `initialPrice` field to Token table
- Indexes for efficient querying

## API Documentation

Access the full interactive API documentation at:
```
http://localhost:3000/docs
```

The Swagger UI will show all available endpoints, request/response schemas, and allow you to test the API directly.
