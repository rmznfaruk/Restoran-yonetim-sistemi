import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const fallbackSiparisler = [
  {
    id: 502,
    masa_no: 4,
    durum: "hazir",
    olusturma_zamani: new Date(Date.now() - 8 * 60000).toISOString(),
    kalemler: [{ urun_adi: "Mercimek Corbasi", miktar: 3 }],
  },
];

const durumEtiketleri = {
  hazir: "Hazir",
  teslim: "Serviste",
};

const ServisTakip = () => {
  const [siparisler, setSiparisler] = useState(fallbackSiparisler);
  const [ornekVeri, setOrnekVeri] = useState(true);
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");
  const [suankiZaman, setSuankiZaman] = useState(Date.now());

  const siparisleriGetir = useCallback(async () => {
    try {
      const response = await axios.get("/api/orders");
      const servisSiparisleri = response.data.filter((siparis) =>
        ["hazir", "teslim"].includes(siparis.durum)
      );

      setSiparisler(servisSiparisleri);
      setOrnekVeri(false);
    } catch (error) {
      console.warn("Servis siparisleri alinamadi, ornek gorunum kullaniliyor:", error.message);
      setOrnekVeri(true);
    }
  }, []);

  useEffect(() => {
    siparisleriGetir();

    const interval = setInterval(() => {
      siparisleriGetir();
      setSuankiZaman(Date.now());
    }, 5000);

    return () => clearInterval(interval);
  }, [siparisleriGetir]);

  const hazirSiparisler = useMemo(
    () => siparisler.filter((siparis) => siparis.durum === "hazir"),
    [siparisler]
  );

  const teslimdekiSiparisler = useMemo(
    () => siparisler.filter((siparis) => siparis.durum === "teslim"),
    [siparisler]
  );

  const serviseAl = async (id) => {
    try {
      setMesaj("");
      setHata("");
      await axios.patch(`/api/orders/${id}`, { durum: "teslim" });
      setMesaj(`Siparis #${id} servise alindi.`);
      siparisleriGetir();
    } catch (error) {
      console.error("Siparis servise alinamadi:", error);
      setHata("Siparis durumu guncellenemedi.");
    }
  };

  const sureHesapla = (siparisZamani) => {
    const fark = suankiZaman - new Date(siparisZamani).getTime();
    return Math.max(0, Math.floor(fark / 60000));
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Garson akisi</p>
          <h1>Servis Takip</h1>
          <p>Mutfagin hazir isaretledigi siparisleri gorun ve masaya goturmek icin servise alin.</p>
        </div>
        <div className="header-actions">
          <span className={ornekVeri ? "pill pill--warning" : "pill pill--success"}>
            {ornekVeri ? "Ornek veri" : "Canli siparis"}
          </span>
        </div>
      </section>

      {mesaj ? <div className="info-banner">{mesaj}</div> : null}
      {hata ? <div className="error-banner">{hata}</div> : null}

      <section className="stats-grid">
        <article className="surface-card">
          <p className="eyebrow">Mutfakta hazir</p>
          <div className="metric-value">{hazirSiparisler.length}</div>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Servise alinan</p>
          <div className="metric-value">{teslimdekiSiparisler.length}</div>
        </article>
      </section>

      <section className="ticket-grid">
        {hazirSiparisler.length ? (
          hazirSiparisler.map((siparis) => {
            const beklemeDakikasi = sureHesapla(siparis.olusturma_zamani || siparis.olusturma_tarihi);

            return (
              <article key={siparis.id} className="ticket-card" style={{ borderTopColor: "#2f7d5c" }}>
                <p className="eyebrow">Masa {siparis.masa_no}</p>
                <h3>Siparis #{siparis.id}</h3>
                <p className="helper-text">Hazir siparis. Garson mutfaktan alip masaya goturebilir.</p>
                <p className="helper-text">Gecen sure: {beklemeDakikasi} dk</p>

                <ul className="ticket-list">
                  {siparis.kalemler?.map((kalem, index) => (
                    <li key={`${kalem.urun_adi || kalem.ad}-${index}`}>
                      {kalem.urun_adi || kalem.ad} x {kalem.miktar}
                    </li>
                  ))}
                </ul>

                <button className="action-button" type="button" onClick={() => serviseAl(siparis.id)}>
                  Servise alindi
                </button>
              </article>
            );
          })
        ) : (
          <article className="surface-card">
            <p className="eyebrow">Bekleyen hazir siparis yok</p>
            <h3>Mutfak hazir isaretlediginde burada gorunecek.</h3>
            <p>Garson hesabi bu ekrani acik tutarak yeni hazir siparisleri otomatik gorebilir.</p>
          </article>
        )}
      </section>

      {teslimdekiSiparisler.length ? (
        <section className="surface-card">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Son servisler</p>
              <h3 className="section-title">Masaya goturulen siparisler</h3>
            </div>
          </div>
          <div className="status-list">
            {teslimdekiSiparisler.slice(0, 5).map((siparis) => (
              <div key={siparis.id} className="status-row">
                <div>
                  <strong>Masa {siparis.masa_no}</strong>
                  <p>Siparis #{siparis.id}</p>
                </div>
                <span className="pill pill--neutral">{durumEtiketleri[siparis.durum]}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ServisTakip;
