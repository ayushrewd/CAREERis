export interface EvidenceMetadata {
  id: string;
  candidateId: string;
  skillId?: string;
  projectId?: string;
  title: string;
  description?: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  checksumSha256: string;
  storageProvider: "LOCAL_VOLATILE" | "AWS_S3" | "GCS_BUCKET";
  storageKey: string;
  publicUrl?: string;
  verificationStatus: "UNVERIFIED" | "ASSESSMENT_VERIFIED" | "INSTITUTE_VERIFIED" | "EMPLOYER_VERIFIED";
  uploadedAt: string;
  verifiedAt?: string;
}

let inMemoryEvidence: EvidenceMetadata[] = [
  {
    id: "ev-01",
    candidateId: "user-cand-01",
    skillId: "skill-bms",
    projectId: "proj-01",
    title: "MATLAB Simulink 14S BMS Telemetry Telemetry Log",
    fileName: "bms_14s_thermal_runaway_sim.slx",
    fileSizeBytes: 2457600,
    mimeType: "application/octet-stream",
    checksumSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    storageProvider: "LOCAL_VOLATILE",
    storageKey: "evidence/user-cand-01/bms_14s_thermal_runaway_sim.slx",
    verificationStatus: "INSTITUTE_VERIFIED",
    uploadedAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
  },
  {
    id: "ev-02",
    candidateId: "user-cand-01",
    skillId: "skill-plc",
    title: "Siemens S7-1500 TIA Portal Automation Program",
    fileName: "conveyor_sorting_ladder_logic.zap17",
    fileSizeBytes: 4194304,
    mimeType: "application/octet-stream",
    checksumSha256: "87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7",
    storageProvider: "LOCAL_VOLATILE",
    storageKey: "evidence/user-cand-01/conveyor_sorting_ladder_logic.zap17",
    verificationStatus: "ASSESSMENT_VERIFIED",
    uploadedAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
  },
];

export const evidenceStorageService = {
  async getCandidateEvidence(candidateId: string): Promise<EvidenceMetadata[]> {
    return inMemoryEvidence.filter((e) => e.candidateId === candidateId);
  },

  async registerEvidence(data: Omit<EvidenceMetadata, "id" | "uploadedAt">): Promise<EvidenceMetadata> {
    const record: EvidenceMetadata = {
      ...data,
      id: `ev-${Date.now().toString(36)}`,
      uploadedAt: new Date().toISOString(),
    };
    inMemoryEvidence = [record, ...inMemoryEvidence];
    return record;
  },

  async updateVerification(
    id: string,
    status: EvidenceMetadata["verificationStatus"]
  ): Promise<EvidenceMetadata | null> {
    const item = inMemoryEvidence.find((e) => e.id === id);
    if (!item) return null;
    item.verificationStatus = status;
    item.verifiedAt = new Date().toISOString();
    return item;
  },
};
