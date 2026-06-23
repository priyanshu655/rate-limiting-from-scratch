import express from "express";
import "dotenv/config";
import redisClient from "./redis/redis.js";
import redisRateLimiter from "./middleware/redisRateLimiter.js";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/api/data", redisRateLimiter, (req, res) => {
  res.json({
    success: true,
    message: "Request allowed",
  });
});

app.get("/metrics", async (req, res) => {
  const allowed = await redisClient.get("metrics:allowed");

  const blocked = await redisClient.get("metrics:blocked");

  res.json({
    allowed: Number(allowed || 0),

    blocked: Number(blocked || 0),
  });
});

app.get("/", (req, res) => {
  res.json({
    service: "Redis Token Bucket Rate Limiter",
    status: "running",
  });
});

app.get("/my-limits",async (req,res)=>{
     const planName =
            req.headers["x-plan"] ||
            "basic";
     const key =
    req.headers["x-api-key"]
    || `${req.ip}:${planName}`;

        const redisKey =
            `bucket:${key}`;

            let bucket =
    await redisClient.get(redisKey);

    if (!bucket) {
    return res.status(404).json({
        error: "Bucket not found"
    });
}
bucket = JSON.parse(bucket);
res.json({
    plan: planName,
    capacity: bucket.capacity,
    remaining: bucket.tokens,
    refillRate: bucket.refillRate,
    lastRefillTime:
        bucket.lastRefillTime
});
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
