-- CreateEnum
CREATE TYPE "SurveyBlockType" AS ENUM ('CONTENT_QUESTION', 'CONTENT_TEXT', 'INPUT_CHECKBOX', 'INPUT_CHOICE', 'INPUT_FILE', 'INPUT_LONG_ANSWER', 'INPUT_SHORT_ANSWER');

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "headerUrl" TEXT,
    "logoUrl" TEXT,
    "thankYouMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyBlock" (
    "id" TEXT NOT NULL,
    "type" "SurveyBlockType" NOT NULL,
    "value" TEXT NOT NULL,
    "positionPage" INTEGER NOT NULL,
    "positionRank" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ifSelectedThenShowQuestionId" TEXT,
    "surveyId" TEXT NOT NULL,

    CONSTRAINT "SurveyBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surveyId" TEXT NOT NULL,

    CONSTRAINT "SurveyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyEntryAnswer" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "SurveyBlockType" NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surveyEntryId" TEXT NOT NULL,

    CONSTRAINT "SurveyEntryAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Survey_title_key" ON "Survey"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_slug_key" ON "Survey"("slug");

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyBlock" ADD CONSTRAINT "SurveyBlock_ifSelectedThenShowQuestionId_fkey" FOREIGN KEY ("ifSelectedThenShowQuestionId") REFERENCES "SurveyBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyBlock" ADD CONSTRAINT "SurveyBlock_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyEntry" ADD CONSTRAINT "SurveyEntry_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyEntryAnswer" ADD CONSTRAINT "SurveyEntryAnswer_surveyEntryId_fkey" FOREIGN KEY ("surveyEntryId") REFERENCES "SurveyEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
