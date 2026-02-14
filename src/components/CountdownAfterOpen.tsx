import React, { useEffect, useState } from "react";

interface CountdownAfterOpenProps {
  onComplete: () => void;
}

export const CountdownAfterOpen: React.FC<CountdownAfterOpenProps> = ({ onComplete }) => {
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
    <div className="bg-black flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="flex flex-col items-center max-w-md">
        <div className="text-6xl mb-6 animate-bounce">🔄</div>
        <h2 className="text-[#1DB954] text-4xl font-bold mb-6 text-center animate-pulse">
          ¡GIRA EL MÓVIL!
        </h2>
        
        <div className="relative my-8">
          <div 
            className="text-9xl font-bold text-[#1DB954] animate-pulse"
            style={{
              textShadow: '0 0 40px rgba(29, 185, 84, 0.8)',
            }}
          >
            {count}
          </div>
        </div>

        <p className="text-white text-2xl text-center mb-4 font-bold">
          ¡DALE LA VUELTA YA!
        </p>
        <p className="text-yellow-400 text-lg text-center">
          📱 Boca abajo AHORA
        </p>
        
        <div className="mt-8 text-gray-400 text-sm text-center">
          Spotify se está cargando...
        </div>
      </div>
    </div>
  );
};
