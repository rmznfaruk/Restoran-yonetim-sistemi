import React, { useEffect, useState } from "react";
import axios from "axios";

const fallbackSiparisler = [
  {
    id: 501,
    masa_no: 12,
    durum: "hazirlaniyor",
    olusturma_zamani: new Date(Date.now() - 7 * 60000).toISOString(),
    kalemler: [
      { urun_adi: "Adana Kebap", miktar: 2 },
      { urun_adi: "Ayran", miktar: 2 },
    ],
  },
  {
    id: 502,
    masa_no: 4,
    durum: "hazir",
    olusturma_zamani: new Date(Date.now() - 12 * 60000).toISOString(),
    kalemler: [{ urun_adi: "Mercimek Çorbası", miktar: 3 }],
  },
];

const KDSEkrani = () => {
  const [siparisler, setSiparisler] = useState(fallbackSiparisler);
  const [suankiZaman, setSuankiZaman] = useState(Date.now());

  const siparisleriGetir = async () => {
    try {
      const response = await axios.get("/api/orders");
      const aktifSiparisler = response.data.filter((siparis) => siparis.durum !== "kapali" && siparis.durum !== "iptal");
      setSiparisler(aktifSiparisler);
    } catch (error) {
      console.error("Siparişler çekilirken hata oluştu:", error);
    }
  };

  useEffect(() => {
    siparisleriGetir();

    const interval = setInterval(() => {
      siparisleriGetir();
      setSuankiZaman(Date.now());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const hazirIsaretle = async (id) => {
    try {
      await axios.patch(`/api/orders/${id}`, { durum: "hazir" });
      siparisleriGetir();
    } catch (error) {
      console.error("Sipariş güncellenirken hata:", error);
    }
  };

  const sureHesapla = (siparisZamani) => {
    const fark = suankiZaman - new Date(siparisZamani).getTime();
    return Math.floor(fark / 60000);
  };

  const renkBelirle = (dakika, durum) => {
    if (durum === "hazir") return "#2f7d5c";
    if (dakika > 10) return "#b84d4d";
    if (dakika >= 5) return "#d7b66f";
    return "#6f7b52";
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Mutfak operasyonu</p>
          <h1>KDS Ekranı</h1>
          <p>Hazırlık süresi uzayan siparişleri hızlıca görün ve akışı mutfaktan yönetin.</p>
        </div>
        <div className="surface-card">
          <p className="eyebrow">Aktif sipariş</p>
          <div className="metric-value">{siparisler.length}</div>
        </div>
      </section>

      <section className="ticket-grid">
        {siparisler.map((siparis) => {
          const beklemeDakikasi = sureHesapla(siparis.olusturma_zamani || Date.now());
          const kenarlikRengi = renkBelirle(beklemeDakikasi, siparis.durum);

          return (
            <article key={siparis.id} className="ticket-card" style={{ borderTopColor: kenarlikRengi }}>
              <p className="eyebrow">Masa {siparis.masa_no}</p>
              <h3>Sipariş #{siparis.id}</h3>
              <p className="helper-text">Bekleme süresi: {beklemeDakikasi} dk</p>

              <ul className="ticket-list">
                {siparis.kalemler?.map((kalem, index) => (
                  <li key={`${kalem.urun_adi}-${index}`}>
                    {kalem.urun_adi} x {kalem.miktar}
                  </li>
                ))}
              </ul>

              {siparis.durum === "hazir" ? (
                <span className="pill pill--success">Hazır</span>
              ) : (
                <button className="action-button" onClick={() => hazirIsaretle(siparis.id)}>Hazır olarak işaretle</button>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default KDSEkrani;
