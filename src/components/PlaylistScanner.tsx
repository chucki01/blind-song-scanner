import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Logo } from "./Logo.tsx";

interface PlaylistScannerProps {
  onPlaylistScanned: (playlistUrl: string) => void;
  onError: () => void;
  onCancel: () => void;
}

export const PlaylistScanner: React.FC<PlaylistScannerProps> = ({
  onPlaylistScanned,
  onError,
  onCancel,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [invalidQr, setInvalidQr] = useState(false);

  const handleScan = (result: string) => {
    if (result?.includes("open.spotify.com/playlist/")) {
      onPlaylistScanned(result);
    } else {
      setInvalidQr(true);
      // Vuelve a escanear automáticamente después de 2 segundos
      setTimeout(() => setInvalidQr(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto p-6">

      <Logo />

      {/* Escáner activo */}
      {isScanning && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-full rounded-2xl overflow-hidden relative"
            style={{
              border: invalidQr ? "1.5px solid rgba(232,23,93,0.6)" : "1.5px solid rgba(232,23,93,0.2)",
              boxShadow: invalidQr ? "0 0 30px rgba(232,23,93,0.15)" : "0 0 40px rgba(232,23,93,0.06)",
              transition: "border 0.3s, box-shadow 0.3s",
            }}>
            <QrScanner
              onDecode={handleScan}
              onError={() => onError()}
              scanDelay={500}
              hideCount
              audio={false}
              constraints={{ facingMode: "environment" }}
            />
            {/* Mensaje de error superpuesto */}
            {invalidQr && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(232,23,93,0.75)" }}>
                <div className="text-center px-4">
                  <p className="text-white font-bold text-lg" style={{ fontFamily: "'Russo One', sans-serif" }}>
                    QR NO VÁLIDO
                  </p>
                  <p className="text-white text-sm mt-1" style={{ opacity: 0.85 }}>
                    Usa el QR de una playlist de Spotify
                  </p>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-center" style={{ color: "rgba(0,0,0,0.3)" }}>
            {invalidQr ? "Buscando nuevo QR..." : "Apunta al QR de tu playlist de Spotify"}
          </p>
        </div>
      )}

      {/* Botón inicial */}
      {!isScanning && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsScanning(true)}
            className="relative flex items-center justify-center rounded-2xl transition-all hover:scale-[1.04] active:scale-[0.97]"
            style={{
              width: "140px", height: "140px",
              background: "rgba(232,23,93,0.07)",
              border: "1.5px solid rgba(232,23,93,0.25)",
              animation: "redPulse 2.5s ease-in-out infinite",
            }}
          >
            <span className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: "2px solid #E8175D", borderLeft: "2px solid #E8175D" }} />
            <span className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: "2px solid #E8175D", borderRight: "2px solid #E8175D" }} />
            <span className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: "2px solid #E8175D", borderLeft: "2px solid #E8175D" }} />
            <span className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: "2px solid #E8175D", borderRight: "2px solid #E8175D" }} />
            <span style={{ fontSize: "48px" }}>🎵</span>
          </button>
          <span className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#E8175D", letterSpacing: "0.25em", fontFamily: "'Russo One', sans-serif" }}>
            Escanear QR Bingo
          </span>
        </div>
      )}

      <p className="text-sm text-center" style={{ color: "rgba(0,0,0,0.25)" }}>
        Previews de 30 segundos · Funciona para todos
      </p>

      <button onClick={onCancel}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(0,0,0,0.25)" }}>
        ← Cambiar modo
      </button>
    </div>
  );
};
