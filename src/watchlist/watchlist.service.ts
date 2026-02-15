import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class WatchlistService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async findUserWatchlists(userId: string) {
    const watchlists = await this.prisma.watchlist.findMany({
      where: { userId },
      include: {
        tokens: {
          include: {
            token: {
              include: {
                chain: true,
              },
            },
          },
        },
      },
    });

    // Add Coinbase URLs to tokens in watchlists
    return watchlists.map(watchlist => ({
      ...watchlist,
      tokens: watchlist.tokens.map(wt => ({
        ...wt,
        token: {
          ...wt.token,
          coinbaseUrl: wt.token.coinbaseUrl || this.tokenService.generateCoinbaseUrl(wt.token.symbol),
        },
      })),
    }));
  }
}
