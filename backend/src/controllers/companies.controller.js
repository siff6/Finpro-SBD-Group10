import { query } from "../config/db.js";

const getCompanies = async (req, res, next) => {
    try {
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "select * from companies where user_id = $1 order by created_at desc",
            [userId]
        );

        return res.json(result.rows);
    } catch (err) {
        return next(err);
    }
};

const getCompanyById = async (req, res, next) => {
    try {
        const userId = req.query.user_id;
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "select * from companies where company_id = $1 and user_id = $2",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const createCompany = async (req, res, next) => {
    try {
        const {
            user_id: userId,
            company_name: companyName,
            website,
            industry,
            location,
            contact,
        } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId || !companyName) {
            return res
                .status(400)
                .json({ message: "user_id and company_name are required" });
        }

        const result = await query(
            "insert into companies (user_id, company_name, website, industry, location, contact) values ($1, $2, $3, $4, $5, $6) returning *",
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
        const { id } = req.params;
        const {
            user_id: userId,
            company_name: companyName,
            website,
            industry,
            location,
            contact,
        } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const existingResult = await query(
            "select * from companies where company_id = $1 and user_id = $2",
            [id, userId]
        );

        if (existingResult.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        const existing = existingResult.rows[0];

        const result = await query(
            "update companies set company_name = $1, website = $2, industry = $3, location = $4, contact = $5 where company_id = $6 and user_id = $7 returning *",
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
        const { id } = req.params;
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "delete from companies where company_id = $1 and user_id = $2 returning *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.json({ message: "Company deleted" });
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
