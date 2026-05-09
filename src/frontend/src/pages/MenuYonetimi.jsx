import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const varsayilanForm = {
  ad: "",
  fiyat: "",
  kategori: "Ana Yemek",
  stok: 0,
};

const urunBicimlendir = (urun) => ({
  ...urun,
  kategori: urun.kategori || urun.kategori_adi || "Belirtilmedi",
  stok: Number(urun.stok ?? urun.stok_miktar ?? 0),
  fiyat: Number(urun.fiyat ?? 0),
});

const urunStokDurumu = (stok) => {
  if (stok === 0) {
    return { label: "Tukendi", className: "pill pill--danger" };
  }

  if (stok < 10) {
    return { label: `Kritik (${stok})`, className: "pill pill--warning" };
  }

  return { label: `Yeterli (${stok})`, className: "pill pill--success" };
};

const MenuYonetimi = () => {
  const [urunler, setUrunler] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [yeniUrun, setYeniUrun] = useState(varsayilanForm);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let aktif = true;

    const urunleriGetir = async () => {
      try {
        const response = await axios.get("/api/products", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!aktif) {
          return;
        }

        setUrunler((response.data || []).map(urunBicimlendir));
        setHata("");
      } catch (err) {
        if (!aktif) {
          return;
        }

        console.error("Urunler alinamadi:", err);
        setHata("Urun listesi alinamadi. Backend baglantisini kontrol edin.");
      }
    };

    urunleriGetir();

    return () => {
      aktif = false;
    };
  }, [token]);

  const istatistikler = useMemo(
    () => ({
      toplam: urunler.length,
      kritik: urunler.filter((urun) => urun.stok > 0 && urun.stok < 10).length,
      tukenen: urunler.filter((urun) => urun.stok === 0).length,
    }),
    [urunler]
  );

  const urunEkle = async (e) => {
    e.preventDefault();

    try {
      setYukleniyor(true);
      setHata("");
      setMesaj("");

      const payload = {
        ad: yeniUrun.ad.trim(),
        fiyat: Number(yeniUrun.fiyat),
        kategori: yeniUrun.kategori,
        stok: Number(yeniUrun.stok),
      };

      const response = await axios.post("/api/products", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setUrunler((onceki) => [...onceki, urunBicimlendir(response.data)]);
      setYeniUrun(varsayilanForm);
      setModalAcik(false);
      setMesaj("Urun basariyla kaydedildi.");
    } catch (err) {
      console.error("Urun eklenemedi:", err);
      setHata(err.response?.data?.error || "Urun veritabanina kaydedilemedi.");
    } finally {
      setYukleniyor(false);
    }
  };

  const urunSil = async (id) => {
    if (!window.confirm("Bu urunu silmek istediginize emin misiniz?")) {
      return;
    }

    try {
      setHata("");
      setMesaj("");

      await axios.delete(`/api/products/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setUrunler((onceki) => onceki.filter((urun) => urun.id !== id));
      setMesaj("Urun listeden silindi.");
    } catch (err) {
      console.error("Urun silinemedi:", err);
      setHata(err.response?.data?.error || "Silme islemi basarisiz oldu.");
    }
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Menu akisi</p>
          <h1>Menu Yonetimi</h1>
          <p>Kategori, fiyat ve stok gorunumunu tek bakista izleyin.</p>
        </div>
        <div className="header-actions">
          <button className="action-button" type="button" onClick={() => setModalAcik(true)}>
            Yeni Urun Ekle
          </button>
        </div>
      </section>

      {mesaj ? <div className="info-banner">{mesaj}</div> : null}
      {hata ? <div className="error-banner">{hata}</div> : null}

      <section className="stats-grid">
        <article className="surface-card">
          <p className="eyebrow">Toplam urun</p>
          <div className="metric-value">{istatistikler.toplam}</div>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Kritik stok</p>
          <div className="metric-value">{istatistikler.kritik}</div>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Tukenen urun</p>
          <div className="metric-value">{istatistikler.tukenen}</div>
        </article>
      </section>

      <article className="surface-card">
        <h3 className="section-title">Urun listesi</h3>
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Urun</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>Islem</th>
              </tr>
            </thead>
            <tbody>
              {urunler.map((urun) => {
                const stok = urunStokDurumu(urun.stok);

                return (
                  <tr key={urun.id}>
                    <td>{urun.ad}</td>
                    <td>
                      <span className="pill pill--neutral">{urun.kategori}</span>
                    </td>
                    <td>{urun.fiyat} TL</td>
                    <td>
                      <span className={stok.className}>{stok.label}</span>
                    </td>
                    <td className="split-actions">
                      <button className="ghost-button" type="button" disabled>
                        Duzenle
                      </button>
                      <button className="action-button" type="button" onClick={() => urunSil(urun.id)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      {modalAcik ? (
        <section className="surface-card">
          <p className="eyebrow">Hizli ekleme</p>
          <h3>Yeni urun olustur</h3>
          <form className="stack-form" onSubmit={urunEkle}>
            <div>
              <label className="field-label">Urun adi</label>
              <input
                className="field-input"
                value={yeniUrun.ad}
                onChange={(e) => setYeniUrun({ ...yeniUrun, ad: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Kategori</label>
              <select
                className="field-select"
                value={yeniUrun.kategori}
                onChange={(e) => setYeniUrun({ ...yeniUrun, kategori: e.target.value })}
              >
                <option value="Ana Yemek">Ana Yemek</option>
                <option value="Corba">Corba</option>
                <option value="Tatli">Tatli</option>
                <option value="Icecek">Icecek</option>
              </select>
            </div>
            <div>
              <label className="field-label">Fiyat</label>
              <input
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                value={yeniUrun.fiyat}
                onChange={(e) => setYeniUrun({ ...yeniUrun, fiyat: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Stok adedi</label>
              <input
                className="field-input"
                type="number"
                min="0"
                value={yeniUrun.stok}
                onChange={(e) => setYeniUrun({ ...yeniUrun, stok: parseInt(e.target.value, 10) || 0 })}
                required
              />
            </div>
            <div className="split-actions">
              <button className="action-button" type="submit" disabled={yukleniyor}>
                {yukleniyor ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setModalAcik(false);
                  setHata("");
                }}
                disabled={yukleniyor}
              >
                Vazgec
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
};

export default MenuYonetimi;
