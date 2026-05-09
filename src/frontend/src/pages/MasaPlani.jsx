import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fallbackMasalar = [
  { id: 101, no: "Masa 101", durum: "bos", kapasite: 4 },
  { id: 102, no: "Masa 102", durum: "dolu", kapasite: 2 },
  { id: 103, no: "Masa 103", durum: "rezerveli", kapasite: 6 },
  { id: 104, no: "Masa 104", durum: "temizleniyor", kapasite: 4 },
  { id: 105, no: "Masa 105", durum: "bos", kapasite: 8 },
  { id: 106, no: "Masa 106", durum: "dolu", kapasite: 2 },
];

const durumRengi = {
  bos: "#2f7d5c",
  dolu: "#b84d4d",
  rezerveli: "#d7b66f",
  temizleniyor: "#6f7b52",
};

const durumEtiketleri = {
  bos: "Bos",
  dolu: "Dolu",
  rezerveli: "Rezerveli",
  temizleniyor: "Temizleniyor",
};

const durumEslesmeleri = {
  available: "bos",
  empty: "bos",
  occupied: "dolu",
  full: "dolu",
  reserved: "rezerveli",
  cleaning: "temizleniyor",
};

const haritayaCevir = (masa) => {
  const hamDurum = (masa?.durum || "").toString().toLowerCase();
  const durum = durumEslesmeleri[hamDurum] || hamDurum || "bos";
  const masaNo = masa?.masa_no || masa?.no || masa?.ad || masa?.id;

  return {
    id: masa.id,
    no: typeof masaNo === "number" ? `Masa ${masaNo}` : `${masaNo}`,
    durum,
    kapasite: Number(masa?.kapasite || 0),
  };
};

const MasaPlani = () => {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("rysUser");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const token = localStorage.getItem("token");
  const [masalar, setMasalar] = useState(fallbackMasalar);
  const [ornekVeri, setOrnekVeri] = useState(true);

  useEffect(() => {
    let aktif = true;

    const masalariGetir = async () => {
      try {
        const response = await axios.get("/api/tables", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!aktif) {
          return;
        }

        const gelenMasalar = Array.isArray(response.data)
          ? response.data.map(haritayaCevir)
          : [];

        if (gelenMasalar.length) {
          setMasalar(gelenMasalar);
          setOrnekVeri(false);
        }
      } catch (error) {
        if (!aktif) {
          return;
        }

        console.warn("Masa verileri alinamadi, ornek gorunum kullaniliyor:", error.message);
        setOrnekVeri(true);
      }
    };

    masalariGetir();

    return () => {
      aktif = false;
    };
  }, [token]);

  const kartaTikla = (masa) => {
    const kasayaYonelebilir = user?.rol === "kasiyer" || user?.rol === "yonetici";

    if (kasayaYonelebilir && masa.durum !== "bos") {
      navigate(`/odeme/${masa.id}`);
      return;
    }

    navigate(`/siparis?masaId=${masa.id}`);
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Salon gorunumu</p>
          <h1>Masa Plani</h1>
          <p>Anlik masa durumlarini gorun, siparis ve odeme akisina dogrudan gecin.</p>
        </div>
        <div className="header-actions">
          <span className={ornekVeri ? "pill pill--warning" : "pill pill--success"}>
            {ornekVeri ? "Ornek veri" : "Canli masa verisi"}
          </span>
        </div>
      </section>

      <section className="cards-grid">
        {masalar.map((masa) => (
          <article
            key={masa.id}
            className="table-card"
            style={{ borderTop: `8px solid ${durumRengi[masa.durum] || "#7a6f64"}` }}
            onClick={() => kartaTikla(masa)}
          >
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.65)" }}>
              {masa.no}
            </p>
            <h3>{masa.kapasite} kisilik</h3>
            <p style={{ color: "rgba(255,255,255,0.76)" }}>
              {masa.durum === "bos"
                ? "Siparis ekranina hizli gecis icin karta dokunun."
                : "Acilmis hesaplari odeme ya da siparis akisina yonlendirmek icin karta dokunun."}
            </p>
            <div className="table-card__status">
              <span className="pill" style={{ background: "rgba(255,255,255,0.16)", color: "white" }}>
                {durumEtiketleri[masa.durum] || masa.durum}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default MasaPlani;
