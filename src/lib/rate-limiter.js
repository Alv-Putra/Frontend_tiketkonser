export default class RateLimiter {
  constructor({ maxAttempts, windowMs } = {}) {
    this.maxAttempts = maxAttempts || 5;
    this.windowMs = windowMs || 15 * 60 * 1000;
    this.records = new Map();
  }

  _getRecord(key) {
    const now = Date.now();
    const record = this.records.get(key);
    if (!record) {
      const newRecord = { attempts: 0, firstAttemptAt: now, blockedUntil: null };
      this.records.set(key, newRecord);
      return newRecord;
    }

    if (record.blockedUntil && now < record.blockedUntil) {
      return record;
    }

    if (now - record.firstAttemptAt > this.windowMs) {
      record.attempts = 0;
      record.firstAttemptAt = now;
      record.blockedUntil = null;
    }
    return record;
  }

  check(key) {
    const record = this._getRecord(key);
    if (record.blockedUntil) {
      const retryAfter = Math.ceil((record.blockedUntil - Date.now()) / 1000);
      return { allowed: false, retryAfterSeconds: retryAfter };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }

  hit(key) {
    const record = this._getRecord(key);
    record.attempts += 1;
    if (record.attempts > this.maxAttempts) {
      record.blockedUntil = Date.now() + this.windowMs;
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(this.windowMs / 1000),
        attempts: record.attempts,
      };
    }
    return { allowed: true, retryAfterSeconds: 0, attempts: record.attempts };
  }

  reset(key) {
    this.records.delete(key);
  }

  clear() {
    this.records.clear();
  }
}

export function createRateLimiter(config) {
  return new RateLimiter(config);
}