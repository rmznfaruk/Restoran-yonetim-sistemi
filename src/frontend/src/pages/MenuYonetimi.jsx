import React, { useState } from 'react';

const MenuYonetimi = () => {
    // --- STATE YÖNETİMİ ---
    const [urunler, setUrunler] = useState([
        { id: 1, ad: 'Adana Kebap', fiyat: '350', kategori: 'Ana Yemek', stok: 15 },
        { id: 2, ad: 'Mercimek Çorbası', fiyat: '80', kategori: 'Çorba', stok: 5 },
        { id: 3, ad: 'Ayran', fiyat: '50', kategori: 'İçecek', stok: 0 },
        { id: 4, ad: 'Künefe', fiyat: '120', kategori: 'Tatlı', stok: 8 }
    ]);

    const [modalAcik, setModalAcik] = useState(false);
    const [yeniUrun, setYeniUrun] = useState({ ad: '', fiyat: '', kategori: 'Ana Yemek', stok: 0 });

    // --- FONKSİYONLAR ---
    const handleUrunEkle = (e) => {
        e.preventDefault();
        setUrunler([...urunler, { ...yeniUrun, id: Date.now() }]);
        setYeniUrun({ ad: '', fiyat: '', kategori: 'Ana Yemek', stok: 0 });
        setModalAcik(false);
    };

    const handleUrunSil = (id) => {
        if (window.confirm("Bu ürünü silmek istediğine emin misin?")) {
            setUrunler(urunler.filter(u => u.id !== id));
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div className="container shadow-lg p-5 rounded-5" style={styles.containerCard}>
                
                {/* BAŞLIK VE EKLEME BUTONU */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '3rem', margin: 0 }}>Restoran Menü Paneli</h1>
                        <p className="text-muted mt-2">Ürün stoklarını ve fiyatlarını buradan anlık yönetebilirsiniz.</p>
                    </div>
                    <button className="btn btn-warning fw-bold px-4 py-2 shadow" onClick={() => setModalAcik(true)}>
                        + Yeni Ürün Ekle
                    </button>
                </div>

                <hr style={{ borderColor: 'rgba(255,215,0,0.2)', marginBottom: '40px' }} />

                {/* TABLO ALANI */}
                <div className="table-responsive rounded-4 overflow-hidden">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead className="table-light text-dark">
                            <tr style={{ height: '60px' }}>
                                <th className="ps-4">Ürün Adı</th>
                                <th>Kategori</th>
                                <th>Fiyat</th>
                                <th>Stok Durumu</th>
                                <th className="text-center">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urunler.map((u) => (
                                <tr key={u.id} style={{ height: '70px', borderBottom: '1px solid #222' }}>
                                    <td className="ps-4 fw-bold" style={{ color: '#FFD700', fontSize: '1.1rem' }}>{u.ad}</td>
                                    <td><span className="badge bg-secondary px-3 py-2">{u.kategori}</span></td>
                                    <td className="fw-bold text-white">{u.fiyat} ₺</td>
                                    <td>
                                        {u.stok === 0 ? (
                                            <span className="text-danger fw-bold">● Tükendi</span>
                                        ) : u.stok < 10 ? (
                                            <span className="text-warning fw-bold">● Kritik ({u.stok})</span>
                                        ) : (
                                            <span className="text-success fw-bold">● Yeterli ({u.stok})</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-info me-2 px-3">Düzenle</button>
                                        <button className="btn btn-sm btn-outline-danger px-3" onClick={() => handleUrunSil(u.id)}>Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EKLEME MODALI */}
            {modalAcik && (
                <div style={styles.modalOverlay}>
                    <div className="card bg-dark text-white border-warning p-4 shadow-lg" style={{ width: '450px', borderRadius: '20px' }}>
                        <h3 className="text-warning mb-4 fw-bold text-center">Yeni Ürün Ekle</h3>
                        <form onSubmit={handleUrunEkle}>
                            <div className="mb-3">
                                <label className="small text-muted mb-1">Ürün Adı</label>
                                <input type="text" className="form-control bg-dark text-white border-secondary" required 
                                    onChange={e => setYeniUrun({...yeniUrun, ad: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="small text-muted mb-1">Kategori</label>
                                <select className="form-select bg-dark text-white border-secondary" onChange={e => setYeniUrun({...yeniUrun, kategori: e.target.value})}>
                                    <option value="Ana Yemek">Ana Yemek</option>
                                    <option value="Çorba">Çorba</option>
                                    <option value="İçecek">İçecek</option>
                                    <option value="Tatlı">Tatlı</option>
                                </select>
                            </div>
                            <div className="row g-2 mb-4">
                                <div className="col-md-6">
                                    <label className="small text-muted mb-1">Fiyat (₺)</label>
                                    <input type="number" className="form-control bg-dark text-white border-secondary" required 
                                        onChange={e => setYeniUrun({...yeniUrun, fiyat: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <label className="small text-muted mb-1">Stok Adedi</label>
                                    <input type="number" className="form-control bg-dark text-white border-secondary" required 
                                        onChange={e => setYeniUrun({...yeniUrun, stok: parseInt(e.target.value)})} />
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-warning w-100 fw-bold py-2 shadow">Sisteme Kaydet</button>
                                <button type="button" className="btn btn-outline-secondary w-100 text-white" onClick={() => setModalAcik(false)}>İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    pageWrapper: { backgroundColor: '#111', minHeight: '100vh', padding: '40px' },
    containerCard: { backgroundColor: '#1a1a1a', border: '1px solid #333' },
    modalOverlay: { 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundColor: 'rgba(0,0,0,0.92)', display: 'flex', 
        justifyContent: 'center', alignItems: 'center', zIndex: 1050,
        backdropFilter: 'blur(5px)'
    }
};

export default MenuYonetimi;