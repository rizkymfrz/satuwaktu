-- CreateEnum
CREATE TYPE "FragmenType" AS ENUM ('PHOTO', 'VIDEO', 'TEXT');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('HANGAT', 'SUNYI', 'RIUH', 'SENDU', 'TERANG');

-- CreateEnum
CREATE TYPE "ResonansiType" AS ENUM ('BEEN_HERE', 'BEING_HERE', 'MISS_THIS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fragmen" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "type" "FragmenType" NOT NULL,
    "mood" "Mood",
    "takenAt" TIMESTAMP(3) NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "chapterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fragmen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "fragmenId" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resonansi" (
    "id" TEXT NOT NULL,
    "type" "ResonansiType" NOT NULL,
    "fragmenId" TEXT NOT NULL,
    "visitorToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resonansi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitipanKata" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fragmenId" TEXT NOT NULL,
    "visitorToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TitipanKata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");

-- CreateIndex
CREATE INDEX "Media_fragmenId_order_idx" ON "Media"("fragmenId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Resonansi_fragmenId_visitorToken_key" ON "Resonansi"("fragmenId", "visitorToken");

-- AddForeignKey
ALTER TABLE "Fragmen" ADD CONSTRAINT "Fragmen_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fragmen" ADD CONSTRAINT "Fragmen_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_fragmenId_fkey" FOREIGN KEY ("fragmenId") REFERENCES "Fragmen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resonansi" ADD CONSTRAINT "Resonansi_fragmenId_fkey" FOREIGN KEY ("fragmenId") REFERENCES "Fragmen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitipanKata" ADD CONSTRAINT "TitipanKata_fragmenId_fkey" FOREIGN KEY ("fragmenId") REFERENCES "Fragmen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
