import React from "react";

interface FreeAccountDoneProps {
  onScanAgain: () => void;
  onReset: () => void;
}

export const FreeAccountDone: React.FC<FreeAccountDoneProps> = ({
  onScanAgain,
  onReset,
}) => (
  <div className="bg-black flex flex-col items-center justify-center p-4">
    <div className="flex flex-col items-center max-w-md">
      <div className="text-6xl mb-6">✅</div>
      <h2 className="text-[#1DB954] text-2xl font-bold mb-4 text-center">
        Spotify Abierto
      </h2>
      <p className="text-gray-400 text-center mb-8">
        La canción debería estar sonando.
        <br />
        ¡Ya puedes dar la vuelta al móvil!
      </p>
    </div>
    <div className="flex flex-col gap-4 w-full max-w-md">
      <button
        onClick={onScanAgain}
        className="bg-[#1DB954] text-black font-bold py-4 px-8 rounded-full hover:bg-[#1ed760] transition-colors transform hover:scale-105 active:scale-95 w-full"
      >
        🎵 Siguiente canción
      </button>
      <button
        onClick={onReset}
        className="bg-gray-800 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-700 transition-colors w-full"
      >
        Volver al inicio
      </button>
    </div>
  </div>
);
