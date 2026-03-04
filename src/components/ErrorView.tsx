import React from "react";

interface ErrorViewProps {
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">

    {/* Icon */}
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
      style={{
        background: "rgba(255,45,120,0.08)",
        border: "2px solid rgba(255,45,120,0.25)",
        boxShadow: "0 0 40px rgba(255,45,120,0.1)",
      }}
    >
      ✕
    </div>

    {/* Title */}
    <div className="text-center flex flex-col gap-2">
      <h2
        className="text-3xl tracking-wide"
        style={{ fontFamily: "'Russo One', sans-serif", color: "#FF2D78", textShadow: "0 0 20px rgba(255,45,120,0.4)" }}
      >
        QR INVÁLIDO
      </h2>
      <p className="text-base" style={{ color: "rgba(245,242,235,0.4)" }}>
        Este QR no es una canción de Spotify
      </p>
    </div>

    {/* Divider */}
    <div
      className="w-full h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(255,45,120,0.2), transparent)" }}
    />

    {/* Info card */}
    <div
      className="w-full rounded-2xl p-5"
      style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-sm font-bold mb-3" style={{ color: "rgba(245,242,235,0.3)" }}>
        El QR debe ser de una canción:
      </p>
      <p className="text-sm font-mono" style={{ color: "rgba(202,255,0,0.5)" }}>
        open.spotify.com/track/...
      </p>
    </div>

    {/* Button */}
    <button
      onClick={onRetry}
      className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: "#CAFF00",
        color: "#000",
        fontFamily: "'Russo One', sans-serif",
        fontSize: "16px",
        letterSpacing: "0.1em",
        boxShadow: "0 8px 30px rgba(202,255,0,0.2)",
      }}
    >
      → INTENTAR DE NUEVO
    </button>
  </div>
);
