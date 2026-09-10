type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  context?: Record<string, unknown>;
}

const SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "auth",
  "apiKey",
  "authorization",
  "cookie",
];

function sanitizeObject(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.some((sk) => key.toLowerCase().includes(sk))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export const logger = {
  log(level: LogLevel, message: string, context?: Record<string, unknown>, requestId?: string) {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      requestId,
      context: context ? (sanitizeObject(context) as Record<string, unknown>) : undefined,
    };

    const formatted = `[${payload.timestamp}] [${payload.level}]${
      payload.requestId ? ` [req:${payload.requestId}]` : ""
    } ${payload.message}`;

    if (level === "ERROR") {
      console.error(formatted, payload.context || "");
    } else if (level === "WARN") {
      console.warn(formatted, payload.context || "");
    } else {
      console.log(formatted, payload.context || "");
    }
  },

  debug(message: string, context?: Record<string, unknown>, requestId?: string) {
    this.log("DEBUG", message, context, requestId);
  },

  info(message: string, context?: Record<string, unknown>, requestId?: string) {
    this.log("INFO", message, context, requestId);
  },

  warn(message: string, context?: Record<string, unknown>, requestId?: string) {
    this.log("WARN", message, context, requestId);
  },

  error(message: string, context?: Record<string, unknown>, requestId?: string) {
    this.log("ERROR", message, context, requestId);
  },
};
