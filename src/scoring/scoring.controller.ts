import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScoringService } from './scoring.service';

@ApiTags('scoring')
@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Get()
  @ApiOperation({ summary: 'Calculate token scores' })
  async calculateScores() {
    return this.scoringService.calculateScores();
  }
}
