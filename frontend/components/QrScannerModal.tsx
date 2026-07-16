"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X, CheckCircle2, ArrowLeftRight } from "lucide-react";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QrScannerModal({ isOpen, onClose }: QrScannerModalProps) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanType, setScanType] = useState<"INGRESO" | "SALIDA" | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isOpen && !scanResult) {
      // Small timeout to ensure container is rendered
      const timer = setTimeout(() => {
        try {
          const scanner = new Html5QrcodeScanner(
            "reader",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              rememberLastUsedCamera: true,
              supportedScanTypes: [0] // Html5QrcodeScanType.SCAN_TYPE_CAMERA
            },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              setScanResult(decodedText);
              // Clear scanner once scan is successful
              scanner.clear().catch(err => console.error("Failed to clear scanner", err));
            },
            (errorMessage) => {
              // Ignore constant scanner scanning logs
            }
          );

          scannerRef.current = scanner;
        } catch (err) {
          console.error("Error starting QR scanner:", err);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner in cleanup", err));
          scannerRef.current = null;
        }
      };
    }
  }, [isOpen, scanResult]);

  const handleRegisterMovement = (type: "INGRESO" | "SALIDA") => {
    setScanType(type);
    
    // Simulate successful API response
    setTimeout(() => {
      setStatusMessage({
        type: "success",
        text: `Se registró exitosamente la ${type === "INGRESO" ? "ENTRADA" : "SALIDA"} para la chaza con ID/QR: "${scanResult}".`
      });
    }, 800);
  };

  const handleReset = () => {
    setScanResult(null);
    setScanType(null);
    setStatusMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-primary-200 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={22} />
            <h2 className="text-xl font-bold font-sans">Escanear Código QR</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center items-center">
          {!scanResult ? (
            <div className="w-full flex flex-col items-center">
              <p className="text-neutral-600 text-center mb-4 text-sm">
                Coloca el código QR de la chaza frente a la cámara de tu celular.
              </p>
              
              {/* Target Reader Container */}
              <div 
                id="reader" 
                className="w-full max-w-[320px] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 shadow-inner"
              ></div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center py-4">
              {!statusMessage ? (
                <div className="w-full text-center">
                  <div className="w-16 h-16 bg-primary-200/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-200">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800">¡QR Detectado!</h3>
                  <div className="bg-neutral-100 rounded-lg p-3 my-4 font-mono text-sm text-neutral-700 break-all select-all border border-neutral-200">
                    {scanResult}
                  </div>
                  <p className="text-neutral-600 text-sm mb-6">
                    ¿Qué acción deseas registrar para esta chaza?
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleRegisterMovement("INGRESO")}
                      className="bg-primary-200 text-white font-bold py-3 px-6 rounded-tl-sm rounded-tr-lg rounded-br-sm rounded-bl-lg hover:bg-primary-200/90 transition shadow w-full"
                    >
                      Registrar INGRESO
                    </button>
                    <button
                      onClick={() => handleRegisterMovement("SALIDA")}
                      className="bg-neutral-800 text-white font-bold py-3 px-6 rounded-tl-sm rounded-tr-lg rounded-br-sm rounded-bl-lg hover:bg-neutral-900 transition shadow w-full"
                    >
                      Registrar SALIDA
                    </button>
                    <button
                      onClick={handleReset}
                      className="text-neutral-500 text-sm font-semibold hover:underline mt-2"
                    >
                      Escanear otro código
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle2 size={40} className="animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black text-green-600">Registro Exitoso</h3>
                  <p className="text-neutral-700 my-4 px-2 leading-relaxed text-sm bg-green-50/50 border border-green-200 p-4 rounded-xl">
                    {statusMessage.text}
                  </p>

                  <div className="flex flex-col gap-3 mt-6 w-full">
                    <button
                      onClick={handleReset}
                      className="bg-primary-200 text-white font-bold py-2.5 px-6 rounded-tl-sm rounded-tr-lg rounded-br-sm rounded-bl-lg hover:bg-primary-200/90 transition shadow w-full"
                    >
                      Escanear otro QR
                    </button>
                    <button
                      onClick={onClose}
                      className="text-neutral-600 text-sm font-semibold hover:underline"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
