const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const { kullanici_adi, sifre } = req.body;

        // 1. Kullanıcı adı ve şifre girilmiş mi kontrolü
        if (!kullanici_adi || !sifre) {
            return res.status(400).json({ mesaj: "Kullanıcı adı ve şifre zorunludur." });
        }

        // 2. Kullanıcıyı veritabanında bul
        const userResult = await pool.query('SELECT * FROM personel WHERE kullanici_adi = $1', [kullanici_adi]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ mesaj: "Hatalı kullanıcı adı veya şifre." });
        }

        const user = userResult.rows[0];

        // 3. Kilit kontrolü (5 hatalı giriş ve 15 dakika kuralı)
        if (user.hatali_giris >= 5 && user.kilit_bitis > new Date()) {
            return res.status(429).json({ mesaj: "Çok fazla hatalı deneme. Lütfen 15 dakika bekleyin." });
        }

        // 4. BCrypt ile şifre doğrulama
        const sifreDogruMu = await bcrypt.compare(sifre, user.sifre_hash);

        if (!sifreDogruMu) {
            // Hatalı giriş sayacını artır
            // await pool.query('UPDATE personel SET hatali_giris = hatali_giris + 1 WHERE id = $1', [user.id]);
            return res.status(401).json({ mesaj: "Hatalı kullanıcı adı veya şifre." });
        }

        // 5. Başarılı Giriş: Sayacı sıfırla
        // await pool.query('UPDATE personel SET hatali_giris = 0, kilit_bitis = NULL WHERE id = $1', [user.id]);

        // 6. JWT Token Üretimi
        const token = jwt.sign(
            { id: user.id, kullaniciAdi: user.kullanici_adi, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Başarılı yanıt
        res.status(200).json({
            mesaj: "Giriş başarılı.",
            token,
            kullanici: {
                kullaniciAdi: user.kullanici_adi,
                rol: user.rol
            }
        });
        */

        res.status(501).json({ mesaj: "Veritabanı bağlantısı bekleniyor. Kod altyapısı hazır." });

    } catch (error) {
        console.error("Login Hatası:", error);
        res.status(500).json({ mesaj: "Sunucu hatası oluştu." });
    }
};

exports.logout = (req, res) => {
    // Client tarafı (React) token'ı sileceği için backend'de sadece başarılı mesajı dönüyoruz
    res.status(200).json({ mesaj: "Başarıyla çıkış yapıldı." });
};