# GitHub Actions & Automated Data Sync Setup

## Overview

MemeScout now includes fully automated data synchronization and database maintenance with a **2-year rolling window** of historical data. The system runs multiple scheduled tasks via GitHub Actions and NestJS cron jobs.

## 🚀 Key Features

### 1. **10-Minute Data Sync**
- **Frequency**: Every 10 minutes (144 times per day)
- **Data**: Token prices, volume, holders, social metrics
- **Action**: `data-sync-10min.yml`
- **Snapshots stored**: One per token every 10 minutes

### 2. **2-Year Historical Data Retention**
- **Active storage**: TokenSnapshot table (0-2 years)
- **Archive storage**: SnapshotArchive table (2+ years)
- **Auto-archival**: Daily at 2 AM UTC
- **Total capacity**: ~50GB for 1000 tokens × 2 years

### 3. **Automated Database Maintenance**
- **Daily 2 AM UTC**: Archive old snapshots
- **Daily 3 AM UTC**: Cleanup old sync jobs
- **Daily 1 AM UTC**: Generate statistics
- **Hourly**: Data integrity validation

### 4. **Health Monitoring**
- **Endpoints**: `/api/v1/health`, `/api/v1/health/db`, `/api/v1/health/sync-jobs`
- **Tracks**: Sync status, database health, snapshot counts
- **Updates**: Real-time metrics

## 📊 Database Schema

### New Tables

```
TokenSnapshot (Active)
├─ id, tokenId, priceUsd, volume24h, memeScore
├─ holders, liquidityUsd, buyPressure
└─ timestamp (indexed for queries)

SnapshotArchive (Historical)
├─ id, tokenId, priceUsd, volume24h, memeScore
├─ holders, liquidityUsd, buyPressure
├─ timestamp, archivedAt (indexed)
└─ Purpose: Long-term storage (2+ years)

DataSyncJob (Audit Trail)
├─ id, jobType, status (PENDING|IN_PROGRESS|COMPLETED|FAILED)
├─ tokensCount, snapshotsAdded, errors
├─ startedAt, completedAt, duration
└─ Retention: 30 days (auto-deleted)
```

## 🔄 GitHub Actions Workflows

### 1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)
**Trigger**: Push to main, Pull requests

```yaml
Steps:
  ✓ Build NestJS application
  ✓ Generate Prisma Client
  ✓ Check migration status
  ✓ Run linter
  ✓ Run tests
  ✓ Upload build artifacts
```

### 2. **Data Sync - Every 10 Minutes** (`.github/workflows/data-sync-10min.yml`)
**Trigger**: Every 10 min (`*/10 * * * *`)

```yaml
Steps:
  ✓ Fetch token data from DEX APIs
  ✓ Create new TokenSnapshot records
  ✓ Archive snapshots older than 2 years
  ✓ Clean old sync jobs
  ✓ Log sync status
```

**Time**: ~8 minute timeout (data fetching + database operations)

### 3. **Database Maintenance** (`.github/workflows/db-maintenance-daily.yml`)
**Trigger**: Daily at 2 AM UTC

```yaml
Steps:
  ✓ Archive snapshots older than 2 years
  ✓ Optimize database (VACUUM ANALYZE)
  ✓ Remove inactive tokens (analyze)
  ✓ Generate database statistics
  ✓ Run pending migrations
```

## ⏰ NestJS Scheduled Tasks

The backend also runs parallel scheduled tasks using `@nestjs/schedule`:

```typescript
@Cron('*/10 * * * *')  // Every 10 minutes
async syncTokenDataEvery10Minutes()

@Cron('0 2 * * *')     // Daily 2 AM UTC
async archiveOldSnapshotsDaily()

@Cron('0 3 * * *')     // Daily 3 AM UTC
async cleanupOldSyncJobsDaily()

@Cron('0 1 * * *')     // Daily 1 AM UTC
async generateDatabaseStatisticsDaily()

@Cron('0 * * * *')     // Hourly
async validateDataIntegrityHourly()
```

## 💻 Manual Data Sync

### Via npm script:
```bash
npm run data:sync
```

### Via API (if implemented):
```bash
curl POST http://localhost:3000/api/v1/tokens/sync
```

### Check status:
```bash
curl http://localhost:3000/api/v1/health/sync-jobs
```

## 📈 Data Statistics

### Snapshot Volume
```
Tokens: 1000
Snapshots per day: 144 (every 10 min)
Total daily snapshots: 144,000
Bytes per snapshot: ~500
Daily storage: ~72 MB
2-year storage: ~52 GB
```

### Query Performance
```
Recent snapshots (24h): < 100 ms
Historical queries (6 months): < 500 ms
Trend analysis (2 years): < 2 seconds
```

## 🔍 Health Checks

### System Health
```bash
GET /api/v1/health
```
Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600.5
}
```

### Database Health
```bash
GET /api/v1/health/db
```
Response:
```json
{
  "database": "OK",
  "stats": {
    "total_tokens": 1250,
    "active_snapshots": 180000,
    "archived_snapshots": 5000000,
    "latest_snapshot": "2024-01-15T10:20:00Z",
    "syncs_last_24h": 144
  }
}
```

### Sync Job Status
```bash
GET /api/v1/health/sync-jobs
```
Response:
```json
{
  "summary": {
    "total": 10,
    "completed": 9,
    "failed": 0,
    "pending": 1,
    "avgDuration": 450
  },
  "recentJobs": [
    {
      "id": "job-123",
      "jobType": "TOKEN_SNAPSHOT",
      "status": "COMPLETED",
      "tokensCount": 1250,
      "snapshotsAdded": 1250,
      "duration": 420
    }
  ]
}
```

## 🚨 Monitoring & Alerts

### Check recent syncs via SQL:
```sql
SELECT 
  jobType,
  status,
  COUNT(*) as count,
  AVG(duration) as avg_duration_ms
FROM "DataSyncJob"
WHERE "completedAt" > NOW() - INTERVAL '24 hours'
GROUP BY jobType, status;
```

### Monitor database growth:
```sql
SELECT 
  'TokenSnapshot' as table_name,
  COUNT(*) as rows,
  (pg_total_relation_size('TokenSnapshot') / 1024 / 1024) as size_mb
UNION
SELECT 
  'SnapshotArchive' as table_name,
  COUNT(*) as rows,
  (pg_total_relation_size('SnapshotArchive') / 1024 / 1024) as size_mb
FROM "SnapshotArchive";
```

## 🔐 Environment Variables

Required for GitHub Actions:

```env
DATABASE_URL=postgresql://user:password@host:5432/memescout
REDIS_URL=redis://localhost:6379
NODE_ENV=production
GITHUB_TOKEN=<for notifications>
DB_PASSWORD=<for Actions workflows>
```

## 📝 API Endpoints for Data Access

### Get Latest Data
```
GET /api/v1/tokens              # All tokens
GET /api/v1/tokens/new-launches # Recently launched
GET /api/v1/tokens/:id          # Specific token
```

### Get Historical Data
```
GET /api/v1/tokens/:id/price-history?days=30  # Price trends
GET /api/v1/tokens/:id/snapshots?start=&end=  # Date range
```

### Health & Monitoring
```
GET /api/v1/health              # System health
GET /api/v1/health/db           # Database stats
GET /api/v1/health/sync-jobs    # Sync job status
```

## 🛠️ Configuration

### Change sync frequency:
Edit `.github/workflows/data-sync-10min.yml`:
```yaml
schedule:
  - cron: '0 * * * *'  # Every hour instead of 10 min
```

### Change retention period:
Edit `src/scheduled-tasks/scheduled-tasks.service.ts`:
```typescript
const twoYearsAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year instead
```

### Change maintenance schedule:
Edit `.github/workflows/db-maintenance-daily.yml`:
```yaml
schedule:
  - cron: '0 3 * * *'  # Different time
```

## ⚙️ Local Development

### Start with scheduled tasks:
```bash
npm run start:dev
# Scheduled tasks will run at defined intervals
```

### Manually trigger sync:
```bash
npm run data:sync
```

### Check logs:
```bash
npm run start:dev | grep "Sync\|Archive\|Cleanup"
```

### View database:
```bash
npx prisma studio
# Open http://localhost:5555
```

## 🚀 Production Deployment

### Enable GitHub Actions:
1. Go to GitHub repo → Settings → Actions
2. Enable "Allow all actions and reusable workflows"
3. Ensure secrets are configured

### Setup database secrets:
```bash
# In GitHub repo settings:
Settings → Secrets and variables → Actions
# Add: DB_PASSWORD, GITHUB_TOKEN
```

### Monitor in GitHub:
- Go to Actions tab
- Check workflow runs
- View detailed logs
- Set up notifications

## 📊 Expected Performance

### Sync Time
```
10 minutes: Sync 1000 tokens + archive old data
- API calls: ~1000-2000 ms
- Database inserts: ~2000-3000 ms
- Archival: ~1000-2000 ms
- Total: ~4-7 seconds (within 8 min timeout)
```

### Database Growth
```
Per day: ~144 * 1000 = 144,000 snapshots
Size: ~72 MB/day
Yearly: ~26 GB/year
2-year total: ~52 GB for 1000 tokens
```

## 🐛 Troubleshooting

### Sync job fails
- Check DEX API rate limits
- Verify database connection string
- Check GitHub Actions logs

### Database grows too large
- Verify archival is running
- Check SnapshotArchive table
- Run `VACUUM ANALYZE` manually

### Slow queries
- Check indexes: `SELECT * FROM information_schema.statistics WHERE table_schema = 'public'`
- Use `EXPLAIN ANALYZE` on slow queries
- Consider partitioning SnapshotArchive by year

## 📚 Resources

- [GitHub Actions Cron Syntax](https://crontab.guru/)
- [Prisma Scheduled Tasks](https://docs.nestjs.com/techniques/task-scheduling)
- [PostgreSQL Maintenance](https://www.postgresql.org/docs/current/routine-vacuuming.html)
- [NestJS Best Practices](https://docs.nestjs.com/fundamentals/custom-providers)

## 🎯 Future Enhancements

- [ ] Real-time data sync using webhooks
- [ ] Data compression for archive tables
- [ ] Automated backups to cloud storage
- [ ] Advanced analytics dashboard
- [ ] Machine learning for anomaly detection
- [ ] Alert system for unusual patterns
- [ ] Multi-chain support
- [ ] Reactive price tracking
