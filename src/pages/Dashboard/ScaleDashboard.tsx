import React, { useEffect, useState } from "react";
import CameraClient from "../../components/CameraClient";
import ModalNotifikasi, { ModalStatus } from "../../components/modal/ModalNotifikasi";

interface Produk {
  kode_produk: number;
  nama_produk: string;
  harga_per_kg: number;
  path_gambar: string;
}

const API_URL = "http://192.168.10.214:4000"; // bisa taruh di .env (VITE_API_URL)

/**
 * Hapus emoji / simbol dari pesan server.
 * Regex ini menarget rentang emoji umum + simbol dingbat.
 */
const stripEmoji = (text: string) => {
  if (!text) return text;
  return text.replace(
    /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]+/gu,
    ""
  ).trim();
};

const ScaleDashboard: React.FC = () => {
  const [products, setProducts] = useState<Produk[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Produk | null>(null);
  const [weight, setWeight] = useState<number>(0);
  const [detection, setDetection] = useState<string>("-");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // state untuk modal notifikasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<ModalStatus>(null);
  const [modalMessage, setModalMessage] = useState("");

   const client_id = localStorage.getItem("client_id");
  // Load produk dari Flask
  useEffect(() => {
    fetch(`${API_URL}/api/produk`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("❌ Gagal memuat produk:", err));
  }, []);

  // Update status timbangan & deteksi tiap 1 detik
useEffect(() => {
  const interval = setInterval(() => {
    fetch(`${API_URL}/api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setWeight(data.weight);
        setDetection(data.detection);

        const found = products.find(
          (p) =>
            p.nama_produk &&
            data.detection &&
            p.nama_produk.toLowerCase() === data.detection.toLowerCase()
        );

        setCurrentProduct(found || null);
        setTotalPrice(found ? Math.round(data.weight * found.harga_per_kg) : 0);
      })
      .catch((err) => console.error("❌ Gagal update status:", err));
  }, 1000);

  return () => clearInterval(interval);
}, [products]);

  // Fungsi simpan transaksi ke DB lewat Flask
  const simpanTransaksi = async () => {
    if (!currentProduct || weight <= 0) {
      setModalStatus("warning");
      setModalMessage("Tidak ada buah terdeteksi atau berat belum valid!");
      setIsModalOpen(true);
      return;
    }

    const payload = {
      nama_produk: currentProduct.nama_produk,
      berat_kg: weight,
      harga_per_kg: currentProduct.harga_per_kg,
      total_harga: totalPrice,
    };

    try {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const res = await fetch(`${API_URL}/cetak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

      const result = await res.json();

      // Kalau backend mengembalikan pesan (mis. "✅ Transaksi ... berhasil")
      const rawMessage = result?.status || "";

      // Hapus emoji / simbol dari pesan sebelum tampilkan
      const cleaned = stripEmoji(String(rawMessage));

      // Jika backend pesan menandakan keberhasilan (heuristik: ada kata 'berhasil' atau 'success')
      if (/berhasil|success/i.test(cleaned)) {
        setModalStatus("success");
        // apabila backend memberi detail nama produk, kita pertahankan teksnya (tanpa simbol)
        setModalMessage(cleaned || `Transaksi ${currentProduct.nama_produk} berhasil disimpan!`);
      } else {
        // fallback: tampilkan pesan cleaned jika ada, atau pesan error umum
        setModalStatus("error");
        setModalMessage(cleaned || "Gagal menyimpan transaksi!");
      }
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error);
      setModalStatus("error");
      setModalMessage("Gagal terhubung ke server.");
    }

    setIsModalOpen(true);
    // NOTE: modal tidak auto-close — user menutup sendiri
  };

return (
  <div className="p-2 md:p-4">

    {/* ===== Header ===== */}
    <header className="flex flex-col md:flex-row justify-between items-center gap-2 mb-8 text-center md:text-left">
      <div className="flex items-center gap-2">
        <img src="assets/scale.png" className="w-7 h-7 md:w-10 md:h-10 object-contain" />
        <h1 className="text-xl md:text-2xl font-extrabold text-blue-800 dark:text-blue-300">
          TIMBANGAN DIGITAL AI
        </h1>
        <img src="assets/object.png" className="w-7 h-7 md:w-10 md:h-10 object-contain" />
      </div>

      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold">
        {new Date().toLocaleString("id-ID")}
      </div>
    </header>

    {/* ===== Body ===== */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

      {/* Kamera full lebar mobile */}
      <div className="md:col-span-2 bg-white border rounded-lg shadow-md overflow-hidden">
        <CameraClient />
      </div>

      {/* Panel Info */}
      <div className="space-y-3 md:space-y-4">
        <div className="p-3 md:p-4 border rounded-lg bg-gray-50">
          <label className="text-sm md:text-sm font-bold">BERAT (kg)</label>
          <p className="text-xl md:text-2xl font-bold">
            {weight > 0 ? weight.toFixed(3) : "-"}
          </p>
        </div>

        <div className="p-3 md:p-4 border rounded-lg bg-gray-50">
          <label className="text-xs md:text-sm font-bold">BUAH TERDETEKSI</label>
          <p className="text-sm md:text-xl font-bold">{detection}</p>
        </div>

        <div className="p-3 md:p-4 border rounded-lg bg-gray-50">
          <label className="text-xs md:text-sm font-bold">HARGA / KG (Rp)</label>
          <p className="text-sm md:text-xl font-bold">
            {currentProduct ? currentProduct.harga_per_kg.toLocaleString("id-ID") : "-"}
          </p>
        </div>

        <div className="w-fit mx-auto p-3 md:p-4 border-2 rounded-lg bg-blue-600 text-white font-extrabold">
          <label className="text-base md:text-sm">TOTAL HARGA (Rp)</label>
          <p className="text-xl md:text-2xl">{totalPrice.toLocaleString("id-ID")}</p>
        </div>

        <button
          onClick={simpanTransaksi}
          disabled={!currentProduct || weight <= 0}
          className="w-fit flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 hover:bg-blue-600 disabled:bg-gray-300 text-black rounded-md font-bold transition mx-auto text-sm"
        >
          <img src="assets/printer1.png" className="w-5 h-5" />
          SIMPAN & CETAK
        </button>
      </div>
    </div>

    {/* ===== Daftar Produk ===== */}
    <div className="mt-6 md:mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Daftar Produk
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((p,) => (
          <div
            key={p.kode_produk}
            className={`p-3 border rounded flex items-center gap-3 transition-transform duration-200 ${
              currentProduct?.kode_produk === p.kode_produk
                ? "bg-green-100 dark:bg-green-900 border-green-500 scale-105"
                : "bg-white dark:bg-gray-800 dark:border-gray-700 hover:scale-105"
            }`}
          >
            <img
              src={`${API_URL}/${p.path_gambar}`}
              className="h-14 w-14 md:h-14 md:w-14 object-contain"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                {p.nama_produk}
              </p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Rp {p.harga_per_kg.toLocaleString("id-ID")}/kg
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Modal */}
    <ModalNotifikasi
      isOpen={isModalOpen}
      message={modalMessage}
      status={modalStatus}
      onClose={() => setIsModalOpen(false)}
    />
  </div>
);

};

export default ScaleDashboard;
