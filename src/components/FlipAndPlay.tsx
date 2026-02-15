import React, { useEffect, useRef, useState } from "react";

interface FlipAndPlayProps {
  previewUrl: string;
  onEnded: () => void;
  onCancel: () => void;
}

export const FlipAndPlay: React.FC<FlipAndPlayProps> = ({
  previewUrl,
  onEnded,
  onCancel,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta || 0;
      
      // Detectar móvil boca abajo (beta ~180)
      if (Math.abs(beta) > 150 && !isFlipped) {
        console.log("¡Móvil girado! Beta:", beta);
        setIsFlipped(true);
        
        // Reproducir audio
        if (audioRef.current && !isPlaying) {
          audioRef.current.play()
            .then(() => {
              console.log("Preview reproduciendo");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error reproduciendo:", error);
            });
        }
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isFlipped, isPlaying]);

  return (
    <div className="bg-black flex flex-col items-center justify-center p-4 min-h-screen">
      <audio
        ref={audioRef}
        src={previewUrl}
        onEnded={onEnded}
        onError={() => {
          console.error("Error en audio");
          alert("Error reproduciendo. Intenta otra canción.");
          onCancel();
        }}
      />
      
      {!isFlipped ? (
        // Esperando que gire el móvil
        <div className="flex flex-col items-center max-w-md">
          <div className="text-9xl mb-8 animate-bounce">
            🔄
          </div>
          
          <h2 className="text-[#1DB954] text-5xl font-bold mb-8 text-center animate-pulse">
            ¡GIRA!
          </h2>
          
          <div className="text-white text-2xl text-center mb-6 font-bold">
            📱 PON EL MÓVIL<br/>BOCA ABAJO
          </div>
          
          <p className="text-yellow-400 text-lg text-center mb-8">
            La canción empezará automáticamente
          </p>

          <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-700">
            <p className="text-gray-400 text-sm text-center">
              💡 Gira completamente hasta<br/>
              que quede horizontal
            </p>
          </div>

          <button
            onClick={onCancel}
            className="mt-8 text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      ) : (
        // Reproduciendo
        <div className="flex flex-col items-center max-w-md">
          <div className="text-8xl mb-8 animate-pulse">
            🎵
          </div>
          
          <h2 className="text-[#1DB954] text-4xl font-bold mb-6 text-center">
            ¡Escuchando!
          </h2>
          
          {/* Visualizador de audio */}
          <div className="relative w-72 h-40 mb-8">
            <div className="absolute inset-0 flex items-end justify-center gap-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 bg-gradient-to-t from-[#1DB954] to-[#1ed760] rounded-full"
                  style={{
                    height: `${30 + Math.random() * 70}%`,
                    animation: `pulse 0.${5 + i}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>

          <p className="text-gray-400 text-center text-lg">
            Móvil boca abajo<br/>
            <span className="text-yellow-400">No mires la pantalla 😉</span>
          </p>
        </div>
      )}
    </div>
  );
};
