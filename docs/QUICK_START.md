# Quick Start Guide - 2-Year Data Sync

## 🚀 Get Started in 5 Minutes

### 1. **Clone & Install**
```bash
git clone https://github.com/prateeekphukar/meme-coin-backend.git
cd meme-coin-backend
npm install
```

### 2. **Setup Database**
```bash
# Create .env file
cp .env.example .env

# Update DATABASE_URL in .env
# Example: postgresql://user:password@localhost:5432/memescout
```

### 3. **Initialize Database**
```bash
# Generate Prisma Client
npm run prisma:generate

# Create tables and run migrations
npm run prisma:migrate

# (Optional) Open database viewer
npx prisma studio
```

### 4. **Start Backend**
```bash
# Development mode (with auto-reload)
npm run start:dev

# Production mode
npm run start:prod
```

### 5. **Verify Setup**
```bash
# Check system health
curl http://localhost:3000/api/v1/health

# Check database health
curl http://localhost:3000/api/v1/health/db

# Check sync jobs
curl http://localhost:3000/api/v1/health/sync-jobs

# View API docs
open http://localhost:3000/docs
```

## 📊 What's Running Automatically

### Local (NestJS Scheduled Tasks)
- ✅ **Every 10 min**: Sync token data → create snapshots
- ✅ **Daily 2 AM**: Archive snapshots > 2 years
- ✅ **Daily 3 AM**: Cleanup old sync jobs
- ✅ **Daily 1 AM**: Generate statistics
- ✅ **Hourly**: Data integrity checks

### GitHub Actions (When Pushed)
- ✅ **Every 10 min**: `data-sync-10min.yml`
- ✅ **Daily 2 AM**: `db-maintenance-daily.yml`
- ✅ **On push**: `ci.yml` (build + test)

## 🔄 Manual Data Sync

```bash
# Trigger sync manually
npm run data:sync

# Check recent syncs
curl http://localhost:3000/api/v1/health/sync-jobs
```

## 📈 Sample Queries

### Get all tokens
```bash
curl http://localhost:3000/api/v1/tokens
```

### Get new launches
```bash
curl http://localhost:3000/api/v1/tokens/new-launches?maxDays=7
```

### Get price history
```bash
curl http://localhost:3000/api/v1/tokens/{id}/price-history?days=30
```

### Get system stats
```bash
curl http://localhost:3000/api/v1/health/db
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema with new tables |
| `.github/workflows/data-sync-10min.yml` | 10-minute sync action |
| `.github/workflows/db-maintenance-daily.yml` | Daily maintenance action |
| `src/scheduled-tasks/scheduled-tasks.service.ts` | NestJS scheduled tasks |
| `src/health/health.controller.ts` | Health check endpoints |
| `src/scripts/sync-tokens.ts` | Manual sync script |
| `docs/ACTIONS_AND_SYNC.md` | Full documentation |
| `docs/DATABASE_SYNC.md` | Database details |

## 🎯 Next Steps

### 1. **Real DEX API Integration**
Update `syncTokenDataEvery10Minutes()` in `src/scheduled-tasks/scheduled-tasks.service.ts` to fetch actual data:
```typescript
// Replace with real API calls
const tokens = await fetchFromDexScreener(); // or CoinGecko
const data = await calculateMemeScore(tokens);
```

### 2. **Setup GitHub Secrets**
In repo settings, add:
- `DB_PASSWORD`: Database password
- `GITHUB_TOKEN`: For notifications

### 3. **Configure Alerts**
Add Slack/Email notifications when syncs fail:
```yaml
- name: Notify on failure
  if: failure()
  run: curl -X POST ${{ secrets.SLACK_URL }} -d "{text: 'Sync failed'}"
```

### 4. **Monitor in Production**
- Check GitHub Actions tab for workflow runs
- Monitor `/api/v1/health/db` endpoint
- Setup database backups
- Configure CloudWatch/DataDog alerts

## 🐛 Debugging

### Check database connection
```bash
npx prisma studio
# Should open interactive database viewer
```

### View recent syncs
```sql
SELECT * FROM "DataSyncJob" 
WHERE "completedAt" > NOW() - INTERVAL '1 hour'
ORDER BY "completedAt" DESC;
```

### Check active snapshots
```sql
SELECT 
  COUNT(*) as total_snapshots,
  COUNT(DISTINCT "tokenId") as unique_tokens,
  MAX("timestamp") as latest,
  MIN("timestamp") as oldest
FROM "TokenSnapshot";
```

### Enable debug logging
```bash
DEBUG=* npm run start:dev
```

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/memescout

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# NestJS
NODE_ENV=development|production
PORT=3000

# Logging
LOG_LEVEL=debug|info|warn|error

# API Keys (for real data sources)
COINGECKO_API_KEY=your_key
DEXSCREENER_API_KEY=your_key
```

## ✅ Checklist

- [ ] Database created and migrated
- [ ] Backend starts without errors
- [ ] Health endpoints respond
- [ ] Can access Swagger docs at `/docs`
- [ ] Scheduled tasks log outputs
- [ ] Manual sync works: `npm run data:sync`
- [ ] GitHub Actions enabled in repo
- [ ] Database secrets configured

## 🚀 Deployment

### Docker
```bash
# Build
docker build -t memescout .

# Run with PostgreSQL
docker-compose up -d
```

### Cloud (AWS/GCP/Azure)
```bash
# Push image
docker push your-registry/memescout

# Deploy with managed database
# Set DATABASE_URL environment variable
```

### GitHub Actions Auto-Deploy
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: |
          # Your deployment commands here
```

## 💡 Tips

1. **Use Prisma Studio** to explore data visually:
   ```bash
   npx prisma studio
   ```

2. **Monitor with SQL** - Run queries directly:
   ```bash
   psql postgresql://user:password@localhost/memescout
   ```

3. **Test syncs locally** before pushing:
   ```bash
   npm run data:sync  # Run manually first
   ```

4. **Check logs**:
   ```bash
   npm run start:dev  # Shows all scheduled task logs
   ```

5. **Benchmark queries**:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM "Token" WHERE "memeScore" > 50;
   ```

## 📚 Documentation

- **Full Setup**: See [DATABASE_SYNC.md](./DATABASE_SYNC.md)
- **Workflows**: See [ACTIONS_AND_SYNC.md](./ACTIONS_AND_SYNC.md)
- **API Docs**: `http://localhost:3000/docs` (Swagger)
- **Prisma**: https://www.prisma.io/docs

## 🆘 Need Help?

### Check Status
```bash
# System health
curl http://localhost:3000/api/v1/health

# Last 10 sync jobs
curl http://localhost:3000/api/v1/health/sync-jobs

# Database stats
curl http://localhost:3000/api/v1/health/db
```

### View Logs
```bash
# Show only errors
npm run start:dev 2>&1 | grep ERROR

# Show sync operations
npm run start:dev 2>&1 | grep Sync

# Show everything
npm run start:dev
```

### Reset Database (⚠️ CAREFUL)
```bash
# Delete all data and recreate
npx prisma migrate reset

# Then run migrations again
npm run prisma:migrate
```

## 🎉 You're All Set!

Your MemeScout backend is now ready to:
- ✅ Sync data every 10 minutes
- ✅ Store 2 years of historical data
- ✅ Automatically archive old data
- ✅ Provide real-time API endpoints
- ✅ Monitor system health
- ✅ Scale to production

Happy coding! 🚀
