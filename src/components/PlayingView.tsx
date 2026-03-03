import React from "react";
import { PlayerControls } from "./PlayerControls";

interface PlayingViewProps {
  onReset: () => void;
  onScanAgain: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const PlayingView: React.FC<PlayingViewProps> = ({
  onReset,
  onScanAgain,
  isPlaying,
  onPlayPause,
}) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">

    {/* Now playing card */}
    <div
      className="w-full rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Glow top right */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(202,255,0,0.08) 0%, transparent 70%)" }}
      />

      <p
        className="text-xs font-bold tracking-widest uppercase mb-4"
        style={{ color: "rgba(245,242,235,0.3)", fontFamily: "Raleway, sans-serif" }}
      >
        {isPlaying ? "▶ Sonando ahora" : "⏸ Pausado"}
      </p>

      {/* Waveform */}
      <div className="flex items-center gap-1 h-10 mb-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm wave-bar ${!isPlaying ? "opacity-30" : ""}`}
            style={{
              background: "#CAFF00",
              height: `${30 + Math.random() * 70}%`,
              transform: "scaleY(0.5)",
            }}
          />
        ))}
      </div>
    </div>

    {/* Player controls */}
    <div
      className="w-full rounded-2xl p-5 flex flex-col items-center gap-4"
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <PlayerControls isPlaying={isPlaying} onPlayPause={onPlayPause} />
    </div>

    {/* Scan again button */}
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
      → ESCANEAR OTRA
    </button>

    {/* Reset link */}
    <button
      onClick={onReset}
      className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
      style={{ color: "rgba(245,242,235,0.25)", fontFamily: "Raleway, sans-serif" }}
    >
      Volver al inicio
    </button>
  </div>
);
