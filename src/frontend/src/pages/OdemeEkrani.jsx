import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const odemeSecenekleri = [
  { key: "kart", label: "Kredi Karti", value: "Kredi Karti", style: "action-button" },
  { key: "nakit", label: "Nakit Odeme", value: "Nakit", style: "action-button" },
  { key: "mobil", label: "Mobil Odeme", value: "Mobil", style: "ghost-button" },
];

const OdemeEkrani = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [siparis, setSiparis] = useState({ toplam_tutar: 0, urunler: [] });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  useEffect(() => {
    let aktif = true;

    const siparisDetayGetir = async () => {
      try {
        const response = await axios.get(`/api/orders/masa/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (aktif) {
          setSiparis(response.data || { toplam_tutar: 0, urunler: [] });
          setHata("");
        }
      } catch (error) {
        if (!aktif) {
          return;
        }

        console.error("Siparis verileri alinamadi:", error);
        setHata("Masa icin aktif siparis bulunamadi veya odeme verisi yuklenemedi.");
      }
    };

    if (id) {
      siparisDetayGetir();
    }

    return () => {
      aktif = false;
    };
  }, [id, token]);

  const odemeYap = async (yontem) => {
    if (yukleniyor) {
      return;
    }

    const masaTemizlenecekMi = window.confirm(
      "Odeme tamamlandiginda masa temizlik surecine gecsin mi? Evet dersen durum 'temizleniyor' olur, hayir dersen masa 'bos' olur."
    );

    try {
      setYukleniyor(true);
      setHata("");

      await axios.post(
        "/api/payments",
        {
          masa_id: Number(id),
          odeme_yontemi: yontem,
          tutar: siparis.toplam_tutar,
          masa_durumu: masaTemizlenecekMi ? "temizleniyor" : "bos",
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      navigate("/masalar");
    } catch (error) {
      console.error("Odeme tamamlanamadi:", error);
      setHata("Odeme tamamlanamadi. Lutfen servis baglantisini kontrol edin.");
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Kasa islemi</p>
          <h1>Odeme Al</h1>
          <p>Masa {id} icin acik hesabi kontrol edin ve odeme yontemini secerek islemi tamamlayin.</p>
        </div>
      </section>

      {hata ? <div className="error-banner">{hata}</div> : null}

      <article className="surface-card">
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>
            Odenecek toplam
          </p>
          <div className="metric-value">{siparis.toplam_tutar || 0} TL</div>
        </div>

        <div className="table-shell" style={{ marginBottom: 24 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Urun</th>
                <th>Miktar</th>
                <th>Tutar</th>
              </tr>
            </thead>
            <tbody>
              {(siparis.urunler || []).length ? (
                siparis.urunler.map((urun, index) => (
                  <tr key={`${urun.id || urun.ad || "urun"}-${index}`}>
                    <td>{urun.ad || "Urun"}</td>
                    <td>{urun.miktar || 1}</td>
                    <td>{urun.tutar || urun.fiyat || 0} TL</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Bu masa icin kalem detayi bulunamadi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="section-title">Odeme yontemi secin</h3>
        <div className="split-actions">
          {odemeSecenekleri.map((secenek) => (
            <button
              key={secenek.key}
              className={secenek.style}
              type="button"
              onClick={() => odemeYap(secenek.value)}
              disabled={yukleniyor}
            >
              {yukleniyor ? "Islem suruyor..." : secenek.label}
            </button>
          ))}
        </div>
      </article>
    </div>
  );
};

export default OdemeEkrani;
