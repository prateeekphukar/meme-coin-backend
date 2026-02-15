import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { AlertModule } from './alert/alert.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { ScoringModule } from './scoring/scoring.module';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    TokenModule,
    UserModule,
    WatchlistModule,
    AlertModule,
    DiscoveryModule,
    ScoringModule,
    ScheduledTasksModule,
    HealthModule,
  ],
})
export class AppModule {}
