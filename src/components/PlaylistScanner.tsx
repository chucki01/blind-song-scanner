import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

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

  const handleScan = (result: string) => {
    if (result?.includes("open.spotify.com/playlist/")) {
      onPlaylistScanned(result);
    } else {
      alert("Escanea el QR de una playlist de Spotify");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto p-6">

      {isScanning ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{ border: "1.5px solid rgba(232,23,93,0.2)", boxShadow: "0 0 40px rgba(232,23,93,0.06)" }}
          >
            <QrScanner
              onDecode={handleScan}
              onError={() => onError()}
              scanDelay={500}
              hideCount
              audio={false}
              constraints={{ facingMode: "environment" }}
            />
          </div>
          <p className="text-sm text-center" style={{ color: "rgba(0,0,0,0.3)" }}>
            Apunta al QR de tu playlist de Spotify
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsScanning(true)}
            className="relative flex items-center justify-center rounded-2xl transition-all hover:scale-[1.04] active:scale-[0.97]"
            style={{
              width: "140px",
              height: "140px",
              background: "rgba(232,23,93,0.07)",
              border: "1.5px solid rgba(232,23,93,0.25)",
              animation: "redPulse 2.5s ease-in-out infinite",
            }}
          >
            <span className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: "2px solid #E8175D", borderLeft: "2px solid #E8175D" }} />
            <span className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: "2px solid #E8175D", borderRight: "2px solid #E8175D" }} />
            <span className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: "2px solid #E8175D", borderLeft: "2px solid #E8175D" }} />
            <span className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: "2px solid #E8175D", borderRight: "2px solid #E8175D" }} />

            <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="#E8175D" strokeWidth="2" fill="none"/>
              <rect x="8" y="8" width="8" height="8" rx="1" fill="#E8175D"/>
              <rect x="28" y="4" width="16" height="16" rx="2" stroke="#E8175D" strokeWidth="2" fill="none"/>
              <rect x="32" y="8" width="8" height="8" rx="1" fill="#E8175D"/>
              <rect x="4" y="28" width="16" height="16" rx="2" stroke="#E8175D" strokeWidth="2" fill="none"/>
              <rect x="8" y="32" width="8" height="8" rx="1" fill="#E8175D"/>
              <text x="36" y="42" textAnchor="middle" fontSize="14" fill="#E8175D" opacity="0.8">♪</text>
              <rect x="28" y="28" width="5" height="5" rx="1" fill="#1B4F9B" opacity="0.7"/>
              <rect x="35" y="28" width="5" height="5" rx="1" fill="#1B4F9B" opacity="0.4"/>
              <rect x="28" y="35" width="12" height="5" rx="1" fill="#1B4F9B" opacity="0.6"/>
            </svg>
          </button>

          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#E8175D", letterSpacing: "0.25em", fontFamily: "'Russo One', sans-serif" }}
          >
            Escanear QR Bingo
          </span>
        </div>
      )}

      <p className="text-sm text-center" style={{ color: "rgba(0,0,0,0.25)" }}>
        Previews de 30 segundos · Funciona para todos
      </p>

      <button
        onClick={onCancel}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(0,0,0,0.25)" }}
      >
        ← Cambiar modo
      </button>
    </div>
  );
};
