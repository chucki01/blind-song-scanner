import React from "react";

interface ModeSelectionProps {
  onSelectNormal: () => void;
  onSelectBingo: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  onSelectNormal,
  onSelectBingo,
}) => (
  <div className="bg-black flex flex-col items-center justify-center p-6 min-h-[70vh]">
    <div className="flex flex-col items-center max-w-md w-full">
      <div className="text-8xl mb-8">🎵</div>
      
      <h2 className="text-[#1DB954] text-4xl font-bold mb-4 text-center">
        Blind Song Scanner
      </h2>
      
      <p className="text-gray-400 text-center mb-12 text-lg">
        Elige cómo quieres jugar
      </p>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        {/* Modo Normal */}
        <div 
          onClick={onSelectNormal}
          className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] text-black font-bold py-8 px-6 rounded-2xl hover:scale-105 transition-all cursor-pointer shadow-2xl shadow-[#1DB954]/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black">Modo Normal</span>
              <span className="text-sm opacity-80 mt-1">
                Escanea un código QR
              </span>
            </div>
            <div className="text-4xl">📱</div>
          </div>
        </div>

        {/* Modo Bingo */}
        <div 
          onClick={onSelectBingo}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-8 px-6 rounded-2xl hover:scale-105 transition-all cursor-pointer shadow-2xl shadow-purple-600/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black">Modo Bingo</span>
              <span className="text-sm opacity-80 mt-1">
                Playlist completa
              </span>
            </div>
            <div className="text-4xl">🎲</div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-900 rounded-xl p-4 border-l-4 border-[#1DB954]">
        <p className="text-gray-300 text-sm text-center">
          <strong className="text-[#1DB954]">Modo Normal:</strong> Escanea códigos QR individuales
          <br />
          <strong className="text-purple-400">Modo Bingo:</strong> Juega con playlists completas
        </p>
      </div>
    </div>
  </div>
);
