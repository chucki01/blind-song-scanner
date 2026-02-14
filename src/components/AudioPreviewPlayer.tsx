import React, { useEffect, useRef } from "react";

interface AudioPreviewPlayerProps {
  previewUrl: string;
  onEnded: () => void;
  onError: () => void;
}

export const AudioPreviewPlayer: React.FC<AudioPreviewPlayerProps> = ({
  previewUrl,
  onEnded,
  onError,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error reproduciendo preview:", error);
        onError();
      });
    }
  }, [previewUrl]);

  return (
    <div className="bg-black flex flex-col items-center justify-center p-4 min-h-screen">
      <audio
        ref={audioRef}
        src={previewUrl}
        onEnded={onEnded}
        onError={onError}
      />
      
      <div className="flex flex-col items-center max-w-md">
        <div className="text-6xl mb-8 animate-pulse">
          🎵
        </div>
        
        <h2 className="text-[#1DB954] text-3xl font-bold mb-6 text-center">
          ¡Escuchando!
        </h2>
        
        <div className="relative w-64 h-64 mb-8">
          {/* Visualizador simple */}
          <div className="absolute inset-0 flex items-end justify-center gap-2">
            {[...Array(8)].map((_, i) => (
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

        <p className="text-gray-400 text-center">
          Móvil boca abajo - No veas la pantalla 😉
        </p>
      </div>
    </div>
  );
};
