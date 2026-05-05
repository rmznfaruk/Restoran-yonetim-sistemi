import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const fallbackRapor = {
  toplamCiro: "124.500 TL",
  siparisSayisi: 286,
  ortalamaTutar: "435 TL",
  enCokSatanlar: [
    { ad: "Adana Kebap", adet: 74 },
    { ad: "Mercimek Çorbası", adet: 58 },
    { ad: "Ayran", adet: 112 },
  ],
  personel: [
    { ad: "Ayşe Kaya", siparis: 81 },
    { ad: "Can Yıldız", siparis: 67 },
    { ad: "Mert Şahin", siparis: 59 },
  ],
};

const periyotEtiketleri = {
  gunluk: "Günlük",
  haftalik: "Haftalık",
  aylik: "Aylık",
};

const RaporEkrani = () => {
  const [periyot, setPeriyot] = useState("gunluk");
  const [rapor, setRapor] = useState(fallbackRapor);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3001/api/reports?periyot=${periyot}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRapor(res.data);
      } catch (err) {
        console.log("Rapor verisi alınamadı, örnek görünüm gösteriliyor:", err);
      }
    };

    veriGetir();
  }, [periyot]);

  const kpiVerileri = useMemo(
    () => [
      { title: "Toplam Ciro", value: rapor?.toplamCiro ?? "-" },
      { title: "Sipariş Sayısı", value: rapor?.siparisSayisi ?? "-" },
      { title: "Ortalama Tutar", value: rapor?.ortalamaTutar ?? "-" },
    ],
    [rapor]
  );

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Raporlama</p>
          <h1>Performans Özeti</h1>
          <p>Servis yoğunluğu, ürün hareketi ve personel performansını tek panelde inceleyin.</p>
        </div>
        <div className="toolbar">
          {Object.entries(periyotEtiketleri).map(([value, label]) => (
            <button
              key={value}
              className={periyot === value ? "action-button" : "ghost-button"}
              onClick={() => setPeriyot(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="kpi-grid">
        {kpiVerileri.map((item) => (
          <article key={item.title} className="surface-card">
            <p className="eyebrow">{item.title}</p>
            <div className="metric-value">{item.value}</div>
          </article>
        ))}
      </section>

      <section className="grid-layout">
        <article className="surface-card">
          <h3 className="section-title">En çok satan ürünler</h3>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Adet</th>
                </tr>
              </thead>
              <tbody>
                {rapor?.enCokSatanlar?.map((urun, index) => (
                  <tr key={`${urun.ad}-${index}`}>
                    <td>{urun.ad}</td>
                    <td>{urun.adet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card">
          <h3 className="section-title">Personel performansı</h3>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Personel</th>
                  <th>Sipariş</th>
                </tr>
              </thead>
              <tbody>
                {rapor?.personel?.map((personel, index) => (
                  <tr key={`${personel.ad}-${index}`}>
                    <td>{personel.ad}</td>
                    <td>{personel.siparis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="split-actions" style={{ marginTop: 16 }}>
            <button className="ghost-button">PDF indir</button>
            <button className="action-button">Excel indir</button>
          </div>
        </article>
      </section>
    </div>
  );
};

export default RaporEkrani;
