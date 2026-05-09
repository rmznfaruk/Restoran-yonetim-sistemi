const nowIso = () => new Date().toISOString();

let categories = [
  { id: 1, ad: "Baslangic" },
  { id: 2, ad: "Corba" },
  { id: 3, ad: "Ana Yemek" },
  { id: 4, ad: "Icecek" },
  { id: 5, ad: "Tatli" },
];

let products = [
  { id: 1, kategori_id: 1, ad: "Humus", fiyat: 80, stok_miktar: 22, kritik_seviye: 8, mevcut: true },
  { id: 2, kategori_id: 2, ad: "Mercimek Corbasi", fiyat: 50, stok_miktar: 18, kritik_seviye: 6, mevcut: true },
  { id: 3, kategori_id: 3, ad: "Adana Kebap", fiyat: 250, stok_miktar: 14, kritik_seviye: 5, mevcut: true },
  { id: 4, kategori_id: 4, ad: "Ayran", fiyat: 30, stok_miktar: 40, kritik_seviye: 10, mevcut: true },
  { id: 5, kategori_id: 5, ad: "Kunefe", fiyat: 110, stok_miktar: 4, kritik_seviye: 4, mevcut: true },
];

let tables = [
  { id: 1, masa_no: 1, kapasite: 4, durum: "bos" },
  { id: 2, masa_no: 2, kapasite: 2, durum: "dolu" },
  { id: 3, masa_no: 3, kapasite: 6, durum: "rezerveli" },
  { id: 4, masa_no: 4, kapasite: 4, durum: "temizleniyor" },
  { id: 5, masa_no: 5, kapasite: 2, durum: "bos" },
];

let orders = [
  {
    id: 501,
    masa_id: 2,
    durum: "hazirlaniyor",
    toplam_tutar: 560,
    olusturma_tarihi: nowIso(),
    items: [
      { urun_id: 3, miktar: 2, fiyat: 250 },
      { urun_id: 4, miktar: 2, fiyat: 30 },
    ],
  },
];

let payments = [];

const nextId = (list) => (list.length ? Math.max(...list.map((item) => Number(item.id) || 0)) + 1 : 1);

const findCategoryById = (id) => categories.find((item) => String(item.id) === String(id)) || null;
const findCategoryByName = (name) =>
  categories.find((item) => item.ad.toLowerCase() === String(name || "").toLowerCase()) || null;
const findProductById = (id) => products.find((item) => String(item.id) === String(id)) || null;
const findTableById = (id) => tables.find((item) => String(item.id) === String(id)) || null;

const formatProduct = (product) => {
  const category = findCategoryById(product.kategori_id);

  return {
    ...product,
    kategori: category?.ad || null,
    kategori_adi: category?.ad || null,
    stok: Number(product.stok_miktar || 0),
    kritikSeviye: Number(product.kritik_seviye || 0),
    fiyat: Number(product.fiyat || 0),
  };
};

const listCategories = () => categories.map((item) => ({ ...item }));

const listProducts = ({ kategoriId } = {}) => {
  const filtered = kategoriId
    ? products.filter((item) => String(item.kategori_id) === String(kategoriId))
    : products;

  return filtered.map(formatProduct);
};

const ensureCategory = (kategoriAdi) => {
  const mevcut = findCategoryByName(kategoriAdi);

  if (mevcut) {
    return mevcut;
  }

  const yeniKategori = { id: nextId(categories), ad: kategoriAdi };
  categories = [...categories, yeniKategori];
  return yeniKategori;
};

const createProduct = ({
  ad,
  fiyat,
  kategori,
  kategori_id,
  stok = 0,
  stok_miktar,
  kritik_seviye = 10,
  mevcut = true,
}) => {
  const categoryId = kategori_id || ensureCategory(kategori || "Genel").id;
  const yeniUrun = {
    id: nextId(products),
    kategori_id: categoryId,
    ad,
    fiyat: Number(fiyat),
    stok_miktar: Number(stok_miktar ?? stok ?? 0),
    kritik_seviye: Number(kritik_seviye ?? 10),
    mevcut: mevcut !== false,
  };

  products = [...products, yeniUrun];
  return formatProduct(yeniUrun);
};

const updateProduct = (id, updates) => {
  let updated = null;

  products = products.map((item) => {
    if (String(item.id) !== String(id)) {
      return item;
    }

    const categoryId = updates.kategori_id || (updates.kategori ? ensureCategory(updates.kategori).id : item.kategori_id);

    updated = {
      ...item,
      kategori_id: categoryId,
      ad: updates.ad ?? item.ad,
      fiyat: updates.fiyat ?? item.fiyat,
      stok_miktar: Number(updates.stok_miktar ?? updates.stok ?? item.stok_miktar),
      kritik_seviye: Number(updates.kritik_seviye ?? item.kritik_seviye),
      mevcut: typeof updates.mevcut === "boolean" ? updates.mevcut : item.mevcut,
    };

    return updated;
  });

  return updated ? formatProduct(updated) : null;
};

const updateProductStock = (id, stokMiktar) => {
  let updated = null;

  products = products.map((item) => {
    if (String(item.id) !== String(id)) {
      return item;
    }

    updated = { ...item, stok_miktar: Number(stokMiktar) };
    return updated;
  });

  return updated ? formatProduct(updated) : null;
};

const deleteProduct = (id) => {
  const product = findProductById(id);

  if (!product) {
    return null;
  }

  products = products.filter((item) => String(item.id) !== String(id));
  return formatProduct(product);
};

const listTables = () => tables.map((item) => ({ ...item }));

const createTable = ({ masa_no, kapasite, durum = "bos" }) => {
  const yeniMasa = {
    id: nextId(tables),
    masa_no: Number(masa_no),
    kapasite: Number(kapasite || 0),
    durum,
  };

  tables = [...tables, yeniMasa].sort((a, b) => a.masa_no - b.masa_no);
  return { ...yeniMasa };
};

const updateTable = (id, updates) => {
  let updated = null;

  tables = tables.map((item) => {
    if (String(item.id) !== String(id)) {
      return item;
    }

    updated = { ...item, ...updates };
    return updated;
  });

  return updated ? { ...updated } : null;
};

const orderPublicShape = (order) => {
  const table = findTableById(order.masa_id);
  const kalemler = (order.items || []).map((item) => {
    const urun = findProductById(item.urun_id);
    return {
      urun_id: item.urun_id,
      urun_adi: urun?.ad || "Urun",
      ad: urun?.ad || "Urun",
      miktar: Number(item.miktar || 0),
      fiyat: Number(item.fiyat || 0),
      tutar: Number(item.miktar || 0) * Number(item.fiyat || 0),
    };
  });

  return {
    id: order.id,
    masa_id: order.masa_id,
    masa_no: table?.masa_no || order.masa_id,
    durum: order.durum,
    toplam_tutar: Number(order.toplam_tutar || 0),
    olusturma_tarihi: order.olusturma_tarihi,
    olusturma_zamani: order.olusturma_tarihi,
    urunler: kalemler,
    kalemler,
  };
};

const listOrders = () => orders.map(orderPublicShape);

const createOrder = ({ masa_id, urunler }) => {
  const toplamTutar = (urunler || []).reduce(
    (sum, item) => sum + Number(item.fiyat || 0) * Number(item.miktar || 0),
    0
  );

  const yeniSiparis = {
    id: nextId(orders),
    masa_id: Number(masa_id),
    durum: "bekliyor",
    toplam_tutar: toplamTutar,
    olusturma_tarihi: nowIso(),
    items: (urunler || []).map((item) => ({
      urun_id: Number(item.id),
      miktar: Number(item.miktar || 0),
      fiyat: Number(item.fiyat || 0),
    })),
  };

  orders = [...orders, yeniSiparis];
  updateTable(masa_id, { durum: "dolu" });
  return orderPublicShape(yeniSiparis);
};

const updateOrder = (id, updates) => {
  let updated = null;

  orders = orders.map((item) => {
    if (String(item.id) !== String(id)) {
      return item;
    }

    updated = {
      ...item,
      durum: updates.durum ?? item.durum,
      toplam_tutar: updates.toplam_tutar ?? item.toplam_tutar,
    };

    return updated;
  });

  return updated ? orderPublicShape(updated) : null;
};

const findActiveOrderByTable = (masaId) =>
  orders.find(
    (item) =>
      String(item.masa_id) === String(masaId) &&
      item.durum !== "kapali" &&
      item.durum !== "iptal"
  ) || null;

const createPayment = ({ siparis_id, masa_id, odeme_yontemi, tutar, masa_durumu = "temizleniyor" }) => {
  const aktifSiparis =
    orders.find((item) => String(item.id) === String(siparis_id)) ||
    findActiveOrderByTable(masa_id);

  if (!aktifSiparis) {
    return null;
  }

  const odeme = {
    id: nextId(payments),
    siparis_id: aktifSiparis.id,
    tutar: Number(tutar ?? aktifSiparis.toplam_tutar ?? 0),
    odeme_yontemi,
    odeme_tarihi: nowIso(),
  };

  payments = [odeme, ...payments];
  updateOrder(aktifSiparis.id, { durum: "kapali", toplam_tutar: odeme.tutar });
  updateTable(aktifSiparis.masa_id, { durum: masa_durumu });
  return { ...odeme };
};

const listPayments = () => payments.map((item) => ({ ...item }));

const buildReports = () => {
  const toplamCiro = payments.reduce((sum, item) => sum + Number(item.tutar || 0), 0);
  const siparisSayisi = orders.length;
  const ortalamaTutar = siparisSayisi ? toplamCiro / siparisSayisi : 0;

  const urunMap = new Map();
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const urun = findProductById(item.urun_id);
      const key = urun?.ad || "Urun";
      urunMap.set(key, (urunMap.get(key) || 0) + Number(item.miktar || 0));
    });
  });

  const enCokSatanlar = [...urunMap.entries()]
    .map(([ad, adet]) => ({ ad, adet }))
    .sort((a, b) => b.adet - a.adet)
    .slice(0, 5);

  return {
    toplamCiro,
    siparisSayisi,
    ortalamaTutar,
    enCokSatanlar,
    personel: [
      { ad: "Ayse Kaya", siparis: 18 },
      { ad: "Can Yildiz", siparis: 15 },
      { ad: "Mert Sahin", siparis: 9 },
    ],
  };
};

module.exports = {
  buildReports,
  createOrder,
  createPayment,
  createProduct,
  createTable,
  deleteProduct,
  findActiveOrderByTable,
  listCategories,
  listOrders,
  listPayments,
  listProducts,
  listTables,
  updateOrder,
  updateProduct,
  updateProductStock,
  updateTable,
};
