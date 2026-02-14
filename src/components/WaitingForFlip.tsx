import React, { useEffect, useState } from "react";

interface WaitingForFlipProps {
  onFlipped: () => void;
  onCancel: () => void;
}

export const WaitingForFlip: React.FC<WaitingForFlipProps> = ({
  onFlipped,
  onCancel,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Detectar si el móvil está boca abajo
      // beta ~180 significa boca abajo
      const beta = event.beta || 0;
      
      if (Math.abs(beta) > 150) {
        if (!isFlipped) {
          console.log("¡Móvil girado! Reproduciendo...");
          setIsFlipped(true);
          onFlipped();
        }
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isFlipped, onFlipped]);

  return (
    <div className="bg-black flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="flex flex-col items-center max-w-md">
        <div className="text-8xl mb-8 animate-bounce">
          🔄
        </div>
        
        <h2 className="text-[#1DB954] text-4xl font-bold mb-6 text-center animate-pulse">
          ¡GIRA EL MÓVIL!
        </h2>
        
        <div className="my-8">
          <p className="text-white text-2xl text-center mb-4 font-bold">
            📱 Ponlo BOCA ABAJO
          </p>
          <p className="text-yellow-400 text-lg text-center">
            La música empezará automáticamente
          </p>
        </div>

        <div className="mt-8 bg-gray-900 rounded-lg p-6 border-2 border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            💡 Tip: Gira completamente el móvil<br />
            hasta que quede horizontal
          </p>
        </div>

        <button
          onClick={onCancel}
          className="mt-8 text-gray-500 hover:text-gray-300 transition-colors text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
