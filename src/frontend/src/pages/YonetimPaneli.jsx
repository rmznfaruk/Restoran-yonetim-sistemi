import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const quickLinks = [
  { title: "Siparis Girisi", text: "Masaya ozel siparis olusturup servis akisini hizlandirin.", link: "/siparis" },
  { title: "Masa Plani", text: "Salonun doluluk ve rezervasyon dengesini anlik izleyin.", link: "/masalar" },
  { title: "Menu Yonetimi", text: "Urun, kategori ve stok operasyonunu tek panelden yonetin.", link: "/menu" },
  { title: "Kullanicilar", text: "Roller, aktiflik durumu ve personel kayitlarini guncelleyin.", link: "/kullanici" },
];

const fallbackTables = [
  { id: 1, masa_no: 1, durum: "dolu" },
  { id: 2, masa_no: 2, durum: "bos" },
  { id: 3, masa_no: 3, durum: "rezerveli" },
  { id: 4, masa_no: 4, durum: "temizleniyor" },
];

const fallbackOrders = [
  { id: 1, durum: "bekliyor", toplam_tutar: 780, olusturma_tarihi: new Date().toISOString() },
  { id: 2, durum: "hazirlaniyor", toplam_tutar: 1240, olusturma_tarihi: new Date().toISOString() },
  { id: 3, durum: "hazir", toplam_tutar: 560, olusturma_tarihi: new Date().toISOString() },
];

const fallbackProducts = [
  { id: 1, ad: "Adana Kebap", stok_miktar: 14, kritik_seviye: 6 },
  { id: 2, ad: "Ayran", stok_miktar: 4, kritik_seviye: 5 },
  { id: 3, ad: "Kunefe", stok_miktar: 0, kritik_seviye: 4 },
];

const para = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const YonetimPaneli = () => {
  const rawUser = localStorage.getItem("rysUser");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const [tables, setTables] = useState(fallbackTables);
  const [orders, setOrders] = useState(fallbackOrders);
  const [products, setProducts] = useState(fallbackProducts);
  const [canliVeri, setCanliVeri] = useState(false);

  useEffect(() => {
    let active = true;

    const yukle = async () => {
      try {
        const [tablesResponse, ordersResponse, productsResponse] = await Promise.all([
          axios.get("/api/tables"),
          axios.get("/api/orders"),
          axios.get("/api/products"),
        ]);

        if (!active) {
          return;
        }

        setTables(tablesResponse.data);
        setOrders(ordersResponse.data);
        setProducts(productsResponse.data);
        setCanliVeri(true);
      } catch (error) {
        if (!active) {
          return;
        }

        console.warn("Yonetim paneli ornek veri ile acildi:", error.message);
        setCanliVeri(false);
      }
    };

    yukle();

    return () => {
      active = false;
    };
  }, []);

  const kartlar = useMemo(() => {
    const aktifMasalar = tables.filter((table) => table.durum !== "bos").length;
    const bekleyenSiparis = orders.filter(
      (order) => order.durum === "bekliyor" || order.durum === "hazirlaniyor"
    ).length;
    const kritikStok = products.filter(
      (product) => Number(product.stok_miktar ?? 0) <= Number(product.kritik_seviye ?? 0)
    ).length;
    const gunlukCiro = orders.reduce((sum, order) => sum + Number(order.toplam_tutar || 0), 0);

    return [
      { title: "Gunluk ciro", value: para.format(gunlukCiro || 3470), detail: "Servis ve kapanan adisyonlar" },
      { title: "Acik masa", value: aktifMasalar, detail: "Dolu, rezerveli ve hazirlanan salon akisi" },
      { title: "Bekleyen siparis", value: bekleyenSiparis, detail: "Mutfak onceligi gerektiren siparisler" },
      { title: "Kritik stok", value: kritikStok, detail: "Tedarik takibi isteyen urun sayisi" },
    ];
  }, [orders, products, tables]);

  return (
    <div className="page-stack">
      <section className="hero-panel dashboard-hero">
        <div>
          <p className="eyebrow">Yonetim paneli</p>
          <h1>Restoran operasyonunu tek merkezden takip edin.</h1>
          <p className="hero-copy">
            Hos geldin {user?.kullaniciAdi || "yonetici"}. Bu alan yonetim, rapor, siparis ve kullanici akislarini
            ayni tema diliyle birlestirir.
          </p>
          <div className="dashboard-badges">
            <span className="pill pill--neutral">{user?.rol || "yonetici"} oturumu</span>
            <span className={canliVeri ? "pill pill--success" : "pill pill--warning"}>
              {canliVeri ? "Canli API baglantisi" : "Ornek veri gorunumu"}
            </span>
          </div>
        </div>

        <div className="hero-stats dashboard-hero-stats">
          <div className="stat-chip stat-chip--wide">
            <strong>{kartlar[0].value}</strong>
            <span>Bugunun toplam ciro gorunumu</span>
          </div>
          <div className="stat-chip">
            <strong>{kartlar[1].value}</strong>
            <span>Salon kullanimi</span>
          </div>
          <div className="stat-chip">
            <strong>{kartlar[2].value}</strong>
            <span>Mutfak onceligi</span>
          </div>
        </div>
      </section>

      <section className="dashboard-metric-grid">
        {kartlar.map((kart) => (
          <article key={kart.title} className="surface-card metric-card metric-card--accent">
            <p className="eyebrow">{kart.title}</p>
            <div className="metric-value">{kart.value}</div>
            <p>{kart.detail}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-layout">
        <article className="surface-card">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Canli akis</p>
              <h3>Operasyon ozeti</h3>
            </div>
            <Link className="inline-action" to="/rapor">
              Raporlara git
            </Link>
          </div>

          <div className="activity-feed">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="activity-item">
                <div>
                  <strong>Adisyon #{order.id}</strong>
                  <p>{para.format(Number(order.toplam_tutar || 0))} tutarli siparis akisi</p>
                </div>
                <span className="pill pill--warning">{order.durum}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card dashboard-side-panel">
          <p className="eyebrow">Kisa yol</p>
          <h3>Modul gecisleri</h3>
          <div className="status-list">
            {quickLinks.map((item) => (
              <div key={item.title} className="status-row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
                <Link className="inline-action" to={item.link}>
                  Ac
                </Link>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default YonetimPaneli;
