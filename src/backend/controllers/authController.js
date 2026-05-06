const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const { findFallbackUserByUsername } = require("../services/userStore");

const jwtSecret = process.env.JWT_SECRET || "rys_gizli_anahtar";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "8h";
const demoPasswordHash =
  process.env.DEMO_ADMIN_PASSWORD_HASH ||
  bcrypt.hashSync(process.env.DEMO_ADMIN_PASSWORD || "RysAdmin123!", 10);

const hasDatabaseConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_PORT &&
    process.env.DB_NAME &&
    process.env.DB_USER &&
    process.env.DB_PASSWORD
);

const demoUser = {
  id: 0,
  kullanici_adi: process.env.DEMO_ADMIN_USERNAME || "admin",
  sifre_hash: demoPasswordHash,
  rol: process.env.DEMO_ADMIN_ROLE || "yonetici",
  hatali_giris: 0,
  kilit_bitis: null,
  isDemo: true,
};

async function findUser(kullaniciAdi) {
  if (hasDatabaseConfig) {
    try {
      const userResult = await pool.query(
        "SELECT * FROM personel WHERE kullanici_adi = $1",
        [kullaniciAdi]
      );

      if (userResult.rows.length > 0) {
        return userResult.rows[0];
      }
    } catch (error) {
      console.warn(
        "Veritabani kullanici sorgusu basarisiz, demo hesaba geciliyor:",
        error.message
      );
    }
  }

  if (kullaniciAdi === demoUser.kullanici_adi) {
    return demoUser;
  }

  return findFallbackUserByUsername(kullaniciAdi);
}

exports.login = async (req, res) => {
  try {
    const { kullanici_adi: kullaniciAdi, sifre } = req.body;

    if (!kullaniciAdi || !sifre) {
      return res.status(400).json({ mesaj: "Kullanici adi ve sifre zorunludur." });
    }

    const user = await findUser(kullaniciAdi);

    if (!user) {
      return res.status(401).json({ mesaj: "Hatali kullanici adi veya sifre." });
    }

    if (user.hatali_giris >= 5 && user.kilit_bitis && new Date(user.kilit_bitis) > new Date()) {
      return res
        .status(429)
        .json({ mesaj: "Cok fazla hatali deneme. Lutfen 15 dakika bekleyin." });
    }

    const sifreDogruMu = await bcrypt.compare(sifre, user.sifre_hash);

    if (!sifreDogruMu) {
      if (!user.isDemo && hasDatabaseConfig) {
        await pool.query(
          "UPDATE personel SET hatali_giris = hatali_giris + 1 WHERE id = $1",
          [user.id]
        );
      }

      return res.status(401).json({ mesaj: "Hatali kullanici adi veya sifre." });
    }

    if (!user.isDemo && hasDatabaseConfig) {
      await pool.query(
        "UPDATE personel SET hatali_giris = 0, kilit_bitis = NULL WHERE id = $1",
        [user.id]
      );
    }

    const token = jwt.sign(
      { id: user.id, kullaniciAdi: user.kullanici_adi, rol: user.rol },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return res.status(200).json({
      mesaj: user.isDemo
        ? "Giris basarili. Demo yonetici hesabi kullaniliyor."
        : "Giris basarili.",
      token,
      kullanici: {
        id: user.id,
        kullaniciAdi: user.kullanici_adi,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Login hatasi:", error);
    return res.status(500).json({ mesaj: "Sunucu hatasi olustu." });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ mesaj: "Basariyla cikis yapildi." });
};
