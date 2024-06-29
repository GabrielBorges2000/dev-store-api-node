/*
  Warnings:

  - You are about to drop the `ProductOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductOrder" DROP CONSTRAINT "ProductOrder_order_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductOrder" DROP CONSTRAINT "ProductOrder_product_id_fkey";

-- DropTable
DROP TABLE "ProductOrder";

-- CreateTable
CREATE TABLE "products_order" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "state" "OrderState" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "products_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_order_id_key" ON "products_order"("id");

-- AddForeignKey
ALTER TABLE "products_order" ADD CONSTRAINT "products_order_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "ordes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_order" ADD CONSTRAINT "products_order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
