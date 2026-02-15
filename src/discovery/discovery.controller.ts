import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { DiscoveryService } from './discovery.service';

@ApiTags('discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('trending')
  @ApiOperation({ summary: 'Discover trending coins with advanced filters' })
  @ApiQuery({ name: 'minScore', required: false, type: Number })
  @ApiQuery({ name: 'maxDaysOld', required: false, type: Number })
  @ApiQuery({ name: 'minLiquidity', required: false, type: Number })
  @ApiQuery({ name: 'minHolders', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['score', 'volume', 'holders', 'momentum'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async discoverTrending(
    @Query('minScore') minScore?: number,
    @Query('maxDaysOld') maxDaysOld?: number,
    @Query('minLiquidity') minLiquidity?: number,
    @Query('minHolders') minHolders?: number,
    @Query('sortBy') sortBy?: 'score' | 'volume' | 'holders' | 'momentum',
    @Query('limit') limit?: number,
  ) {
    return this.discoveryService.discoverTrendingCoins({
      minScore: minScore ? Number(minScore) : undefined,
      maxDaysOld: maxDaysOld ? Number(maxDaysOld) : undefined,
      minLiquidity: minLiquidity ? Number(minLiquidity) : undefined,
      minHolders: minHolders ? Number(minHolders) : undefined,
      sortBy,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('moonshots')
  @ApiOperation({ summary: 'Get moonshot candidates (high risk, high reward)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMoonshots(@Query('limit') limit?: number) {
    return this.discoveryService.getMoonshotCandidates(limit ? Number(limit) : undefined);
  }

  @Get('safe')
  @ApiOperation({ summary: 'Get safe investment options (lower risk)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getSafe(@Query('limit') limit?: number) {
    return this.discoveryService.getSafeInvestments(limit ? Number(limit) : undefined);
  }

  @Get('fastest-growing')
  @ApiOperation({ summary: 'Get fastest growing tokens' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFastestGrowing(@Query('limit') limit?: number) {
    return this.discoveryService.getFastestGrowing(limit ? Number(limit) : undefined);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search tokens by name or symbol' })
  @ApiParam({ name: 'query', description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Param('query') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.discoveryService.searchTokens(query, limit ? Number(limit) : undefined);
  }

  @Get('tags/:tags')
  @ApiOperation({ summary: 'Get tokens by tags (comma-separated)' })
  @ApiParam({ name: 'tags', description: 'Comma-separated tags (e.g., "dog,pepe")' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getByTags(
    @Param('tags') tags: string,
    @Query('limit') limit?: number,
  ) {
    const tagArray = tags.split(',').map(t => t.trim());
    return this.discoveryService.getTokensByTags(tagArray, limit ? Number(limit) : undefined);
  }
}
