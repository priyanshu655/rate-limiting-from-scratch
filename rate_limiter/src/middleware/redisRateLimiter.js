import redisClient from "../redis/redis.js";
import { consumeToken } from "../bucket/redisTokenBucket.js";
import plans from "../config/plans.js";

const redisRateLimiter = async (
    req,
    res,
    next
) => {
    try {
   const planName =
            req.headers["x-plan"] ||
            "basic";
        const key =
    req.headers["x-api-key"]
    || `${req.ip}:${planName}`;

        const redisKey =
            `bucket:${key}`;

     

        const plan =
            plans[planName] ||
            plans.basic;

        let bucket =
            await redisClient.get(
                redisKey
            );

        if (!bucket) {

            bucket = {
                capacity:
                    plan.capacity,

                tokens:
                    plan.capacity,

                refillRate:
                    plan.refillRate,

                lastRefillTime:
                    Date.now()
            };

        } else {

            bucket =
                JSON.parse(bucket);

            bucket.capacity =
                plan.capacity;

            bucket.refillRate =
                plan.refillRate;

            bucket.tokens =
                Math.min(
                    bucket.tokens,
                    bucket.capacity
                );
        }

        const allowed =
            consumeToken(bucket);

        res.setHeader(
            "X-RateLimit-Limit",
            bucket.capacity
        );

        res.setHeader(
            "X-RateLimit-Remaining",
            bucket.tokens
        );

        await redisClient.set(
            redisKey,
            JSON.stringify(bucket),
            {
                EX: 3600
            }
        );

        if (!allowed) {

            await redisClient.incr(
                "metrics:blocked"
            );

            return res
                .status(429)
                .set(
                    "Retry-After",
                    1
                )
                .json({
                    error:
                        "Too Many Requests"
                });
        }

        await redisClient.incr(
            "metrics:allowed"
        );

        return next();

    } catch (error) {

        console.error(
            "Rate Limiter Error:",
            error
        );

        return res
            .status(500)
            .json({
                error:
                    "Internal Server Error"
            });
    }
};

export default redisRateLimiter;