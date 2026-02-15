import { Module } from '@nestjs/common';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScoringController],
  providers: [ScoringService],
})
export class ScoringModule {}
