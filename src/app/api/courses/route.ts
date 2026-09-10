import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

export async function GET(request: NextRequest) {
  try {
    resolveAuthContext(request);
    const search=request.nextUrl.searchParams.get("search")?.trim();const skill=request.nextUrl.searchParams.get("skill")?.trim();
    const courses=await prisma.course.findMany({where:{status:"ACTIVE",trainingProvider:{account:{isNot:null}},...(search?{OR:[{title:{contains:search,mode:"insensitive"}},{description:{contains:search,mode:"insensitive"}},{trainingProvider:{name:{contains:search,mode:"insensitive"}}}]}:{}),...(skill?{courseSkills:{some:{skill:{OR:[{name:{contains:skill,mode:"insensitive"}},{normalizedName:{contains:skill.toLowerCase()}}]}}}}:{})},orderBy:{createdAt:"desc"},include:{trainingProvider:{select:{id:true,name:true,isAccredited:true}},courseSkills:{include:{skill:true}},_count:{select:{enrollments:true}}}});
    return NextResponse.json({courses,coverage:"Published courses from registered CAREERIS training-provider accounts only."});
  } catch(error){const message=error instanceof Error?error.message:"Could not load courses";return NextResponse.json({error:message},{status:message==="Authentication required"?401:500})}
}
