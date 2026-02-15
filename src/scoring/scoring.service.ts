import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoringService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate comprehensive meme score (0-100)
   * Higher score = higher potential
   */
  async calculateMemeScore(tokenId: string): Promise<number> {
    const token = await this.prisma.token.findUnique({
      where: { id: tokenId },
      include: {
        snapshots: {
          orderBy: { timestamp: 'desc' },
          take: 24,
        },
        liquidityPools: true,
        riskAnalysis: true,
      },
    });

    if (!token) return 0;

    const viralityScore = this.calculateViralityScore(token);
    const liquidityScore = this.calculateLiquidityScore(token);
    const momentumScore = this.calculateMomentumScore(token);
    const communityScore = this.calculateCommunityScore(token);
    const safetyScore = this.calculateSafetyScore(token);
    const freshnessScore = this.calculateFreshnessScore(token);

    const weights = {
      momentum: 0.25,
      community: 0.25,
      liquidity: 0.20,
      virality: 0.15,
      safety: 0.10,
      freshness: 0.05,
    };

    const memeScore =
      momentumScore * weights.momentum +
      communityScore * weights.community +
      liquidityScore * weights.liquidity +
      viralityScore * weights.virality +
      safetyScore * weights.safety +
      freshnessScore * weights.freshness;

    return Math.round(memeScore * 100) / 100;
  }

  private calculateMomentumScore(token: any): number {
    let score = 0;

    // Price change (40 points)
    if (token.initialPrice && token.priceUsd) {
      const priceChange = ((token.priceUsd - token.initialPrice) / token.initialPrice) * 100;
      if (priceChange > 500) score += 40;
      else if (priceChange > 200) score += 35;
      else if (priceChange > 100) score += 30;
      else if (priceChange > 50) score += 20;
      else if (priceChange > 0) score += 10;
    }

    // Volume trend (30 points)
    if (token.volume24h) {
      if (token.volume24h > 5000000) score += 30;
      else if (token.volume24h > 1000000) score += 25;
      else if (token.volume24h > 500000) score += 20;
      else if (token.volume24h > 100000) score += 10;
    }

    // Buy/Sell ratio (30 points)
    if (token.buyCount24h && token.sellCount24h) {
      const ratio = token.buyCount24h / (token.buyCount24h + token.sellCount24h);
      if (ratio > 0.7) score += 30;
      else if (ratio > 0.6) score += 20;
      else if (ratio > 0.5) score += 10;
    }

    return Math.min(score, 100);
  }

  private calculateCommunityScore(token: any): number {
    let score = 0;

    // Twitter engagement (40 points)
    if (token.twitterFollowers) {
      if (token.twitterFollowers > 100000) score += 40;
      else if (token.twitterFollowers > 50000) score += 30;
      else if (token.twitterFollowers > 10000) score += 20;
      else if (token.twitterFollowers > 1000) score += 10;
    }

    // Telegram community (30 points)
    if (token.telegramMembers) {
      if (token.telegramMembers > 50000) score += 30;
      else if (token.telegramMembers > 10000) score += 20;
      else if (token.telegramMembers > 1000) score += 10;
    }

    // Holder growth (30 points)
    if (token.holders) {
      if (token.holders > 10000) score += 30;
      else if (token.holders > 5000) score += 20;
      else if (token.holders > 1000) score += 10;
    }

    return Math.min(score, 100);
  }

  private calculateLiquidityScore(token: any): number {
    let score = 0;
    const totalLiquidity = token.liquidityPools?.reduce(
      (sum, pool) => sum + pool.liquidityUsd,
      0
    ) || 0;

    // Liquidity depth (60 points)
    if (totalLiquidity > 1000000) score += 60;
    else if (totalLiquidity > 500000) score += 50;
    else if (totalLiquidity > 100000) score += 40;
    else if (totalLiquidity > 50000) score += 20;

    // Liquidity locked (40 points)
    if (token.liquidityLocked) score += 40;

    return Math.min(score, 100);
  }

  private calculateViralityScore(token: any): number {
    if (!token.snapshots || token.snapshots.length < 2) return 50;

    const latest = token.snapshots[0];
    const oldest = token.snapshots[token.snapshots.length - 1];
    const timeHours = (latest.timestamp.getTime() - oldest.timestamp.getTime()) / (1000 * 60 * 60);

    let score = 50;

    // Holder growth rate
    if (latest.holders && oldest.holders) {
      const holderGrowth = ((latest.holders - oldest.holders) / oldest.holders) * 100;
      const hourlyGrowth = holderGrowth / timeHours;
      
      if (hourlyGrowth > 10) score += 30;
      else if (hourlyGrowth > 5) score += 20;
      else if (hourlyGrowth > 1) score += 10;
    }

    // Volume growth
    if (latest.volume24h && oldest.volume24h) {
      const volGrowth = ((latest.volume24h - oldest.volume24h) / oldest.volume24h) * 100;
      if (volGrowth > 100) score += 20;
      else if (volGrowth > 50) score += 10;
    }

    return Math.min(score, 100);
  }

  private calculateSafetyScore(token: any): number {
    if (!token.riskAnalysis) return 50;
    return 100 - token.riskAnalysis.overallRiskScore;
  }

  private calculateFreshnessScore(token: any): number {
    if (!token.launchDate) return 0;

    const daysOld = (Date.now() - token.launchDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysOld < 1) return 100;
    if (daysOld < 3) return 80;
    if (daysOld < 7) return 60;
    if (daysOld < 14) return 40;
    if (daysOld < 30) return 20;
    return 0;
  }

  /**
   * Run scoring for all tokens
   */
  async scoreAllTokens(): Promise<{ updated: number }> {
    const tokens = await this.prisma.token.findMany();
    
    for (const token of tokens) {
      const score = await this.calculateMemeScore(token.id);
      await this.prisma.token.update({
        where: { id: token.id },
        data: { memeScore: score },
      });
    }

    return { updated: tokens.length };
  }

  /**
   * Calculate risk analysis for a token
   */
  async calculateRiskAnalysis(tokenId: string): Promise<any> {
    const token = await this.prisma.token.findUnique({
      where: { id: tokenId },
      include: {
        liquidityPools: true,
      },
    });

    if (!token) return null;

    const redFlags: string[] = [];
    const greenFlags: string[] = [];
    let rugPullRisk = 50;
    let volatilityRisk = 50;
    let liquidityRisk = 50;
    let holderConcentration = 50;

    // Contract verification
    if (!token.contractVerified) {
      redFlags.push('unverified_contract');
      rugPullRisk += 20;
    } else {
      greenFlags.push('verified_contract');
      rugPullRisk -= 10;
    }

    // Contract renounced
    if (token.contractRenounced) {
      greenFlags.push('renounced_contract');
      rugPullRisk -= 20;
    }

    // Liquidity locked
    if (token.liquidityLocked) {
      greenFlags.push('locked_liquidity');
      rugPullRisk -= 15;
      liquidityRisk -= 20;
    } else {
      redFlags.push('unlocked_liquidity');
      rugPullRisk += 15;
    }

    // Holder concentration
    if (token.topHoldersPercent && token.topHoldersPercent > 50) {
      redFlags.push('high_holder_concentration');
      holderConcentration = 80;
      rugPullRisk += 15;
    } else if (token.topHoldersPercent && token.topHoldersPercent < 20) {
      greenFlags.push('distributed_holders');
      holderConcentration = 20;
    }

    // Liquidity depth
    const totalLiquidity = token.liquidityPools.reduce((sum, p) => sum + p.liquidityUsd, 0);
    if (totalLiquidity < 50000) {
      redFlags.push('low_liquidity');
      liquidityRisk = 80;
    } else if (totalLiquidity > 500000) {
      greenFlags.push('high_liquidity');
      liquidityRisk = 20;
    }

    // Calculate overall risk
    const overallRiskScore = (rugPullRisk + volatilityRisk + liquidityRisk + holderConcentration) / 4;
    
    let riskLevel = 'MEDIUM';
    if (overallRiskScore < 30) riskLevel = 'LOW';
    else if (overallRiskScore > 60) riskLevel = 'HIGH';
    else if (overallRiskScore > 80) riskLevel = 'CRITICAL';

    // Upsert risk analysis
    return this.prisma.tokenRiskAnalysis.upsert({
      where: { tokenId },
      create: {
        tokenId,
        rugPullRisk: Math.min(100, Math.max(0, rugPullRisk)),
        volatilityRisk: Math.min(100, Math.max(0, volatilityRisk)),
        liquidityRisk: Math.min(100, Math.max(0, liquidityRisk)),
        holderConcentration: Math.min(100, Math.max(0, holderConcentration)),
        overallRiskScore: Math.min(100, Math.max(0, overallRiskScore)),
        riskLevel,
        redFlags,
        greenFlags,
      },
      update: {
        rugPullRisk: Math.min(100, Math.max(0, rugPullRisk)),
        volatilityRisk: Math.min(100, Math.max(0, volatilityRisk)),
        liquidityRisk: Math.min(100, Math.max(0, liquidityRisk)),
        holderConcentration: Math.min(100, Math.max(0, holderConcentration)),
        overallRiskScore: Math.min(100, Math.max(0, overallRiskScore)),
        riskLevel,
        redFlags,
        greenFlags,
        updatedAt: new Date(),
      },
    });
  }
}
