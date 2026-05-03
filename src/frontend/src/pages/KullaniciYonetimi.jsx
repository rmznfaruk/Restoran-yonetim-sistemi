import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const KullaniciYonetimi = () => {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [yeniKullanici, setYeniKullanici] = useState({
    ad_soyad: "",
    kullanici_adi: "",
    sifre: "",
    rol: "garson",
  });
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlemeVerisi, setDuzenlemeVerisi] = useState({});

  const token = localStorage.getItem("token");

  const kullaniciListesiniGetir = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKullanicilar(res.data);
    } catch (err) {
      console.error("Kullanicilar getirilemedi", err);
    }
  }, [token]);

  useEffect(() => {
    kullaniciListesiniGetir();
  }, [kullaniciListesiniGetir]);

  const yeniKullaniciEkle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/users", yeniKullanici, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setYeniKullanici({ ad_soyad: "", kullanici_adi: "", sifre: "", rol: "garson" });
      kullaniciListesiniGetir();
    } catch (err) {
      console.error("Kullanici eklenemedi", err);
    }
  };

  const duzenlemeyiBaslat = (kullanici) => {
    setDuzenlenenId(kullanici.id);
    setDuzenlemeVerisi(kullanici);
  };

  const kullaniciGuncelle = async (id) => {
    try {
      await axios.patch(`http://localhost:3001/api/users/${id}`, duzenlemeVerisi, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDuzenlenenId(null);
      kullaniciListesiniGetir();
    } catch (err) {
      console.error("Guncelleme hatasi", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Kullanici Yonetimi</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Kullanici Adi</th>
            <th>Rol</th>
            <th>Durum</th>
            <th>Islemler</th>
          </tr>
        </thead>
        <tbody>
          {kullanicilar.map((k) => (
            <tr key={k.id}>
              <td>
                {duzenlenenId === k.id ? (
                  <input
                    type="text"
                    value={duzenlemeVerisi.ad_soyad}
                    onChange={(e) => setDuzenlemeVerisi({ ...duzenlemeVerisi, ad_soyad: e.target.value })}
                  />
                ) : (
                  k.ad_soyad
                )}
              </td>
              <td>{k.kullanici_adi}</td>
              <td>
                {duzenlenenId === k.id ? (
                  <select
                    value={duzenlemeVerisi.rol}
                    onChange={(e) => setDuzenlemeVerisi({ ...duzenlemeVerisi, rol: e.target.value })}
                  >
                    <option value="garson">Garson</option>
                    <option value="kasiyer">Kasiyer</option>
                    <option value="mutfak">Mutfak</option>
                    <option value="yonetici">Yonetici</option>
                  </select>
                ) : (
                  k.rol
                )}
              </td>
              <td>
                {duzenlenenId === k.id ? (
                  <input
                    type="checkbox"
                    checked={duzenlemeVerisi.aktif_mi}
                    onChange={(e) => setDuzenlemeVerisi({ ...duzenlemeVerisi, aktif_mi: e.target.checked })}
                  />
                ) : (
                  k.aktif_mi ? "Aktif" : "Pasif"
                )}
              </td>
              <td>
                {duzenlenenId === k.id ? (
                  <button onClick={() => kullaniciGuncelle(k.id)}>Kaydet</button>
                ) : (
                  <button onClick={() => duzenlemeyiBaslat(k)}>Duzenle</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Yeni Kullanici Ekle</h3>
      <form onSubmit={yeniKullaniciEkle} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={yeniKullanici.ad_soyad}
          onChange={(e) => setYeniKullanici({ ...yeniKullanici, ad_soyad: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Kullanici Adi"
          value={yeniKullanici.kullanici_adi}
          onChange={(e) => setYeniKullanici({ ...yeniKullanici, kullanici_adi: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Sifre"
          value={yeniKullanici.sifre}
          onChange={(e) => setYeniKullanici({ ...yeniKullanici, sifre: e.target.value })}
          required
        />
        <select value={yeniKullanici.rol} onChange={(e) => setYeniKullanici({ ...yeniKullanici, rol: e.target.value })}>
          <option value="garson">Garson</option>
          <option value="kasiyer">Kasiyer</option>
          <option value="mutfak">Mutfak</option>
          <option value="yonetici">Yonetici</option>
        </select>
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default KullaniciYonetimi;
