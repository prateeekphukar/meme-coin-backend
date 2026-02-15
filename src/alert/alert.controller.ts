import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AlertService } from './alert.service';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @ApiOperation({ summary: 'Get alerts' })
  async getAlerts() {
    return this.alertService.getAlerts();
  }
}
