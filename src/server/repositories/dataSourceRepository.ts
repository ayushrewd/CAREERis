import { DataSourceRecord, SourceHealthStatus } from "@/types/intelligence";
import { CANONICAL_DATA_SOURCES } from "@/data/canonicalDataSourcesData";

let inMemorySources: DataSourceRecord[] = JSON.parse(JSON.stringify(CANONICAL_DATA_SOURCES));

export const dataSourceRepository = {
  async findAll(params?: { sourceType?: string; status?: SourceHealthStatus; search?: string }): Promise<DataSourceRecord[]> {
    let list = [...inMemorySources];
    if (params?.sourceType) {
      list = list.filter((s) => s.sourceType === params.sourceType);
    }
    if (params?.status) {
      list = list.filter((s) => s.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.publisher.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async findById(id: string): Promise<DataSourceRecord | null> {
    const src = inMemorySources.find(
      (s) => s.id.toLowerCase() === id.toLowerCase() || s.code.toLowerCase() === id.toLowerCase()
    );
    return src ? JSON.parse(JSON.stringify(src)) : null;
  },

  async create(data: Omit<DataSourceRecord, "id">): Promise<DataSourceRecord> {
    const newRecord: DataSourceRecord = {
      ...data,
      id: `src-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemorySources.push(newRecord);
    return newRecord;
  },

  async updateStatus(id: string, status: SourceHealthStatus, errorRate?: number): Promise<DataSourceRecord | null> {
    const index = inMemorySources.findIndex((s) => s.id === id);
    if (index === -1) return null;
    inMemorySources[index] = {
      ...inMemorySources[index],
      status,
      errorRate: errorRate !== undefined ? errorRate : inMemorySources[index].errorRate,
      lastCollectedAt: new Date().toISOString(),
    };
    return inMemorySources[index];
  },
};
