import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(private prisma: PrismaService) {}

  // Placeholder for alert functionality
  async getAlerts() {
    return { message: 'Alert service is operational' };
  }
}
