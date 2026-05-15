const dashboardSummaryKey = (userId) => `dashboard:summary:${userId}`;
const dashboardStatusCountKey = (userId) =>
    `dashboard:status-count:${userId}`;
const dashboardMonthlyProgressKey = (userId) =>
    `dashboard:monthly-progress:${userId}`;

export {
    dashboardSummaryKey,
    dashboardStatusCountKey,
    dashboardMonthlyProgressKey,
};
