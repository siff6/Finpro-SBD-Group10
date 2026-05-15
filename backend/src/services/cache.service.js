import { redisClient } from "../config/redis.js";
import {
    dashboardSummaryKey,
    dashboardStatusCountKey,
    dashboardMonthlyProgressKey,
} from "../utils/cacheKeys.js";

const getCache = async (key) => {
    if (!redisClient.isOpen) {
        return null;
    }

    try {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    } catch (err) {
        console.error("Redis get error:", err);
        return null;
    }
};

const setCache = async (key, value, ttlSeconds) => {
    if (!redisClient.isOpen) {
        return;
    }

    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: ttlSeconds,
        });
    } catch (err) {
        console.error("Redis set error:", err);
    }
};

const deleteCache = async (key) => {
    if (!redisClient.isOpen) {
        return;
    }

    try {
        await redisClient.del(key);
    } catch (err) {
        console.error("Redis delete error:", err);
    }
};

const invalidateDashboardCache = async (userId) => {
    if (!userId) {
        return;
    }

    await deleteCache(dashboardSummaryKey(userId));
    await deleteCache(dashboardStatusCountKey(userId));
    await deleteCache(dashboardMonthlyProgressKey(userId));
};

export { getCache, setCache, invalidateDashboardCache };
