import React, { useState, useEffect } from 'react';

const StokTakip = () => {
    // PDF'e uygun test verileri (Yusuf API'yi bitirince bunlar otomatik dolacak)
    const [urunler, setUrunler] = useState([
        { id: 1, ad: 'Kıyma (Dana)', stok: 5, kritikSeviye: 10 }, // KRİTİK (Kırmızı)
        { id: 2, ad: 'Domates', stok: 12, kritikSeviye: 10 },     // YAKIN (Sarı)
        { id: 3, ad: 'Ekmek', stok: 50, kritikSeviye: 20 },      // NORMAL
        { id: 4, ad: 'Ayran', stok: 0, kritikSeviye: 5 }         // TÜKENDİ (Kırmızı)
    ]);

    const [sadeceKritik, setSadeceKritik] = useState(false); // Filtreleme state'i

    // Stok Güncelleme Fonksiyonu[cite: 2]
    const handleStokGuncelle = (id, yeniMiktar) => {
        setUrunler(urunler.map(u => 
            u.id === id ? { ...u, stok: parseInt(yeniMiktar) } : u
        ));
        // Buraya ileride Yusuf'un PATCH /api/products/:id/stok isteği gelecek[cite: 2]
    };

    // PDF Renk Mantığı: Kritikse Kırmızı, 1.5 katı altındaysa Sarı[cite: 2]
    const satırStiliAl = (urun) => {
        if (urun.stok <= urun.kritikSeviye) return { backgroundColor: 'rgba(220, 53, 69, 0.2)', borderLeft: '5px solid #dc3545' };
        if (urun.stok <= urun.kritikSeviye * 1.5) return { backgroundColor: 'rgba(255, 193, 7, 0.1)', borderLeft: '5px solid #ffc107' };
        return { borderLeft: '5px solid #28a745' };
    };

    return (
        <div style={styles.pageWrapper}>
            <div className="container shadow-lg p-5 rounded-5" style={styles.containerCard}>
                
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '3rem', margin: 0 }}>Stok Takip Paneli</h1>
                        <p style={{ color: '#ccc', marginTop: '10px' }}>Malzeme seviyelerini izleyin ve kritik uyarıları yönetin[cite: 1].</p>
                    </div>
                    {/* PDF Filtreleme Onay Kutusu[cite: 2] */}
                    <div className="form-check form-switch bg-dark p-3 rounded-3 border border-secondary">
                        <input className="form-check-input" type="checkbox" role="switch" 
                            onChange={(e) => setSadeceKritik(e.target.checked)} />
                        <label className="form-check-label text-white ms-2 fw-bold">Sadece Kritik Ürünler</label>
                    </div>
                </div>

                <div className="table-responsive rounded-4 overflow-hidden">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead className="table-light text-dark">
                            <tr style={{ height: '60px' }}>
                                <th className="ps-4">Malzeme Adı</th>
                                <th>Mevcut Stok</th>
                                <th>Kritik Seviye</th>
                                <th>Durum</th>
                                <th className="text-center">Stok Ekle/Çıkar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urunler
                                .filter(u => sadeceKritik ? u.stok <= u.kritikSeviye : true)
                                .map((u) => (
                                <tr key={u.id} style={{ ...satırStiliAl(u), height: '70px' }}>
                                    <td className="ps-4 fw-bold" style={{ color: '#FFD700' }}>{u.ad}</td>
                                    <td className="fw-bold">{u.stok} Adet</td>
                                    <td className="text-muted">{u.kritikSeviye} Adet</td>
                                    <td>
                                        {u.stok <= u.kritikSeviye ? (
                                            <span className="text-danger fw-bold">⚠ KRİTİK SEVİYE[cite: 2]</span>
                                        ) : u.stok <= u.kritikSeviye * 1.5 ? (
                                            <span className="text-warning fw-bold">● Azalıyor</span>
                                        ) : (
                                            <span className="text-success fw-bold">● Güvenli</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <input type="number" className="form-control form-control-sm bg-dark text-white border-secondary w-25 text-center" 
                                                defaultValue={u.stok} id={`input-${u.id}`} />
                                            <button className="btn btn-sm btn-warning fw-bold px-3" 
                                                onClick={() => handleStokGuncelle(u.id, document.getElementById(`input-${u.id}`).value)}>
                                                Güncelle[cite: 2]
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { backgroundColor: '#111', minHeight: '100vh', padding: '40px' },
    containerCard: { backgroundColor: '#1a1a1a', border: '1px solid #333' }
};

export default StokTakip;