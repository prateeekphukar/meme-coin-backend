# 🚀 Meme Coin Discovery & Ranking Backend

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.5-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)

**Production-ready backend API for discovering, tracking, and analyzing meme coins**

[🌐 Live Demo](https://prateeekphukar.github.io/meme-coin-showcase/) • [📖 API Docs](#-api-documentation) • [🚀 Quick Start](#-quick-start) • [💡 Features](#-features)

</div>

---

## 📍 Live API & Documentation

> **🔗 Live API Base URL**: Deploy with Docker/Codespaces or locally (see [Quick Start](#-quick-start))  
> **📚 Interactive API Documentation**: `http://localhost:3000/docs` (Swagger UI)  
> **🎨 Frontend Demo**: [MemeScout Showcase](https://prateeekphukar.github.io/meme-coin-showcase/)

### 🌟 Try It Now
```bash
# Example: Get newly launched coins with high volume
curl "http://localhost:3000/api/v1/tokens/new-launches?maxDays=7&minVolume=500000"

# Example: Get token price history
curl "http://localhost:3000/api/v1/tokens/{token-id}/price-history?days=30"
```

## 🎯 What is MemeScout?

MemeScout is a **comprehensive backend API** for discovering trending meme coins, analyzing their potential, and tracking performance. Built with modern technologies and best practices, it provides:

- 🔍 **Real-time coin discovery** from DEX APIs (DexScreener, CoinGecko)
- 📊 **Intelligent scoring system** based on momentum, liquidity, and stability
- 💰 **Price tracking** with historical data and trend analysis
- 🔗 **Direct CoinMarketCap integration** with clickable links to market data
- 🆕 **New launches tracker** for finding hot new coins
- 📱 **Mobile-optimized** RESTful API with JWT authentication
- ⚡ **High-performance** caching with Redis

### 📱 Mobile Ready
Optimized for high-performance mobile clients:
- **Firebase Cloud Messaging (FCM)**: Real-time push notifications
- **RESTful JSON**: Lightweight, optimized payloads for low-latency
- **JWT Auth**: Secure, biometric-compatible authentication flow

## 📋 Table of Contents
- [Live API & Documentation](#-live-api--documentation)
- [What is MemeScout?](#-what-is-memescout)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

<table>
<tr>
<td>

### 🎯 Core Functionality
- ✅ **Real-time Discovery**: Automatically find new meme coins from DEX APIs
- ✅ **Intelligent Scoring**: Multi-factor analysis (momentum, liquidity, stability)
- ✅ **User Watchlists**: Personalized token tracking
- ✅ **Smart Alerts**: Price, score, and percentage change notifications
- ✅ **RESTful API**: Clean, well-documented endpoints
- ✅ **Caching Layer**: Redis-powered high-performance reads

</td>
<td>

### 🆕 Latest Features
- 🔗 **Clickable CoinMarketCap URLs**: Direct links to market data
- 🚀 **New Launches Tracker**: Find coins with high volume
- 📈 **Price History**: Historical data with snapshots
- 📊 **Price Change**: Auto-calculated % change since launch
- 🔥 **Volume Filtering**: Filter by 24h trading volume
- 📅 **Launch Date Filter**: Find the newest coins

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 20.0.0
- Docker & Docker Compose (recommended)
- PostgreSQL 15
- Redis 7

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/prateeekphukar/meme-coin-backend.git
cd meme-coin-backend

# Copy environment file
cp .env.example .env

# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# Run database migrations
npm run prisma:migrate

# Access API documentation
open http://localhost:3000/docs
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run start:dev

# API will be available at http://localhost:3000
```

### 🎯 Verify Installation

```bash
# Health check
curl http://localhost:3000/api/v1/tokens

# Get newly launched coins
curl "http://localhost:3000/api/v1/tokens/new-launches?maxDays=7&minVolume=100000"

# Access Swagger Documentation
open http://localhost:3000/docs
```

## 🔌 API Endpoints

### Token Endpoints
```bash
# Get all tokens with CoinMarketCap links
GET /api/v1/tokens?limit=100&offset=0

# Get newly launched coins with high volume
GET /api/v1/tokens/new-launches?maxDays=30&minVolume=100000&limit=50

# Get top tokens by meme score
GET /api/v1/tokens/top?limit=20

# Get single token details
GET /api/v1/tokens/:id

# Get token price history
GET /api/v1/tokens/:id/price-history?days=30

# Sync CoinMarketCap URLs for all tokens
POST /api/v1/tokens/sync-coinbase-urls
```

### Watchlist Endpoints
```bash
# Get user watchlists with CoinMarketCap links
GET /api/v1/watchlists/user/:userId
```

### Additional Endpoints
- `GET /api/v1/users` - List all users
- `GET /api/v1/alerts` - Get alerts
- `GET /api/v1/discovery` - Discover new tokens
- `GET /api/v1/scoring` - Calculate token scores

📚 **Full API Documentation**: Access interactive Swagger docs at `http://localhost:3000/docs`

## 📖 Feature Documentation

- [CoinMarketCap URLs Integration](COINBASE_URLS.md) - Learn how to use clickable CoinMarketCap links
- [New Launches Feature](NEW_LAUNCHES_FEATURE.md) - Complete guide to newly launched coins endpoint
- [Frontend Integration Examples](examples/) - Ready-to-use HTML/JS examples with clickable links

### 🎨 Live Frontend Examples

Try the complete integration example:
```bash
# Open the example in your browser
open examples/frontend-integration.html
```

Key features in the example:
- ✅ Clickable coin cards that link to CoinMarketCap
- ✅ Hover effects and smooth animations
- ✅ Newly launched coins section
- ✅ Price history and volume display
- ✅ Responsive Bootstrap design

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.3
- **ORM**: Prisma 5.5
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **API Docs**: Swagger/OpenAPI

</td>
<td valign="top" width="50%">

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Codespaces, Cloud platforms
- **CI/CD**: GitHub Actions

</td>
</tr>
</table>

## 🏗️ Architecture

```
Client Apps (Web/Mobile)
         │
         ▼
    NestJS API
    ┌──────────────┐
    │ Token Module │
    │ User Module  │
    │Watchlist Mod │
    └──────┬───────┘
           │
    ┌──────▼───────┐
    │  PostgreSQL  │
    │    Redis     │
    └──────────────┘
```

## 🚢 Deployment

### Docker Compose
```bash
docker-compose up -d
```

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/memescout"
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Contact

**Pratik Fulkar** - [@prateeekphukar](https://github.com/prateeekphukar)

---

<div align="center">

⭐ Star this repo if you find it helpful!

Made with ❤️ by [Pratik Fulkar](https://github.com/prateeekphukar)

</div>
