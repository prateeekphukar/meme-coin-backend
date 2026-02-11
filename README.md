# 🚀 Meme Coin Discovery & Ranking Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

Production-ready backend API for a Meme Coin Discovery & Ranking platform. Discover trending meme coins, analyze potential, track favorites, and set smart alerts—all powered by real-time DEX data.

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
- **Background Jobs**: Scheduled syncing and scoring with BullMQ queues

### Technical Highlights
- ✅ Clean Architecture with SOLID principles
- ✅ Repository pattern for data access
- ✅ JWT authentication (access + refresh tokens)
- ✅ Input validation with class-validator
- ✅ Comprehensive error handling
- ✅ Auto-generated Swagger/OpenAPI docs
- ✅ Docker containerization
- ✅ Database migrations with Prisma

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Language** | TypeScript |
| **Runtime** | Node.js 20 LTS |
| **Framework** | NestJS |
| **Database** | PostgreSQL 15 |
| **ORM** | Prisma |
| **Cache** | Redis 7 |
| **Queue** | BullMQ |
| **Authentication** | JWT (Passport) |
| **Validation** | class-validator |
| **Documentation** | Swagger/OpenAPI |
| **Containerization** | Docker & Docker Compose |

## 🏗 Architecture

### Project Structure

```
meme-coin-backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── config/                    # Configuration management
│   ├── common/                    # Shared utilities, guards, filters
│   ├── database/                  # Prisma setup
│   ├── cache/                     # Redis cache module
│   ├── queue/                     # BullMQ processors
│   └── modules/
│       ├── auth/                  # JWT authentication
│       ├── users/                 # User management
│       ├── chains/                # Blockchain networks
│       ├── tokens/                # Token endpoints
│       ├── scores/                # Scoring engine
│       ├── watchlists/            # User watchlists
│       ├── alerts/                # Alert system
│       ├── admin/                 # Admin operations
│       ├── integrations/          # External APIs (DexScreener, CoinGecko)
│       ├── sync/                  # Data synchronization
│       └── health/                # Health checks
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration files
├── docker-compose.yml             # Local development setup
├── Dockerfile                     # Production container
└── package.json
```

### Data Flow

```
┌─────────────────┐
│  External APIs  │
│  (DexScreener)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│  Sync Scheduler │────▶│  BullMQ Job  │
│  (Every 2-5min) │     │   Processor  │
└─────────────────┘     └──────┬───────┘
                               │
                               ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Scoring Engine │────▶│  PostgreSQL  │────▶│   Redis     │
│  (Every 10min)  │     │   (Prisma)   │     │   Cache     │
└─────────────────┘     └──────────────┘     └─────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   REST API   │
                        │  (NestJS)    │
                        └──────┬───────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │  Mobile/Web Client │
                     └────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/prateeekphukar/meme-coin-backend.git
cd meme-coin-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env.development
```

Edit `.env.development` with your configuration:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/memecoin?schema=public"

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Admin API Key (CHANGE IN PRODUCTION!)
ADMIN_API_KEY="your-admin-api-key"

# External API Keys (Optional)
DEXSCREENER_API_KEY=""
COINGECKO_API_KEY=""
```

4. **Start infrastructure with Docker**

```bash
docker-compose up -d postgres redis
```

5. **Run database migrations**

```bash
npx prisma migrate dev
npx prisma generate
```

6. **(Optional) Seed initial data**

```bash
npm run prisma:seed
```

7. **Start development server**

```bash
npm run start:dev
```

8. **Access the API**

- API Base URL: `http://localhost:3000/api/v1`
- Swagger Docs: `http://localhost:3000/api/docs`

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Tokens

#### Get Top Meme Coins
```http
GET /api/v1/tokens/top-memes?limit=20&sort=score&minScore=0.6

Response:
[
  {
    "id": "uuid",
    "symbol": "PEPE",
    "name": "Pepe Coin",
    "priceUsd": 0.000123,
    "priceChange1h": 15.5,
    "priceChange24h": 45.2,
    "volume24h": 1250000,
    "liquidity": 850000,
    "score": 0.82,
    "scoreBreakdown": {
      "momentum": 0.85,
      "liquidity": 0.75,
      "age": 0.90,
      "stability": 0.78
    },
    "explanation": "🔥 Exceptional meme potential. Strong: strong momentum, optimal age"
  }
]
```

#### Get New Tokens
```http
GET /api/v1/tokens/new?maxAgeMinutes=1440&chain=ethereum&limit=50
```

#### Get Token Details
```http
GET /api/v1/tokens/{tokenId}
```

### Watchlists (Requires Auth)

#### Create Watchlist
```http
POST /api/v1/watchlists
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "My Favorites"
}
```

#### Add Token to Watchlist
```http
POST /api/v1/watchlists/{watchlistId}/tokens
Authorization: Bearer {accessToken}

{
  "tokenId": "token-uuid"
}
```

### Alerts (Requires Auth)

#### Create Price Alert
```http
POST /api/v1/alerts
Authorization: Bearer {accessToken}

{
  "tokenId": "token-uuid",
  "type": "PRICE_ABOVE",
  "conditionValue": 0.0001
}
```

For full API documentation, visit `/api/docs` after starting the server.

## 🐳 Deployment

### Docker Production Build

```bash
# Build production image
docker build -t meme-coin-backend:latest .

# Run with docker-compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables

Ensure these are set in production:

```bash
NODE_ENV=production
DATABASE_URL=<production-postgres-url>
REDIS_HOST=<redis-host>
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
ADMIN_API_KEY=<secure-api-key>
```

### Database Migrations

```bash
# Run migrations in production
npx prisma migrate deploy
```

## 🔧 Development

### Available Scripts

```bash
npm run start:dev      # Start development server with hot-reload
npm run build          # Build for production
npm run start:prod     # Start production server
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Lint code
npm run format         # Format code with Prettier
npm run prisma:studio  # Open Prisma Studio (DB GUI)
```

### Scoring Algorithm

The scoring engine evaluates tokens across 4 dimensions:

1. **Momentum Score** (35% weight)
   - Short-term price changes (1h, 4h, 24h)
   - Volume spikes vs 24h average

2. **Liquidity Score** (25% weight)
   - Absolute liquidity levels
   - Volume-to-liquidity ratio

3. **Age Score** (20% weight)
   - Optimal: 1-7 days old
   - Penalty for too new (<12h) or too old (>30d)

4. **Stability Score** (20% weight)
   - Price change variance
   - Extreme volatility penalty

**Formula**: `finalScore = 0.35*momentum + 0.25*liquidity + 0.20*age + 0.20*stability`

Configurable via environment variables.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow existing code style
- Run `npm run lint` and `npm run format` before committing
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Data powered by [DexScreener](https://dexscreener.com/) and [CoinGecko](https://www.coingecko.com/)
- Inspired by the vibrant meme coin community

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**⚠️ Disclaimer**: This software is for educational and informational purposes only. Cryptocurrency trading carries significant risk. Always do your own research (DYOR) and never invest more than you can afford to lose.
