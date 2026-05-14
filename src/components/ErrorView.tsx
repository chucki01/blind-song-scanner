import React from "react";

interface ErrorViewProps {
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">

    <div
      className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
      style={{
        background: "rgba(232,23,93,0.07)",
        border: "2px solid rgba(232,23,93,0.2)",
        boxShadow: "0 0 40px rgba(232,23,93,0.08)",
      }}
    >
      ✕
    </div>

    <div className="text-center flex flex-col gap-2">
      <h2
        className="text-3xl tracking-wide"
        style={{ fontFamily: "'Russo One', sans-serif", color: "#E8175D" }}
      >
        QR INVÁLIDO
      </h2>
      <p className="text-base" style={{ color: "rgba(0,0,0,0.4)" }}>
        Este QR no es una canción de Spotify
      </p>
    </div>

    <div
      className="w-full h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(232,23,93,0.2), transparent)" }}
    />

    <div
      className="w-full rounded-2xl p-5"
      style={{ background: "#EFEFEF", border: "1px solid rgba(0,0,0,0.07)" }}
    >
      <p className="text-sm font-bold mb-3" style={{ color: "rgba(0,0,0,0.35)" }}>
        El QR debe ser de una canción:
      </p>
      <p className="text-sm font-mono" style={{ color: "#1B4F9B" }}>
        open.spotify.com/track/...
      </p>
    </div>

    <button
      onClick={onRetry}
      className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: "#E8175D",
        color: "#fff",
        fontFamily: "'Russo One', sans-serif",
        fontSize: "16px",
        letterSpacing: "0.1em",
        boxShadow: "0 8px 30px rgba(232,23,93,0.2)",
      }}
    >
      → INTENTAR DE NUEVO
    </button>
  </div>
);
