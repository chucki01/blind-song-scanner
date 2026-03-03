import React from "react";

interface FreeAccountPlayedViewProps {
  onScanAgain: () => void;
  onReset: () => void;
}

export const FreeAccountPlayedView: React.FC<FreeAccountPlayedViewProps> = ({ onScanAgain, onReset }) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">

    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
      style={{
        background: "rgba(202,255,0,0.08)",
        border: "2px solid rgba(202,255,0,0.25)",
        boxShadow: "0 0 40px rgba(202,255,0,0.1)",
      }}
    >
      ✅
    </div>

    <div className="text-center flex flex-col gap-2">
      <h2
        className="text-2xl tracking-wide"
        style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00", textShadow: "0 0 20px rgba(202,255,0,0.4)" }}
      >
        ¡REPRODUCIDA!
      </h2>
      <p className="text-sm" style={{ color: "rgba(245,242,235,0.4)", fontFamily: "Raleway, sans-serif" }}>
        La canción se ha abierto en Spotify.
      </p>
      <p className="text-sm font-bold" style={{ color: "rgba(245,242,235,0.5)", fontFamily: "Raleway, sans-serif" }}>
        ¡Ya puedes dar la vuelta al móvil! 😉
      </p>
    </div>

    <div
      className="w-full h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(202,255,0,0.2), transparent)" }}
    />

    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={onScanAgain}
        className="w-full py-4 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "#CAFF00",
          color: "#000",
          fontFamily: "'Russo One', sans-serif",
          fontSize: "14px",
          letterSpacing: "0.1em",
          boxShadow: "0 8px 30px rgba(202,255,0,0.2)",
        }}
      >
        → SIGUIENTE CANCIÓN
      </button>

      <button
        onClick={onReset}
        className="w-full py-3 rounded-2xl font-bold transition-all hover:opacity-70"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          color: "rgba(245,242,235,0.4)",
          fontFamily: "Raleway, sans-serif",
          fontSize: "13px",
        }}
      >
        Volver al inicio
      </button>
    </div>
  </div>
);
