-- AlterTable
ALTER TABLE "Fragment" ADD COLUMN     "songArtist" VARCHAR(200),
ADD COLUMN     "songArtworkUrl" VARCHAR(500),
ADD COLUMN     "songEndSec" DOUBLE PRECISION,
ADD COLUMN     "songStartSec" DOUBLE PRECISION,
ADD COLUMN     "songTitle" VARCHAR(200),
ADD COLUMN     "songUri" VARCHAR(500);
