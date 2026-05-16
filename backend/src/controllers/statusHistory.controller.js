import { query } from "../config/db.js";
import { invalidateDashboardCache } from "../services/cache.service.js";

const getStatusHistory = async (req, res, next) => {
    try {
        const userId = req.query.user_id;
        const { application_id: applicationId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "select h.* from application_status_history h join job_applications a on a.application_id = h.application_id where h.application_id = $1 and a.user_id = $2 order by h.changed_at desc",
            [applicationId, userId]
        );

        return res.json(result.rows);
    } catch (err) {
        return next(err);
    }
};

const updateApplicationStatus = async (req, res, next) => {
    try {
        const { application_id: applicationId } = req.params;
        const { user_id: userId, status, note } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId || !status) {
            return res
                .status(400)
                .json({ message: "user_id and status are required" });
        }

        const existingResult = await query(
            "select status from job_applications where application_id = $1 and user_id = $2",
            [applicationId, userId]
        );

        if (existingResult.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        const oldStatus = existingResult.rows[0].status;

        const updateResult = await query(
            "update job_applications set status = $1, updated_at = now() where application_id = $2 and user_id = $3 returning *",
            [status, applicationId, userId]
        );

        await query(
            "insert into application_status_history (application_id, old_status, new_status, note) values ($1, $2, $3, $4)",
            [applicationId, oldStatus, status, note || "Status changed"]
        );

        await invalidateDashboardCache(userId);

        return res.json(updateResult.rows[0]);
    } catch (err) {
        return next(err);
    }
};

export { getStatusHistory, updateApplicationStatus };
