export type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace";
export type LogMetadata = Record<string, unknown> | undefined;

const LEVEL_WEIGHTS: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const LOG_METHOD: Record<
  Exclude<LogLevel, "silent">,
  (message?: unknown, ...optionalParams: unknown[]) => void
> = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
  trace: console.debug,
};

function parseLogLevel(value: string | undefined | null): LogLevel {
  if (!value) {
    return process.env.NODE_ENV === "production" ? "warn" : "debug";
  }

  const normalized = value.toLowerCase() as LogLevel;
  if (normalized in LEVEL_WEIGHTS) {
    return normalized;
  }

  return process.env.NODE_ENV === "production" ? "warn" : "debug";
}

const resolvedLevel = parseLogLevel(
  process.env.LOG_LEVEL ??
    process.env.NEXT_LOG_LEVEL ??
    process.env.NEXT_PUBLIC_LOG_LEVEL,
);

function serialize(value: unknown): unknown {
  if (value instanceof Error) {
    const errorObject: Record<string, unknown> = {
      name: value.name,
      message: value.message,
    };

    if (value.stack) {
      errorObject.stack = value.stack;
    }

    if ("cause" in value && value.cause) {
      errorObject.cause = serialize(value.cause);
    }

    for (const key of Object.getOwnPropertyNames(value)) {
      if (!(key in errorObject)) {
        errorObject[key] = serialize((value as Record<string, unknown>)[key]);
      }
    }

    return errorObject;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => serialize(entry));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        serialize(entry),
      ]),
    );
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "symbol") {
    return value.toString();
  }

  return value;
}

function mergeContext(
  base: Record<string, unknown>,
  meta: LogMetadata,
): Record<string, unknown> | undefined {
  const normalizedBase =
    Object.keys(base).length > 0 ? serialize(base) : undefined;
  const normalizedMeta = meta ? serialize(meta) : undefined;

  if (!normalizedBase && !normalizedMeta) {
    return undefined;
  }

  return {
    ...(normalizedBase as Record<string, unknown> | undefined),
    ...(normalizedMeta as Record<string, unknown> | undefined),
  };
}

export interface Logger {
  level: LogLevel;
  child(context: Record<string, unknown>): Logger;
  error(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  info(message: string, meta?: LogMetadata): void;
  debug(message: string, meta?: LogMetadata): void;
  trace(message: string, meta?: LogMetadata): void;
}

function createLogger(context: Record<string, unknown> = {}): Logger {
  const logWithLevel = (
    level: Exclude<LogLevel, "silent">,
    message: string,
    meta?: LogMetadata,
  ) => {
    if (LEVEL_WEIGHTS[level] > LEVEL_WEIGHTS[resolvedLevel]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const combinedContext = mergeContext(context, meta);
    const method = LOG_METHOD[level];
    const prefix = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (combinedContext) {
      method(prefix, combinedContext);
    } else {
      method(prefix);
    }
  };

  return {
    level: resolvedLevel,
    child(additionalContext) {
      return createLogger({ ...context, ...additionalContext });
    },
    error(message, meta) {
      logWithLevel("error", message, meta);
    },
    warn(message, meta) {
      logWithLevel("warn", message, meta);
    },
    info(message, meta) {
      logWithLevel("info", message, meta);
    },
    debug(message, meta) {
      logWithLevel("debug", message, meta);
    },
    trace(message, meta) {
      logWithLevel("trace", message, meta);
    },
  };
}

export const logger = createLogger();
