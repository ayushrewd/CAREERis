import { AuditLogItem } from "@/types";

const auditLogsStore: AuditLogItem[] = [
  {
    id: "audit-1",
    userId: "user-admin-01",
    userName: "CareerIS National Admin",
    userRole: "PLATFORM_ADMIN",
    action: "SYSTEM_INITIALIZED",
    entity: "PlatformSystem",
    entityId: "system-root",
    details: { environment: "development", pilotGeography: "Maharashtra" },
    ipAddress: "127.0.0.1",
    createdAt: "2026-02-27T08:00:00Z",
  },
  {
    id: "audit-2",
    userId: "user-dist-01",
    userName: "Sunita Deshmukh",
    userRole: "DISTRICT_ADMIN",
    action: "DISTRICT_PLAN_CREATED",
    entity: "DistrictPlan",
    entityId: "dist-plan-pun-2026",
    details: { district: "Pune", targetTrainees: 12500, sectorFocus: "Automotive & EV" },
    ipAddress: "14.139.122.4",
    createdAt: "2026-02-27T09:15:00Z",
  },
  {
    id: "audit-3",
    userId: "user-emp-01",
    userName: "Priya Mehta",
    userRole: "EMPLOYER",
    action: "JOB_REQUISITION_PUBLISHED",
    entity: "Job",
    entityId: "job-bms-lead-01",
    details: { title: "Battery Management Systems (BMS) Lead", openings: 8, location: "Pune" },
    ipAddress: "103.21.124.9",
    createdAt: "2026-02-27T10:45:00Z",
  },
  {
    id: "audit-4",
    userId: "user-cand-01",
    userName: "Rohit Sharma",
    userRole: "CANDIDATE",
    action: "SKILL_ASSESSMENT_COMPLETED",
    entity: "AssessmentResult",
    entityId: "asmt-res-bms-01",
    details: { skill: "Battery Management Systems (BMS)", score: 92, verified: true },
    ipAddress: "49.36.18.22",
    createdAt: "2026-02-27T11:30:00Z",
  }
];

export function getAuditLogs(): AuditLogItem[] {
  return [...auditLogsStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function recordAuditEvent(params: {
  userId?: string;
  userName?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}): AuditLogItem {
  const newLog: AuditLogItem = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: params.userId,
    userName: params.userName || "Anonymous/System",
    userRole: params.userRole || "SYSTEM",
    action: params.action,
    entity: params.entity,
    entityId: params.entityId,
    details: params.details,
    ipAddress: params.ipAddress || "127.0.0.1",
    createdAt: new Date().toISOString(),
  };

  auditLogsStore.unshift(newLog);
  return newLog;
}
