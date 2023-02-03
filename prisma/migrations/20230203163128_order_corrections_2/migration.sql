/*
  Warnings:

  - You are about to drop the column `productsQuantity` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "productsQuantity";

-- AlterTable
ALTER TABLE "Order_Detail" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
