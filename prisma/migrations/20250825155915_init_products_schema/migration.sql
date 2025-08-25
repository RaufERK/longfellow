/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Book";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "legacyId" INTEGER,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "price" INTEGER,
    "wholesalePrice1" INTEGER,
    "wholesalePrice2" INTEGER,
    "weight" INTEGER,
    "sku" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "dimensions" TEXT,
    "pages" INTEGER,
    "publisher" TEXT,
    "isbn" TEXT,
    "publishYear" INTEGER,
    "thumbnailUrl" TEXT,
    "largeImageUrl" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "originalImagePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" INTEGER,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_legacyId_key" ON "Product"("legacyId");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_subcategory_idx" ON "Product"("subcategory");

-- CreateIndex
CREATE INDEX "Product_legacyId_idx" ON "Product"("legacyId");
