import React from "react";

interface ScanButtonProps {
  onClick: () => void;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ onClick }) => (
  <div className="flex flex-col items-center gap-4">
    <button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-2xl transition-all hover:scale-[1.04] active:scale-[0.97]"
      style={{
        width: "140px",
        height: "140px",
        background: "rgba(232,23,93,0.07)",
        border: "1.5px solid rgba(232,23,93,0.25)",
        animation: "redPulse 2.5s ease-in-out infinite",
      }}
    >
      <span className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: "2px solid #E8175D", borderLeft: "2px solid #E8175D" }} />
      <span className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: "2px solid #E8175D", borderRight: "2px solid #E8175D" }} />
      <span className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: "2px solid #E8175D", borderLeft: "2px solid #E8175D" }} />
      <span className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: "2px solid #E8175D", borderRight: "2px solid #E8175D" }} />
      <span style={{ fontSize: "48px" }}>🎵</span>
    </button>

    <span
      className="text-xs font-bold tracking-widest uppercase"
      style={{ color: "#E8175D", letterSpacing: "0.25em", fontFamily: "'Russo One', sans-serif" }}
    >
      Escanear carta
    </span>
  </div>
);