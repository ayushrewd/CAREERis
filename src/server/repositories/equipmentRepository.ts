import { EquipmentItem } from "@/types/decisionIntelligence";
import { CANONICAL_EQUIPMENT } from "@/data/canonicalEquipmentData";

let inMemoryEquipment: EquipmentItem[] = JSON.parse(JSON.stringify(CANONICAL_EQUIPMENT));

export const equipmentRepository = {
  async findAll(params?: {
    instituteId?: string;
    courseId?: string;
    category?: string;
    district?: string;
  }): Promise<EquipmentItem[]> {
    let list = [...inMemoryEquipment];
    if (params?.instituteId) {
      list = list.filter((e) => e.instituteId === params.instituteId);
    }
    if (params?.courseId) {
      list = list.filter((e) => e.courseId === params.courseId);
    }
    if (params?.category) {
      list = list.filter((e) => e.category.toLowerCase().includes(params.category!.toLowerCase()));
    }
    if (params?.district) {
      list = list.filter((e) => e.district.toLowerCase() === params.district!.toLowerCase());
    }
    return list;
  },

  async findById(id: string): Promise<EquipmentItem | null> {
    const found = inMemoryEquipment.find((e) => e.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async updateOperationalStatus(id: string, operationalQuantity: number, status: EquipmentItem["maintenanceStatus"]): Promise<EquipmentItem | null> {
    const index = inMemoryEquipment.findIndex((e) => e.id === id);
    if (index === -1) return null;
    inMemoryEquipment[index] = {
      ...inMemoryEquipment[index],
      operationalQuantity,
      maintenanceStatus: status,
    };
    return inMemoryEquipment[index];
  },
};
