import React from 'react';

const MenuYonetimi = () => {
    // Serdar Kara - Menü Yönetimi Başlangıç Taslağı
    return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh', fontFamily: 'Arial' }}>
            <h1 style={{ borderBottom: '2px solid #f1c40f', color: '#f1c40f', paddingBottom: '10px' }}>
                Menü Yönetimi - Restoran Otomasyonu
            </h1>
            <p style={{ color: '#bdc3c7' }}>Nisan Ayı Hedefi: Ürün Listeleme ve Kategori Yönetimi</p>

            <div style={{ marginTop: '30px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#2c3e50' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#34495e', textAlign: 'left' }}>
                            <th style={{ padding: '15px', border: '1px solid #444' }}>Ürün Adı</th>
                            <th style={{ padding: '15px', border: '1px solid #444' }}>Fiyat</th>
                            <th style={{ padding: '15px', border: '1px solid #444' }}>Kategori</th>
                            <th style={{ padding: '15px', border: '1px solid #444' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '12px', border: '1px solid #444' }}>Adana Kebap</td>
                            <td style={{ padding: '12px', border: '1px solid #444' }}>350 TL</td>
                            <td style={{ padding: '12px', border: '1px solid #444' }}>Ana Yemek</td>
                            <td style={{ padding: '12px', border: '1px solid #444' }}>
                                <button style={{ cursor: 'pointer', padding: '5px 10px' }}>Düzenle</button>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '12px', border: '1px solid #444' }}>Mercimek Çorbası</td>
                            <td style={{ padding: '12px', border: '1px solid #444' }}>80 TL</td>
                            <td style={{ padding: '12px', border: '1px solid #444' }}>Çorba</td>
                            <td style={{ padding: '12px', border: '1px solid #444' }}>
                                <button style={{ cursor: 'pointer', padding: '5px 10px' }}>Düzenle</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style={{ marginTop: '20px' }}>
                <button style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    + Yeni Ürün Ekle (Nisan Ortası Görevi)
                </button>
            </div>
        </div>
    );
};

export default MenuYonetimi;