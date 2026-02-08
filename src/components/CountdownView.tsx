import React, { useEffect, useState } from "react";

interface CountdownViewProps {
  onComplete: () => void;
}

export const CountdownView: React.FC<CountdownViewProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="bg-black flex flex-col items-center justify-center p-4 min-h-[60vh]">
      <div className="flex flex-col items-center max-w-md">
        <div className="text-6xl mb-6 animate-bounce">🔄</div>
        <h2 className="text-[#1DB954] text-3xl font-bold mb-4 text-center">
          ¡DA LA VUELTA AL MÓVIL!
        </h2>
        
        <div className="relative my-8">
          <div 
            className="text-9xl font-bold text-[#1DB954] animate-pulse"
            style={{
              textShadow: '0 0 30px rgba(29, 185, 84, 0.5)',
            }}
          >
            {count}
          </div>
        </div>

        <p className="text-white text-xl text-center mb-2">
          Se abrirá Spotify automáticamente
        </p>
        <p className="text-gray-400 text-center">
          📱 Gira el teléfono boca abajo ahora
        </p>
        
        <div className="mt-8 text-gray-500 text-sm text-center">
          (Así no verás el nombre de la canción)
        </div>
      </div>
    </div>
  );
};
