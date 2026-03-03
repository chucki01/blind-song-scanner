import React from "react";

interface SongDoneProps {
  onNext: () => void;
  onReset: () => void;
}

export const SongDone: React.FC<SongDoneProps> = ({ onNext, onReset }) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">

    {/* Result badge */}
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{
          background: "rgba(202,255,0,0.08)",
          border: "2px solid rgba(202,255,0,0.25)",
          boxShadow: "0 0 40px rgba(202,255,0,0.1)",
        }}
      >
        🎯
      </div>

      <h2
        className="text-2xl tracking-wide text-center"
        style={{
          fontFamily: "'Russo One', sans-serif",
          color: "#CAFF00",
          textShadow: "0 0 20px rgba(202,255,0,0.4)",
        }}
      >
        ¡CANCIÓN LISTA!
      </h2>

      <p
        className="text-sm text-center leading-relaxed"
        style={{ color: "rgba(245,242,235,0.4)", fontFamily: "Raleway, sans-serif" }}
      >
        Da la vuelta al móvil para ver la respuesta
      </p>
    </div>

    {/* Divider */}
    <div
      className="w-full h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(202,255,0,0.2), transparent)" }}
    />

    {/* Question */}
    <div
      className="w-full rounded-2xl p-4 text-center"
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <p
        className="text-sm font-bold"
        style={{ color: "rgba(245,242,235,0.5)", fontFamily: "Raleway, sans-serif" }}
      >
        ¿Adivinaste la canción? 🎵
      </p>
    </div>

    {/* Action buttons */}
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={onNext}
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
        className="w-full py-3 rounded-2xl font-bold tracking-wide transition-all hover:opacity-70"
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
