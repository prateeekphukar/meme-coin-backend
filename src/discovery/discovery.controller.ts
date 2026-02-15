import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DiscoveryService } from './discovery.service';

@ApiTags('discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get()
  @ApiOperation({ summary: 'Discover new tokens' })
  async discover() {
    return this.discoveryService.discover();
  }
}
