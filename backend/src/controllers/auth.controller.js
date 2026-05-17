import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/email.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_sementara";

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Nama pengguna, email, dan kata sandi wajib diisi." });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Kata sandi harus terdiri dari minimal 8 karakter." });
        }
        const userCheck = await query(
            "select * from users where email = $1",
            [email]
        );
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "Alamat email sudah terdaftar." });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        const result = await query(
            `insert into users 
            (username, email, password, is_verified, verification_code, verification_code_expires, verification_code_sent_at) 
            values ($1, $2, $3, false, $4, $5, now()) 
            returning user_id, username, email, is_verified, created_at`,
            [username, email, hashedPassword, verificationCode, verificationCodeExpires]
        );
        await sendVerificationEmail({
            to: email,
            code: verificationCode,
        });
        res.status(201).json({
            message: "Pendaftaran berhasil. Kode verifikasi telah dikirim ke alamat email Anda.",
            user: result.rows[0],
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
        // mencari data pengguna berdasarkan alamat email yang dikirim
        const result = await query("select * from users where email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Email atau kata sandi tidak valid." });
        }
        const user = result.rows[0];
        // komparasi string password mentah dengan hash yang tersimpan di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!user.is_verified) {
            return res.status(403).json({ message: "Email belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu." });
        }
        if (!isMatch) {
            return res.status(401).json({ message: "Email atau kata sandi tidak valid." });
        }
        // pembuatan jwt token baru saat proses login berhasil
        const token = jwt.sign(
            { user_id: user.user_id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Proses masuk berhasil.",
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                is_verified: user.is_verified,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Alamat email wajib diisi." });
        }
        const result = await query(
            "select * from users where email = $1",
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Akun dengan alamat email tersebut tidak ditemukan." });
        }
        const user = result.rows[0];
        if (user.reset_password_sent_at) {
            const lastSentAt = new Date(user.reset_password_sent_at).getTime();
            const now = Date.now();
            const cooldownMs = 2 * 60 * 1000;
            const remainingMs = cooldownMs - (now - lastSentAt);
            if (remainingMs > 0) {
                const remainingSeconds = Math.ceil(remainingMs / 1000);
                return res.status(429).json({
                    message: `Kode reset kata sandi baru dapat dikirim ulang dalam ${remainingSeconds} detik.`,
                    remainingSeconds,
                });
            }
        }
        const resetPasswordCode = generateVerificationCode();
        const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
        await query(
            `update users
             set reset_password_code = $1,
                 reset_password_expires = $2,
                 reset_password_sent_at = now()
             where email = $3`,
            [resetPasswordCode, resetPasswordExpires, email]
        );
        await sendResetPasswordEmail({
            to: email,
            code: resetPasswordCode,
        });
        res.json({
            message: "Kode reset kata sandi telah dikirim ke alamat email Anda.",
        });
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { email, code, newPassword, confirmPassword } = req.body;
        if (!email || !code || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Email, kode reset, kata sandi baru, dan konfirmasi kata sandi wajib diisi.",
            });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "Kata sandi baru harus terdiri dari minimal 8 karakter.",
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Konfirmasi kata sandi tidak sesuai.",
            });
        }
        const result = await query(
            "select * from users where email = $1",
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Akun dengan alamat email tersebut tidak ditemukan.",
            });
        }
        const user = result.rows[0];
        if (!user.reset_password_code || !user.reset_password_expires) {
            return res.status(400).json({
                message: "Kode reset kata sandi tidak tersedia. Silakan minta kode reset baru.",
            });
        }
        if (new Date(user.reset_password_expires) < new Date()) {
            return res.status(400).json({
                message: "Kode reset kata sandi sudah kedaluwarsa. Silakan minta kode reset baru.",
            });
        }
        if (user.reset_password_code !== code) {
            return res.status(400).json({
                message: "Kode reset kata sandi tidak valid.",
            });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await query(
            `update users
             set password = $1,
                 reset_password_code = null,
                 reset_password_expires = null,
                 reset_password_sent_at = null
             where email = $2`,
            [hashedPassword, email]
        );
        res.json({
            message: "Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru Anda.",
        });
    } catch (err) {
        next(err);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ message: "Email dan kode verifikasi wajib diisi." });
        }
        const result = await query(
            "select * from users where email = $1",
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Akun dengan alamat email tersebut tidak ditemukan." });
        }
        const user = result.rows[0];
        if (user.is_verified) {
            return res.status(400).json({ message: "Alamat email sudah diverifikasi." });
        }
        if (!user.verification_code || !user.verification_code_expires) {
            return res.status(400).json({ message: "Kode verifikasi tidak tersedia. Silakan kirim ulang kode verifikasi." });
        }
        if (new Date(user.verification_code_expires) < new Date()) {
            return res.status(400).json({ message: "Kode verifikasi sudah kedaluwarsa. Silakan kirim ulang kode verifikasi." });
        }
        if (user.verification_code !== code) {
            return res.status(400).json({ message: "Kode verifikasi tidak valid." });
        }
        await query(
            `update users 
            set is_verified = true, 
                verification_code = null, 
                verification_code_expires = null 
            where email = $1`,
            [email]
        );
        res.json({ message: "Email berhasil diverifikasi. Silakan masuk menggunakan akun Anda." });
    } catch (err) {
        next(err);
    }
};

export const resendVerificationCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Alamat email wajib diisi." });
        }
        const result = await query(
            "select * from users where email = $1",
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Akun dengan alamat email tersebut tidak ditemukan." });
        }
        const user = result.rows[0];
        if (user.is_verified) {
            return res.status(400).json({ message: "Alamat email sudah diverifikasi." });
        }
        if (user.verification_code_sent_at) {
            const lastSentAt = new Date(user.verification_code_sent_at).getTime();
            const now = Date.now();
            const cooldownMs = 2 * 60 * 1000;
            const remainingMs = cooldownMs - (now - lastSentAt);

            if (remainingMs > 0) {
                const remainingSeconds = Math.ceil(remainingMs / 1000);

                return res.status(429).json({
                    message: `Kode verifikasi baru dapat dikirim ulang dalam ${remainingSeconds} detik.`,
                    remainingSeconds,
                });
            }
        }
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        await query(
            `update users 
            set verification_code = $1, 
                verification_code_expires = $2,
                verification_code_sent_at = now()
            where email = $3`,
            [verificationCode, verificationCodeExpires, email]
        );
        await sendVerificationEmail({
            to: email,
            code: verificationCode,
        });
        res.json({ message: "Kode verifikasi baru telah dikirim ke alamat email Anda." });
    } catch (err) {
        next(err);
    }
};