import React from "react";

// Tambahkan "info" ke dalam tipe
export type ModalStatus = "success" | "error" | "warning" | "info" | null;

interface ModalNotifikasiProps {
  isOpen: boolean;
  message: string;
  status: ModalStatus;
  onClose: () => void;
}

// Gaya dan ikon untuk setiap status
const getStyles = (status: ModalStatus) => {
  switch (status) {
    case "success":
      return {
        bgColor: "bg-green-100 dark:bg-green-900",
        textColor: "text-green-800 dark:text-green-200",
        icon: "assets/berhasil.png",
      };
    case "error":
      return {
        bgColor: "bg-red-100 dark:bg-red-900",
        textColor: "text-red-800 dark:text-red-200",
        icon: "assets/gagal.png",
      };
    case "warning":
      return {
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        textColor: "text-yellow-800 dark:text-yellow-200",
        icon: "assets/hatihati.png",
      };
    case "info":
      return {
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-200",
        icon: "assets/info.png",
      };
    default:
      return {
        bgColor: "bg-gray-100 dark:bg-gray-700",
        textColor: "text-gray-800 dark:text-gray-200",
        icon: "assets/info.png",
      };
  }
};

const ModalNotifikasi: React.FC<ModalNotifikasiProps> = ({
  isOpen,
  message,
  status,
  onClose,
}) => {
  if (!isOpen) return null;

  const { bgColor, textColor, icon } = getStyles(status);

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-[9999] overflow-y-auto p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`p-4 sm:p-6 rounded-2xl w-[90%] max-w-sm shadow-2xl transform transition-all duration-300 scale-100 ${bgColor}`}
      >
        <div className="flex flex-col items-center">

          {/* Ikon PNG responsif */}
          <img
            src={icon}
            alt={status || "info"}
            className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 object-contain"
          />

          {/* Pesan responsif */}
          <p
            className={`text-base sm:text-lg font-semibold text-center mb-4 ${textColor}`}
          >
            {message}
          </p>

          {/* Tombol close responsif */}
          <button
            onClick={onClose}
            className={`mt-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg font-medium transition-colors duration-200 
            ${
              status === "success"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }
            ${
              status === "error"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : ""
            }
            ${
              status === "warning"
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : ""
            }
            ${
              status === "info"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : ""
            }`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNotifikasi;
