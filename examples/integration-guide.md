# Frontend Integration Guide - Clickable Coinbase Links

This guide shows how to integrate clickable Coinbase links in your frontend application.

## Quick Start

The backend API provides a `coinbaseUrl` field in every token response. Simply use it in an anchor tag to make coins clickable.

## Basic HTML Implementation

### 1. Simple Clickable Coin Name

```html
<div class="coin-card">
    <h4>
        <a href="${coin.coinbaseUrl}" target="_blank" rel="noopener noreferrer">
            ${coin.symbol}
            <i class="bi bi-box-arrow-up-right"></i>
        </a>
    </h4>
    <p>${coin.name}</p>
</div>
```

### 2. Entire Card Clickable

```html
<a href="${coin.coinbaseUrl}" target="_blank" rel="noopener noreferrer" class="coin-link">
    <div class="coin-card">
        <h4>${coin.symbol}</h4>
        <p>Price: $${coin.priceUsd}</p>
        <p>Score: ${coin.memeScore}</p>
    </div>
</a>
```

### 3. Button for Coinbase

```html
<div class="coin-card">
    <h4>${coin.symbol}</h4>
    <p>Price: $${coin.priceUsd}</p>
    
    <a href="${coin.coinbaseUrl}" 
       target="_blank" 
       rel="noopener noreferrer"
       class="btn btn-primary">
        View on Coinbase
    </a>
</div>
```

## React Implementation

```jsx
import React, { useEffect, useState } from 'react';

function TokenList() {
    const [tokens, setTokens] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3000/api/v1/tokens')
            .then(res => res.json())
            .then(data => setTokens(data.tokens));
    }, []);
    
    return (
        <div className="token-grid">
            {tokens.map(coin => (
                <div key={coin.id} className="coin-card">
                    <a 
                        href={coin.coinbaseUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="coin-link"
                    >
                        <h4>
                            {coin.symbol}
                            <i className="bi bi-box-arrow-up-right ms-2"></i>
                        </h4>
                        <p>{coin.name}</p>
                        <p>Score: {coin.memeScore?.toFixed(2)}</p>
                    </a>
                    
                    <div className="coin-details">
                        <p>Price: ${coin.priceUsd?.toFixed(6)}</p>
                        <p>Volume: ${coin.volume24h?.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TokenList;
```

## Vue.js Implementation

```vue
<template>
    <div class="token-grid">
        <div v-for="coin in tokens" :key="coin.id" class="coin-card">
            <a 
                :href="coin.coinbaseUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="coin-link"
            >
                <h4>
                    {{ coin.symbol }}
                    <i class="bi bi-box-arrow-up-right ms-2"></i>
                </h4>
                <p>{{ coin.name }}</p>
            </a>
            
            <div class="coin-details">
                <p>Price: ${{ formatPrice(coin.priceUsd) }}</p>
                <p>Score: {{ coin.memeScore?.toFixed(2) }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tokens: []
        };
    },
    mounted() {
        this.loadTokens();
    },
    methods: {
        async loadTokens() {
            const response = await fetch('http://localhost:3000/api/v1/tokens');
            const data = await response.json();
            this.tokens = data.tokens;
        },
        formatPrice(price) {
            return price ? price.toFixed(6) : 'N/A';
        }
    }
};
</script>
```

## Vanilla JavaScript Implementation

```javascript
// Fetch and display tokens with clickable Coinbase links
async function displayTokens() {
    const response = await fetch('http://localhost:3000/api/v1/tokens');
    const data = await response.json();
    
    const container = document.getElementById('tokens-container');
    
    data.tokens.forEach(coin => {
        const card = document.createElement('div');
        card.className = 'coin-card';
        
        card.innerHTML = `
            <a href="${coin.coinbaseUrl}" target="_blank" rel="noopener noreferrer">
                <h4>
                    ${coin.symbol}
                    <i class="bi bi-box-arrow-up-right"></i>
                </h4>
                <p>${coin.name}</p>
            </a>
            <p>Price: $${coin.priceUsd?.toFixed(6) || 'N/A'}</p>
            <p>Score: ${coin.memeScore?.toFixed(2) || '0.00'}</p>
        `;
        
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', displayTokens);
```

## CSS for Hover Effects

```css
.coin-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: all 0.3s ease;
}

.coin-link:hover {
    transform: translateY(-3px);
    color: #0066cc;
}

.coin-card {
    transition: box-shadow 0.3s ease;
}

.coin-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.external-link-icon {
    font-size: 0.8em;
    opacity: 0.6;
}

.coin-link:hover .external-link-icon {
    opacity: 1;
}
```

## API Response Structure

The backend API returns tokens with the `coinbaseUrl` field:

```json
{
    "tokens": [
        {
            "id": "uuid",
            "symbol": "BTC",
            "name": "Bitcoin",
            "coinbaseUrl": "https://www.coinbase.com/price/BTC",
            "priceUsd": 50000,
            "memeScore": 95.5,
            "volume24h": 1000000000
        }
    ]
}
```

## Complete Example

See the `frontend-integration.html` file in this directory for a complete working example with:
- Clickable coin cards
- Hover effects
- Loading states
- Error handling
- Newly launched coins section
- Bootstrap styling

## Testing

1. Start your backend: `npm run start:dev`
2. Open the `frontend-integration.html` file in a browser
3. Click on any coin to navigate to Coinbase

## Important Notes

- Always use `target="_blank"` to open Coinbase in a new tab
- Always include `rel="noopener noreferrer"` for security
- The backend automatically generates Coinbase URLs for all tokens
- URLs follow the format: `https://www.coinbase.com/price/{SYMBOL}`
