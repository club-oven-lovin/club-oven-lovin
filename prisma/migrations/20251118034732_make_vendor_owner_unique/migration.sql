/*
  Warnings:

  - A unique constraint covering the columns `[owner]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vendor_owner_key" ON "Vendor"("owner");
