import React, { useMemo, useState } from "react";

const baslangicUrunleri = [
  { id: 1, ad: "Kiyma", stok: 5, kritikSeviye: 10, kategori: "Et" },
  { id: 2, ad: "Domates", stok: 12, kritikSeviye: 10, kategori: "Sebze" },
  { id: 3, ad: "Ekmek", stok: 50, kritikSeviye: 20, kategori: "Firindan" },
  { id: 4, ad: "Ayran", stok: 0, kritikSeviye: 5, kategori: "Icecek" },
];

const stokDurumu = (urun) => {
  if (urun.stok <= urun.kritikSeviye) {
    return { label: "Kritik seviye", className: "pill pill--danger" };
  }

  if (urun.stok <= Math.ceil(urun.kritikSeviye * 1.5)) {
    return { label: "Azaliyor", className: "pill pill--warning" };
  }

  return { label: "Guvenli", className: "pill pill--success" };
};

const StokTakip = () => {
  const [urunler, setUrunler] = useState(baslangicUrunleri);
  const [sadeceKritik, setSadeceKritik] = useState(false);

  const filtreliUrunler = useMemo(() => {
    if (!sadeceKritik) {
      return urunler;
    }

    return urunler.filter((urun) => urun.stok <= urun.kritikSeviye);
  }, [sadeceKritik, urunler]);

  const handleStokGuncelle = (id, yeniMiktar) => {
    setUrunler((mevcut) =>
      mevcut.map((urun) =>
        urun.id === id ? { ...urun, stok: Math.max(0, Number(yeniMiktar) || 0) } : urun
      )
    );
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Stok akisi</p>
          <h1>Stok Takip</h1>
          <p>Kritik urunleri erken gorun, mutfak ve satin alma akisini tek tablodan yonetin.</p>
        </div>

        <div className="toolbar">
          <button
            className={sadeceKritik ? "action-button" : "ghost-button"}
            type="button"
            onClick={() => setSadeceKritik((value) => !value)}
          >
            {sadeceKritik ? "Tum urunleri goster" : "Sadece kritik urunler"}
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <article className="surface-card">
          <p className="eyebrow">Toplam kalem</p>
          <div className="metric-value">{urunler.length}</div>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Kritik urun</p>
          <div className="metric-value">{urunler.filter((urun) => urun.stok <= urun.kritikSeviye).length}</div>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Tukenen urun</p>
          <div className="metric-value">{urunler.filter((urun) => urun.stok === 0).length}</div>
        </article>
      </section>

      <article className="surface-card">
        <h3 className="section-title">Stok listesi</h3>
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Urun</th>
                <th>Kategori</th>
                <th>Mevcut stok</th>
                <th>Kritik seviye</th>
                <th>Durum</th>
                <th>Guncelle</th>
              </tr>
            </thead>
            <tbody>
              {filtreliUrunler.map((urun) => {
                const durum = stokDurumu(urun);

                return (
                  <tr key={urun.id}>
                    <td>{urun.ad}</td>
                    <td>
                      <span className="pill pill--neutral">{urun.kategori}</span>
                    </td>
                    <td>{urun.stok}</td>
                    <td>{urun.kritikSeviye}</td>
                    <td>
                      <span className={durum.className}>{durum.label}</span>
                    </td>
                    <td>
                      <input
                        className="field-input"
                        type="number"
                        value={urun.stok}
                        onChange={(e) => handleStokGuncelle(urun.id, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
};

export default StokTakip;
