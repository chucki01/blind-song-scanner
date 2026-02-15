import React from "react";

interface ReadyToPlayProps {
  onStart: () => void;
  onCancel: () => void;
}

export const ReadyToPlay: React.FC<ReadyToPlayProps> = ({
  onStart,
  onCancel,
}) => (
  <div className="bg-black flex flex-col items-center justify-center p-6 min-h-[70vh]">
    <div className="flex flex-col items-center max-w-md w-full">
      <div className="text-7xl mb-8">🎵</div>
      
      <h2 className="text-[#1DB954] text-3xl font-bold mb-6 text-center">
        ¡Listo para jugar!
      </h2>

      <div className="bg-gray-900 border-2 border-[#1DB954] rounded-xl p-6 mb-8 w-full">
        <p className="text-yellow-400 text-base font-bold text-center mb-4">
          📱 INSTRUCCIONES:
        </p>
        <ol className="text-gray-300 text-sm space-y-3">
          <li className="flex gap-3">
            <span className="text-[#1DB954] font-bold">1.</span>
            <span>Toca el botón verde</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1DB954] font-bold">2.</span>
            <span><strong className="text-white">¡GIRA EL MÓVIL BOCA ABAJO!</strong></span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1DB954] font-bold">3.</span>
            <span>La canción empezará automáticamente</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1DB954] font-bold">4.</span>
            <span>Escucha 30 segundos sin mirar 😉</span>
          </li>
        </ol>
      </div>

      <button
        onClick={onStart}
        className="bg-[#1DB954] text-black font-bold py-5 px-12 rounded-full hover:bg-[#1ed760] transition-all text-xl transform hover:scale-105 active:scale-95 shadow-2xl shadow-[#1DB954]/30 mb-4 w-full"
      >
        ▶️ Empezar
      </button>

      <button
        onClick={onCancel}
        className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
      >
        Cancelar
      </button>
    </div>
  </div>
);
