import { query } from "../config/db.js";

const getSummary = async (userId) => {
    const totalResult = await query(
        "select count(*)::int as total from job_applications where user_id = $1",
        [userId]
    );

    const statusResult = await query(
        "select status, count(*)::int as count from job_applications where user_id = $1 group by status",
        [userId]
    );

    const statusCounts = statusResult.rows.reduce((acc, row) => {
        acc[row.status] = row.count;
        return acc;
    }, {});

    const total = totalResult.rows[0]?.total || 0;
    const interviewed = statusCounts.Interviewed || 0;
    const rejected = statusCounts.Rejected || 0;
    const accepted = statusCounts.Accepted || 0;
    const offers = statusCounts.Offer || 0;
    const responses = interviewed + rejected + accepted + offers;
    const responseRate = total === 0 ? 0 : responses / total;

    return {
        total,
        interviewed,
        rejected,
        accepted,
        offers,
        response_rate: responseRate,
    };
};

const getStatusCount = async (userId) => {
    const result = await query(
        "select status, count(*)::int as count from job_applications where user_id = $1 group by status",
        [userId]
    );

    return result.rows;
};

const getMonthlyProgress = async (userId) => {
    const result = await query(
        "select date_trunc('month', application_date)::date as month, count(*)::int as total from job_applications where user_id = $1 group by month order by month",
        [userId]
    );

    return result.rows;
};

export { getSummary, getStatusCount, getMonthlyProgress };
