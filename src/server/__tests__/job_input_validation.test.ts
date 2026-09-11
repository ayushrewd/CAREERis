import { describe, expect, it } from 'vitest';
import { jobSchema } from '@/server/validation/job';

const valid = { title: 'Engineer', description: 'Build software', location: 'Pune', requirements: [{ name: 'Python' }] };
describe('Company job input validation', () => {
  it('preserves zero and treats blank optional numbers as absent', () => {
    const value = jobSchema.parse({ ...valid, minSalaryINR: '0', maxSalaryINR: '', maxExperience: '0' });
    expect(value.minSalaryINR).toBe(0);
    expect(value.maxExperience).toBe(0);
    expect(value.maxSalaryINR).toBeUndefined();
  });
  it.each(['1.5', '-1', 'NaN', 'Infinity', '2147483648'])('rejects invalid openings: %s', openPositions => {
    expect(jobSchema.safeParse({ ...valid, openPositions }).success).toBe(false);
  });
  it('rejects reversed salary and experience ranges', () => {
    expect(jobSchema.safeParse({ ...valid, minSalaryINR: 100, maxSalaryINR: 1 }).success).toBe(false);
    expect(jobSchema.safeParse({ ...valid, minExperience: 5, maxExperience: 1 }).success).toBe(false);
  });
  it('rejects malformed fields and empty normalized skills', () => {
    expect(jobSchema.safeParse({ ...valid, title: {} }).success).toBe(false);
    expect(jobSchema.safeParse({ ...valid, requirements: [{ name: '!!!' }] }).success).toBe(false);
  });
});
