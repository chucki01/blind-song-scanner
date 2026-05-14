import React, { useEffect, useState } from "react";

interface HomeScreenProps {
  onStart: () => void;
  onInstructions: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onInstructions }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center gap-10 w-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {/* Logo */}
      <div className="relative flex items-center justify-center w-full">
        <div className="relative flex flex-col items-center gap-1 z-10">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-2"
            style={{
              background: "rgba(232,23,93,0.07)",
              border: "1.5px solid rgba(232,23,93,0.2)",
              animation: "redPulse 3s ease-in-out infinite",
              boxShadow: "0 0 60px rgba(232,23,93,0.07)",
            }}
          >
            <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="#E8175D" strokeWidth="2" fill="none"/>
              <rect x="8" y="8" width="8" height="8" rx="1" fill="#E8175D"/>
              <rect x="28" y="4" width="16" height="16" rx="2" stroke="#E8175D" strokeWidth="2" fill="none"/>
              <rect x="32" y="8" width="8" height="8" rx="1" fill="#E8175D"/>
              <rect x="4" y="28" width="16" height="16" rx="2" stroke="#E8175D" strokeWidth="2" fill="none"/>
              <rect x="8" y="32" width="8" height="8" rx="1" fill="#E8175D"/>
              <text x="36" y="42" textAnchor="middle" fontSize="14" fill="#E8175D" opacity="0.9">♪</text>
              <rect x="28" y="28" width="5" height="5" rx="1" fill="#1B4F9B" opacity="0.7"/>
              <rect x="35" y="28" width="5" height="5" rx="1" fill="#1B4F9B" opacity="0.4"/>
              <rect x="28" y="35" width="12" height="5" rx="1" fill="#1B4F9B" opacity="0.6"/>
            </svg>
          </div>

          <h1
            className="text-5xl tracking-tight leading-none"
            style={{ fontFamily: "'Russo One', sans-serif", color: "#111111" }}
          >
            SCAN
          </h1>
          <h1
            className="text-5xl tracking-tight leading-none"
            style={{ fontFamily: "'Russo One', sans-serif", color: "#E8175D" }}
          >
            HITS
          </h1>
        </div>
      </div>

      {/* Tagline */}
      <p
        className="text-center text-sm tracking-widest uppercase"
        style={{
          color: "#1B4F9B",
          fontFamily: "Raleway, sans-serif",
          letterSpacing: "0.25em",
          fontWeight: 700,
        }}
      >
        Escanea · Escucha · Adivina
      </p>

      {/* Botón JUGAR */}
      <button
        onClick={onStart}
        className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.03] active:scale-[0.97]"
        style={{
          background: "#E8175D",
          color: "#fff",
          fontFamily: "'Russo One', sans-serif",
          fontSize: "18px",
          letterSpacing: "0.15em",
          boxShadow: "0 8px 40px rgba(232,23,93,0.3)",
        }}
      >
        ▶ JUGAR
      </button>

      {/* Botón cómo se juega */}
      <button
        onClick={onInstructions}
        className="w-full py-4 rounded-2xl font-bold tracking-wide transition-all hover:opacity-80"
        style={{
          background: "rgba(27,79,155,0.06)",
          border: "1px solid rgba(27,79,155,0.15)",
          color: "#1B4F9B",
          fontFamily: "'Russo One', sans-serif",
          fontSize: "14px",
          letterSpacing: "0.1em",
        }}
      >
        CÓMO SE JUEGA
      </button>
    </div>
  );
};
