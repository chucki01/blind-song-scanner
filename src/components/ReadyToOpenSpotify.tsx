import React from "react";

interface ReadyToOpenSpotifyProps {
  onOpenSpotify: () => void;
  onCancel: () => void;
}

export const ReadyToOpenSpotify: React.FC<ReadyToOpenSpotifyProps> = ({
  onOpenSpotify,
  onCancel,
}) => (
  <div className="bg-black flex flex-col items-center justify-center p-4 min-h-[60vh]">
    <div className="flex flex-col items-center max-w-md">
      <div className="text-6xl mb-6">🎵</div>
      <h2 className="text-[#1DB954] text-3xl font-bold mb-4 text-center">
        ¿Listo?
      </h2>
      
      <p className="text-white text-lg text-center mb-6">
        Al tocar el botón se abrirá Spotify.
      </p>
      
      <div className="bg-gray-900 border-2 border-[#1DB954] rounded-lg p-6 mb-8">
        <p className="text-yellow-400 text-sm font-bold text-center mb-3">
          📋 CÓMO FUNCIONA:
        </p>
        <ol className="text-gray-300 text-sm space-y-2 text-left">
          <li>1. Toca el botón verde abajo</li>
          <li>2. Verás countdown: 3...2...1</li>
          <li>3. <span className="text-[#1DB954] font-bold">¡GIRA EL MÓVIL BOCA ABAJO!</span></li>
          <li>4. Al llegar a 0, Spotify se abrirá</li>
          <li>5. Como el móvil está girado, no verás nada</li>
        </ol>
      </div>

      <button
        onClick={onOpenSpotify}
        className="bg-[#1DB954] text-black font-bold py-4 px-10 rounded-full hover:bg-[#1ed760] transition-all flex items-center gap-3 text-lg transform hover:scale-105 active:scale-95 shadow-lg mb-4 w-full max-w-xs"
      >
        <span className="text-2xl">▶️</span>
        ¡Empezar!
      </button>

      <button
        onClick={onCancel}
        className="text-gray-400 hover:text-white transition-colors"
      >
        Cancelar
      </button>
    </div>
  </div>
);
