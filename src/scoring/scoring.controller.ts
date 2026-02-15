import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ScoringService } from './scoring.service';

@ApiTags('scoring')
@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Get('calculate/:tokenId')
  @ApiOperation({ summary: 'Calculate meme score for a specific token' })
  @ApiParam({ name: 'tokenId', description: 'Token ID' })
  async calculateTokenScore(@Param('tokenId') tokenId: string) {
    const score = await this.scoringService.calculateMemeScore(tokenId);
    return { tokenId, memeScore: score };
  }

  @Post('calculate-all')
  @ApiOperation({ summary: 'Recalculate scores for all tokens' })
  async calculateAllScores() {
    return this.scoringService.scoreAllTokens();
  }

  @Get('risk/:tokenId')
  @ApiOperation({ summary: 'Calculate risk analysis for a token' })
  @ApiParam({ name: 'tokenId', description: 'Token ID' })
  async calculateRisk(@Param('tokenId') tokenId: string) {
    return this.scoringService.calculateRiskAnalysis(tokenId);
  }
}
