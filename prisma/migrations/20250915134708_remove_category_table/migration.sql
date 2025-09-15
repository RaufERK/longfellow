/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_slug_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("author", "category", "createdAt", "dimensions", "id", "inStock", "isbn", "largeImageUrl", "legacyId", "longDescription", "originalImagePath", "pages", "price", "publishYear", "publisher", "shortDescription", "sku", "subcategory", "thumbnailUrl", "title", "updatedAt", "weight", "wholesalePrice1", "wholesalePrice2") SELECT "author", "category", "createdAt", "dimensions", "id", "inStock", "isbn", "largeImageUrl", "legacyId", "longDescription", "originalImagePath", "pages", "price", "publishYear", "publisher", "shortDescription", "sku", "subcategory", "thumbnailUrl", "title", "updatedAt", "weight", "wholesalePrice1", "wholesalePrice2" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_legacyId_key" ON "Product"("legacyId");
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_subcategory_idx" ON "Product"("subcategory");
CREATE INDEX "Product_legacyId_idx" ON "Product"("legacyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
