import React, { useState } from 'react';

const MenuYonetimi = () => {
    // --- STATE YÖNETİMİ ---
    const [urunler, setUrunler] = useState([
        { id: 1, ad: 'Adana Kebap', fiyat: '350', kategori: 'Ana Yemek', stok: 15 },
        { id: 2, ad: 'Mercimek Çorbası', fiyat: '80', kategori: 'Çorba', stok: 5 },
        { id: 3, ad: 'Ayran', fiyat: '50', kategori: 'İçecek', stok: 0 }
    ]);

    const [modalAcik, setModalAcik] = useState(false);
    const [confirmModalAcik, setConfirmModalAcik] = useState(false);
    const [duzenlemeModu, setDuzenlemeModu] = useState(false);
    const [seciliId, setSeciliId] = useState(null);
    
    const [formVeri, setFormVeri] = useState({ ad: '', fiyat: '', kategori: 'Ana Yemek', stok: 0 });

    // --- FONKSİYONLAR ---

    // Modal Açma (Ekleme veya Düzenleme için)
    const modalAc = (urun = null) => {
        if (urun) {
            setDuzenlemeModu(true);
            setSeciliId(urun.id);
            setFormVeri({ ad: urun.ad, fiyat: urun.fiyat, kategori: urun.kategori, stok: urun.stok });
        } else {
            setDuzenlemeModu(false);
            setSeciliId(null);
            setFormVeri({ ad: '', fiyat: '', kategori: 'Ana Yemek', stok: 0 });
        }
        setModalAcik(true);
    };

    // Kaydetme (Ekleme/Güncelleme)
    const handleKaydet = (e) => {
        e.preventDefault();
        if (duzenlemeModu) {
            setUrunler(urunler.map(u => u.id === seciliId ? { ...formVeri, id: seciliId } : u));
        } else {
            setUrunler([...urunler, { ...formVeri, id: Date.now() }]);
        }
        setModalAcik(false);
    };

    // Silme Onayı
    const silmeOnayiIste = (id) => {
        setSeciliId(id);
        setConfirmModalAcik(true);
    };

    const handleSilKesin = () => {
        setUrunler(urunler.filter(u => u.id !== seciliId));
        setConfirmModalAcik(false);
    };

    return (
        <div style={styles.pageWrapper}>
            <div className="container shadow-lg p-5 rounded-5" style={styles.containerCard}>
                
                {/* BAŞLIK KISMI */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '3rem', margin: 0 }}>Restoran Menü Paneli</h1>
                        {/* GÖRÜNMEYEN YAZI BURADA DÜZELTİLDİ */}
                        <p style={{ color: '#ccc', marginTop: '10px', fontSize: '1.1rem' }}>
                            Ürün stoklarını ve fiyatlarını buradan anlık yönetebilirsiniz.
                        </p>
                    </div>
                    <button className="btn btn-warning fw-bold px-4 py-2 shadow" onClick={() => modalAc()}>
                        + Yeni Ürün Ekle
                    </button>
                </div>

                <hr style={{ borderColor: 'rgba(255,215,0,0.2)', marginBottom: '40px' }} />

                {/* TABLO */}
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
                                        {u.stok === 0 ? <span className="text-danger fw-bold">● Tükendi</span> : 
                                         u.stok < 10 ? <span className="text-warning fw-bold">● Kritik ({u.stok})</span> : 
                                         <span className="text-success fw-bold">● Yeterli ({u.stok})</span>}
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-info me-2 px-3" onClick={() => modalAc(u)}>Düzenle</button>
                                        <button className="btn btn-sm btn-outline-danger px-3" onClick={() => silmeOnayiIste(u.id)}>Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- EKLE / DÜZENLE MODALI --- */}
            {modalAcik && (
                <div style={styles.modalOverlay}>
                    <div className="card bg-dark text-white border-warning p-4 shadow-lg" style={{ width: '450px', borderRadius: '20px' }}>
                        <h3 className="text-warning mb-4 fw-bold text-center">{duzenlemeModu ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}</h3>
                        <form onSubmit={handleKaydet}>
                            <div className="mb-3">
                                <label className="form-label text-warning fw-bold small">Ürün İsmi</label>
                                <input type="text" className="form-control bg-dark text-white border-secondary" 
                                    value={formVeri.ad} required placeholder="Örn: Adana Kebap"
                                    onChange={e => setFormVeri({...formVeri, ad: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-warning fw-bold small">Kategori</label>
                                <select className="form-select bg-dark text-white border-secondary" 
                                    value={formVeri.kategori} 
                                    onChange={e => setFormVeri({...formVeri, kategori: e.target.value})}>
                                    <option value="Ana Yemek">Ana Yemek</option>
                                    <option value="Çorba">Çorba</option>
                                    <option value="İçecek">İçecek</option>
                                    <option value="Tatlı">Tatlı</option>
                                </select>
                            </div>
                            <div className="row g-2 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label text-warning fw-bold small">Fiyat (₺)</label>
                                    <input type="number" className="form-control bg-dark text-white border-secondary" 
                                        value={formVeri.fiyat} required placeholder="0"
                                        onChange={e => setFormVeri({...formVeri, fiyat: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-warning fw-bold small">Stok Adedi</label>
                                    <input type="number" className="form-control bg-dark text-white border-secondary" 
                                        value={formVeri.stok} required placeholder="0"
                                        onChange={e => setFormVeri({...formVeri, stok: parseInt(e.target.value)})} />
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-warning w-100 fw-bold py-2 shadow">
                                    {duzenlemeModu ? 'Değişiklikleri Kaydet' : 'Sisteme Ekle'}
                                </button>
                                <button type="button" className="btn btn-outline-secondary w-100 text-white" onClick={() => setModalAcik(false)}>İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- ÖZEL SİLME ONAY MODALI --- */}
            {confirmModalAcik && (
                <div style={styles.modalOverlay}>
                    <div className="card bg-dark text-white border-danger p-4 shadow-lg text-center" style={{ width: '350px', borderRadius: '15px' }}>
                        <h4 className="fw-bold text-danger mb-3">Emin misiniz?</h4>
                        <p style={{color: '#ccc'}}>Bu ürünü menüden kalıcı olarak silmek üzeresiniz.</p>
                        <div className="d-flex gap-2 mt-4">
                            <button className="btn btn-danger w-100 fw-bold" onClick={handleSilKesin}>Evet, Sil</button>
                            <button className="btn btn-outline-secondary w-100 text-white" onClick={() => setConfirmModalAcik(false)}>Vazgeç</button>
                        </div>
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
        backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', 
        justifyContent: 'center', alignItems: 'center', zIndex: 1050,
        backdropFilter: 'blur(5px)'
    }
};

export default MenuYonetimi;