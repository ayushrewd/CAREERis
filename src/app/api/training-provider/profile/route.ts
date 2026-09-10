import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

const schema = z.object({ name: z.string().trim().min(2).max(160), registrationNo: z.string().trim().max(80).nullable().optional(), providerType: z.string().trim().min(2).max(80), headquarters: z.string().trim().max(160).nullable().optional() });
async function accountFor(userId: string) { return prisma.trainingProviderAccountProfile.findUnique({ where: { userId }, include: { trainingProvider: { include: { _count: { select: { courses: true, trainers: true, equipments: true } } } } } }); }

export async function GET(request: NextRequest) {
  try { const auth=resolveAuthContext(request); if(auth.userRole!=="TRAINING_PROVIDER")return NextResponse.json({error:"Training-provider account required"},{status:403}); const account=await accountFor(auth.userId); return account?.trainingProvider?NextResponse.json({provider:account.trainingProvider}):NextResponse.json({error:"Provider record not found"},{status:404}); }
  catch(error){const message=error instanceof Error?error.message:"Could not load provider";return NextResponse.json({error:message},{status:message==="Authentication required"?401:500});}
}

export async function PUT(request: NextRequest) {
  try { const auth=resolveAuthContext(request); if(auth.userRole!=="TRAINING_PROVIDER")return NextResponse.json({error:"Training-provider account required"},{status:403}); const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Please check the provider details."},{status:400});const account=await accountFor(auth.userId);if(!account?.trainingProviderId)return NextResponse.json({error:"Provider record not found"},{status:404});const provider=await prisma.$transaction(async tx=>{const updated=await tx.trainingProvider.update({where:{id:account.trainingProviderId!},data:{name:parsed.data.name,registrationNo:parsed.data.registrationNo||null,providerType:parsed.data.providerType,headquarters:parsed.data.headquarters||null}});await tx.trainingProviderAccountProfile.update({where:{userId:auth.userId},data:{organizationName:updated.name,registrationNo:updated.registrationNo,providerType:updated.providerType,headquarters:updated.headquarters}});await tx.auditLog.create({data:{userId:auth.userId,action:"PROVIDER_PROFILE_UPDATE",entity:"TrainingProvider",entityId:updated.id}});return updated;});return NextResponse.json({provider}); }
  catch(error){const message=error instanceof Error?error.message:"Could not update provider";return NextResponse.json({error:message},{status:message==="Authentication required"?401:500});}
}
