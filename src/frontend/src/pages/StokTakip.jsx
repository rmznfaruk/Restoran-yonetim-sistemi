import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const fallbackUrunler = [
  { id: 1, ad: "Humus", kategori: "Baslangic", stok: 22, kritikSeviye: 8 },
  { id: 2, ad: "Mercimek Corbasi", kategori: "Corba", stok: 18, kritikSeviye: 6 },
  { id: 3, ad: "Adana Kebap", kategori: "Ana Yemek", stok: 14, kritikSeviye: 5 },
  { id: 4, ad: "Ayran", kategori: "Icecek", stok: 40, kritikSeviye: 10 },
  { id: 5, ad: "Kunefe", kategori: "Tatli", stok: 4, kritikSeviye: 4 },
];

const urunBicimlendir = (urun) => ({
  ...urun,
  kategori: urun.kategori || urun.kategori_adi || "Belirtilmedi",
  stok: Number(urun.stok ?? urun.stok_miktar ?? 0),
  kritikSeviye: Number(urun.kritikSeviye ?? urun.kritik_seviye ?? 0),
});

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
  const [urunler, setUrunler] = useState(fallbackUrunler);
  const [sadeceKritik, setSadeceKritik] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");
  const [ornekVeri, setOrnekVeri] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let aktif = true;

    const stokVerileriniGetir = async () => {
      try {
        const response = await axios.get("/api/products", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!aktif) {
          return;
        }

        const gelenUrunler = (response.data || []).map(urunBicimlendir);
        if (gelenUrunler.length) {
          setUrunler(gelenUrunler);
        }
        setHata("");
        setOrnekVeri(false);
      } catch (err) {
        if (!aktif) {
          return;
        }

        console.error("Stok verileri alinamadi:", err);
        setHata("Stok verileri alinamadi. Ornek liste gosteriliyor.");
        setOrnekVeri(true);
      }
    };

    stokVerileriniGetir();

    return () => {
      aktif = false;
    };
  }, [token]);

  const handleStokGuncelle = async (id, yeniMiktar) => {
    try {
      setMesaj("");
      setHata("");

      await axios.patch(
        `/api/products/${id}/stok`,
        { stok_miktar: Number(yeniMiktar) },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setUrunler((mevcut) =>
        mevcut.map((urun) =>
          urun.id === id ? { ...urun, stok: Math.max(0, Number(yeniMiktar) || 0) } : urun
        )
      );
      setMesaj("Stok bilgisi guncellendi.");
    } catch (err) {
      console.error("Stok guncellenemedi:", err);
      setHata("Stok veritabaninda guncellenemedi.");
    }
  };

  const filtreliUrunler = useMemo(() => {
    if (!sadeceKritik) {
      return urunler;
    }

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

      {mesaj ? <div className="info-banner">{mesaj}</div> : null}
      {hata ? <div className="error-banner">{hata}</div> : null}

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
        <article className="surface-card">
          <p className="eyebrow">Veri kaynagi</p>
          <div className="metric-value">{ornekVeri ? "Demo" : "Canli"}</div>
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
                        min="0"
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
