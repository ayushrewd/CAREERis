import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

export async function GET(request:NextRequest,{params}:{params:{id:string}}){try{resolveAuthContext(request);const course=await prisma.course.findFirst({where:{id:params.id,status:"ACTIVE",trainingProvider:{account:{isNot:null}}},include:{trainingProvider:true,courseSkills:{include:{skill:true}}}});if(!course)return NextResponse.json({error:"Verified course record not found"},{status:404});return NextResponse.json({course});}catch(error){const message=error instanceof Error?error.message:"Could not load course";return NextResponse.json({error:message},{status:message==="Authentication required"?401:500})}}
