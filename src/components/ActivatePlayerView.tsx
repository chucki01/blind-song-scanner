import React from "react";

interface ActivatePlayerViewProps {
  onActivate: () => void;
}

export const ActivatePlayerView: React.FC<ActivatePlayerViewProps> = ({
  onActivate,
}) => (
  <div className="bg-black flex flex-col items-center justify-center p-4">
    <div className="flex flex-col items-center max-w-md">
      <div className="text-6xl mb-6">🎵</div>
      <h2 className="text-white text-2xl font-bold mb-4 text-center">
        Activar Reproductor
      </h2>
      <p className="text-gray-400 text-center mb-8">
        Para usar la aplicación en Android, necesitas activar el reproductor de
        Spotify primero.
      </p>
      <button
        onClick={onActivate}
        className="bg-[#1DB954] text-black font-bold py-4 px-10 rounded-full hover:bg-[#1ed760] transition-all flex items-center gap-3 text-lg transform hover:scale-105 active:scale-95 shadow-lg"
      >
        <span className="text-2xl">🔊</span>
        Activar Reproductor
      </button>
      <p className="text-gray-500 text-sm text-center mt-6">
        Solo necesitas hacer esto una vez
      </p>
    </div>
  </div>
);
