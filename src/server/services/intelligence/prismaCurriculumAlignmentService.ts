import { prisma } from "@/server/db/prisma";

export async function calculateCurriculumAlignment(courseId: string) {
  const course=await prisma.course.findUnique({where:{id:courseId},include:{courseSkills:{include:{skill:true}},curriculums:{orderBy:{lastAudited:"desc"},take:1,include:{modules:{include:{skills:{include:{skill:true}}}}}},trainingProvider:true}});
  if(!course)throw new Error("Course not found");
  const jobs=await prisma.job.findMany({where:{status:"ACTIVE",company:{employerAccount:{isNot:null}},...(course.locationText?{locationText:{contains:course.locationText,mode:"insensitive"}}:{})},include:{company:{select:{name:true}},jobSkills:{include:{skill:true}}}});
  const feedback=await prisma.employerFeedback.findMany({where:{skillGap:true,job:{status:{in:["ACTIVE","INACTIVE","ARCHIVED"]}}},include:{skill:true,company:{select:{name:true}}},orderBy:{observedAt:"desc"}});
  const demand=new Map<string,{skillId:string;skill:string;openings:number;jobs:Array<{id:string;company:string;observedAt:Date}>;feedback:Array<{id:string;company:string;observedAt:Date}>}>();
  for(const job of jobs)for(const requirement of job.jobSkills){const row=demand.get(requirement.skillId)||{skillId:requirement.skillId,skill:requirement.skill.name,openings:0,jobs:[],feedback:[]};row.openings+=job.openPositions;row.jobs.push({id:job.id,company:job.company.name,observedAt:job.updatedAt});demand.set(requirement.skillId,row)}
  for(const item of feedback){const row=demand.get(item.skillId)||{skillId:item.skillId,skill:item.skill.name,openings:0,jobs:[],feedback:[]};row.feedback.push({id:item.id,company:item.company.name,observedAt:item.observedAt});demand.set(item.skillId,row)}
  const covered=new Set([...course.courseSkills.map(x=>x.skillId),...(course.curriculums[0]?.modules.flatMap(module=>module.skills.map(x=>x.skillId))||[])]);
  const recommendations=Array.from(demand.values()).map(item=>({skillId:item.skillId,skill:item.skill,status:covered.has(item.skillId)?"ALIGNED":"UPDATE_AND_EXPAND",recommendation:covered.has(item.skillId)?"Skill is represented in the course or curriculum.":`Add a curriculum module covering ${item.skill}.`,evidence:{demandOpenings:item.openings,jobRecords:item.jobs,companyFeedback:item.feedback}}));
  const hasEvidence=recommendations.some(item=>item.evidence.jobRecords.length||item.evidence.companyFeedback.length);
  return {course:{id:course.id,title:course.title,capacity:course.capacity,location:course.locationText},status:hasEvidence?(recommendations.some(item=>item.status==="UPDATE_AND_EXPAND")?"UPDATE_AND_EXPAND":"ALIGNED"):"INSUFFICIENT_DATA",recommendations,method:"Compares canonical skills in registered-company jobs and post-hire skill-gap feedback with course and curriculum-module skills.",obsolescenceDecision:"Insufficient evidence for obsolescence decision."};
}
