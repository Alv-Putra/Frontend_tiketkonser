import RateLimiter, { createRateLimiter } from '@/lib/rate-limiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows requests below the maximum', () => {
    const limiter = new RateLimiter({ maxAttempts: 2, windowMs: 1000 });
    expect(limiter.hit('key').allowed).toBe(true);
    expect(limiter.hit('key').allowed).toBe(true);
    expect(limiter.check('key').allowed).toBe(true);
  });

  it('blocks requests above the maximum', () => {
    const limiter = new RateLimiter({ maxAttempts: 2, windowMs: 1000 });
    limiter.hit('key');
    limiter.hit('key');
    const third = limiter.hit('key');
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('includes attempt count in hit result', () => {
    const limiter = new RateLimiter({ maxAttempts: 3, windowMs: 1000 });
    expect(limiter.hit('key').attempts).toBe(1);
    expect(limiter.hit('key').attempts).toBe(2);
  });

  it('check reports blocked state with retry time', () => {
    const limiter = new RateLimiter({ maxAttempts: 1, windowMs: 60000 });
    limiter.hit('key');
    limiter.hit('key');
    const result = limiter.check('key');
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('reset clears a key', () => {
    const limiter = new RateLimiter({ maxAttempts: 1, windowMs: 1000 });
    limiter.hit('key');
    limiter.hit('key');
    expect(limiter.check('key').allowed).toBe(false);
    limiter.reset('key');
    expect(limiter.check('key').allowed).toBe(true);
  });

  it('window resets automatically after windowMs', () => {
    const limiter = new RateLimiter({ maxAttempts: 1, windowMs: 10000 });
    limiter.hit('key');
    limiter.hit('key');
    expect(limiter.check('key').allowed).toBe(false);
    jest.advanceTimersByTime(11000);
    expect(limiter.check('key').allowed).toBe(true);
  });

  it('uses default maxAttempts and windowMs', () => {
    const limiter = new RateLimiter();
    for (let i = 0; i < 5; i++) {
      limiter.hit('key');
    }
    expect(limiter.hit('key').allowed).toBe(false);
  });

  it('clear resets all records', () => {
    const limiter = new RateLimiter({ maxAttempts: 1, windowMs: 1000 });
    limiter.hit('a');
    limiter.hit('a');
    limiter.hit('b');
    limiter.hit('b');
    expect(limiter.check('a').allowed).toBe(false);
    expect(limiter.check('b').allowed).toBe(false);
    limiter.clear();
    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('b').allowed).toBe(true);
  });

  it('createRateLimiter returns an instance', () => {
    const limiter = createRateLimiter({ maxAttempts: 3, windowMs: 5000 });
    expect(limiter).toBeInstanceOf(RateLimiter);
    expect(limiter.maxAttempts).toBe(3);
    expect(limiter.windowMs).toBe(5000);
  });
});