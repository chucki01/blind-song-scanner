import React from "react";

interface SongDoneProps {
  onNext: () => void;
  onReset: () => void;
}

export const SongDone: React.FC<SongDoneProps> = ({ onNext, onReset }) => (
  <div className="bg-black flex flex-col items-center justify-center p-6 min-h-[60vh]">
    <div className="flex flex-col items-center max-w-md w-full mb-8">
      <div className="text-8xl mb-6">✅</div>
      
      <h2 className="text-[#1DB954] text-3xl font-bold mb-4 text-center">
        ¡Canción Reproducida!
      </h2>
      
      <p className="text-gray-400 text-center mb-3">
        Ya puedes dar la vuelta al móvil
      </p>
      
      <p className="text-yellow-400 text-lg text-center font-bold">
        ¿Adivinaste la canción? 🎵
      </p>
    </div>
    
    <div className="flex flex-col gap-4 w-full max-w-md">
      <button
        onClick={onNext}
        className="bg-[#1DB954] text-black font-bold py-5 px-8 rounded-full hover:bg-[#1ed760] transition-all transform hover:scale-105 active:scale-95 shadow-xl text-lg"
      >
        🎵 Siguiente canción
      </button>
      
      <button
        onClick={onReset}
        className="bg-gray-800 text-white font-bold py-4 px-8 rounded-full hover:bg-gray-700 transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  </div>
);
