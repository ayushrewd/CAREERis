import { AuditLogItem } from "@/types";
import { getAuditLogs, recordAuditEvent } from "@/lib/audit";

export const auditRepository = {
  async findAll(params?: {
    action?: string;
    entity?: string;
    userId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: AuditLogItem[]; total: number }> {
    let logs = getAuditLogs();

    if (params?.action) {
      logs = logs.filter((l) => l.action.toLowerCase().includes(params.action!.toLowerCase()));
    }
    if (params?.entity) {
      logs = logs.filter((l) => l.entity.toLowerCase() === params.entity!.toLowerCase());
    }

    const total = logs.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    const paginated = logs.slice((page - 1) * pageSize, page * pageSize);

    return { items: paginated, total };
  },

  async record(data: {
    userName: string;
    userRole: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: Record<string, any>;
  }): Promise<AuditLogItem> {
    return recordAuditEvent(data);
  },
};
