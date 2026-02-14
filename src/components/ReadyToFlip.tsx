import React, { useState } from "react";

interface ReadyToFlipProps {
  onReady: () => void;
  onCancel: () => void;
  isFree: boolean;
}

export const ReadyToFlip: React.FC<ReadyToFlipProps> = ({
  onReady,
  onCancel,
  isFree,
}) => {
  const [requesting, setRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);

    // En iOS 13+, necesitamos solicitar permiso explícito
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          onReady();
        } else {
          alert('Se necesita permiso para usar el giroscopio');
          setRequesting(false);
        }
      } catch (error) {
        console.error('Error solicitando permiso:', error);
        setRequesting(false);
      }
    } else {
      // Android y otros no necesitan permiso explícito
      onReady();
    }
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center p-4 min-h-[70vh]">
      <div className="flex flex-col items-center max-w-md">
        <div className="text-6xl mb-6">📱</div>
        <h2 className="text-[#1DB954] text-3xl font-bold mb-4 text-center">
          ¡Prepárate!
        </h2>
        
        {isFree && (
          <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm text-center">
              💡 Cuenta Free: Escucharás 30 segundos
            </p>
          </div>
        )}

        <div className="bg-gray-900 border-2 border-[#1DB954] rounded-lg p-6 mb-8">
          <p className="text-yellow-400 text-sm font-bold text-center mb-3">
            📋 CÓMO JUGAR:
          </p>
          <ol className="text-gray-300 text-sm space-y-2 text-left">
            <li>1. Toca el botón verde abajo</li>
            <li>2. <span className="text-[#1DB954] font-bold">¡GIRA EL MÓVIL BOCA ABAJO!</span></li>
            <li>3. La canción empezará automáticamente</li>
            <li>4. Como está boca abajo, no verás nada 😉</li>
            <li>5. Escucha y adivina la canción</li>
          </ol>
        </div>

        <button
          onClick={handleRequestPermission}
          disabled={requesting}
          className="bg-[#1DB954] text-black font-bold py-4 px-10 rounded-full hover:bg-[#1ed760] transition-all flex items-center gap-3 text-lg transform hover:scale-105 active:scale-95 shadow-lg mb-4 w-full max-w-xs disabled:opacity-50"
        >
          <span className="text-2xl">🔄</span>
          {requesting ? 'Preparando...' : '¡Listo!'}
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
};
