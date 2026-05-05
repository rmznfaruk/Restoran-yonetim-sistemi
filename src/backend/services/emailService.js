const nodemailer = require('nodemailer');
require('dotenv').config();

// E-posta gönderici ayarları
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Senin gönderecek mail adresin
        pass: process.env.EMAIL_PASS  // Gmail uygulama şifresi
    }
});

// Stok uyarısı gönderen fonksiyon
const sendStockAlert = async (urunAd, stokMiktar) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL, // Yöneticinin (veya senin) mail adresin
        subject: `⚠️ RYS Kritik Stok Uyarısı: ${urunAd}`,
        text: `Dikkat! Restorandaki "${urunAd}" isimli ürünün stoğu kritik seviyeye düştü.\n\nMevcut stok: ${stokMiktar}\n\nLütfen en kısa sürede tedarik sağlayın.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[E-posta Servisi] Stok uyarısı başarıyla gönderildi: ${urunAd}`);
    } catch (error) {
        console.error('[E-posta Servisi] Gönderim hatası:', error);
    }
};

module.exports = { sendStockAlert };