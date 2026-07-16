"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, CheckCircle2, ArrowLeftRight, Loader2 } from "lucide-react";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QrScannerModal({ isOpen, onClose }: QrScannerModalProps) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanType, setScanType] = useState<"INGRESO" | "SALIDA" | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let active = true;

    if (isOpen && !scanResult) {
      setIsCameraLoading(true);
      setCameraError(null);

      const timer = setTimeout(() => {
        if (!active) return;
        
        try {
          const html5QrCode = new Html5Qrcode("reader");
          html5QrCodeRef.current = html5QrCode;

          html5QrCode.start(
            { facingMode: "environment" }, // Forces back camera!
            {
              fps: 10,
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.7;
                return { width: size, height: size };
              }
            },
            (decodedText) => {
              setScanResult(decodedText);
              stopScanner();
            },
            (errorMessage) => {
              // Ignore constant scanner log messages
            }
          )
          .then(() => {
            if (active) {
              setIsCameraLoading(false);
            }
          })
          .catch((err) => {
            console.error("Error al iniciar cámara:", err);
            if (active) {
              setCameraError("No se pudo acceder a la cámara trasera. Por favor, verifica los permisos.");
              setIsCameraLoading(false);
            }
          });
        } catch (err) {
          console.error("Error inicializando scanner:", err);
          if (active) {
            setCameraError("Error al iniciar el módulo de cámara.");
            setIsCameraLoading(false);
          }
        }
      }, 350);

      return () => {
        active = false;
        clearTimeout(timer);
        stopScanner();
      };
    }
  }, [isOpen, scanResult]);

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      const qrScanner = html5QrCodeRef.current;
      html5QrCodeRef.current = null;
      
      if (qrScanner.isScanning) {
        qrScanner.stop()
          .catch((err) => console.error("Error al detener el escáner:", err));
      }
    }
  };

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
    setIsCameraLoading(true);
    setCameraError(null);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
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
          <button onClick={handleClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center items-center">
          {!scanResult ? (
            <div className="w-full flex flex-col items-center">
              <p className="text-neutral-600 text-center mb-4 text-sm font-semibold">
                Ubica el código QR de la chaza dentro del cuadro para escanear.
              </p>
              
              {/* Camera Container */}
              <div className="relative w-full max-w-[320px] aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-inner flex items-center justify-center">
                {isCameraLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-white gap-2 z-10">
                    <Loader2 className="animate-spin text-primary-200" size={32} />
                    <span className="text-sm">Iniciando cámara trasera...</span>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-white p-4 text-center gap-2 z-10">
                    <span className="text-red-500 text-sm font-bold">{cameraError}</span>
                    <button
                      onClick={handleReset}
                      className="mt-2 bg-primary-200 hover:bg-primary-200/90 text-white text-xs px-3 py-1.5 rounded-lg"
                    >
                      Reintentar
                    </button>
                  </div>
                )}

                <div id="reader" className="w-full h-full object-cover"></div>
              </div>
              
              <p className="text-xs text-neutral-400 mt-4 text-center">
                Solo se permite el uso de la cámara trasera
              </p>
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

                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={() => handleRegisterMovement("INGRESO")}
                      className="bg-primary-200 hover:bg-primary-200/90 text-white font-bold py-3 px-6 rounded-tl-sm rounded-tr-lg rounded-br-sm rounded-bl-lg transition shadow w-full"
                    >
                      Registrar INGRESO
                    </button>
                    <button
                      onClick={() => handleRegisterMovement("SALIDA")}
                      className="bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-3 px-6 rounded-tl-sm rounded-tr-lg rounded-br-sm rounded-bl-lg transition shadow w-full"
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
                      className="bg-primary-200 hover:bg-primary-200/90 text-white font-bold py-2.5 px-6 rounded-tl-sm rounded-tr-lg rounded-br-sm rounded-bl-lg transition shadow w-full"
                    >
                      Escanear otro QR
                    </button>
                    <button
                      onClick={handleClose}
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
