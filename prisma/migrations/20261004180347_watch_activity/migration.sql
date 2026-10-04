-- AlterTable
ALTER TABLE "WatchPosition" ADD COLUMN     "lastOpenedAt" TIMESTAMP(3),
ADD COLUMN     "opens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'fallback',
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "watchedSeconds" INTEGER NOT NULL DEFAULT 0;
