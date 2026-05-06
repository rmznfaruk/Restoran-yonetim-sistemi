import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Stok durumuna göre etiket ve renk belirleyen yardımcı fonksiyon
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
  const [urunler, setUrunler] = useState([]); 
  const [sadeceKritik, setSadeceKritik] = useState(false);
  const token = localStorage.getItem('token'); 

  // --- Veri Çekme İşlemi (Yusuf'un Backend Bağlantısı) ---
  useEffect(() => {
    const stokVerileriniGetir = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products?stok=true', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUrunler(response.data);
      } catch (err) {
        console.error("Veritabanı bağlantı hatası:", err);
      }
    };
    if (token) stokVerileriniGetir();
  }, [token]);

  // --- Stok Güncelleme İşlemi (PATCH İsteği) ---
  const handleStokGuncelle = async (id, yeniMiktar) => {
    try {
      await axios.patch(`http://localhost:3001/api/products/${id}/stok`, 
        { stok_miktar: Number(yeniMiktar) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUrunler((mevcut) =>
        mevcut.map((urun) =>
          urun.id === id ? { ...urun, stok: Math.max(0, Number(yeniMiktar) || 0) } : urun
        )
      );
    } catch (err) {
      alert("Hata: Stok veritabanında güncellenemedi!");
    }
  };

  // --- ÖNEMLİ: Filtreleme Mantığı (Bu kısım eksikti) ---
  const filtreliUrunler = useMemo(() => {
    if (!sadeceKritik) return urunler;
    return urunler.filter((urun) => urun.stok <= urun.kritikSeviye);
  }, [sadeceKritik, urunler]);

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