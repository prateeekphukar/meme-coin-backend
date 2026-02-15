import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  chainId: string;

  @ApiProperty({ required: false })
  priceUsd?: number;

  @ApiProperty({ required: false })
  marketCap?: number;

  @ApiProperty({ required: false })
  volume24h?: number;

  @ApiProperty({ required: false })
  memeScore?: number;

  @ApiProperty({ required: false, description: 'URL to CoinMarketCap page for this token' })
  coinbaseUrl?: string;

  @ApiProperty({ required: false })
  launchDate?: Date;

  @ApiProperty({ required: false })
  initialPrice?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TokenListResponseDto {
  @ApiProperty({ type: [TokenResponseDto] })
  tokens: TokenResponseDto[];

  @ApiProperty()
  total: number;
}
