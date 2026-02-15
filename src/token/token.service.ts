import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewLaunchesResponseDto, NewLaunchTokenDto } from './dto/new-launch.dto';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate Coinbase URL for a token based on its symbol
   * @param symbol Token symbol (e.g., 'BTC', 'ETH', 'DOGE')
   * @returns Coinbase URL
   */
  generateCoinbaseUrl(symbol: string): string {
    // Coinbase uses lowercase symbols in URLs
    const normalizedSymbol = symbol.toUpperCase();
    return `https://www.coinbase.com/price/${normalizedSymbol}`;
  }

  /**
   * Get all tokens with Coinbase URLs
   */
  async findAll(limit: number = 100, offset: number = 0) {
    const tokens = await this.prisma.token.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        memeScore: 'desc',
      },
      include: {
        chain: true,
      },
    });

    const total = await this.prisma.token.count();

    // Add Coinbase URLs if not already set
    const tokensWithUrls = tokens.map(token => ({
      ...token,
      coinbaseUrl: token.coinbaseUrl || this.generateCoinbaseUrl(token.symbol),
    }));

    return { tokens: tokensWithUrls, total };
  }

  /**
   * Get a single token by ID with Coinbase URL
   */
  async findOne(id: string) {
    const token = await this.prisma.token.findUnique({
      where: { id },
      include: {
        chain: true,
      },
    });

    if (!token) {
      return null;
    }

    // Add Coinbase URL if not already set
    return {
      ...token,
      coinbaseUrl: token.coinbaseUrl || this.generateCoinbaseUrl(token.symbol),
    };
  }

  /**
   * Get top tokens by meme score with Coinbase URLs
   */
  async getTopTokens(limit: number = 20) {
    const tokens = await this.prisma.token.findMany({
      take: limit,
      orderBy: {
        memeScore: 'desc',
      },
      include: {
        chain: true,
      },
    });

    // Add Coinbase URLs
    return tokens.map(token => ({
      ...token,
      coinbaseUrl: token.coinbaseUrl || this.generateCoinbaseUrl(token.symbol),
    }));
  }

  /**
   * Update a token's Coinbase URL
   */
  async updateCoinbaseUrl(id: string, url: string) {
    return this.prisma.token.update({
      where: { id },
      data: { coinbaseUrl: url },
    });
  }

  /**
   * Bulk update Coinbase URLs for all tokens
   */
  async syncCoinbaseUrls() {
    const tokens = await this.prisma.token.findMany();
    
    for (const token of tokens) {
      if (!token.coinbaseUrl) {
        await this.prisma.token.update({
          where: { id: token.id },
          data: { coinbaseUrl: this.generateCoinbaseUrl(token.symbol) },
        });
      }
    }

    return { synced: tokens.length };
  }

  /**
   * Get newly launched tokens with high transaction volume
   * @param maxDaysSinceLaunch Maximum days since launch (default: 30)
   * @param minVolume24h Minimum 24h volume in USD (default: 100000)
   * @param limit Maximum number of results (default: 50)
   */
  async getNewlyLaunchedCoins(
    maxDaysSinceLaunch: number = 30,
    minVolume24h: number = 100000,
    limit: number = 50,
  ): Promise<NewLaunchesResponseDto> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxDaysSinceLaunch);

    // Find tokens launched within the specified timeframe with high volume
    const tokens = await this.prisma.token.findMany({
      where: {
        launchDate: {
          gte: cutoffDate,
        },
        volume24h: {
          gte: minVolume24h,
        },
      },
      orderBy: [
        { volume24h: 'desc' },
        { launchDate: 'desc' },
      ],
      take: limit,
      include: {
        chain: true,
        snapshots: {
          orderBy: {
            timestamp: 'asc',
          },
          take: 100, // Get up to 100 historical snapshots
        },
      },
    });

    const total = await this.prisma.token.count({
      where: {
        launchDate: {
          gte: cutoffDate,
        },
        volume24h: {
          gte: minVolume24h,
        },
      },
    });

    // Transform tokens to include price history and calculated fields
    const enrichedTokens: NewLaunchTokenDto[] = tokens.map((token) => {
      const currentPrice = token.priceUsd || 0;
      const initialPrice = token.initialPrice || token.priceUsd || 0;
      
      // Calculate price change percentage
      let priceChangePercent: number | undefined;
      if (initialPrice && initialPrice > 0 && currentPrice) {
        priceChangePercent = ((currentPrice - initialPrice) / initialPrice) * 100;
      }

      // Calculate days since launch
      const daysSinceLaunch = token.launchDate
        ? Math.floor((Date.now() - token.launchDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Map price history from snapshots
      const priceHistory = token.snapshots.map((snapshot) => ({
        priceUsd: snapshot.priceUsd,
        timestamp: snapshot.timestamp,
        volume24h: snapshot.volume24h,
      }));

      return {
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        currentPrice: currentPrice,
        initialPrice: token.initialPrice,
        priceChangePercent,
        volume24h: token.volume24h || 0,
        marketCap: token.marketCap,
        memeScore: token.memeScore,
        coinbaseUrl: token.coinbaseUrl || this.generateCoinbaseUrl(token.symbol),
        launchDate: token.launchDate || token.createdAt,
        priceHistory,
        daysSinceLaunch,
      };
    });

    return {
      tokens: enrichedTokens,
      total,
      filters: {
        maxDaysSinceLaunch,
        minVolume24h,
      },
    };
  }

  /**
   * Get price history for a specific token
   * @param tokenId Token ID
   * @param days Number of days of history to fetch (default: 30)
   */
  async getTokenPriceHistory(tokenId: string, days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const snapshots = await this.prisma.tokenSnapshot.findMany({
      where: {
        tokenId,
        timestamp: {
          gte: cutoffDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return snapshots.map((snapshot) => ({
      priceUsd: snapshot.priceUsd,
      volume24h: snapshot.volume24h,
      memeScore: snapshot.memeScore,
      timestamp: snapshot.timestamp,
    }));
  }
}
