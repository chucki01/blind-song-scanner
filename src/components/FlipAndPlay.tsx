import React, { useEffect, useRef, useState } from "react";

interface FlipAndPlayProps {
  previewUrl: string;
  onEnded: () => void;
  onCancel: () => void;
}

export const FlipAndPlay: React.FC<FlipAndPlayProps> = ({ previewUrl, onEnded, onCancel }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta || 0;
      if (Math.abs(beta) > 150 && !isFlipped) {
        setIsFlipped(true);
        if (audioRef.current && !isPlaying) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((e) => console.error("Error reproduciendo:", e));
        }
      }
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [isFlipped, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-8 min-h-[60vh]">
      <audio
        ref={audioRef}
        src={previewUrl}
        onEnded={onEnded}
        onError={() => { alert("Error reproduciendo. Intenta otra canción."); onCancel(); }}
      />

      {!isFlipped ? (
        <>
          <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-7xl"
            style={{ background: "rgba(202,255,0,0.08)", border: "1.5px solid rgba(202,255,0,0.25)", animation: "acidPulse 1.5s ease-in-out infinite" }}>
            🔄
          </div>
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-5xl tracking-wide"
              style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00", textShadow: "0 0 30px rgba(202,255,0,0.4)" }}>
              ¡GIRA!
            </h2>
            <p className="text-xl font-bold" style={{ color: "rgba(245,242,235,0.7)" }}>
              Pon el móvil boca abajo
            </p>
            <p className="text-base" style={{ color: "rgba(245,242,235,0.4)" }}>
              La música empieza automáticamente
            </p>
          </div>
          <div className="w-full rounded-2xl p-4 text-center"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-sm font-bold" style={{ color: "rgba(245,242,235,0.3)" }}>
              💡 Gira completamente hasta que quede horizontal
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{ background: "rgba(202,255,0,0.08)", border: "2px solid rgba(202,255,0,0.3)", boxShadow: "0 0 40px rgba(202,255,0,0.15)" }}>
            🎵
          </div>
          <div className="text-center">
            <h2 className="text-3xl tracking-wide mb-2"
              style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00" }}>
              ESCUCHANDO
            </h2>
            <p className="text-base" style={{ color: "rgba(245,242,235,0.35)" }}>
              Móvil boca abajo · No mires 😉
            </p>
          </div>
          <div className="w-full rounded-2xl p-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-1 h-14">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-sm wave-bar"
                  style={{ background: "#CAFF00", height: `${30 + Math.random() * 70}%` }} />
              ))}
            </div>
          </div>
        </>
      )}

      <button onClick={onCancel}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.25)" }}>
        Cancelar
      </button>
    </div>
  );
};
