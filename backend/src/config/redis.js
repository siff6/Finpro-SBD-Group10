import { createClient } from "redis";

const redisClient = createClient(
    process.env.REDIS_URL ? { url: process.env.REDIS_URL } : {}
);

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

const connectRedis = async () => {
    if (redisClient.isOpen) {
        return;
    }

    try {
        await redisClient.connect();
        console.log("Redis connected");
    } catch (err) {
        console.error("Redis connection failed:", err);
    }
};

export { redisClient, connectRedis };
