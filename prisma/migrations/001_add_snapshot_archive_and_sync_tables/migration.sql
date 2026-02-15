-- CreateTable: SnapshotArchive
CREATE TABLE "SnapshotArchive" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "priceUsd" DOUBLE PRECISION NOT NULL,
    "volume24h" DOUBLE PRECISION,
    "memeScore" DOUBLE PRECISION NOT NULL,
    "holders" INTEGER,
    "liquidityUsd" DOUBLE PRECISION,
    "buyPressure" DOUBLE PRECISION,
    "marketCapRank" INTEGER,
    "twitterFollowers" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable: DataSyncJob
CREATE TABLE "DataSyncJob" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "tokensCount" INTEGER,
    "snapshotsAdded" INTEGER,
    "errors" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SnapshotArchive_tokenId_timestamp_idx" ON "SnapshotArchive"("tokenId", "timestamp");

-- CreateIndex
CREATE INDEX "SnapshotArchive_timestamp_idx" ON "SnapshotArchive"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "SnapshotArchive_archivedAt_idx" ON "SnapshotArchive"("archivedAt");

-- CreateIndex
CREATE INDEX "DataSyncJob_jobType_completedAt_idx" ON "DataSyncJob"("jobType", "completedAt");

-- CreateIndex
CREATE INDEX "DataSyncJob_status_idx" ON "DataSyncJob"("status");

-- Add index to TokenSnapshot as well
CREATE INDEX "TokenSnapshot_timestamp_idx" ON "TokenSnapshot"("timestamp" DESC);
