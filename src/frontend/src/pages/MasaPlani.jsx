import React, { useState } from 'react';

const MasaPlani = () => {

    const [masalar, setMasalar] = useState([
        { id: 1, no: "Masa 1", durum: "boş", kapasite: 4 },
        { id: 2, no: "Masa 2", durum: "dolu", kapasite: 2 },
        { id: 3, no: "Masa 3", durum: "rezerve", kapasite: 6 },
        { id: 4, no: "Masa 4", durum: "boş", kapasite: 4 },
        { id: 5, no: "Masa 5", durum: "dolu", kapasite: 8 },
        { id: 6, no: "Masa 6", durum: "boş", kapasite: 2 },
    ]);

    const durumRengi = (durum) => {
        if (durum === "boş") return "#28a745"; 
        if (durum === "dolu") return "#dc3545"; 
        return "#ffc107"; 
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '40px', color: 'white' }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h1 className="fw-bold text-warning display-4">Masa Planı</h1>
                    <div className="d-flex gap-3">
                        <span className="badge bg-success">Boş</span>
                        <span className="badge bg-danger">Dolu</span>
                        <span className="badge bg-warning text-dark">Rezerve</span>
                    </div>
                </div>

                <div className="row g-4">
                    {masalar.map((masa) => (
                        <div key={masa.id} className="col-md-3 col-6">
                            <div 
                                className="card shadow-lg border-0 text-center p-4"
                                style={{ 
                                    backgroundColor: '#1a1a1a', 
                                    cursor: 'pointer',
                                    borderTop: `8px solid ${durumRengi(masa.durum)}`,
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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