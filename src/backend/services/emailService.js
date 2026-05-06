const nodemailer = require("nodemailer");
require("dotenv").config();

const hasEmailConfig = Boolean(
  process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.ADMIN_EMAIL
);

const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

const sendStockAlert = async (urunAd, stokMiktar) => {
  if (!transporter) {
    console.warn("E-posta ayarlari eksik, stok uyarisi log olarak birakildi:", urunAd, stokMiktar);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `RYS Kritik Stok Uyarisi: ${urunAd}`,
    text:
      `Dikkat! "${urunAd}" urununun stogu kritik seviyeye dustu.\n\n` +
      `Mevcut stok: ${stokMiktar}\n\n` +
      "Lutfen en kisa surede tedarik saglayin.",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[E-posta Servisi] Stok uyarisi gonderildi: ${urunAd}`);
  } catch (error) {
    console.error("[E-posta Servisi] Gonderim hatasi:", error);
  }
};

module.exports = { sendStockAlert };
