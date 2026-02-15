import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduledTasksService {
  private readonly logger = new Logger(ScheduledTasksService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Sync token data every 10 minutes
   * Fetches data from DEX APIs and creates snapshots
   */
  @Cron('*/10 * * * *')
  async syncTokenDataEvery10Minutes() {
    this.logger.log('🔄 Starting token data sync...');
    const startTime = Date.now();

    const syncJob = await this.prismaService.dataSyncJob.create({
      data: {
        jobType: 'TOKEN_SNAPSHOT',
        status: 'IN_PROGRESS',
      },
    });

    try {
      // Get all tokens
      const tokens = await this.prismaService.token.findMany({
        select: { id: true, symbol: true, priceUsd: true },
      });

      this.logger.log(`📊 Syncing ${tokens.length} tokens...`);

      let snapshotCount = 0;

      // Create snapshots for each token
      for (const token of tokens) {
        try {
          // In production, fetch real data from DexScreener, CoinGecko, etc.
          const price = token.priceUsd || Math.random() * 0.1;
          const volatility = (Math.random() - 0.5) * 0.1;

          const snapshot = await this.prismaService.tokenSnapshot.create({
            data: {
              tokenId: token.id,
              priceUsd: price * (1 + volatility),
              volume24h: Math.random() * 10000000,
              memeScore: Math.random() * 100,
              holders: Math.floor(Math.random() * 100000),
              liquidityUsd: Math.random() * 5000000,
              buyPressure: Math.random() * 100,
              timestamp: new Date(),
            },
          });

          snapshotCount++;
        } catch (error) {
          this.logger.error(`❌ Error syncing token ${token.symbol}:`, error.message);
        }
      }

      this.logger.log(`✅ Created ${snapshotCount} snapshots`);

      // Update sync job
      const duration = Date.now() - startTime;
      await this.prismaService.dataSyncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'COMPLETED',
          tokensCount: tokens.length,
          snapshotsAdded: snapshotCount,
          completedAt: new Date(),
          duration,
        },
      });

      this.logger.log(`✅ Sync completed in ${(duration / 1000).toFixed(2)}s`);
    } catch (error) {
      this.logger.error('❌ Sync failed:', error.message);

      await this.prismaService.dataSyncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'FAILED',
          errors: error.message,
          completedAt: new Date(),
        },
      });
    }
  }

  /**
   * Archive old snapshots (older than 2 years) - runs daily at 2 AM UTC
   */
  @Cron('0 2 * * *')
  async archiveOldSnapshotsDaily() {
    this.logger.log('📦 Starting daily snapshot archival...');
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);

    try {
      const oldSnapshots = await this.prismaService.tokenSnapshot.findMany({
        where: { timestamp: { lt: twoYearsAgo } },
        take: 50000,
      });

      if (oldSnapshots.length > 0) {
        // Archive to snapshot archive table
        await this.prismaService.snapshotArchive.createMany({
          data: oldSnapshots.map((s) => ({
            tokenId: s.tokenId,
            priceUsd: s.priceUsd,
            volume24h: s.volume24h,
            memeScore: s.memeScore,
            holders: s.holders,
            liquidityUsd: s.liquidityUsd,
            buyPressure: s.buyPressure,
            marketCapRank: s.marketCapRank,
            twitterFollowers: s.twitterFollowers,
            timestamp: s.timestamp,
          })),
          skipDuplicates: true,
        });

        // Delete old snapshots
        await this.prismaService.tokenSnapshot.deleteMany({
          where: { id: { in: oldSnapshots.map((s) => s.id) } },
        });

        this.logger.log(`✅ Archived and deleted ${oldSnapshots.length} snapshots`);
      }
    } catch (error) {
      this.logger.error('❌ Archival failed:', error.message);
    }
  }

  /**
   * Clean up old sync jobs - runs daily at 3 AM UTC
   */
  @Cron('0 3 * * *')
  async cleanupOldSyncJobsDaily() {
    this.logger.log('🧹 Cleaning up old sync jobs...');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
      const result = await this.prismaService.dataSyncJob.deleteMany({
        where: {
          completedAt: { lt: thirtyDaysAgo },
          status: 'COMPLETED',
        },
      });

      this.logger.log(`✅ Deleted ${result.count} old sync jobs`);
    } catch (error) {
      this.logger.error('❌ Cleanup failed:', error.message);
    }
  }

  /**
   * Generate database statistics - runs daily at 1 AM UTC
   */
  @Cron('0 1 * * *')
  async generateDatabaseStatisticsDaily() {
    this.logger.log('📊 Generating database statistics...');

    try {
      const stats = {
        totalTokens: await this.prismaService.token.count(),
        totalSnapshots: await this.prismaService.tokenSnapshot.count(),
        archivedSnapshots: await this.prismaService.snapshotArchive.count(),
        generatedAt: new Date(),
      };

      this.logger.log(`Database Stats: ${JSON.stringify(stats)}`);

      // In production, you might send this to monitoring/analytics
    } catch (error) {
      this.logger.error('❌ Statistics generation failed:', error.message);
    }
  }

  /**
   * Validate data integrity - runs every hour
   */
  @Cron('0 * * * *')
  async validateDataIntegrityHourly() {
    this.logger.debug('🔍 Validating data integrity...');

    try {
      // Check for orphaned snapshots
      const orphanedSnapshots = await this.prismaService.tokenSnapshot.findMany({
        where: {
          token: null,
        },
        select: { id: true },
      });

      if (orphanedSnapshots.length > 0) {
        this.logger.warn(`Found ${orphanedSnapshots.length} orphaned snapshots`);
        // Optionally delete them
        await this.prismaService.tokenSnapshot.deleteMany({
          where: { id: { in: orphanedSnapshots.map((s) => s.id) } },
        });
      }

      // Check for missing chains
      const tokensWithoutChain = await this.prismaService.token.findMany({
        where: { chain: null },
        select: { id: true, symbol: true },
      });

      if (tokensWithoutChain.length > 0) {
        this.logger.warn(`Found ${tokensWithoutChain.length} tokens without chains`);
      }

      this.logger.debug('✅ Data integrity check completed');
    } catch (error) {
      this.logger.error('❌ Data integrity check failed:', error.message);
    }
  }
}
