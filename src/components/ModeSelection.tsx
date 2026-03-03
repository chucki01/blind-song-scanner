import React from "react";

interface ModeSelectionProps {
  onSelectNormal: () => void;
  onSelectBingo: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  onSelectNormal,
  onSelectBingo,
}) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto">

    {/* Animated QR icon */}
    <div className="relative flex items-center justify-center mb-10">
      {/* Pulse rings */}
      <div className="absolute w-40 h-40 rounded-full border border-[#CAFF00]/10 ring-pulse" />
      <div className="absolute w-56 h-56 rounded-full border border-[#CAFF00]/07 ring-pulse" />
      <div className="absolute w-72 h-72 rounded-full border border-[#CAFF00]/05 ring-pulse" />

      {/* QR Box */}
      <div
        className="relative w-28 h-28 rounded-2xl flex items-center justify-center animate-float"
        style={{
          background: "rgba(202,255,0,0.08)",
          border: "1.5px solid rgba(202,255,0,0.25)",
          animation: "acidPulse 2.5s ease-in-out infinite, floatY 3s ease-in-out infinite",
        }}
      >
        <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16">
          {/* Top-left corner */}
          <rect x="6" y="6" width="22" height="22" rx="3" stroke="#CAFF00" strokeWidth="2.5" fill="none"/>
          <rect x="11" y="11" width="12" height="12" rx="1.5" fill="#CAFF00"/>
          {/* Top-right corner */}
          <rect x="52" y="6" width="22" height="22" rx="3" stroke="#CAFF00" strokeWidth="2.5" fill="none"/>
          <rect x="57" y="11" width="12" height="12" rx="1.5" fill="#CAFF00"/>
          {/* Bottom-left corner */}
          <rect x="6" y="52" width="22" height="22" rx="3" stroke="#CAFF00" strokeWidth="2.5" fill="none"/>
          <rect x="11" y="57" width="12" height="12" rx="1.5" fill="#CAFF00"/>
          {/* Center music note */}
          <text x="40" y="46" textAnchor="middle" fontSize="18" fill="#CAFF00" opacity="0.9">♪</text>
          {/* Data dots */}
          <rect x="35" y="6" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.7"/>
          <rect x="42" y="6" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.4"/>
          <rect x="35" y="13" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.5"/>
          <rect x="42" y="13" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.8"/>
          <rect x="35" y="52" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.6"/>
          <rect x="42" y="52" width="10" height="5" rx="1" fill="#CAFF00" opacity="0.5"/>
          <rect x="35" y="59" width="10" height="5" rx="1" fill="#CAFF00" opacity="0.7"/>
          <rect x="52" y="35" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.6"/>
          <rect x="59" y="35" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.9"/>
          <rect x="66" y="35" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.4"/>
          <rect x="52" y="42" width="10" height="5" rx="1" fill="#CAFF00" opacity="0.7"/>
          <rect x="66" y="42" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.5"/>
        </svg>
      </div>
    </div>

    {/* Subtitle */}
    <p
      className="text-sm font-bold tracking-widest uppercase mb-8 text-center"
      style={{ color: "rgba(245,242,235,0.3)" }}
    >
      Elige modo de juego
    </p>

    {/* Mode buttons */}
    <div className="flex flex-col gap-4 w-full">

      {/* Normal Mode */}
      <button
        onClick={onSelectNormal}
        className="w-full py-4 px-4 rounded-2xl text-black text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "#CAFF00",
          boxShadow: "0 8px 30px rgba(202,255,0,0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: "14px", fontWeight: "900", letterSpacing: "0px", color: "#000" }}>
              MODO NORMAL
            </div>
            <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(0,0,0,0.6)", marginTop: "2px" }}>
              Escanea · Escucha · Adivina
            </div>
          </div>
          <span style={{ fontSize: "20px", marginLeft: "6px" }}>📱</span>
        </div>
      </button>

      {/* Bingo Mode */}
      <button
        onClick={onSelectBingo}
        className="w-full py-5 px-5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "rgba(202,255,0,0.07)",
          border: "1.5px solid rgba(202,255,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: "16px", fontWeight: "900", letterSpacing: "0px", color: "#CAFF00" }}>
              MODO BINGO
            </div>
            <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(245,242,235,0.45)", marginTop: "2px" }}>
              Suenan canciones · Marca tu cartón
            </div>
          </div>
          <span style={{ fontSize: "24px", marginLeft: "8px" }}>🎯</span>
        </div>
      </button>
    </div>

    {/* Info note */}
    <div
      className="mt-8 rounded-xl p-4 w-full"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <p className="text-xs text-center leading-relaxed" style={{ color: "rgba(245,242,235,0.3)" }}>
        <span style={{ color: "#CAFF00" }}>Normal:</span> escanea el QR, suena la canción, ¡adivínala!
        {"  ·  "}
        <span style={{ color: "rgba(202,255,0,0.6)" }}>Bingo:</span> suenan canciones, márcalas en tu cartón
      </p>
    </div>
  </div>
);
