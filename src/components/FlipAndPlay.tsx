import React, { useEffect, useRef } from "react";

interface FlipAndPlayProps {
  previewUrl: string;
  onEnded: () => void;
  onCancel: () => void;
}

export const FlipAndPlay: React.FC<FlipAndPlayProps> = ({ previewUrl, onEnded, onCancel }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Error reproduciendo:", e));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-8 min-h-[60vh]">
      <audio
        ref={audioRef}
        src={previewUrl}
        onEnded={onEnded}
        onError={() => { alert("Error reproduciendo. Intenta otra canción."); onCancel(); }}
      />

      <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
        style={{ background: "rgba(232,23,93,0.07)", border: "2px solid rgba(232,23,93,0.25)", boxShadow: "0 0 40px rgba(232,23,93,0.1)" }}>
        🎵
      </div>

      <h2 className="text-3xl tracking-wide"
        style={{ fontFamily: "'Russo One', sans-serif", color: "#E8175D" }}>
        ESCUCHANDO
      </h2>

      <div className="w-full rounded-2xl p-5"
        style={{ background: "#EFEFEF", border: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="flex items-center gap-1 h-14">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex-1 rounded-sm wave-bar"
              style={{ background: "#E8175D", height: `${30 + Math.random() * 70}%` }} />
          ))}
        </div>
      </div>

      <button onClick={onCancel}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(0,0,0,0.25)" }}>
        Cancelar
      </button>
    </div>
  );
};
