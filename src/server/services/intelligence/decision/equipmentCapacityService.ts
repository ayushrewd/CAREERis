import { EquipmentGapMetric } from "@/types/decisionIntelligence";
import { equipmentRepository } from "@/server/repositories/equipmentRepository";
import { courseRepository } from "@/server/repositories/courseRepository";

export const equipmentCapacityService = {
  async evaluateEquipmentGap(courseId: string): Promise<EquipmentGapMetric[]> {
    const course = await courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }

    const items = await equipmentRepository.findAll({ courseId });
    const results: EquipmentGapMetric[] = [];
    const capacitySeats = course.capacity || 35;

    for (const eq of items) {
      const requiredUnits = Math.ceil(capacitySeats / 4); // 4 students per workbench ratio
      const operationalUnits = eq.operationalQuantity;
      const netGap = Math.max(0, requiredUnits - operationalUnits);

      let severity: EquipmentGapMetric["severity"] = "LOW";
      let maintenanceRisk: EquipmentGapMetric["maintenanceRisk"] = "LOW";

      if (eq.maintenanceStatus === "OUT_OF_ORDER" || eq.maintenanceStatus === "UNDER_REPAIR" || netGap >= 3) {
        severity = "HIGH";
        maintenanceRisk = "SEVERE";
      } else if (eq.maintenanceStatus === "MAINTENANCE_DUE" || netGap >= 1) {
        severity = "MEDIUM";
        maintenanceRisk = "ELEVATED";
      }

      const estimatedCapacityImpact = operationalUnits < requiredUnits
        ? Math.round(((requiredUnits - operationalUnits) / requiredUnits) * 100)
        : 0;

      results.push({
        courseId: course.id,
        courseTitle: course.title,
        category: eq.category,
        requiredUnits,
        operationalUnits,
        studentDemand: capacitySeats,
        netGap,
        severity,
        maintenanceRisk,
        estimatedCapacityImpact,
        affectedSeats: netGap * 4,
        affectedLearners: Math.min(capacitySeats, netGap * 4),
        confidence: 0.96,
      });
    }

    return results;
  },

  async getAllEquipmentGaps(district?: string): Promise<EquipmentGapMetric[]> {
    const coursesRes = await courseRepository.findAll();
    const results: EquipmentGapMetric[] = [];
    for (const c of coursesRes.items) {
      const gaps = await this.evaluateEquipmentGap(c.id);
      results.push(...gaps);
    }
    return results;
  },
};
