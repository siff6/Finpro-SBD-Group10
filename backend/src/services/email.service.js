import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async ({ to, code }) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Kode Verifikasi Email Applytics",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
                <h2>Verifikasi Email Applytics</h2>
                <p>Terima kasih telah mendaftar di Applytics.</p>
                <p>Gunakan kode berikut untuk memverifikasi alamat email Anda:</p>
                <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 20px 0;">
                    ${code}
                </div>
                <p>Kode ini berlaku selama 10 menit.</p>
                <p>Jika Anda tidak merasa melakukan pendaftaran, abaikan email ini.</p>
            </div>
        `,
    });
};

export const sendResetPasswordEmail = async ({ to, code }) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Kode Reset Kata Sandi Applytics",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
                <h2>Reset Kata Sandi Applytics</h2>
                <p>Kami menerima permintaan untuk mereset kata sandi akun Applytics Anda.</p>
                <p>Gunakan kode berikut untuk membuat kata sandi baru:</p>
                <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 20px 0;">
                    ${code}
                </div>
                <p>Kode ini berlaku selama 10 menit.</p>
                <p>Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini.</p>
            </div>
        `,
    });
};