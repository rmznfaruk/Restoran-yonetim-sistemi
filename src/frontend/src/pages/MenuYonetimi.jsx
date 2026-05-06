import React, { useState } from "react";

const urunStokDurumu = (stok) => {
  if (stok === 0) return { label: "Tukendi", className: "pill pill--danger" };
  if (stok < 10) return { label: `Kritik (${stok})`, className: "pill pill--warning" };
  return { label: `Yeterli (${stok})`, className: "pill pill--success" };
};

const MenuYonetimi = () => {
  const [urunler, setUrunler] = useState([
    { id: 1, ad: "Adana Kebap", fiyat: "350", kategori: "Ana Yemek", stok: 15 },
    { id: 2, ad: "Mercimek Corbasi", fiyat: "80", kategori: "Corba", stok: 5 },
    { id: 3, ad: "Ayran", fiyat: "50", kategori: "Icecek", stok: 0 },
    { id: 4, ad: "Kunefe", fiyat: "120", kategori: "Tatli", stok: 8 },
  ]);
  const [modalAcik, setModalAcik] = useState(false);
  const [yeniUrun, setYeniUrun] = useState({ ad: "", fiyat: "", kategori: "Ana Yemek", stok: 0 });

  const urunEkle = (e) => {
    e.preventDefault();
    setUrunler([...urunler, { ...yeniUrun, id: Date.now() }]);
    setYeniUrun({ ad: "", fiyat: "", kategori: "Ana Yemek", stok: 0 });
    setModalAcik(false);
  };

  const urunSil = (id) => {
    if (window.confirm("Bu urunu silmek istediginize emin misiniz?")) {
      setUrunler(urunler.filter((u) => u.id !== id));
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
          <button className="action-button" onClick={() => setModalAcik(true)}>
            Yeni Urun Ekle
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <article className="surface-card">
          <p className="eyebrow">Toplam urun</p>
          <div className="metric-value">{urunler.length}</div>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Kritik stok</p>
          <div className="metric-value">{urunler.filter((u) => u.stok > 0 && u.stok < 10).length}</div>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Tukenen urun</p>
          <div className="metric-value">{urunler.filter((u) => u.stok === 0).length}</div>
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
                      <button className="ghost-button" type="button">
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

      {modalAcik && (
        <section className="surface-card">
          <p className="eyebrow">Hizli ekleme</p>
          <h3>Yeni urun olustur</h3>
          <form className="stack-form" onSubmit={urunEkle}>
            <div>
              <label className="field-label">Urun adi</label>
              <input
                className="field-input"
                onChange={(e) => setYeniUrun({ ...yeniUrun, ad: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Kategori</label>
              <select
                className="field-select"
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
                onChange={(e) => setYeniUrun({ ...yeniUrun, fiyat: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Stok adedi</label>
              <input
                className="field-input"
                type="number"
                onChange={(e) => setYeniUrun({ ...yeniUrun, stok: parseInt(e.target.value, 10) || 0 })}
                required
              />
            </div>
            <div className="split-actions">
              <button className="action-button" type="submit">
                Kaydet
              </button>
              <button className="ghost-button" type="button" onClick={() => setModalAcik(false)}>
                Vazgec
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default MenuYonetimi;
