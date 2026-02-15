# 🚀 Meme Coin Discovery & Ranking Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

Production-ready backend API for a Meme Coin Discovery & Ranking platform. Discover trending meme coins, analyze potential, track favorites, and set smart alerts—all powered by real-time DEX data.

## 🌐 Live Showcase & Integration

Check out the interactive showcase site: [MemeScout Showcase](https://prateeekphukar.github.io/meme-coin-showcase/)

### 📱 Android APK & Mobile Ready
The backend is specifically optimized for high-performance mobile clients:
- **Firebase Cloud Messaging (FCM)**: Native support for real-time push notifications.
- **RESTful JSON**: Lightweight, optimized payloads for low-latency mobile experiences.
- **JWT Auth**: Secure, biometric-compatible authentication flow.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features
### Core Functionality
- **Real-time Discovery**: Automatically discovers new meme coins from DEX APIs (DexScreener, CoinGecko)
- **Intelligent Scoring**: Multi-factor scoring engine analyzing momentum, liquidity, age, and stability
- **User Watchlists**: Create and manage personalized token watchlists
- **Smart Alerts**: Price, score, and percentage change alerts with background processing
- **RESTful API**: Clean, well-documented endpoints for mobile/web clients
- **Caching Layer**: Redis-powered caching for high-performance reads

### 🆕 New Features
- **Clickable Coinbase URLs**: All coin tabs include direct links to Coinbase coin pages
- **Newly Launched Coins Tracker**: Dedicated endpoint for coins launched within last N days with high transaction volume
- **Price History Tracking**: Historical price data with snapshots for trend analysis
- **Price Change Calculations**: Automatic calculation of price changes since launch
- **Volume Filtering**: Filter coins by 24h trading volume to find high-activity tokens
- **Launch Date Filtering**: Find the newest coins based on launch date

## 🔌 API Endpoints

### Token Endpoints
```bash
# Get all tokens with Coinbase links
GET /api/v1/tokens?limit=100&offset=0

# Get newly launched coins with high volume
GET /api/v1/tokens/new-launches?maxDays=30&minVolume=100000&limit=50

# Get top tokens by meme score
GET /api/v1/tokens/top?limit=20

# Get single token details
GET /api/v1/tokens/:id

# Get token price history
GET /api/v1/tokens/:id/price-history?days=30

# Sync Coinbase URLs for all tokens
POST /api/v1/tokens/sync-coinbase-urls
```

### Watchlist Endpoints
```bash
# Get user watchlists with coin Coinbase links
GET /api/v1/watchlists/user/:userId
```

### Additional Endpoints
- `GET /api/v1/users` - List all users
- `GET /api/v1/alerts` - Get alerts
- `GET /api/v1/discovery` - Discover new tokens
- `GET /api/v1/scoring` - Calculate token scores

📚 **Full API Documentation**: Access interactive Swagger docs at `http://localhost:3000/docs`

## 📖 Feature Documentation

- [Coinbase URLs Integration](COINBASE_URLS.md) - Learn how to use clickable Coinbase links
- [New Launches Feature](NEW_LAUNCHES_FEATURE.md) - Complete guide to newly launched coins endpoint
