import { z } from 'zod';
import { JobType, ProficiencyLevel } from '@prisma/client';
import { normalizeSkillName } from '@/server/services/skill/prismaSkillService';

const optionalNumber = z.preprocess(value => value === '' || value == null ? undefined : value,
  z.coerce.number().finite().int().min(0).max(2_147_483_647).optional());
export const jobSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(20000),
  location: z.string().trim().min(1).max(200),
  sector: z.string().trim().max(200).optional(),
  qualification: z.string().trim().max(500).optional(),
  jobType: z.enum(JobType).default('FULL_TIME'),
  minExperience: optionalNumber,
  maxExperience: optionalNumber,
  minSalaryINR: optionalNumber,
  maxSalaryINR: optionalNumber,
  openPositions: z.coerce.number().int().min(1).max(100000).default(1),
  requirements: z.array(z.object({
    name: z.string().trim().min(1).max(80).refine(name => !!normalizeSkillName(name), 'Enter a valid skill name.'),
    proficiency: z.enum(ProficiencyLevel).default('INTERMEDIATE'),
    mandatory: z.boolean().default(true),
    weight: z.number().finite().min(0.1).max(10).default(1),
  })).min(1).max(50),
}).superRefine((data, ctx) => {
  if (data.maxExperience !== undefined && data.maxExperience < (data.minExperience ?? 0))
    ctx.addIssue({ code: 'custom', path: ['maxExperience'], message: 'Maximum experience must be at least minimum experience.' });
  if (data.maxSalaryINR !== undefined && data.minSalaryINR !== undefined && data.maxSalaryINR < data.minSalaryINR)
    ctx.addIssue({ code: 'custom', path: ['maxSalaryINR'], message: 'Maximum salary must be at least minimum salary.' });
});
