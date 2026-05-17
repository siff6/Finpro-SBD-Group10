import {
    getSummary,
    getStatusCount,
    getMonthlyProgress,
} from "../services/dashboard.service.js";
import {
    getCache,
    setCache,
} from "../services/cache.service.js";
import {
    dashboardSummaryKey,
    dashboardStatusCountKey,
    dashboardMonthlyProgressKey,
} from "../utils/cacheKeys.js";

const CACHE_TTL_SECONDS = 300;

const getUserIdFromToken = (req) => {
    return req.user?.user_id || req.user?.id || req.user?.sub;
};

const getDashboardSummary = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const cacheKey = dashboardSummaryKey(userId);
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.json(cached);
        }

        const summary = await getSummary(userId);
        await setCache(cacheKey, summary, CACHE_TTL_SECONDS);

        return res.json(summary);
    } catch (err) {
        return next(err);
    }
};

const getDashboardStatusCount = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const cacheKey = dashboardStatusCountKey(userId);
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.json(cached);
        }

        const statusCount = await getStatusCount(userId);
        await setCache(cacheKey, statusCount, CACHE_TTL_SECONDS);

        return res.json(statusCount);
    } catch (err) {
        return next(err);
    }
};

const getDashboardMonthlyProgress = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const cacheKey = dashboardMonthlyProgressKey(userId);
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.json(cached);
        }

        const monthlyProgress = await getMonthlyProgress(userId);
        await setCache(cacheKey, monthlyProgress, CACHE_TTL_SECONDS);

        return res.json(monthlyProgress);
    } catch (err) {
        return next(err);
    }
};

export {
    getDashboardSummary,
    getDashboardStatusCount,
    getDashboardMonthlyProgress,
};