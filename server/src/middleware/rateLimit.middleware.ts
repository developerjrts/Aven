import rateLimit from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
  windows: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeader: false,
  message: {
    error: "Too many summary requests. Please try again later.",
  },
});
