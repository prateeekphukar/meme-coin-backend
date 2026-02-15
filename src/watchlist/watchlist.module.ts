import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [WatchlistController],
  providers: [WatchlistService],
  exports: [WatchlistService],
})
export class WatchlistModule {}
