import { rawRecordRepository } from "@/server/repositories/rawRecordRepository";

export const deduplicationService = {
  computeChecksum(record: Record<string, any>): string {
    const rawKey = [
      record.sourceId || "",
      record.externalId || record.externalRecordId || "",
      (record.jobTitle || record.jobTitleRaw || "").toLowerCase().trim(),
      (record.employerName || record.company || "").toLowerCase().trim(),
      (record.location || record.locationRaw || "").toLowerCase().trim(),
      (record.postedAt || record.postedDate || "").substring(0, 10),
    ].join("|");

    // Deterministic hash calculation
    let hash = 0;
    for (let i = 0; i < rawKey.length; i++) {
      const char = rawKey.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `chk-${Math.abs(hash).toString(16)}`;
  },

  async isDuplicate(record: Record<string, any>): Promise<{ isDuplicate: boolean; existingRecordId?: string; checksum: string }> {
    const checksum = this.computeChecksum(record);
    const existing = await rawRecordRepository.findByChecksum(checksum);

    if (existing) {
      return {
        isDuplicate: true,
        existingRecordId: existing.id,
        checksum,
      };
    }

    if (record.sourceId && (record.externalId || record.externalRecordId)) {
      const existingExt = await rawRecordRepository.findByExternalId(
        record.sourceId,
        record.externalId || record.externalRecordId
      );
      if (existingExt) {
        return {
          isDuplicate: true,
          existingRecordId: existingExt.id,
          checksum,
        };
      }
    }

    return {
      isDuplicate: false,
      checksum,
    };
  },
};
