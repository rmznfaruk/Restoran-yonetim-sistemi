const bcrypt = require("bcrypt");

const createSeedUser = (id, adSoyad, kullaniciAdi, sifre, rol, aktifMi = true) => ({
  id,
  ad_soyad: adSoyad,
  kullanici_adi: kullaniciAdi,
  sifre_hash: bcrypt.hashSync(sifre, 10),
  rol,
  aktif_mi: aktifMi,
  hatali_giris: 0,
  kilit_bitis: null,
  isFallback: true,
});

let fallbackUsers = [
  createSeedUser(1, "Ayse Kaya", "ayse", "Garson123!", "garson", true),
  createSeedUser(2, "Can Yildiz", "can", "Kasiyer123!", "kasiyer", true),
  createSeedUser(3, "Mert Sahin", "mert", "Mutfak123!", "mutfak", false),
];

const publicShape = (user) => ({
  id: user.id,
  ad_soyad: user.ad_soyad,
  kullanici_adi: user.kullanici_adi,
  rol: user.rol,
  aktif_mi: user.aktif_mi,
});

const listFallbackUsers = () => fallbackUsers.map(publicShape);

const findFallbackUserByUsername = (kullaniciAdi) =>
  fallbackUsers.find((user) => user.kullanici_adi === kullaniciAdi) || null;

const findFallbackUserById = (id) =>
  fallbackUsers.find((user) => String(user.id) === String(id)) || null;

const createFallbackUser = async ({ ad_soyad, kullanici_adi, sifre, rol, aktif_mi = true }) => {
  const sifre_hash = await bcrypt.hash(sifre, 10);
  const yeniKullanici = {
    id: Date.now(),
    ad_soyad,
    kullanici_adi,
    sifre_hash,
    rol,
    aktif_mi,
    hatali_giris: 0,
    kilit_bitis: null,
    isFallback: true,
  };

  fallbackUsers = [...fallbackUsers, yeniKullanici];
  return publicShape(yeniKullanici);
};

const updateFallbackUser = (id, updates) => {
  let guncelKullanici = null;

  fallbackUsers = fallbackUsers.map((user) => {
    if (String(user.id) !== String(id)) {
      return user;
    }

    guncelKullanici = {
      ...user,
      ad_soyad: updates.ad_soyad ?? user.ad_soyad,
      rol: updates.rol ?? user.rol,
      aktif_mi: typeof updates.aktif_mi === "boolean" ? updates.aktif_mi : user.aktif_mi,
    };

    return guncelKullanici;
  });

  return guncelKullanici ? publicShape(guncelKullanici) : null;
};

module.exports = {
  createFallbackUser,
  findFallbackUserById,
  findFallbackUserByUsername,
  listFallbackUsers,
  updateFallbackUser,
};
