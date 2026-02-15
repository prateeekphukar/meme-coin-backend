import { ApiProperty } from '@nestjs/swagger';

export class PriceHistoryDto {
  @ApiProperty({ description: 'Price in USD' })
  priceUsd: number;

  @ApiProperty({ description: 'Timestamp of the price' })
  timestamp: Date;

  @ApiProperty({ required: false, description: '24h trading volume' })
  volume24h?: number;
}

export class NewLaunchTokenDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ description: 'Current price in USD' })
  currentPrice: number;

  @ApiProperty({ required: false, description: 'Initial launch price in USD' })
  initialPrice?: number;

  @ApiProperty({ required: false, description: 'Price change percentage since launch' })
  priceChangePercent?: number;

  @ApiProperty({ description: '24-hour trading volume in USD' })
  volume24h: number;

  @ApiProperty({ required: false })
  marketCap?: number;

  @ApiProperty({ required: false })
  memeScore?: number;

  @ApiProperty({ required: false, description: 'URL to Coinbase page for this token' })
  coinbaseUrl?: string;

  @ApiProperty({ description: 'Token launch date' })
  launchDate: Date;

  @ApiProperty({ type: [PriceHistoryDto], description: 'Historical price data' })
  priceHistory: PriceHistoryDto[];

  @ApiProperty({ description: 'Days since launch' })
  daysSinceLaunch: number;
}

export class NewLaunchesResponseDto {
  @ApiProperty({ type: [NewLaunchTokenDto] })
  tokens: NewLaunchTokenDto[];

  @ApiProperty()
  total: number;

  @ApiProperty({ description: 'Filter criteria applied' })
  filters: {
    maxDaysSinceLaunch: number;
    minVolume24h: number;
  };
}
