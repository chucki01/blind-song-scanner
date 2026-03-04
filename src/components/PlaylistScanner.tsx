import React from "react";
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
  const handleScan = (result: string) => {
    if (result?.includes("open.spotify.com/playlist/")) {
      onPlaylistScanned(result);
    } else {
      alert("Escanea el QR de una playlist de Spotify");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">

      {/* Header */}
      <div className="text-center">
        <h2
          className="text-3xl tracking-wide mb-1"
          style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00" }}
        >
          MODO BINGO
        </h2>
        <p className="text-base" style={{ color: "rgba(245,242,235,0.4)" }}>
          Escanea el QR de tu playlist
        </p>
      </div>

      {/* QR Scanner */}
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid rgba(202,255,0,0.2)", boxShadow: "0 0 40px rgba(202,255,0,0.08)" }}
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

      {/* Hint */}
      <p className="text-sm text-center" style={{ color: "rgba(245,242,235,0.25)" }}>
        Spotify → Playlist → Compartir → Código QR
      </p>

      {/* Back */}
      <button
        onClick={onCancel}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.25)" }}
      >
        ← Volver a modos
      </button>
    </div>
  );
};
