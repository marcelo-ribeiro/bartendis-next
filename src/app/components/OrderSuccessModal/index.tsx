"use client";

import { useEffect } from "react";
import { LottieAnimation } from "../LottieAnimation";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  isError: boolean;
  message?: string;
  autoCloseDuration?: number;
}

export const OrderSuccessModal = ({
  isOpen,
  onClose,
  isLoading,
  isError,
  message = "",
  autoCloseDuration = 4000,
}: OrderSuccessModalProps) => {
  // Auto-close modal after success
  useEffect(() => {
    if (isOpen && !isLoading && !isError) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isLoading, isError, onClose, autoCloseDuration]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          {isLoading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <div className="text-gray-600 text-lg font-medium">
                Processando seu pedido...
              </div>
            </div>
          ) : isError ? (
            <div className="space-y-4">
              <div className="text-red-500 text-5xl">❌</div>
              <div className="text-red-600 text-xl font-bold">
                Seu pedido não foi realizado!
              </div>
              {message && (
                <div className="text-gray-700 text-lg">{message}</div>
              )}
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <LottieAnimation />
              <div className="text-green-600 text-xl font-bold">
                Seu pedido foi realizado!
              </div>
              {message && (
                <div className="text-gray-700 text-lg">{message}</div>
              )}
              <div className="text-gray-500 text-sm">
                Esta mensagem será fechada automaticamente...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
