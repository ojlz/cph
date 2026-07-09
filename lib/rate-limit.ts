const buckets = new Map<string, { count: number; blockUntil: number }>();

export interface RateLimitConfig {
  max: number;
  windowMinutes: number;
}

export function checkRateLimit(
  ip: string,
  config: RateLimitConfig,
  scope?: string,
): boolean {
  const key = scope ? `${scope}:${ip}` : ip;
  const now = Date.now();
  const entry = buckets.get(key);
  if (entry && entry.blockUntil > now) return false;
  if (entry) {
    entry.count++;
    if (entry.count >= config.max) {
      entry.blockUntil = now + config.windowMinutes * 60 * 1000;
      return false;
    }
  } else {
    buckets.set(key, { count: 1, blockUntil: 0 });
  }
  return true;
}

export function resetRateLimit(ip: string, scope?: string): void {
  buckets.delete(scope ? `${scope}:${ip}` : ip);
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
