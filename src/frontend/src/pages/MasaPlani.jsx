import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MasaPlani = () => {
  const navigate = useNavigate();
  const [masalar] = useState([
    { id: 101, no: "Masa 101", durum: "boş", kapasite: 4 },
    { id: 102, no: "Masa 102", durum: "dolu", kapasite: 2 },
    { id: 103, no: "Masa 103", durum: "rezerveli", kapasite: 6 },
    { id: 104, no: "Masa 104", durum: "temizleniyor", kapasite: 4 },
    { id: 105, no: "Masa 105", durum: "boş", kapasite: 8 },
    { id: 106, no: "Masa 106", durum: "dolu", kapasite: 2 },
  ]);

  const durumRengi = (durum) => {
    if (durum === "boş") return "#28a745";
    if (durum === "dolu") return "#dc3545";
    if (durum === "rezerveli") return "#ffc107";
    return "#6c757d";
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", padding: "40px", color: "white" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-warning display-4">Masa Planı</h1>
          <div className="d-flex gap-3">
            <span className="badge bg-success">Boş</span>
            <span className="badge bg-danger">Dolu</span>
            <span className="badge bg-warning text-dark">Rezerveli</span>
            <span className="badge bg-secondary">Temizleniyor</span>
          </div>
        </div>

        <div className="row g-4">
          {masalar.map((masa) => (
            <div key={masa.id} className="col-md-3 col-6">
              <div
                className="card shadow-lg border-0 text-center p-4"
                style={{
                  backgroundColor: "#1a1a1a",
                  cursor: "pointer",
                  borderTop: `8px solid ${durumRengi(masa.durum)}`,
                  transition: "transform 0.2s",
                }}
                onClick={() => navigate(`/siparis?masaId=${masa.id}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <h3 className="text-white mb-2">{masa.no}</h3>
                <p className="text-muted mb-3">{masa.kapasite} Kişilik</p>
                <div className="fw-bold text-uppercase" style={{ color: durumRengi(masa.durum) }}>
                  {masa.durum}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasaPlani;
