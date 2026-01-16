/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scw_address]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identity_address]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creator_id` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Company_address_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
ADD COLUMN     "creator_id" TEXT NOT NULL,
ADD COLUMN     "identity_address" TEXT,
ADD COLUMN     "scw_address" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Company_scw_address_key" ON "Company"("scw_address");

-- CreateIndex
CREATE UNIQUE INDEX "Company_identity_address_key" ON "Company"("identity_address");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
