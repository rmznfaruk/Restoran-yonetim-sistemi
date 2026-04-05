-- 1. Personel Tablosu
CREATE TABLE personel (
    id SERIAL PRIMARY KEY,
    kullanici_adi VARCHAR(50) UNIQUE NOT NULL,
    sifre_hash TEXT NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('garson', 'kasiyer', 'mutfak', 'yonetici')) NOT NULL,
    hatali_giris INT DEFAULT 0,
    kilit_bitis TIMESTAMP
);

-- 2. Masalar Tablosu
CREATE TABLE masalar (
    id SERIAL PRIMARY KEY,
    masa_no INT UNIQUE NOT NULL,
    durum VARCHAR(20) CHECK (durum IN ('bos', 'dolu', 'rezerveli', 'temizleniyor')) DEFAULT 'bos'
);

-- 3. Kategoriler Tablosu
CREATE TABLE kategoriler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL
);

-- 4. Ürünler Tablosu
CREATE TABLE urunler (
    id SERIAL PRIMARY KEY,
    kategori_id INT REFERENCES kategoriler(id) ON DELETE CASCADE,
    ad VARCHAR(100) NOT NULL,
    fiyat DECIMAL(10,2) NOT NULL,
    stok_miktar INT NOT NULL,
    kritik_seviye INT NOT NULL,
    mevcut BOOLEAN DEFAULT true
);

-- 5. Siparişler Tablosu
CREATE TABLE siparisler (
    id SERIAL PRIMARY KEY,
    masa_id INT REFERENCES masalar(id) ON DELETE CASCADE,
    durum VARCHAR(20) CHECK (durum IN ('bekliyor', 'hazirlaniyor', 'hazir', 'teslim', 'kapali', 'iptal')) DEFAULT 'bekliyor',
    toplam_tutar DECIMAL(10,2) DEFAULT 0,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Sipariş Kalemleri Tablosu
CREATE TABLE siparis_kalemleri (
    id SERIAL PRIMARY KEY,
    siparis_id INT REFERENCES siparisler(id) ON DELETE CASCADE,
    urun_id INT REFERENCES urunler(id) ON DELETE CASCADE,
    miktar INT NOT NULL,
    fiyat DECIMAL(10,2) NOT NULL
);

-- 7. Ödemeler Tablosu
CREATE TABLE odemeler (
    id SERIAL PRIMARY KEY,
    siparis_id INT REFERENCES siparisler(id) ON DELETE CASCADE,
    tutar DECIMAL(10,2) NOT NULL,
    odeme_yontemi VARCHAR(20) CHECK (odeme_yontemi IN ('nakit', 'kart', 'mobil')) NOT NULL,
    odeme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);