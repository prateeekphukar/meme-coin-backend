import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';

interface DiscoveryOptions {
  minScore?: number;
  maxDaysOld?: number;
  minLiquidity?: number;
  minHolders?: number;
  maxRiskLevel?: string;
  tags?: string[];
  sortBy?: 'score' | 'volume' | 'holders' | 'momentum';
  limit?: number;
}

@Injectable()
export class DiscoveryService {
  constructor(
    private prisma: PrismaService,
    private scoring: ScoringService,
  ) {}

  /**
   * Discover trending coins with advanced filters
   */
  async discoverTrendingCoins(options: DiscoveryOptions = {}) {
    const {
      minScore = 50,
      maxDaysOld = 30,
      minLiquidity = 50000,
      minHolders = 100,
      maxRiskLevel = 'HIGH',
      tags,
      sortBy = 'score',
      limit = 50,
    } = options;

    const where: any = {
      memeScore: { gte: minScore },
      launchDate: {
        gte: new Date(Date.now() - maxDaysOld * 24 * 60 * 60 * 1000),
      },
      holders: { gte: minHolders },
    };

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const orderBy: any = {};
    if (sortBy === 'score') orderBy.memeScore = 'desc';
    else if (sortBy === 'volume') orderBy.volume24h = 'desc';
    else if (sortBy === 'holders') orderBy.holders = 'desc';
    else if (sortBy === 'momentum') {
      // For momentum, we'll sort by a combination later
      orderBy.volume24h = 'desc';
    }

    const tokens = await this.prisma.token.findMany({
      where,
      orderBy,
      take: limit * 2,
      select: {
        id: true,
        symbol: true,
        name: true,
        address: true,
        priceUsd: true,
        volume24h: true,
        memeScore: true,
        holders: true,
        liquidityLocked: true,
        liquidityPools: {
          select: {
            liquidityUsd: true,
          },
        },
        riskAnalysis: {
          select: {
            riskLevel: true,
          },
        },
        chain: true,
      },
    });

    // Filter by calculated fields
    const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const filtered = tokens.filter((token: any) => {
      const totalLiq = token.liquidityPools?.reduce((sum: number, p: any) => sum + (p.liquidityUsd || 0), 0) || 0;
      const passesLiquidity = totalLiq >= minLiquidity;
      
      const passesRisk = 
        !token.riskAnalysis ||
        riskLevels.indexOf(token.riskAnalysis.riskLevel) <=
        riskLevels.indexOf(maxRiskLevel);

      return passesLiquidity && passesRisk;
    });

    return filtered.slice(0, limit);
  }

  /**
   * Get "moonshot" candidates (high risk, high reward)
   */
  async getMoonshotCandidates(limit = 20) {
    return this.discoverTrendingCoins({
      minScore: 70,
      maxDaysOld: 7,
      minLiquidity: 100000,
      sortBy: 'momentum',
      limit,
    });
  }

  /**
   * Get "safe" investments (lower risk)
   */
  async getSafeInvestments(limit = 20) {
    return this.discoverTrendingCoins({
      minScore: 60,
      maxDaysOld: 60,
      minLiquidity: 500000,
      minHolders: 1000,
      maxRiskLevel: 'MEDIUM',
      sortBy: 'score',
      limit,
    });
  }

  /**
   * Get tokens by specific tags (e.g., "dog", "pepe", "gaming")
   */
  async getTokensByTags(tags: string[], limit = 30) {
    return this.discoverTrendingCoins({
      tags,
      minScore: 40,
      maxDaysOld: 90,
      sortBy: 'score',
      limit,
    });
  }

  /**
   * Get fastest growing tokens (by holder count)
   */
  async getFastestGrowing(limit = 20) {
    const tokens = await this.prisma.token.findMany({
      where: {
        launchDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        snapshots: {
          orderBy: { timestamp: 'asc' },
          take: 2,
        },
        chain: true,
      },
      take: 100,
    });

    // Calculate growth rate
    const tokensWithGrowth = tokens
      .map((token: any) => {
        if (!token.snapshots || token.snapshots.length < 2) return null;
        
        const oldest = token.snapshots[0];
        const latest = token.snapshots[token.snapshots.length - 1];
        
        if (!oldest?.holders || !latest?.holders) return null;
        
        const growthRate = ((latest.holders - oldest.holders) / oldest.holders) * 100;
        
        return {
          ...token,
          growthRate,
        };
      })
      .filter((t: any) => t !== null)
      .sort((a: any, b: any) => (b?.growthRate || 0) - (a?.growthRate || 0))
      .slice(0, limit);

    return tokensWithGrowth;
  }

  /**
   * Search tokens by name or symbol
   */
  async searchTokens(query: string, limit = 20) {
    const searchQuery = query.toLowerCase();
    
    return this.prisma.token.findMany({
      where: {
        OR: [
          { symbol: { contains: searchQuery, mode: 'insensitive' } },
          { name: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      include: {
        chain: true,
        riskAnalysis: true,
      },
      orderBy: {
        memeScore: 'desc',
      },
      take: limit,
    });
  }
}
