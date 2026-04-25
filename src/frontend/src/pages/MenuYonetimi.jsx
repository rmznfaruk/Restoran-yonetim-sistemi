import React, { useState } from 'react';

const MenuYonetimi = () => {
    // Bootstrap'i CDN üzerinden sayfaya basıyoruz (Stillerin kesin çalışması için)
    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    document.head.appendChild(bootstrapLink);

    const [urunler, setUrunler] = useState([
        { id: 1, ad: 'Adana Kebap', fiyat: '350', kategori: 'Ana Yemek' },
        { id: 2, ad: 'Mercimek Çorbası', fiyat: '80', kategori: 'Çorba' }
    ]);

    const [modalAcik, setModalAcik] = useState(false);
    const [yeniUrun, setYeniUrun] = useState({ ad: '', fiyat: '', kategori: 'Ana Yemek' });

    const urunEkle = (e) => {
        e.preventDefault();
        setUrunler([...urunler, { ...yeniUrun, id: Date.now() }]);
        setYeniUrun({ ad: '', fiyat: '', kategori: 'Ana Yemek' });
        setModalAcik(false);
    };

    const urunSil = (id) => {
        if(window.confirm("Bu ürünü silmek istediğine emin misin?")) {
            setUrunler(urunler.filter(u => u.id !== id));
        }
    };

    return (
        <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', padding: '40px', fontFamily: 'Segoe UI' }}>
            <div className="container shadow-lg p-5 rounded-4" style={{ backgroundColor: '#242424', color: 'white' }}>
                
                {/* BAŞLIK KISMI */}
                <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                    <div>
                        <h1 className="display-5 fw-bold text-warning">Restoran Menü Paneli</h1>
                        <p className="text-muted mb-0">Ürünlerinizi buradan yönetebilir, fiyat güncelleyebilirsiniz.</p>
                    </div>
                    <button className="btn btn-warning btn-lg fw-bold shadow" onClick={() => setModalAcik(true)}>
                        + Yeni Ürün Ekle
                    </button>
                </div>

                {/* TABLO */}
                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Ürün Adı</th>
                                <th>Kategori</th>
                                <th>Fiyat</th>
                                <th className="text-center">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urunler.map((u) => (
                                <tr key={u.id}>
                                    <td className="ps-4 fw-semibold text-warning">{u.ad}</td>
                                    <td><span className="badge bg-secondary p-2">{u.kategori}</span></td>
                                    <td className="fw-bold">{u.fiyat} ₺</td>
                                    <td className="text-center">
                                        <button className="btn btn-outline-info btn-sm me-2">Düzenle</button>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => urunSil(u.id)}>Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODERN MODAL */}
            {modalAcik && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white border-warning border-2">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-warning">Yeni Ürün Ekle</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setModalAcik(false)}></button>
                            </div>
                            <form onSubmit={urunEkle}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label">Ürün İsmi</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary" required 
                                            onChange={(e) => setYeniUrun({...yeniUrun, ad: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Kategori</label>
                                        <select className="form-select bg-dark text-white border-secondary" 
                                            onChange={(e) => setYeniUrun({...yeniUrun, kategori: e.target.value})}>
                                            <option value="Ana Yemek">Ana Yemek</option>
                                            <option value="Çorba">Çorba</option>
                                            <option value="Tatlı">Tatlı</option>
                                            <option value="İçecek">İçecek</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fiyat (₺)</label>
                                        <input type="number" className="form-control bg-dark text-white border-secondary" required
                                            onChange={(e) => setYeniUrun({...yeniUrun, fiyat: e.target.value})} />
                                    </div>
                                </div>
                                <div className="modal-footer border-secondary">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setModalAcik(false)}>İptal</button>
                                    <button type="submit" className="btn btn-warning px-4 fw-bold">Kaydet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuYonetimi;