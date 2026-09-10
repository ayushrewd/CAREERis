import { describe, it, expect } from "vitest";
import { trainerIntelligenceService } from "@/server/services/training/trainerIntelligenceService";

describe("Trainer Intelligence, Capacity Gaps & Retraining Pathways", () => {
  it("should retrieve faculty roster with verified competencies", async () => {
    const trainers = await trainerIntelligenceService.getAllTrainers();
    expect(trainers.length).toBeGreaterThanOrEqual(3);
    expect(trainers[0].competencies.length).toBeGreaterThanOrEqual(1);
    expect(trainers[0].qualificationStatus).toBe("QUALIFIED");
  });

  it("should calculate trainer capacity summary across institute", async () => {
    const summary = await trainerIntelligenceService.getTrainerCapacitySummary();
    expect(summary.totalActiveTrainers).toBeGreaterThanOrEqual(3);
    expect(summary.qualifiedInstructorsPercentage).toBeGreaterThanOrEqual(60);
    expect(summary.trainersRequiringRetraining).toBeGreaterThanOrEqual(1);
  });

  it("should generate structured retraining pathway for faculty", async () => {
    const pathway = await trainerIntelligenceService.generateRetrainingPathway("tr-mahesh-02");
    expect(pathway).toBeDefined();
    expect(pathway?.retrainingPathway?.targetSkillName).toContain("Robotic");
    expect(pathway?.retrainingPathway?.recommendedProgram).toContain("Master Trainer");
  });
});
