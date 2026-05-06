import React, { useEffect, useState } from "react";
import axios from "axios";

const fallbackMasalar = [
  { id: 1, masa_no: 1, kapasite: 4, durum: "bos" },
  { id: 2, masa_no: 5, kapasite: 2, durum: "rezerveli" },
  { id: 3, masa_no: 9, kapasite: 6, durum: "bos" },
];

const RezervasyonEkrani = () => {
  const [masalar, setMasalar] = useState(fallbackMasalar);
  const [seciliMasa, setSeciliMasa] = useState("");
  const [musteriAdi, setMusteriAdi] = useState("");
  const [kisiSayisi, setKisiSayisi] = useState("");
  const [tarihSaat, setTarihSaat] = useState("");
  const [hataMesaji, setHataMesaji] = useState("");
  const [basariMesaji, setBasariMesaji] = useState("");

  useEffect(() => {
    const masalariGetir = async () => {
      try {
        const response = await axios.get("/api/tables");
        const uygunMasalar = response.data.filter(
          (masa) => masa.durum === "bos" || masa.durum === "rezerveli"
        );
        setMasalar(uygunMasalar);
      } catch (error) {
        console.error("Masalar cekilirken hata:", error);
      }
    };

    masalariGetir();
  }, []);

  const rezervasyonOlustur = async () => {
    setHataMesaji("");
    setBasariMesaji("");

    if (!seciliMasa || !musteriAdi || !kisiSayisi || !tarihSaat) {
      setHataMesaji("Lutfen tum alanlari doldurun.");
      return;
    }

    try {
      await axios.patch(`/api/tables/${seciliMasa}`, {
        durum: "rezerveli",
        musteri_adi: musteriAdi,
        kisi_sayisi: kisiSayisi,
        tarih_saat: tarihSaat,
      });

      setBasariMesaji("Rezervasyon basariyla olusturuldu.");
      setSeciliMasa("");
      setMusteriAdi("");
      setKisiSayisi("");
      setTarihSaat("");

      const response = await axios.get("/api/tables");
      const uygunMasalar = response.data.filter(
        (masa) => masa.durum === "bos" || masa.durum === "rezerveli"
      );
      setMasalar(uygunMasalar);
    } catch (error) {
      console.error("Rezervasyon hatasi:", error);
      setHataMesaji("Rezervasyon olusturulurken bir hata oldu.");
    }
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Musteri akisi</p>
          <h1>Rezervasyon Ekrani</h1>
          <p>Uygun masa, kisi sayisi ve zaman bilgisini ayni formda eslestirin.</p>
        </div>
      </section>

      <section className="grid-layout">
        <article className="surface-card">
          <p className="eyebrow">Form</p>
          <h3>Yeni rezervasyon olustur</h3>

          {hataMesaji ? (
            <div className="pill pill--warning" style={{ marginBottom: 16, display: "inline-flex" }}>
              {hataMesaji}
            </div>
          ) : null}
          {basariMesaji ? (
            <div className="pill pill--success" style={{ marginBottom: 16, display: "inline-flex" }}>
              {basariMesaji}
            </div>
          ) : null}

          <form className="stack-form">
            <div>
              <label className="field-label">Masa secin</label>
              <select
                className="field-select"
                value={seciliMasa}
                onChange={(e) => setSeciliMasa(e.target.value)}
              >
                <option value="">Masa secin</option>
                {masalar.map((masa) => (
                  <option key={masa.id} value={masa.id}>
                    Masa {masa.masa_no} | Kapasite {masa.kapasite} | Durum {masa.durum}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Musteri adi</label>
              <input
                className="field-input"
                value={musteriAdi}
                onChange={(e) => setMusteriAdi(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Kisi sayisi</label>
              <input
                className="field-input"
                type="number"
                value={kisiSayisi}
                onChange={(e) => setKisiSayisi(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Tarih ve saat</label>
              <input
                className="field-input"
                type="datetime-local"
                value={tarihSaat}
                onChange={(e) => setTarihSaat(e.target.value)}
              />
            </div>

            <button className="action-button" type="button" onClick={rezervasyonOlustur}>
              Rezervasyonu Kaydet
            </button>
          </form>
        </article>

        <article className="surface-card">
          <p className="eyebrow">Hizli bakis</p>
          <h3>Uygun masa ozeti</h3>
          <div className="card-grid-compact">
            {masalar.map((masa) => (
              <div key={masa.id} className="surface-card" style={{ padding: 18 }}>
                <p className="eyebrow">Masa {masa.masa_no}</p>
                <h3>{masa.kapasite} kisilik</h3>
                <span
                  className={masa.durum === "bos" ? "pill pill--success" : "pill pill--warning"}
                >
                  {masa.durum}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default RezervasyonEkrani;
