# Database & Data Sync Configuration

## Overview

This document describes the 2-year historical data storage system and automated data synchronization strategy for MemeScout.

## Database Schema

### Core Tables

#### `Token`
Stores information about meme coins.
- **Fields**: symbol, name, address, chainId, priceUsd, marketCap, volume24h, memeScore, etc.
- **Indexes**: memeScore, address, launchDate, volume24h, holders, twitterFollowers, createdAt
- **Purpose**: Primary token reference

#### `TokenSnapshot`
Real-time price and metrics snapshots taken every 10 minutes.
- **Fields**: tokenId, priceUsd, volume24h, memeScore, holders, liquidityUsd, timestamp
- **Index**: (tokenId, timestamp), timestamp DESC
- **Retention**: 2 years (active table)
- **Update Frequency**: Every 10 minutes

#### `SnapshotArchive`
Historical snapshots older than 2 years, moved for long-term storage.
- **Fields**: Same as TokenSnapshot + archivedAt
- **Index**: (tokenId, timestamp), timestamp DESC, archivedAt
- **Retention**: Indefinite (archive table)
- **Purpose**: Long-term historical analysis

#### `DataSyncJob`
Tracks all data synchronization runs.
- **Fields**: jobType, status, tokensCount, snapshotsAdded, errors, timestamps, duration
- **Index**: (jobType, completedAt), status
- **Retention**: 30 days
- **Purpose**: Monitoring and debugging

#### `Chain`, `User`, `Watchlist`, `WatchlistToken`
Supporting tables for chain information, user accounts, and watchlist management.

## Data Retention Strategy

### 2-Year Rolling Window
- **Active snapshots**: Last 730 days in `TokenSnapshot`
- **Archive snapshots**: Older than 730 days in `SnapshotArchive`
- **Automatic archival**: Daily at 2 AM UTC

### Storage Optimization
- **Estimated size per snapshot**: ~500 bytes
- **Daily snapshots per token**: 144 (1 per 10 min × 24 hours)
- **2-year storage for 1000 tokens**: ~50 GB
- **Compression**: Consider implementing for archive table

### Data Cleanup
- **Old sync jobs**: Deleted after 30 days (keep last 30 days of audit trail)
- **Orphaned records**: Cleaned hourly
- **Database optimization**: VACUUM ANALYZE daily

## Automated Sync Schedule

### GitHub Actions Workflows

#### 1. **Every 10 Minutes: Token Data Sync**
**File**: `.github/workflows/data-sync-10min.yml`

```
Run: Every 10 minutes
Timeout: 8 minutes
Tasks:
  - Fetch latest token data from DEX APIs
  - Create new TokenSnapshot records
  - Archive snapshots older than 2 years
  - Clean old sync jobs
  - Update DataSyncJob status
```

**Trigger**: 
- Automated schedule (`*/10 * * * *`)
- Manual dispatch via GitHub Actions UI

**Data Sources** (to be implemented):
- DexScreener API (for on-chain data)
- CoinGecko API (for historical data)
- CoinMarketCap API (market rankings)
- DEX-specific APIs (Uniswap, PancakeSwap, etc.)

#### 2. **Daily at 2 AM UTC: Database Maintenance**
**File**: `.github/workflows/db-maintenance-daily.yml`

```
Run: Every day at 2 AM UTC
Timeout: 30 minutes
Tasks:
  - Archive snapshots older than 2 years (batch processing)
  - Optimize database indexes (VACUUM ANALYZE)
  - Identify inactive tokens
  - Generate database statistics
  - Run migrations if available
```

#### 3. **CI/CD Pipeline: Build & Test**
**File**: `.github/workflows/ci.yml`

```
Run: On push to main, pull requests
Tasks:
  - Build NestJS application
  - Generate Prisma Client
  - Run linter
  - Run tests
  - Ensure migrations are up to date
```

## Local Development

### Setup Database
```bash
# Create .env file
cp .env.example .env

# Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost:5432/memescout"

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate
```

### Manual Data Sync
```bash
# Run sync script once
npm run data:sync

# Or via NestJS app (runs scheduled tasks)
npm run start:dev
```

### Database Inspection
```bash
# Open Prisma Studio (visual DB explorer)
npx prisma studio

# View migration history
npx prisma migrate status

# Create new migration after schema changes
npx prisma migrate dev --name <migration_name>
```

## Monitoring & Maintenance

### Health Checks

**Check sync job status**:
```sql
SELECT status, COUNT(*) as count, AVG(duration) as avg_duration_ms
FROM "DataSyncJob"
WHERE completedAt > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

**Check data recency**:
```sql
SELECT 
  COUNT(*) as total_snapshots,
  MAX(timestamp) as latest_snapshot,
  MIN(timestamp) as oldest_snapshot
FROM "TokenSnapshot";
```

**Check archive table size**:
```sql
SELECT 
  COUNT(*) as archived_snapshots,
  (pg_total_relation_size('SnapshotArchive') / 1024 / 1024) as size_mb
FROM "SnapshotArchive";
```

### Performance Tips

1. **Add missing indexes**: Check for slow queries
2. **Partition old data**: Consider table partitioning for SnapshotArchive
3. **Use read replicas**: For analytics queries on archive data
4. **Monitor query performance**: Use `pg_stat_statements`

## API Endpoints for Data Access

### Get Latest Data
```
GET /api/v1/tokens/new-launches
GET /api/v1/tokens/:id/price-history?days=30
```

### Historical Data
```
GET /api/v1/tokens/:id/snapshots?start=2024-01-01&end=2024-12-31
GET /api/v1/analytics/price-trends?token=SYMBOL&period=1y
```

## Disaster Recovery

### Backup Strategy
- **Automated**: Daily backups (implement with pg_dump in GitHub Actions)
- **Retention**: 7 days of backups
- **Location**: GitHub Artifacts or cloud storage (S3, GCS, etc.)

### Restore Procedure
```bash
# Restore from backup
pg_restore --username=memescout --dbname=memescout backup.dump
```

## Production Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/memescout
REDIS_URL=redis://localhost:6379
NODE_ENV=production
GITHUB_TOKEN=<for notifications>
```

### Cron Jobs (If not using GitHub Actions)
```bash
# Using systemd timer or traditional cron
*/10 * * * * /path/to/sync-tokens.sh
0 2 * * * /path/to/db-maintenance.sh
```

## Cost Optimization

1. **Database sizing**: Start small, scale based on snapshot volume
2. **Query optimization**: Use indexes effectively
3. **Archive strategy**: Move old data to cold storage
4. **Compression**: Enable table compression for archives
5. **Connection pooling**: Use PgBouncer or PgPool

## Future Improvements

- [ ] Implement table partitioning by date
- [ ] Add read-only replicas for analytics
- [ ] Set up automated backups to cloud storage
- [ ] Implement real-time data sync (vs 10-min batches)
- [ ] Add data validation and anomaly detection
- [ ] Create comprehensive analytics dashboard
- [ ] Implement automated alerting for failed syncs

## Support & Troubleshooting

### Common Issues

**1. Sync job timeout**
- Check DEX API rate limits
- Increase workflow timeout
- Implement API retries

**2. Database grows too large**
- Run manual archive: `npm run data:archive`
- Check for duplicate snapshots
- Verify retention policy is working

**3. Slow queries**
- Check indexes with `EXPLAIN ANALYZE`
- Use `pg_stat_statements` to find slow queries
- Consider query optimization or caching

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [GitHub Actions Scheduling](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#scheduled-events)
- [Cron Expression Format](https://crontab.guru/)
