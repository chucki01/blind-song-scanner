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
      alert("Escanea un código QR de una playlist de Spotify");
    }
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="flex flex-col items-center max-w-md mb-8">
        <div className="text-6xl mb-6">🎲</div>
        <h2 className="text-purple-400 text-3xl font-bold mb-4 text-center">
          Modo Bingo
        </h2>
        <p className="text-white text-lg text-center mb-6">
          Escanea el QR de una playlist de Spotify
        </p>
        <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-purple-400 mb-6">
          <p className="text-gray-300 text-sm text-center">
            💡 <strong>Tip:</strong> Ve a Spotify → Playlist → Compartir → Código QR
          </p>
        </div>
      </div>

      <div className="w-full max-w-md rounded-lg overflow-hidden shadow-2xl shadow-purple-400/20 mb-6">
        <QrScanner
          onDecode={handleScan}
          onError={() => onError()}
          scanDelay={500}
          hideCount
          audio={false}
          constraints={{
            facingMode: "environment",
          }}
        />
      </div>

      <button
        onClick={onCancel}
        className="text-gray-500 hover:text-gray-300 transition-colors"
      >
        ← Volver a modos
      </button>
    </div>
  );
};
