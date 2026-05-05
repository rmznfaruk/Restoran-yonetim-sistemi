import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const fallbackKategoriler = [
  { id: "baslangic", ad: "Baslangic" },
  { id: "corbalar", ad: "Corbalar" },
  { id: "ana-yemek", ad: "Ana Yemek" },
  { id: "icecek", ad: "Icecek" },
  { id: "tatli", ad: "Tatli" },
];

const fallbackUrunler = [
  { id: 1, ad: "Humus", fiyat: 80, kategori_adi: "Baslangic", mevcut: true },
  { id: 2, ad: "Mercimek Corbasi", fiyat: 50, kategori_adi: "Corbalar", mevcut: true },
  { id: 3, ad: "Adana Kebap", fiyat: 250, kategori_adi: "Ana Yemek", mevcut: true },
  { id: 4, ad: "Ayran", fiyat: 30, kategori_adi: "Icecek", mevcut: true },
  { id: 5, ad: "Sutlac", fiyat: 90, kategori_adi: "Tatli", mevcut: true },
];

function SiparisGirisi() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const masaId = searchParams.get("masaId") || "Secilmedi";

  const [kategoriler, setKategoriler] = useState(fallbackKategoriler);
  const [urunler, setUrunler] = useState(fallbackUrunler);
  const [aktifKategori, setAktifKategori] = useState(fallbackKategoriler[0].ad);
  const [sepet, setSepet] = useState([]);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState("");

  useEffect(() => {
    let aktif = true;

    async function verileriGetir() {
      try {
        const [kategoriRes, urunRes] = await Promise.all([
          axios.get("/api/products/categories"),
          axios.get("/api/products"),
        ]);

        if (!aktif) {
          return;
        }

        const gelenKategoriler = kategoriRes.data?.map((kategori) => ({
          id: kategori.id,
          ad: kategori.ad,
        }));

        const gelenUrunler = urunRes.data?.map((urun) => ({
          id: urun.id,
          ad: urun.ad,
          fiyat: Number(urun.fiyat),
          kategori_adi: urun.kategori_adi || urun.kategori || fallbackKategoriler[0].ad,
          mevcut: urun.mevcut !== false,
        }));

        if (gelenKategoriler?.length) {
          setKategoriler(gelenKategoriler);
          setAktifKategori(gelenKategoriler[0].ad);
        }

        if (gelenUrunler?.length) {
          setUrunler(gelenUrunler);
        }

        setHata("");
      } catch (error) {
        console.error("Siparis verileri alinamadi:", error);
        if (aktif) {
          setHata("Canli urun verisi alinamadi, varsayilan liste gosteriliyor.");
        }
      }
    }

    verileriGetir();

    return () => {
      aktif = false;
    };
  }, []);

  const filtreliUrunler = useMemo(
    () => urunler.filter((urun) => urun.kategori_adi === aktifKategori && urun.mevcut !== false),
    [aktifKategori, urunler]
  );

  const toplamTutar = useMemo(
    () => sepet.reduce((toplam, kalem) => toplam + kalem.fiyat * kalem.miktar, 0),
    [sepet]
  );

  const sepeteEkle = (urun) => {
    setSepet((oncekiSepet) => {
      const mevcutKalem = oncekiSepet.find((kalem) => kalem.id === urun.id);

      if (mevcutKalem) {
        return oncekiSepet.map((kalem) =>
          kalem.id === urun.id ? { ...kalem, miktar: kalem.miktar + 1 } : kalem
        );
      }

      return [...oncekiSepet, { ...urun, miktar: 1 }];
    });
  };

  const miktarGuncelle = (urunId, fark) => {
    setSepet((oncekiSepet) =>
      oncekiSepet
        .map((kalem) =>
          kalem.id === urunId ? { ...kalem, miktar: Math.max(kalem.miktar + fark, 0) } : kalem
        )
        .filter((kalem) => kalem.miktar > 0)
    );
  };

  const siparisiOnayla = async () => {
    if (!sepet.length) {
      setHata("Siparis olusturmadan once en az bir urun secin.");
      return;
    }

    if (masaId === "Secilmedi") {
      setHata("Siparis acmak icin once masa plani ekranindan bir masa secin.");
      return;
    }

    try {
      setKaydediliyor(true);
      setHata("");

      await axios.post("/api/orders", {
        masa_id: Number(masaId),
        urunler: sepet.map((kalem) => ({
          id: kalem.id,
          miktar: kalem.miktar,
          fiyat: kalem.fiyat,
        })),
      });

      navigate("/masalar");
    } catch (error) {
      console.error("Siparis kaydedilemedi:", error);
      setHata("Siparis kaydedilemedi. Lutfen backend servislerini kontrol edin.");
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Servis akisi</p>
          <h1>Siparis Girisi</h1>
          <p>Masa {masaId} icin kategori secin, urunleri sepete ekleyin ve siparisi tek adimda olusturun.</p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" type="button" onClick={() => navigate("/masalar")}>
            Masa planina don
          </button>
          <button className="action-button" type="button" onClick={siparisiOnayla} disabled={kaydediliyor}>
            {kaydediliyor ? "Kaydediliyor..." : "Siparisi onayla"}
          </button>
        </div>
      </section>

      {hata ? <div className="error-banner">{hata}</div> : null}

      <section className="grid-layout">
        <article className="surface-card">
          <h3 className="section-title">Kategoriler</h3>
          <div className="category-tabs">
            {kategoriler.map((kategori) => (
              <button
                key={kategori.id}
                type="button"
                className={`category-tab${aktifKategori === kategori.ad ? " category-tab--active" : ""}`}
                onClick={() => setAktifKategori(kategori.ad)}
              >
                {kategori.ad}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filtreliUrunler.map((urun) => (
              <button key={urun.id} type="button" className="product-card" onClick={() => sepeteEkle(urun)}>
                <p className="eyebrow">{urun.kategori_adi}</p>
                <h3>{urun.ad}</h3>
                <p className="helper-text">{urun.fiyat} TL</p>
                <span className="inline-action">Sepete ekle</span>
              </button>
            ))}
          </div>
        </article>

        <aside className="surface-card order-sidebar">
          <p className="eyebrow">Aktif masa</p>
          <h3>Masa {masaId}</h3>
          <p className="helper-text">Eklenen urunler asagida ozetlenir. Miktarlari bu panelden duzenleyebilirsiniz.</p>

          <div className="cart-list">
            {sepet.length ? (
              sepet.map((kalem) => (
                <div key={kalem.id} className="cart-item">
                  <div>
                    <strong>{kalem.ad}</strong>
                    <p className="helper-text">{kalem.fiyat} TL</p>
                  </div>
                  <div className="quantity-controls">
                    <button type="button" className="ghost-button" onClick={() => miktarGuncelle(kalem.id, -1)}>
                      -
                    </button>
                    <span>{kalem.miktar}</span>
                    <button type="button" className="ghost-button" onClick={() => miktarGuncelle(kalem.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="helper-text">Henuz urun secilmedi.</p>
            )}
          </div>

          <div className="order-summary">
            <div>
              <p className="eyebrow">Toplam</p>
              <div className="metric-value">{toplamTutar} TL</div>
            </div>
            <button className="action-button" type="button" onClick={siparisiOnayla} disabled={kaydediliyor}>
              {kaydediliyor ? "Kaydediliyor..." : "Siparisi gonder"}
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default SiparisGirisi;
