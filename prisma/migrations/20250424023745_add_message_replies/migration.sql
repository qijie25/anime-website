-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
