import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('api/v1/health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Check system health status' })
  @ApiResponse({ status: 200, description: 'System is healthy' })
  async getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Check database health and statistics' })
  @ApiResponse({ status: 200, description: 'Database stats' })
  async getDatabaseHealth() {
    try {
      const stats = await this.prismaService.$queryRaw`
        SELECT 
          'healthy' as status,
          (SELECT COUNT(*) FROM "Token") as total_tokens,
          (SELECT COUNT(*) FROM "TokenSnapshot") as active_snapshots,
          (SELECT COUNT(*) FROM "SnapshotArchive") as archived_snapshots,
          (SELECT MAX(timestamp) FROM "TokenSnapshot") as latest_snapshot,
          (SELECT COUNT(*) FROM "DataSyncJob" WHERE status = 'COMPLETED' AND "completedAt" > NOW() - INTERVAL '24 hours') as syncs_last_24h
      `;

      return {
        database: 'OK',
        timestamp: new Date().toISOString(),
        stats: stats[0] || {},
      };
    } catch (error) {
      return {
        database: 'ERROR',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get('sync-jobs')
  @ApiOperation({ summary: 'Get recent sync job status' })
  @ApiResponse({ status: 200, description: 'Recent sync jobs' })
  async getSyncJobStatus() {
    const recentJobs = await this.prismaService.dataSyncJob.findMany({
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    const summary = {
      total: recentJobs.length,
      completed: recentJobs.filter((j) => j.status === 'COMPLETED').length,
      failed: recentJobs.filter((j) => j.status === 'FAILED').length,
      pending: recentJobs.filter((j) => j.status === 'PENDING').length,
      inProgress: recentJobs.filter((j) => j.status === 'IN_PROGRESS').length,
      avgDuration:
        recentJobs.filter((j) => j.duration).reduce((sum, j) => sum + j.duration, 0) /
        recentJobs.filter((j) => j.duration).length,
    };

    return {
      timestamp: new Date().toISOString(),
      summary,
      recentJobs: recentJobs.slice(0, 5),
    };
  }
}
