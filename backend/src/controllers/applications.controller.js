import { query } from "../config/db.js";
import { invalidateDashboardCache } from "../services/cache.service.js";

const getUserIdFromToken = (req) => {
    return req.user?.user_id || req.user?.id || req.user?.sub;
};

const getApplications = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const { search, status, job_type: jobType, source } = req.query;

        const values = [userId];

        let whereClause = "where ja.user_id = $1";

        if (search) {
            values.push(`%${search}%`);
            whereClause += ` and (
                c.company_name ilike $${values.length}
                or ja.position ilike $${values.length}
                or ja.status ilike $${values.length}
                or ja.job_type ilike $${values.length}
                or ja.source ilike $${values.length}
            )`;
        }

        if (status) {
            values.push(status);
            whereClause += ` and ja.status = $${values.length}`;
        }

        if (jobType) {
            values.push(jobType);
            whereClause += ` and ja.job_type = $${values.length}`;
        }

        if (source) {
            values.push(source);
            whereClause += ` and ja.source = $${values.length}`;
        }

        const result = await query(
            `
            select
                ja.application_id,
                ja.user_id,
                ja.company_id,
                c.company_name,
                ja.position,
                ja.status,
                ja.application_date,
                ja.salary,
                ja.job_type,
                ja.source,
                ja.created_at,
                ja.updated_at
            from job_applications ja
            join companies c on c.company_id = ja.company_id
            ${whereClause}
            order by ja.created_at desc
            `,
            values
        );

        return res.json(result.rows);
    } catch (err) {
        return next(err);
    }
};

const getApplicationById = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const result = await query(
            `
            select
                ja.application_id,
                ja.user_id,
                ja.company_id,
                c.company_name,
                ja.position,
                ja.status,
                ja.application_date,
                ja.salary,
                ja.job_type,
                ja.source,
                ja.created_at,
                ja.updated_at
            from job_applications ja
            join companies c on c.company_id = ja.company_id
            where ja.application_id = $1 and ja.user_id = $2
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Lamaran tidak ditemukan." });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const createApplication = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const {
            company_id: companyId,
            position,
            status,
            application_date: applicationDate,
            salary,
            job_type: jobType,
            source,
        } = req.body;

        if (!companyId || !position) {
            return res.status(400).json({
                message: "Perusahaan dan posisi wajib diisi.",
            });
        }

        const result = await query(
            `
            insert into job_applications
                (user_id, company_id, position, status, application_date, salary, job_type, source)
            values
                ($1, $2, $3, $4, $5, $6, $7, $8)
            returning *
            `,
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
            `
            insert into application_status_history
                (application_id, old_status, new_status, note)
            values
                ($1, $2, $3, $4)
            `,
            [created.application_id, null, created.status, "Status awal lamaran"]
        );

        await invalidateDashboardCache(userId);

        return res.status(201).json(created);
    } catch (err) {
        return next(err);
    }
};

const updateApplication = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const {
            company_id: companyId,
            position,
            status,
            application_date: applicationDate,
            salary,
            job_type: jobType,
            source,
        } = req.body;

        const existingResult = await query(
            `
            select status
            from job_applications
            where application_id = $1 and user_id = $2
            `,
            [id, userId]
        );

        if (existingResult.rows.length === 0) {
            return res.status(404).json({ message: "Lamaran tidak ditemukan." });
        }

        const oldStatus = existingResult.rows[0].status;

        const updateResult = await query(
            `
            update job_applications
            set
                company_id = $1,
                position = $2,
                status = $3,
                application_date = $4,
                salary = $5,
                job_type = $6,
                source = $7,
                updated_at = now()
            where application_id = $8 and user_id = $9
            returning *
            `,
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
                `
                insert into application_status_history
                    (application_id, old_status, new_status, note)
                values
                    ($1, $2, $3, $4)
                `,
                [id, oldStatus, status, "Status lamaran diperbarui"]
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
        const userId = getUserIdFromToken(req);
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const result = await query(
            `
            delete from job_applications
            where application_id = $1 and user_id = $2
            returning *
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Lamaran tidak ditemukan." });
        }

        await invalidateDashboardCache(userId);

        return res.json({ message: "Lamaran berhasil dihapus." });
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