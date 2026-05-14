import React, { useEffect, useRef } from "react";

interface FlipAndPlayProps {
  audio: HTMLAudioElement;
  onEnded: () => void;
  onCancel: () => void;
}

export const FlipAndPlay: React.FC<FlipAndPlayProps> = ({ audio, onEnded, onCancel }) => {
  useEffect(() => {
    // El audio ya está sonando (lo arrancó WaitingForFlip), solo conectamos los eventos
    audio.onended = onEnded;
    audio.onerror = () => { alert("Error reproduciendo. Intenta otra canción."); onCancel(); };

    return () => {
      audio.onended = null;
      audio.onerror = null;
    };
  }, [audio, onEnded, onCancel]);

  const handleCancel = () => {
    audio.pause();
    audio.currentTime = 0;
    onCancel();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-8 min-h-[60vh]">
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

      <button onClick={handleCancel}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(0,0,0,0.25)" }}>
        Cancelar
      </button>
    </div>
  );
};
