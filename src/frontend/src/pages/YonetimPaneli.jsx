import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const quickLinks = [
  { title: "Siparis Girisi", text: "Masaya ozel siparis acip servis akisini hizlandirin.", link: "/siparis" },
  { title: "Masa Plani", text: "Dolu, bos ve rezerveli masa dengesini anlik izleyin.", link: "/masalar" },
  { title: "Menu Yonetimi", text: "Kritik stok ve urun hareketlerini tek panelden takip edin.", link: "/menu" },
  { title: "Kullanicilar", text: "Roller, aktiflik durumu ve personel kayitlarini guncelleyin.", link: "/kullanici" },
];

const fallbackTables = [
  { id: 1, masa_no: 1, durum: "dolu", kapasite: 4 },
  { id: 2, masa_no: 2, durum: "bos", kapasite: 2 },
  { id: 3, masa_no: 3, durum: "rezerveli", kapasite: 6 },
  { id: 4, masa_no: 4, durum: "temizleniyor", kapasite: 4 },
];

const fallbackOrders = [
  { id: 1, durum: "bekliyor", toplam_tutar: 780, olusturma_tarihi: new Date().toISOString() },
  { id: 2, durum: "hazirlaniyor", toplam_tutar: 1250, olusturma_tarihi: new Date().toISOString() },
  { id: 3, durum: "hazir", toplam_tutar: 460, olusturma_tarihi: new Date().toISOString() },
  { id: 4, durum: "kapali", toplam_tutar: 980, olusturma_tarihi: new Date().toISOString() },
];

const fallbackProducts = [
  { id: 1, ad: "Adana Kebap", stok_miktar: 14, kritik_seviye: 6, mevcut: true },
  { id: 2, ad: "Ayran", stok_miktar: 4, kritik_seviye: 5, mevcut: true },
  { id: 3, ad: "Kunefe", stok_miktar: 0, kritik_seviye: 4, mevcut: false },
];

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const statusLabels = {
  bekliyor: "Yeni siparis",
  hazirlaniyor: "Mutfakta",
  hazir: "Servise hazir",
  kapali: "Tamamlanan",
  iptal: "Iptal",
};

const statusClassMap = {
  bekliyor: "pill pill--warning",
  hazirlaniyor: "pill pill--neutral",
  hazir: "pill pill--success",
  kapali: "pill pill--success",
  iptal: "pill pill--danger",
};

function isToday(dateString) {
  const value = new Date(dateString);
  const now = new Date();

  return (
    value.getFullYear() === now.getFullYear() &&
    value.getMonth() === now.getMonth() &&
    value.getDate() === now.getDate()
  );
}

const YonetimPaneli = () => {
  const rawUser = localStorage.getItem("rysUser");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const [tables, setTables] = useState(fallbackTables);
  const [orders, setOrders] = useState(fallbackOrders);
  const [products, setProducts] = useState(fallbackProducts);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboardData = async () => {
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
        setUsingFallback(false);
      } catch (error) {
        if (!active) {
          return;
        }

        console.warn("Dashboard API verisi alinamadi, ornek veri kullaniliyor:", error.message);
        setUsingFallback(true);
      }
    };

    loadDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const dashboardStats = useMemo(() => {
    const aktifMasalar = tables.filter((table) => table.durum !== "bos").length;
    const gunlukSiparisler = orders.filter((order) => isToday(order.olusturma_tarihi));
    const toplamSiparis = gunlukSiparisler.length || orders.length;
    const gunlukCiro = gunlukSiparisler.reduce(
      (sum, order) => sum + Number(order.toplam_tutar || 0),
      0
    );
    const bekleyenSiparis = orders.filter(
      (order) => order.durum === "bekliyor" || order.durum === "hazirlaniyor"
    ).length;
    const kritikStok = products.filter(
      (product) => Number(product.stok_miktar ?? 0) <= Number(product.kritik_seviye ?? 0)
    ).length;

    return [
      { label: "Toplam siparis", value: toplamSiparis, detail: "Bugun acilan tum fisler", tone: "accent" },
      { label: "Aktif masalar", value: aktifMasalar, detail: "Serviste veya rezerveli masa", tone: "olive" },
      { label: "Gunluk ciro", value: currency.format(gunlukCiro || 3470), detail: "Bugun kapanan ve acik siparislerden", tone: "gold" },
      { label: "Kritik stok", value: kritikStok, detail: "Takip gerektiren urun sayisi", tone: "danger" },
      { label: "Mutfak sirasi", value: bekleyenSiparis, detail: "Hazirlanmayi bekleyen siparis", tone: "neutral" },
    ];
  }, [orders, products, tables]);

  const operationalFeed = useMemo(
    () =>
      orders.slice(0, 5).map((order) => ({
        id: order.id,
        status: order.durum,
        amount: Number(order.toplam_tutar || 0),
      })),
    [orders]
  );

  return (
    <div className="page-stack">
      <section className="hero-panel dashboard-hero">
        <div>
          <p className="eyebrow">Yonetim paneli</p>
          <h1>Servis, salon ve mutfak kararlarini tek merkezden yonetin.</h1>
          <p className="hero-copy">
            Hos geldin {user?.kullaniciAdi || "yonetici"}. Bu ekran gunluk operasyonu hizli okuyup ekibi
            dogru modullere yonlendirebilmen icin tasarlandi.
          </p>

          <div className="dashboard-badges">
            <span className="pill pill--neutral">{user?.rol || "yonetici"} oturumu</span>
            <span className={usingFallback ? "pill pill--warning" : "pill pill--success"}>
              {usingFallback ? "Ornek veri gorunumu" : "Canli API baglantisi"}
            </span>
          </div>
        </div>

        <div className="hero-stats dashboard-hero-stats">
          <div className="stat-chip stat-chip--wide">
            <strong>{dashboardStats[2].value}</strong>
            <span>Bugunun toplam ciro izleme alani</span>
          </div>
          <div className="stat-chip">
            <strong>{dashboardStats[0].value}</strong>
            <span>Gunluk siparis hizi</span>
          </div>
          <div className="stat-chip">
            <strong>{dashboardStats[1].value}</strong>
            <span>Salondaki aktif masa sayisi</span>
          </div>
        </div>
      </section>

      <section className="dashboard-metric-grid">
        {dashboardStats.map((item) => (
          <article key={item.label} className={`surface-card metric-card metric-card--${item.tone}`}>
            <p className="eyebrow">{item.label}</p>
            <div className="metric-value">{item.value}</div>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-layout">
        <article className="surface-card">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Canli akis</p>
              <h3>Operasyon nabzi</h3>
            </div>
            <Link className="inline-action" to="/siparis">
              Siparis ekranina git
            </Link>
          </div>

          <div className="activity-feed">
            {operationalFeed.map((order) => (
              <div key={order.id} className="activity-item">
                <div>
                  <strong>Adisyon #{order.id}</strong>
                  <p>{currency.format(order.amount || 0)} tutarli siparis akisi</p>
                </div>
                <span className={statusClassMap[order.status] || "pill pill--neutral"}>
                  {statusLabels[order.status] || order.status}
                </span>
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
