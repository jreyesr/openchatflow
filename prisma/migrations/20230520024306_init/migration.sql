-- CreateTable
CREATE TABLE "ConversationTemplate" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "flow" JSONB NOT NULL,

    CONSTRAINT "ConversationTemplate_pkey" PRIMARY KEY ("id")
);
