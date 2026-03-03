import React from "react";

interface ScanButtonProps {
  onClick: () => void;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ onClick }) => (
  <div className="flex flex-col items-center gap-4">
    {/* Big pulsing QR scan button */}
    <button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-2xl transition-all hover:scale-[1.04] active:scale-[0.97]"
      style={{
        width: "140px",
        height: "140px",
        background: "rgba(202,255,0,0.08)",
        border: "1.5px solid rgba(202,255,0,0.25)",
        animation: "acidPulse 2.5s ease-in-out infinite",
      }}
    >
      {/* Corner brackets */}
      <span
        className="absolute top-3 left-3 w-5 h-5"
        style={{ borderTop: "2px solid #CAFF00", borderLeft: "2px solid #CAFF00" }}
      />
      <span
        className="absolute top-3 right-3 w-5 h-5"
        style={{ borderTop: "2px solid #CAFF00", borderRight: "2px solid #CAFF00" }}
      />
      <span
        className="absolute bottom-3 left-3 w-5 h-5"
        style={{ borderBottom: "2px solid #CAFF00", borderLeft: "2px solid #CAFF00" }}
      />
      <span
        className="absolute bottom-3 right-3 w-5 h-5"
        style={{ borderBottom: "2px solid #CAFF00", borderRight: "2px solid #CAFF00" }}
      />

      {/* Icon */}
      <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
        <rect x="8" y="8" width="8" height="8" rx="1" fill="#CAFF00"/>
        <rect x="28" y="4" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
        <rect x="32" y="8" width="8" height="8" rx="1" fill="#CAFF00"/>
        <rect x="4" y="28" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
        <rect x="8" y="32" width="8" height="8" rx="1" fill="#CAFF00"/>
        <text x="36" y="42" textAnchor="middle" fontSize="14" fill="#CAFF00" opacity="0.8">♪</text>
        <rect x="28" y="28" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.7"/>
        <rect x="35" y="28" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.4"/>
        <rect x="28" y="35" width="12" height="5" rx="1" fill="#CAFF00" opacity="0.6"/>
      </svg>
    </button>

    {/* Label */}
    <span
      className="text-xs font-bold tracking-widest uppercase"
      style={{ color: "#CAFF00", letterSpacing: "0.25em", fontFamily: "'Russo One', sans-serif" }}
    >
      Escanear carta
    </span>
  </div>
);
