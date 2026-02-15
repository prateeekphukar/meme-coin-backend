import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';

@ApiTags('watchlists')
@Controller('watchlists')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user watchlists with CoinMarketCap links for tokens' })
  @ApiResponse({ status: 200, description: 'Returns user watchlists with token CoinMarketCap URLs' })
  async findUserWatchlists(@Param('userId') userId: string) {
    return this.watchlistService.findUserWatchlists(userId);
  }
}
