-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "hours" TEXT,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "vendorId" TEXT,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
