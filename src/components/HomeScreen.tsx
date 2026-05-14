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
      <div className="flex flex-col items-center gap-2">
        <h1
          className="tracking-tight leading-none"
          style={{ fontFamily: "'Russo One', sans-serif", fontSize: "clamp(3rem, 14vw, 4.5rem)" }}
        >
          <span style={{ color: "#111111" }}>SCAN</span>
          <span style={{ color: "#E8175D" }}>HITS</span>
        </h1>
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "#1B4F9B", letterSpacing: "0.22em", fontFamily: "Raleway, sans-serif" }}
        >
          Escanea · Escucha · Adivina
        </p>
      </div>

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
