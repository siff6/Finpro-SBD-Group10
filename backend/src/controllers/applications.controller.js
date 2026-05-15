import { query } from "../config/db.js";
import { invalidateDashboardCache } from "../services/cache.service.js";

const getApplications = async (req, res, next) => {
    try {
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "select * from job_applications where user_id = $1 order by created_at desc",
            [userId]
        );

        return res.json(result.rows);
    } catch (err) {
        return next(err);
    }
};

const getApplicationById = async (req, res, next) => {
    try {
        const userId = req.query.user_id;
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "select * from job_applications where application_id = $1 and user_id = $2",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const createApplication = async (req, res, next) => {
    try {
        const {
            user_id: userId,
            company_id: companyId,
            position,
            status,
            application_date: applicationDate,
            salary,
            job_type: jobType,
            source,
        } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId || !companyId || !position) {
            return res
                .status(400)
                .json({ message: "user_id, company_id, and position are required" });
        }

        const result = await query(
            "insert into job_applications (user_id, company_id, position, status, application_date, salary, job_type, source) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *",
            [
                userId,
                companyId,
                position,
                status || "Applied",
                applicationDate || new Date(),
                salary ?? 0,
                jobType || "Full-time",
                source || null,
            ]
        );

        const created = result.rows[0];

        await query(
            "insert into application_status_history (application_id, old_status, new_status, note) values ($1, $2, $3, $4)",
            [created.application_id, null, created.status, "Initial status"]
        );

        await invalidateDashboardCache(userId);

        return res.status(201).json(created);
    } catch (err) {
        return next(err);
    }
};

const updateApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            user_id: userId,
            company_id: companyId,
            position,
            status,
            application_date: applicationDate,
            salary,
            job_type: jobType,
            source,
        } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const existingResult = await query(
            "select status from job_applications where application_id = $1 and user_id = $2",
            [id, userId]
        );

        if (existingResult.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        const oldStatus = existingResult.rows[0].status;

        const updateResult = await query(
            "update job_applications set company_id = $1, position = $2, status = $3, application_date = $4, salary = $5, job_type = $6, source = $7, updated_at = now() where application_id = $8 and user_id = $9 returning *",
            [
                companyId,
                position,
                status,
                applicationDate,
                salary,
                jobType,
                source,
                id,
                userId,
            ]
        );

        const updated = updateResult.rows[0];

        if (status && status !== oldStatus) {
            await query(
                "insert into application_status_history (application_id, old_status, new_status, note) values ($1, $2, $3, $4)",
                [id, oldStatus, status, "Status changed"]
            );
        }

        await invalidateDashboardCache(userId);

        return res.json(updated);
    } catch (err) {
        return next(err);
    }
};

const deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "delete from job_applications where application_id = $1 and user_id = $2 returning *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        await invalidateDashboardCache(userId);

        return res.json({ message: "Application deleted" });
    } catch (err) {
        return next(err);
    }
};

export {
    getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
};
