import { RawRecord } from "@/types/intelligence";

let inMemoryRawRecords: RawRecord[] = [];

export const rawRecordRepository = {
  async saveRawRecord(data: Omit<RawRecord, "id" | "receivedAt">): Promise<RawRecord> {
    const record: RawRecord = {
      ...data,
      id: `raw-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      receivedAt: new Date().toISOString(),
    };
    inMemoryRawRecords.push(record);
    return record;
  },

  async findByChecksum(checksum: string): Promise<RawRecord | null> {
    const found = inMemoryRawRecords.find((r) => r.checksum === checksum);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async findByExternalId(sourceId: string, externalRecordId: string): Promise<RawRecord | null> {
    const found = inMemoryRawRecords.find(
      (r) => r.sourceId === sourceId && r.externalRecordId === externalRecordId
    );
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async countByStatus(status: "PENDING" | "PROCESSED" | "REJECTED" | "DUPLICATE"): Promise<number> {
    return inMemoryRawRecords.filter((r) => r.processingStatus === status).length;
  },
};
