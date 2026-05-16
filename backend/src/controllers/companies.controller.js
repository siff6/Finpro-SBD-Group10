import { query } from "../config/db.js";

const getUserIdFromToken = (req) => {
    return req.user?.user_id || req.user?.id || req.user?.sub;
};

const getCompanies = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const result = await query(
            `
            select
                company_id,
                user_id,
                company_name,
                website,
                industry,
                location,
                contact,
                created_at
            from companies
            where user_id = $1
            order by created_at desc
            `,
            [userId]
        );

        return res.json(result.rows);
    } catch (err) {
        return next(err);
    }
};

const getCompanyById = async (req, res, next) => {
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
                company_id,
                user_id,
                company_name,
                website,
                industry,
                location,
                contact,
                created_at
            from companies
            where company_id = $1 and user_id = $2
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Perusahaan tidak ditemukan.",
            });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const createCompany = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const {
            company_name: companyName,
            website,
            industry,
            location,
            contact,
        } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Nama perusahaan wajib diisi.",
            });
        }

        const result = await query(
            `
            insert into companies
                (user_id, company_name, website, industry, location, contact)
            values
                ($1, $2, $3, $4, $5, $6)
            returning
                company_id,
                user_id,
                company_name,
                website,
                industry,
                location,
                contact,
                created_at
            `,
            [
                userId,
                companyName,
                website || "",
                industry || null,
                location || null,
                contact || null,
            ]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const updateCompany = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req);
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Sesi login tidak valid. Silakan login ulang.",
            });
        }

        const {
            company_name: companyName,
            website,
            industry,
            location,
            contact,
        } = req.body;

        const existingResult = await query(
            `
            select *
            from companies
            where company_id = $1 and user_id = $2
            `,
            [id, userId]
        );

        if (existingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Perusahaan tidak ditemukan.",
            });
        }

        const existing = existingResult.rows[0];

        const result = await query(
            `
            update companies
            set
                company_name = $1,
                website = $2,
                industry = $3,
                location = $4,
                contact = $5
            where company_id = $6 and user_id = $7
            returning
                company_id,
                user_id,
                company_name,
                website,
                industry,
                location,
                contact,
                created_at
            `,
            [
                companyName ?? existing.company_name,
                website ?? existing.website,
                industry ?? existing.industry,
                location ?? existing.location,
                contact ?? existing.contact,
                id,
                userId,
            ]
        );

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const deleteCompany = async (req, res, next) => {
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
            delete from companies
            where company_id = $1 and user_id = $2
            returning *
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Perusahaan tidak ditemukan.",
            });
        }

        return res.json({
            message: "Perusahaan berhasil dihapus.",
        });
    } catch (err) {
        return next(err);
    }
};

export {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
};