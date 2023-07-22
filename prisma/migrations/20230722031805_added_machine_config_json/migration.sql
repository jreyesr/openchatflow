-- AlterTable
ALTER TABLE "ConversationTemplate" ADD COLUMN     "machineConfig" JSONB NOT NULL DEFAULT '{}';
