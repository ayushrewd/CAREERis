import { DataSourceType, UserRoleType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

type Observation = { recordedDate: Date; openPositions: number; id: string; sourceType: DataSourceType };

export function calculateMovingAverageForecast(observations: Observation[], horizonMonths = 3) {
  const grouped = new Map<string, { value: number; evidenceIds: string[] }>();
  for (const observation of observations) {
    const date = new Date(observation.recordedDate);
    const period = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    const current = grouped.get(period) || { value: 0, evidenceIds: [] };
    current.value += observation.openPositions;
    current.evidenceIds.push(observation.id);
    grouped.set(period, current);
  }
  const periods = [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right));
  if (periods.length < 3) return { status: "INSUFFICIENT_HISTORICAL_DATA" as const, method: "THREE_PERIOD_MOVING_AVERAGE", observations: periods.length, requiredObservations: 3, message: "Insufficient historical data for forecasting.", projections: [], backtestMae: null };

  const values = periods.map(([, row]) => row.value);
  const movingAverage = values.slice(-3).reduce((sum, value) => sum + value, 0) / 3;
  const lastPeriod = new Date(`${periods.at(-1)![0]}-01T00:00:00.000Z`);
  const projections = Array.from({ length: horizonMonths }, (_, index) => {
    const date = new Date(Date.UTC(lastPeriod.getUTCFullYear(), lastPeriod.getUTCMonth() + index + 1, 1));
    return { period: date.toISOString().slice(0, 7), value: Math.round(movingAverage * 100) / 100 };
  });
  const errors: number[] = [];
  for (let index = 3; index < values.length; index++) {
    const prediction = values.slice(index - 3, index).reduce((sum, value) => sum + value, 0) / 3;
    errors.push(Math.abs(values[index] - prediction));
  }
  return { status: "AVAILABLE" as const, method: "THREE_PERIOD_MOVING_AVERAGE", observations: periods.length, requiredObservations: 3, trainingPeriods: periods.slice(-3).map(([period, row]) => ({ period, value: row.value, evidenceIds: row.evidenceIds })), projections, backtestMae: errors.length ? Math.round((errors.reduce((sum, value) => sum + value, 0) / errors.length) * 100) / 100 : null, message: errors.length ? null : "Forecast available; one-step backtest requires at least four historical periods." };
}

export async function calculateWorkforceIntelligence(userId: string, role: UserRoleType, requestedDistrict?: string | null) {
  let district = requestedDistrict?.trim() || null;
  if (role === "DISTRICT_ADMIN" || role === "GOVERNMENT_ADMIN") {
    const planner = await prisma.governmentPlannerProfile.findUnique({ where: { userId }, select: { district: true } });
    if (!planner) throw new Error("Government planner profile not found");
    district = planner.district?.trim() || null;
  }
  const locationFilter = district ? { contains: district, mode: "insensitive" as const } : undefined;
  const [jobs, courses, supplementaryDemand, technologySignals, feedback, placements, sourceCoverage, providerAccount] = await Promise.all([
    prisma.job.findMany({ where: { status: "ACTIVE", company: { employerAccount: { isNot: null } }, ...(locationFilter ? { locationText: locationFilter } : {}) }, include: { company: { select: { name: true } }, jobSkills: { include: { skill: true } } } }),
    prisma.course.findMany({ where: { status: "ACTIVE", trainingProvider: { account: { isNot: null } }, ...(locationFilter ? { OR: [{ locationText: locationFilter }, { deliveryMode: { contains: "ONLINE", mode: "insensitive" } }] } : {}) }, include: { trainingProvider: { select: { name: true, trainers: { include: { skills: true } } } }, courseSkills: { include: { skill: true } }, enrollments: true, courseEquipments: { include: { equipment: true } } } }),
    prisma.demandSignal.findMany({ where: { dataSource: { sourceType: { in: ["EMPLOYER_SURVEYS", "INDUSTRY_CONSULTATION", "SECTOR_DATA"] }, ...(locationFilter ? { geographyScope: locationFilter } : {}) } }, include: { skill: true, dataSource: true }, orderBy: { recordedDate: "asc" } }),
    prisma.technologySignal.findMany({ where: locationFilter ? { dataSource: { geographyScope: locationFilter } } : undefined, include: { skill: true, dataSource: true }, orderBy: { observedAt: "desc" } }),
    prisma.employerFeedback.findMany({ where: locationFilter ? { job: { locationText: locationFilter } } : undefined, include: { skill: true, company: { select: { name: true } } } }),
    prisma.placement.findMany({ where: locationFilter ? { job: { locationText: locationFilter } } : undefined, include: { job: { include: { jobSkills: { include: { skill: true } } } } } }),
    prisma.dataSource.groupBy({ by: ["sourceType"], where: locationFilter ? { geographyScope: locationFilter } : undefined, _count: true }),
    role === "TRAINING_PROVIDER" ? prisma.trainingProviderAccountProfile.findUnique({ where: { userId }, include: { trainingProvider: true } }) : Promise.resolve(null),
  ]);

  const rows = new Map<string, any>();
  const rowFor = (skill: { id: string; name: string }) => {
    const row = rows.get(skill.id) || { skillId: skill.id, skill: skill.name, demandOpenings: 0, employerRecords: 0, surveyDemand: 0, surveyRecords: 0, demandEvidence: [], requiredProficiency: {} as Record<string, number>, trainingSeats: 0, courseRecords: 0, enrollments: 0, completions: 0, trainerCapabilityRecords: 0, equipmentUnits: 0, supplyEvidence: [], placements: 0, feedbackGaps: 0, technologySignals: [], historicalObservations: [] as Observation[] };
    rows.set(skill.id, row);
    return row;
  };
  for (const job of jobs) for (const requirement of job.jobSkills) {
    const row = rowFor(requirement.skill);
    row.demandOpenings += job.openPositions;
    row.employerRecords += 1;
    row.requiredProficiency[requirement.requiredLevel] = (row.requiredProficiency[requirement.requiredLevel] || 0) + job.openPositions;
    row.demandEvidence.push({ type: "REGISTERED_COMPANY_JOB", id: job.id, organization: job.company.name, quantity: job.openPositions, observedAt: job.updatedAt });
  }
  for (const signal of supplementaryDemand) {
    const row = rowFor(signal.skill);
    row.surveyDemand += signal.openPositions;
    row.surveyRecords += 1;
    if (signal.proficiency) row.requiredProficiency[signal.proficiency] = (row.requiredProficiency[signal.proficiency] || 0) + signal.openPositions;
    row.demandEvidence.push({ type: signal.dataSource.sourceType, id: signal.id, source: signal.dataSource.name, quantity: signal.openPositions, observedAt: signal.recordedDate, sourceUrl: signal.dataSource.sourceUrl });
    row.historicalObservations.push({ id: signal.id, recordedDate: signal.recordedDate, openPositions: signal.openPositions, sourceType: signal.dataSource.sourceType });
  }
  for (const course of courses) for (const courseSkill of course.courseSkills) {
    const row = rowFor(courseSkill.skill);
    row.trainingSeats += course.capacity;
    row.courseRecords += 1;
    row.enrollments += course.enrollments.length;
    row.completions += course.enrollments.filter((enrollment) => enrollment.status === "COMPLETED" && enrollment.providerConfirmedAt).length;
    row.trainerCapabilityRecords += course.trainingProvider.trainers.filter((trainer) => trainer.skills.some((skill) => skill.skillId === courseSkill.skillId)).length;
    row.equipmentUnits += course.courseEquipments.filter((item) => item.equipment.workingCondition).reduce((sum, item) => sum + item.unitsCount, 0);
    row.supplyEvidence.push({ type: "PUBLISHED_PROVIDER_COURSE", id: course.id, organization: course.trainingProvider.name, seats: course.capacity, observedAt: course.createdAt });
  }
  for (const placement of placements) for (const requirement of placement.job?.jobSkills || []) rowFor(requirement.skill).placements += 1;
  for (const item of feedback) {
    const row = rowFor(item.skill);
    if (item.skillGap) row.feedbackGaps += 1;
    row.demandEvidence.push({ type: "POST_HIRE_FEEDBACK", id: item.id, organization: item.company.name, observedAt: item.observedAt, skillGap: item.skillGap });
  }
  for (const signal of technologySignals) rowFor(signal.skill).technologySignals.push({ id: signal.id, title: signal.title, sourceUrl: signal.sourceUrl, observedAt: signal.observedAt });

  for (const row of rows.values()) {
    const totalDemand = row.demandOpenings + row.surveyDemand;
    const hasDemand = row.employerRecords + row.surveyRecords > 0;
    const hasSupply = row.courseRecords > 0;
    row.demand = hasDemand ? totalDemand : null;
    row.supply = hasSupply ? row.trainingSeats : null;
    row.gap = hasDemand && hasSupply ? totalDemand - row.trainingSeats : null;
    if (!hasDemand || !hasSupply) row.status = "INSUFFICIENT_DATA";
    else if (row.gap > 0) row.status = row.gap / Math.max(1, totalDemand) >= 0.5 ? "HIGH_GAP" : "MODERATE_GAP";
    else row.status = "ALIGNED_TO_OBSERVED_DEMAND";
    row.forecast = calculateMovingAverageForecast(row.historicalObservations);
    row.technologyDemandStatus = row.technologySignals.length === 0 ? null : hasDemand ? "LABOUR_DEMAND_EVIDENCED" : "TECHNOLOGY_SIGNAL_ONLY";
    row.obsolescence = "INSUFFICIENT_EVIDENCE";
    row.explanation = !hasDemand || !hasSupply ? "Insufficient evidence — both registered demand and published training supply are required for a gap calculation." : `Observed demand ${totalDemand}; published capacity ${row.trainingSeats}; calculated gap ${row.gap}.`;
  }
  return { scope: district || "All available CAREERIS records", districtAssigned: role === "DISTRICT_ADMIN" || role === "GOVERNMENT_ADMIN" ? Boolean(district) : null, observed: { jobs: jobs.length, courses: courses.length, placements: placements.length, postHireFeedback: feedback.length, technologySignals: technologySignals.length }, sourceCoverage: sourceCoverage.map((source) => ({ type: source.sourceType, records: source._count })), skills: [...rows.values()].sort((left, right) => (right.gap ?? -Infinity) - (left.gap ?? -Infinity)), provider: providerAccount?.trainingProvider || null, methodology: "Current demand uses active jobs from registered companies plus explicit employer survey, consultation and sourced sector observations. Supply uses active courses from registered providers. Forecasts require three distinct historical periods and use a transparent three-period moving average.", limitations: ["Technology signals are kept separate from labour demand until matching company demand evidence exists.", "Course obsolescence or oversupply is not asserted without sufficient historical demand and placement evidence.", "Unknown values remain null and are displayed as Insufficient evidence."] };
}
