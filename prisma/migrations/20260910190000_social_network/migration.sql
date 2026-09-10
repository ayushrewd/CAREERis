CREATE TABLE "Connection" (
  "id" TEXT NOT NULL, "requesterId" TEXT NOT NULL, "recipientId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Connection_requesterId_recipientId_key" ON "Connection"("requesterId", "recipientId");
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "SocialPost" ("id" TEXT NOT NULL, "authorId" TEXT NOT NULL, "content" TEXT NOT NULL, "mediaUrl" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SocialComment" ("id" TEXT NOT NULL, "postId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "SocialComment_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SocialReaction" ("id" TEXT NOT NULL, "postId" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" TEXT NOT NULL DEFAULT 'LIKE', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "SocialReaction_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "SocialReaction_postId_userId_key" ON "SocialReaction"("postId", "userId");
CREATE TABLE "SocialShare" ("id" TEXT NOT NULL, "postId" TEXT NOT NULL, "userId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "SocialShare_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "SocialShare_postId_userId_key" ON "SocialShare"("postId", "userId");
ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialComment" ADD CONSTRAINT "SocialComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialComment" ADD CONSTRAINT "SocialComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialReaction" ADD CONSTRAINT "SocialReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialReaction" ADD CONSTRAINT "SocialReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialShare" ADD CONSTRAINT "SocialShare_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ConversationParticipant" ("id" TEXT NOT NULL, "conversationId" TEXT NOT NULL, "userId" TEXT NOT NULL, "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
