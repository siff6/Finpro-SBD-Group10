import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_sementara";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Akses ditolak. Anda harus melakukan otentikasi terlebih dahulu." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // nyimpen data user_id ke dalem req biar bisa dipake di controller nanti
        next();
    } catch (err) {
        return res.status(401).json({ message: "Sesi token tidak valid atau telah kedaluwarsa." });
    }
};