import { Controller, Get, Param, Query, NotFoundException, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { TokenResponseDto, TokenListResponseDto } from './dto/token-response.dto';
import { NewLaunchesResponseDto } from './dto/new-launch.dto';

@ApiTags('tokens')
@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tokens with Coinbase links' })
  @ApiResponse({ status: 200, description: 'Returns list of tokens', type: TokenListResponseDto })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of tokens to return (default: 100)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination (default: 0)' })
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<TokenListResponseDto> {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    
    return this.tokenService.findAll(limitNum, offsetNum);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top tokens by meme score with Coinbase links' })
  @ApiResponse({ status: 200, description: 'Returns top tokens', type: [TokenResponseDto] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of top tokens to return (default: 20)' })
  async getTopTokens(@Query('limit') limit?: string): Promise<TokenResponseDto[]> {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.tokenService.getTopTokens(limitNum);
  }

  @Get('new-launches')
  @ApiOperation({ 
    summary: 'Get newly launched coins with high transaction volume',
    description: 'Returns coins launched within a specified timeframe that have high trading volume, along with current and historical price data'
  })
  @ApiResponse({ status: 200, description: 'Returns newly launched tokens with price history', type: NewLaunchesResponseDto })
  @ApiQuery({ 
    name: 'maxDays', 
    required: false, 
    type: Number, 
    description: 'Maximum days since launch (default: 30)' 
  })
  @ApiQuery({ 
    name: 'minVolume', 
    required: false, 
    type: Number, 
    description: 'Minimum 24h volume in USD (default: 100000)' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Maximum number of results (default: 50)' 
  })
  async getNewLaunches(
    @Query('maxDays') maxDays?: string,
    @Query('minVolume') minVolume?: string,
    @Query('limit') limit?: string,
  ): Promise<NewLaunchesResponseDto> {
    const maxDaysNum = maxDays ? parseInt(maxDays, 10) : 30;
    const minVolumeNum = minVolume ? parseInt(minVolume, 10) : 100000;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    
    return this.tokenService.getNewlyLaunchedCoins(maxDaysNum, minVolumeNum, limitNum);
  }

  @Get(':id/price-history')
  @ApiOperation({ summary: 'Get price history for a specific token' })
  @ApiResponse({ status: 200, description: 'Returns price history' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days of history (default: 30)' })
  async getTokenPriceHistory(
    @Param('id') id: string,
    @Query('days') days?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.tokenService.getTokenPriceHistory(id, daysNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single token by ID with Coinbase link' })
  @ApiResponse({ status: 200, description: 'Returns the token', type: TokenResponseDto })
  @ApiResponse({ status: 404, description: 'Token not found' })
  async findOne(@Param('id') id: string): Promise<TokenResponseDto> {
    const token = await this.tokenService.findOne(id);
    
    if (!token) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }
    
    return token;
  }

  @Post('sync-coinbase-urls')
  @ApiOperation({ summary: 'Sync Coinbase URLs for all tokens' })
  @ApiResponse({ status: 200, description: 'Returns number of tokens synced' })
  async syncCoinbaseUrls() {
    return this.tokenService.syncCoinbaseUrls();
  }
}
