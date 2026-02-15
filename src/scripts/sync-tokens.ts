import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Data Sync Script - Runs every 10 minutes via GitHub Actions
 * Fetches token data from DEX APIs and updates database snapshots
 */

async function fetchTokensFromDEX() {
  // Placeholder for actual DEX API integration
  // In production, this would call CoinGecko, DexScreener, or similar APIs
  
  console.log('Fetching token data from DEX APIs...');
  
  try {
    // Example: Fetch top 100 tokens
    const tokens = [
      {
        symbol: 'MOONROCK',
        price: 0.0025,
        volume24h: 1500000,
        memeScore: 87.5,
      },
      {
        symbol: 'ROCKETMEME',
        price: 0.015,
        volume24h: 3200000,
        memeScore: 92.0,
      },
    ];
    
    return tokens;
  } catch (error) {
    console.error('Error fetching DEX data:', error);
    return [];
  }
}

async function syncTokenSnapshots() {
  const startTime = Date.now();
  const syncJob = await prisma.dataSyncJob.create({
    data: {
      jobType: 'TOKEN_SNAPSHOT',
      status: 'IN_PROGRESS',
    },
  });

  try {
    console.log(`🔄 Starting data sync job: ${syncJob.id}`);

    // Get all tokens from database
    const tokens = await prisma.token.findMany({
      select: { id: true, symbol: true },
    });

    console.log(`📊 Found ${tokens.length} tokens to sync`);

    if (tokens.length === 0) {
      console.log('⚠️ No tokens in database. Creating sample tokens...');
      await createSampleTokens();
      return;
    }

    // Create snapshots for each token
    let snapshotCount = 0;
    for (const token of tokens) {
      try {
        // In production, fetch real data from DEX APIs
        const snapshot = await prisma.tokenSnapshot.create({
          data: {
            tokenId: token.id,
            priceUsd: Math.random() * 0.1, // Placeholder
            volume24h: Math.random() * 10000000,
            memeScore: Math.random() * 100,
            holders: Math.floor(Math.random() * 100000),
            timestamp: new Date(),
          },
        });

        snapshotCount++;

        if (snapshotCount % 100 === 0) {
          console.log(`✅ Created ${snapshotCount} snapshots...`);
        }
      } catch (error) {
        console.error(`❌ Error creating snapshot for token ${token.symbol}:`, error);
      }
    }

    console.log(`✅ Created ${snapshotCount} snapshots`);

    // Archive old snapshots (older than 2 years)
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);
    const oldSnapshots = await prisma.tokenSnapshot.findMany({
      where: { timestamp: { lt: twoYearsAgo } },
      take: 10000,
    });

    if (oldSnapshots.length > 0) {
      await prisma.snapshotArchive.createMany({
        data: oldSnapshots.map((s) => ({
          tokenId: s.tokenId,
          priceUsd: s.priceUsd,
          volume24h: s.volume24h || 0,
          memeScore: s.memeScore,
          holders: s.holders,
          liquidityUsd: s.liquidityUsd || null,
          buyPressure: s.buyPressure || null,
          marketCapRank: s.marketCapRank || null,
          twitterFollowers: s.twitterFollowers || null,
          timestamp: s.timestamp,
        })),
        skipDuplicates: true,
      });

      await prisma.tokenSnapshot.deleteMany({
        where: { id: { in: oldSnapshots.map((s) => s.id) } },
      });

      console.log(`📦 Archived ${oldSnapshots.length} old snapshots`);
    }

    // Update sync job status
    const duration = Date.now() - startTime;
    await prisma.dataSyncJob.update({
      where: { id: syncJob.id },
      data: {
        status: 'COMPLETED',
        tokensCount: tokens.length,
        snapshotsAdded: snapshotCount,
        completedAt: new Date(),
        duration: duration,
      },
    });

    console.log(
      `✅ Sync completed in ${(duration / 1000).toFixed(2)}s | ${tokens.length} tokens, ${snapshotCount} snapshots`
    );
  } catch (error) {
    await prisma.dataSyncJob.update({
      where: { id: syncJob.id },
      data: {
        status: 'FAILED',
        errors: error instanceof Error ? error.message : String(error),
      },
    });

    console.error('❌ Sync job failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createSampleTokens() {
  const sampleTokens = [
    {
      symbol: 'MOONROCK',
      name: 'Moon Rock Token',
      address: '0x' + '1'.repeat(40),
      chainId: await getOrCreateChain(),
    },
    {
      symbol: 'ROCKETMEME',
      name: 'Rocket Meme Coin',
      address: '0x' + '2'.repeat(40),
      chainId: await getOrCreateChain(),
    },
  ];

  for (const token of sampleTokens) {
    await prisma.token.create({
      data: {
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        chainId: token.chainId,
      },
    });
  }

  console.log(`✅ Created ${sampleTokens.length} sample tokens`);
}

async function getOrCreateChain() {
  let chain = await prisma.chain.findUnique({
    where: { symbol: 'ETH' },
  });

  if (!chain) {
    chain = await prisma.chain.create({
      data: {
        name: 'Ethereum',
        symbol: 'ETH',
      },
    });
  }

  return chain.id;
}

// Run if called directly
if (require.main === module) {
  syncTokenSnapshots()
    .then(() => {
      console.log('🎉 Data sync completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Data sync failed:', error);
      process.exit(1);
    });
}

export { syncTokenSnapshots, fetchTokensFromDEX };
