import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const masaVerileri = [
  { id: 101, no: "Masa 101", durum: "boş", kapasite: 4 },
  { id: 102, no: "Masa 102", durum: "dolu", kapasite: 2 },
  { id: 103, no: "Masa 103", durum: "rezerveli", kapasite: 6 },
  { id: 104, no: "Masa 104", durum: "temizleniyor", kapasite: 4 },
  { id: 105, no: "Masa 105", durum: "boş", kapasite: 8 },
  { id: 106, no: "Masa 106", durum: "dolu", kapasite: 2 },
];

const durumRengi = {
  boş: "#2f7d5c",
  dolu: "#b84d4d",
  rezerveli: "#d7b66f",
  temizleniyor: "#6f7b52",
};

const MasaPlani = () => {
  const navigate = useNavigate();
  const [masalar] = useState(masaVerileri);

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Salon görünümü</p>
          <h1>Masa Planı</h1>
          <p>Anlık masa durumlarını görün, sipariş akışına doğrudan geçin.</p>
        </div>
      </section>

      <section className="cards-grid">
        {masalar.map((masa) => (
          <article
            key={masa.id}
            className="table-card"
            style={{ borderTop: `8px solid ${durumRengi[masa.durum]}` }}
            onClick={() => navigate(`/siparis?masaId=${masa.id}`)}
          >
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.65)" }}>{masa.no}</p>
            <h3>{masa.kapasite} kişilik</h3>
            <p style={{ color: "rgba(255,255,255,0.76)" }}>
              Sipariş ekranına hızlı geçiş için karta dokunun.
            </p>
            <div className="table-card__status">
              <span className="pill" style={{ background: "rgba(255,255,255,0.16)", color: "white" }}>
                {masa.durum}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default MasaPlani;
