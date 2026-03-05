import React from "react";

interface SongDoneProps {
  onNext: () => void;
  onReset: () => void;
}

export const SongDone: React.FC<SongDoneProps> = ({ onNext, onReset }) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-8">
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
        style={{ background: "rgba(202,255,0,0.08)", border: "2px solid rgba(202,255,0,0.25)", boxShadow: "0 0 40px rgba(202,255,0,0.1)" }}>
        🎯
      </div>
      <h2 className="text-3xl tracking-wide text-center"
        style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00", textShadow: "0 0 20px rgba(202,255,0,0.4)" }}>
        ¡CANCIÓN LISTA!
      </h2>
    </div>

    <div className="flex flex-col gap-3 w-full">
      <button onClick={onNext}
        className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "#CAFF00", color: "#000", fontFamily: "'Russo One', sans-serif", fontSize: "16px", letterSpacing: "0.1em", boxShadow: "0 8px 30px rgba(202,255,0,0.2)" }}>
        → SIGUIENTE CANCIÓN
      </button>
      <button onClick={onReset}
        className="w-full py-4 rounded-2xl font-bold transition-all hover:opacity-70"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(245,242,235,0.4)", fontSize: "15px" }}>
        Volver al inicio
      </button>
    </div>
  </div>
);
