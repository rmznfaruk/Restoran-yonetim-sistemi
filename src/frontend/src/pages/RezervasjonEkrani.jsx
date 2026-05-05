import React, { useEffect, useState } from "react";
import axios from "axios";

const fallbackMasalar = [
  { id: 1, masa_no: 1, kapasite: 4, durum: "boş" },
  { id: 2, masa_no: 5, kapasite: 2, durum: "rezerveli" },
  { id: 3, masa_no: 9, kapasite: 6, durum: "boş" },
];

const RezervasyonEkrani = () => {
  const [masalar, setMasalar] = useState(fallbackMasalar);
  const [seciliMasa, setSeciliMasa] = useState("");
  const [musteriAdi, setMusteriAdi] = useState("");
  const [kisiSayisi, setKisiSayisi] = useState("");
  const [tarihSaat, setTarihSaat] = useState("");

  useEffect(() => {
    const masalariGetir = async () => {
      try {
        const response = await axios.get("/api/tables");
        const uygunMasalar = response.data.filter((masa) => masa.durum === "bos" || masa.durum === "rezerveli");
        setMasalar(uygunMasalar);
      } catch (error) {
        console.error("Masalar çekilirken hata:", error);
      }
    };
    masalariGetir();
  }, []);

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Müşteri akışı</p>
          <h1>Rezervasyon Ekranı</h1>
          <p>Uygun masa, kişi sayısı ve zaman bilgisini aynı formda eşleştirin.</p>
        </div>
      </section>

      <section className="grid-layout">
        <article className="surface-card">
          <p className="eyebrow">Form</p>
          <h3>Yeni rezervasyon oluştur</h3>
          <form className="stack-form">
            <div>
              <label className="field-label">Masa seçin</label>
              <select className="field-select" value={seciliMasa} onChange={(e) => setSeciliMasa(e.target.value)}>
                <option value="">Masa seçin</option>
                {masalar.map((masa) => (
                  <option key={masa.id} value={masa.id}>
                    Masa {masa.masa_no} | Kapasite {masa.kapasite} | Durum {masa.durum}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Müşteri adı</label>
              <input className="field-input" value={musteriAdi} onChange={(e) => setMusteriAdi(e.target.value)} />
            </div>

            <div>
              <label className="field-label">Kişi sayısı</label>
              <input className="field-input" type="number" value={kisiSayisi} onChange={(e) => setKisiSayisi(e.target.value)} />
            </div>

            <div>
              <label className="field-label">Tarih ve saat</label>
              <input className="field-input" type="datetime-local" value={tarihSaat} onChange={(e) => setTarihSaat(e.target.value)} />
            </div>

            <button className="action-button" type="button">Rezervasyonu Kaydet</button>
          </form>
        </article>

        <article className="surface-card">
          <p className="eyebrow">Hızlı bakış</p>
          <h3>Uygun masa özeti</h3>
          <div className="card-grid-compact">
            {masalar.map((masa) => (
              <div key={masa.id} className="surface-card" style={{ padding: 18 }}>
                <p className="eyebrow">Masa {masa.masa_no}</p>
                <h3>{masa.kapasite} kişilik</h3>
                <span className={masa.durum === "boş" ? "pill pill--success" : "pill pill--warning"}>{masa.durum}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default RezervasyonEkrani;
