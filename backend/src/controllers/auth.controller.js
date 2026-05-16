import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_sementara";

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, dan kata sandi wajib diisi seluruhnya." });
        }
        // ngecek emailnya udah pernah dipake daftar belum
        const userExists = await query("select * from users where email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Email ini telah terdaftar. Silakan gunakan email lain atau lakukan proses masuk (login)." });
        }
        // ngacak passwordnya biar aman banget (di-hash)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // masukin data user baru ke database
        const result = await query(
            "insert into users (username, email, password) values ($1, $2, $3) returning user_id, username, email, created_at",
            [username, email, hashedPassword]
        );
        const newUser = result.rows[0];
        // buatin tiket masuk (token)
        const token = jwt.sign({ user_id: newUser.user_id }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            message: "Pendaftaran berhasil.",
            token,
            user: newUser
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email dan kata sandi wajib diisi." });
        }
        // cari usernya di database berdasarkan email
        const result = await query("select * from users where email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Email atau kata sandi tidak valid." });
        }
        const user = result.rows[0];
        // cocokin password ketikan user sama password yang udah di-hash di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email atau kata sandi tidak valid." });
        }
        // kalo bener, buatin tiket masuk (token)
        const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: "7d" });
        // ilangin password dari respon balikan biar ngga bocor
        delete user.password;
        res.json({
            message: "Proses masuk berhasil.",
            token,
            user
        });
    } catch (err) {
        next(err);
    }
};