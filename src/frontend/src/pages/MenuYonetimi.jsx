import React, { useState } from "react";

const MenuYonetimi = () => {
  const bootstrapLink = document.createElement("link");
  bootstrapLink.rel = "stylesheet";
  bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
  document.head.appendChild(bootstrapLink);

  const [urunler, setUrunler] = useState([
    { id: 1, ad: "Adana Kebap", fiyat: "350", kategori: "Ana Yemek", stok: 15 },
    { id: 2, ad: "Mercimek Çorbası", fiyat: "80", kategori: "Çorba", stok: 5 },
    { id: 3, ad: "Ayran", fiyat: "50", kategori: "İçecek", stok: 0 },
    { id: 4, ad: "Künefe", fiyat: "120", kategori: "Tatlı", stok: 8 },
  ]);
  const [modalAcik, setModalAcik] = useState(false);
  const [yeniUrun, setYeniUrun] = useState({ ad: "", fiyat: "", kategori: "Ana Yemek", stok: 0 });

  const urunEkle = (e) => {
    e.preventDefault();
    setUrunler([...urunler, { ...yeniUrun, id: Date.now() }]);
    setYeniUrun({ ad: "", fiyat: "", kategori: "Ana Yemek", stok: 0 });
    setModalAcik(false);
  };

  const urunSil = (id) => {
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      setUrunler(urunler.filter((u) => u.id !== id));
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", padding: "40px", fontFamily: "Segoe UI" }}>
      <div className="container shadow-lg p-5 rounded-4" style={{ backgroundColor: "#242424", color: "white" }}>
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <div>
            <h1 className="display-5 fw-bold text-warning">Restoran Menü Paneli</h1>
            <p className="text-muted mb-0">Ürünlerinizi buradan yönetebilir, fiyat ve stok güncelleyebilirsiniz.</p>
          </div>
          <button className="btn btn-warning btn-lg fw-bold shadow" onClick={() => setModalAcik(true)}>
            + Yeni Ürün Ekle
          </button>
        </div>

        <div className="table-responsive rounded-4 overflow-hidden">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Stok Durumu</th>
                <th className="text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {urunler.map((u) => (
                <tr key={u.id}>
                  <td className="ps-4 fw-semibold text-warning">{u.ad}</td>
                  <td><span className="badge bg-secondary p-2">{u.kategori}</span></td>
                  <td className="fw-bold">{u.fiyat} TL</td>
                  <td>
                    {u.stok === 0 ? (
                      <span className="text-danger fw-bold">Tükendi</span>
                    ) : u.stok < 10 ? (
                      <span className="text-warning fw-bold">Kritik ({u.stok})</span>
                    ) : (
                      <span className="text-success fw-bold">Yeterli ({u.stok})</span>
                    )}
                  </td>
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

      {modalAcik && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.9)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-warning border-2">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-warning">Yeni Ürün Ekle</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalAcik(false)} />
              </div>
              <form onSubmit={urunEkle}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label">Ürün İsmi</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      required
                      onChange={(e) => setYeniUrun({ ...yeniUrun, ad: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Kategori</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      onChange={(e) => setYeniUrun({ ...yeniUrun, kategori: e.target.value })}
                    >
                      <option value="Ana Yemek">Ana Yemek</option>
                      <option value="Çorba">Çorba</option>
                      <option value="Tatlı">Tatlı</option>
                      <option value="İçecek">İçecek</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fiyat (TL)</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      required
                      onChange={(e) => setYeniUrun({ ...yeniUrun, fiyat: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stok Adedi</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      required
                      onChange={(e) => setYeniUrun({ ...yeniUrun, stok: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalAcik(false)}>
                    İptal
                  </button>
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
