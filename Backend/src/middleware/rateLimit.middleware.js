/**
 * In-memory sliding window rate limiter
 */

class MemoryRateLimiter {
  constructor() {
    this.requests = new Map(); // ip -> Array of timestamps
    // Periodically clean up records older than 15 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of this.requests.entries()) {
        const valid = timestamps.filter((t) => now - t < 15 * 60 * 1000);
        if (valid.length === 0) {
          this.requests.delete(key);
        } else {
          this.requests.set(key, valid);
        }
      }
    }, 5 * 60 * 1000);

    // Ensure interval doesn't prevent node from exiting in tests
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  limit({ windowMs = 60 * 1000, max = 60, message = "Too many requests. Please slow down." }) {
    return (req, res, next) => {
      const ip =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "127.0.0.1";
      const key = `${req.baseUrl || req.path}:${ip}`;
      const now = Date.now();

      const timestamps = (this.requests.get(key) || []).filter(
        (t) => now - t < windowMs
      );

      if (timestamps.length >= max) {
        const oldest = timestamps[0];
        const resetTime = Math.ceil((oldest + windowMs - now) / 1000);

        res.setHeader("Retry-After", resetTime);
        res.setHeader("RateLimit-Limit", max);
        res.setHeader("RateLimit-Remaining", 0);
        res.setHeader("RateLimit-Reset", resetTime);

        return res.status(429).json({
          success: false,
          message,
          retryAfterSeconds: resetTime,
        });
      }

      timestamps.push(now);
      this.requests.set(key, timestamps);

      res.setHeader("RateLimit-Limit", max);
      res.setHeader("RateLimit-Remaining", max - timestamps.length);

      next();
    };
  }
}

const limiter = new MemoryRateLimiter();

module.exports = {
  rateLimit: (options) => limiter.limit(options),
  // Specialized pre-configured limiters
  authLimiter: limiter.limit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 20, // 20 attempts
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  }),
  scanLimiter: limiter.limit({
    windowMs: 60 * 1000, // 1 min
    max: 15, // 15 scans per minute
    message: "Scanner rate limit reached. Please wait a minute before submitting further scans.",
  }),
  generalLimiter: limiter.limit({
    windowMs: 60 * 1000,
    max: 120,
    message: "Request rate limit exceeded. Please throttle requests.",
  }),
};
