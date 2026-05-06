import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const rolRenkleri = {
  garson: "pill pill--warning",
  kasiyer: "pill pill--accent",
  mutfak: "pill pill--success",
  yonetici: "pill pill--danger",
};

const bosForm = {
  ad_soyad: "",
  kullanici_adi: "",
  sifre: "",
  rol: "garson",
};

const KullaniciYonetimi = () => {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [yeniKullanici, setYeniKullanici] = useState(bosForm);
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlemeVerisi, setDuzenlemeVerisi] = useState({});
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");
  const token = localStorage.getItem("token");

  const kullaniciListesiniGetir = useCallback(async () => {
    try {
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKullanicilar(response.data);
      setHata("");
    } catch (error) {
      setHata(error.response?.data?.mesaj || "Kullanicilar getirilemedi.");
    }
  }, [token]);

  useEffect(() => {
    kullaniciListesiniGetir();
  }, [kullaniciListesiniGetir]);

  const yeniKullaniciEkle = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/users", yeniKullanici, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setYeniKullanici(bosForm);
      setMesaj("Yeni kullanici basariyla eklendi.");
      setHata("");
      kullaniciListesiniGetir();
    } catch (error) {
      setMesaj("");
      setHata(error.response?.data?.mesaj || "Kullanici eklenemedi.");
    }
  };

  const duzenlemeyiBaslat = (kullanici) => {
    setDuzenlenenId(kullanici.id);
    setDuzenlemeVerisi(kullanici);
    setMesaj("");
    setHata("");
  };

  const kullaniciGuncelle = async (id) => {
    try {
      await axios.patch(`/api/users/${id}`, duzenlemeVerisi, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDuzenlenenId(null);
      setMesaj("Kullanici bilgileri guncellendi.");
      setHata("");
      kullaniciListesiniGetir();
    } catch (error) {
      setMesaj("");
      setHata(error.response?.data?.mesaj || "Kullanici guncellenemedi.");
    }
  };

  const aktifSayisi = kullanicilar.filter((kullanici) => kullanici.aktif_mi).length;

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Personel</p>
          <h1>Kullanici Yonetimi</h1>
          <p>Rolleri, aktiflik durumlarini ve yeni personel kayitlarini tek panelde yonetin.</p>
        </div>
        <div className="header-actions">
          <div className="surface-card">
            <p className="eyebrow">Aktif kullanici</p>
            <div className="metric-value">{aktifSayisi}</div>
          </div>
        </div>
      </section>

      {mesaj ? <div className="info-banner">{mesaj}</div> : null}
      {hata ? <div className="error-banner">{hata}</div> : null}

      <section className="table-grid">
        <article className="surface-card">
          <h3 className="section-title">Personel listesi</h3>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Kullanici Adi</th>
                  <th>Rol</th>
                  <th>Durum</th>
                  <th>Islem</th>
                </tr>
              </thead>
              <tbody>
                {kullanicilar.map((kullanici) => (
                  <tr key={kullanici.id}>
                    <td>
                      {duzenlenenId === kullanici.id ? (
                        <input
                          className="field-input"
                          value={duzenlemeVerisi.ad_soyad}
                          onChange={(e) =>
                            setDuzenlemeVerisi({ ...duzenlemeVerisi, ad_soyad: e.target.value })
                          }
                        />
                      ) : (
                        kullanici.ad_soyad
                      )}
                    </td>
                    <td>{kullanici.kullanici_adi}</td>
                    <td>
                      {duzenlenenId === kullanici.id ? (
                        <select
                          className="field-select"
                          value={duzenlemeVerisi.rol}
                          onChange={(e) =>
                            setDuzenlemeVerisi({ ...duzenlemeVerisi, rol: e.target.value })
                          }
                        >
                          <option value="garson">Garson</option>
                          <option value="kasiyer">Kasiyer</option>
                          <option value="mutfak">Mutfak</option>
                          <option value="yonetici">Yonetici</option>
                        </select>
                      ) : (
                        <span className={rolRenkleri[kullanici.rol] || "pill pill--neutral"}>
                          {kullanici.rol}
                        </span>
                      )}
                    </td>
                    <td>
                      {duzenlenenId === kullanici.id ? (
                        <label className="pill pill--neutral">
                          <input
                            type="checkbox"
                            checked={Boolean(duzenlemeVerisi.aktif_mi)}
                            onChange={(e) =>
                              setDuzenlemeVerisi({
                                ...duzenlemeVerisi,
                                aktif_mi: e.target.checked,
                              })
                            }
                          />
                          Aktif
                        </label>
                      ) : (
                        <span className={kullanici.aktif_mi ? "pill pill--success" : "pill pill--danger"}>
                          {kullanici.aktif_mi ? "Aktif" : "Pasif"}
                        </span>
                      )}
                    </td>
                    <td className="split-actions">
                      {duzenlenenId === kullanici.id ? (
                        <>
                          <button className="action-button" type="button" onClick={() => kullaniciGuncelle(kullanici.id)}>
                            Kaydet
                          </button>
                          <button className="ghost-button" type="button" onClick={() => setDuzenlenenId(null)}>
                            Iptal
                          </button>
                        </>
                      ) : (
                        <button className="ghost-button" type="button" onClick={() => duzenlemeyiBaslat(kullanici)}>
                          Duzenle
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card">
          <p className="eyebrow">Yeni kayit</p>
          <h3>Personel ekle</h3>
          <form className="stack-form" onSubmit={yeniKullaniciEkle}>
            <div>
              <label className="field-label">Ad Soyad</label>
              <input
                className="field-input"
                value={yeniKullanici.ad_soyad}
                onChange={(e) => setYeniKullanici({ ...yeniKullanici, ad_soyad: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Kullanici Adi</label>
              <input
                className="field-input"
                value={yeniKullanici.kullanici_adi}
                onChange={(e) => setYeniKullanici({ ...yeniKullanici, kullanici_adi: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Sifre</label>
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
                <option value="yonetici">Yonetici</option>
              </select>
            </div>
            <button className="action-button" type="submit">
              Kullaniciyi Kaydet
            </button>
          </form>
        </article>
      </section>
    </div>
  );
};

export default KullaniciYonetimi;
