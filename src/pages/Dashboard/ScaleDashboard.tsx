import React, { useEffect, useState } from "react";
import CameraClient from "../../components/CameraClient";
import ModalNotifikasi, { ModalStatus } from "../../components/modal/ModalNotifikasi";

interface Produk {
  kode_produk: number;
  nama_produk: string;
  harga_per_kg: number;
  path_gambar: string;
}

const API_URL = "http://192.168.10.215:4000";

/* =========================
   HAPUS EMOJI DARI PESAN
========================= */
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

  /* ===== CLOCK REALTIME (INI KUNCI PERBAIKAN) ===== */
  const [now, setNow] = useState<Date>(new Date());

  /* ===== MODAL ===== */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<ModalStatus>(null);
  const [modalMessage, setModalMessage] = useState("");

  const client_id = localStorage.getItem("client_id");

  /* =========================
     LOAD PRODUK
  ========================= */
  useEffect(() => {
    fetch(`${API_URL}/api/produk`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("❌ Gagal memuat produk:", err));
  }, []);

  /* =========================
     CLOCK REALTIME (JALAN TERUS)
  ========================= */
  useEffect(() => {
    const clock = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  /* =========================
     UPDATE STATUS TIMBANGAN
  ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/api/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setWeight(data.weight ?? 0);
          setDetection(data.detection ?? "-");

          const found = products.find(
            (p) =>
              p.nama_produk &&
              data.detection &&
              p.nama_produk.toLowerCase() === data.detection.toLowerCase()
          );

          setCurrentProduct(found || null);
          setTotalPrice(
            found ? Math.round((data.weight ?? 0) * found.harga_per_kg) : 0
          );
        })
        .catch((err) =>
          console.error("❌ Gagal update status:", err)
        );
    }, 1000);

    return () => clearInterval(interval);
  }, [products, client_id]);

  /* =========================
     SIMPAN TRANSAKSI
  ========================= */
  const simpanTransaksi = async () => {
    if (!currentProduct || weight <= 0) {
      setModalStatus("warning");
      setModalMessage("Tidak ada buah terdeteksi atau berat belum valid!");
      setIsModalOpen(true);
      return;
    }

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
        body: JSON.stringify({
          nama_produk: currentProduct.nama_produk,
          berat_kg: weight,
          harga_per_kg: currentProduct.harga_per_kg,
          total_harga: totalPrice,
        }),
      });

      const result = await res.json();
      const cleaned = stripEmoji(result?.status || "");

      if (/berhasil|success/i.test(cleaned)) {
        setModalStatus("success");
        setModalMessage(cleaned);
      } else {
        setModalStatus("error");
        setModalMessage(cleaned || "Gagal menyimpan transaksi!");
      }
    } catch {
      setModalStatus("error");
      setModalMessage("Gagal terhubung ke server.");
    }

    setIsModalOpen(true);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="p-2 md:p-4">
      {/* ===== HEADER ===== */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold text-blue-800">
          TIMBANGAN DIGITAL AI
        </h1>

        {/* ⏰ REALTIME CLOCK */}
        <div className="text-xs md:text-sm font-bold text-gray-500">
          {now.toLocaleString("id-ID")}
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 border rounded">
          <CameraClient />
        </div>

        <div className="space-y-3">
          <div className="p-3 border rounded">
            <label className="font-bold">BERAT (kg)</label>
            <p className="text-2xl font-bold">
              {weight.toFixed(3)}
            </p>
          </div>

          <div className="p-3 border rounded">
            <label className="font-bold">BUAH</label>
            <p className="text-xl font-bold">{detection}</p>
          </div>

          <div className="p-3 border rounded bg-blue-600 text-white">
            <label className="font-bold">TOTAL (Rp)</label>
            <p className="text-2xl">
              {totalPrice.toLocaleString("id-ID")}
            </p>
          </div>

          <button
            onClick={simpanTransaksi}
            disabled={!currentProduct || weight <= 0}
            className="w-full py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            SIMPAN & CETAK
          </button>
        </div>
      </div>

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
