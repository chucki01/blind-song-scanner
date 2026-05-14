import React, { useState } from "react";

interface ReadyToFlipProps {
  onReady: (audio: HTMLAudioElement) => void;
  onCancel: () => void;
  isFree: boolean;
  previewUrl: string;
}

export const ReadyToFlip: React.FC<ReadyToFlipProps> = ({ onReady, onCancel, isFree, previewUrl }) => {
  const [requesting, setRequesting] = useState(false);

  const handlePlay = async () => {
    setRequesting(true);
    const audio = new Audio(previewUrl);
    audio.load();
    try {
      await audio.play();
    } catch (e) {
      console.error("Error reproduciendo:", e);
      setRequesting(false);
      return;
    }
    onReady(audio);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-8">
      <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
        style={{ background: "rgba(232,23,93,0.07)", border: "1.5px solid rgba(232,23,93,0.2)", animation: "redPulse 2.5s ease-in-out infinite" }}>
        🎵
      </div>
      <div className="text-center">
        <h2 className="text-3xl tracking-wide mb-1"
          style={{ fontFamily: "'Russo One', sans-serif", color: "#E8175D" }}>
          ¡PREPÁRATE!
        </h2>
        {isFree && (
          <p className="text-sm font-bold mt-2" style={{ color: "rgba(0,194,255,0.7)" }}>
            Cuenta Free · 30 segundos de preview
          </p>
        )}
        <p className="text-sm mt-3" style={{ color: "rgba(0,0,0,0.35)" }}>
          Pulsa el botón y adivina la canción
        </p>
      </div>

      <button onClick={handlePlay} disabled={requesting}
        className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        style={{ background: "#E8175D", color: "#fff", fontFamily: "'Russo One', sans-serif", fontSize: "18px", letterSpacing: "0.15em", boxShadow: "0 8px 30px rgba(232,23,93,0.2)" }}>
        {requesting ? "CARGANDO..." : "▶ ESCUCHAR"}
      </button>

      <button onClick={onCancel}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(0,0,0,0.25)" }}>
        Cancelar
      </button>
    </div>
  );
};
