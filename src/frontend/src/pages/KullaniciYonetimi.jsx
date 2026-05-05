import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const rolRenkleri = {
  garson: "pill pill--warning",
  kasiyer: "pill pill--neutral",
  mutfak: "pill pill--danger",
  yonetici: "pill pill--success",
};

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
      console.error("Kullanıcılar getirilemedi", err);
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
      console.error("Kullanıcı eklenemedi", err);
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
      console.error("Güncelleme hatası", err);
    }
  };

  const aktifSayisi = kullanicilar.filter((k) => k.aktif_mi).length;

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Personel</p>
          <h1>Kullanıcı Yönetimi</h1>
          <p>Yetki, durum ve temel personel kayıtlarını tek panelde yönetin.</p>
        </div>
        <div className="header-actions">
          <div className="surface-card">
            <p className="eyebrow">Aktif kullanıcı</p>
            <div className="metric-value">{aktifSayisi}</div>
          </div>
        </div>
      </section>

      <section className="table-grid">
        <article className="surface-card">
          <h3 className="section-title">Personel listesi</h3>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Kullanıcı Adı</th>
                  <th>Rol</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {kullanicilar.map((k) => (
                  <tr key={k.id}>
                    <td>
                      {duzenlenenId === k.id ? (
                        <input
                          className="field-input"
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
                          className="field-select"
                          value={duzenlemeVerisi.rol}
                          onChange={(e) => setDuzenlemeVerisi({ ...duzenlemeVerisi, rol: e.target.value })}
                        >
                          <option value="garson">Garson</option>
                          <option value="kasiyer">Kasiyer</option>
                          <option value="mutfak">Mutfak</option>
                          <option value="yonetici">Yönetici</option>
                        </select>
                      ) : (
                        <span className={rolRenkleri[k.rol] || "pill pill--neutral"}>{k.rol}</span>
                      )}
                    </td>
                    <td>
                      {duzenlenenId === k.id ? (
                        <label className="pill pill--neutral">
                          <input
                            type="checkbox"
                            checked={duzenlemeVerisi.aktif_mi}
                            onChange={(e) => setDuzenlemeVerisi({ ...duzenlemeVerisi, aktif_mi: e.target.checked })}
                          />
                          Aktif
                        </label>
                      ) : (
                        <span className={k.aktif_mi ? "pill pill--success" : "pill pill--danger"}>
                          {k.aktif_mi ? "Aktif" : "Pasif"}
                        </span>
                      )}
                    </td>
                    <td>
                      {duzenlenenId === k.id ? (
                        <button className="action-button" onClick={() => kullaniciGuncelle(k.id)}>Kaydet</button>
                      ) : (
                        <button className="ghost-button" onClick={() => duzenlemeyiBaslat(k)}>Düzenle</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card">
          <p className="eyebrow">Yeni kayıt</p>
          <h3>Personel ekle</h3>
          <form className="stack-form" onSubmit={yeniKullaniciEkle}>
            <div>
              <label className="field-label">Ad Soyad</label>
              <input
                className="field-input"
                type="text"
                value={yeniKullanici.ad_soyad}
                onChange={(e) => setYeniKullanici({ ...yeniKullanici, ad_soyad: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Kullanıcı Adı</label>
              <input
                className="field-input"
                type="text"
                value={yeniKullanici.kullanici_adi}
                onChange={(e) => setYeniKullanici({ ...yeniKullanici, kullanici_adi: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Şifre</label>
              <input
                className="field-input"
                type="password"
                value={yeniKullanici.sifre}
                onChange={(e) => setYeniKullanici({ ...yeniKullanici, sifre: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Rol</label>
              <select
                className="field-select"
                value={yeniKullanici.rol}
                onChange={(e) => setYeniKullanici({ ...yeniKullanici, rol: e.target.value })}
              >
                <option value="garson">Garson</option>
                <option value="kasiyer">Kasiyer</option>
                <option value="mutfak">Mutfak</option>
                <option value="yonetici">Yönetici</option>
              </select>
            </div>
            <button className="action-button" type="submit">Kullanıcıyı Kaydet</button>
          </form>
        </article>
      </section>
    </div>
  );
};

export default KullaniciYonetimi;
