-- AlterTable
ALTER TABLE "StudySession" ADD COLUMN     "progressRecordId" INTEGER;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_progressRecordId_fkey" FOREIGN KEY ("progressRecordId") REFERENCES "ProgressRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
