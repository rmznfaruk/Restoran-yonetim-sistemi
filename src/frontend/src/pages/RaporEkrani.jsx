import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const fallbackRapor = {
  toplamCiro: "124.500 TL",
  siparisSayisi: 286,
  ortalamaTutar: "435 TL",
  enCokSatanlar: [
    { ad: "Adana Kebap", adet: 74 },
    { ad: "Mercimek Corbasi", adet: 58 },
    { ad: "Ayran", adet: 112 },
  ],
  personel: [
    { ad: "Ayse Kaya", siparis: 81 },
    { ad: "Can Yildiz", siparis: 67 },
    { ad: "Mert Sahin", siparis: 59 },
  ],
};

const periyotEtiketleri = {
  gunluk: "Gunluk",
  haftalik: "Haftalik",
  aylik: "Aylik",
};

const RaporEkrani = () => {
  const [periyot, setPeriyot] = useState("gunluk");
  const [rapor, setRapor] = useState(fallbackRapor);
  const [canliVeri, setCanliVeri] = useState(false);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/reports?periyot=${periyot}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRapor(response.data);
        setCanliVeri(true);
      } catch (error) {
        console.warn("Rapor verisi alinamadi, ornek gorunum gosteriliyor:", error.message);
        setCanliVeri(false);
      }
    };

    veriGetir();
  }, [periyot]);

  const kpiVerileri = useMemo(
    () => [
      { title: "Toplam Ciro", value: rapor?.toplamCiro ?? "-" },
      { title: "Siparis Sayisi", value: rapor?.siparisSayisi ?? "-" },
      { title: "Ortalama Tutar", value: rapor?.ortalamaTutar ?? "-" },
    ],
    [rapor]
  );

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Raporlama</p>
          <h1>Performans Ozeti</h1>
          <p>Servis yogunlugu, urun hareketi ve personel performansini tek panelde inceleyin.</p>
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

      <div className={canliVeri ? "info-banner" : "error-banner"}>
        {canliVeri ? "Raporlar canli API verisi ile guncellendi." : "Rapor endpoint'i hazir olmadigi icin ornek veri gosteriliyor."}
      </div>

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
          <h3 className="section-title">En cok satan urunler</h3>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Urun</th>
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
          <h3 className="section-title">Personel performansi</h3>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Personel</th>
                  <th>Siparis</th>
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
            <button className="ghost-button" type="button">
              PDF Olarak Indir
            </button>
            <button className="action-button" type="button">
              Excel Olarak Indir
            </button>
          </div>
        </article>
      </section>
    </div>
  );
};

export default RaporEkrani;
