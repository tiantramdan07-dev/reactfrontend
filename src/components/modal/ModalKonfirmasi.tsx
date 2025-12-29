import React from "react";

interface ModalKonfirmasiProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ModalKonfirmasi: React.FC<ModalKonfirmasiProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
}) => {
  if (!isOpen) return null;

  const handleContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300"
      onClick={onCancel}
    >
      <div
        onClick={handleContentClick}
        className="
          p-4 sm:p-6
          rounded-lg
          w-[90%] sm:w-[400px] md:w-[450px]
          shadow-2xl
          transform transition-all duration-300
          scale-100
          bg-amber-100 dark:bg-amber-900
        "
      >
        <div className="flex flex-col items-center">
          <img
            src='assets/pertanyaan.png'
            alt='Icon Konfirmasi'
            className="w-12 h-12 sm:w-14 sm:h-14 mb-4"
          />

          <p className="
            text-base sm:text-lg md:text-xl
            font-semibold text-center mb-4
            text-amber-800 dark:text-amber-100
          ">
            {message}
          </p>

          <div
            className="
              flex flex-col sm:flex-row
              gap-3 sm:gap-4
              mt-4
              w-full
              justify-center
            "
          >
            {/* Tombol Konfirmasi */}
            <button
              onClick={onConfirm}
              className="
                flex-1 px-3 sm:px-4 py-2
                rounded-lg font-medium text-white
                transition-colors duration-200
                bg-amber-600 hover:bg-amber-700
                text-sm sm:text-base
              "
            >
              {confirmText}
            </button>

            {/* Tombol Batal */}
            <button
              onClick={onCancel}
              className="
                flex-1 px-3 sm:px-4 py-2
                rounded-lg font-medium
                transition-colors duration-200
                bg-amber-200 hover:bg-amber-300 text-amber-800
                dark:bg-amber-800 dark:hover:bg-amber-700 dark:text-amber-100
                text-sm sm:text-base
              "
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalKonfirmasi;
